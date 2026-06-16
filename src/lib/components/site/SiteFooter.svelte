<script lang="ts">
    import ExternalLink from "./ExternalLink.svelte";
    import supsiLogo from "$lib/assets/logo-main-small.svg";
    import {
        DATA_POLICY_TEXT,
        LICENSE_TEXT,
        PROJECT_CITATION,
        SITE_TITLE,
    } from "$lib/constants.js";

    let { variant = "default" }: { variant?: "default" | "about" } = $props();
</script>

<footer class={`site-footer ${variant === "about" ? "about-footer" : ""}`}>
    {#if variant === "about"}
        <div class="license-block footer-citation">
            <span class="license-label">How to cite this project</span>
            <span class="license-text">{PROJECT_CITATION}</span>
        </div>

        <div class="license-block footer-data-policy">
            <span class="license-label">Data Policy</span>
            <span class="license-text">{DATA_POLICY_TEXT}</span>
        </div>
    {:else}
        <div class="footer-brand">{SITE_TITLE}</div>

        <div class="license-block footer-license">
            <span class="license-label">License</span>
            <span class="license-text">{LICENSE_TEXT}</span>
        </div>
    {/if}

    <div class="license-block footer-contacts">
        <span class="license-label">Contacts</span>
        <span class="license-text">
            <ExternalLink href="https://www.instagram.com/maindmastersupsi/"
                >Instagram</ExternalLink
            > -
            <ExternalLink
                href="https://www.linkedin.com/school/master-maind-supsi/"
                >LinkedIn</ExternalLink
            > -
            <a href="mailto:info@bluecity.store">Mail</a>
        </span>
    </div>

    <div class="footer-partner">
        <img class="footer-partner-logo" src={supsiLogo} alt="SUPSI" />
    </div>
</footer>

<style>
    .site-footer {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: var(--grid-template);
        column-gap: var(--grid-gap);
        align-items: start;
        /* Size to content (with min-height as a floor) instead of stretching to
           fill the page-body grid track, which clipped the multi-line license. */
        align-self: start;
        min-height: 108px;
        margin-top: 64px;
        padding: 38px 8px 18px;
        background: #fff;
        color: var(--text-gray);
        font-size: var(--text-base);
        line-height: var(--text-muted-leading);
    }

    .site-footer.about-footer {
        background: none;
    }

    .site-footer :global(a) {
        color: inherit;
        text-decoration: underline;
    }

    .footer-brand {
        grid-column: 1 / span 3;
        color: var(--text-black);
        text-transform: uppercase;
    }

    .footer-citation {
        grid-column: 1 / span 4;
    }

    .footer-license {
        grid-column: 5 / span 5;
    }

    .footer-data-policy {
        grid-column: 6 / span 5;
    }

    .footer-contacts {
        grid-column: 13 / span 3;
    }

    .footer-partner {
        grid-column: 17 / 19;
        grid-row: 1;
        justify-self: end;
        width: fit-content;
    }

    .footer-partner-logo {
        width: auto;
        height: 14.63px;
    }

    .about-footer {
        margin-top: auto;
        padding-top: 4px;
    }

    .about-footer .footer-partner {
        grid-column: 13 / span 2;
        grid-row: 2;
        justify-self: start;
        margin-top: 34px;
    }

    @media (max-width: 800px) {
        .site-footer {
            row-gap: 18px;
            min-height: 188px;
            margin-top: 44px;
            padding-top: 28px;
            padding-bottom: 28px;
        }

        .footer-brand {
            grid-column: 1 / span 3;
        }

        .footer-partner {
            grid-column: 4 / -1;
            grid-row: 1;
        }

        .footer-license,
        .footer-citation,
        .footer-data-policy,
        .footer-contacts {
            grid-column: 1 / -1;
        }

        .about-footer .footer-partner {
            grid-column: 1 / -1;
            grid-row: auto;
            margin-top: 0;
        }
    }
</style>
