<script lang="ts">
    import ExternalLink from "./ExternalLink.svelte";
    import supsiLogo from "$lib/assets/logo-main-small.svg";
    import { SITE_TITLE } from "$lib/constants.js";
</script>

<footer class="site-footer">
    <div class="footer-brand">{SITE_TITLE}</div>

    <div class="license-block footer-license">
        <span class="license-label">License</span>
        <span class="license-text">
            © 2024. This project is licensed under CC BY 4.0.
            Supported by Movetia. Exchange and mobility.
        </span>
    </div>

    <div class="license-block footer-contacts">
        <span class="license-label">Contacts</span>
        <span class="license-text">
            <ExternalLink href="https://www.instagram.com/">Instagram</ExternalLink> -
            <ExternalLink href="https://www.linkedin.com/">Linkedin</ExternalLink> -
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
        min-height: 108px;
        margin-top: 64px;
        padding: 38px 8px 18px;
        background: #fff;
        color: var(--text-gray);
        font-size: var(--text-base);
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

    .footer-license {
        grid-column: 5 / span 5;
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
        .footer-contacts {
            grid-column: 1 / -1;
        }
    }
</style>
