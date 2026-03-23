export function buildClusterData(raw, cols, clusterColsMap) {
	const clusterMaps = new Map();
	const clusterLabels = new Map();
	const realClusters = new Map();
	const realClusterLabelSet = new Map();
	const valToCluster = new Map();

	for (const [colIdx, tsvCol] of clusterColsMap) {
		const colName = cols[colIdx];
		const cmap = new Map();
		raw.forEach((r) => {
			const cid = r[tsvCol] ? r[tsvCol].trim() : '';
			if (!cid) return;
			if (!cmap.has(cid)) cmap.set(cid, new Set());
			cmap.get(cid).add(r[colName].trim());
		});
		clusterMaps.set(colIdx, cmap);

		const labels = new Map();
		const real = new Set();
		cmap.forEach((members, cid) => {
			labels.set(cid, [...members].join(', '));
			if (members.size > 1) real.add(cid);
		});
		clusterLabels.set(colIdx, labels);
		realClusters.set(colIdx, real);

		const labelSet = new Set();
		cmap.forEach((members, cid) => {
			if (real.has(cid)) labelSet.add(labels.get(cid));
		});
		realClusterLabelSet.set(colIdx, labelSet);

		const vmap = new Map();
		raw.forEach((r) => {
			const cid = r[tsvCol] ? r[tsvCol].trim() : '';
			if (cid && real.has(cid)) {
				vmap.set(r[colName].trim(), labels.get(cid));
			}
		});
		valToCluster.set(colIdx, vmap);
	}

	return { clusterMaps, clusterLabels, realClusters, realClusterLabelSet, valToCluster };
}

export function isClusterNode(colIdx, label, clusterColsMap, realClusterLabelSet) {
	return clusterColsMap.has(colIdx) && realClusterLabelSet.get(colIdx).has(label);
}
