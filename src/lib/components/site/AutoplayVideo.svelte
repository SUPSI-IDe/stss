<script lang="ts">
    import { onMount } from "svelte";

    type Source = {
        src: string;
        type?: string;
    };

    let {
        src,
        sources = [],
        poster,
        ariaLabel,
        class: className = "",
        style,
        preload = "auto",
    }: {
        src?: string;
        sources?: Source[];
        poster?: string;
        ariaLabel?: string;
        class?: string;
        style?: string;
        preload?: "none" | "metadata" | "auto";
    } = $props();

    let video = $state<HTMLVideoElement>();

    async function start() {
        if (!video) return;

        video.muted = true;
        video.defaultMuted = true;

        try {
            await video.play();
        } catch {
            // Muted autoplay can still be deferred by browser power policies;
            // readiness and intersection events will retry without surfacing noise.
        }
    }

    onMount(() => {
        start();

        if (!video || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) start();
            },
            { rootMargin: "200px" },
        );

        observer.observe(video);

        return () => observer.disconnect();
    });
</script>

<video
    bind:this={video}
    class={className}
    {style}
    {src}
    aria-label={ariaLabel}
    autoplay
    loop
    muted
    playsinline
    {preload}
    {poster}
    oncanplay={start}
    onloadeddata={start}
>
    {#each sources as source (source.src)}
        <source src={source.src} type={source.type} />
    {/each}
</video>
