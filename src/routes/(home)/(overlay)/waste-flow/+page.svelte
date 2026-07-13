<script lang="ts">
    import { resolve } from "$app/paths";
    import { Figure, OverlayArticle } from "$lib/components";
</script>

<OverlayArticle chapter={1} title="Waste Flow" pageClass="waste-flow">
    <div class="intro">
        <p>
            Urban waste management was identified as a particularly generative
            field for exploring
            <a href={resolve("/urban-small-data")}>small data</a>,
            as waste operates simultaneously as infrastructure, everyday
            routine, and cultural artefact. In this sense, waste reveals the
            complex entanglement of material flows, social values, and
            behavioural patterns that shape urban life.
        </p>
        <p>
            Within the scope of this research, "Waste Flow" refers to the set of
            processes and practices involved in managing discarded materials
            from their point of origin to their final treatment. This includes
            the production, collection, transport, processing, and disposal of
            waste, as well as the system of monitoring and regulation that
            govern these activities through policies, technologies, and
            infrastructures.
        </p>
    </div>

    <div class="content">
        <h2 class="heading">
            1.1 In the context of Lugano, waste disposal is organised through
            two complementary physical infrastructures:
        </h2>

        <div class="item">
            <span class="marker">+</span>
            <p>
                Ecopoints are distributed throughout the urban fabric as
                street-level collection points accessible 24/7. They allow
                residents to dispose of commonly separated materials such as
                glass, paper, plastic, metals, cans, PET bottles, batteries, and
                small WEEE. Their widespread presence and proximity makes them a
                key interface for everyday recycling practices, supporting
                frequent and decentralized forms of waste sorting.
            </p>
        </div>

        <div class="item">
            <span class="marker">+</span>
            <p>
                Ecocenters, typically located further from the city center,
                provide a broader and more structured service. Operating with
                defined opening hours and closed on Sundays, these facilities
                accept a wide range of materials free of charge, including bulky
                waste, green waste, construction rubble, glass, paper, metals,
                copper, cables, WEEE, oils and solvents, batteries, and other
                special waste. Beyond their disposal function, ecocenters also
                act as informal exchange spaces, where objects – especially
                bulky items – can be left and potentially recovered by others,
                encouraging reuse and extending the lifecycle of materials.
            </p>
        </div>

        <div class="figures">
            <Figure
                src="images/Ecopunto.gif"
                alt="Ecopoints"
                caption="Ecopoints"
            />
            <Figure
                src="images/EcoCentro.gif"
                alt="Ecocenters"
                caption="Ecocenters"
            />
        </div>

        <h2 class="heading">
            1.2 Within these infrastructures, waste is managed through a
            combination of separated collection streams and general waste (RSU):
        </h2>

        <div class="item">
            <span class="marker">+</span>
            <div>
                <p>
                    Separated waste streams: materials must be sorted according
                    to municipal guidelines and disposed at ecopoints,
                    ecocenters, or designated return locations:
                </p>
                <ul>
                    <li>
                        Aluminium and cans can be disposed of together after
                        rinsing
                    </li>
                    <li>
                        Paper and cardboard must be folded or cut to avoid
                        blockages
                    </li>
                    <li>
                        Electronics (WEEE) can be returned to retailers or taken
                        to ecocenters
                    </li>
                    <li>
                        Bulky waste is accepted at ecocenters or collected on
                        request
                    </li>
                    <li>Oils can be disposed of at ecocenters</li>
                    <li>PET bottles can be returned to shops or ecocenters</li>
                    <li>Batteries are collected at ecopoints and ecocenters</li>
                    <li>
                        Special waste, such as chemicals, paints, and solvents,
                        must be taken to ecocenters
                    </li>
                    <li>
                        Textiles can be brought to ecocenters or donated if
                        reusable
                    </li>
                    <li>
                        Glass can be disposed of at ecopoints during specific
                        hours
                    </li>
                    <li>
                        Organic waste and garden waste are accepted at
                        ecocenters
                    </li>
                    <li>
                        Plastic containers (PE, PP) can be delivered to
                        ecocenters
                    </li>
                </ul>
            </div>
        </div>

        <div class="item">
            <span class="marker">+</span>
            <p>
                General waste (RSU): Non-recyclable waste is managed through a
                pay-per-bag system. In Lugano, this takes the form of the red
                bag, an official municipal bag that must be purchased for
                disposal. Across Switzerland, each municipality uses its own
                color-coded version of this system. This model links disposal
                directly to cost, while separated materials can continue to be
                disposed of free of charge through dedicated recycling streams.
            </p>
        </div>

        <div class="figures figures-single">
            <Figure
                src="images/saccorosso.gif"
                alt="Red bag (RSU)"
                caption="Red bag (RSU)"
            />
        </div>
    </div>
</OverlayArticle>

<style>
    .intro {
        grid-column: 1 / 9;
        grid-row: 1;
        align-self: start;
        padding: 24px 8px 0;
        display: grid;
        gap: 18px;
    }

    .intro :global(p) {
        font-size: var(--text-lead);
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
    }

    .content {
        grid-column: 9 / -1;
        grid-row: 1;
        padding-right: 8px;
    }

    .heading {
        font-size: var(--text-base);
        font-weight: 500;
        margin-bottom: 8px;
    }

    .heading:not(:first-child) {
        margin-top: 28px;
    }

    .item {
        display: grid;
        grid-template-columns: 18px 1fr;
        column-gap: 4px;
        padding: 12px 0;
        border-top: 1px solid var(--text-secondary-on-light);
        font-size: var(--text-base);
        color: var(--text-secondary-on-light);
        line-height: var(--text-muted-leading);
    }

    .marker {
        user-select: none;
    }

    .item :global(p) {
        font-size: inherit;
        line-height: inherit;
    }

    .item ul {
        margin-top: 4px;
        padding-left: 18px;
    }

    .figures {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: var(--grid-gap);
        padding: 12px 0;
        border-top: 1px solid rgba(4, 4, 4, 0.18);
    }

    .figures-single :global(.figure) {
        grid-column: 1;
    }

    @media (max-width: 800px) {
        .intro {
            grid-column: 1 / -1;
            grid-row: auto;
        }

        .content {
            grid-column: 1 / -1;
            grid-row: auto;
            padding: 0 8px;
        }
    }
</style>
