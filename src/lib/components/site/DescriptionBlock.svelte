<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        heading,
        lead = false,
        children
    }: {
        heading: string;
        lead?: boolean;
        children: Snippet;
    } = $props();
</script>

<h3 class="description-header" class:lead>{heading}</h3>
<div class="description" class:lead>
    {@render children()}
</div>

<style>
    .description-header {
        font-weight: 500;
        font-size: var(--text-base);
        color: var(--text-muted);
        grid-column: 6/9;
        text-box-trim: trim-both;
        text-align: right;
    }

    .description {
        text-box-trim: trim-both;
        grid-column: 9 / -1;
        padding-right: 8px;
        margin-bottom: var(--description-block-margin-bottom, 36px);
        font-size: var(--text-lead);
    }

    .lead {
        grid-row: 1;
        align-self: start;
    }
</style>
