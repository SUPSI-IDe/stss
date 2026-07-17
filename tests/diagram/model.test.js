import test from 'node:test';
import assert from 'node:assert/strict';
import {
	buildLineFill,
	createFlowIndex,
	flowsForNode,
	indexNodes,
	nodeKey,
	visibleNodeKeys
} from '../../src/lib/diagram/model.js';

const flow = (path, group = 1, rawClusterVals = new Map()) => ({ path, group, rawClusterVals });
const node = (row, label, lines = 1, memberRanges = null) => ({
	row,
	label,
	lines: [label],
	memberRanges,
	bbox: { x: 0, y: 0, width: 10, height: 10 },
	rectW: 10,
	rectH: 10,
	rectY: 0,
	x: 0,
	y: 0,
	lineData: Array.from({ length: lines }, () => ({ segments: [], width: 10 }))
});

test('indexes a flow at every node in its path', () => {
	const first = flow(['collect', 'thinking', 'share']);
	const second = flow(['collect', 'seeing', 'publish']);
	const index = createFlowIndex([first, second]);
	assert.deepEqual(flowsForNode(index, nodeKey(0, 'collect')), [first, second]);
	assert.deepEqual(flowsForNode(index, nodeKey(1, 'thinking')), [first]);
});

test('mobile visibility starts at roots and expands along the selected flow', () => {
	const nodes = [node(0, 'collect'), node(1, 'thinking'), node(1, 'seeing'), node(2, 'share')];
	const index = createFlowIndex([flow(['collect', 'thinking', 'share'])]);
	const isRoot = (label) => ['thinking', 'seeing'].includes(label);
	assert.deepEqual(
		[...visibleNodeKeys(nodes, null, index, isRoot)].sort(),
		[nodeKey(1, 'seeing'), nodeKey(1, 'thinking')].sort()
	);
	assert.deepEqual(
		[...visibleNodeKeys(nodes, nodeKey(1, 'thinking'), index, isRoot)].sort(),
		[nodeKey(0, 'collect'), nodeKey(1, 'seeing'), nodeKey(1, 'thinking'), nodeKey(2, 'share')].sort()
	);
});

test('cluster highlights only the member lines traversed by matching flows', () => {
	const cluster = node(0, 'alpha, beta', 2, new Map([
		['alpha', { start: 0, end: 0 }],
		['beta', { start: 1, end: 1 }]
	]));
	const matching = [flow(['alpha, beta'], 2, new Map([[0, 'beta']]))];
	const fill = buildLineFill(matching, indexNodes([cluster]), () => true, ['red', 'blue']);
	assert.equal(fill.get('0 alpha, beta 0'), undefined);
	assert.equal(fill.get('0 alpha, beta 1'), 'blue');
});
