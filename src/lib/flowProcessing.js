/**
 * @param {import('./types').RawRow[]} raw
 * @param {string[]} cols
 * @param {Map<number, string>} clusterCols
 * @param {Map<number, Map<string, string>>} clusterLabels
 * @param {Map<number, Set<string>>} realClusters
 * @returns {string[][]}
 */
export function buildLayers(raw, cols, clusterCols, clusterLabels, realClusters) {
	return cols.map((c, i) => {
		if (clusterCols.has(i)) {
			const tsvCol = clusterCols.get(i);
			const labels = clusterLabels.get(i) ?? new Map();
			const real = realClusters.get(i) ?? new Set();
			if (!tsvCol) return [];
			const seen = new Set();
			/** @type {string[]} */
			const result = [];
			raw.forEach((r) => {
				const cid = (r[tsvCol] ?? '').trim();
				const val = (r[c] ?? '').trim();
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
		return [...new Set(raw.map((r) => (r[c] ?? '').trim()))];
	});
}

/**
 * @param {import('./types').RawRow[]} raw
 * @param {string[]} cols
 * @param {Map<number, string>} clusterCols
 * @param {Map<number, Map<string, string>>} valToCluster
 * @returns {import('./types').Flow[]}
 */
export function buildFlows(raw, cols, clusterCols, valToCluster) {
	return raw.map((r) => {
		const path = /** @type {string[]} */ (
			cols.map((c, i) => {
			const val = (r[c] ?? '').trim();
			if (clusterCols.has(i)) {
				const vmap = valToCluster.get(i);
				return vmap?.has(val) ? vmap.get(val) : val;
			}
			return val;
			})
		);

		return {
			path,
			rawClusterVals: new Map(
				[...clusterCols.keys()].map((colIdx) => [colIdx, (r[cols[colIdx]] ?? '').trim()])
			),
			group: +r['group flow']
		};
	});
}

/** @param {import('./types').Flow[]} flows */
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
