<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { PageData } from './$types';
    import FlowDiagram from '$lib/FlowDiagram.svelte';
    import TooltipCard from '$lib/TooltipCard.svelte';
    import type { TooltipData } from '$lib/types';

    type TooltipState = TooltipData & { x: number; y: number };

    let { data }: { data: PageData } = $props();
    let tooltip = $state<TooltipState | null>(null);
    let timestamp = $state('');
    let timer: number | null = null;

    function updateTimestamp() {
        const now = new Date();
        timestamp = new Intl.DateTimeFormat('en-CH', {
            timeZone: 'Europe/Zurich',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        }).format(now);
    }

    onMount(() => {
        updateTimestamp();
        timer = window.setInterval(updateTimestamp, 60_000);
    });

    onDestroy(() => {
        if (timer !== null) clearInterval(timer);
    });

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

<nav class="nav-grid" aria-label="Primary">
    <div class="brand">STSS SMALL DATA</div>
    <a class="about" href="#about">ABOUT</a>
    <div class="powered-title">POWERED BY BLUECITY</div>
    <div class="timestamp" aria-live="polite">{timestamp}</div>
    <div class="explore-info">
        <div>Explore the repository data flows:</div>
        <div>
            Hover over any word in the diagram to reveal its connected flows, highlighting the underlying processes of the project. The
            diagram acts as both a map and an interface, allowing you to navigate relationships between elements. Each node also provides
            access to specific terms and dedicated pages, offering deeper insight into the methodologies used. Through this exploration, the
            project uncovers the value of small data, emphasizing diverse approaches and perspectives.
        </div>
    </div>
    <div class="license-block">
        <span class="license-label">License:</span>
        <span class="license-text">
            © 2024. This project is licensed under CC BY 4.0. Supported by Movetia. Exchange and mobility.
        </span>
    </div>
</nav>

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
        src: url('/font/HelveticaNeue-Medium.woff') format('woff');
        font-style: normal;
        font-display: swap;
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

    .nav-grid {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        grid-template-rows: auto auto;
        gap: 12px;
        margin: 8px 8px 0 8px;
        width: calc(100vw - 16px);
        box-sizing: border-box;
        align-items: start;
    }

    .brand {
        grid-column: 1 / span 4;
        align-self: start;
    }

    .about {
        grid-column: 5 / span 6;
        align-self: start;
        text-decoration: none;
        color: var(--text-black);
    }

    .about:hover {
        text-decoration: underline;
    }

    .powered-title {
        grid-column: 13 / span 4;
        grid-row: 1;
        text-transform: uppercase;
        align-self: start;
    }

    .timestamp {
        grid-column: 17 / span 2;
        grid-row: 1;
        justify-self: end;
        align-self: start;
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    .explore-info {
        grid-column: 1 / span 8;
        grid-row: 2;
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: var(--text-gray);
        font-size: 12px;
        align-self: start;
    }

    .license-block {
        grid-column: 13 / span 4;
        grid-row: 2;
        color: var(--text-gray);
        font-size: 12px;
        line-height: 1.4;
        display: grid;
        gap: 2px;
        align-self: start;
    }

    .content {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 16px 8px 24px 8px;
        box-sizing: border-box;
    }
</style>
