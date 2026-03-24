<script lang="ts">
    import type { TooltipData } from './types';

    let { label, definition, x = 0, y = 0, onclose }: TooltipData & {
        x?: number;
        y?: number;
        onclose: () => void;
    } = $props();

    let posX = $state<number>(0);
    let posY = $state<number>(0);

    function startDrag(event: MouseEvent) {
        const target = event.target as HTMLElement | null;
        if (target && target.closest('.tooltip-close')) return;
        const ox = event.clientX - posX;
        const oy = event.clientY - posY;
        function onMove(e: MouseEvent) {
            posX = e.clientX - ox;
            posY = e.clientY - oy;
        }
        function onUp() {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }

    $effect(() => {
        posX = x;
        posY = y;
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="tooltip-card" style="left:{posX}px;top:{posY}px" onmousedown={startDrag}>
	<button class="tooltip-close" onclick={onclose}>&#x2715;</button>
	<div class="tooltip-title">{label}</div>
	<div class="tooltip-body">{definition}</div>
</div>

<style>
	.tooltip-card {
		position: fixed;
		z-index: 100;
		background: black;
		color: white;
		padding: 16px 20px;
		max-width: 320px;
		cursor: grab;
		user-select: none;
	}

	.tooltip-card:active {
		cursor: grabbing;
	}

	.tooltip-close {
		position: absolute;
		top: 8px;
		right: 10px;
		background: none;
		border: none;
		color: white;
		font-size: 13.38px;
		cursor: pointer;
		line-height: 1;
	}

	.tooltip-title {
		font-size: 18px;
		text-transform: uppercase;
		margin-bottom: 8px;
		padding-right: 20px;
	}

	.tooltip-body {
		font-family: 'Helvetica Neue', sans-serif;
		font-size: 12px;
		line-height: 1.11;
	}
</style>
