<script lang="ts">
    import { ExternalLink, IntroOverlay, NavBar } from '$lib/components';
    import { LICENSE_TEXT, SITE_TITLE } from '$lib/constants.js';

    const aboutSections = [
        {
            title: 'Project Coordination',
            body: `Prof. Dr. Massimo Botta - Full Professor of Interaction Design
Antonella Autuori - PhD student
Luca Draisci - Research and Teaching Assistant
Ginevra Terenghi - Scientific Collaborator
Alice Mioni - Research and Teaching Assistant`
        },
        {
            title: 'Project Partners',
            body: `University of Applied Sciences and Arts of Southern Switzerland (SUPSI)
Swiss Federal Institute of Technology Lausanne (EPFL)
ETH Zurich (ETHZ)
Institute for Sustainable Energy
HES-SO (HES.SO Sion)
Nine implementation partners from industry.`
        }
    ];

</script>

<svelte:head>
    <title>About | {SITE_TITLE}</title>
</svelte:head>

<div class="page">
    <IntroOverlay lines={['ABOUT', SITE_TITLE]} />
    <NavBar
        variant="license"
        sections={aboutSections}
        licenseLabel="License"
        licenseText={LICENSE_TEXT}
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
    }

    .bluecity :global(a) {
        color: var(--text-black);
    }

    @media (max-width: 800px) {
        .bluecity-text {
            grid-column: 1 / -1;
        }
    }
</style>
