import { wrapText } from './textUtils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

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
				lineData: []
			};
		})
	);
}

/**
 * Measures each node's wrapped text against the live DOM (so measurement
 * inherits the real CSS) and records its bbox-derived rect metrics.
 * @param {import('./types').NodeData[]} allNodes
 * @param {SVGSVGElement} svgEl an attached, rendered SVG element to measure within
 * @param {number} lineH
 * @param {number} padY
 */
export function measureNodes(allNodes, svgEl, lineH, padY) {
	const measure = document.createElementNS(SVG_NS, 'g');
	measure.setAttribute('opacity', '0');
	svgEl.appendChild(measure);

	for (const d of allNodes) {
		const multiLine = d.lines.length > 1;
		const text = document.createElementNS(SVG_NS, 'text');
		text.setAttribute('text-anchor', multiLine ? 'start' : 'middle');
		text.setAttribute('font-size', '14');

		const textBlockH = (d.lines.length - 1) * lineH;
		const startY = -textBlockH / 2;

		d.lines.forEach((line, i) => {
			const tspan = document.createElementNS(SVG_NS, 'tspan');
			tspan.textContent = line;
			tspan.setAttribute('x', '0');
			tspan.setAttribute('y', String(startY + i * lineH));
			tspan.setAttribute('dy', '0.35em');
			text.appendChild(tspan);
		});

		measure.appendChild(text);

		const b = text.getBBox();
		d.bbox = { x: b.x, y: b.y, width: b.width, height: b.height };
		d.rectW = b.width;
		d.rectH = b.height + padY * 2;
		d.rectY = b.y - padY;
	}

	measure.remove();
}
