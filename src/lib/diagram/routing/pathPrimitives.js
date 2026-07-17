export const VISIBLE_FLOW_STROKE_WIDTH = 2;
export const FLOW_LANE_GAP = 2;
export const LANE_PAD = VISIBLE_FLOW_STROKE_WIDTH + FLOW_LANE_GAP;
export const MIN_CORNER_RADIUS = LANE_PAD;

/**
 * @param {[number, number][]} points
 * @param {Set<number>} sharpCorners
 * @param {number} cornerRadius
 * @param {Map<number, number>} cornerRadii
 */
export function buildRoundedOrthoPath(points, sharpCorners, cornerRadius, cornerRadii = new Map()) {
	if (points.length < 2) return '';
	const filtered = [points[0]];
	const filteredSharp = new Set();
	const filteredRadii = new Map();
	if (sharpCorners.has(0)) filteredSharp.add(0);
	if (cornerRadii.has(0)) filteredRadii.set(0, cornerRadii.get(0));
	for (let index = 1; index < points.length; index += 1) {
		const [previousX, previousY] = filtered[filtered.length - 1];
		const [x, y] = points[index];
		if (previousX === x && previousY === y) continue;
		filtered.push(points[index]);
		if (sharpCorners.has(index)) filteredSharp.add(filtered.length - 1);
		if (cornerRadii.has(index)) filteredRadii.set(filtered.length - 1, cornerRadii.get(index));
	}
	if (filtered.length < 2) return '';

	let path = `M${filtered[0][0]},${filtered[0][1]}`;
	for (let index = 1; index < filtered.length - 1; index += 1) {
		const [previousX, previousY] = filtered[index - 1];
		const [x, y] = filtered[index];
		const [nextX, nextY] = filtered[index + 1];
		const incomingX = x - previousX;
		const incomingY = y - previousY;
		const outgoingX = nextX - x;
		const outgoingY = nextY - y;
		const incomingLength = Math.hypot(incomingX, incomingY);
		const outgoingLength = Math.hypot(outgoingX, outgoingY);
		if (
			incomingLength === 0 ||
			outgoingLength === 0 ||
			incomingX * outgoingY - incomingY * outgoingX === 0 ||
			filteredSharp.has(index)
		) {
			path += ` L${x},${y}`;
			continue;
		}
		const targetRadius = Math.max(0, filteredRadii.get(index) ?? cornerRadius);
		const radius = Math.min(targetRadius, incomingLength / 2, outgoingLength / 2);
		if (radius === 0) {
			path += ` L${x},${y}`;
			continue;
		}
		const startX = x - (incomingX / incomingLength) * radius;
		const startY = y - (incomingY / incomingLength) * radius;
		const endX = x + (outgoingX / outgoingLength) * radius;
		const endY = y + (outgoingY / outgoingLength) * radius;
		path += ` L${startX},${startY} Q${x},${y} ${endX},${endY}`;
	}
	const last = filtered[filtered.length - 1];
	return `${path} L${last[0]},${last[1]}`;
}

/** @param {[number, number]} from @param {[number, number]} to @param {number} offset @returns {[number, number]} */
export function segmentOffsetVector(from, to, offset) {
	if (offset === 0) return [0, 0];
	if (from[0] === to[0]) return [offset, 0];
	if (from[1] === to[1]) return [0, offset];
	return [0, 0];
}

/** @param {number} laneIndex @param {number} laneCount */
export function laneOffsetForIndex(laneIndex, laneCount) {
	return laneCount < 2 ? 0 : (laneIndex - (laneCount - 1) / 2) * LANE_PAD;
}

/** @param {[number, number]} previous @param {[number, number]} corner @param {[number, number]} next */
export function turnSign(previous, corner, next) {
	const incomingX = corner[0] - previous[0];
	const incomingY = corner[1] - previous[1];
	const outgoingX = next[0] - corner[0];
	const outgoingY = next[1] - corner[1];
	return Math.sign(incomingX * outgoingY - incomingY * outgoingX);
}

/** @param {number} incomingOffset @param {number} outgoingOffset */
export function cornerLaneOffset(incomingOffset, outgoingOffset) {
	if (incomingOffset !== 0 && outgoingOffset !== 0) return (incomingOffset + outgoingOffset) / 2;
	return incomingOffset || outgoingOffset;
}
