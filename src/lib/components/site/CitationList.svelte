<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div class="citation-list page-subgrid">
    {@render children()}
</div>

<style>
    .citation-list {
        row-gap: var(--grid-gap);
        padding: 0 8px;
        margin-bottom: 151px;
    }
</style>
