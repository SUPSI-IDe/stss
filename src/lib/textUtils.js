/**
 * @param {string} text
 * @param {number} limit
 */
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

/** Compound phrases where a tooltip term should not split the phrase mid-word */
const COMPOUND_PHRASES = ['personal experience'];

/**
 * @param {Map<string, import('./types').TooltipData>} tooltipMap
 */
export function createSegmenter(tooltipMap) {
	// Compile each term's word-boundary regex once; longest terms first so a
	// longer phrase wins over a substring at the same position.
	const entries = [...tooltipMap.entries()]
		.sort((a, b) => b[0].length - a[0].length)
		.map(([term, data]) => ({
			data,
			regex: new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i')
		}));

	/** @param {string} line */
	return function segmentLine(line) {
		/** @type {import('./types').Segment[]} */
		const segments = [];
		let remaining = line;
		while (remaining.length > 0) {
			let earliestMatch = null;
			let earliestIndex = remaining.length;
			for (const { data, regex } of entries) {
				const match = remaining.match(regex);
				const matchIndex = match?.index;
				if (match && matchIndex != null && matchIndex < earliestIndex) {
					// Skip if this match would split a compound phrase
					const lower = remaining.toLowerCase();
					const skip = COMPOUND_PHRASES.some((phrase) => {
						const pi = lower.indexOf(phrase);
						return pi !== -1 && matchIndex >= pi && matchIndex < pi + phrase.length;
					});
					if (skip) continue;
					earliestIndex = matchIndex;
					earliestMatch = { data, index: matchIndex, matchText: match[0] };
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
