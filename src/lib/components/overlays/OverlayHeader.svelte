<script lang="ts">
    // The black bar at the top of every overlay page. Rendered once inside the
    // current page (via OverlayArticle) and once per stacked-below page (as a
    // pinned bar in the overlay layout). When `clickable`, the title acts as a
    // "reveal this page" control; Close always drops this page and any above it.
    let {
        chapter,
        title,
        onClose,
        onSelect,
        clickable = false,
        showMobileClose = true,
    }: {
        chapter: number;
        title: string;
        onClose: () => void;
        onSelect?: () => void;
        clickable?: boolean;
        showMobileClose?: boolean;
    } = $props();
</script>

<div class="overlay-header">
    {#if clickable}
        <button type="button" class="title title-button" onclick={onSelect}>
            {chapter}. {title}
        </button>
    {:else}
        <h1 class="title">{chapter}. {title}</h1>
    {/if}
    <button
        type="button"
        class="close"
        class:mobile-hidden={!showMobileClose}
        onclick={onClose}>Close</button
    >
</div>

<style>
    .overlay-header {
        display: grid;
        grid-template-columns: var(--grid-template);
        column-gap: var(--grid-gap);
        grid-column: 1 / -1;
        grid-row: 1;
        background-color: var(--text-black);
        color: var(--bg);
        text-box-trim: trim-both;
    }

    .title {
        grid-column: 1 / 9;
        font-weight: 500;
        font-size: var(--text-base);
    }

    .title-button {
        text-align: left;
    }

    .close {
        grid-column: 16 / 19;
        text-align: right;
        text-decoration: underline;
    }

    .title,
    .close {
        text-transform: uppercase;
        text-box-trim: trim-both;
        align-self: center;
        padding-left: 8px;
        padding-right: 8px;
    }

    @media (max-width: 800px) {
        .title {
            grid-column: 1 / 8;
        }

        .close {
            grid-column: 8 / 10;
        }

        .close.mobile-hidden {
            display: none;
        }
    }
</style>
