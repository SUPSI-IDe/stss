<script lang="ts">
    import type { Attachment } from "svelte/attachments";
    import { Tween } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { SvelteMap } from "svelte/reactivity";
    import { goto } from "$app/navigation";
    import { asset, resolve } from "$app/paths";
    import type { Pathname } from "$app/types";
    import {
        MARGIN,
        GROUP_COLORS,
        CLUSTER_COLS,
        BADGE_SIZE,
        BADGE_PAD,
        LINE_H,
        PAD_Y,
        COLS,
        ROW_GUIDE_LABELS,
        CORNER_R,
        CLUSTER_PAD_LEFT,
        STUB_LEN,
    } from "$lib/constants.js";

    import { setPendingScroll } from "$lib/overlayScroll";
    import { isClusterNode } from "$lib/clusterProcessing.js";
    import { measureNodes } from "$lib/nodeBuilder.js";
    import { computeLayout } from "$lib/layoutEngine.js";
    import {
        createFlowPathGenerator,
        nearestLengthOnPolyline,
    } from "$lib/geometry.js";
    import type {
        NodeData,
        Flow,
        TooltipData,
        NodeRenderModel,
    } from "$lib/types";

    const FLOW_ANIMATION_MS = 900;
    const FLOW_INITIAL_VISIBLE_LENGTH = 18;
    const ROW_GUIDE_LABEL_GAP = 12;
    const ROW_GUIDE_TOP_INSET = 26;
    const DIAGRAM_LEFT_OFFSET = 28;
    const ROW_ARROW_HREF = asset("/images/icona_freccia.svg");
    const ROW_ARROW_WIDTH = 9;
    const ROW_ARROW_HEIGHT = 8;
    const PAGE_PLUS_DIAMETER = BADGE_SIZE;
    const PAGE_PLUS_RADIUS = PAGE_PLUS_DIAMETER / 2;
    const SVG_NS = "http://www.w3.org/2000/svg";

    let {
        allNodes,
        uniqueFlows,
        realClusterLabelSet,
        activeTooltipId = null,
        onOpenTooltip,
        onPageHoverChange = () => {},
    }: {
        allNodes: NodeData[];
        uniqueFlows: Flow[];
        realClusterLabelSet: Map<number, Set<string>>;
        activeTooltipId?: number | null;
        onOpenTooltip: (
            tipData: TooltipData,
            anchorX: number,
            anchorY: number,
        ) => void;
        onPageHoverChange?: (pageRoute: string | null) => void;
    } = $props();

    const nodeKey = (row: number, label: string) => `${row} ${label}`;
    const nodeLineKey = (row: number, label: string, lineIndex: number) =>
        `${nodeKey(row, label)} ${lineIndex}`;
    const renderKey = (x: number, y: number, label: string | number) =>
        `${x} ${y} ${label}`;

    // Measured node data (rect metrics + node-relative draw model), set once
    // after fonts load. x/y stay at 0 here — layout positions them below.
    let measured = $state<NodeData[]>([]);
    // Container dimensions, kept in sync via bind:clientWidth/clientHeight.
    let cw = $state(0);
    let ch = $state(0);

    let hoveredNode = $state<NodeData | null>(null);
    // 0 → 1 progress for the flow grow-out animation; reset and re-run per hover.
    const progress = new Tween(0, {
        duration: FLOW_ANIMATION_MS,
        easing: cubicOut,
    });

    const isClusterNodeFn = (colIdx: number, label: string) =>
        isClusterNode(colIdx, label, CLUSTER_COLS, realClusterLabelSet);

    /**
     * Mirrors the on-screen text layout exactly so badge/`+` positions match
     * the rendered tspans. `measureWidth` must use the same CSS as the render.
     */
    function buildNodeRenderModel(
        node: NodeData,
        measureWidth: (str: string) => number,
    ): NodeRenderModel {
        const lineCount = node.lineData.length;
        const textBlockH = (lineCount - 1) * LINE_H;
        const startY = -textBlockH / 2;
        const startX = -node.rectW / 2;
        const lineRectH = node.rectH / lineCount;

        const lineRects: NodeRenderModel["lineRects"] = [];
        const tspans: NodeRenderModel["tspans"] = [];
        const badges: NodeRenderModel["badges"] = [];

        node.lineData.forEach((line, i) => {
            lineRects.push({
                x: startX,
                y: node.rectY + i * lineRectH,
                width: line.width,
                height: lineRectH,
            });

            let cx = startX;
            const ly = startY + i * LINE_H;

            line.segments.forEach((seg) => {
                if (seg.tooltip) cx += BADGE_PAD;
                tspans.push({ x: cx, y: ly, text: seg.text });
                cx += measureWidth(seg.text);

                if (seg.tooltip) {
                    cx += BADGE_PAD;
                    badges.push({
                        x: cx,
                        y: ly + 14 * 0.35 - BADGE_SIZE + 2,
                        tooltip: seg.tooltip,
                    });
                    cx += BADGE_SIZE + BADGE_PAD;
                }
            });

            if (i === 0 && node.hasPage) {
                cx += BADGE_PAD;
                tspans.push({
                    x: cx + PAGE_PLUS_RADIUS,
                    y: ly,
                    text: "+",
                    plus: true,
                });
                cx += PAGE_PLUS_DIAMETER;
            }
        });

        return { lineRects, tspans, badges };
    }

    // Measure once the fonts are ready. Builds a temporary hidden SVG inside the
    // container so measurement inherits the real CSS (uppercase, letter-spacing).
    const measure: Attachment<HTMLDivElement> = (containerEl) => {
        let cancelled = false;

        document.fonts.ready.then(() => {
            if (cancelled) return;

            const svg = document.createElementNS(SVG_NS, "svg");
            svg.setAttribute("width", "0");
            svg.setAttribute("height", "0");
            svg.style.position = "absolute";
            svg.style.visibility = "hidden";
            containerEl.appendChild(svg);

            const nodes: NodeData[] = allNodes.map((d) => ({
                ...d,
                bbox: { ...d.bbox },
                lineData: d.lineData.map((l) => ({ ...l })),
            }));

            const measureEl = document.createElementNS(SVG_NS, "text");
            measureEl.setAttribute("font-size", "14");
            measureEl.setAttribute("opacity", "0");
            svg.appendChild(measureEl);
            const measureWidth = (str: string) => {
                measureEl.textContent = str;
                return measureEl.getComputedTextLength();
            };

            const measureLineWidth = (
                line: NodeData["lineData"][number],
                isFirst: boolean,
                hasPage: boolean,
            ) =>
                line.segments.reduce((sum, seg) => {
                    let w = measureWidth(seg.text);
                    if (seg.tooltip) w += BADGE_PAD * 2 + BADGE_SIZE;
                    return sum + w;
                }, 0) +
                (isFirst && hasPage ? BADGE_PAD + PAGE_PLUS_DIAMETER : 0);

            measureNodes(nodes, svg, LINE_H, PAD_Y);

            nodes.forEach((d) => {
                if (d.lineData && d.lineData.length) {
                    d.lineData.forEach((line, i) => {
                        line.width = measureLineWidth(
                            line,
                            i === 0,
                            d.hasPage ?? false,
                        );
                    });
                    const maxW = Math.max(...d.lineData.map((l) => l.width));
                    d.bbox.width = maxW;
                    d.rectW = maxW;
                }
                d.render = buildNodeRenderModel(d, measureWidth);
            });

            svg.remove();
            measured = nodes;
        });

        return () => {
            cancelled = true;
        };
    };

    // Position the measured nodes for the current container size. Pure: clones so
    // computeLayout's x/y writes never touch the measured state.
    const positioned = $derived.by<NodeData[]>(() => {
        if (!measured.length || cw <= 0) return [];
        const width = cw - MARGIN.left - MARGIN.right;
        const height = ch;
        const nodes = measured.map((d) => ({ ...d }));
        const layoutHeight = Math.max(0, height - ROW_GUIDE_TOP_INSET);
        computeLayout(
            nodes,
            COLS.length,
            Math.max(0, width - DIAGRAM_LEFT_OFFSET),
            layoutHeight,
        );
        nodes.forEach((d) => {
            d.y += ROW_GUIDE_TOP_INSET;
            d.x += DIAGRAM_LEFT_OFFSET;
        });
        return nodes;
    });

    const rowGuideLabels = $derived.by(() => {
        const out: { row: number; y: number; label: string }[] = [];
        for (let row = 0; row < COLS.length; row++) {
            if (ROW_GUIDE_LABELS[row] == null) continue;
            const rowNodes = positioned.filter((d) => d.row === row);
            if (!rowNodes.length) continue;
            const rowTopY = Math.min(...rowNodes.map((d) => d.y + d.rectY));
            out.push({
                row,
                y: rowTopY - ROW_GUIDE_LABEL_GAP,
                label: ROW_GUIDE_LABELS[row] ?? "",
            });
        }
        return out;
    });

    const rowArrows = $derived.by(() => {
        const out: { row: number; x: number; y: number }[] = [];
        for (let row = 0; row < COLS.length; row++) {
            const rowNodes = positioned.filter((d) => d.row === row);
            if (!rowNodes.length) continue;
            const firstTextLineY = Math.min(
                ...rowNodes.map((d) => {
                    const textBlockH = (d.lineData.length - 1) * LINE_H;
                    return d.y - textBlockH / 2;
                }),
            );
            out.push({ row, x: 0, y: firstTextLineY - ROW_ARROW_HEIGHT / 2 });
        }
        return out;
    });

    // Flows indexed by node they pass through, so hover is O(matching flows).
    const flowsByNode = $derived.by(() => {
        const map = new SvelteMap<string, Flow[]>();
        uniqueFlows.forEach((f) => {
            f.path.forEach((label, row) => {
                const key = nodeKey(row, label);
                const bucket = map.get(key);
                if (bucket) bucket.push(f);
                else map.set(key, [f]);
            });
        });
        return map;
    });

    const positionedByNode = $derived.by(() => {
        const map = new SvelteMap<string, NodeData>();
        positioned.forEach((node) => {
            map.set(nodeKey(node.row, node.label), node);
        });
        return map;
    });

    const matchingFlows = $derived(
        hoveredNode
            ? (flowsByNode.get(nodeKey(hoveredNode.row, hoveredNode.label)) ??
                  [])
            : [],
    );
    const matchSet = $derived(new Set(matchingFlows));

    // Lanes and corner radii only make sense relative to the flows on screen,
    // so the generator runs over the currently-shown (hovered) flows: one flow
    // needs no offset, two only separate from each other, and so on.
    const flowGen = $derived(
        positioned.length && matchingFlows.length
            ? createFlowPathGenerator(
                  positioned,
                  matchingFlows,
                  isClusterNodeFn,
                  {
                      lineH: LINE_H,
                      clusterPadLeft: CLUSTER_PAD_LEFT,
                      cornerR: CORNER_R,
                      stubLen: STUB_LEN,
                  },
              )
            : null,
    );

    // Per-line highlight fill: cluster nodes only color the member rows
    // targeted by the matching flows; regular nodes color every line.
    const lineFill = $derived.by(() => {
        const fill = new SvelteMap<string, string>();
        if (!hoveredNode) return fill;
        const counts = new SvelteMap<string, Record<number, number>>();

        const addCount = (key: string, group: number) => {
            const c = counts.get(key);
            if (c) c[group] = (c[group] || 0) + 1;
            else counts.set(key, { [group]: 1 });
        };

        matchingFlows.forEach((f) => {
            f.path.forEach((label, row) => {
                const key = nodeKey(row, label);
                const node = positionedByNode.get(key);
                if (!node) return;

                if (isClusterNodeFn(row, label)) {
                    const rawVal = f.rawClusterVals.get(row);
                    const range = rawVal
                        ? node.memberRanges?.get(rawVal)
                        : null;
                    if (!range) return;

                    for (
                        let lineIndex = range.start;
                        lineIndex <= range.end;
                        lineIndex += 1
                    ) {
                        addCount(nodeLineKey(row, label, lineIndex), f.group);
                    }
                    return;
                }

                for (
                    let lineIndex = 0;
                    lineIndex < node.lineData.length;
                    lineIndex += 1
                ) {
                    addCount(nodeLineKey(row, label, lineIndex), f.group);
                }
            });
        });
        counts.forEach((c, key) => {
            const topGroup = Object.entries(c).sort(
                (a, b) => b[1] - a[1],
            )[0][0];
            const color = GROUP_COLORS[+topGroup - 1];
            if (color) fill.set(key, color);
        });
        return fill;
    });

    function dasharrayFor(flow: Flow): string | undefined {
        if (!flowGen || !hoveredNode) return undefined;
        const polyline = flowGen.polyline(flow);
        if (!polyline) return undefined;
        const total = polyline.totalLength;
        if (!total) return undefined;

        const origin = nearestLengthOnPolyline(
            polyline,
            hoveredNode.x,
            hoveredNode.y,
        );
        const initialStart = Math.max(
            0,
            origin - FLOW_INITIAL_VISIBLE_LENGTH / 2,
        );
        const initialEnd = Math.min(
            total,
            origin + FLOW_INITIAL_VISIBLE_LENGTH / 2,
        );

        const t = progress.current;
        const start = initialStart * (1 - t);
        const end = initialEnd + (total - initialEnd) * t;
        const visible = Math.max(0.1, end - start);
        const rest = Math.max(0, total - end);
        return `0 ${start} ${visible} ${rest}`;
    }

    function enterNode(node: NodeData) {
        hoveredNode = node;
        onPageHoverChange(node.pageRoute ?? null);
        progress.set(0, { duration: 0 });
        progress.set(1);
    }

    function leaveNode() {
        hoveredNode = null;
        onPageHoverChange(null);
    }

    function clickNode(event: MouseEvent, node: NodeData) {
        if (!node.pageRoute) return;
        event.stopPropagation();
        // Stash any target section out-of-band and navigate to the BARE route —
        // an identical plain push to every other node, so the slide-up is
        // untouched. A URL hash would fire SvelteKit's native scroll mid-nav and
        // kill the animation; instead the overlay scrolls itself once settled.
        const hashAt = node.pageRoute.indexOf("#");
        if (hashAt !== -1) setPendingScroll(node.pageRoute.slice(hashAt));
        const path = (
            hashAt === -1 ? node.pageRoute : node.pageRoute.slice(0, hashAt)
        ) as Pathname;
        void goto(resolve(path)).finally(() => onPageHoverChange(null));
    }

    function clickBadge(event: MouseEvent, tooltip: TooltipData) {
        event.stopPropagation();
        const rect = (
            event.currentTarget as SVGGElement
        ).getBoundingClientRect();
        onOpenTooltip(tooltip, rect.left, rect.top);
    }
</script>

<div
    class="sankey-container"
    bind:clientWidth={cw}
    bind:clientHeight={ch}
    {@attach measure}
>
    {#if positioned.length}
        <svg width={cw} height={ch}>
            <g transform="translate({MARGIN.left},{MARGIN.top})">
                <g class="row-guide-labels">
                    {#each rowGuideLabels as l (l.row)}
                        <text class="row-guide-label" x="0" y={l.y}
                            >{l.label}</text
                        >
                    {/each}
                </g>

                <g class="row-arrows">
                    {#each rowArrows as a (a.row)}
                        <image
                            class="row-arrow"
                            href={ROW_ARROW_HREF}
                            width={ROW_ARROW_WIDTH}
                            height={ROW_ARROW_HEIGHT}
                            x={a.x}
                            y={a.y}
                        />
                    {/each}
                </g>

                <g class="flows">
                    {#each uniqueFlows as flow, i (i)}
                        {@const match = matchSet.has(flow)}
                        <path
                            d={flowGen ? flowGen.pathD(flow) : ""}
                            fill="none"
                            stroke={GROUP_COLORS[flow.group - 1]}
                            stroke-width={match ? 2 : 1}
                            stroke-opacity={match ? 0.9 : 0}
                            stroke-dasharray={match ? dasharrayFor(flow) : null}
                        />
                    {/each}
                </g>

                <g class="nodes">
                    {#each positioned as node (nodeKey(node.row, node.label))}
                        <g
                            class="node"
                            class:has-page={node.pageRoute}
                            transform="translate({node.x},{node.y})"
                            role="presentation"
                            onmouseenter={() => enterNode(node)}
                            onmouseleave={leaveNode}
                            onclick={(e) => clickNode(e, node)}
                        >
                            {#each node.render?.lineRects ?? [] as r, lineIndex (nodeLineKey(node.row, node.label, lineIndex))}
                                <rect
                                    class="line-rect"
                                    x={r.x}
                                    y={r.y}
                                    width={r.width}
                                    height={r.height}
                                    fill={lineFill.get(
                                        nodeLineKey(
                                            node.row,
                                            node.label,
                                            lineIndex,
                                        ),
                                    ) ?? "transparent"}
                                />
                            {/each}

                            {#each node.render?.tspans.filter((t) => t.plus) ?? [] as t (renderKey(t.x, t.y, "plus"))}
                                <circle
                                    class="page-plus-circle"
                                    cx={t.x}
                                    cy={t.y}
                                    r={PAGE_PLUS_RADIUS}
                                    stroke="black"
                                />
                            {/each}

                            <text
                                text-anchor="start"
                                font-size="14"
                                fill="#333"
                            >
                                {#each node.render?.tspans ?? [] as t (renderKey(t.x, t.y, t.text))}
                                    <tspan
                                        class:page-plus={t.plus}
                                        x={t.x}
                                        y={t.y}
                                        dy={t.plus ? "0.25em" : "0.35em"}
                                        fill={t.plus ? "white" : null}
                                        text-anchor={t.plus ? "middle" : null}
                                        >{t.text}</tspan
                                    >
                                {/each}
                            </text>

                            {#each node.render?.badges ?? [] as b (renderKey(b.x, b.y, b.tooltip.id))}
                                <g
                                    class="badge"
                                    class:badge-active={activeTooltipId ===
                                        b.tooltip.id}
                                    transform="translate({b.x},{b.y})"
                                    role="presentation"
                                    onclick={(e) => clickBadge(e, b.tooltip)}
                                >
                                    <rect
                                        class="badge-box"
                                        width={BADGE_SIZE}
                                        height={BADGE_SIZE}
                                    />
                                    <text
                                        class="badge-label"
                                        x={BADGE_SIZE / 2}
                                        y={BADGE_SIZE / 2}
                                        text-anchor="middle"
                                        dominant-baseline="central"
                                        >{b.tooltip.id}</text
                                    >
                                </g>
                            {/each}
                        </g>
                    {/each}
                </g>
            </g>
        </svg>
    {/if}
</div>

<style>
    .sankey-container {
        width: 100%;
        height: 100%;
    }

    .sankey-container :global(svg text) {
        font-family: "Helvetica Neue", sans-serif;
        font-size: var(--text-base);
        text-transform: uppercase;
        pointer-events: none;
        user-select: none;
    }

    .sankey-container :global(svg .badge-label) {
        fill: black;
        font-size: var(--text-base);
    }

    .sankey-container :global(svg .badge-box) {
        fill: transparent;
        stroke: black;
        stroke-width: 1;
    }

    .sankey-container :global(svg .badge:hover .badge-box),
    .sankey-container :global(svg .badge.badge-active .badge-box) {
        fill: black;
    }

    .sankey-container :global(svg .badge:hover .badge-label),
    .sankey-container :global(svg .badge.badge-active .badge-label) {
        fill: white;
    }

    .sankey-container :global(svg .row-guide-label) {
        fill: var(--text-on-dark);
        font-size: 11px;
        text-transform: lowercase;
    }

    .sankey-container :global(svg .badge) {
        pointer-events: all;
        cursor: pointer;
    }

    .sankey-container :global(svg .has-page) {
        cursor: pointer;
    }

    .sankey-container :global(svg .has-page > text tspan:not(.page-plus)) {
        text-decoration: underline;
    }
</style>
