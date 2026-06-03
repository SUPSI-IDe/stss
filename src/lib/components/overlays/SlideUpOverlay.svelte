<script lang="ts">
    import type { Snippet } from "svelte";
    import { browser } from "$app/environment";
    import { cubicIn, cubicOut } from "svelte/easing";
    import type { TransitionConfig } from "svelte/transition";

    const OVERLAY_ENTER_MS = 480;
    const OVERLAY_EXIT_MS = 420;

    let {
        children,
        exitMode = "close",
        z = 3000,
    }: {
        children: Snippet;
        /** "close" slides the panel back down; "swap" fades it out in place
         * while a new overlay slides up over it, then unmounts it. */
        exitMode?: "close" | "swap";
        z?: number;
    } = $props();

    const reducedMotion = () =>
        browser &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function slide(
        duration: number,
        easing: (t: number) => number,
    ): TransitionConfig {
        return {
            duration: reducedMotion() ? 0 : duration,
            easing,
            css: (t) => `transform: translate3d(0, ${100 - t * 100}%, 0);`,
        };
    }

    function slideIn(_node: Element): TransitionConfig {
        return slide(OVERLAY_ENTER_MS, cubicOut);
    }

    // Outgoing panel: either slide down (closing to home) or fade out in place
    // while the incoming panel slides up over it (swapping between overlays).
    // Fading (rather than holding it static) keeps the translucent panels from
    // popping the old page out all at once when it unmounts.
    function overlayOut(_node: Element): TransitionConfig {
        if (exitMode === "swap") {
            return {
                duration: reducedMotion() ? 0 : OVERLAY_ENTER_MS,
                easing: cubicIn,
                css: (t) => `opacity: ${t};`,
            };
        }
        return slide(OVERLAY_EXIT_MS, cubicIn);
    }
</script>

<!-- |global so the slide plays on home→overlay too: a local transition is
     suppressed when its whole subtree (this layout) is created at once, and
     would only animate on overlay→overlay swaps. -->
<section class="overlay-panel" style="z-index: {z};" in:slideIn|global out:overlayOut|global>
    {@render children()}
</section>

<style>
    .overlay-panel {
        position: fixed;
        inset: 0;
        z-index: 3000;
        overflow: hidden;
        background: rgba(244, 244, 244, 0.3);
        isolation: isolate;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        will-change: transform;
        display: grid;
        grid-template-columns: var(--grid-template);
        grid-template-rows: minmax(0, 1fr);
        gap: var(--grid-gap);
    }

    :global(.page-subgrid) {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
        column-gap: inherit;
    }

    @supports not (grid-template-columns: subgrid) {
        :global(.page-subgrid) {
            grid-template-columns: var(--grid-template);
        }
    }
</style>
