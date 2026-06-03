/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 */
export function findNode(allNodes, row, label) {
	return allNodes.find((n) => n.row === row && n.label === label);
}

/**
 * Anchor point a flow attaches to on a node — its center.
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 * @returns {[number, number]}
 */
export function nodeOrigin(allNodes, row, label) {
	const d = findNode(allNodes, row, label);
	if (!d) throw new Error('Node not found for nodeOrigin');
	return [d.x, d.y];
}

/**
 * @param {import('./types').NodeData} node
 * @param {string} member
 * @param {number} lineH
 */
export function memberYOffset(node, member, lineH) {
	if (!node.memberRanges) throw new Error('memberRanges missing');
	const range = node.memberRanges.get(member);
	if (!range) throw new Error('member range missing');
	const textBlockH = (node.lines.length - 1) * lineH;
	const startY = -textBlockH / 2;
	return (startY + range.start * lineH + startY + range.end * lineH) / 2;
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 * @param {string | null} rawVal
 * @param {number} clusterPadLeft
 * @param {number} lineH
 * @returns {[number, number]}
 */
export function clusterLeft(allNodes, row, label, rawVal, clusterPadLeft, lineH) {
	const d = findNode(allNodes, row, label);
	if (!d) throw new Error('node missing for clusterLeft');
	const member = rawVal ?? label;
	return [d.x - d.rectW / 2 - clusterPadLeft, d.y + memberYOffset(d, member, lineH)];
}

const VISIBLE_FLOW_STROKE_WIDTH = 2;
const FLOW_LANE_GAP = 2;
const LANE_PAD = VISIBLE_FLOW_STROKE_WIDTH + FLOW_LANE_GAP;
const MIN_CORNER_R = LANE_PAD;

/**
 * Draws an orthogonal path through `pts`, treating each interior point as a corner
 * with radius `cornerR`. Assumes consecutive points are colinear (purely horizontal
 * or purely vertical), i.e. the caller has pre-expanded any doglegs.
 *
 * @param {[number, number][]} pts
 * @param {Set<number>} sharpCorners corner indices (into the input `pts`) that must stay sharp
 * @param {number} cornerR
 * @param {Map<number, number>} cornerRadii
 */
function buildRoundedOrthoPath(pts, sharpCorners, cornerR, cornerRadii = new Map()) {
	if (pts.length < 2) return '';
	const filtered = [pts[0]];
	const filteredSharp = new Set();
	const filteredRadii = new Map();
	if (sharpCorners.has(0)) filteredSharp.add(0);
	if (cornerRadii.has(0)) filteredRadii.set(0, cornerRadii.get(0));
	for (let i = 1; i < pts.length; i++) {
		const [px, py] = filtered[filtered.length - 1];
		const [cx, cy] = pts[i];
		if (px !== cx || py !== cy) {
			filtered.push(pts[i]);
			if (sharpCorners.has(i)) filteredSharp.add(filtered.length - 1);
			if (cornerRadii.has(i)) filteredRadii.set(filtered.length - 1, cornerRadii.get(i));
		}
	}
	if (filtered.length < 2) return '';

	let d = `M${filtered[0][0]},${filtered[0][1]}`;
	for (let i = 1; i < filtered.length - 1; i++) {
		const [px, py] = filtered[i - 1];
		const [cx, cy] = filtered[i];
		const [nx, ny] = filtered[i + 1];
		const inDx = cx - px;
		const inDy = cy - py;
		const outDx = nx - cx;
		const outDy = ny - cy;
		const inLen = Math.hypot(inDx, inDy);
		const outLen = Math.hypot(outDx, outDy);
		if (
			inLen === 0 ||
			outLen === 0 ||
			inDx * outDy - inDy * outDx === 0 ||
			filteredSharp.has(i)
		) {
			d += ` L${cx},${cy}`;
			continue;
		}
		const targetR = Math.max(0, filteredRadii.get(i) ?? cornerR);
		const r = Math.min(targetR, inLen / 2, outLen / 2);
		if (r === 0) {
			d += ` L${cx},${cy}`;
			continue;
		}
		const inUx = inDx / inLen;
		const inUy = inDy / inLen;
		const outUx = outDx / outLen;
		const outUy = outDy / outLen;
		const startX = cx - inUx * r;
		const startY = cy - inUy * r;
		const endX = cx + outUx * r;
		const endY = cy + outUy * r;
		d += ` L${startX},${startY} Q${cx},${cy} ${endX},${endY}`;
	}
	const last = filtered[filtered.length - 1];
	d += ` L${last[0]},${last[1]}`;
	return d;
}

/**
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @param {number} laneOffset
 * @returns {[number, number]}
 */
function segmentOffsetVector(a, b, laneOffset) {
	if (laneOffset === 0) return [0, 0];
	const [x1, y1] = a;
	const [x2, y2] = b;
	// Keep lane offsets in screen space so opposite-direction segments do not collapse together.
	if (x1 === x2) {
		return [laneOffset, 0];
	}
	if (y1 === y2) {
		return [0, laneOffset];
	}
	return [0, 0];
}

/**
 * @param {number} laneIdx
 * @param {number} laneCount
 */
function laneOffsetForIndex(laneIdx, laneCount) {
	if (laneCount < 2) return 0;
	return (laneIdx - (laneCount - 1) / 2) * LANE_PAD;
}

/**
 * @param {[number, number]} prev
 * @param {[number, number]} corner
 * @param {[number, number]} next
 */
function turnSign(prev, corner, next) {
	const inDx = corner[0] - prev[0];
	const inDy = corner[1] - prev[1];
	const outDx = next[0] - corner[0];
	const outDy = next[1] - corner[1];
	return Math.sign(inDx * outDy - inDy * outDx);
}

/**
 * @param {number} incomingOff
 * @param {number} outgoingOff
 */
function cornerLaneOffset(incomingOff, outgoingOff) {
	if (incomingOff !== 0 && outgoingOff !== 0) return (incomingOff + outgoingOff) / 2;
	return incomingOff || outgoingOff;
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {import('./types').Flow[]} uniqueFlows
 * @param {(colIdx: number, label: string) => boolean} isClusterNodeFn
 * @param {import('./types').LayoutOpts} opts
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
	/** @type {{ flow: import('./types').Flow, flowIdx: number, segIdx: number, type: 'v' | 'h', coord: number, lo: number, hi: number }[]} */
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

	/** @type {Map<string, number>} */
	const offsets = new Map();

	/** @param {typeof allSegs} segs */
	const assignOffsets = (segs) => {
		/** @type {Map<number, typeof allSegs>} */
		const byCoord = new Map();
		segs.forEach((s) => {
			const bucket = byCoord.get(s.coord);
			if (bucket) bucket.push(s);
			else byCoord.set(s.coord, [s]);
		});
		byCoord.forEach((group) => {
			if (group.length < 2) return;
			// Sweep to find overlap-connected clusters.
			group.sort((a, b) => a.lo - b.lo);
			/** @type {(typeof group)[]} */
			const clusters = [];
			let cur = [group[0]];
			let curHi = group[0].hi;
			for (let i = 1; i < group.length; i++) {
				if (group[i].lo < curHi) {
					cur.push(group[i]);
					curHi = Math.max(curHi, group[i].hi);
				} else {
					if (cur.length > 1) clusters.push(cur);
					cur = [group[i]];
					curHi = group[i].hi;
				}
			}
			if (cur.length > 1) clusters.push(cur);

			clusters.forEach((cluster) => {
				/** @type {{ active: { group: number, hi: number }[] }[]} */
				const lanes = [];
				/** @type {{ s: (typeof cluster)[number], laneIdx: number }[]} */
				const assignments = [];

				cluster.forEach((s) => {
					let laneIdx = -1;
					for (let i = 0; i < lanes.length; i++) {
						lanes[i].active = lanes[i].active.filter((a) => a.hi > s.lo);
						if (!lanes[i].active.some((a) => a.group !== s.flow.group)) {
							laneIdx = i;
							break;
						}
					}
					if (laneIdx === -1) {
						laneIdx = lanes.length;
						lanes.push({ active: [] });
					}
					lanes[laneIdx].active.push({ group: s.flow.group, hi: s.hi });
					assignments.push({ s, laneIdx });
				});

				assignments.forEach(({ s, laneIdx }) => {
					const off = laneOffsetForIndex(laneIdx, lanes.length);
					if (off === 0) return;
					offsets.set(`${s.flowIdx}-${s.segIdx}`, off);
				});
			});
		});
	};

	assignOffsets(allSegs.filter((s) => s.type === 'v'));
	assignOffsets(allSegs.filter((s) => s.type === 'h'));

	// Phase 4: apply offsets per corner. Offsets are applied along each
	// segment's travel normal, then adjacent offset segments are intersected at
	// corners. This keeps the lane order consistent through left- and right-turns.
	/** @type {Map<import('./types').Flow, string>} */
	const finalPathD = new Map();
	/**
	 * Per-flow polyline used for fast nearest-point queries on hover.
	 * Corners are deduped and `cumLengths[i]` is the arc length from the start
	 * to `corners[i]` along the polyline (rounded-corner shortening is ignored;
	 * with CORNER_R=6 the discrepancy is sub-pixel-per-corner).
	 * @type {Map<import('./types').Flow, { corners: [number, number][], cumLengths: number[], totalLength: number }>}
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
					cornerRadii.set(cornerIdx, Math.max(MIN_CORNER_R, cornerR + sign * laneOff));
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
		pathD: (/** @type {import('./types').Flow} */ f) => finalPathD.get(f) ?? '',
		polyline: (/** @type {import('./types').Flow} */ f) => finalPolyline.get(f),
	};
}

/**
 * Find the arc length along the polyline closest to (x, y).
 * @param {{ corners: [number, number][], cumLengths: number[], totalLength: number }} polyline
 * @param {number} x
 * @param {number} y
 */
export function nearestLengthOnPolyline(polyline, x, y) {
	const { corners, cumLengths } = polyline;
	if (corners.length < 2) return 0;
	let bestLength = 0;
	let bestDistance = Infinity;
	for (let i = 0; i < corners.length - 1; i++) {
		const [ax, ay] = corners[i];
		const [bx, by] = corners[i + 1];
		const dx = bx - ax;
		const dy = by - ay;
		const segLenSq = dx * dx + dy * dy;
		let t = 0;
		if (segLenSq > 0) {
			t = ((x - ax) * dx + (y - ay) * dy) / segLenSq;
			if (t < 0) t = 0;
			else if (t > 1) t = 1;
		}
		const cx = ax + t * dx;
		const cy = ay + t * dy;
		const distSq = (cx - x) ** 2 + (cy - y) ** 2;
		if (distSq < bestDistance) {
			bestDistance = distSq;
			bestLength = cumLengths[i] + t * (cumLengths[i + 1] - cumLengths[i]);
		}
	}
	return bestLength;
}
