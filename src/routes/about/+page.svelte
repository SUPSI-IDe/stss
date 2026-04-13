<script lang="ts">
    import NavBar from '$lib/NavBar.svelte';
    import Overlay from '$lib/Overlay.svelte';
</script>

<svelte:head>
    <title>About | STSS Small Data</title>
</svelte:head>

<div class="page">
    <Overlay lines={['ABOUT', 'STSS SMALL DATA']} />
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
                <p>BLUECITY</p>
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
    .page {
        --text-gray: #7d7d7d;
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 28px;
        line-height: 1.11;
    }

    .bluecity {
        margin: 29px 8px 0 8px;
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
        line-height: 1.15;
    }

    .bluecity a {
        color: var(--text-black);
    }

    .bottom-grid {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        gap: 12px;
        margin: auto 8px 8px 8px;
        color: var(--text-gray);
        font-size: 12px;
        line-height: 1.11;
        align-items: end;
    }

    .bottom-grid a {
        color: inherit;
        text-decoration: underline;
    }

    .license-block {
        display: grid;
        gap: 2px;
        align-self: start;
    }

    .license-text {
        white-space: pre-line;
    }

    .cite-block {
        grid-column: 1 / span 4;
    }

    .data-policy {
        grid-column: 5 / span 5;
    }

    .contacts {
        grid-column: 13 / span 4;
    }
</style>
