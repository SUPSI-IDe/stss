/**
 * Find the arc length along a polyline closest to a point.
 * @param {{ corners: [number, number][], cumLengths: number[], totalLength: number }} polyline
 * @param {number} x
 * @param {number} y
 */
export function nearestLengthOnPolyline(polyline, x, y) {
	const { corners, cumLengths } = polyline;
	if (corners.length < 2) return 0;
	let bestLength = 0;
	let bestDistance = Infinity;
	for (let index = 0; index < corners.length - 1; index += 1) {
		const [startX, startY] = corners[index];
		const [endX, endY] = corners[index + 1];
		const deltaX = endX - startX;
		const deltaY = endY - startY;
		const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY;
		const projection = segmentLengthSquared > 0
			? Math.max(0, Math.min(1, ((x - startX) * deltaX + (y - startY) * deltaY) / segmentLengthSquared))
			: 0;
		const closestX = startX + projection * deltaX;
		const closestY = startY + projection * deltaY;
		const distanceSquared = (closestX - x) ** 2 + (closestY - y) ** 2;
		if (distanceSquared < bestDistance) {
			bestDistance = distanceSquared;
			bestLength = cumLengths[index] + projection * (cumLengths[index + 1] - cumLengths[index]);
		}
	}
	return bestLength;
}
