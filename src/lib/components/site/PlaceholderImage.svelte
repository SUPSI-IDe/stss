<script lang="ts">
    let {
        position = "center"
    }: {
        position?: "center" | "left" | "right";
    } = $props();
</script>

<div class="placeholder-image placeholder-image-{position}" aria-hidden="true"></div>

<style>
    .placeholder-image {
        aspect-ratio: 16 / 9;
        background: var(--placeholder);
        margin-bottom: 32px;
    }

    .placeholder-image-center {
        grid-column: 7 / span 6;
    }

    .placeholder-image-left {
        grid-column: 4 / span 6;
    }

    .placeholder-image-right {
        grid-column: 10 / span 6;
    }
</style>
