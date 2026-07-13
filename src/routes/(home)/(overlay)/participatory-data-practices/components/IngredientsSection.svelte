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
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
        grid-column: 1 / 9;
        text-box-trim: trim-both;
        text-align: left;
        margin-top: 12px;
        margin-bottom: 20px;
    }

    .section-description {
        text-box-trim: trim-both;
        grid-column: 9 / -1;
        padding-right: 8px;
        margin-top: 12px;
        margin-bottom: 20px;
        font-size: var(--text-lead);
    }

    .ingredients-table {
        background-color: var(--text-black);
        color: var(--bg);
        margin: 0 8px 76px;
        padding: 0 8px;
    }

    @media (max-width: 800px) {
        .ingredients-header {
            grid-column: 1 / 3;
        }

        .section-description {
            grid-column: 3 / -1;
            font-size: var(--text-base);
        }
    }
</style>
