<script lang="ts">
    import type { Attachment } from "svelte/attachments";

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
        preload = "metadata",
    }: {
        src?: string;
        sources?: Source[];
        poster?: string;
        ariaLabel?: string;
        class?: string;
        style?: string;
        preload?: "none" | "metadata" | "auto";
    } = $props();

    const managePlayback: Attachment<HTMLVideoElement> = (video) => {
        let isInViewport = !("IntersectionObserver" in window);

        async function syncPlayback() {
            const shouldPlay =
                isInViewport && document.visibilityState === "visible";

            if (!shouldPlay) {
                video.pause();
                return;
            }

            try {
                await video.play();

                // The video may have left the viewport while play() was pending.
                if (
                    !isInViewport ||
                    document.visibilityState !== "visible"
                ) {
                    video.pause();
                }
            } catch {
                // Browsers may still defer muted autoplay under power policies.
            }
        }

        video.muted = true;
        video.defaultMuted = true;

        const observer =
            "IntersectionObserver" in window
                ? new IntersectionObserver(([entry]) => {
                      isInViewport = entry.isIntersecting;
                      void syncPlayback();
                  })
                : undefined;

        observer?.observe(video);
        document.addEventListener("visibilitychange", syncPlayback);
        void syncPlayback();

        return () => {
            observer?.disconnect();
            document.removeEventListener("visibilitychange", syncPlayback);
            video.pause();
        };
    };
</script>

<video
    {@attach managePlayback}
    class={className}
    {style}
    {src}
    aria-label={ariaLabel}
    loop
    muted
    playsinline
    {preload}
    {poster}
>
    {#each sources as source (source.src)}
        <source src={source.src} type={source.type} />
    {/each}
</video>
