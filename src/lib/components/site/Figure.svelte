<script lang="ts">
    import { base } from "$app/paths";
    import AutoplayVideo from "./AutoplayVideo.svelte";

    type Source = {
        src: string;
        type?: string;
    };

    let {
        src,
        sources = [],
        alt,
        caption,
        marker = "+"
    }: {
        src?: string;
        sources?: Source[];
        alt: string;
        caption: string;
        marker?: string;
    } = $props();
</script>

<figure class="figure">
    <figcaption><span class="figure-marker">{marker}</span> {caption}</figcaption>
    <div class="figure-frame">
        {#if sources.length > 0}
            <AutoplayVideo {sources} ariaLabel={alt} />
        {:else if src}
            <img src="{base}/{src}" {alt} />
        {/if}
    </div>
</figure>

<style>
    .figure {
        margin: 0;
    }

    .figure figcaption {
        font-size: var(--text-base);
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
    }

    .figure-marker {
        user-select: none;
    }

    .figure-frame {
        background: #fff;
        aspect-ratio: 16 / 11;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
    }

    .figure-frame img,
    .figure-frame :global(video) {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
</style>
