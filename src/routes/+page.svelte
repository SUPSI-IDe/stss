<script>
	import FlowDiagram from '$lib/FlowDiagram.svelte';
	import TooltipCard from '$lib/TooltipCard.svelte';

	let { data } = $props();
	let tooltip = $state(null);

	function openTooltip(event, tipData) {
		tooltip = {
			label: tipData.label,
			definition: tipData.definition,
			x: event.clientX + 12,
			y: event.clientY + 12
		};
	}
</script>

<div id="navbar">
	<span class="nav-item">STSS-SMALL DATA</span>
	<span class="nav-item">ABOUT</span>
	<span class="nav-item nav-spacer"></span>
	<span class="nav-item nav-spacer"></span>
	<span class="nav-item nav-spacer"></span>
	<span class="nav-item">POWERED BY BLUE CITY</span>
</div>
<div id="page-title">
	<div class="title-row title-row-top">
		<span>SEEING</span>
		<span>THINKING</span>
		<span>SHARING</span>
		<span>SENSING</span>
	</div>
	<div class="title-row title-row-bottom">
		<span>SMALL DATA</span>
	</div>
</div>
<div id="app">
	<FlowDiagram
		allNodes={data.allNodes}
		uniqueFlows={data.uniqueFlows}
		realClusterLabelSet={data.realClusterLabelSet}
		onOpenTooltip={openTooltip}
	/>
</div>

{#if tooltip}
	<TooltipCard
		label={tooltip.label}
		definition={tooltip.definition}
		x={tooltip.x}
		y={tooltip.y}
		onclose={() => (tooltip = null)}
	/>
{/if}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
	}

	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fafafa;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
	}

	@font-face {
		font-family: 'OTMontreal';
		src: url('/font/OTNeueMontreal-MediumSqueezed.woff') format('woff');
		font-weight: 500;
		font-style: normal;
	}

	@font-face {
		font-family: 'Helvetica Neue';
		src: url('/font/HelveticaNeue-Medium.woff') format('woff');
		font-weight: 500;
		font-style: normal;
	}

	#navbar {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		align-items: center;
		background: #fafafa;
		font-family: system-ui, sans-serif;
		font-size: 16px;
		text-transform: uppercase;
	}

	.nav-item:first-child {
		text-align: left;
	}

	.nav-item:nth-child(2) {
		text-align: left;
	}

	.nav-item:last-child {
		text-align: right;
	}

	#page-title {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-family: 'OTMontreal', sans-serif;
		font-size: 8rem;
		letter-spacing: -2px;
		line-height: 80%;
		text-transform: uppercase;
	}

	.title-row {
		display: flex;
	}

	.title-row-top {
		justify-content: space-between;
	}

	.title-row-bottom {
		justify-content: center;
	}

	#app {
		width: 100%;
		flex: 1;
		overflow: hidden;
		background: #fafafa;
		box-sizing: border-box;
		padding-top: 24px;
		padding-bottom: 24px;
	}
</style>
