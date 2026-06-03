/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 */
export function maxRowHeight(allNodes, row) {
	return Math.max(...allNodes.filter((d) => d.row === row).map((d) => d.rectH));
}

/**
 * Evenly spaces `numCols` rows between the first/last row centers — the
 * d3 `scalePoint(...).padding(0)` this replaces is just linear spacing.
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} height
 * @returns {(row: number) => number}
 */
export function buildYScale(allNodes, numCols, height) {
	const lastRowH = maxRowHeight(allNodes, numCols - 1);
	const firstRowH = maxRowHeight(allNodes, 0);
	const start = firstRowH / 2;
	const stop = height - lastRowH / 2;
	if (numCols <= 1) return () => (start + stop) / 2;
	const step = (stop - start) / (numCols - 1);
	return (row) => start + step * row;
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} width
 * @param {number} height
 */
export function computeLayout(allNodes, numCols, width, height) {
	const yScale = buildYScale(allNodes, numCols, height);
	for (let row = 0; row < numCols; row++) {
		const rowNodes = allNodes.filter((d) => d.row === row);
		const totalNodeW = rowNodes.reduce((s, d) => s + d.bbox.width, 0);
		const PAD = 8;
		const available = width - 2 * PAD;
		const spacing =
			rowNodes.length > 1 ? (available - totalNodeW) / (rowNodes.length - 1) : 0;
		let cursor = PAD;
		if (rowNodes.length === 1) {
			rowNodes[0].x = width / 2;
		} else {
			for (const d of rowNodes) {
				d.x = cursor + d.bbox.width / 2;
				cursor += d.bbox.width + spacing;
			}
		}
		const rowTop = yScale(row) - maxRowHeight(allNodes, row) / 2;
		for (const d of rowNodes) {
			d.y = rowTop - d.rectY;
		}
	}
}
