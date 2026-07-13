<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        id,
        children,
    }: {
        title: string;
        id?: string;
        children: Snippet;
    } = $props();
</script>

<section class="method-section page-subgrid" {id}>
    <div class="sub-header page-subgrid">
        <h2>{title}</h2>
    </div>
    {@render children()}
</section>

<style>
    .sub-header {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: var(--method-header-background, white);
        mix-blend-mode: var(--method-header-blend-mode, difference);
        backdrop-filter: var(--method-header-backdrop-filter, none);
        -webkit-backdrop-filter: var(--method-header-backdrop-filter, none);
        color: var(--method-header-color, black);
        text-box-trim: trim-both;
        grid-column: 1 / -1;
        grid-row: 1;
        align-self: start;
        padding: 0px 8px;
        min-height: var(--text-lead);
        pointer-events: none;
    }

    h2 {
        font-weight: 500;
        font-size: var(--text-base);
        grid-column: 1 / 9;
        text-transform: uppercase;
        text-box-trim: trim-both;
        align-self: center;
    }

    @media (max-width: 800px) {
        h2 {
            grid-column: 1 / -1;
        }
    }
</style>
