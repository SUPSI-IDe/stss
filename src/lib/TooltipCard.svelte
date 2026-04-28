<script lang="ts">
    import { onMount } from 'svelte';
    import type { TooltipData } from './types';
    import { BADGE_SIZE } from './constants.js';

    let { id, definition, x = 0, y = 0, onclose }: Omit<TooltipData, 'label'> & {
        label?: string;
        x?: number;
        y?: number;
        onclose: () => void;
    } = $props();

    const TOOLTIP_W = 400;
    const EDGE_MARGIN = 8;

    let posX = $state<number>(0);
    let posY = $state<number>(0);
    let flipX = $state<boolean>(false);
    let open = $state<boolean>(false);
    let closing = $state<boolean>(false);

    function requestClose() {
        if (closing) return;
        closing = true;
        open = false;
    }

    function handleTransitionEnd(e: TransitionEvent) {
        if (e.propertyName !== 'clip-path') return;
        if (closing) onclose();
    }

    onMount(() => {
        const overflowsRight = x + TOOLTIP_W > window.innerWidth - EDGE_MARGIN;
        flipX = overflowsRight;
        posX = overflowsRight ? x + BADGE_SIZE - TOOLTIP_W : x;
        posY = y;
        requestAnimationFrame(() => {
            open = true;
        });
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="tooltip-card"
    class:open
    class:flip-x={flipX}
    style="left:{posX}px;top:{posY}px"
    ontransitionend={handleTransitionEnd}
>
    <div class="badge-number">{id}</div>
    <button class="tooltip-close" onclick={requestClose} aria-label="Close">&#x2715;</button>
    <div class="tooltip-body">{definition}</div>
</div>

<style>
    .tooltip-card {
        position: fixed;
        z-index: 100;
        background:var(--text-black);
        color: var(--bg);
        width: 400px;
        padding: 20px 12px;
        user-select: none;
        clip-path: inset(0 calc(100% - 14px) calc(100% - 14px) 0);
        transition: clip-path 260ms cubic-bezier(0.2, 0, 0, 1);
        will-change: clip-path;
    }

    .tooltip-card.flip-x {
        clip-path: inset(0 0 calc(100% - 14px) calc(100% - 14px));
    }

    .tooltip-card.open {
        clip-path: inset(0 0 0 0);
    }

    .badge-number {
        position: absolute;
        top: 0;
        left: 0;
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg);
        font-family: 'Helvetica Neue', sans-serif;
        font-size: 13.38px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        line-height: 1;
        pointer-events: none;
    }

    .tooltip-card.flip-x .badge-number {
        left: auto;
        right: 0;
    }

    .tooltip-close {
        position: absolute;
        top: 8px;
        right: 10px;
        background: none;
        border: none;
        color: var(--bg);
        font-size: 13.38px;
        cursor: pointer;
        line-height: 1;
    }

    .tooltip-card.flip-x .tooltip-close {
        right: auto;
        left: 10px;
    }

    .tooltip-body {
        font-family: 'Helvetica Neue', sans-serif;
        font-size: 12px;
        line-height: 1.11;
        margin-top: 10px;
    }
</style>
