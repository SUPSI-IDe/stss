<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { base, resolve } from "$app/paths";
    import { page } from "$app/state";
    import {
        LICENSE_TEXT,
        EXPLORE_INTRO_TITLE,
        EXPLORE_INTRO_BODY,
    } from "$lib/constants.js";

    let {
        variant = "explore",
        sections = [
            {
                title: EXPLORE_INTRO_TITLE,
                body: EXPLORE_INTRO_BODY,
            },
        ],
        showGap = true,
        licenseLabel = "License:",
        licenseText = LICENSE_TEXT,
    }: {
        variant?: "explore" | "license";
        sections?: { title: string; body: string }[];
        showGap?: boolean;
        licenseLabel?: string;
        licenseText?: string;
    } = $props();

    let timestamp = $state("");
    let timer: ReturnType<typeof setInterval> | null = null;

    function updateTimestamp() {
        timestamp = new Intl.DateTimeFormat("sv-SE", {
            timeZone: "Europe/Zurich",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(new Date());
    }

    onMount(() => {
        updateTimestamp();
        timer = setInterval(updateTimestamp, 1_000);
    });
    onDestroy(() => {
        if (timer !== null) clearInterval(timer);
    });
</script>

<nav class="nav-grid" aria-label="Primary">
    <a
        class="brand"
        href={resolve("/")}
        class:active-link={page.url.pathname === `${base}/` ||
            page.url.pathname === base}
        ><span class="brand-title">Small Data Practices</span
        ><span class="brand-home">HOME</span></a
    >
    <a
        class="about"
        href={resolve("/about")}
        class:active-link={page.url.pathname.startsWith(`${base}/about`)}
        >ABOUT</a
    >
    <div class="powered-license">
        <div class="powered-title">POWERED BY BLUECITY</div>
        <div class="license-block">
            <span class="license-label">{licenseLabel}</span>
            <span class="license-text">{licenseText}</span>
        </div>
    </div>
    <div class="timestamp">{timestamp}</div>
    {#if variant === "explore"}
        <div class="explore-info">
            <div>{sections[0]?.title}</div>
            <div>{sections[0]?.body}</div>
        </div>
    {:else}
        {#each sections as section (section.title)}
            <div class="license-block credit-block">
                <span class="license-label">{section.title}</span>
                <span class="license-text">{section.body}</span>
            </div>
        {/each}
    {/if}
</nav>

{#if showGap}
    <div class="nav-content-gap" aria-hidden="true"></div>
{/if}

<style>
    .nav-grid {
        display: grid;
        grid-template-columns: var(--grid-template);
        grid-template-rows: auto auto;
        gap: var(--grid-gap);
        margin: var(--page-margin) var(--page-margin) 0 var(--page-margin);
        width: calc(100vw - (var(--page-margin) * 2));
        align-items: start;
    }

    .brand {
        grid-column: 1 / span 4;
        color: var(--text-black);
        text-decoration: none;
        text-transform: uppercase;
    }

    .brand:hover {
        text-decoration: underline;
    }

    .brand-home {
        display: none;
    }

    .about {
        grid-column: 6 / span 6;
        text-decoration: none;
        color: var(--text-black);
    }

    .about:hover {
        text-decoration: underline;
    }

    .active-link {
        text-decoration: underline;
    }

    .powered-title {
        grid-column: 13 / span 4;
        grid-row: 1;
        text-transform: uppercase;
    }

    .powered-license {
        display: contents;
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
        color: var(--text-tertiary-on-light);
        font-size: var(--text-small);
        line-height: var(--text-muted-leading);
    }

    .license-block {
        grid-column: 13 / span 4;
        grid-row: 2;
        color: var(--text-tertiary-on-light);
        font-size: var(--text-small);
        line-height: var(--text-muted-leading);
    }

    .credit-block {
        grid-column: 1 / span 5;
    }

    .credit-block + .credit-block {
        grid-column: 6 / span 5;
    }

    .nav-content-gap {
        height: 22px;
        width: 100%;
        pointer-events: none;
    }

    @media (max-width: 800px) {
        .nav-grid {
            grid-template-rows: auto auto;
            row-gap: 16px;
        }

        .brand {
            grid-column: 1 / 4;
            grid-row: 1;
            justify-self: stretch;
            text-align: center;
        }

        .brand-title {
            display: none;
        }

        .brand-home {
            display: inline;
        }

        .about {
            grid-column: 7 / 10;
            grid-row: 1;
            justify-self: stretch;
            text-align: center;
        }

        .powered-license {
            grid-column: 1 / 7;
            grid-row: 2;
            display: block;
            color: var(--text-tertiary-on-light);
            font-size: var(--text-small);
            line-height: var(--text-muted-leading);
        }

        .powered-title {
            display: block;
            color: var(--text-black);
            text-transform: uppercase;
        }

        .powered-license .license-block {
            display: block;
            color: inherit;
            font-size: inherit;
            line-height: inherit;
        }

        .powered-license .license-label {
            display: none;
        }

        .powered-license .license-text {
            display: inline;
        }

        .timestamp {
            grid-column: 7 / 10;
            grid-row: 2;
            justify-self: end;
            color: var(--text-tertiary-on-light);
            font-size: var(--text-small);
            line-height: var(--text-muted-leading);
            text-align: right;
        }

        .explore-info,
        .credit-block {
            display: none;
        }
    }
</style>
