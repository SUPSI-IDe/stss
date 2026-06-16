<script lang="ts">
    import { asset, resolve } from "$app/paths";
    import {
        AutoplayVideo,
        IntroductoryParagraph,
        OverlayArticle,
        ProjectCarousel,
    } from "$lib/components";
    import "$lib/styles/project-page.css";
</script>

<OverlayArticle
    chapter={5}
    title="Urban Scraping"
    pageClass="urban-scraping project-page"
>
    <div class="info-table page-subgrid">
        <div class="info-table-cell">
            <p>type: workshop</p>
        </div>
        <div class="info-table-cell">
            <p>duration: 1 week</p>
            <p>dates: 07-11 Jul, 2025</p>
        </div>
        <div class="info-table-cell">
            <p>
                title: Urban Scraping - DIY Kits for Uncovering the City's
                Hidden Data
            </p>
            <p>participants: 9 students</p>
        </div>
    </div>
    <div class="media hero-media page-subgrid">
        <AutoplayVideo
            class="hero-video hero-video-wide"
            sources={[
                {
                    src: asset("/images/alpha-assets/urban-pixels-safari.mov"),
                    type: "video/quicktime",
                },
                {
                    src: asset("/images/alpha-assets/urban-pixels.webm"),
                    type: "video/webm",
                },
                {
                    src: asset("/images/heroes/urban-scraping.mov"),
                    type: "video/quicktime",
                },
            ]}
            ariaLabel="Urban Scraping hero video"
        />
    </div>
    <div class="activity-table page-subgrid">
        <div class="activity-table-row page-subgrid">
            <div class="activity-table-cell">
                <h4>workshop activities:</h4>
                <a
                    href={resolve(
                        "/participatory-data-practices#data-scraping",
                    )}
                >
                    data scraping
                </a>
                <a
                    href={resolve(
                        "/participatory-data-practices#data-plotting",
                    )}
                >
                    data plotting
                </a>
            </div>
            <div class="activity-table-cell">
                <h4>data collected:</h4>
                <p>comments, reviews, posts</p>
            </div>
        </div>
        <div class="activity-table-row page-subgrid">
            <div class="activity-table-cell">
                <h4>workshop activities:</h4>
                <a href={resolve("/participatory-data-practices#data-mapping")}>
                    data mapping
                </a>
            </div>
            <div class="activity-table-cell">
                <h4>data collected:</h4>
                <p>comments, reviews, posts, personal annotation</p>
            </div>
        </div>
    </div>
    <IntroductoryParagraph>
        <p>
            Urban Scraping: DIY Kits for Uncovering the City’s Hidden Data was a
            one-week workshop held from 7 to 11 July 2025, taking place between
            the SUPSI DACD campus FabLab in Mendrisio and Lugano’s LongLake
            Festival, where the developed outcomes were tested and situated
            within a public context. The workshop brought together Master’s
            students from Swiss and international universities of applied
            sciences in a learning environment that connected design research,
            fabrication, and public-facing urban inquiry. Across the week,
            students worked with FabLab tools, smart devices, Raspberry-Pi-based
            camera kits, and open-source applications to explore how data
            generated in everyday city life can become observable,
            interpretable, and discussable through design.
        </p>
        <p>
            The workshop built on the approach of Urban Small Data and focused
            on its application through citizen-driven urban sensing. More
            specifically, it explored how accessible sensing tools and situated
            observations could support the investigation of urban phenomena, the
            collection of multimodal traces, and the development of tangible
            design outcomes. Within the workshop, this perspective framed
            sensing as a practical way to connect inquiry, prototyping, and
            public engagement in the city. The workshop was funded through the
            Blue City project and the Swiss Design Network Grant 2025.
        </p>
        <p>
            The research direction of the workshop centred on a series of
            connected questions: How can everyday urban behaviours and routines
            be captured through participatory sensing practices? How can
            multimodal traces become meaningful through visual and physical
            translation? How can tangible prototypes make the presence and
            impact of data more palpable in public space? How can privacy-aware
            data collection support critical engagement with contemporary urban
            data environments? These questions guided the workshop from the
            first experiments with sensing devices to the development of
            prototypes intended to spark dialogue and interpretation.
        </p>
        <p>
            Students were supported through a concrete set of materials and
            methods. They received an introduction to participatory sensing
            practices, worked directly with Raspberry-Pi-based camera kits,
            smart devices, and open-source applications, and used FabLab tools
            to transform collected information into tangible outcomes. The
            workshop materials enabled them to gather multimodal evidence
            capable of portraying urban behaviours and daily routines, while
            also gaining first-hand experience with privacy-aware data
            collection strategies and computer-vision experimentation. Through
            this combination of conceptual framing and hands-on making, the
            workshop created the conditions for students to investigate the city
            through data while producing prototypes that could support
            reflection, discussion, and public engagement.
        </p>
    </IntroductoryParagraph>
    <div class="sub-section page-subgrid">
        <span class="sub-section-num">5.1</span>
        <h2>Analysis of Results</h2>
        <p>
            The workshop generated a set of DIY sensing kits that turned a
            shared methodological framework into distinct and situated urban
            investigations. Each project addressed an issue that students
            identified as significant in everyday city life, combining
            accessible hardware, data collection, and visual transformation to
            make that condition observable and discussable. Taken together, the
            kits reveal a coherent structure across the workshop: each project
            begins with a specific urban issue, develops a compact sensing
            device, defines the relevant data to collect, and translates the
            resulting evidence into a tangible form of restitution. Within this
            common framework, the projects explored different directions,
            including waste overflow through AI-assisted image analysis,
            cigarette litter through GPS-based glitch distortion, and
            heat-related accessibility through thermal and RGB imaging.
        </p>
    </div>
    <ProjectCarousel prevLabel="Previous project" nextLabel="Next project">
        <div class="project-slide">
            <div class="project-info-table page-subgrid">
                <div class="project-info-cell">
                    <h3>Project:</h3>
                    <p>Urban Overflow</p>
                </div>
                <div class="project-info-cell">
                    <h3>Technology:</h3>
                    <p>Object Detection</p>
                </div>
                <div class="project-info-cell">
                    <h3>Function:</h3>
                    <p>
                        detect waste overflow around bins and recognize the type
                        of waste assigning it a color
                    </p>
                </div>
            </div>
            <div class="media page-subgrid">
                <AutoplayVideo
                    sources={[
                        {
                            src: asset("/images/alpha-assets/waste-overflow-safari.mov"),
                            type: "video/quicktime",
                        },
                        {
                            src: asset("/images/alpha-assets/waste-overflow.webm"),
                            type: "video/webm",
                        },
                        {
                            src: asset("/videos/urban-scraping-1.mp4"),
                            type: "video/mp4",
                        },
                    ]}
                />
            </div>
            <div class="project-description page-subgrid">
                <h3>Description:</h3>
                <p>
                    UrbanOverflow addresses the problem of excessive waste
                    accumulation around ecopoints and proposes a citizen-driven
                    system for reporting and visualising overflow over time. The
                    project combines a camera, LCD, buttons, GPS, and AI-based
                    object recognition in a portable kit that allows users to
                    photograph ecopoints, classify the observed waste, and
                    associate each report with a location and moment of
                    recording. The system collects data on waste type, waste
                    amount, and place and time of capture. These data are
                    returned through two outputs: a manipulated image in which a
                    coloured overlay indicates the category of waste and its
                    saturation reflects the extent of overflow, and a timeline
                    visualisation showing the evolution of accumulation at a
                    given ecopoint. In this way, the project links individual
                    reporting with a broader view of recurring patterns in waste
                    management.
                </p>
            </div>
        </div>
        <div class="project-slide">
            <div class="project-info-table page-subgrid">
                <div class="project-info-cell">
                    <h3>Project:</h3>
                    <p>Entro.py</p>
                </div>
                <div class="project-info-cell">
                    <h3>Technology:</h3>
                    <p>GPS Geolocation</p>
                </div>
                <div class="project-info-cell">
                    <h3>Function:</h3>
                    <p>
                        measure the distance between cigarette butts and the
                        nearest bin, distorting the image as that distance
                        increases
                    </p>
                </div>
            </div>
            <div class="media page-subgrid">
                <AutoplayVideo
                    sources={[
                        {
                            src: asset("/images/alpha-assets/entropy-safari.mov"),
                            type: "video/quicktime",
                        },
                        {
                            src: asset("/images/alpha-assets/entropy.webm"),
                            type: "video/webm",
                        },
                        {
                            src: asset("/videos/urban-scraping-2.mp4"),
                            type: "video/mp4",
                        },
                    ]}
                />
            </div>
            <div class="project-description page-subgrid">
                <h3>Description:</h3>
                <p>
                    Entro.py focuses on cigarette-butt litter in urban space and
                    investigates how its distance from the nearest bin can
                    reveal patterns of neglect and accessibility. The kit is
                    built with a Raspberry Pi Camera Module 3, a Grove GPS
                    sensor, and a button for image capture. Through this set-up,
                    users record images of cigarette butts together with their
                    location, enabling the system to relate the photographed
                    litter to the nearest public bin. The collected data include
                    the number of cigarette butts in the image, the coordinates
                    of the photographed site, the coordinates of the closest
                    bin, and the distance between the two. These measurements
                    are translated into a glitch-based visual language in which
                    image distortion intensifies as the distance from the
                    nearest bin increases. The result is an output that makes
                    spatial relations perceptible through image degradation,
                    turning everyday litter into a visible sign of urban
                    disorder.
                </p>
            </div>
        </div>
        <div class="project-slide">
            <div class="project-info-table page-subgrid">
                <div class="project-info-cell">
                    <h3>Project:</h3>
                    <p>Thermal Access</p>
                </div>
                <div class="project-info-cell">
                    <h3>Technology:</h3>
                    <p>Thermal Imaging</p>
                </div>
                <div class="project-info-cell">
                    <h3>Function:</h3>
                    <p>
                        capture surface temperatures at waste collection points
                        and overlay a thermal map on the visual frame,
                        highlighting the hottest point
                    </p>
                </div>
            </div>
            <div class="media page-subgrid">
                <AutoplayVideo
                    sources={[
                        {
                            src: asset("/images/alpha-assets/thermal-access-safari.mov"),
                            type: "video/quicktime",
                        },
                        {
                            src: asset("/images/alpha-assets/thermal-access.webm"),
                            type: "video/webm",
                        },
                        {
                            src: asset("/videos/urban-scraping-3.mp4"),
                            type: "video/mp4",
                        },
                    ]}
                />
            </div>
            <div class="project-description page-subgrid">
                <h3>Description:</h3>
                <p>
                    Thermal Access investigates the accessibility of waste
                    collection points during periods of intense heat. It focuses
                    on how elevated temperatures at bins, lids, and handles can
                    affect the use of these spaces, especially under summer
                    conditions. The kit combines a thermal camera and a standard
                    RGB camera in a portable device that captures both the
                    visible environment and its thermal behaviour. It collects
                    data on surface temperature together with the visual context
                    of the collection point. These data are returned through
                    composite images in which the thermal map is overlaid onto
                    the visual frame, often combined with edge-detection or
                    threshold-based processing. The hottest point in the scene
                    is highlighted and paired with a numerical temperature
                    value, producing an output that makes heat conditions
                    legible and reportable. Through this layered representation,
                    the project translates thermal measurements into a form that
                    can support public awareness and municipal attention.
                </p>
            </div>
        </div>
    </ProjectCarousel>
    <div class="sub-section page-subgrid">
        <span class="sub-section-num">5.2</span>
        <h2>Discussion on the method</h2>
        <p>
            The method combined principles of conditional design (REF) with a
            situated approach to citizen-driven urban sensing. By working with a
            predefined kit and configuring its components in response to a
            project question, students engaged in a design process centred on
            selection, assembly, and translation rather than open-ended
            technical invention. This structure foregrounded the relationship
            between sensing, interpretation, and form, while encouraging
            participants to consider how a compact set of tools could be
            oriented towards different urban issues. An important dimension of
            the method was the immediate visual restitution of collected data,
            which connected the act of recording with the act of interpretation.
            From this perspective, the workshop opens a methodological
            reflection on how real-time or near-real-time visual outputs can
            support forms of data literacy for non-experts and citizens. In
            relation to practices such as data walking, it suggests the value of
            situated and mobile encounters with data in which collection and
            sense-making unfold together.
        </p>
    </div>
</OverlayArticle>

<style>
    /* Shared project-page layout lives in $lib/styles/project-page.css. */
    .hero-media {
        place-items: center;
    }

    .hero-media :global(.hero-video) {
        grid-column: 1 / -1;
        display: block;
        justify-self: center;
        align-self: center;
        max-height: 100%;
        object-fit: contain;
    }

    .hero-media :global(.hero-video-wide) {
        width: 100%;
        height: auto;
    }

    /* Page-specific: column placement of the description heading + body. */
    .project-description h3 {
        grid-column: span 3;
    }
    .project-description p {
        grid-column: 1 / -1;
    }
</style>
