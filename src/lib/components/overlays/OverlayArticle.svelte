<script lang="ts">
    import { onMount, tick, untrack, type Snippet } from "svelte";
    import { afterNavigate } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/state";
    import SiteFooter from "$lib/components/site/SiteFooter.svelte";
    import OverlayHeader from "$lib/components/overlays/OverlayHeader.svelte";
    import { SITE_TITLE } from "$lib/constants.js";
    import { overlayStack } from "$lib/overlayStack.svelte";
    import { takePendingScroll } from "$lib/overlayScroll";

    // This page's own route path, frozen at creation (page.url is global and
    // would otherwise read the *next* route once navigation starts). While this
    // page is a pinned ancestor its header is owned by the layout, so the panel
    // drops its own header — keeping its body visible behind whatever opened
    // over it, with no duplicate header bar.
    const myPath = untrack(() => page.url.pathname.slice(base.length));
    let showHeader = $derived(!overlayStack.isAncestorPath(myPath));

    // Must clear the SlideUpOverlay entrance (OVERLAY_ENTER_MS = 480) so the
    // scroll can't disturb the slide-up; we only scroll once it has settled.
    const ENTRANCE_MS = 520;

    let {
        chapter,
        title,
        pageClass = "",
        children,
    }: {
        chapter: number;
        title: string;
        pageClass?: string;
        children: Snippet;
    } = $props();

    let bodyEl = $state<HTMLElement>();

    // Arriving from a diagram node that targets a section: the section was
    // handed to us out-of-band (see overlayScroll). Wait for the slide-up to
    // finish, then jump to it — so the entrance animation is left untouched.
    onMount(() => {
        const hash = takePendingScroll();
        if (!hash) return;
        const timer = setTimeout(() => scrollToHash(hash, "smooth"), ENTRANCE_MS);
        return () => clearTimeout(timer);
    });

    // Scroll the article body to a hash target: smoothly when the link points
    // within the page already on screen, instantly when arriving on a fresh
    // page (so it's already in position as the overlay slides up).
    afterNavigate(({ from, to }) => {
        const hash = to?.url.hash;
        if (!hash) return;
        const samePage = from?.url.pathname === to?.url.pathname;
        scrollToHash(hash, samePage ? "smooth" : "instant");
    });

    async function scrollToHash(hash: string, behavior: ScrollBehavior) {
        await tick();
        bodyEl?.querySelector(hash)?.scrollIntoView({ behavior, block: "start" });
    }
</script>

<svelte:head>
    <title>{chapter}. {title} | {SITE_TITLE}</title>
</svelte:head>

<!-- Header + body live together in the sliding panel so they move as one unit
     on open/close. Only the headers of pages *below* this one are pinned by the
     overlay layout. -->
<section class="page-subgrid article-layout {pageClass}">
    {#if showHeader}
        <OverlayHeader {chapter} {title} onClose={() => overlayStack.closeCurrent()} />
    {/if}
    <div class="page-body page-subgrid" bind:this={bodyEl}>
        {@render children()}
        <SiteFooter />
    </div>
</section>

<style>
    .article-layout {
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
    }

    .page-body {
        grid-row: 2;
        min-height: 0;
        overflow-y: auto;
    }
</style>
