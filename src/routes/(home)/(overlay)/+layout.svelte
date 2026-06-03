<script lang="ts">
    import { onMount } from "svelte";
    import { beforeNavigate } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/state";
    import { OverlayHeader, SlideUpOverlay } from "$lib/components";
    import { overlayStack } from "$lib/overlayStack.svelte";

    let { children } = $props();

    let direction = $state<"forward" | "back">("forward");

    // The navigation that opens the *first* overlay comes from home, where this
    // layout isn't mounted yet — so its beforeNavigate never sees that hop. Seed
    // the stack with the page we land on (the stack is always cleared on the way
    // back out, so it's empty whenever we re-enter the overlay group).
    onMount(() => {
        overlayStack.navigateTo(page.url.pathname.slice(base.length));
    });

    beforeNavigate((nav) => {
        const toOverlay = (nav.to?.route?.id ?? "").includes("(overlay)");
        if (!toOverlay) {
            // Leaving the overlays (home / about): the panel slides down.
            overlayStack.clear();
            direction = "back";
            return;
        }
        const rel = (nav.to?.url.pathname ?? "").slice(base.length);
        direction = overlayStack.navigateTo(rel);
    });
</script>

<div class="overlay-stack">
    {#each overlayStack.ancestors as ancestor, i (ancestor.path)}
        <OverlayHeader
            chapter={ancestor.chapter}
            title={ancestor.title}
            clickable
            onSelect={() => overlayStack.selectAt(i)}
            onClose={() => overlayStack.closeAt(i)}
        />
    {/each}
    <div class="panel-slot">
        {#key page.url.pathname}
            <SlideUpOverlay {direction} z={3000 + overlayStack.depth}>
                {@render children()}
            </SlideUpOverlay>
        {/key}
    </div>
</div>

<style>
    .overlay-stack {
        position: fixed;
        inset: 0;
        z-index: 3000;
        display: flex;
        flex-direction: column;
    }

    /* Pinned header bars sit above the panel slot. */
    .overlay-stack :global(.overlay-header) {
        position: relative;
        z-index: 1;
        flex: 0 0 auto;
    }

    /* Own stacking context so the panels' high z-index stays contained below
       the pinned headers; the panel fills it via position: absolute. */
    .panel-slot {
        position: relative;
        z-index: 0;
        flex: 1 1 auto;
        min-height: 0;
    }
</style>
