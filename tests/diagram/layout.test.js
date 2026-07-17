import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRowArrows, buildRowGuideLabels, positionNodes } from '../../src/lib/diagram/layout.js';
import { nodeKey } from '../../src/lib/diagram/model.js';

const node = (row, label, width = 40, height = 14) => ({
	row,
	label,
	lines: [label],
	memberRanges: null,
	bbox: { x: 0, y: 0, width, height },
	rectW: width,
	rectH: height,
	rectY: -height / 2,
	x: 0,
	y: 0,
	lineData: [{ segments: [], width }]
});

test('mobile positioning filters hidden nodes without mutating measured input', () => {
	const measured = [node(0, 'hidden'), node(4, 'thinking'), node(5, 'visible')];
	const positioned = positionNodes({
		measured,
		mobileMeasured: null,
		visibleKeys: new Set([nodeKey(4, 'thinking'), nodeKey(5, 'visible')]),
		isMobile: true,
		width: 390,
		height: 700,
		anchorY: 350,
		nodeKey
	});
	assert.deepEqual(positioned.map((item) => item.label), ['thinking', 'visible']);
	assert.equal(measured.every((item) => item.x === 0 && item.y === 0), true);
	assert.equal(positioned.every((item) => Number.isFinite(item.x) && Number.isFinite(item.y)), true);
});

test('row guides and arrows are derived from positioned node bounds', () => {
	const positioned = [
		{ ...node(0, 'first'), x: 50, y: 100 },
		{ ...node(0, 'second'), x: 150, y: 120 }
	];
	const guides = buildRowGuideLabels(positioned, false);
	const arrows = buildRowArrows(positioned, false, 16);
	assert.equal(guides[0].row, 0);
	assert.equal(guides[0].y, 81);
	assert.equal(arrows[0].row, 0);
	assert.equal(Number.isFinite(arrows[0].y), true);
});
