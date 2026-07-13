<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div class="citation">
    {@render children()}
</div>

<style>
    .citation {
        grid-column: span 4;
        font-size: var(--text-base);
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
    }

    @media (max-width: 800px) {
        .citation {
            grid-column: 1 / 8;
        }
    }
</style>
