import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNodeRenderModel, cloneNodes, wrapToWidth } from '../../src/lib/diagram/renderModel.js';

test('wraps words and splits an overlong word to the measured width', () => {
	const measure = (value) => value.length;
	assert.deepEqual(wrapToWidth('small data practice', 10, measure), ['small data', 'practice']);
	assert.deepEqual(wrapToWidth('overflow', 3, measure), ['ove', 'rfl', 'ow']);
});

test('builds declarative text, badge, and page control positions', () => {
	const tooltip = { id: 1, label: 'data', definition: 'A definition' };
	const node = {
		row: 0,
		label: 'small data',
		lines: ['small data'],
		memberRanges: null,
		bbox: { x: 0, y: 0, width: 20, height: 10 },
		rectW: 20,
		rectH: 14,
		rectY: -7,
		x: 0,
		y: 0,
		hasPage: true,
		lineData: [{ segments: [{ text: 'data', tooltip }], width: 20 }]
	};
	const render = buildNodeRenderModel(node, (value) => value.length, {
		lineHeight: 16,
		badgePad: 2,
		badgeSize: 10,
		pagePlusDiameter: 10
	});
	assert.equal(render.lineRects.length, 1);
	assert.equal(render.badges[0].tooltip, tooltip);
	assert.equal(render.tspans.at(-1).plus, true);
});

test('clones mutable node geometry and nested line data', () => {
	const original = [{
		row: 0,
		label: 'node',
		lines: ['node'],
		memberRanges: new Map([['node', { start: 0, end: 0 }]]),
		bbox: { x: 0, y: 0, width: 10, height: 10 },
		rectW: 10,
		rectH: 10,
		rectY: 0,
		x: 0,
		y: 0,
		lineData: [{ segments: [{ text: 'node', tooltip: null }], width: 10 }]
	}];
	const copy = cloneNodes(original);
	copy[0].bbox.width = 99;
	copy[0].lineData[0].segments[0].text = 'changed';
	assert.equal(original[0].bbox.width, 10);
	assert.equal(original[0].lineData[0].segments[0].text, 'node');
});
