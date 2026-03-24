<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { PageData } from './$types';
    import { base } from '$app/paths';
    import NavBar from '$lib/NavBar.svelte';
    import { browser } from '$app/environment';
    import FlowDiagram from '$lib/FlowDiagram.svelte';
    import TooltipCard from '$lib/TooltipCard.svelte';
    import type { TooltipData } from '$lib/types';

    type TooltipState = TooltipData & { x: number; y: number };

    let { data }: { data: PageData } = $props();
    let tooltip = $state<TooltipState | null>(null);
    let timestamp = $state('');
    let timer: number | null = null;

    // Overlay invitation animation on home load & inactivity
    const LINES = ['EXPLORE', 'STSS SMALL DATA'];
    let overlayVisible = $state(true);
    let animationDone = $state(false);
    let displayedLines = $state(LINES.map(() => ''));
    let overlayInterval: ReturnType<typeof setInterval> | null = null;
    let inactivityTimeout: ReturnType<typeof setTimeout> | null = null;

    function updateTimestamp() {
        const now = new Date();
        timestamp = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Zurich',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);
    }

    function startOverlayAnimation() {
        if (overlayInterval) clearInterval(overlayInterval);
        overlayVisible = true;
        animationDone = false;
        displayedLines = LINES.map(() => '');

        let lineIndex = 0;
        let charIndex = 0;

        overlayInterval = window.setInterval(() => {
            if (lineIndex >= LINES.length) {
                if (overlayInterval) clearInterval(overlayInterval);
                overlayInterval = null;
                animationDone = true;
                return;
            }

            const current = LINES[lineIndex];
            displayedLines[lineIndex] = current.slice(0, charIndex + 1);
            charIndex += 1;

            if (charIndex >= current.length) {
                lineIndex += 1;
                charIndex = 0;
            }
        }, 70);
    }

    function resetInactivityTimer() {
        if (!browser) return;
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
        inactivityTimeout = window.setTimeout(() => {
            startOverlayAnimation();
        }, 60_000);
    }

    function handleMouseMove() {
        if (animationDone && overlayVisible) {
            overlayVisible = false;
        }
        resetInactivityTimer();
    }

    if (browser) {
        onMount(() => {
            updateTimestamp();
            timer = window.setInterval(updateTimestamp, 60_000);

            startOverlayAnimation();
            resetInactivityTimer();
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        });

        onDestroy(() => {
            if (timer !== null) clearInterval(timer);
            if (overlayInterval) clearInterval(overlayInterval);
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            window.removeEventListener('mousemove', handleMouseMove);
        });
    }

    function openTooltip(event: MouseEvent, tipData: TooltipData) {
        tooltip = {
            id: tipData.id,
            label: tipData.label,
            definition: tipData.definition,
            x: event.clientX + 12,
            y: event.clientY + 12
        };
    }
</script>

{#if overlayVisible}
    <div class="overlay" aria-live="polite">
        <div class="overlay-text">
            {#each displayedLines as line, idx}
                <div class="line" aria-label={LINES[idx]}>{line}</div>
            {/each}
        </div>
    </div>
{/if}

<NavBar timestamp={timestamp} />

<main class="content">
    <FlowDiagram
        allNodes={data.allNodes}
        uniqueFlows={data.uniqueFlows}
        realClusterLabelSet={data.realClusterLabelSet}
        onOpenTooltip={openTooltip}
    />
</main>

{#if tooltip}
	<TooltipCard
		id={tooltip.id}
		label={tooltip.label}
		definition={tooltip.definition}
		x={tooltip.x}
		y={tooltip.y}
		onclose={() => (tooltip = null)}
	/>
{/if}

<style>
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/stss-web/font/HelveticaNeue-Medium.woff') format('woff');
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'OTNeueMontreal-MediumSqueezed';
        src: url('/stss-web/font/OTNeueMontreal-MediumSqueezed.woff') format('woff');
        font-display: swap;
        font-style: normal;
    }

    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(:root) {
        --text-black: #040404;
        --bg: #f4f4f4;
        --text-gray: #818181;
    }

    :global(html),
    :global(body) {
        width: 100%;
        height: 100%;
        background: var(--bg);
    }

    :global(body) {
        margin: 0;
        display: flex;
        flex-direction: column;
        color: var(--text-black);
        font-family: 'Helvetica Neue', 'Helvetica Neue Medium', sans-serif;
        font-size: 13.38px;
        letter-spacing: 0.1px;
        line-height: 1.11;
    }

    .content {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 0 8px 24px 8px;
        box-sizing: border-box;
    }

    .overlay {
        position: fixed;
        inset: 0;
        background:transparent;
        display: grid;
        place-items: center;
        z-index: 2000;
    }

    .overlay-text {
        text-align: center;
        text-transform: uppercase;
        font-family: 'OTNeueMontreal-MediumSqueezed', 'Helvetica Neue', sans-serif;
        font-size: clamp(120px, 18vw, 253.19px);
        line-height: 0.8;
        letter-spacing: -6px;
        color: var(--text-black);
        pointer-events: none;
        user-select: none;
    }

    .overlay-text .line + .line {
        margin-top: 0.12em;
    }
</style>
