<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<section class="introductory-paragraph">
    {@render children()}
</section>

<style>
    .introductory-paragraph {
        grid-column: 1 / -1;
        padding: 8px;
        margin-top: 16px;
        margin-bottom: calc(36px - 8px);
    }

    .introductory-paragraph :global(p) {
        font-size: var(--text-display);
        line-height: 105%;
        color: var(--text-secondary-on-light);
    }

    @media (max-width: 800px) {
        .introductory-paragraph :global(p) {
            font-size: 1.5em; /* 20.07px against the 13.38px base */
        }
    }
</style>
