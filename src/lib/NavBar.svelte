<script lang="ts">
    import { base } from '$app/paths';
    let {
        timestamp = '',
        secondaryVariant = 'explore',
        secondaryTitle = 'Explore the repository data flows:',
        secondaryBody = `Hover over any word in the diagram to reveal its connected flows, highlighting the underlying processes of the project. The
            diagram acts as both a map and an interface, allowing you to navigate relationships between elements. Each node also provides
            access to specific terms and dedicated pages, offering deeper insight into the methodologies used. Through this exploration, the
            project uncovers the value of small data, emphasizing diverse approaches and perspectives.`
        ,
        secondaryVariant2 = null,
        secondaryTitle2 = '',
        secondaryBody2 = '',
        showGap = true
    } = $props();
</script>

<nav class="nav-grid" aria-label="Primary">
    <div class="brand">STSS SMALL DATA</div>
    <a class="about" href={`${base}/about`}>ABOUT</a>
    <div class="powered-title">POWERED BY BLUECITY</div>
    <div class="timestamp" aria-live="polite">{timestamp}</div>
    {#if secondaryVariant === 'explore'}
        <div class="explore-info">
            <div>{secondaryTitle}</div>
            <div>{secondaryBody}</div>
        </div>
    {:else}
        <div class="license-block secondary-project">
            <span class="license-label">{secondaryTitle}</span>
            <span class="license-text">{secondaryBody}</span>
        </div>
    {/if}
    {#if secondaryVariant2 === 'license'}
        <div class="license-block secondary-project partners">
            <span class="license-label">{secondaryTitle2}</span>
            <span class="license-text">{secondaryBody2}</span>
        </div>
    {/if}
    <div class="license-block">
        <span class="license-label">License:</span>
        <span class="license-text">
            © 2024. This project is licensed under CC BY 4.0. Supported by Movetia. Exchange and mobility.
        </span>
    </div>
</nav>

{#if showGap}
    <div class="nav-content-gap" aria-hidden="true"></div>
{/if}

<style>
    .nav-grid {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        grid-template-rows: auto auto;
        gap: 12px;
        margin: 8px 8px 0 8px;
        width: calc(100vw - 16px);
        box-sizing: border-box;
        align-items: start;
    }

    .brand {
        grid-column: 1 / span 4;
        align-self: start;
    }

    .about {
        grid-column: 5 / span 6;
        align-self: start;
        text-decoration: none;
        color: var(--text-black);
    }

    .about:hover {
        text-decoration: underline;
    }

    .powered-title {
        grid-column: 13 / span 4;
        grid-row: 1;
        text-transform: uppercase;
        align-self: start;
    }

    .timestamp {
        grid-column: 17 / span 2;
        grid-row: 1;
        justify-self: end;
        align-self: start;
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    .explore-info {
        grid-column: 1 / span 8;
        grid-row: 2;
        display: flex;
        flex-direction: column;
        gap: 2px;
        color: var(--text-gray);
        font-size: 12px;
        align-self: start;
    }

    .license-block {
        grid-column: 13 / span 4;
        grid-row: 2;
        color: var(--text-gray);
        font-size: 12px;
        display: grid;
        gap: 2px;
        align-self: start;
    }

    .license-text {
        white-space: pre-line;
    }

    .secondary-project {
        grid-column: 1 / span 4;
        grid-row: 2;
    }

    .secondary-project.partners {
        grid-column: 5 / span 4;
    }

    .nav-content-gap {
        height: 55px;
        width: 100%;
        pointer-events: none;
    }

    @media (max-width: 800px) {
        .nav-grid {
            grid-template-columns: repeat(6, 1fr);
        }

        .brand {
            grid-column: 1 / span 3;
        }

        .about {
            grid-column: 1 / span 3;
        }

        .powered-title {
            grid-column: 4 / span 3;
        }

        .timestamp {
            grid-column: 4 / span 3;
        }

        .explore-info,
        .license-block {
            grid-column: 1 / span 6;
        }
    }
</style>
