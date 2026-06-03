<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { page } from "$app/state";
    import { SlideUpOverlay } from "$lib/components";

    let { children } = $props();

    let exitMode = $state<"close" | "swap">("close");
    let depth = $state(0);

    beforeNavigate((nav) => {
        const fromOverlay = (nav.from?.route?.id ?? "").includes("(overlay)");
        const toOverlay = (nav.to?.route?.id ?? "").includes("(overlay)");
        const swap =
            fromOverlay &&
            toOverlay &&
            nav.from?.url.pathname !== nav.to?.url.pathname;
        exitMode = swap ? "swap" : "close";
        // Each new overlay must stack above the one it covers.
        if (swap) depth += 1;
    });
</script>

{#key page.url.pathname}
    <SlideUpOverlay {exitMode} z={3000 + depth}>
        {@render children()}
    </SlideUpOverlay>
{/key}
