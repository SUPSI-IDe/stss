<script lang="ts">
    import { MediaQuery } from "svelte/reactivity";
    import {
        GROUP_COLORS,
        CLUSTER_COLS,
        LINE_H,
        CORNER_R,
        CLUSTER_PAD_LEFT,
        STUB_LEN,
    } from "$lib/constants.js";

    import { isClusterNode } from "$lib/clusterProcessing.js";
    import {
        FLOW_INITIAL_VISIBLE_LENGTH,
        isMobileRootNode,
    } from "$lib/diagram/config.js";
    import {
        buildLineFill,
        createFlowIndex,
        flowsForNode,
        indexNodes,
        nodeKey,
        visibleNodeKeys,
    } from "$lib/diagram/model.js";
    import {
        buildRowArrows,
        buildRowGuideLabels,
        positionNodes,
    } from "$lib/diagram/layout.js";
    import { DiagramInteraction } from "$lib/diagram/interaction.svelte";
    import { createNodeMeasurementAttachment } from "$lib/diagram/measurement";
    import {
        createFlowPathGenerator,
        nearestLengthOnPolyline,
    } from "$lib/geometry.js";
    import type { NodeData, Flow, TooltipData } from "$lib/types";
    import DiagramSvg from "./DiagramSvg.svelte";
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

    // Measured node data (rect metrics + node-relative draw model), set once
    // after fonts load. x/y stay at 0 here — layout positions them below.
    let measured = $state<NodeData[]>([]);
    let mobileMeasuredByRoot = $state.raw<Map<string, NodeData[]>>(new Map());
    // Container dimensions, kept in sync via bind:clientWidth/clientHeight.
    let cw = $state(0);
    let ch = $state(0);
    let mobileLayoutAnchorY = $state(0);

    const isClusterNodeFn = (colIdx: number, label: string) =>
        isClusterNode(colIdx, label, CLUSTER_COLS, realClusterLabelSet);
    const interaction = new DiagramInteraction({
        isMobile: () => mobileViewport.current,
        isMobileRootNode,
        onOpenTooltip: (tooltip, anchorX, anchorY) =>
            onOpenTooltip(tooltip, anchorX, anchorY),
        onPageHoverChange: (pageRoute) => onPageHoverChange(pageRoute),
        onMobileSelectionChange: (hasSelection) =>
            onMobileSelectionChange(hasSelection),
    });
    const flowsByNode = $derived(createFlowIndex(uniqueFlows));
    const measure = createNodeMeasurementAttachment({
        getNodes: () => allNodes,
        getFlowIndex: () => flowsByNode,
        isMobileRootNode,
        onMeasured: (nodes) => (measured = nodes),
        onMobileMeasured: (variants) => (mobileMeasuredByRoot = variants),
        onMobileAnchorChange: (anchorY) => (mobileLayoutAnchorY = anchorY),
    });

    const mobileMatchingFlows = $derived.by(() => {
        if (
            !interaction.mobileSelectedNodeKey ||
            !interaction.mobileHighlightActive
        )
            return [];
        return flowsForNode(flowsByNode, interaction.mobileSelectedNodeKey);
    });

    const mobileVisibleNodeKeys = $derived(
        visibleNodeKeys(
            allNodes,
            interaction.mobileSelectedNodeKey,
            flowsByNode,
            isMobileRootNode,
        ),
    );

    const positioned = $derived(
        positionNodes({
            measured,
            mobileMeasured: interaction.mobileSelectedNodeKey
                ? (mobileMeasuredByRoot.get(
                      interaction.mobileSelectedNodeKey,
                  ) ?? null)
                : null,
            visibleKeys: mobileVisibleNodeKeys,
            isMobile: mobileViewport.current,
            width: cw,
            height: ch,
            anchorY: mobileLayoutAnchorY,
            nodeKey,
        }),
    );

    const rowGuideLabels = $derived(
        buildRowGuideLabels(positioned, mobileViewport.current),
    );
    const rowArrows = $derived(
        buildRowArrows(positioned, mobileViewport.current, LINE_H),
    );
    const positionedByNode = $derived(indexNodes(positioned));

    const interactionNode = $derived(
        mobileViewport.current &&
            interaction.mobileSelectedNodeKey &&
            interaction.mobileHighlightActive
            ? (positionedByNode.get(interaction.mobileSelectedNodeKey) ?? null)
            : interaction.hoveredNode,
    );

    const matchingFlows = $derived(
        mobileViewport.current
            ? mobileMatchingFlows
            : interaction.hoveredNode
            ? (flowsByNode.get(
                  nodeKey(
                      interaction.hoveredNode.row,
                      interaction.hoveredNode.label,
                  ),
              ) ?? [])
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
    const lineFill = $derived(
        interactionNode
            ? buildLineFill(
                  matchingFlows,
                  positionedByNode,
                  isClusterNodeFn,
                  GROUP_COLORS,
              )
            : new Map<string, string>(),
    );

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

        const t = interaction.progress.current;
        const start = initialStart * (1 - t);
        const end = initialEnd + (total - initialEnd) * t;
        const visible = Math.max(0.1, end - start);
        const rest = Math.max(0, total - end);
        return `0 ${start} ${visible} ${rest}`;
    }

</script>

<div
    class="sankey-container"
    bind:clientWidth={cw}
    bind:clientHeight={ch}
    {@attach measure}
>
    {#if mobileViewport.current && interaction.mobileSelectedNodeKey}
        <button
            type="button"
            class="diagram-reset"
            onclick={interaction.resetMobileView}>Reset diagram</button
        >
    {/if}
    {#if positioned.length}
        <DiagramSvg
            width={cw}
            height={ch}
            mobile={mobileViewport.current}
            selectedNodeKey={interaction.mobileSelectedNodeKey}
            {positioned}
            {rowGuideLabels}
            {rowArrows}
            flows={uniqueFlows}
            matchingFlows={matchSet}
            flowGenerator={flowGen}
            {lineFill}
            {activeTooltipId}
            {dasharrayFor}
            onReset={interaction.resetMobileView}
            roleForNode={interaction.nodeRole}
            hrefForNode={interaction.nodeHref}
            ariaLabelForNode={interaction.nodeAriaLabel}
            tabIndexForNode={interaction.nodeTabIndex}
            onEnter={interaction.enterNode}
            onLeave={interaction.leaveNode}
            onFocus={interaction.focusNode}
            onBlur={interaction.blurNode}
            onClick={interaction.clickNode}
            onKeydown={interaction.keydownNode}
            onOpenBadge={interaction.openBadge}
            onKeydownBadge={interaction.keydownBadge}
        />
    {/if}
</div>

<style>
    .sankey-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .sankey-container :global(.diagram-measurement text) {
        font-family: "Helvetica Neue", sans-serif;
        font-size: var(--text-base);
        text-transform: uppercase;
    }

    .diagram-reset {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    .diagram-reset:focus-visible {
        z-index: 2;
        top: 8px;
        right: 8px;
        width: auto;
        height: auto;
        margin: 0;
        padding: 4px 8px;
        clip-path: none;
        background: var(--text-black);
        color: var(--bg);
        outline: 2px solid var(--bg);
        outline-offset: 2px;
    }
</style>
