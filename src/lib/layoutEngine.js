import { scalePoint, range } from 'd3';

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 */
export function maxRowHeight(allNodes, row) {
	return Math.max(...allNodes.filter((d) => d.row === row).map((d) => d.rectH));
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} height
 */
export function buildYScale(allNodes, numCols, height) {
	const lastRowH = maxRowHeight(allNodes, numCols - 1);
	const firstRowH = maxRowHeight(allNodes, 0);
	return scalePoint()
		.domain(range(numCols))
		.range([firstRowH / 2, height - lastRowH / 2])
		.padding(0);
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} width
 * @param {number} height
 * @param {number} gap
 */
export function computeLayout(allNodes, numCols, width, height, gap) {
	const yScale = buildYScale(allNodes, numCols, height);
	for (const row of range(numCols)) {
		const rowNodes = allNodes.filter((d) => d.row === row);
		const totalNodeW = rowNodes.reduce((s, d) => s + d.bbox.width, 0);
		const PAD = 8;
		const usable = width - 2 * PAD - totalNodeW;
		const spacing =
			rowNodes.length > 1 ? Math.max(usable / (rowNodes.length - 1), 0) : 0;
		let cursor = PAD;
		for (const d of rowNodes) {
			d.x = cursor + d.bbox.width / 2;
			cursor += d.bbox.width + spacing;
		}
		const rowTop = yScale(row) - maxRowHeight(allNodes, row) / 2;
		for (const d of rowNodes) {
			d.y = rowTop - d.rectY;
		}
	}
}
