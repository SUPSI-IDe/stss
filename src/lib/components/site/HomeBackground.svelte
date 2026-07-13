<script lang="ts">
    import { browser } from '$app/environment';
    import { cubicOut } from 'svelte/easing';
    import { MediaQuery } from 'svelte/reactivity';
    import type { TransitionConfig } from 'svelte/transition';
    import NavBar from './NavBar.svelte';
    import FlowDiagram from '$lib/components/diagram/FlowDiagram.svelte';
    import TooltipCard from '$lib/components/diagram/TooltipCard.svelte';
    import IntroOverlay from '$lib/components/overlays/IntroOverlay.svelte';
    import OverlayHeader from '$lib/components/overlays/OverlayHeader.svelte';
    import {
        PAGE_META,
        SITE_TITLE,
        EXPLORE_INTRO_TITLE,
        EXPLORE_INTRO_BODY
    } from '$lib/constants.js';
    import type { Flow, NodeData, TooltipData } from '$lib/types';

    type TooltipState = Omit<TooltipData, 'label'> & { x: number; y: number };
    type PagePreview = { chapter: number; title: string };
    type HomeBackgroundData = {
        allNodes: NodeData[];
        uniqueFlows: Flow[];
        realClusterLabelSet: Map<number, Set<string>>;
    };
    const HOME_PREVIEW_RESERVE_PX = 34;
    const PREVIEW_TRANSITION_MS = 240;
    const mobileViewport = new MediaQuery('max-width: 800px', false);

    let {
        data,
        showIntro = true
    }: {
        data: HomeBackgroundData;
        showIntro?: boolean;
    } = $props();
    let tooltip = $state<TooltipState | null>(null);
    let mobileFlowSelected = $state(false);
    let pagePreview = $state<PagePreview | null>(null);
    let pagePreviewHeight = $state(0);
    let previewReserve = $derived(Math.max(HOME_PREVIEW_RESERVE_PX, pagePreviewHeight));

    function openTooltip(
        tipData: TooltipData,
        anchorX: number,
        anchorY: number
    ) {
        tooltip = {
            id: tipData.id,
            definition: tipData.definition,
            x: anchorX,
            y: anchorY
        };
    }

    function previewForRoute(pageRoute: string | null): PagePreview | null {
        if (!pageRoute) return null;
        const path = pageRoute.split('#')[0];
        return (PAGE_META as Record<string, PagePreview>)[path] ?? null;
    }

    function setPagePreview(pageRoute: string | null) {
        if (!showIntro || mobileViewport.current) {
            pagePreview = null;
            return;
        }
        pagePreview = previewForRoute(pageRoute);
    }

    function reducedMotion() {
        return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function previewSlide(_node: Element): TransitionConfig {
        return {
            duration: reducedMotion() ? 0 : PREVIEW_TRANSITION_MS,
            easing: cubicOut,
            css: (t) => `transform: translate3d(0, ${100 - t * 100}%, 0);`
        };
    }
</script>

<div class="home-background" style:--home-preview-reserve={`${previewReserve}px`}>
    {#if showIntro}
        <IntroOverlay lines={['EXPLORE', SITE_TITLE]} />
    {/if}
    <NavBar />

    <main class="content">
        <FlowDiagram
            allNodes={data.allNodes}
            uniqueFlows={data.uniqueFlows}
            realClusterLabelSet={data.realClusterLabelSet}
            activeTooltipId={tooltip?.id ?? null}
            onOpenTooltip={openTooltip}
            onPageHoverChange={setPagePreview}
            onMobileSelectionChange={(hasSelection) =>
                (mobileFlowSelected = hasSelection)}
        />
    </main>

    {#if showIntro && mobileViewport.current}
        <div
            class="mobile-intro"
            class:mobile-intro--hidden={mobileFlowSelected}
            aria-hidden={mobileFlowSelected}
        >
            <h1 class="mobile-intro-title">{SITE_TITLE}</h1>
            <p class="mobile-intro-lead">{EXPLORE_INTRO_TITLE}</p>
            <p class="mobile-intro-body">{EXPLORE_INTRO_BODY}</p>
        </div>
    {/if}

    {#if tooltip}
        {#key tooltip.id}
            <TooltipCard
                id={tooltip.id}
                definition={tooltip.definition}
                x={tooltip.x}
                y={tooltip.y}
                mobile={mobileViewport.current}
                onclose={() => (tooltip = null)}
            />
        {/key}
    {/if}

    {#if showIntro && pagePreview && !mobileViewport.current}
        <div
            class="page-hover-preview"
            bind:clientHeight={pagePreviewHeight}
            transition:previewSlide
        >
            <OverlayHeader
                chapter={pagePreview.chapter}
                title={pagePreview.title}
                onClose={() => (pagePreview = null)}
            />
        </div>
    {/if}
</div>

<style>
    .home-background {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        height: 100dvh;
    }

    .content {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 0 var(--page-margin)
            calc(24px + var(--home-preview-reserve)) var(--page-margin);
    }

    .page-hover-preview {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2500;
        will-change: transform;
    }

    /* Mobile landing intro: pinned to the bottom of the viewport, overlapping
       the diagram. Slides down out of view while a flow is selected and slides
       back in when the diagram is reset to its initial four nodes. Taps pass
       through to the diagram beneath. */
    .mobile-intro {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 48px var(--page-margin)
            max(16px, env(safe-area-inset-bottom)) var(--page-margin);
        background: linear-gradient(
            to top,
            var(--bg) 0%,
            var(--bg) 55%,
            transparent 100%
        );
        pointer-events: none;
        transform: translateY(0);
        transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
    }

    .mobile-intro--hidden {
        transform: translateY(110%);
    }

    .mobile-intro-title {
        color: var(--text-black);
        text-transform: uppercase;
        font-size: 12.5px;
        line-height: 1.1;
        letter-spacing: 0.1px;
    }

    .mobile-intro-lead,
    .mobile-intro-body {
        color: var(--text-tertiary-on-light);
        font-size: var(--text-small);
        line-height: var(--text-muted-leading);
    }

    .mobile-intro-lead {
        margin-top: 8px;
    }

    @media (prefers-reduced-motion: reduce) {
        .mobile-intro {
            transition: none;
        }
    }
</style>
