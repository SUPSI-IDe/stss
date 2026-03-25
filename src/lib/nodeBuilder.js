import { select } from 'd3';
import { wrapText } from './textUtils.js';

/**
 * @param {string[][]} layers
 * @param {(row: number, label: string) => boolean} isClusterNodeFn
 * @param {number} maxLine
 * @returns {import('./types').NodeData[]}
 */
export function buildAllNodes(layers, isClusterNodeFn, maxLine) {
	return layers.flatMap((labels, row) =>
		labels.map((label) => {
			let lines, memberRanges;
			if (isClusterNodeFn(row, label)) {
				const members = label.split(', ');
				lines = [];
				memberRanges = new Map();
				for (const m of members) {
					const start = lines.length;
					lines.push(...wrapText(m, maxLine));
					memberRanges.set(m, { start, end: lines.length - 1 });
				}
			} else {
				lines = wrapText(label, maxLine);
				memberRanges = null;
			}
			return {
				row,
				label,
				lines,
				memberRanges,
				// placeholders filled by measureNodes later
				bbox: { x: 0, y: 0, width: 0, height: 0 },
				rectW: 0,
				rectH: 0,
				rectY: 0,
				x: 0,
				y: 0,
				segmentedLines: []
			};
		})
	);
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {any} svgGroup
 * @param {number} lineH
 * @param {number} padY
 */
export function measureNodes(allNodes, svgGroup, lineH, padY) {
	const measure = svgGroup.append('g').attr('class', 'measure').attr('opacity', 0);

	measure
		.selectAll('g')
		.data(allNodes)
		.join('g')
		.each(function (
			/** @type {import('./types').NodeData} */ d,
			/** @type {number} */ i,
			/** @type {SVGGElement[]} */ nodes
		) {
			const multiLine = d.lines.length > 1;
			const el = select(nodes[i])
				.append('text')
				.attr('text-anchor', multiLine ? 'start' : 'middle')
				.attr('font-size', 14);

			const textBlockH = (d.lines.length - 1) * lineH;
			const startY = -textBlockH / 2;

			d.lines.forEach((line, i) => {
				el.append('tspan')
					.text(line)
					.attr('x', 0)
					.attr('y', startY + i * lineH)
					.attr('dy', '0.35em');
			});

			const b = el.node().getBBox();
			d.bbox = { x: b.x, y: b.y, width: b.width, height: b.height };
			d.rectW = b.width;
			d.rectH = b.height + padY * 2;
			d.rectY = b.y - padY;
		});

	measure.remove();
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} badgePad
 * @param {number} badgeSize
 */
export function adjustBadgeWidths(allNodes, badgePad, badgeSize) {
	allNodes.forEach((d) => {
		let maxBadgeExtra = 0;
		d.segmentedLines.forEach((segments) => {
			let extra = 0;
			segments.forEach((seg) => {
				if (seg.tooltip) extra += badgePad * 2 + badgeSize;
			});
			maxBadgeExtra = Math.max(maxBadgeExtra, extra);
		});
		d.bbox.width += maxBadgeExtra;
		d.rectW += maxBadgeExtra;
	});
}
