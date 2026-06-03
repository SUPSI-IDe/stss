<script lang="ts">
    import NavBar from './NavBar.svelte';
    import FlowDiagram from '$lib/components/diagram/FlowDiagram.svelte';
    import TooltipCard from '$lib/components/diagram/TooltipCard.svelte';
    import IntroOverlay from '$lib/components/overlays/IntroOverlay.svelte';
    import type { Flow, NodeData, TooltipData } from '$lib/types';

    type TooltipState = Omit<TooltipData, 'label'> & { x: number; y: number };
    type HomeBackgroundData = {
        allNodes: NodeData[];
        uniqueFlows: Flow[];
        realClusterLabelSet: Map<number, Set<string>>;
    };

    let {
        data,
        showIntro = true
    }: {
        data: HomeBackgroundData;
        showIntro?: boolean;
    } = $props();
    let tooltip = $state<TooltipState | null>(null);

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
</script>

<div class="home-background">
    {#if showIntro}
        <IntroOverlay lines={['EXPLORE', 'STSS SMALL DATA']} />
    {/if}
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
                definition={tooltip.definition}
                x={tooltip.x}
                y={tooltip.y}
                onclose={() => (tooltip = null)}
            />
        {/key}
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
        padding: 0 8px 24px 8px;
    }
</style>
