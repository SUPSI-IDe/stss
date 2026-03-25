/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 */
export function findNode(allNodes, row, label) {
	return allNodes.find((n) => n.row === row && n.label === label);
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 * @returns {[number, number]}
 */
export function nodeTop(allNodes, row, label) {
	const d = findNode(allNodes, row, label);
	if (!d) throw new Error('Node not found for nodeTop');
	return [d.x, d.y];
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 * @returns {[number, number]}
 */
export function nodeBottom(allNodes, row, label) {
	const d = findNode(allNodes, row, label);
	if (!d) throw new Error('Node not found for nodeBottom');
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

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {number} row
 * @param {string} label
 * @param {string | null} rawVal
 * @param {number} lineH
 * @returns {[number, number]}
 */
export function clusterRight(allNodes, row, label, rawVal, lineH) {
	const d = findNode(allNodes, row, label);
	if (!d) throw new Error('node missing for clusterRight');
	const member = rawVal ?? label;
	return [d.x + d.rectW / 2, d.y + memberYOffset(d, member, lineH)];
}

/**
 * @param {[number, number][]} pts
 * @param {Record<number, number>} midYOverrides
 * @param {number} cornerR
 */
export function orthoPath(pts, midYOverrides, cornerR) {
	if (pts.length < 2) return '';
	let d = `M${pts[0][0]},${pts[0][1]}`;
	for (let i = 1; i < pts.length; i++) {
		const [x1, y1] = pts[i - 1];
		const [x2, y2] = pts[i];
		if (x1 === x2 || y1 === y2) {
			d += ` L${x2},${y2}`;
		} else {
			const midY =
				midYOverrides && midYOverrides[i - 1] != null
					? midYOverrides[i - 1]
					: (y1 + y2) / 2;
			const dx = x2 > x1 ? 1 : -1;
			const cr = Math.min(
				cornerR,
				Math.abs(x2 - x1) / 2,
				Math.abs(midY - y1),
				Math.abs(y2 - midY)
			);
			d += ` L${x1},${midY - cr}`;
			d += ` Q${x1},${midY} ${x1 + dx * cr},${midY}`;
			d += ` L${x2 - dx * cr},${midY}`;
			d += ` Q${x2},${midY} ${x2},${midY + cr}`;
			d += ` L${x2},${y2}`;
		}
	}
	return d;
}

/**
 * @param {import('./types').NodeData[]} allNodes
 * @param {(colIdx: number, label: string) => boolean} isClusterNodeFn
 * @param {import('./types').LayoutOpts} opts
 */
export function createFlowPathGenerator(allNodes, isClusterNodeFn, opts) {
	const { lineH, clusterPadLeft, cornerR, stubLen } = opts;

	return function flowPathD(/** @type {import('./types').Flow} */ f) {
		/** @type {[number, number][]} */
		const pts = [];
		/** @type {Record<number, number>} */
		const midYOverrides = {};
		let lastClusterBottomY = /** @type {number | null} */ (null);
		let pendingClusterExit = false;

		f.path.forEach((label /** @type {string} */, i /** @type {number} */) => {
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
				} else {
					if (pendingClusterExit && lastClusterBottomY !== null) {
						const targetTopY = nodeTop(allNodes, i, label)[1];
						midYOverrides[pts.length - 1] = (lastClusterBottomY + targetTopY) / 2;
						pendingClusterExit = false;
					}
					pts.push(nodeTop(allNodes, i, label));
				}
			}
			if (i < f.path.length - 1) {
				if (isCNode) {
					const lp = clusterLeft(allNodes, i, label, rawVal, clusterPadLeft, lineH);
					pts.push([lp[0] + stubLen, lp[1]]);
					pts.push(lp);
					const clusterNode = findNode(allNodes, i, label);
					if (!clusterNode) throw new Error('cluster node missing');
					lastClusterBottomY = clusterNode.y + clusterNode.rectY + clusterNode.rectH;
					pendingClusterExit = true;
				} else {
					pts.push(nodeBottom(allNodes, i, label));
				}
			}
		});
		return orthoPath(pts, midYOverrides, cornerR);
	};
}
