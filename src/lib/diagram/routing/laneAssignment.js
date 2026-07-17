import { laneOffsetForIndex } from './pathPrimitives.js';

/**
 * @typedef {{
 *  flow: import('../../types').Flow,
 *  flowIdx: number,
 *  segIdx: number,
 *  type: 'v' | 'h',
 *  coord: number,
 *  lo: number,
 *  hi: number
 * }} RoutedSegment
 */

/** @param {RoutedSegment[]} segments */
export function assignLaneOffsets(segments) {
	/** @type {Map<string, number>} */
	const offsets = new Map();
	for (const type of /** @type {const} */ (['v', 'h'])) {
		/** @type {Map<number, RoutedSegment[]>} */
		const byCoordinate = new Map();
		for (const segment of segments.filter((candidate) => candidate.type === type)) {
			const bucket = byCoordinate.get(segment.coord);
			if (bucket) bucket.push(segment);
			else byCoordinate.set(segment.coord, [segment]);
		}

		for (const group of byCoordinate.values()) {
			if (group.length < 2) continue;
			group.sort((left, right) => left.lo - right.lo);
			/** @type {RoutedSegment[][]} */
			const clusters = [];
			let current = [group[0]];
			let currentHigh = group[0].hi;
			for (let index = 1; index < group.length; index += 1) {
				if (group[index].lo < currentHigh) {
					current.push(group[index]);
					currentHigh = Math.max(currentHigh, group[index].hi);
				} else {
					if (current.length > 1) clusters.push(current);
					current = [group[index]];
					currentHigh = group[index].hi;
				}
			}
			if (current.length > 1) clusters.push(current);

			for (const cluster of clusters) {
				/** @type {{ active: { group: number, hi: number }[] }[]} */
				const lanes = [];
				/** @type {{ segment: RoutedSegment, laneIndex: number }[]} */
				const assignments = [];
				for (const segment of cluster) {
					let laneIndex = -1;
					for (let index = 0; index < lanes.length; index += 1) {
						lanes[index].active = lanes[index].active.filter((active) => active.hi > segment.lo);
						if (!lanes[index].active.some((active) => active.group !== segment.flow.group)) {
							laneIndex = index;
							break;
						}
					}
					if (laneIndex === -1) {
						laneIndex = lanes.length;
						lanes.push({ active: [] });
					}
					lanes[laneIndex].active.push({ group: segment.flow.group, hi: segment.hi });
					assignments.push({ segment, laneIndex });
				}
				for (const { segment, laneIndex } of assignments) {
					const offset = laneOffsetForIndex(laneIndex, lanes.length);
					if (offset !== 0) offsets.set(`${segment.flowIdx}-${segment.segIdx}`, offset);
				}
			}
		}
	}
	return offsets;
}
