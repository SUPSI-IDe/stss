<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { TooltipData } from '$lib/types';
    import { BADGE_SIZE } from '$lib/constants.js';

    let { id, definition, x = 0, y = 0, mobile = false, onclose }: Omit<TooltipData, 'label'> & {
        x?: number;
        y?: number;
        mobile?: boolean;
        onclose: () => void;
    } = $props();

    const TOOLTIP_W = 400;
    const EDGE_MARGIN = 8;

    let posX = $state<number>(0);
    let posY = $state<number>(0);
    let flipX = $state<boolean>(false);
    let open = $state<boolean>(false);
    let closing = $state<boolean>(false);
    let closeButton = $state<HTMLButtonElement>();
    let returnFocusTo: HTMLElement | SVGElement | null = null;
    let openFrame: number | null = null;

    let bodyId = $derived(`tooltip-definition-${id}`);

    function requestClose() {
        if (closing) return;
        closing = true;
        open = false;
    }

    function handleTransitionEnd(e: TransitionEvent) {
        const prop = mobile ? 'transform' : 'clip-path';
        if (e.propertyName !== prop) return;
        if (closing) onclose();
    }

    function handleWindowKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            requestClose();
            return;
        }
        if (mobile && event.key === 'Tab') {
            event.preventDefault();
            closeButton?.focus();
        }
    }

    onMount(() => {
        returnFocusTo =
            document.activeElement instanceof HTMLElement ||
            document.activeElement instanceof SVGElement
                ? document.activeElement
                : null;
        if (!mobile) {
            const overflowsRight = x + TOOLTIP_W > window.innerWidth - EDGE_MARGIN;
            flipX = overflowsRight;
            posX = overflowsRight ? x + BADGE_SIZE - TOOLTIP_W : x;
            posY = y;
        }
        openFrame = requestAnimationFrame(() => {
            open = true;
            closeButton?.focus();
        });

        return () => {
            if (openFrame !== null) cancelAnimationFrame(openFrame);
        };
    });

    onDestroy(() => {
        returnFocusTo?.focus();
    });
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if mobile}
    <div
        class="tooltip-backdrop"
        class:open
        onclick={requestClose}
        aria-hidden="true"
    ></div>
    <div
        class="tooltip-sheet"
        class:open
        role="dialog"
        aria-modal="true"
        aria-label="Definition {id}"
        aria-describedby={bodyId}
        ontransitionend={handleTransitionEnd}
    >
        <div class="sheet-header">
            <span class="sheet-id">{id}</span>
            <button
                type="button"
                class="sheet-close"
                bind:this={closeButton}
                onclick={requestClose}
                aria-label="Close tooltip {id}"
            >
                <span class="x-mark" aria-hidden="true"></span>
            </button>
        </div>
        <div class="tooltip-body" id={bodyId}>{definition}</div>
    </div>
{:else}
    <div
        class="tooltip-card"
        class:open
        class:flip-x={flipX}
        style="left:{posX}px;top:{posY}px"
        style:--tooltip-w="{TOOLTIP_W}px"
        role="dialog"
        aria-label="Definition {id}"
        aria-describedby={bodyId}
        ontransitionend={handleTransitionEnd}
    >
        <button
            type="button"
            class="tooltip-toggle"
            bind:this={closeButton}
            onclick={requestClose}
            aria-label="Close tooltip {id}"
        >
            {#if closing}
                {id}
            {:else}
                <span class="x-mark" aria-hidden="true"></span>
            {/if}
        </button>
        <div class="tooltip-body" id={bodyId}>{definition}</div>
    </div>
{/if}

<style>
    .tooltip-card {
        position: fixed;
        z-index: 100;
        background:var(--text-black);
        color: var(--bg);
        width: var(--tooltip-w);
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

    .tooltip-toggle {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        padding: 0;
        color: var(--bg);
        font-size: var(--text-base);
        text-transform: uppercase;
        cursor: pointer;
    }

    .tooltip-card.flip-x .tooltip-toggle {
        left: auto;
        right: 2px;
    }

    /* Mobile bottom-sheet variant */
    .tooltip-backdrop {
        position: fixed;
        inset: 0;
        z-index: 99;
        background: transparent;
    }

    .tooltip-sheet {
        position: fixed;
        z-index: 100;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        background: var(--text-black);
        color: var(--bg);
        padding: 16px;
        user-select: none;
        transform: translateY(100%);
        transition: transform 260ms cubic-bezier(0.2, 0, 0, 1);
        will-change: transform;
    }

    .tooltip-sheet.open {
        transform: translateY(0);
    }

    .sheet-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sheet-id {
        font-size: var(--text-base);
        text-transform: uppercase;
    }

    .sheet-close {
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        padding: 0;
        color: var(--bg);
        cursor: pointer;
    }

    .x-mark {
        position: relative;
        width: 9px;
        height: 9px;
        display: block;
    }

    .x-mark::before,
    .x-mark::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 0;
        width: 100%;
        height: 1px;
        background: currentColor;
        transform-origin: center;
    }

    .x-mark::before {
        transform: rotate(45deg);
    }

    .x-mark::after {
        transform: rotate(-45deg);
    }

    .tooltip-body {
        font-size: var(--text-small);
        margin-top: 10px;
        color: var(--text-secondary-on-dark);
    }
</style>
