<script lang="ts">
    import { browser } from '$app/environment';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import NavBar from './NavBar.svelte';
    import FlowDiagram from '$lib/components/diagram/FlowDiagram.svelte';
    import TooltipCard from '$lib/components/diagram/TooltipCard.svelte';
    import IntroOverlay from '$lib/components/overlays/IntroOverlay.svelte';
    import OverlayHeader from '$lib/components/overlays/OverlayHeader.svelte';
    import { PAGE_META, SITE_TITLE } from '$lib/constants.js';
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

    let {
        data,
        showIntro = true
    }: {
        data: HomeBackgroundData;
        showIntro?: boolean;
    } = $props();
    let tooltip = $state<TooltipState | null>(null);
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
        if (!showIntro) return;
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
        />
    </main>

    {#if tooltip}
        {#key tooltip.id}
            <TooltipCard
                id={tooltip.id}
                definition={tooltip.definition}
                x={tooltip.x}
                y={tooltip.y}
                onclose={() => (tooltip = null)}
            />
        {/key}
    {/if}

    {#if showIntro && pagePreview}
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
    }

    .content {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 0 8px calc(24px + var(--home-preview-reserve)) 8px;
    }

    .page-hover-preview {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2500;
        will-change: transform;
    }
</style>
