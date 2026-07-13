<script lang="ts">
    import { base } from "$app/paths";

    let {
        src,
        alt,
        caption,
        marker = "+"
    }: {
        src: string;
        alt: string;
        caption: string;
        marker?: string;
    } = $props();
</script>

<figure class="figure">
    <figcaption><span class="figure-marker">{marker}</span> {caption}</figcaption>
    <div class="figure-frame">
        <img src="{base}/{src}" {alt} />
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

    .figure-frame img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
</style>
