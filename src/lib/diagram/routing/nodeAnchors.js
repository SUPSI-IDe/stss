/** @param {import('../../types').NodeData[]} nodes @param {number} row @param {string} label */
export function findNode(nodes, row, label) {
	return nodes.find((node) => node.row === row && node.label === label);
}

/** @param {import('../../types').NodeData[]} nodes @param {number} row @param {string} label @returns {[number, number]} */
export function nodeOrigin(nodes, row, label) {
	const node = findNode(nodes, row, label);
	if (!node) throw new Error(`Node not found at row ${row}: ${label}`);
	return [node.x, node.y];
}

/** @param {import('../../types').NodeData} node @param {string} member @param {number} lineHeight */
export function memberYOffset(node, member, lineHeight) {
	if (!node.memberRanges) throw new Error(`Cluster node has no member ranges: ${node.label}`);
	const range = node.memberRanges.get(member);
	if (!range) throw new Error(`Cluster member not found in ${node.label}: ${member}`);
	const startY = -((node.lines.length - 1) * lineHeight) / 2;
	return (startY + range.start * lineHeight + startY + range.end * lineHeight) / 2;
}

/**
 * @param {import('../../types').NodeData[]} nodes
 * @param {number} row
 * @param {string} label
 * @param {string | null} rawValue
 * @param {number} leftPadding
 * @param {number} lineHeight
 * @returns {[number, number]}
 */
export function clusterLeft(nodes, row, label, rawValue, leftPadding, lineHeight) {
	const node = findNode(nodes, row, label);
	if (!node) throw new Error(`Cluster node not found at row ${row}: ${label}`);
	return [
		node.x - node.rectW / 2 - leftPadding,
		node.y + memberYOffset(node, rawValue ?? label, lineHeight)
	];
}
