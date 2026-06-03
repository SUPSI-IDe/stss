<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        children,
        links
    }: {
        title: string;
        children: Snippet;
        links?: Snippet;
    } = $props();
</script>

<div class="ingredients-row page-subgrid">
    <h4 class="ingredients-row-title">{title}</h4>
    <div class="ingredients-row-description">
        {@render children()}
    </div>
    {#if links}
        <div class="ingredients-row-links">
            {@render links()}
        </div>
    {/if}
</div>

<style>
    .ingredients-row {
        border-bottom: 1px solid white;
        padding: 6px 0;
    }

    .ingredients-row:last-of-type {
        border-bottom: none;
    }

    .ingredients-row-title {
        grid-column: 1 / 9;
        text-align: left;
    }

    .ingredients-row-title::before {
        content: "> ";
    }

    .ingredients-row-description {
        grid-column: 9 / -4;
    }

    .ingredients-row-description :global(ul) {
        margin: 12px 0;
        padding-left: 18px;
    }

    .ingredients-row-links {
        grid-column: -3 / -1;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
</style>
