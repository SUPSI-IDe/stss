<script lang="ts">
    import type { Snippet } from "svelte";
    import { slide } from "svelte/transition";

    let {
        title,
        children,
        links
    }: {
        title: string;
        children: Snippet;
        links?: Snippet;
    } = $props();

    let open = $state(false);
</script>

<div class="ingredients-row page-subgrid" class:open class:no-links={!links}>
    <h4 class="ingredients-row-title">{title}</h4>

    <div class="ingredients-row-actions">
        {#if links}
            <div class="ingredients-row-links">
                {@render links()}
            </div>
        {/if}
        <button
            class="ingredients-row-toggle"
            class:open
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            onclick={() => (open = !open)}
        ></button>
    </div>

    {#if open}
        <div class="ingredients-row-description" transition:slide>
            {@render children()}
        </div>
    {/if}
</div>

<style>
    .ingredients-row {
        border-bottom: 0.5px solid #646464;
        padding: 6px 0;
        row-gap: 12px;
    }

    .ingredients-row:last-of-type {
        border-bottom: none;
    }

    .ingredients-row-title {
        grid-column: 1 / 6;
        text-align: left;
    }

    .ingredients-row-title::before {
        content: "> ";
    }

    .ingredients-row-actions {
        grid-column: 6 / -1;
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }

    /* No resource links: title takes all but the last column, which is
       reserved for the plus/minus toggle. */
    .ingredients-row.no-links .ingredients-row-title {
        grid-column: 1 / -2;
    }

    .ingredients-row.no-links .ingredients-row-actions {
        grid-column: -2 / -1;
    }

    .ingredients-row-links {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .ingredients-row-links :global(a),
    .ingredients-row-description {
        color: var(--text-secondary-on-dark);
    }

    .ingredients-row-toggle {
        flex: none;
        margin-left: auto;
        position: relative;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--bg);
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .ingredients-row-toggle::before,
    .ingredients-row-toggle::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--text-black);
    }

    .ingredients-row-toggle::before {
        width: 8px;
        height: 1.5px;
    }

    .ingredients-row-toggle::after {
        width: 1.5px;
        height: 8px;
    }

    .ingredients-row-toggle.open::after {
        display: none;
    }

    .ingredients-row-description {
        grid-column: 1 / -1;
    }

    .ingredients-row-description :global(ul) {
        margin: 12px 0;
        padding-left: 18px;
    }
</style>
