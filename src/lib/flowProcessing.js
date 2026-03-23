export function buildLayers(raw, cols, clusterCols, clusterLabels, realClusters) {
	return cols.map((c, i) => {
		if (clusterCols.has(i)) {
			const tsvCol = clusterCols.get(i);
			const labels = clusterLabels.get(i);
			const real = realClusters.get(i);
			const seen = new Set();
			const result = [];
			raw.forEach((r) => {
				const cid = r[tsvCol] ? r[tsvCol].trim() : '';
				const val = r[c].trim();
				if (cid && real.has(cid)) {
					const label = labels.get(cid);
					if (!seen.has(label)) {
						seen.add(label);
						result.push(label);
					}
				} else {
					if (!seen.has(val)) {
						seen.add(val);
						result.push(val);
					}
				}
			});
			return result;
		}
		return [...new Set(raw.map((r) => r[c].trim()))];
	});
}

export function buildFlows(raw, cols, clusterCols, valToCluster) {
	return raw.map((r) => ({
		path: cols.map((c, i) => {
			const val = r[c].trim();
			if (clusterCols.has(i)) {
				const vmap = valToCluster.get(i);
				return vmap.has(val) ? vmap.get(val) : val;
			}
			return val;
		}),
		rawClusterVals: new Map(
			[...clusterCols.keys()].map((colIdx) => [colIdx, r[cols[colIdx]].trim()])
		),
		group: +r['group flow']
	}));
}

export function deduplicateFlows(flows) {
	const seen = new Set();
	return flows.filter((f) => {
		const clusterKeys = [...f.rawClusterVals.entries()]
			.map(([k, v]) => `${k}:${v}`)
			.join('|');
		const key = f.path.join('|') + '|' + clusterKeys;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
