<script lang="ts">
    import type { PageData } from './$types';
    import NavBar from '$lib/NavBar.svelte';
    import Overlay from '$lib/Overlay.svelte';
    import FlowDiagram from '$lib/FlowDiagram.svelte';
    import TooltipCard from '$lib/TooltipCard.svelte';
    import type { TooltipData } from '$lib/types';

    type TooltipState = TooltipData & { x: number; y: number };

    let { data }: { data: PageData } = $props();
    let tooltip = $state<TooltipState | null>(null);

    function openTooltip(
        _event: MouseEvent,
        tipData: TooltipData,
        anchorX: number,
        anchorY: number
    ) {
        tooltip = {
            id: tipData.id,
            label: tipData.label,
            definition: tipData.definition,
            x: anchorX,
            y: anchorY
        };
    }
</script>

<div class="page">
    <Overlay lines={['EXPLORE', 'STSS SMALL DATA']} />
    <NavBar />

    <main class="content">
        <FlowDiagram
            allNodes={data.allNodes}
            uniqueFlows={data.uniqueFlows}
            realClusterLabelSet={data.realClusterLabelSet}
            onOpenTooltip={openTooltip}
        />
    </main>

    {#if tooltip}
        {#key tooltip.id}
            <TooltipCard
                id={tooltip.id}
                label={tooltip.label}
                definition={tooltip.definition}
                x={tooltip.x}
                y={tooltip.y}
                onclose={() => (tooltip = null)}
            />
        {/key}
    {/if}
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        line-height: 1.11;
    }

    .content {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 0 8px 24px 8px;
    }
</style>
