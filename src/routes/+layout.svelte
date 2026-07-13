<script>
    import favicon from "$lib/assets/favicon.svg";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="site-content">
    {@render children()}
</div>

<style>
    @font-face {
        font-family: "Helvetica Neue";
        src: url("../lib/assets/fonts/HelveticaNeue-Medium.woff") format("woff");
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: "OTNeueMontreal-MediumSqueezed";
        src: url("../lib/assets/fonts/OTNeueMontreal-MediumSqueezed.woff")
            format("woff");
        font-display: swap;
        font-style: normal;
    }

    :global(*) {
        margin: 0;
        padding: 0;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    :global(*::-webkit-scrollbar) {
        display: none;
    }

    :global(*, *::before, *::after) {
        box-sizing: border-box;
    }

    :global(html, body) {
        height: 100%;
    }

    :global(body) {
        font-style: normal;
        font-weight: 500;
        line-height: 120%;
        -webkit-font-smoothing: antialiased;
        background: var(--bg);
        color: var(--text-black);
        font-family: "Helvetica Neue", "Helvetica Neue Medium", sans-serif;
        font-size: var(--text-base);
        letter-spacing: 0.1px;
    }

    :global(a),
    :global(a:visited),
    :global(a:hover),
    :global(a:focus),
    :global(a:active) {
        color: var(--text-muted);
        text-decoration: underline;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    :global(img, picture, video, canvas, svg) {
        display: block;
        max-width: 100%;
    }

    :global(input, button, textarea, select) {
        font: inherit;
    }

    :global(p, h1, h2, h3, h4, h5, h6) {
        overflow-wrap: break-word;
    }

    :global(h1, h2, h3, h4, h5, h6) {
        font-weight: 500;
    }

    :global(ul li::marker) {
        content: "- ";
    }

    :global(button) {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: inherit;
    }

    :global(:root) {
        /* Colour */
        --text-black: #040404;
        --text-muted: #646464; /* links + secondary text */
        --text-gray: #818181; /* footnotes, captions */
        --text-on-dark: #adadad; /* secondary text on black surfaces */
        --bg: #f4f4f4;
        --placeholder: #d9d9d9; /* image placeholder fill */

        /* Type scale */
        --text-display: 26.76px; /* large headings, intro */
        --text-lead: 16.73px; /* section descriptions */
        --text-base: 13.38px; /* body, labels, headers */
        --text-small: 12px; /* footnotes, captions */
        --text-muted-leading: 1.1;

        /* Grid system — single source of truth for the diagram/article layout.
           The full repeat() track list lives here because CSS cannot take a
           custom property as the repeat() *count*; the breakpoint below swaps
           the whole track list to the narrow column set, so consumers just say
           grid-template-columns: var(--grid-template) and never redeclare it. */
        --grid-template: repeat(18, minmax(0, 1fr));
        --grid-gap: 12px;
    }

    @media (max-width: 800px) {
        :global(:root) {
            --grid-template: repeat(9, minmax(0, 1fr));
            --grid-gap: 8px;
        }
    }

    /* Shared license/credit footer pattern (NavBar + about). Positioning stays
       per-component; only the repeated box + text rules live here. */
    :global(.license-block) {
        display: grid;
        gap: 2px;
    }

    :global(.license-text) {
        white-space: pre-line;
        overflow-wrap: anywhere;
    }
</style>
