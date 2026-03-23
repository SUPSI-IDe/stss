<script>
	let { label, definition, x = 0, y = 0, onclose } = $props();

	let posX = $state(x);
	let posY = $state(y);

	function startDrag(event) {
		if (event.target.closest('.tooltip-close')) return;
		const ox = event.clientX - posX;
		const oy = event.clientY - posY;
		function onMove(e) {
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
		font-size: 14px;
		cursor: pointer;
		line-height: 1;
	}

	.tooltip-title {
		font-family: 'OTMontreal', sans-serif;
		font-size: 18px;
		text-transform: uppercase;
		margin-bottom: 8px;
		padding-right: 20px;
	}

	.tooltip-body {
		font-family: 'Helvetica Neue', sans-serif;
		font-size: 13px;
		line-height: 1.4;
	}
</style>
