import { clusterLeft, findNode, nodeOrigin } from './nodeAnchors.js';
import { assignLaneOffsets } from './laneAssignment.js';
import {
	MIN_CORNER_RADIUS,
	buildRoundedOrthoPath,
	cornerLaneOffset,
	segmentOffsetVector,
	turnSign
} from './pathPrimitives.js';

export { clusterLeft, findNode, memberYOffset, nodeOrigin } from './nodeAnchors.js';
export { nearestLengthOnPolyline } from './polyline.js';

/**
 * @param {import('../../types').NodeData[]} allNodes
 * @param {import('../../types').Flow[]} uniqueFlows
 * @param {(colIdx: number, label: string) => boolean} isClusterNodeFn
 * @param {import('../../types').LayoutOpts} opts
 */
export function createFlowPathGenerator(allNodes, uniqueFlows, isClusterNodeFn, opts) {
	const { lineH, clusterPadLeft, cornerR, stubLen } = opts;

	// Phase 1: build raw points and midY overrides per flow (same logic as before).
	const flowData = uniqueFlows.map((f) => {
		/** @type {[number, number][]} */
		const pts = [];
		/** @type {Record<number, number>} */
		const midYOverrides = {};
		/** Set of input-pts segment indices `i` (segment goes pts[i-1] to pts[i]) that are cluster stubs. */
		const stubSegments = new Set();
		let lastClusterBottomY = /** @type {number | null} */ (null);
		let pendingClusterExit = false;

		f.path.forEach((label, i) => {
			const isCNode = isClusterNodeFn(i, label);
			const rawVal = isCNode ? f.rawClusterVals.get(i) ?? null : null;

			if (i > 0) {
				if (isCNode) {
					const clusterNode = findNode(allNodes, i, label);
					if (!clusterNode) throw new Error('cluster node missing');
					const clusterTopY = clusterNode.y + clusterNode.rectY;
					midYOverrides[pts.length - 1] = (pts[pts.length - 1][1] + clusterTopY) / 2;
					const lp = clusterLeft(allNodes, i, label, rawVal, clusterPadLeft, lineH);
					pts.push(lp);
					pts.push([lp[0] + stubLen, lp[1]]);
					stubSegments.add(pts.length - 1); // segment lp to lp+stub
				} else {
					if (pendingClusterExit && lastClusterBottomY !== null) {
						const targetTopY = nodeOrigin(allNodes, i, label)[1];
						midYOverrides[pts.length - 1] = (lastClusterBottomY + targetTopY) / 2;
						pendingClusterExit = false;
					}
					pts.push(nodeOrigin(allNodes, i, label));
				}
			}
			if (i < f.path.length - 1) {
				if (isCNode) {
					const lp = clusterLeft(allNodes, i, label, rawVal, clusterPadLeft, lineH);
					pts.push([lp[0] + stubLen, lp[1]]);
					pts.push(lp);
					stubSegments.add(pts.length - 1); // segment lp+stub to lp
					const clusterNode = findNode(allNodes, i, label);
					if (!clusterNode) throw new Error('cluster node missing');
					lastClusterBottomY = clusterNode.y + clusterNode.rectY + clusterNode.rectH;
					pendingClusterExit = true;
				} else {
					pts.push(nodeOrigin(allNodes, i, label));
				}
			}
		});

		return { flow: f, pts, midYOverrides, stubSegments };
	});

	// Phase 2: expand each flow into pure h/v segments by resolving doglegs at midY.
	const flowExpanded = flowData.map(({ flow, pts, midYOverrides, stubSegments }, flowIdx) => {
		/** @type {[number, number][]} */
		const corners = pts.length > 0 ? [[pts[0][0], pts[0][1]]] : [];
		/** @type {{type: 'v' | 'h', stub?: boolean}[]} */
		const segments = [];
		for (let i = 1; i < pts.length; i++) {
			const [x1, y1] = pts[i - 1];
			const [x2, y2] = pts[i];
			if (x1 === x2 && y1 === y2) continue;
			const isStub = stubSegments.has(i);
			if (x1 === x2) {
				corners.push([x2, y2]);
				segments.push({ type: 'v', stub: isStub });
			} else if (y1 === y2) {
				corners.push([x2, y2]);
				segments.push({ type: 'h', stub: isStub });
			} else {
				const midY = midYOverrides[i - 1] ?? (y1 + y2) / 2;
				corners.push([x1, midY]);
				segments.push({ type: 'v' });
				corners.push([x2, midY]);
				segments.push({ type: 'h' });
				corners.push([x2, y2]);
				segments.push({ type: 'v' });
			}
		}
		return { flow, flowIdx, corners, segments };
	});

	// Phase 3: collision detection: cluster segments by shared x (verticals) or
	// shared y (horizontals) that also overlap along the perpendicular axis.
	/** @type {{ flow: import('../../types').Flow, flowIdx: number, segIdx: number, type: 'v' | 'h', coord: number, lo: number, hi: number }[]} */
	const allSegs = [];
	flowExpanded.forEach(({ flow, flowIdx, corners, segments }) => {
		segments.forEach((seg, segIdx) => {
			// The stub itself stays put (its tip is pinned to the cluster member),
			// but the verticals feeding into it may lane-offset so flows sharing a
			// cluster's attachment corridor stay visually separated. The offset only
			// shifts the outer turn, so the stub still lands on the member.
			if (seg.stub) return;
			const [x1, y1] = corners[segIdx];
			const [x2, y2] = corners[segIdx + 1];
			if (seg.type === 'v') {
				allSegs.push({
					flow,
					flowIdx,
					segIdx,
					type: 'v',
					coord: x1,
					lo: Math.min(y1, y2),
					hi: Math.max(y1, y2),
				});
			} else {
				allSegs.push({
					flow,
					flowIdx,
					segIdx,
					type: 'h',
					coord: y1,
					lo: Math.min(x1, x2),
					hi: Math.max(x1, x2),
				});
			}
		});
	});

	const offsets = assignLaneOffsets(allSegs);

	// Phase 4: apply offsets per corner. Offsets are applied along each
	// segment's travel normal, then adjacent offset segments are intersected at
	// corners. This keeps the lane order consistent through left- and right-turns.
	/** @type {Map<import('../../types').Flow, string>} */
	const finalPathD = new Map();
	/**
	 * Per-flow polyline used for fast nearest-point queries on hover.
	 * Corners are deduped and `cumLengths[i]` is the arc length from the start
	 * to `corners[i]` along the polyline (rounded-corner shortening is ignored;
	 * with CORNER_R=6 the discrepancy is sub-pixel-per-corner).
	 * @type {Map<import('../../types').Flow, { corners: [number, number][], cumLengths: number[], totalLength: number }>}
	 */
	const finalPolyline = new Map();

	flowExpanded.forEach(({ flow, flowIdx, corners, segments }) => {
		/** @type {[number, number][]} */
		const adjusted = [];
		/** @type {Map<number, number>} */
		const cornerRadii = new Map();

		corners.forEach((c, cornerIdx) => {
			const [x, y] = c;
			const incoming = cornerIdx > 0 ? segments[cornerIdx - 1] : null;
			const outgoing = cornerIdx < segments.length ? segments[cornerIdx] : null;
			const incomingOff = incoming ? offsets.get(`${flowIdx}-${cornerIdx - 1}`) ?? 0 : 0;
			const outgoingOff = outgoing ? offsets.get(`${flowIdx}-${cornerIdx}`) ?? 0 : 0;
			const incomingVec = incoming
				? segmentOffsetVector(
						corners[cornerIdx - 1],
						c,
						incomingOff
					)
				: [0, 0];
			const outgoingVec = outgoing
				? segmentOffsetVector(
						c,
						corners[cornerIdx + 1],
						outgoingOff
					)
				: [0, 0];

			let dx = incoming ? incomingVec[0] : outgoingVec[0];
			let dy = incoming ? incomingVec[1] : outgoingVec[1];

			if (incoming && outgoing) {
				if (incoming.type === 'v') dx = incomingVec[0];
				else if (outgoing.type === 'v') dx = outgoingVec[0];

				if (incoming.type === 'h') dy = incomingVec[1];
				else if (outgoing.type === 'h') dy = outgoingVec[1];
			}

			if (incoming && outgoing) {
				const sign = turnSign(corners[cornerIdx - 1], c, corners[cornerIdx + 1]);
				const laneOff = cornerLaneOffset(incomingOff, outgoingOff);
				if (sign !== 0 && laneOff !== 0) {
					cornerRadii.set(
						cornerIdx,
						Math.max(MIN_CORNER_RADIUS, cornerR + sign * laneOff)
					);
				}
			}

			adjusted.push([x + dx, y + dy]);
		});

		// Any corner adjacent to a stub segment must stay sharp.
		/** @type {Set<number>} */
		const sharpCorners = new Set();
		segments.forEach((seg, segIdx) => {
			if (seg.stub) {
				sharpCorners.add(segIdx);
				sharpCorners.add(segIdx + 1);
			}
		});

		finalPathD.set(flow, buildRoundedOrthoPath(adjusted, sharpCorners, cornerR, cornerRadii));

		const dedup = adjusted.length > 0 ? [adjusted[0]] : [];
		for (let i = 1; i < adjusted.length; i++) {
			const [px, py] = dedup[dedup.length - 1];
			const [cx, cy] = adjusted[i];
			if (px !== cx || py !== cy) dedup.push(adjusted[i]);
		}
		const cumLengths = [0];
		for (let i = 1; i < dedup.length; i++) {
			const [px, py] = dedup[i - 1];
			const [cx, cy] = dedup[i];
			cumLengths.push(cumLengths[i - 1] + Math.hypot(cx - px, cy - py));
		}
		finalPolyline.set(flow, {
			corners: dedup,
			cumLengths,
			totalLength: cumLengths[cumLengths.length - 1] ?? 0,
		});
	});

	return {
		pathD: (/** @type {import('../../types').Flow} */ f) => finalPathD.get(f) ?? '',
		polyline: (/** @type {import('../../types').Flow} */ f) => finalPolyline.get(f),
	};
}
