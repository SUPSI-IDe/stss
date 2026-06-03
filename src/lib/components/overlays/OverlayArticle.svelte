<script lang="ts">
    import { onMount, tick, type Snippet } from "svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { takePendingScroll } from "$lib/overlayScroll";

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

    function handleClose() {
        goto(resolve("/"), { replaceState: true });
    }
</script>

<svelte:head>
    <title>{chapter}. {title} | STSS Small Data</title>
</svelte:head>

<section class="page-subgrid article-layout {pageClass}">
    <div class="page-header page-subgrid">
        <h1>{chapter}. {title}</h1>
        <button type="button" onclick={handleClose}>Close</button>
    </div>
    <div class="page-body page-subgrid" bind:this={bodyEl}>
        {@render children()}
    </div>
</section>

<style>
    .page-header {
        position: relative;
        z-index: 1;
        background-color: var(--text-black);
        color: var(--bg);
        text-box-trim: trim-both;
        grid-column: 1 / -1;
        grid-row: 1;
        min-height: min-content;
    }

    h1 {
        font-weight: 500;
        font-size: var(--text-base);
        grid-column: 1 / 9;
    }

    button {
        grid-column: 16 / 19;
        text-align: right;
        text-decoration: underline;
    }

    h1,
    button {
        text-transform: uppercase;
        text-box-trim: trim-both;
        align-self: center;
        padding-left: 8px;
        padding-right: 8px;
    }

    @media (max-width: 800px) {
        h1 {
            grid-column: 1 / 4;
        }

        button {
            grid-column: 4 / 7;
        }
    }

    .article-layout {
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
    }

    .page-body {
        opacity: 1;
        grid-row: 2;
        min-height: 0;
        overflow-y: auto;
    }
</style>
