import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoundedOrthoPath, laneOffsetForIndex } from '../../src/lib/diagram/routing/pathPrimitives.js';
import { assignLaneOffsets } from '../../src/lib/diagram/routing/laneAssignment.js';
import { nearestLengthOnPolyline } from '../../src/lib/diagram/routing/polyline.js';

test('rounded paths bound their corner radius by adjacent segments', () => {
	const path = buildRoundedOrthoPath([[0, 0], [0, 4], [10, 4]], new Set(), 20);
	assert.equal(path, 'M0,0 L0,2 Q0,4 2,4 L10,4');
	assert.equal(path.includes('NaN'), false);
});

test('lane offsets are centered and symmetric', () => {
	assert.deepEqual([0, 1, 2].map((index) => laneOffsetForIndex(index, 3)), [-4, 0, 4]);
	assert.deepEqual([0, 1].map((index) => laneOffsetForIndex(index, 2)), [-2, 2]);
});

test('nearest polyline length clamps to the closest segment', () => {
	const polyline = {
		corners: [[0, 0], [10, 0], [10, 10]],
		cumLengths: [0, 10, 20],
		totalLength: 20
	};
	assert.equal(nearestLengthOnPolyline(polyline, 4, 3), 4);
	assert.equal(nearestLengthOnPolyline(polyline, 15, 7), 17);
});

test('overlapping flow groups receive separate lane offsets', () => {
	const first = { path: [], group: 1, rawClusterVals: new Map() };
	const second = { path: [], group: 2, rawClusterVals: new Map() };
	const offsets = assignLaneOffsets([
		{ flow: first, flowIdx: 0, segIdx: 0, type: 'v', coord: 10, lo: 0, hi: 20 },
		{ flow: second, flowIdx: 1, segIdx: 0, type: 'v', coord: 10, lo: 5, hi: 15 }
	]);
	assert.equal(offsets.get('0-0'), -2);
	assert.equal(offsets.get('1-0'), 2);
});
