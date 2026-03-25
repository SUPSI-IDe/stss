<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { base } from '$app/paths';

    let {
        variant = 'explore',
        sections = [{
            title: 'Explore the repository data flows:',
            body: `Hover over any word in the diagram to reveal its connected flows, highlighting the underlying processes of the project. The diagram acts as both a map and an interface, allowing you to navigate relationships between elements. Each node also provides access to specific terms and dedicated pages, offering deeper insight into the methodologies used. Through this exploration, the project uncovers the value of small data, emphasizing diverse approaches and perspectives.`
        }],
        showGap = true
    }: {
        variant?: 'explore' | 'license';
        sections?: { title: string; body: string }[];
        showGap?: boolean;
    } = $props();

    let timestamp = $state('');
    let timer: ReturnType<typeof setInterval> | null = null;

    function updateTimestamp() {
        timestamp = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Zurich',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date());
    }

    if (browser) {
        onMount(() => {
            updateTimestamp();
            timer = setInterval(updateTimestamp, 60_000);
        });
        onDestroy(() => {
            if (timer !== null) clearInterval(timer);
        });
    }
</script>

<nav class="nav-grid" aria-label="Primary">
    <div class="brand">STSS SMALL DATA</div>
    <a class="about" href={`${base}/about`}>ABOUT</a>
    <div class="powered-title">POWERED BY BLUECITY</div>
    <div class="timestamp" aria-live="polite">{timestamp}</div>
    {#if variant === 'explore'}
        <div class="explore-info">
            <div>{sections[0]?.title}</div>
            <div>{sections[0]?.body}</div>
        </div>
    {:else}
        {#each sections as section, i}
            <div class="license-block secondary">
                <span class="license-label">{section.title}</span>
                <span class="license-text">{section.body}</span>
            </div>
        {/each}
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
        align-items: start;
    }

    .brand {
        grid-column: 1 / span 4;
    }

    .about {
        grid-column: 5 / span 6;
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
    }

    .timestamp {
        grid-column: 17 / span 2;
        grid-row: 1;
        justify-self: end;
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
    }

    .license-block {
        grid-column: 13 / span 4;
        grid-row: 2;
        color: var(--text-gray);
        font-size: 12px;
        display: grid;
        gap: 2px;
    }

    .license-text {
        white-space: pre-line;
    }

    .secondary {
        grid-column: 1 / span 4;
    }

    .secondary + .secondary {
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

        .secondary + .secondary {
            grid-column: 1 / span 6;
        }
    }
</style>
