<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import NavBar from '$lib/NavBar.svelte';

    let timestamp = $state('');
    let timer: number | null = null;
    // Overlay invitation animation on about load & inactivity
    const LINES = ['ABOUT', 'STSS SMALL DATA'];
    let overlayVisible = $state(true);
    let animationDone = $state(false);
    let displayedLines = $state(LINES.map(() => ''));
    let overlayInterval: ReturnType<typeof setInterval> | null = null;
    let inactivityTimeout: ReturnType<typeof setTimeout> | null = null;

    function updateTimestamp() {
        const now = new Date();
        timestamp = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Zurich',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);
    }

    if (browser) {
        onMount(() => {
            updateTimestamp();
            timer = window.setInterval(updateTimestamp, 60_000);

            startOverlayAnimation();
            resetInactivityTimer();
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        });

        onDestroy(() => {
            if (timer !== null) clearInterval(timer);
            if (overlayInterval) clearInterval(overlayInterval);
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            window.removeEventListener('mousemove', handleMouseMove);
        });
    }

    function startOverlayAnimation() {
        if (overlayInterval) clearInterval(overlayInterval);
        overlayVisible = true;
        animationDone = false;
        displayedLines = LINES.map(() => '');

        let lineIndex = 0;
        let charIndex = 0;

        overlayInterval = window.setInterval(() => {
            if (lineIndex >= LINES.length) {
                if (overlayInterval) clearInterval(overlayInterval);
                overlayInterval = null;
                animationDone = true;
                return;
            }

            const current = LINES[lineIndex];
            displayedLines[lineIndex] = current.slice(0, charIndex + 1);
            charIndex += 1;

            if (charIndex >= current.length) {
                lineIndex += 1;
                charIndex = 0;
            }
        }, 70);
    }

    function resetInactivityTimer() {
        if (!browser) return;
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
        inactivityTimeout = window.setTimeout(() => {
            startOverlayAnimation();
        }, 60_000);
    }

    function handleMouseMove() {
        if (animationDone && overlayVisible) {
            overlayVisible = false;
        }
        resetInactivityTimer();
    }
</script>

<svelte:head>
    <title>About | STSS Small Data</title>
</svelte:head>

<div class="page">
    {#if overlayVisible}
        <div class="overlay" aria-live="polite">
            <div class="overlay-text">
                {#each displayedLines as line, idx}
                    <div class="line" aria-label={LINES[idx]}>{line}</div>
                {/each}
            </div>
        </div>
    {/if}
    <NavBar
        timestamp={timestamp}
        secondaryVariant="license"
        secondaryTitle="Project Coordination"
        secondaryBody={`Prof. Dr. Massimo Botta - Project Coordinator
Antonella Autuori - Researcher
Luca Draisci - Researcher - Web Developer
Ginevra Terenghi - Researcher
Alice Mioni - Researcher - Website Designer`}
        secondaryVariant2="license"
        secondaryTitle2="Project Partners"
        secondaryBody2={`Swiss Federal Institute of Technology Lausanne (EPFL)
ETH Zurich (ETHZ)
Institute for Sustainable Energy
HES-SO (HES.SO Sion)
University of Applied Sciences and Arts of Southern Switzerland (SUPSI)
nine implementation partners from industry.`}
        showGap={false}
    />

    <section class="bluecity">
        <div class="bluecity-grid">
            <div class="bluecity-text">
                <h3>BLUECITY</h3>
                <p>
                    Our investigation of this topic happens within the Bluecity project
                    (<a href="https://www.bluecity.store/" target="_blank" rel="noreferrer">https://www.bluecity.store/</a>) which is an
                    Innosuisse-funded research initiative exploring the role of digital twins in the urban context. The project is led by EPFL,
                    who developed a series of flows of data to better understand and frame the city of Lausanne, Switzerland.
                </p>
                <p>
                    Our contribution is localised within the city of Lugano and aims to understand how citizen participation and local
                    data practices can foster new forms of communication and collaboration between residents and governance actors.
                    This setting offers the opportunity to investigate small data through situated encounters with waste in everyday life
                    and its routines, positioning participation as a mode of inquiry grounded in local experience.
                </p>
                <p>
                    Urban waste management was identified as a particularly generative field for exploring small data, as waste
                    simultaneously operates as infrastructure, routine, and cultural artefact revealing the entanglement of material flows,
                    social values, and behaviours in urban life.
                </p>
            </div>
        </div>
    </section>

    <footer class="bottom-grid">
        <div class="license-block cite-block">
            <span class="license-label">How to cite this project</span>
            <span class="license-text">
                Cangiano, S., Terenghi, G., Autuori, A., Subet, M. (2025). MAKEAWARE! Data pills and workshops to
                raise awareness on antibiotic consumption and antimicrobial resistance
            </span>
            <span class="license-text">
                <a href="https://spearhead-amr.github.io/makeaware/" target="_blank" rel="noreferrer">https://spearhead-amr.github.io/makeaware/</a>
            </span>
        </div>

        <div class="license-block data-policy">
            <span class="license-label">Data Policy</span>
            <span class="license-text">
                This Repository is hosted on GitHub Pages. We do not use cookies and we do not collect any data or information from your navigation.
                All data is anonymised. Learn more about the use of data in the Data Privacy and Management Policy Page. Data is not used for profiling nor commercial or marketing use.
            </span>
        </div>

        <div class="license-block contacts">
            <span class="license-label">Contacts</span>
            <span class="license-text">
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a> -
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Linkedin</a> -
                <a href="mailto:info@bluecity.store">Mail</a>
            </span>
        </div>
    </footer>
</div>

<style>
    @font-face {
        font-family: 'Helvetica Neue';
        src: url('/stss-web/font/HelveticaNeue-Medium.woff') format('woff');
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'OTNeueMontreal-MediumSqueezed';
        src: url('/stss-web/font/OTNeueMontreal-MediumSqueezed.woff') format('woff');
        font-display: swap;
        font-style: normal;
    }

    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(:root) {
        --text-black: #040404;
        --bg: #f4f4f4;
        --text-gray: #7d7d7d;
    }

    :global(body) {
        background: var(--bg);
        color: var(--text-black);
        font-family: 'Helvetica Neue', 'Helvetica Neue Medium', sans-serif;
        font-size: 13.38px;
        line-height: 1.25;
    }

    .page {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 28px;
        box-sizing: border-box;
    }

    .bluecity {
        margin: 29px 8px 0 8px;
        color: var(--text-black);
    }

    .bluecity-grid {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        gap: 12px;
    }

    .bluecity-text {
        grid-column: 1 / span 9;
        display: grid;
        gap: 8px;
        font-size: 13.38px;
        line-height: 1.15;
        letter-spacing: 0.1px;
    }

    .bluecity h3 {
        margin: 0;
        text-transform: uppercase;
        font-size: 13.38px;
        font-weight: 400;
        letter-spacing: 0.1px;
    }

    .bluecity p {
        margin: 0;
        text-transform: none;
    }

    .bluecity a {
        color: var(--text-black);
    }

    .bottom-grid {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        gap: 12px;
        margin: auto 8px 8px 8px;
        padding-bottom: 0;
        color: var(--text-gray);
        font-size: 12px;
        line-height: 1.35;
        box-sizing: border-box;
        align-items: end;
    }

    .cite-block {
        grid-column: 1 / span 4;
        display: grid;
        gap: 2px;
        color: var(--text-gray);
    }

    .license-block {
        color: var(--text-gray);
        font-size: 12px;
        display: grid;
        gap: 2px;
        align-self: start;
    }

    .license-label {
        color: var(--text-gray);
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0.1px;
    }

    .license-text {
        color: var(--text-gray);
        white-space: pre-line;
        letter-spacing: 0.1px;
    }

    .license-text a {
        color: var(--text-gray);
        text-decoration: underline;
    }

    .data-policy {
        grid-column: 5 / span 5;
    }

    .contacts {
        grid-column: 13 / span 4;
        text-align: left;
    }

    .overlay {
        position: fixed;
        inset: 0;
        background: transparent;
        display: grid;
        place-items: center;
        z-index: 2000;
    }

    .overlay-text {
        text-align: center;
        text-transform: uppercase;
        font-family: 'OTNeueMontreal-MediumSqueezed', 'Helvetica Neue', sans-serif;
        font-size: clamp(120px, 18vw, 253.19px);
        line-height: 0.8;
        letter-spacing: -6px;
        color: var(--text-black);
        pointer-events: none;
        user-select: none;
    }

    .overlay-text .line + .line {
        margin-top: 0.12em;
    }

    @media (max-width: 800px) {
        .contacts {
            text-align: left;
        }
    }
</style>
