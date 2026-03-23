export function findNode(allNodes, row, label) {
	return allNodes.find((n) => n.row === row && n.label === label);
}

export function nodeTop(allNodes, row, label) {
	const d = findNode(allNodes, row, label);
	return [d.x, d.y + d.rectY];
}

export function nodeBottom(allNodes, row, label) {
	const d = findNode(allNodes, row, label);
	return [d.x, d.y + d.rectY + d.rectH];
}

export function memberYOffset(node, member, lineH) {
	const range = node.memberRanges.get(member);
	const textBlockH = (node.lines.length - 1) * lineH;
	const startY = -textBlockH / 2;
	return (startY + range.start * lineH + startY + range.end * lineH) / 2;
}

export function clusterLeft(allNodes, row, label, rawVal, clusterPadLeft, lineH) {
	const d = findNode(allNodes, row, label);
	return [d.x - d.rectW / 2 - clusterPadLeft, d.y + memberYOffset(d, rawVal, lineH)];
}

export function clusterRight(allNodes, row, label, rawVal, lineH) {
	const d = findNode(allNodes, row, label);
	return [d.x + d.rectW / 2, d.y + memberYOffset(d, rawVal, lineH)];
}

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

export function createFlowPathGenerator(allNodes, isClusterNodeFn, opts) {
	const { lineH, clusterPadLeft, cornerR, stubLen } = opts;

	return function flowPathD(f) {
		const pts = [];
		const midYOverrides = {};
		let lastClusterBottomY = null;
		let pendingClusterExit = false;

		f.path.forEach((label, i) => {
			const isCNode = isClusterNodeFn(i, label);
			const rawVal = isCNode ? f.rawClusterVals.get(i) : null;

			if (i > 0) {
				if (isCNode) {
					const clusterNode = findNode(allNodes, i, label);
					const clusterTopY = clusterNode.y + clusterNode.rectY;
					midYOverrides[pts.length - 1] = (pts[pts.length - 1][1] + clusterTopY) / 2;
					const lp = clusterLeft(allNodes, i, label, rawVal, clusterPadLeft, lineH);
					pts.push(lp);
					pts.push([lp[0] + stubLen, lp[1]]);
				} else {
					if (pendingClusterExit) {
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
