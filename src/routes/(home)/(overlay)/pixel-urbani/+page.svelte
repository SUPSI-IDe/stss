<script lang="ts">
    import { base, resolve } from "$app/paths";
    import {
        IntroductoryParagraph,
        OverlayArticle,
        ProjectCarousel,
    } from "$lib/components";
    import "$lib/styles/project-page.css";

    type Slide = {
        image: string;
        district: string;
        transport: string;
        time: string;
        quantity: string;
        activity: string;
    };

    // Scattered voxel-scan object videos for the composition. Positions are the
    // top-left corner as a percentage of the composition box; `w` is the width
    // as a percentage. `name` is the file basename; the clips' white backgrounds
    // are chroma-keyed to transparent alpha WebMs (mp4 fallback for browsers
    // without WebM-alpha support).
    type ObjectClip = { name: string; x: number; y: number; w: number };

    const objects: ObjectClip[] = [
        { name: "uova", x: 56, y: 12, w: 15 }, // top-centre
        { name: "sacco", x: 84, y: 10, w: 16 }, // top-right
        { name: "banana", x: 5, y: 28, w: 17 }, // mid-left
        { name: "bottiglia", x: 33, y: 50, w: 12 }, // centre
        { name: "tappi", x: 3, y: 60, w: 16 }, // bottom-left
        { name: "mela", x: 86, y: 58, w: 15 }, // bottom-right
        { name: "pizza", x: 57, y: 64, w: 15 }, // bottom-centre
        { name: "pila", x: 61, y: 40, w: 11 }, // centre
    ];

    const slides: Slide[] = [
        {
            image: "mappa1.webp",
            district: "Besso",
            transport: "Walking",
            time: "06:00 AM",
            quantity: "3",
            activity: "I listen to music and put my phone away",
        },
        {
            image: "mappa2.webp",
            district: "Pregassona",
            transport: "Walking",
            time: "06:00 PM",
            quantity: "3",
            activity:
                "Every now and then, after taking out the trash, I stop by Aldi to buy whatever I’m missing at home",
        },
        {
            image: "mappa3.webp",
            district: "Lugano Centro",
            transport: "Walking",
            time: "10:00 AM",
            quantity: "3",
            activity: "Travelling",
        },
        {
            image: "mappa4.webp",
            district: "Lugano Centro",
            transport: "Walking",
            time: "00:00 AM",
            quantity: "2.5",
            activity:
                "I also take the opportunity to pick up the mail or move my car if I left it in a public parking spot on Saturday night",
        },
        {
            image: "mappa5.webp",
            district: "Breganzona",
            transport: "Walking",
            time: "10:00 AM",
            quantity: "2",
            activity:
                "When I already have to leave the house for groceries, work, etc., I don’t really have a fixed routine",
        },
        {
            image: "mappa6.webp",
            district: "Loreto",
            transport: "Car",
            time: "12:00 PM; 04:00 PM",
            quantity: "3",
            activity: "To go grocery shopping",
        },
        {
            image: "mappa7.webp",
            district: "Loreto",
            transport: "Walking",
            time: "08:00 AM",
            quantity: "4",
            activity: "",
        },
        {
            image: "mappa8.webp",
            district: "Pregassona",
            transport: "Walking",
            time: "08:00 AM",
            quantity: "1",
            activity: "I’m usually with my two dogs.",
        },
        {
            image: "mappa9.webp",
            district: "Lugano Centro",
            transport: "Public Transport",
            time: "08:00 AM",
            quantity: "5",
            activity:
                "In the morning while I’m at work or at Migros Lugano Centro (while I’m doing grocery shopping)",
        },
        {
            image: "mappa10.webp",
            district: "Paradiso",
            transport: "Walking",
            time: "10:00 AM",
            quantity: "3.5",
            activity: "Grocery shopping – Weekend – Going out for dinner",
        },
        {
            image: "mappa11.webp",
            district: "Viganello",
            transport: "Walking",
            time: "08:00 AM",
            quantity: "2",
            activity:
                "On my way to work, I leave the paper bags in the basement so I can reuse them later",
        },
        {
            image: "mappa12.webp",
            district: "Riva San Vitale",
            transport: "Walking",
            time: "08:00 PM",
            quantity: "5",
            activity: "Going for a walk",
        },
        {
            image: "mappa13.webp",
            district: "Sementina",
            transport: "Walking",
            time: "06:00 PM",
            quantity: "2.75",
            activity:
                "I dispose of it before going to the gym since it’s on the way",
        },
        {
            image: "mappa14.webp",
            district: "Ecocentro Breganzona",
            transport: "Car",
            time: "08:00 AM",
            quantity: "6",
            activity:
                "I usually go around 12:00–12:30 because it’s not crowded. I avoid Saturdays because everyone goes then",
        },
        {
            image: "mappa15.webp",
            district: "Pazzallo",
            transport: "Walking",
            time: "06:00 PM",
            quantity: "2",
            activity: "I stay informed through social media",
        },
        {
            image: "mappa16.webp",
            district: "Lugano Centro",
            transport: "Walking",
            time: "00:00 AM",
            quantity: "0.25",
            activity: "",
        },
        {
            image: "mappa17.webp",
            district: "Breganzona",
            transport: "Walking",
            time: "02:00 PM; 04:00 PM",
            quantity: "5",
            activity:
                "I take advantage of the walk from home to the bus stop to take out the RSU waste bag",
        },
        {
            image: "mappa18.webp",
            district: "Morbio",
            transport: "Walking",
            time: "04:00 PM",
            quantity: "5",
            activity: "Going out in the evening, taking the dog out",
        },
        {
            image: "mappa19.webp",
            district: "Cadro",
            transport: "Bicycle",
            time: "08:00 AM",
            quantity: "4",
            activity: "",
        },
    ];
</script>

<OverlayArticle
    chapter={6}
    title="Pixel Urbani"
    pageClass="pixel-urbani project-page"
>
    <div class="info-table page-subgrid">
        <div class="info-table-cell">
            <p>type: workshop</p>
        </div>
        <div class="info-table-cell">
            <p>duration: 3 days</p>
            <p>dates: 16-18 Jul, 2025</p>
        </div>
        <div class="info-table-cell">
            <p>title: Pixel Urbani</p>
            <p>location: Studio Foce, Via Foce 1, Lugano</p>
            <p>part of: LongLake Festival 2025</p>
        </div>
    </div>
    <div class="media page-subgrid">
        <div class="composition">
            {#each objects as obj (obj.name)}
                <video
                    class="object"
                    style="left: {obj.x}%; top: {obj.y}%; width: {obj.w}%;"
                    autoplay
                    loop
                    muted
                    playsinline
                >
                    <source
                        src="{base}/videos/{obj.name}.webm"
                        type="video/webm"
                    />
                    <source
                        src="{base}/videos/{obj.name}.mp4"
                        type="video/mp4"
                    />
                </video>
            {/each}
        </div>
    </div>
    <div class="activity-table page-subgrid">
        <div class="activity-table-row page-subgrid">
            <div class="activity-table-cell">
                <h4>workshop activity:</h4>
                <a href={resolve("/participatory-data-practices") + "#data-walking"}>
                    data walking
                </a>
            </div>
            <div class="activity-table-cell">
                <h4>data collected:</h4>
                <p>
                    cigarette butts, ecopoints temperature, waste overflow,
                    position of bins, position of ecopoints, location of
                    collection points
                </p>
            </div>
        </div>
        <div class="activity-table-row page-subgrid">
            <div class="activity-table-cell">
                <h4>workshop activity:</h4>
                <a href={resolve("/participatory-data-practices") + "#data-plotting"}>
                    data plotting
                </a>
            </div>
            <div class="activity-table-cell">
                <h4>data collected:</h4>
                <p>
                    cigarette butts, ecopoints temperature, waste overflow,
                    position of bins, position of ecopoints, location of
                    collection points
                </p>
            </div>
        </div>
        <div class="activity-table-row page-subgrid">
            <div class="activity-table-cell">
                <h4>workshop activity:</h4>
                <a href={resolve("/participatory-data-practices") + "#data-mapping"}>
                    data mapping
                </a>
            </div>
            <div class="activity-table-cell">
                <h4>data collected:</h4>
                <p>
                    position of bins, position of ecopoints, routes, time, means
                    of transport, recycling habits, type and amount of waste,
                    households, personal notations, body postures, gestures
                </p>
            </div>
        </div>
    </div>
    <IntroductoryParagraph>
        <p>
            Pixel Urbani was a collaborative workshop held from 16 to 18 July
            2025 at Studio Foce, Via Foce 1, Lugano, as part of the broader
            public programme of LongLake Festival 2025. Open to all citizens
            upon registration, the workshop brought together members of the
            public and actors involved in city governance to explore how urban
            waste collection is experienced in Lugano. Through a collaborative
            process of reflection, mapping, and discussion, participants engaged
            with everyday habits, recycling practices, technology, and design,
            contributing to a shared understanding of how daily life shapes, and
            is shaped by, the city's waste management system.
        </p>
        <p>
            The programme was structured through a range of activities
            distributed across the three days, making it possible to accommodate
            different schedules and forms of participation. Short public
            interactions were combined with longer collaborative sessions,
            enabling participants to contribute according to their availability
            while still feeding into a shared process. In this way, the workshop
            could work directly with materials collected from the public,
            progressively turning observations, mappings, and reflections into
            concrete results.
        </p>
    </IntroductoryParagraph>
    <div class="sub-section page-subgrid">
        <span class="sub-section-num">6.1</span>
        <h2>Analysis of Results</h2>
        <p>
            The workshop produced a qualitative and spatial dataset built
            through data walking, data plotting, and data mapping. During the
            walks, participants collected situated observations on ecopoints,
            routes, accessibility conditions, and everyday disposal practices.
            These traces were then revisited through visualisations and
            collectively interpreted, before being translated into annotated
            maps that connected disposal routines with distance, transport mode,
            timing, household composition, waste typologies, and related daily
            activities.
        </p>
        <p>
            Across these materials, several themes emerged. The results show
            that waste disposal is strongly integrated into everyday mobility
            and routines, often linked to commuting, shopping, walking, or
            weekend movements. They also highlight the role of distance, effort,
            and accessibility, including uphill routes, unsafe or inconvenient
            crossings, fragmented collection points, and the physical difficulty
            of carrying specific materials. A further theme concerns the
            legibility of the system, especially when waste categories are
            distributed across different locations or when information about
            where and how to dispose of materials remains unclear. Together,
            these findings show how waste collection is experienced as an urban
            practice shaped by infrastructures, local conditions, and daily
            habits rather than by service provision alone.
        </p>
        <p>
            These results can inform several areas of urban management,
            including the placement and accessibility of collection points, the
            coordination of waste categories across locations, and the design of
            clearer service information and wayfinding. More broadly, the
            workshop shows how participatory forms of <a href={resolve("/urban-small-data")}>small data</a> collection
            can bring everyday experience into dialogue with urban management by turning
            local routines and observations into shared, interpretable evidence.
        </p>
    </div>
    <ProjectCarousel prevLabel="Previous map" nextLabel="Next map">
        {#each slides as slide (slide.image)}
            <div class="project-slide">
                <div class="project-info-table page-subgrid">
                    <div class="project-info-cell">
                        <h3>District:</h3>
                        <p>{slide.district}</p>
                    </div>
                    <div class="project-info-cell">
                        <h3>Means of Transport:</h3>
                        <p>{slide.transport}</p>
                    </div>
                    <div class="project-info-cell">
                        <h3>Time:</h3>
                        <p>{slide.time}</p>
                    </div>
                    <div class="project-info-cell">
                        <h3>Quantity per Week:</h3>
                        <p>{slide.quantity}</p>
                    </div>
                </div>
                <div class="media page-subgrid">
                    <img
                        src="{base}/images/web_optimized/{slide.image}"
                        alt="Map by a {slide.district} participant"
                    />
                </div>
                {#if slide.activity}
                    <div class="project-description page-subgrid">
                        <h3>Related activities:</h3>
                        <p>{slide.activity}</p>
                    </div>
                {/if}
            </div>
        {/each}
    </ProjectCarousel>
    <div class="sub-section page-subgrid">
        <span class="sub-section-num">6.2</span>
        <h2>Discussion on the method</h2>
        <p>
            The workshop method was structured as a sequence in which data
            walking, data plotting, and data mapping progressively transformed
            situated observations into shared interpretation. Data walking
            grounded the process in direct encounters with the city, allowing
            participants to collect traces in relation to routes, ecopoints, and
            local conditions. Data plotting supported a first interpretative
            step by bringing these traces back into view through visualisations
            that connected images, sensor readings, and context. Data mapping
            then extended this process by translating individual routines into
            comparable spatial artefacts, making it possible to move from
            observation to dialogue and collective reflection.
        </p>
        <p>
            Within this sequence, data mapping played a particularly important
            methodological role because it organised diverse and situated
            contributions into a shared visual format. Routes, timings,
            household composition, transport mode, disposal frequency, and
            related daily activities were embedded into annotated maps, allowing
            participants to externalise their routines and place them alongside
            those of others. This supported a form of participation in which
            lived experience became discussable through material and spatial
            representation. Mapping therefore worked as a collective device for
            comparison, interpretation, and co-creation, linking personal
            accounts to broader questions of accessibility, service design, and
            urban infrastructure.
        </p>
        <p>
            The workshop method brought together experience, visualisation, and
            collective sense-making. The process supported participation by
            keeping data close to everyday life while also creating formats
            through which individual contributions could enter a shared
            discussion. In this way, the method positioned <a href={resolve("/urban-small-data")}>small data</a> as a
            medium between citizens' experiences and urban governance, enabling a
            more situated and context-sensitive understanding of the city.
        </p>
    </div>
</OverlayArticle>

<style>
    /* Shared project-page layout lives in $lib/styles/project-page.css. */
    .composition {
        grid-column: 1 / -1;
        position: relative;
        height: 100%;
        overflow: hidden;
    }

    .object {
        position: absolute;
        height: auto;
        pointer-events: none;
    }

    /* Page-specific: heading and body sit side by side. */
    .project-description h3 {
        grid-column: 1 / 7;
    }

    .project-description p {
        grid-column: 7 / -1;
    }
</style>
