import { select } from 'd3';
import { wrapText } from './textUtils.js';

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
			return { row, label, lines, memberRanges };
		})
	);
}

export function measureNodes(allNodes, svgGroup, lineH, padX, padY) {
	const measure = svgGroup.append('g').attr('class', 'measure').attr('opacity', 0);

	measure
		.selectAll('g')
		.data(allNodes)
		.join('g')
		.each(function (d) {
			const multiLine = d.lines.length > 1;
			const el = select(this)
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
			d.rectW = b.width + padX * 2;
			d.rectH = b.height + padY * 2;
			d.rectY = b.y - padY;
		});

	measure.remove();
}

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
