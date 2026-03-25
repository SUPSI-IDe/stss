<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

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

	:global(body) {
		background: var(--bg);
		color: var(--text-black);
		font-family: 'Helvetica Neue', 'Helvetica Neue Medium', sans-serif;
		font-size: 13.38px;
		letter-spacing: 0.1px;
	}
</style>
