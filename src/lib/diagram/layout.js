import { COLS, MARGIN, ROW_GUIDE_LABELS } from '../constants.js';
import { computeLayout } from '../layoutEngine.js';
import {
	DIAGRAM_LEFT_OFFSET,
	MOBILE_ROOT_ROW,
	MOBILE_ROW_ARROW_RISE,
	MOBILE_ROW_LABEL_INDENT,
	ROW_ARROW_HEIGHT,
	ROW_GUIDE_LABEL_GAP,
	ROW_GUIDE_TOP_INSET
} from './config.js';

/**
 * @param {{
 *  measured: import('../types').NodeData[],
 *  mobileMeasured: import('../types').NodeData[] | null,
 *  visibleKeys: Set<string>,
 *  isMobile: boolean,
 *  width: number,
 *  height: number,
 *  anchorY: number,
 *  nodeKey: (row: number, label: string) => string
 * }} input
 */
export function positionNodes(input) {
	const { measured, mobileMeasured, visibleKeys, isMobile, width, height, anchorY, nodeKey } = input;
	if (!measured.length || width <= 0) return [];
	const source = isMobile && mobileMeasured ? mobileMeasured : measured;
	const nodes = source.map((node) => ({ ...node }));
	const layoutNodes = isMobile
		? nodes.filter((node) => visibleKeys.has(nodeKey(node.row, node.label)))
		: nodes;
	const availableWidth = width - MARGIN.left - MARGIN.right;
	const layoutHeight = Math.max(0, height - ROW_GUIDE_TOP_INSET);
	const leftOffset = isMobile ? 0 : DIAGRAM_LEFT_OFFSET;
	computeLayout(layoutNodes, COLS.length, Math.max(0, availableWidth - leftOffset), layoutHeight, {
		fitRowsByHeight: isMobile,
		anchorRow: isMobile ? MOBILE_ROOT_ROW : undefined,
		anchorY: isMobile ? anchorY : undefined
	});
	for (const node of layoutNodes) {
		node.y += ROW_GUIDE_TOP_INSET;
		node.x += leftOffset;
	}
	return layoutNodes;
}

/** @param {import('../types').NodeData[]} nodes @param {boolean} isMobile */
export function buildRowGuideLabels(nodes, isMobile) {
	const labels = [];
	for (let row = 0; row < COLS.length; row += 1) {
		if (ROW_GUIDE_LABELS[row] == null) continue;
		const rowNodes = nodes.filter((node) => node.row === row);
		if (!rowNodes.length) continue;
		const rowTop = Math.min(...rowNodes.map((node) => node.y + node.rectY));
		labels.push({
			row,
			x: isMobile ? MOBILE_ROW_LABEL_INDENT : 0,
			y: rowTop - ROW_GUIDE_LABEL_GAP,
			label: ROW_GUIDE_LABELS[row] ?? ''
		});
	}
	return labels;
}

/** @param {import('../types').NodeData[]} nodes @param {boolean} isMobile @param {number} lineHeight */
export function buildRowArrows(nodes, isMobile, lineHeight) {
	const arrows = [];
	for (let row = 0; row < COLS.length; row += 1) {
		const rowNodes = nodes.filter((node) => node.row === row);
		if (!rowNodes.length) continue;
		const rowTop = Math.min(...rowNodes.map((node) => node.y + node.rectY));
		const y = isMobile
			? rowTop - ROW_GUIDE_LABEL_GAP - MOBILE_ROW_ARROW_RISE
			: Math.min(
					...rowNodes.map((node) => node.y - ((node.lineData.length - 1) * lineHeight) / 2)
				) - ROW_ARROW_HEIGHT / 2;
		arrows.push({ row, x: 0, y });
	}
	return arrows;
}
