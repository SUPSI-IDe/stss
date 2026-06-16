<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        children
    }: {
        title: string;
        children: Snippet;
    } = $props();
</script>

<div class="protocol-row page-subgrid">
    <h4 class="protocol-row-title">{title}</h4>
    <div class="protocol-row-description">
        {@render children()}
    </div>
</div>

<style>
    .protocol-row {
        border-bottom: 1px solid var(--text-muted);
        padding: 6px 0;
    }

    .protocol-row:first-of-type {
        border-top: 1px solid var(--text-muted);
    }

    .protocol-row-title {
        grid-column: 1 / 9;
        text-align: left;
    }

    .protocol-row-title::before {
        content: "> ";
    }

    .protocol-row-description {
        grid-column: 9 / -1;
        color: var(--text-muted);
        line-height: var(--text-muted-leading);
    }

    .protocol-row-description :global(p) {
        margin: 0;
    }

    .protocol-row-description :global(ul) {
        margin: 12px 0;
        padding-left: 18px;
    }

</style>
