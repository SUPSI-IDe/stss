<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        children
    }: {
        title: string;
        children: Snippet;
    } = $props();

    let open = $state(false);
</script>

<div class="protocol-row page-subgrid" class:open>
    <h4 class="protocol-row-title">{title}</h4>
    <button
        class="protocol-row-toggle"
        class:open
        aria-expanded={open}
        aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        onclick={() => (open = !open)}
    ></button>
    <div class="protocol-row-description">
        <div class="protocol-row-description-inner">
            {@render children()}
        </div>
    </div>
</div>

<style>
    .protocol-row {
        border-bottom: 1px solid var(--text-secondary-on-light);
        padding: 6px 0;
    }

    .protocol-row:first-of-type {
        border-top: 1px solid var(--text-secondary-on-light);
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
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
    }

    .protocol-row-description :global(p) {
        margin: 0;
    }

    .protocol-row-description :global(ul) {
        margin: 12px 0;
        padding-left: 18px;
    }

    /* Toggle is a mobile-only affordance; hidden on desktop where the
       description is always shown. */
    .protocol-row-toggle {
        display: none;
        position: relative;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--text-black);
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .protocol-row-toggle::before,
    .protocol-row-toggle::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg);
    }

    .protocol-row-toggle::before {
        width: 8px;
        height: 1.5px;
    }

    .protocol-row-toggle::after {
        width: 1.5px;
        height: 8px;
    }

    .protocol-row-toggle.open::after {
        display: none;
    }

    @media (max-width: 800px) {
        .protocol-row {
            row-gap: 12px;
        }

        .protocol-row-title {
            grid-column: 1 / -2;
        }

        .protocol-row-toggle {
            display: block;
            grid-column: -2 / -1;
            justify-self: end;
        }

        .protocol-row-description {
            grid-column: 1 / -1;
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.3s ease;
        }

        .protocol-row-description-inner {
            overflow: hidden;
            min-height: 0;
        }

        .protocol-row.open .protocol-row-description {
            grid-template-rows: 1fr;
        }
    }
</style>
