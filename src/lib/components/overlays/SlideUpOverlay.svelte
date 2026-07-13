<script lang="ts">
    import { untrack, type Snippet } from "svelte";
    import { browser } from "$app/environment";
    import { cubicIn, cubicOut } from "svelte/easing";
    import type { TransitionConfig } from "svelte/transition";

    const OVERLAY_ENTER_MS = 480;
    const OVERLAY_EXIT_MS = 420;

    let {
        children,
        direction = "forward",
        z = 3000,
    }: {
        children: Snippet;
        /** "forward" opens a new page over the stack; "back" returns to a page
         * already in the stack (this panel is the one being revealed). */
        direction?: "forward" | "back";
        z?: number;
    } = $props();

    // A panel's stacking is fixed for its lifetime. Forward panels sit above the
    // one they cover; on a back navigation the *outgoing* panel must stay above
    // the page it uncovers. Capturing z at creation keeps an outgoing panel from
    // dropping when `z` (the stack depth) updates for the incoming one.
    const z0 = untrack(() => z);

    const reducedMotion = () =>
        browser &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function slideDown(
        duration: number,
        easing: (t: number) => number,
    ): TransitionConfig {
        return {
            duration: reducedMotion() ? 0 : duration,
            easing,
            css: (t) => `transform: translate3d(0, ${100 - t * 100}%, 0);`,
        };
    }

    // Entrance: a forward page slides up from below the viewport. On a back
    // navigation this panel is the page being revealed, so it sits in place
    // while the outgoing panel slides down off it.
    function slideIn(_node: Element): TransitionConfig {
        if (direction === "back") return { duration: 0 };
        return slideDown(OVERLAY_ENTER_MS, cubicOut);
    }

    // Exit: on forward the covered page stays put (unchanged) behind the panel
    // sliding up over it, and is only unmounted once that panel is fully up — so
    // its content never blinks out early. Its header is dropped meanwhile (the
    // page is now a pinned ancestor, see OverlayArticle), so no duplicate shows.
    // Back/close slides the panel down to uncover the page below it.
    function slideOut(_node: Element): TransitionConfig {
        if (direction === "forward")
            return { duration: reducedMotion() ? 0 : OVERLAY_ENTER_MS };
        return slideDown(OVERLAY_EXIT_MS, cubicIn);
    }
</script>

<!-- |global so the slide plays on home→overlay too: a local transition is
     suppressed when its whole subtree (this layout) is created at once, and
     would only animate on overlay→overlay swaps. -->
<section class="overlay-panel" style="z-index: {z0};" in:slideIn|global out:slideOut|global>
    {@render children()}
</section>

<style>
    .overlay-panel {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: rgba(244, 244, 244, 0.7);
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
