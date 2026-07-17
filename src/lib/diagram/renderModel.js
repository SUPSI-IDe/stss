/**
 * @param {string} text
 * @param {number} maxWidth
 * @param {(text: string) => number} measureWidth
 */
export function wrapToWidth(text, maxWidth, measureWidth) {
	const words = text.trim().split(/\s+/).filter(Boolean);
	if (!words.length) return [''];
	const lines = [];
	let current = '';

	/** @param {string} word */
	const pushWord = (word) => {
		if (measureWidth(word) <= maxWidth) {
			current = word;
			return;
		}
		let part = '';
		for (const character of word) {
			if (part && measureWidth(part + character) > maxWidth) {
				lines.push(part);
				part = character;
			} else {
				part += character;
			}
		}
		current = part;
	};

	for (const word of words) {
		if (!current) {
			pushWord(word);
			continue;
		}
		const candidate = `${current} ${word}`;
		if (measureWidth(candidate) <= maxWidth) current = candidate;
		else {
			lines.push(current);
			current = '';
			pushWord(word);
		}
	}
	if (current) lines.push(current);
	return lines;
}

/**
 * @param {import('../types').NodeData} node
 * @param {(text: string) => number} measureWidth
 * @param {{ lineHeight: number, badgePad: number, badgeSize: number, pagePlusDiameter: number }} options
 * @returns {import('../types').NodeRenderModel}
 */
export function buildNodeRenderModel(node, measureWidth, options) {
	const { lineHeight, badgePad, badgeSize, pagePlusDiameter } = options;
	const lineCount = node.lineData.length;
	if (!lineCount) return { lineRects: [], tspans: [], badges: [] };
	const textBlockHeight = (lineCount - 1) * lineHeight;
	const startY = -textBlockHeight / 2;
	const startX = -node.rectW / 2;
	const lineRectHeight = node.rectH / lineCount;
	/** @type {import('../types').NodeRenderModel} */
	const render = { lineRects: [], tspans: [], badges: [] };

	node.lineData.forEach((line, index) => {
		render.lineRects.push({
			x: startX,
			y: node.rectY + index * lineRectHeight,
			width: line.width,
			height: lineRectHeight
		});
		let x = startX;
		const y = startY + index * lineHeight;
		for (const segment of line.segments) {
			if (segment.tooltip) x += badgePad;
			render.tspans.push({ x, y, text: segment.text });
			x += measureWidth(segment.text);
			if (segment.tooltip) {
				x += badgePad;
				render.badges.push({
					x,
					y: y + 14 * 0.35 - badgeSize + 2,
					tooltip: segment.tooltip
				});
				x += badgeSize + badgePad;
			}
		}
		if (index === 0 && node.hasPage) {
			x += badgePad;
			render.tspans.push({ x: x + pagePlusDiameter / 2, y, text: '+', plus: true });
		}
	});
	return render;
}

/** @param {import('../types').NodeData[]} nodes */
export function cloneNodes(nodes) {
	return nodes.map((node) => ({
		...node,
		bbox: { ...node.bbox },
		memberRanges: node.memberRanges ? new Map(node.memberRanges) : null,
		lineData: node.lineData.map((line) => ({
			...line,
			segments: line.segments.map((segment) => ({ ...segment }))
		}))
	}));
}
