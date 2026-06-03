<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        description,
        children
    }: {
        title: string;
        description: Snippet;
        children: Snippet;
    } = $props();
</script>

<div class="protocol-container page-subgrid">
    <h3 class="protocol-title">{title}</h3>
    <h4 class="protocol-header">Protocol</h4>
    <div class="protocol-description">
        {@render description()}
    </div>
    <div class="protocol-table page-subgrid">
        {@render children()}
    </div>
</div>

<style>
    .protocol-title {
        grid-column: 1 / -1;
        font-size: var(--text-display);
        line-height: 105%;
        text-box-trim: trim-both;
        padding-left: 8px;
    }

    .protocol-header {
        grid-column: 1 / 3;
        padding-left: 8px;
        color: var(--text-muted);
    }

    .protocol-description {
        grid-column: 9 / -1;
        font-size: var(--text-lead);
    }

    .protocol-table {
        margin: 24px 8px 76px;
        padding: 0 8px;
    }
</style>
