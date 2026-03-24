/**
 * @param {import('./types').RawRow[]} raw
 * @param {string[]} cols
 * @param {Map<number, string>} clusterColsMap
 */
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
			const rawCid = r[tsvCol];
			const cid = typeof rawCid === 'string' ? rawCid.trim() : '';
			if (!cid) return;
			if (!cmap.has(cid)) cmap.set(cid, new Set());
			const val = (r[colName] ?? '').trim();
			cmap.get(cid)?.add(val);
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
			const rawCid = r[tsvCol];
			const cid = typeof rawCid === 'string' ? rawCid.trim() : '';
			if (cid && real.has(cid)) {
				const val = (r[colName] ?? '').trim();
				vmap.set(val, labels.get(cid));
			}
		});
		valToCluster.set(colIdx, vmap);
	}

	return { clusterMaps, clusterLabels, realClusters, realClusterLabelSet, valToCluster };
}

/**
 * @param {number} colIdx
 * @param {string} label
 * @param {Map<number, string>} clusterColsMap
 * @param {Map<number, Set<string>>} realClusterLabelSet
 */
export function isClusterNode(colIdx, label, clusterColsMap, realClusterLabelSet) {
	const set = realClusterLabelSet.get(colIdx);
	return clusterColsMap.has(colIdx) && !!set && set.has(label);
}
