import { LAYOUT_SIDE_PADDING } from './constants.js';

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 */
export function maxRowHeight(allNodes, row) {
	return Math.max(0, ...allNodes.filter((d) => d.row === row).map((d) => d.rectH));
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
 * Spaces rows with equal gaps while accounting for each row's rendered height.
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} height
 * @returns {(row: number) => number}
 */
export function buildHeightFittedYScale(allNodes, numCols, height) {
	const rowHeights = Array.from({ length: numCols }, (_, row) => maxRowHeight(allNodes, row));
	const totalRowHeight = rowHeights.reduce((sum, rowHeight) => sum + rowHeight, 0);
	const gap = numCols > 1 ? Math.max(0, (height - totalRowHeight) / (numCols - 1)) : 0;
	/** @type {number[]} */
	const centers = [];
	let cursor = 0;
	for (let row = 0; row < numCols; row += 1) {
		centers[row] = cursor + rowHeights[row] / 2;
		cursor += rowHeights[row] + gap;
	}
	return (row) => centers[row] ?? 0;
}

/**
 * Pins one row to a fixed vertical center, then fits the rows above and below
 * independently into their respective halves of the available height.
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} height
 * @param {number} anchorRow
 * @param {number} anchorY
 * @returns {(row: number) => number}
 */
export function buildAnchoredHeightFittedYScale(
	allNodes,
	numCols,
	height,
	anchorRow,
	anchorY
) {
	const rowHeights = Array.from({ length: numCols }, (_, row) => maxRowHeight(allNodes, row));
	const safeAnchorRow = Math.max(0, Math.min(numCols - 1, anchorRow));
	const anchorHalfHeight = rowHeights[safeAnchorRow] / 2;
	const safeAnchorY = Math.max(
		anchorHalfHeight,
		Math.min(Math.max(anchorHalfHeight, height - anchorHalfHeight), anchorY)
	);
	/** @type {number[]} */
	const centers = [];
	centers[safeAnchorRow] = safeAnchorY;

	const upperHeights = rowHeights.slice(0, safeAnchorRow);
	const upperHeight = upperHeights.reduce((sum, rowHeight) => sum + rowHeight, 0);
	const upperSpace = safeAnchorY - anchorHalfHeight;
	const upperGap = safeAnchorRow > 0 ? Math.max(0, (upperSpace - upperHeight) / safeAnchorRow) : 0;
	let upperBoundary = safeAnchorY - anchorHalfHeight;
	for (let row = safeAnchorRow - 1; row >= 0; row -= 1) {
		upperBoundary -= upperGap;
		centers[row] = upperBoundary - rowHeights[row] / 2;
		upperBoundary -= rowHeights[row];
	}

	const lowerHeights = rowHeights.slice(safeAnchorRow + 1);
	const lowerHeight = lowerHeights.reduce((sum, rowHeight) => sum + rowHeight, 0);
	const lowerCount = numCols - safeAnchorRow - 1;
	const lowerSpace = height - safeAnchorY - anchorHalfHeight;
	const lowerGap = lowerCount > 0 ? Math.max(0, (lowerSpace - lowerHeight) / lowerCount) : 0;
	let lowerBoundary = safeAnchorY + anchorHalfHeight;
	for (let row = safeAnchorRow + 1; row < numCols; row += 1) {
		lowerBoundary += lowerGap;
		centers[row] = lowerBoundary + rowHeights[row] / 2;
		lowerBoundary += rowHeights[row];
	}

	return (row) => centers[row] ?? safeAnchorY;
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} numCols
 * @param {number} width
 * @param {number} height
 * @param {{ fitRowsByHeight?: boolean, anchorRow?: number, anchorY?: number }} [options]
 */
export function computeLayout(allNodes, numCols, width, height, options = {}) {
	const anchorRow = typeof options.anchorRow === 'number' ? options.anchorRow : null;
	const yScale = options.fitRowsByHeight
		? anchorRow !== null
			? buildAnchoredHeightFittedYScale(
					allNodes,
					numCols,
					height,
					anchorRow,
					options.anchorY ?? height / 2
				)
			: buildHeightFittedYScale(allNodes, numCols, height)
		: buildYScale(allNodes, numCols, height);
	for (let row = 0; row < numCols; row++) {
		const rowNodes = allNodes.filter((d) => d.row === row);
		const totalNodeW = rowNodes.reduce((s, d) => s + d.bbox.width, 0);
		const available = width - 2 * LAYOUT_SIDE_PADDING;
		const spacing =
			rowNodes.length > 1 ? (available - totalNodeW) / (rowNodes.length - 1) : 0;
		let cursor = LAYOUT_SIDE_PADDING;
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
