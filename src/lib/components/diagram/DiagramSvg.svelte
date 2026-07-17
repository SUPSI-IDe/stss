<script lang="ts">
    import { GROUP_COLORS, MARGIN } from "$lib/constants.js";
    import type { Pathname } from "$app/types";
    import { nodeKey } from "$lib/diagram/model.js";
    import type { Flow, NodeData, TooltipData } from "$lib/types";
    import DiagramNode from "./DiagramNode.svelte";

    type FlowGenerator = {
        pathD: (flow: Flow) => string;
        polyline: (flow: Flow) =>
            | {
                  corners: [number, number][];
                  cumLengths: number[];
                  totalLength: number;
              }
            | undefined;
    };

    let {
        width,
        height,
        mobile,
        selectedNodeKey,
        positioned,
        rowGuideLabels,
        rowArrows,
        flows,
        matchingFlows,
        flowGenerator,
        lineFill,
        activeTooltipId,
        dasharrayFor,
        onReset,
        roleForNode,
        hrefForNode,
        ariaLabelForNode,
        tabIndexForNode,
        onEnter,
        onLeave,
        onFocus,
        onBlur,
        onClick,
        onKeydown,
        onOpenBadge,
        onKeydownBadge,
    }: {
        width: number;
        height: number;
        mobile: boolean;
        selectedNodeKey: string | null;
        positioned: NodeData[];
        rowGuideLabels: { row: number; x: number; y: number; label: string }[];
        rowArrows: { row: number; x: number; y: number }[];
        flows: Flow[];
        matchingFlows: Set<Flow>;
        flowGenerator: FlowGenerator | null;
        lineFill: Map<string, string>;
        activeTooltipId: number | null;
        dasharrayFor: (flow: Flow) => string | undefined;
        onReset: () => void;
        roleForNode: (node: NodeData) => "button" | "link";
        hrefForNode: (node: NodeData) => Pathname;
        ariaLabelForNode: (node: NodeData) => string;
        tabIndexForNode: (node: NodeData) => number;
        onEnter: (node: NodeData) => void;
        onLeave: () => void;
        onFocus: (node: NodeData) => void;
        onBlur: () => void;
        onClick: (event: MouseEvent, node: NodeData) => void;
        onKeydown: (event: KeyboardEvent, node: NodeData) => void;
        onOpenBadge: (event: MouseEvent | KeyboardEvent, tooltip: TooltipData) => void;
        onKeydownBadge: (event: KeyboardEvent, tooltip: TooltipData) => void;
    } = $props();
</script>

<svg
    class="diagram-svg"
    class:mobile-expanded={mobile && Boolean(selectedNodeKey)}
    {width}
    {height}
    role="group"
    aria-labelledby="flow-diagram-title flow-diagram-description"
>
    <title id="flow-diagram-title">Small data flow diagram</title>
    <desc id="flow-diagram-description">
        Explore relationships between the repository's data practices. Focus a
        node to reveal its flows and activate linked nodes to open their pages.
    </desc>
    <rect
        class="diagram-reset-surface"
        {width}
        {height}
        fill="transparent"
        role="presentation"
        aria-hidden="true"
        onclick={onReset}
    />
    <g transform="translate({MARGIN.left},{MARGIN.top})">
        <g class="row-guide-labels">
            {#each rowGuideLabels as label (label.row)}
                <text class="row-guide-label" x={label.x} y={label.y}>{label.label}</text>
            {/each}
        </g>

        <g class="row-arrows">
            {#each rowArrows as arrow (arrow.row)}
                <g class="row-arrow" transform="translate({arrow.x},{arrow.y})" aria-hidden="true">
                    <path d="M4.22 6.54L6.31 4.5H0V3.06H6.33L4.22 1L5.2 0L8.95 3.77L5.2 7.54L4.22 6.54Z" />
                    <path d="M1.44141 3.06L1.44141 0L0.00140619 0L0.00140619 3.06H1.44141Z" />
                </g>
            {/each}
        </g>

        <g class="flows">
            {#each flows as flow, index (index)}
                {@const matches = matchingFlows.has(flow)}
                <path
                    d={flowGenerator && matches ? flowGenerator.pathD(flow) : ""}
                    aria-hidden="true"
                    fill="none"
                    stroke={GROUP_COLORS[flow.group - 1]}
                    stroke-width={matches ? 2 : 1}
                    stroke-opacity={matches ? 0.9 : 0}
                    stroke-dasharray={matches ? dasharrayFor(flow) : null}
                />
            {/each}
        </g>

        <g class="nodes">
            {#each positioned as node (nodeKey(node.row, node.label))}
                <DiagramNode
                    {node}
                    {lineFill}
                    {activeTooltipId}
                    {mobile}
                    {selectedNodeKey}
                    {roleForNode}
                    {hrefForNode}
                    {ariaLabelForNode}
                    {tabIndexForNode}
                    {onEnter}
                    {onLeave}
                    {onFocus}
                    {onBlur}
                    {onClick}
                    {onKeydown}
                    {onOpenBadge}
                    {onKeydownBadge}
                />
            {/each}
        </g>
    </g>
</svg>

<style>
    .diagram-svg :global(text) {
        font-family: "Helvetica Neue", sans-serif;
        font-size: var(--text-base);
        text-transform: uppercase;
        pointer-events: none;
        user-select: none;
    }

    .diagram-svg :global(.badge-label) {
        fill: black;
        font-size: var(--text-base);
    }

    .diagram-svg :global(.badge-box) {
        fill: transparent;
        stroke: black;
        stroke-width: 1;
    }

    .diagram-svg :global(.badge:hover .badge-box),
    .diagram-svg :global(.badge.badge-active .badge-box),
    .diagram-svg :global(.badge:focus-visible .badge-box) {
        fill: black;
    }

    .diagram-svg :global(.badge:hover .badge-label),
    .diagram-svg :global(.badge.badge-active .badge-label),
    .diagram-svg :global(.badge:focus-visible .badge-label) {
        fill: white;
    }

    .diagram-svg :global(.node-action:focus),
    .diagram-svg :global(.badge:focus) {
        outline: none;
    }

    .diagram-svg :global(.node-action:focus-visible .line-rect),
    .diagram-svg :global(.badge:focus-visible .badge-box) {
        stroke: var(--text-black);
        stroke-width: 2;
    }

    .row-guide-label {
        fill: var(--text-tertiary-on-light);
        font-size: 11px;
        text-transform: lowercase;
    }

    .row-arrow {
        fill: black;
    }

    .diagram-reset-surface {
        pointer-events: all;
    }

    .flows,
    .row-guide-labels,
    .row-arrows {
        pointer-events: none;
    }

    .diagram-svg :global(.badge) {
        pointer-events: all;
        cursor: pointer;
    }

    .diagram-svg :global(.has-page) {
        cursor: pointer;
    }

    .diagram-svg :global(.has-page .node-action > text tspan:not(.page-plus)) {
        text-decoration: underline;
    }

    @media (max-width: 800px) {
        .row-guide-labels,
        .row-arrows {
            display: none;
        }

        .mobile-expanded .row-guide-labels,
        .mobile-expanded .row-arrows {
            display: inline;
        }
    }
</style>
