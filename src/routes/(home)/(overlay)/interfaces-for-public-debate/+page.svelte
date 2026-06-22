<script lang="ts">
    import { asset, base, resolve } from "$app/paths";
    import {
        AutoplayVideo,
        ExternalLink,
        IntroductoryParagraph,
        OverlayArticle,
        ProjectCarousel,
    } from "$lib/components";
    import "$lib/styles/project-page.css";

    const projectBaseUrl = "https://maind.supsi.ch/dddii2026";

    const projects = [
        {
            title: "Arboreal Metrics",
            tagline: "Paradox Between Popular and Efficient Plants",
            href: `${projectBaseUrl}/arboreal-metrics-paradox/pollinator-info.html`,
            videos: [
                {
                    src: "/images/projects-web-optimized/Arboreal Metrics/Arboreal-Metrics-1.mp4",
                    poster: "/images/projects-web-optimized/Arboreal Metrics/Arboreal-Metric.jpg",
                },
                {
                    src: "/images/projects-web-optimized/Arboreal Metrics/Arboreal-Metrics-2.mp4",
                    poster: "/images/projects-web-optimized/Arboreal Metrics/Arboreal-Metric.jpg",
                },
            ],
            body: `Arboreal Metrics explores how urban green spaces are designed and valued through the case of Parco Ciani in Lugano, focusing on the tension between environmental efficiency, biodiversity, and public perception. The project combines heterogeneous data sources into a single dataset: environmental and botanical data such as CO₂ absorption, cooling capacity, species origin, and classification are retrieved from institutional platforms including Infoflora and Lugano VerdeVale; these are integrated with citizen-generated data, in particular images extracted from user reviews on Google Maps, where the most photographed tree species act as an indicator of public attention and preference. These combined dimensions are translated into a 2D and 3D interactive visualisation: the 2D layer supports a more analytical comparison of species based on performance, biodiversity, and popularity, while the 3D layer enables a more experiential exploration, integrating data sonification and open navigation through the dataset. A participatory feature invites users to design their own version of Parco Ciani by selecting and balancing tree species, turning the interface into a process of collective literacy-building through making and comparing choices about the park's composition.`,
        },
        {
            title: "The Yelpification of Nature",
            tagline: "Nature as a Service",
            href: `${projectBaseUrl}/yelpification-of-nature/MAInD_SEM02_Making_Use_of_Data/yelpification/index.html`,
            videos: [
                {
                    src: "/images/projects-web-optimized/The Yelpification of Nature/The Yelpification of Nature.mp4",
                    poster: "/images/projects-web-optimized/The Yelpification of Nature/The Yelpification of Nature.jpg",
                },
            ],
            body: `The Yelpification of Nature examines how urban green spaces in Ticino, including parks around Lugano, are perceived and evaluated through online reviews. The project reveals a shift in how nature is experienced, showing how citizens increasingly apply the logic of consumer services to parks, expecting cleanliness, comfort, and performance rather than ecological variability. The dataset is built from more than 2,500 reviews collected from Google Maps using a scraper via Apify. These reviews, gathered across 34 green spaces in the Canton of Ticino, include textual content, ratings, and metadata such as location and time. The data is then categorised into recurring themes, including maintenance and cleanliness, safety, access and infrastructure, nature and landscape, wellbeing, and governance. This process shifts the focus from overall ratings to the criteria people use when describing parks, making visible the expectations embedded in everyday language. The interface visualises these themes through a circular layout, where each segment represents a dimension of park experience and each review appears as a point within it. Overlaps between categories reveal how different expectations intersect, while the density of points highlights which aspects are most discussed. By mapping mentions rather than sentiment, the interface exposes how nature is framed and evaluated, rather than whether it is simply liked or disliked. A participatory layer allows users to contribute their own reviews directly within the interface, positioning their experience alongside the existing dataset. This transforms the system into an evolving map of public perception, where gaps and concentrations invite further input. Through this process, the project makes visible how expectations shape the management of urban nature, while prompting users to reflect on how they themselves observe, describe, and evaluate green spaces in urban context.`,
        },
        {
            title: "An Aura of Words",
            tagline: "Describing green space through language",
            href: `${projectBaseUrl}/aura-of-words/MAInD-Making_Use_of_Data-2026-Lugano_Parks/index.html`,
            videos: [
                {
                    src: "/images/projects-web-optimized/An Aura of Words/An-Autra-of-words.mp4",
                    poster: "/images/projects-web-optimized/An Aura of Words/An-Aura-of-words-1.jpg",
                },
            ],
            body: `An Aura of Words explores how urban green spaces are experienced and described through language, using five parks in Lugano as a case study. Instead of relying on institutional descriptions, the project focuses on citizen-generated text, treating reviews as a way to access how people perceive, feel, and make sense of these spaces. The dataset consists of Google Reviews collected from Google Maps using a custom scraping script, including over 3,400 word occurrences across five parks. Reviews are multilingual and unstructured, capturing everyday expressions rather than formal feedback. The text is processed through a semantic categorisation framework with six dimensions: experiential-emotional, sensory-environmental, action, relational context, tension or complaint, and infrastructure or amenities. Each word is tagged, counted, and contextualised, allowing the dataset to retain both frequency and meaning. The interface translates this corpus into a scrollytelling experience that progressively builds a visual "aura" for each park. These auras are colour-weighted compositions that reflect the distribution of semantic categories, creating a readable portrait of how each space is collectively described. The process is made visible through animated annotation, showing how individual words contribute to the final form. The participatory layer invites users to contribute by describing their ideal park. As they write, their words are categorised in real time using the same framework, making the interpretation process transparent. This interaction turns participation into a moment of reflection, where users see how their language aligns with or diverges from the collective portrait, contributing to an evolving understanding of how urban green spaces are perceived and valued.`,
        },
        {
            title: "Overexposed",
            tagline: "The city as social-media image",
            href: `${projectBaseUrl}/overexposed/index.html`,
            videos: [
                {
                    src: "/images/projects-web-optimized/Overexposed/Overexposed.mp4",
                    poster: "/images/projects-web-optimized/Overexposed/Overexposed-1.jpg",
                },
            ],
            body: `Overexposed examines how social media tourism shapes the image of Lugano by concentrating attention on a limited number of highly photographed places. The project explores the gap between the physical city and its digital representation, questioning how platforms, tourists, influencers, and promotional narratives contribute to defining what becomes visible, desirable, and repeatedly circulated. The dataset combines visual and geolocated data extracted from Instagram and TikTok-related content, starting from "places to visit in Lugano" searches to identify the most represented locations. Instagram is then used as the main source for scraping, focusing on place-based content and collecting 6,253 images across five locations. The data include geographic coordinates and images, which are processed through Python-based tools and clustered according to visual similarity, making it possible to identify recurring viewpoints, subjects, and stereotyped framings. The interface first presents a heatmap showing the density of posted images across Lugano, making visible the concentration of digital attention around a small set of places. It then moves into a 3D and 360° exploration, where the interface enables a dual reading of the same location: on one side, users navigate the space through a 360° view of the actual environment; on the other, they encounter clusters of Instagram images capturing the same recurring viewpoints. This juxtaposition highlights how specific framings are repeatedly produced and circulated, reinforcing their visibility and shaping a dominant, and often reductive, image of the city. The participatory layer invites users to explore the 360° view, select their own viewpoint, and capture an image. These contributions form an evolving archive of alternative perspectives, expanding the representation of the city beyond the most circulated social media views.`,
        },
        {
            title: "Waste Narrative",
            tagline: "The Sacco Rosso, between policy and practice",
            href: `${projectBaseUrl}/waste-narrative-lugano/FINAL.html`,
            videos: [
                {
                    src: "/images/projects-web-optimized/Waste Narrative/Waste-Narrative.mp4",
                    poster: "/images/projects-web-optimized/Waste Narrative/Waste-Narrative.jpg",
                },
            ],
            body: `Waste Narratives explores the social and urban tensions generated by the introduction of the "Sacco Rosso" (red bag) policy in Lugano, focusing on the gap between institutional narratives and everyday practices. The project investigates how a top-down environmental measure is interpreted, negotiated, and sometimes resisted by citizens, revealing informal behaviours and workarounds that emerge in response to economic and practical constraints. The dataset combines multiple sources to capture different perspectives in the debate. Institutional data are collected from official municipal websites, including policy descriptions and regulatory frameworks. These are complemented by media articles from outlets such as RSI, Corriere del Ticino, and Ticinonews, which provide a public narrative of the policy and its impacts. Citizen-generated data are primarily gathered from Reddit using Apify, capturing informal discussions, complaints, and everyday strategies. These textual data are organised into categories reflecting recurring behaviours, sentiments, and topics, alongside metadata such as time, platform, and level of engagement. The interface visualises this dataset as a network of comments, where colour encodes different types of behaviours and connections link related arguments or shared keywords. This structure allows users to navigate the debate not as isolated opinions, but as a connected system of positions, highlighting how institutional narratives, media framing, and citizen experiences intersect and diverge. The participatory layer enables users to react to existing content and contribute their own perspectives through text and visual input. These contributions are integrated into the interface, allowing the dataset to evolve over time and making visible how the debate continues to develop. Through this approach, the project shifts attention from policy outcomes alone to the lived experience of waste management, exposing the frictions, adaptations, and informal practices that remain invisible in official accounts.`,
        },
        {
            title: "Rating the Rating System",
            tagline: "Healthcare reviews as a space of debate",
            href: `${projectBaseUrl}/rating-the-rating-system/MAInD-Making-Use-of-Data/index.html`,
            videos: [
                {
                    src: "/images/projects-web-optimized/Rating the Rating System/Rating-the-rating-system.mp4",
                    poster: "/images/projects-web-optimized/Rating the Rating System/Rating-the-rating-system.jpg",
                },
            ],
            body: `Rating the Rating System investigates how patient experiences in Lugano's healthcare institutions are reduced to single numerical ratings, obscuring the complexity of care and the systemic issues behind individual reviews. The project reframes reviews not as final judgments, but as starting points for interpretation, comparison, and public discussion. The dataset consists of patient reviews collected from Google Maps using Apify, focusing on hospitals and clinics listed by the City of Lugano. Each review combines a numerical rating (1–5 stars) with written descriptions of experience. The textual data is analysed through a thematic classification process in which categories such as staff, empathy, administration, waiting time, and infrastructure emerge inductively from the data. Reviews are then further broken down into key phrases that capture specific aspects of care, allowing a single experience to be distributed across multiple dimensions rather than reduced to a single score. The interface organises these layers through a radial structure inspired by a parliament chart, explicitly referencing a space of debate rather than evaluation. Categories are arranged as sectors, while the distance from the centre encodes the numerical rating. Each point represents a key phrase extracted from a review, enabling qualitative fragments to be explored across categories. At the same time, an analytical framework reorders and reframes these categories through dimensions such as controllability, responsibility, visibility, and the distinction between systemic and individual causes, allowing the same data to be interpreted from multiple perspectives. A participatory layer allows users to respond directly to reviews, introducing a threaded discussion feature that is not available in platforms such as Google Maps, where reviews remain isolated. This transforms each review into a discussion node, where visibility is driven by engagement and comments that generate more responses become more prominent. By combining quantitative ratings, qualitative narratives, and analytical reinterpretation within the same interface, the project shifts the focus from static evaluation to an exploratory process, supporting a more nuanced and collective understanding of healthcare experiences.`,
        },
    ];
</script>

<OverlayArticle
    chapter={7}
    title="Interfaces for Public Debate"
    pageClass="public-debate project-page"
>
    <div class="info-table page-subgrid">
        <div class="info-table-cell">
            <p>type: course</p>
        </div>
        <div class="info-table-cell">
            <p>duration: 2 days</p>
            <p>dates: 10-11 Jul, 2025</p>
        </div>
        <div class="info-table-cell">
            <p>title: Interfaces for Public Debate</p>
            <p>participants: 8 students</p>
        </div>
    </div>
    <div class="media hero-media page-subgrid">
        <AutoplayVideo
            class="hero-video hero-video-tall"
            sources={[
                {
                    src: asset("/images/alpha-assets/interfaces-safari.mov"),
                    type: "video/quicktime",
                },
                {
                    src: asset("/images/alpha-assets/interfaces.webm"),
                    type: "video/webm",
                },
                {
                    src: asset("/images/heroes/interfaces-for-debate.mp4"),
                    type: "video/mp4",
                },
            ]}
            ariaLabel="Interfaces for Public Debate hero video"
        />
    </div>
    <div class="activity-table page-subgrid">
        <div class="activity-table-row page-subgrid">
            <div class="activity-table-cell">
                <h4>workshop activities:</h4>
                <a href={resolve("/participatory-data-practices#data-scraping")}>
                    data scraping
                </a>
                <a href={resolve("/participatory-data-practices#data-plotting")}>
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
                <p>comments, posts, personal annotation</p>
            </div>
        </div>
    </div>

    <IntroductoryParagraph>
        <p>
            To bring <a href={resolve("/participatory-data-practices#data-scraping")}
                >data scraping</a
            > into the urban context through a
            participatory perspective, this activity was introduced within the
            Data Driven Design I course through a brief aligned with the research
            framework of the Blue City project. The aim was to explore how
            scraped data could support the design of interfaces that prompt
            public debate by making visible different perspectives, positions,
            and experiences. The course therefore became a setting in which <a
                href={resolve("/participatory-data-practices#data-scraping")}
                >data scraping</a
            >, <a
                href={resolve("/participatory-data-practices#data-plotting")}
                >data plotting</a
            >, and <a
                href={resolve("/participatory-data-practices#data-mapping")}
                >data mapping</a
            > were combined as complementary approaches to engage with public debate in urban
            contexts.
        </p>
        <p>
            Data Driven Design II, part of the MA in Interaction Design, explores
            how data can operate as a design material for engaging with complex
            and multi-dimensional urban conditions. The course invites students
            to work with layered and heterogeneous data, combining different
            sources and perspectives to explore patterns, relationships, and
            tensions across urban environments. Building on previous experiences
            with <a href={resolve("/urban-small-data")}>small data</a> and
            participatory methods, it extends this
            perspective towards platform-generated traces and other bottom-up
            forms of data, approaching them as situated, constructed, and open to
            interpretation.
        </p>
        <p>
            Within this framework, students developed group-based projects around
            selected urban phenomena, including recycling and waste practices,
            over-tourism, cross-border workers, urban green spaces, and
            healthcare systems and services. The brief asked them to design
            interactive interfaces able to prompt public debate by making visible
            different perspectives, positions, and experiences. By working with
            digital traces gathered from online spaces where these issues are
            actively discussed, students translated existing data into accessible
            and interpretable interfaces.
        </p>
        <p>
            This approach engages with a broader condition of contemporary data
            environments, where access to data is mediated by institutional and
            platform infrastructures, and where working with raw data is
            technically demanding and constrained by predefined schemas (Hunter,
            2025). These conditions limit the use of data as a flexible and
            situated design material. In response,
            <a href={resolve("/participatory-data-practices#data-scraping")}
                >data scraping</a
            > was framed as a way to access traces already produced by citizens through everyday
            digital practices—reviews, posts, discussions—and to reposition them
            within new contexts of interpretation and public discussion. The aim
            of the course was therefore twofold: to design interfaces that make
            visible the plurality of positions emerging from citizen-generated
            data, and to create systems that allow users to actively contribute
            and situate their own perspective within the data. The interface is
            thus approached not only as a medium for visualisation, but as a space
            for participation. This direction builds on participatory approaches
            where data supports collective inquiry and sense-making (Jensen et
            al., 2021b). Visual artefacts derived from personal experience have
            been shown to foster reflection and discussion around urban contexts
            (Lu et al., 2023), while interface-based tools demonstrate how visual
            data can surface agreement, disagreement, and forms of attachment
            within public discourse (Madsen et al., 2023). At the same time, work
            on participatory annotation highlights how visualisations can
            incorporate personal knowledge, allowing multiple interpretations of
            the same data to coexist (Lin et al., 2023). Collective mapping
            platforms further extend this logic by enabling users to inscribe
            personal experiences, perception and opinions into shared spatial
            representations, turning them into evolving environments for dialogue
            (Robards et al., 2020).
        </p>
    </IntroductoryParagraph>

    <div class="sub-section page-subgrid">
        <span class="sub-section-num">7.1</span>
        <h2>Analysis of Results</h2>
        <p>
            The course generated six interactive interfaces that transform data
            collected through scraping across different platforms into entry
            points for engaging with urban contexts and supporting public debate.
            Each project frames a specific issue by making visible different
            positions and inviting citizens to actively engage with them. Rather
            than treating data as a stable and self-evident representation of
            reality, these interfaces operate as devices for discussion, where
            data becomes a prompt for positioning, interpretation, and
            participation.
        </p>
        <p>
            Each project focused on one of the proposed urban themes, including
            waste practices, over-tourism, cross-border workers, urban green
            spaces, and healthcare systems, and followed a shared design process
            connecting data collection to interface design. The exploration of
            each topic was grounded in the context of Lugano, allowing students
            to relate platform-based data to a specific urban setting. The
            process begins by framing the topic as a matter of debate,
            identifying its scale and the actors involved, and considering
            micro–macro relationships that link individual experiences to broader
            systems. It then shifts to identifying the platforms where the debate
            is most visible and active. Rather than relying on predefined
            datasets, students located discussions within digital environments
            such as social media and forums, accessing informal and situated data
            produced by citizens, including posts, comments, and reviews. Through
            scraping, these traces were collected and organised as small-scale
            datasets reflecting different perspectives on the issue. These
            datasets informed the design of interactive interfaces that translate
            heterogeneous data into visual and interactive formats, revealing
            tensions, contrasts, and patterns within the debate. All projects
            integrate methods for user contribution, allowing participants to add
            their own opinions, experiences, or positions, creating a continuous
            loop between existing data and new inputs.
        </p>
        <p>
            Across the projects, a shared feature is the ability to navigate
            between aggregated views and situated contexts. Users move between
            overviews of the debate and specific contributions, supporting a
            “quali-quantitative” exploration of data (Venturini and Latour, 2010)
            that enables engagement with both patterns and individual experiences
            while retaining the complexity of the issue in an accessible and
            discussable form.
        </p>
    </div>

    <ProjectCarousel prevLabel="Previous project" nextLabel="Next project">
        {#each projects as project (project.title)}
            <div class="project-slide">
                <div class="project-info-table page-subgrid">
                    <div class="project-info-cell">
                        <h3>Title:</h3>
                        <p>{project.title}</p>
                        <p class="tagline">{project.tagline}</p>
                    </div>
                    <div class="project-info-cell project-info-cell-website">
                        <h3>Website:</h3>
                        <ExternalLink href={project.href}>Visit website →</ExternalLink>
                    </div>
                </div>
                <div class="media page-subgrid">
                    <AutoplayVideo
                        class="project-video"
                        poster={`${base}${project.videos[0].poster}`}
                        sources={[
                            {
                                src: `${base}${project.videos[0].src}`,
                                type: "video/mp4",
                            },
                        ]}
                    />
                </div>
                <div class="project-description page-subgrid">
                    <p>{project.body}</p>
                </div>
            </div>
        {/each}
    </ProjectCarousel>

    <div class="sub-section page-subgrid">
        <span class="sub-section-num">7.2</span>
        <h2>Discussion on the method</h2>
        <p>
            A first key aspect of the method concerns the effort to avoid overly
            simplified or polarised framings of debate. At the initial stage,
            students were introduced to a visual tool referred to as a
            brainstorming wheel, designed to expand the range of possible
            positions around a topic rather than reducing it to binary
            oppositions.
        </p>
        <figure class="bleed">
            <img
                class="debate-diagram"
                src={asset("/images/brainstorming-wheel.png")}
                alt="Brainstorming wheel diagram showing a topic branching into four positions, sources, and platforms."
            />
            <figcaption>
                The brainstorming wheel: a framing device that distributes
                viewpoints across a spectrum rather than into binary oppositions.
            </figcaption>
        </figure>
        <p>
            This diagram supports the identification of multiple, sometimes
            conflicting, viewpoints distributed across a spectrum, encouraging
            students to consider how debates are composed of overlapping
            perspectives rather than clear-cut oppositions. As such, it functions
            as a framing device that broadens the scope of inquiry and prevents
            early closure around predefined positions. More broadly, the method
            combines elements of digital methods with a design-oriented approach
            to data, where scraping, classification, and visualisation are not
            treated as purely technical steps but as interpretative acts.
            Students engage in a process of selection, filtering, and
            transformation, working with existing digital traces to construct
            datasets that are inherently partial and situated. This highlights how
            data is never neutral, but always shaped by the platforms, queries,
            and categories through which it is accessed.
        </p>
        <p>
            At the same time, the method reveals tensions in the use of automated
            tools, particularly in relation to AI-supported analysis. While
            computational techniques enable the processing of large volumes of
            data, they tend to flatten semantic richness, reducing nuanced
            expressions into rigid or predefined categories. This creates a
            trade-off between scale and depth, where the efficiency of automated
            classification can come at the cost of losing ambiguity, tone, and
            contextual meaning embedded in citizen-generated content. The design
            of the interfaces plays a crucial role in mediating these tensions.
            Rather than presenting data as fixed outputs, the interfaces are
            conceived as spaces for exploration, interpretation, and
            participation. They reconfigure datasets into navigable structures
            that make patterns visible while also allowing for questioning,
            comparison, and contribution. In this sense, the interface becomes an
            active component of the method, not only communicating results but
            shaping how data is understood and engaged with.
        </p>
        <p>
            Another limitation concerns the selection of platforms. The projects
            primarily rely on accessible and well-documented sources such as
            Google Maps, Instagram, and Reddit. While these platforms provide
            rich and readily available data, they also frame the type of content
            that can be collected, privileging certain voices, formats, and
            behaviours over others (Marres &amp; Weltevrede, 2013). This raises
            questions about representativeness and highlights how
            platform-specific logics influence both the data and the debates that
            emerge from it. From a data perspective, the projects demonstrate the
            value of combining heterogeneous sources, including textual, visual,
            spatial, and metadata layers. This multimodal approach allows for
            richer interpretations, revealing patterns that would remain invisible
            within a single data type. At the same time, the act of visualisation
            itself becomes a form of reduction, where complex realities are
            translated into legible forms that necessarily simplify certain
            aspects while foregrounding others.
        </p>
        <p>
            Finally, the method raises important ethical considerations,
            particularly in relation to privacy and visibility. Although the data
            used is publicly available, its reuse within research and design
            contexts introduces new forms of exposure. Anonymisation alone is not
            always sufficient to guarantee privacy, especially when dealing with
            images or contextual information that may reveal identities or
            sensitive conditions (Douriez et al., 2016). This reflects what has
            been described as the visibility “paradox” (D'Ignazio &amp; Klein,
            2020), where making data visible can both empower and expose
            individuals or communities. Designing with such data therefore
            requires careful consideration of what is made visible, to whom, and
            for what purpose.
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
        max-width: 100%;
        object-fit: contain;
    }

    .hero-media :global(.hero-video-tall) {
        width: auto;
        height: min(800px, 90vh);
    }

    .project-info-cell p.tagline {
        text-transform: uppercase;
        letter-spacing: 0.4px;
        font-size: var(--text-small);
    }

    :global(.project-page) .project-info-cell-website {
        grid-column: 13 / -1;
        text-align: right;
    }

    .project-info-cell-website :global(a) {
        color: white;
    }

    /* Page-specific: body spans the full grid (no heading on this page). */
    .project-description p {
        grid-column: 1 / -1;
    }

    figure.bleed {
        grid-column: 1 / -1;
        margin: 20px 0;
    }

    .debate-diagram {
        display: block;
        width: 100%;
        height: auto;
    }

    figcaption {
        margin-top: 6px;
        font-size: var(--text-small);
        color: var(--text-gray);
        line-height: var(--text-muted-leading);
    }
</style>
