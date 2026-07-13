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
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
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
        grid-row: var(--description-grid-row, 1);
        align-self: start;
        margin-top: var(--description-top-spacing, 0);
    }

    @media (max-width: 800px) {
        .description-header {
            grid-column: 1 / 3;
        }

        .description {
            grid-column: 3 / -1;
            font-size: var(--text-base);
            margin-bottom: 20px;
        }
    }
</style>
