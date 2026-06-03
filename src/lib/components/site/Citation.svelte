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
        color: var(--text-muted);
    }
</style>
