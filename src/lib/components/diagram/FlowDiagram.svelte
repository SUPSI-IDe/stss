<script lang="ts">
    import type { Attachment } from "svelte/attachments";
    import { Tween } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { MediaQuery, SvelteMap, SvelteSet } from "svelte/reactivity";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
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
        LAYOUT_SIDE_PADDING,
    } from "$lib/constants.js";

    import { setPendingScroll } from "$lib/overlayScroll";
    import { isClusterNode } from "$lib/clusterProcessing.js";
    import { measureNodes } from "$lib/nodeBuilder.js";
    import { computeLayout } from "$lib/layoutEngine.js";
    import { createSegmenter } from "$lib/textUtils.js";
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
    const ROW_ARROW_HEIGHT = 8;
    // On mobile the arrow rides on the row-guide label's line, so the label is
    // indented past it (arrow width + gap) and the arrow is nudged up onto the
    // label's cap height.
    const ROW_ARROW_WIDTH = 9;
    const MOBILE_ROW_LABEL_INDENT = ROW_ARROW_WIDTH + 4;
    const MOBILE_ROW_ARROW_RISE = 7;
    const PAGE_PLUS_DIAMETER = BADGE_SIZE;
    const PAGE_PLUS_RADIUS = PAGE_PLUS_DIAMETER / 2;
    const SVG_NS = "http://www.w3.org/2000/svg";
    const MOBILE_NODE_GAP = 16;
    const MOBILE_ROOT_ROW = 4;
    const MOBILE_VISIBLE_NODE_LABELS = new Set([
        "thinking",
        "seeing",
        "sharing",
        "sensing",
    ]);
    const mobileViewport = new MediaQuery("max-width: 800px", false);

    let {
        allNodes,
        uniqueFlows,
        realClusterLabelSet,
        activeTooltipId = null,
        onOpenTooltip,
        onPageHoverChange = () => {},
        onMobileSelectionChange = () => {},
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
        onMobileSelectionChange?: (hasSelection: boolean) => void;
    } = $props();

    const nodeKey = (row: number, label: string) => `${row} ${label}`;
    const nodeLineKey = (row: number, label: string, lineIndex: number) =>
        `${nodeKey(row, label)} ${lineIndex}`;
    const renderKey = (x: number, y: number, label: string | number) =>
        `${x} ${y} ${label}`;
    const isMobileRootNode = (label: string) =>
        MOBILE_VISIBLE_NODE_LABELS.has(label.toLowerCase().trim());

    // Measured node data (rect metrics + node-relative draw model), set once
    // after fonts load. x/y stay at 0 here — layout positions them below.
    let measured = $state<NodeData[]>([]);
    let mobileMeasuredByRoot = $state.raw<SvelteMap<string, NodeData[]>>(
        new SvelteMap(),
    );
    // Container dimensions, kept in sync via bind:clientWidth/clientHeight.
    let cw = $state(0);
    let ch = $state(0);
    let mobileLayoutAnchorY = $state(0);

    let hoveredNode = $state<NodeData | null>(null);
    let mobileSelectedNodeKey = $state<string | null>(null);
    let mobileHighlightActive = $state(false);
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

    function wrapToWidth(
        text: string,
        maxWidth: number,
        measureWidth: (str: string) => number,
    ): string[] {
        const words = text.trim().split(/\s+/).filter(Boolean);
        if (!words.length) return [""];

        const lines: string[] = [];
        let current = "";

        const pushWord = (word: string) => {
            if (measureWidth(word) <= maxWidth) {
                current = word;
                return;
            }

            let part = "";
            for (const character of word) {
                if (part && measureWidth(part + character) > maxWidth) {
                    lines.push(part);
                    part = character;
                } else {
                    part += character;
                }
            }
            current = part;
        };

        for (const word of words) {
            if (!current) {
                pushWord(word);
                continue;
            }
            const candidate = `${current} ${word}`;
            if (measureWidth(candidate) <= maxWidth) {
                current = candidate;
            } else {
                lines.push(current);
                current = "";
                pushWord(word);
            }
        }
        if (current) lines.push(current);
        return lines;
    }

    const matchingFlowsForNode = (key: string) =>
        uniqueFlows.filter((flow) =>
            flow.path.some((label, row) => nodeKey(row, label) === key),
        );

    function mobileVisibleKeysForRoot(rootKey: string | null) {
        const keys = new SvelteSet<string>();
        allNodes.forEach((node) => {
            if (isMobileRootNode(node.label)) {
                keys.add(nodeKey(node.row, node.label));
            }
        });
        if (!rootKey) return keys;

        matchingFlowsForNode(rootKey).forEach((flow) => {
            flow.path.forEach((label, row) => keys.add(nodeKey(row, label)));
        });
        return keys;
    }

    // Measure after fonts are ready. A hidden SVG inherits the rendered type
    // styles; mobile variants are rebuilt only when the available width changes.
    const measure: Attachment<HTMLDivElement> = (containerEl) => {
        let cancelled = false;
        let resizeObserver: ResizeObserver | null = null;
        let svg: SVGSVGElement | null = null;

        document.fonts.ready.then(() => {
            if (cancelled) return;

            const measurementSvg = document.createElementNS(SVG_NS, "svg");
            svg = measurementSvg;
            measurementSvg.setAttribute("width", "0");
            measurementSvg.setAttribute("height", "0");
            measurementSvg.style.position = "absolute";
            measurementSvg.style.visibility = "hidden";
            containerEl.appendChild(measurementSvg);

            const measureEl = document.createElementNS(SVG_NS, "text");
            measureEl.setAttribute("font-size", "14");
            measureEl.setAttribute("opacity", "0");
            measurementSvg.appendChild(measureEl);
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

            const cloneNodes = () =>
                allNodes.map((d) => ({
                    ...d,
                    bbox: { ...d.bbox },
                    memberRanges: d.memberRanges
                        ? new SvelteMap(d.memberRanges)
                        : null,
                    lineData: d.lineData.map((line) => ({
                        ...line,
                        segments: line.segments.map((segment) => ({ ...segment })),
                    })),
                }));

            const finalizeNodes = (nodes: NodeData[]) => {
                measureNodes(nodes, measurementSvg, LINE_H, PAD_Y);
                nodes.forEach((d) => {
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
                    d.render = buildNodeRenderModel(d, measureWidth);
                });
            };

            const nodes = cloneNodes();
            finalizeNodes(nodes);

            const tooltipMap = new SvelteMap<string, TooltipData>();
            allNodes.forEach((node) => {
                node.lineData.forEach((line) => {
                    line.segments.forEach((segment) => {
                        if (segment.tooltip) {
                            tooltipMap.set(
                                segment.tooltip.label.toLowerCase().trim(),
                                segment.tooltip,
                            );
                        }
                    });
                });
            });
            const segmentLine = createSegmenter(tooltipMap);
            const updateMobileLayoutAnchor = () => {
                const containerRect = containerEl.getBoundingClientRect();
                const visualViewport = window.visualViewport;
                const viewportCenterY = visualViewport
                    ? visualViewport.offsetTop + visualViewport.height / 2
                    : window.innerHeight / 2;
                const layoutHeight = Math.max(
                    0,
                    containerRect.height - ROW_GUIDE_TOP_INSET,
                );
                mobileLayoutAnchorY = Math.max(
                    0,
                    Math.min(
                        layoutHeight,
                        viewportCenterY -
                            containerRect.top -
                            ROW_GUIDE_TOP_INSET,
                    ),
                );
            };
            updateMobileLayoutAnchor();
            measured = nodes;

            let lastMobileWidth = -1;
            const rebuildMobileMeasurements = (containerWidth: number) => {
                const availableWidth = Math.max(
                    0,
                    containerWidth -
                        MARGIN.left -
                        MARGIN.right -
                        LAYOUT_SIDE_PADDING * 2,
                );
                if (Math.abs(availableWidth - lastMobileWidth) < 0.5) return;
                lastMobileWidth = availableWidth;

                const variants = new SvelteMap<string, NodeData[]>();
                allNodes
                    .filter((node) => isMobileRootNode(node.label))
                    .forEach((rootNode) => {
                        const rootKey = nodeKey(rootNode.row, rootNode.label);
                        const visibleKeys = mobileVisibleKeysForRoot(rootKey);
                        const counts = Array.from(
                            { length: COLS.length },
                            (_, row) =>
                                allNodes.filter(
                                    (node) =>
                                        node.row === row &&
                                        visibleKeys.has(
                                            nodeKey(node.row, node.label),
                                        ),
                                ).length,
                        );
                        const columnWidths = counts.map((count) =>
                            count > 1
                                ? Math.max(
                                      1,
                                      (availableWidth -
                                          MOBILE_NODE_GAP * (count - 1)) /
                                          count,
                                  )
                                : availableWidth,
                        );
                        const mobileNodes = cloneNodes();

                        mobileNodes.forEach((node) => {
                            const key = nodeKey(node.row, node.label);
                            const count = counts[node.row] ?? 0;
                            if (
                                !visibleKeys.has(key) ||
                                count <= 1 ||
                                isMobileRootNode(node.label)
                            ) {
                                return;
                            }

                            const columnWidth = columnWidths[node.row];
                            const pageControlWidth = node.hasPage
                                ? BADGE_PAD + PAGE_PLUS_DIAMETER
                                : 0;
                            const maxTextWidth = Math.max(
                                1,
                                columnWidth - pageControlWidth,
                            );
                            const members = node.memberRanges
                                ? [...node.memberRanges.keys()]
                                : [node.label];
                            const lines: string[] = [];
                            const memberRanges = node.memberRanges
                                ? new SvelteMap<
                                      string,
                                      { start: number; end: number }
                                  >()
                                : null;

                            members.forEach((member) => {
                                const start = lines.length;
                                lines.push(
                                    ...wrapToWidth(
                                        member,
                                        maxTextWidth,
                                        measureWidth,
                                    ),
                                );
                                memberRanges?.set(member, {
                                    start,
                                    end: lines.length - 1,
                                });
                            });

                            node.lines = lines;
                            node.memberRanges = memberRanges;
                            node.lineData = lines.map((line) => ({
                                segments: segmentLine(line),
                                width: 0,
                            }));
                        });
                        finalizeNodes(mobileNodes);

                        mobileNodes.forEach((node) => {
                            const count = counts[node.row] ?? 0;
                            if (
                                count > 1 &&
                                !isMobileRootNode(node.label) &&
                                visibleKeys.has(
                                    nodeKey(node.row, node.label),
                                )
                            ) {
                                node.bbox.width = columnWidths[node.row];
                            }
                        });
                        variants.set(rootKey, mobileNodes);
                    });

                mobileMeasuredByRoot = variants;
            };

            rebuildMobileMeasurements(containerEl.clientWidth);
            resizeObserver = new ResizeObserver(([entry]) => {
                updateMobileLayoutAnchor();
                rebuildMobileMeasurements(entry.contentRect.width);
            });
            resizeObserver.observe(containerEl);
        });

        return () => {
            cancelled = true;
            resizeObserver?.disconnect();
            svg?.remove();
        };
    };

    const mobileMatchingFlows = $derived.by(() => {
        if (!mobileSelectedNodeKey || !mobileHighlightActive) return [];
        return matchingFlowsForNode(mobileSelectedNodeKey);
    });

    const mobileVisibleNodeKeys = $derived.by(() => {
        return mobileVisibleKeysForRoot(mobileSelectedNodeKey);
    });

    // Report whether a root node is selected so the home view can slide its
    // mobile intro out of the way while a flow is on screen.
    $effect(() => {
        onMobileSelectionChange(Boolean(mobileSelectedNodeKey));
    });

    // Position the measured nodes for the current container size. Pure: clones so
    // computeLayout's x/y writes never touch the measured state.
    const positioned = $derived.by<NodeData[]>(() => {
        if (!measured.length || cw <= 0) return [];
        const width = cw - MARGIN.left - MARGIN.right;
        const height = ch;
        const mobileMeasured = mobileSelectedNodeKey
            ? mobileMeasuredByRoot.get(mobileSelectedNodeKey)
            : null;
        const sourceNodes =
            mobileViewport.current && mobileMeasured
                ? mobileMeasured
                : measured;
        const nodes = sourceNodes.map((d) => ({ ...d }));
        const layoutNodes = mobileViewport.current
            ? nodes.filter((node) =>
                  mobileVisibleNodeKeys.has(nodeKey(node.row, node.label)),
              )
            : nodes;
        const layoutHeight = Math.max(0, height - ROW_GUIDE_TOP_INSET);
        const leftOffset = mobileViewport.current ? 0 : DIAGRAM_LEFT_OFFSET;
        const layoutWidth = Math.max(0, width - leftOffset);
        computeLayout(
            layoutNodes,
            COLS.length,
            layoutWidth,
            layoutHeight,
            {
                fitRowsByHeight: mobileViewport.current,
                anchorRow: mobileViewport.current ? MOBILE_ROOT_ROW : undefined,
                anchorY: mobileViewport.current
                    ? mobileLayoutAnchorY
                    : undefined,
            },
        );
        layoutNodes.forEach((d) => {
            d.y += ROW_GUIDE_TOP_INSET;
            d.x += leftOffset;
        });
        return layoutNodes;
    });

    const rowGuideLabels = $derived.by(() => {
        const out: { row: number; x: number; y: number; label: string }[] = [];
        for (let row = 0; row < COLS.length; row++) {
            if (ROW_GUIDE_LABELS[row] == null) continue;
            const rowNodes = positioned.filter((d) => d.row === row);
            if (!rowNodes.length) continue;
            const rowTopY = Math.min(...rowNodes.map((d) => d.y + d.rectY));
            out.push({
                row,
                x: mobileViewport.current ? MOBILE_ROW_LABEL_INDENT : 0,
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
            const rowTopY = Math.min(...rowNodes.map((d) => d.y + d.rectY));
            // On mobile, sit the arrow on the row-guide label's line so it
            // reads as a header prefix instead of overlapping the first node.
            const y = mobileViewport.current
                ? rowTopY - ROW_GUIDE_LABEL_GAP - MOBILE_ROW_ARROW_RISE
                : Math.min(
                      ...rowNodes.map((d) => {
                          const textBlockH = (d.lineData.length - 1) * LINE_H;
                          return d.y - textBlockH / 2;
                      }),
                  ) -
                  ROW_ARROW_HEIGHT / 2;
            out.push({ row, x: 0, y });
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

    const interactionNode = $derived(
        mobileViewport.current &&
            mobileSelectedNodeKey &&
            mobileHighlightActive
            ? (positionedByNode.get(mobileSelectedNodeKey) ?? null)
            : hoveredNode,
    );

    const matchingFlows = $derived(
        mobileViewport.current
            ? mobileMatchingFlows
            : hoveredNode
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
        if (!interactionNode) return fill;
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
        if (!flowGen || !interactionNode) return undefined;
        const polyline = flowGen.polyline(flow);
        if (!polyline) return undefined;
        const total = polyline.totalLength;
        if (!total) return undefined;

        const origin = nearestLengthOnPolyline(
            polyline,
            interactionNode.x,
            interactionNode.y,
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

    function animateFlows() {
        progress.set(0, { duration: 0 });
        progress.set(1);
    }

    function enterNode(node: NodeData) {
        if (mobileViewport.current) return;
        hoveredNode = node;
        onPageHoverChange(node.pageRoute ?? null);
        animateFlows();
    }

    function leaveNode() {
        if (mobileViewport.current) return;
        hoveredNode = null;
        onPageHoverChange(null);
    }

    function clearFlowHighlight() {
        hoveredNode = null;
        mobileHighlightActive = false;
        progress.set(0, { duration: 0 });
        onPageHoverChange(null);
    }

    function clickNode(event: MouseEvent, node: NodeData) {
        if (mobileViewport.current && isMobileRootNode(node.label)) {
            const key = nodeKey(node.row, node.label);
            if (mobileSelectedNodeKey !== key) {
                event.stopPropagation();
                mobileSelectedNodeKey = key;
                mobileHighlightActive = true;
                onPageHoverChange(null);
                animateFlows();
                return;
            }
        }
        if (mobileViewport.current) event.stopPropagation();
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
        clearFlowHighlight();
        void goto(resolve(path)).finally(() => onPageHoverChange(null));
    }

    function resetMobileView() {
        if (!mobileViewport.current || !mobileSelectedNodeKey) return;
        mobileSelectedNodeKey = null;
        clearFlowHighlight();
    }

    function keydownDiagram(event: KeyboardEvent) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        resetMobileView();
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
        <svg
            width={cw}
            height={ch}
            class:mobile-expanded={mobileViewport.current &&
                Boolean(mobileSelectedNodeKey)}
            role="button"
            aria-label="Reset diagram to its initial nodes"
            tabindex={mobileViewport.current && mobileSelectedNodeKey ? 0 : -1}
            onclick={resetMobileView}
            onkeydown={keydownDiagram}
        >
            <g transform="translate({MARGIN.left},{MARGIN.top})">
                <g class="row-guide-labels">
                    {#each rowGuideLabels as l (l.row)}
                        <text class="row-guide-label" x={l.x} y={l.y}
                            >{l.label}</text
                        >
                    {/each}
                </g>

                <g class="row-arrows">
                    {#each rowArrows as a (a.row)}
                        <g
                            class="row-arrow"
                            transform="translate({a.x},{a.y})"
                            aria-hidden="true"
                        >
                            <path
                                d="M4.22 6.54L6.31 4.5H0V3.06H6.33L4.22 1L5.2 0L8.95 3.77L5.2 7.54L4.22 6.54Z"
                            />
                            <path
                                d="M1.44141 3.06L1.44141 0L0.00140619 0L0.00140619 3.06H1.44141Z"
                            />
                        </g>
                    {/each}
                </g>

                <g class="flows">
                    {#each uniqueFlows as flow, i (i)}
                        {@const match = matchSet.has(flow)}
                        <path
                            d={flowGen && match ? flowGen.pathD(flow) : ""}
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
                            data-node-row={node.row}
                            data-node-label={node.label}
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
        fill: var(--text-tertiary-on-light);
        font-size: 11px;
        text-transform: lowercase;
    }

    .sankey-container :global(svg .row-arrow) {
        fill: black;
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

    .sankey-container :global(svg:focus) {
        outline: none;
    }

    @media (max-width: 800px) {
        .sankey-container :global(svg .row-guide-labels),
        .sankey-container :global(svg .row-arrows) {
            display: none;
        }

        .sankey-container :global(svg.mobile-expanded .row-guide-labels),
        .sankey-container :global(svg.mobile-expanded .row-arrows) {
            display: inline;
        }
    }
</style>
