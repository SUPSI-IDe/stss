<script lang="ts">
    import { BADGE_SIZE } from "$lib/constants.js";
    import { resolve } from "$app/paths";
    import type { Pathname } from "$app/types";
    import { PAGE_PLUS_RADIUS, isMobileRootNode } from "$lib/diagram/config.js";
    import { nodeKey, nodeLineKey, renderKey } from "$lib/diagram/model.js";
    import type { NodeData, TooltipData } from "$lib/types";

    let {
        node,
        lineFill,
        activeTooltipId,
        mobile,
        selectedNodeKey,
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
        node: NodeData;
        lineFill: Map<string, string>;
        activeTooltipId: number | null;
        mobile: boolean;
        selectedNodeKey: string | null;
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

<g
    class="node"
    class:has-page={node.pageRoute}
    data-node-row={node.row}
    data-node-label={node.label}
    transform="translate({node.x},{node.y})"
>
    {#snippet contents()}
        {#each node.render?.lineRects ?? [] as rect, lineIndex (nodeLineKey(node.row, node.label, lineIndex))}
            <rect
                class="line-rect"
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={lineFill.get(nodeLineKey(node.row, node.label, lineIndex)) ?? "transparent"}
            />
        {/each}

        {#each node.render?.tspans.filter((tspan) => tspan.plus) ?? [] as tspan (renderKey(tspan.x, tspan.y, "plus"))}
            <circle
                class="page-plus-circle"
                cx={tspan.x}
                cy={tspan.y}
                r={PAGE_PLUS_RADIUS}
                stroke="black"
            />
        {/each}

        <text text-anchor="start" font-size="14" fill="#333">
            {#each node.render?.tspans ?? [] as tspan (renderKey(tspan.x, tspan.y, tspan.text))}
                <tspan
                    class:page-plus={tspan.plus}
                    x={tspan.x}
                    y={tspan.y}
                    dy={tspan.plus ? "0.25em" : "0.35em"}
                    fill={tspan.plus ? "white" : null}
                    text-anchor={tspan.plus ? "middle" : null}>{tspan.text}</tspan
                >
            {/each}
        </text>
    {/snippet}

    {#if roleForNode(node) === "link"}
        <a
            class="node-action"
            href={resolve(hrefForNode(node))}
            aria-label={ariaLabelForNode(node)}
            onmouseenter={() => onEnter(node)}
            onmouseleave={onLeave}
            onfocus={() => onFocus(node)}
            onblur={onBlur}
            onclick={(event) => onClick(event, node)}
        >
            {@render contents()}
        </a>
    {:else}
        <g
            class="node-action"
            role="button"
            tabindex={tabIndexForNode(node)}
            aria-label={ariaLabelForNode(node)}
            aria-expanded={mobile && isMobileRootNode(node.label)
                ? selectedNodeKey === nodeKey(node.row, node.label)
                : undefined}
            onmouseenter={() => onEnter(node)}
            onmouseleave={onLeave}
            onfocus={() => onFocus(node)}
            onblur={onBlur}
            onclick={(event) => onClick(event, node)}
            onkeydown={(event) => onKeydown(event, node)}
        >
            {@render contents()}
        </g>
    {/if}

    {#each node.render?.badges ?? [] as badge (renderKey(badge.x, badge.y, badge.tooltip.id))}
        <g
            class="badge"
            class:badge-active={activeTooltipId === badge.tooltip.id}
            transform="translate({badge.x},{badge.y})"
            role="button"
            tabindex="0"
            aria-label={`Open definition ${badge.tooltip.id}: ${badge.tooltip.label}`}
            onmouseenter={() => onEnter(node)}
            onmouseleave={onLeave}
            onclick={(event) => onOpenBadge(event, badge.tooltip)}
            onkeydown={(event) => onKeydownBadge(event, badge.tooltip)}
        >
            <rect class="badge-box" width={BADGE_SIZE} height={BADGE_SIZE} />
            <text
                class="badge-label"
                x={BADGE_SIZE / 2}
                y={BADGE_SIZE / 2}
                text-anchor="middle"
                dominant-baseline="central">{badge.tooltip.id}</text
            >
        </g>
    {/each}
</g>
