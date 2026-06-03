<script lang="ts">
    import { base } from '$app/paths';
    import { page } from '$app/state';
    import { HomeBackground } from '$lib/components';

    let { data, children } = $props();
    let showIntro = $derived(page.url.pathname === base || page.url.pathname === `${base}/`);
</script>

<div class="site-shell">
    <HomeBackground data={data} {showIntro} />
    {@render children()}
</div>

<style>
    .site-shell {
        position: relative;
        min-height: 100vh;
    }
</style>
