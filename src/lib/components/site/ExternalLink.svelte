<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        href,
        target = "_blank",
        rel = "noopener noreferrer",
        children
    }: {
        href: string;
        target?: string;
        rel?: string;
        children: Snippet;
    } = $props();
</script>

<a {href} {target} {rel}>
    {@render children()}
</a>
