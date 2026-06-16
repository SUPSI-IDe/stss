<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        description,
        children
    }: {
        description: Snippet;
        children: Snippet;
    } = $props();
</script>

<h3 class="ingredients-header">Ingredients</h3>
<div class="section-description">
    {@render description()}
</div>
<div class="ingredients-table page-subgrid">
    {@render children()}
</div>

<style>
    .ingredients-header {
        padding-left: 8px;
        font-weight: 500;
        font-size: var(--text-base);
        color: var(--text-muted);
        line-height: var(--text-muted-leading);
        grid-column: 1 / 9;
        text-box-trim: trim-both;
        text-align: left;
    }

    .section-description {
        text-box-trim: trim-both;
        grid-column: 9 / -1;
        padding-right: 8px;
        margin-bottom: 76px;
        font-size: var(--text-lead);
    }

    .ingredients-table {
        background-color: var(--text-black);
        color: var(--bg);
        margin: 0 8px 76px;
        padding: 0 8px;
    }
</style>
