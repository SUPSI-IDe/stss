<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import {
		MARGIN,
		GROUP_COLORS,
		CLUSTER_COLS,
		BADGE_SIZE,
		BADGE_PAD,
		LINE_H,
		PAD_X,
		PAD_Y,
		COLS,
		GAP,
		CORNER_R,
		CLUSTER_PAD_LEFT,
		STUB_LEN
	} from './constants.js';
	import { createTextMeasurer } from './textUtils.js';
	import { isClusterNode } from './clusterProcessing.js';
	import { measureNodes, adjustBadgeWidths } from './nodeBuilder.js';
	import { computeLayout } from './layoutEngine.js';
	import { createFlowPathGenerator } from './geometry.js';

	let { allNodes, uniqueFlows, realClusterLabelSet, onOpenTooltip } = $props();

	let containerEl;

	onMount(() => {
		let width = containerEl.clientWidth - MARGIN.left - MARGIN.right;
		let height = containerEl.clientHeight;

		const svgEl = d3
			.select(containerEl)
			.append('svg')
			.attr('width', containerEl.clientWidth)
			.attr('height', containerEl.clientHeight);

		const svg = svgEl
			.append('g')
			.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

		document.fonts.ready.then(() => {
			const measureText = createTextMeasurer('14px "Helvetica Neue", sans-serif');

			measureNodes(allNodes, svg, LINE_H, PAD_X, PAD_Y);
			adjustBadgeWidths(allNodes, BADGE_PAD, BADGE_SIZE);
			computeLayout(allNodes, COLS.length, width, height, GAP);

			const isClusterNodeFn = (colIdx, label) =>
				isClusterNode(colIdx, label, CLUSTER_COLS, realClusterLabelSet);
			const flowPathD = createFlowPathGenerator(allNodes, isClusterNodeFn, {
				lineH: LINE_H,
				clusterPadLeft: CLUSTER_PAD_LEFT,
				cornerR: CORNER_R,
				stubLen: STUB_LEN
			});

			const flowPaths = svg
				.append('g')
				.selectAll('path')
				.data(uniqueFlows)
				.join('path')
				.attr('d', flowPathD)
				.attr('fill', 'none')
				.attr('stroke', (f) => GROUP_COLORS[f.group - 1])
				.attr('stroke-width', 1)
				.attr('stroke-opacity', 0);

			const nodeGroups = svg
				.append('g')
				.selectAll('g')
				.data(allNodes)
				.join('g')
				.attr('transform', (d) => `translate(${d.x},${d.y})`);

			nodeGroups
				.append('rect')
				.attr('x', (d) => -d.rectW / 2)
				.attr('y', (d) => d.rectY)
				.attr('width', (d) => d.rectW)
				.attr('height', (d) => d.rectH)
				.attr('fill', 'transparent');

			nodeGroups.each(function (d) {
				const g = d3.select(this);
				const el = g
					.append('text')
					.attr('text-anchor', 'start')
					.attr('font-size', 14)
					.attr('fill', '#333');

				const textBlockH = (d.lines.length - 1) * LINE_H;
				const startY = -textBlockH / 2;
				const multiLine = d.lines.length > 1;

				d.segmentedLines.forEach((segments, i) => {
					let lineW = 0;
					segments.forEach((seg) => {
						lineW += measureText(seg.text);
						if (seg.tooltip) lineW += BADGE_PAD * 2 + BADGE_SIZE;
					});

					let cx = multiLine ? -d.bbox.width / 2 : -lineW / 2;
					const ly = startY + i * LINE_H;

					segments.forEach((seg) => {
						el.append('tspan')
							.text(seg.text)
							.attr('x', cx)
							.attr('y', ly)
							.attr('dy', '0.35em');

						cx += measureText(seg.text);

						if (seg.tooltip) {
							cx += BADGE_PAD;
							const tipData = seg.tooltip;
							const badgeG = g
								.append('g')
								.attr('class', 'badge')
								.attr('pointer-events', 'all')
								.style('cursor', 'pointer')
								.attr(
									'transform',
									`translate(${cx},${ly + 14 * 0.35 - BADGE_SIZE + 2})`
								)
								.on('click', (event) => {
									event.stopPropagation();
									onOpenTooltip(event, tipData);
								});

							badgeG
								.append('rect')
								.attr('width', BADGE_SIZE)
								.attr('height', BADGE_SIZE)
								.attr('fill', 'black');

							badgeG
								.append('text')
								.attr('class', 'badge-label')
								.attr('x', BADGE_SIZE / 2)
								.attr('y', BADGE_SIZE / 2)
								.attr('fill', 'white')
								.attr('text-anchor', 'middle')
								.attr('dominant-baseline', 'central')
								.text(seg.tooltip.id);

							cx += BADGE_SIZE + BADGE_PAD;
						}
					});
				});
			});

			nodeGroups
				.on('mouseenter', (_, d) => {
					const match = (f) => f.path[d.row] === d.label;
					flowPaths
						.attr('stroke-opacity', (f) => (match(f) ? 0.9 : 0))
						.attr('stroke', (f) => GROUP_COLORS[f.group - 1])
						.attr('stroke-width', (f) => (match(f) ? 2 : 1));
					const matchingFlows = uniqueFlows.filter(match);
					nodeGroups.select('rect').attr('fill', function (nd) {
						const nodeFlows = matchingFlows.filter(
							(f) => f.path[nd.row] === nd.label
						);
						if (nodeFlows.length === 0) return 'transparent';
						const counts = {};
						nodeFlows.forEach((f) => {
							counts[f.group] = (counts[f.group] || 0) + 1;
						});
						const topGroup = Object.entries(counts).sort(
							(a, b) => b[1] - a[1]
						)[0][0];
						return GROUP_COLORS[+topGroup - 1];
					});
				})
				.on('mouseleave', () => {
					flowPaths
						.attr('stroke-opacity', 0)
						.attr('stroke', (f) => GROUP_COLORS[f.group - 1])
						.attr('stroke-width', 1);
					nodeGroups.select('rect').attr('fill', 'transparent');
				});

			window.addEventListener('resize', () => {
				width = containerEl.clientWidth - MARGIN.left - MARGIN.right;
				height = containerEl.clientHeight;

				svgEl
					.attr('width', containerEl.clientWidth)
					.attr('height', containerEl.clientHeight);

				computeLayout(allNodes, COLS.length, width, height, GAP);

				nodeGroups.attr('transform', (d) => `translate(${d.x},${d.y})`);
				flowPaths.attr('d', flowPathD);
			});
		});
	});
</script>

<div class="sankey-container" bind:this={containerEl}></div>

<style>
	.sankey-container {
		width: 100%;
		height: 100%;
	}

	:global(svg text) {
		font-family: 'Helvetica Neue', sans-serif;
		font-size: 14px;
		letter-spacing: 0.1px;
		line-height: 110%;
		pointer-events: none;
		user-select: none;
	}

	:global(svg .badge-label) {
		font-size: 12px !important;
		letter-spacing: 0 !important;
	}

	:global(circle) {
		cursor: pointer;
	}
</style>
