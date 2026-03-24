<script lang="ts">
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
    import type { NodeData, Flow, TooltipData } from './types';

    let { allNodes, uniqueFlows, realClusterLabelSet, onOpenTooltip }: {
        allNodes: NodeData[];
        uniqueFlows: Flow[];
        realClusterLabelSet: Map<number, Set<string>>;
        onOpenTooltip: (event: MouseEvent, tipData: TooltipData) => void;
    } = $props();

    let containerEl: HTMLDivElement;

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

            measureNodes(allNodes, svg as any, LINE_H, PAD_X, PAD_Y);
            adjustBadgeWidths(allNodes, BADGE_PAD, BADGE_SIZE);
            computeLayout(allNodes, COLS.length, width, height, GAP);

            const isClusterNodeFn = (colIdx: number, label: string) =>
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
                .data<Flow>(uniqueFlows)
                .join('path')
                .attr('d', flowPathD)
                .attr('fill', 'none')
                .attr('stroke', (f: Flow) => GROUP_COLORS[f.group - 1])
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0);

            const nodeGroups = svg
                .append('g')
                .selectAll('g')
                .data<NodeData>(allNodes)
                .join('g')
                .attr('transform', (d: NodeData) => `translate(${d.x},${d.y})`);

            nodeGroups
                .append('rect')
                .attr('x', (d: NodeData) => -d.rectW / 2)
                .attr('y', (d: NodeData) => d.rectY)
                .attr('width', (d: NodeData) => d.rectW)
                .attr('height', (d: NodeData) => d.rectH)
                .attr('fill', 'transparent');

            nodeGroups.each((d: NodeData, _i: number, nodes: SVGGElement[]) => {
                const g = d3.select(nodes[_i] as SVGGElement);
                const el = g
                    .append('text')
                    .attr('text-anchor', 'start')
                    .attr('font-size', 14)
                    .attr('fill', '#333');

                const textBlockH = (d.lines.length - 1) * LINE_H;
                const startY = -textBlockH / 2;
                const startX = -d.rectW / 2 + PAD_X;

                d.segmentedLines.forEach((segments: import('./types').SegmentedLine, i: number) => {
                    let cx = startX;
                    const ly = startY + i * LINE_H;

                    segments.forEach((seg: import('./types').Segment) => {
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
                                .on('click', (event: MouseEvent) => {
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
                                .text(String(seg.tooltip.id));

                            cx += BADGE_SIZE + BADGE_PAD;
                        }
                    });
                });
            });

            nodeGroups
                .on('mouseenter', (_: MouseEvent, d: NodeData) => {
                    const match = (f: Flow) => f.path[d.row] === d.label;
                    flowPaths
                        .attr('stroke-opacity', (f: Flow) => (match(f) ? 0.9 : 0))
                        .attr('stroke', (f: Flow) => GROUP_COLORS[f.group - 1])
                        .attr('stroke-width', (f: Flow) => (match(f) ? 2 : 1));
                    const matchingFlows = uniqueFlows.filter(match);
                    nodeGroups.select('rect').attr('fill', function (nd: NodeData) {
                        const nodeFlows = matchingFlows.filter(
                            (f) => f.path[nd.row] === nd.label
                        );
                        if (nodeFlows.length === 0) return 'transparent';
                        const counts: Record<number, number> = {};
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
                        .attr('stroke', (f: Flow) => GROUP_COLORS[f.group - 1])
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

                nodeGroups.attr('transform', (d: NodeData) => `translate(${d.x},${d.y})`);
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
		font-size: 13.38px;
		letter-spacing: 0.1px;
		line-height: 111%;
        text-transform: uppercase;
		pointer-events: none;
		user-select: none;
	}

	:global(svg .badge-label) {
		font-size: 13.38px !important;
		letter-spacing: 0.1px !important;
	}

	:global(circle) {
		cursor: pointer;
	}
</style>
