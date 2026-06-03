<script lang="ts">
    import { ExternalLink, IntroOverlay, NavBar } from '$lib/components';
</script>

<svelte:head>
    <title>About | STSS Small Data</title>
</svelte:head>

<div class="page">
    <IntroOverlay lines={['ABOUT', 'STSS SMALL DATA']} />
    <NavBar
        variant="license"
        sections={[
            {
                title: 'Project Coordination',
                body: `Prof. Dr. Massimo Botta - Project Coordinator
Antonella Autuori - Researcher
Luca Draisci - Researcher - Web Developer
Ginevra Terenghi - Researcher
Alice Mioni - Researcher - Website Designer`
            },
            {
                title: 'Project Partners',
                body: `Swiss Federal Institute of Technology Lausanne (EPFL)
ETH Zurich (ETHZ)
Institute for Sustainable Energy
HES-SO (HES.SO Sion)
University of Applied Sciences and Arts of Southern Switzerland (SUPSI)
nine implementation partners from industry.`
            }
        ]}
        showGap={false}
    />

    <section class="bluecity">
        <div class="bluecity-grid">
            <div class="bluecity-text">
                <p class="bluecity-title">BLUECITY</p>
                <p class="bluecity-copy">
                    Our investigation of this topic happens within the Bluecity project
                    (<ExternalLink href="https://www.bluecity.store/">https://www.bluecity.store/</ExternalLink>) which is an
                    Innosuisse-funded research initiative exploring the role of digital twins in the urban context. The project is led by EPFL,
                    who developed a series of flows of data to better understand and frame the city of Lausanne, Switzerland.
                </p>
                <p class="bluecity-copy">
                    Our contribution is localised within the city of Lugano and aims to understand how citizen participation and local
                    data practices can foster new forms of communication and collaboration between residents and governance actors.
                    This setting offers the opportunity to investigate small data through situated encounters with waste in everyday life
                    and its routines, positioning participation as a mode of inquiry grounded in local experience.
                </p>
                <p class="bluecity-copy">
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
                <ExternalLink href="https://spearhead-amr.github.io/makeaware/">https://spearhead-amr.github.io/makeaware/</ExternalLink>
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
                <ExternalLink href="https://www.instagram.com/">Instagram</ExternalLink> -
                <ExternalLink href="https://www.linkedin.com/">Linkedin</ExternalLink> -
                <a href="mailto:info@bluecity.store">Mail</a>
            </span>
        </div>
    </footer>
</div>

<style>
    .page {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 28px;
    }

    .bluecity {
        margin: 29px 8px 0 8px;
    }

    .bluecity-grid {
        display: grid;
        grid-template-columns: var(--grid-template);
        gap: var(--grid-gap);
    }

    .bluecity-text {
        grid-column: 1 / span 9;
    }

    .bluecity-title {
        margin-bottom: 8px;
    }

    .bluecity-copy {
        margin: 0;
        padding: 0;
        text-indent: 1.5em;
    }

    .bluecity :global(a) {
        color: var(--text-black);
    }

    .bottom-grid {
        display: grid;
        grid-template-columns: var(--grid-template);
        gap: var(--grid-gap);
        margin: auto 8px 8px 8px;
        color: var(--text-gray);
        font-size: var(--text-small);
        align-items: end;
    }

    .bottom-grid :global(a) {
        color: inherit;
        text-decoration: underline;
    }

    .license-block {
        align-self: start;
    }

    .cite-block {
        grid-column: 1 / span 4;
    }

    .data-policy {
        grid-column: 6 / span 5;
    }

    .contacts {
        grid-column: 13 / span 4;
    }

    @media (max-width: 800px) {
        .bluecity-text,
        .cite-block,
        .data-policy,
        .contacts {
            grid-column: 1 / -1;
        }
    }
</style>
