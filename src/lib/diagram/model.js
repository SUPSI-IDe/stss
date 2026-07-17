/** @param {number} row @param {string} label */
export const nodeKey = (row, label) => `${row} ${label}`;

/** @param {number} row @param {string} label @param {number} lineIndex */
export const nodeLineKey = (row, label, lineIndex) => `${nodeKey(row, label)} ${lineIndex}`;

/** @param {number} x @param {number} y @param {string | number} label */
export const renderKey = (x, y, label) => `${x} ${y} ${label}`;

/**
 * Index flows by every node they pass through.
 * @param {import('../types').Flow[]} flows
 */
export function createFlowIndex(flows) {
	/** @type {Map<string, import('../types').Flow[]>} */
	const index = new Map();
	for (const flow of flows) {
		flow.path.forEach((label, row) => {
			const key = nodeKey(row, label);
			const bucket = index.get(key);
			if (bucket) bucket.push(flow);
			else index.set(key, [flow]);
		});
	}
	return index;
}

/**
 * @param {Map<string, import('../types').Flow[]>} flowIndex
 * @param {string | null} key
 */
export function flowsForNode(flowIndex, key) {
	return key ? (flowIndex.get(key) ?? []) : [];
}

/**
 * Mobile starts with root nodes and expands to every node on a selected root's flows.
 * @param {import('../types').NodeData[]} nodes
 * @param {string | null} rootKey
 * @param {Map<string, import('../types').Flow[]>} flowIndex
 * @param {(label: string) => boolean} isRootNode
 */
export function visibleNodeKeys(nodes, rootKey, flowIndex, isRootNode) {
	const keys = new Set(
		nodes.filter((node) => isRootNode(node.label)).map((node) => nodeKey(node.row, node.label))
	);
	for (const flow of flowsForNode(flowIndex, rootKey)) {
		flow.path.forEach((label, row) => keys.add(nodeKey(row, label)));
	}
	return keys;
}

/** @param {import('../types').NodeData[]} nodes */
export function indexNodes(nodes) {
	return new Map(nodes.map((node) => [nodeKey(node.row, node.label), node]));
}

/**
 * Resolve the dominant flow group for every rendered line.
 * @param {import('../types').Flow[]} matchingFlows
 * @param {Map<string, import('../types').NodeData>} nodesByKey
 * @param {(row: number, label: string) => boolean} isClusterNode
 * @param {string[]} groupColors
 */
export function buildLineFill(matchingFlows, nodesByKey, isClusterNode, groupColors) {
	/** @type {Map<string, string>} */
	const fill = new Map();
	/** @type {Map<string, Record<number, number>>} */
	const counts = new Map();
	/** @param {string} key @param {number} group */
	const addCount = (key, group) => {
		const count = counts.get(key);
		if (count) count[group] = (count[group] || 0) + 1;
		else counts.set(key, { [group]: 1 });
	};

	for (const flow of matchingFlows) {
		flow.path.forEach((label, row) => {
			const node = nodesByKey.get(nodeKey(row, label));
			if (!node) return;

			if (isClusterNode(row, label)) {
				const rawValue = flow.rawClusterVals.get(row);
				const range = rawValue ? node.memberRanges?.get(rawValue) : null;
				if (!range) return;
				for (let line = range.start; line <= range.end; line += 1) {
					addCount(nodeLineKey(row, label, line), flow.group);
				}
				return;
			}

			for (let line = 0; line < node.lineData.length; line += 1) {
				addCount(nodeLineKey(row, label, line), flow.group);
			}
		});
	}

	counts.forEach((groups, key) => {
		const dominantGroup = Number(
			Object.entries(groups).sort((a, b) => b[1] - a[1])[0][0]
		);
		const color = groupColors[dominantGroup - 1];
		if (color) fill.set(key, color);
	});
	return fill;
}
