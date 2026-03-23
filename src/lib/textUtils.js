export function wrapText(text, limit) {
	const words = text.split(' ');
	const lines = [];
	let cur = words[0];
	for (let i = 1; i < words.length; i++) {
		if (cur.length + 1 + words[i].length <= limit) {
			cur += ' ' + words[i];
		} else {
			lines.push(cur);
			cur = words[i];
		}
	}
	lines.push(cur);
	return lines;
}

export function createTextMeasurer(fontSpec) {
	const ctx = document.createElement('canvas').getContext('2d');
	ctx.font = fontSpec;
	return (str) => ctx.measureText(str).width;
}

export function createSegmenter(tooltipMap) {
	const entries = [...tooltipMap.entries()].sort((a, b) => b[0].length - a[0].length);

	return function segmentLine(line) {
		const segments = [];
		let remaining = line;
		while (remaining.length > 0) {
			let earliestMatch = null;
			let earliestIndex = remaining.length;
			for (const [term, data] of entries) {
				const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const regex = new RegExp('\\b' + escaped + '\\b', 'i');
				const match = remaining.match(regex);
				if (match && match.index < earliestIndex) {
					earliestIndex = match.index;
					earliestMatch = { data, index: match.index, matchText: match[0] };
				}
			}
			if (earliestMatch) {
				if (earliestMatch.index > 0) {
					segments.push({ text: remaining.slice(0, earliestMatch.index), tooltip: null });
				}
				segments.push({ text: earliestMatch.matchText, tooltip: earliestMatch.data });
				remaining = remaining.slice(earliestMatch.index + earliestMatch.matchText.length);
			} else {
				segments.push({ text: remaining, tooltip: null });
				remaining = '';
			}
		}
		return segments;
	};
}
