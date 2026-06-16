<script lang="ts">
    import { asset, resolve } from "$app/paths";
    import {
        AutoplayVideo,
        Citation,
        CitationList,
        DescriptionBlock,
        ExternalLink,
        IntroductoryParagraph,
        MethodSection,
        OverlayArticle,
    } from "$lib/components";
    import IngredientsRow from "./components/IngredientsRow.svelte";
    import IngredientsSection from "./components/IngredientsSection.svelte";
    import ProtocolRow from "./components/ProtocolRow.svelte";
    import ProtocolSection from "./components/ProtocolSection.svelte";

    const practiceMedia = (folder: string, filename: string) =>
        asset(`/images/pages/participatory-data-practices/${folder}/${filename}`);
</script>

<OverlayArticle
    chapter={4}
    title="Participatory Data Practices"
    pageClass="participatory-data-practices"
>
    <IntroductoryParagraph>
        <p>
            Participatory data practices describe a set of situated activities
            through which participants act as agents in the production,
            interpretation, and negotiation of data (Jensen et al., 2021). In
            this perspective, stakeholders actively shape both data processes
            and meanings, aligning with the notion of data publics, where data
            operates as a medium for dialogue and collective sense-making
            (DiSalvo, 2009). These practices frame data as something made and
            situated, shaped by the conditions of its generation rather than
            understood as a pre-existing resource. They engage participants
            across the data lifecycle, from defining what counts as data and how
            it is collected, to organising, visualising, and collectively
            interpreting it (Ricci et al., 2017). Through these activities, data
            acquires meaning in relation to places, bodies, and social
            interactions, supporting shared understanding and opening space for
            collective imagination (Mills, 2000; Pangrazio &amp; Selwyn, 2023).
            The following section presents the data practices designed within
            the <a href={resolve("/about")}>Blue City project</a> to engage
            different publics in collecting and making sense of the flow of
            <a href={resolve("/waste-flow")}>waste flow</a>.
        </p>
    </IntroductoryParagraph>

    <CitationList>
        <Citation>
            DiSalvo, C. (2009). Design and the Construction of Publics. Design
            Issues, 25(1), 48–63.
            <ExternalLink href="https://doi.org/10.1162/desi.2009.25.1.48">
                https://doi.org/10.1162/desi.2009.25.1.48
            </ExternalLink>
        </Citation>

        <Citation>
            Jensen, T. E., Birkbak, A., Madsen, A. K., &amp; Munk, A. K. (2021).
            Participatory Data Design: Acting in a Digital World. In G. L.
            Downey &amp; T. Zuiderent-Jerak (Eds.), Making &amp; Doing (pp.
            117–136). The MIT Press.
            <ExternalLink
                href="https://doi.org/10.7551/mitpress/11310.003.0008"
            >
                https://doi.org/10.7551/mitpress/11310.003.0008
            </ExternalLink>
        </Citation>

        <Citation>
            Mills, C. W. (with Gitlin, T.). (2000). The Sociological Imagination
            (40th ed). Oxford University Press USA - OSO.
        </Citation>

        <Citation>
            Pangrazio, L., &amp; Selwyn, N. (2023). Critical Data Literacies:
            Rethinking Data and Everyday Life. The MIT Press.
            <ExternalLink
                href="https://doi.org/10.7551/mitpress/14155.001.0001"
            >
                https://doi.org/10.7551/mitpress/14155.001.0001
            </ExternalLink>
        </Citation>

        <Citation>
            Ricci, D., Colombo, G., Meunier, A., &amp; Brilli, A. (2017).
            Designing Digital Methods to monitor and inform Urban Policy. The
            case of Paris and its Urban Nature initiative. 3rd International
            Conference on Public Policy (ICPP3).
        </Citation>
    </CitationList>

    <MethodSection title="4.1 Data Plotting" id="data-plotting">
        <DescriptionBlock heading="Definition" lead>
            Within this research, data plotting is conceived as a participatory
            activity in which data collected by workshop participants are
            visualised and collectively discussed in a dedicated session. Rather
            than treating data as fixed representations, visualisations are
            approached as evolving artefacts that acquire meaning through
            interpretation, dialogue, and their relation to lived experience.
            Different visualisation approaches are employed to foreground
            multiple dimensions of the dataset, combining images, sensor
            readings, and visual models in ways that surface diverse
            perspectives and support interpretation. The activity centres on
            collective reflection and contextualisation, as participants recall
            the circumstances of data collection, relate outcomes to their
            spatial and temporal conditions, and engage in shared
            interpretation. Through discussion supported by facilitators,
            participants connect individual experiences to broader urban
            patterns, negotiate meanings, and imagine alternative ways in which
            urban spaces might be understood and transformed.
        </DescriptionBlock>
        <div class="practice-media practice-media-left">
            <AutoplayVideo
                src={practiceMedia("data_plotting", "data-plotting1.mp4")}
                ariaLabel="Data plotting workshop media 1"
            />
        </div>
        <div class="practice-media practice-media-right">
            <AutoplayVideo
                src={practiceMedia("data_plotting", "data-plotting2.mp4")}
                ariaLabel="Data plotting workshop media 2"
            />
        </div>
        <IngredientsSection>
            {#snippet description()}
                The following ingredients define the components that support the
                data-plotting activity, including the data, tools, and social
                conditions through which visualisation becomes a collective
                process of interpretation and meaning-making.
            {/snippet}

            <IngredientsRow title="Placeholder Title">
                <p>
                    A dataset comprising images and associated metadata—such as
                    GPS coordinates, timestamps, and sensor readings—collected
                    either through online platforms or via dedicated devices,
                    including camera-equipped DIY prototypes or mobile phones.
                </p>
                {#snippet links()}
                    <ExternalLink
                        href="https://drive.google.com/drive/folders/1LMz_JEFtfP7UD12tZUYTDyT85BTT2e-c"
                    >
                        See our dataset
                    </ExternalLink>
                    <ExternalLink
                        href="https://www.notion.so/master-interaction-design/20f89104ecf9801492f8e0a317a4be81?v=20f89104ecf980afb978000c2f1c3830&amp;source=copy_link"
                    >
                        See our prototypes
                    </ExternalLink>
                {/snippet}
            </IngredientsRow>
            <IngredientsRow title="Plotting Scripts">
                <p>
                    One or more scripts for plotting data based on selected
                    metadata parameters, enabling the generation of multiple
                    visual models that combine different data layers.
                </p>
                {#snippet links()}
                    <ExternalLink
                        href="https://www.notion.so/master-interaction-design/20f89104ecf9801492f8e0a317a4be81?v=20f89104ecf980afb978000c2f1c3830&amp;source=copy_link"
                    >
                        See our scripts
                    </ExternalLink>
                {/snippet}
            </IngredientsRow>
            <IngredientsRow title="Display Setup">
                <p>
                    A display setup that supports collective viewing and
                    discussion of the visualisations.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Facilitated Session">
                <p>
                    A facilitated session involving the participants who
                    contributed to the data collection, enabling collective
                    interpretation and contextualisation.
                </p>
            </IngredientsRow>
        </IngredientsSection>
        <ProtocolSection
            title="From Data Collection to Collective Interpretation"
        >
            {#snippet description()}
                The following protocol was developed during the <a
                    href={resolve("/pixel-urbani")}>Pixel Urbani workshop</a
                > and is provided as a replicable framework for conducting similar
                data-plotting activities.
            {/snippet}

            <ProtocolRow title="Assembling the dataset">
                <p>
                    The first step consists of building a dataset that frames a
                    specific urban inquiry. Images and metadata captured through
                    DIY sensing prototypes during the <a href="#data-walking"
                        >Data Walking activity</a
                    > are downloaded and organised. Metadata is exported in .json
                    format, including GPS coordinates, timestamps, and sensor readings.
                    This process establishes the initial structure through which urban
                    conditions can be explored and compared.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Plotting the data">
                <p>
                    This step positions each trace in relation to specific urban
                    sites and to other data points, transforming raw material
                    into readable visual artefacts. The dataset is plotted
                    through digital interfaces that combine multiple layers,
                    including:
                </p>
                <ul>
                    <li>
                        photographic documentation of waste overflow in urban
                        ecopoints, bins, and cigarette butts
                    </li>
                    <li>
                        sensor measurements, such as temperature variation and
                        spatial positioning
                    </li>
                    <li>
                        algorithmic renderings of spatial constraints and
                        accessibility conditions, using edge detection and
                        visual overlays
                    </li>
                </ul>
                <p>
                    These combined representations foreground different
                    dimensions of the dataset, enabling comparison and
                    interpretation across multiple perspectives.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Collective interpretation">
                <p>
                    Supported by facilitators, participants revisit the plotted
                    data in a dedicated session. They are invited to:
                </p>
                <ul>
                    <li>recall the circumstances of data collection</li>
                    <li>interpret variations in sensor readings</li>
                    <li>
                        connect recorded traces to spatial and behavioural
                        conditions
                    </li>
                    <li>
                        relate individual observations to broader urban dynamics
                    </li>
                </ul>
                <p>
                    Through this collective process, observations that might
                    remain implicit at the individual level become explicit and
                    discussable. Data plotting is thus extended into a shared
                    analytical practice, where visualisation supports dialogue,
                    contextualisation, and the co-construction of meaning.
                </p>
            </ProtocolRow>
        </ProtocolSection>
    </MethodSection>
    <MethodSection title="4.2 Data Walking" id="data-walking">
        <DescriptionBlock heading="Definition" lead>
            Data walking is a participatory practice in which workshop
            participants collect data through exploratory walks across urban
            sites (Prost et al., 2023). Whether through manual annotation or
            with the support of DIY sensing toolkits, such as low-cost sensors,
            cameras, or thermal mapping devices, participants are engaged as
            active observers, transforming data collection into a situated and
            relational process. During the walk, participants record phenomena
            such as informal accumulation sites, temperature variations, and
            waste overflow patterns, capturing fine-grained details that
            conventional monitoring systems rarely access. The act of moving
            through the environment enables participants to encounter urban
            conditions in context, linking data to spatial, temporal, and
            embodied experience. This situated engagement supports the
            generation of additional forms of knowledge, including annotations,
            impressions, and sensory observations, which extend beyond measured
            data. These traces can later be shared and discussed, grounding
            collective interpretation in lived experience and supporting a
            deeper understanding of urban waste flows.
        </DescriptionBlock>
        <div class="practice-media practice-media-left">
            <AutoplayVideo
                src={practiceMedia("data_walking", "data-walking1.mp4")}
                ariaLabel="Data walking workshop media 1"
            />
        </div>
        <div class="practice-media practice-media-right">
            <img
                src={practiceMedia("data_walking", "data-walking2.webp")}
                alt="Data walking workshop media 2"
            />
        </div>
        <IngredientsSection>
            {#snippet description()}
                The following ingredients define the materials, tools, and
                facilitation conditions that enable the data-walking activity,
                highlighting how each component contributes to the situated
                collection of <a href={resolve("/urban-small-data")}
                    >small data</a
                >.
            {/snippet}

            <IngredientsRow title="Data Collection Device">
                <p>
                    A data collection device, such as a mobile phone or a
                    dedicated prototype, capable of capturing images and
                    recording associated metadata (e.g. GPS coordinates,
                    timestamps, sensor readings), and storing them for later
                    use.
                </p>
                {#snippet links()}
                    <ExternalLink
                        href="https://www.notion.so/master-interaction-design/20f89104ecf9801492f8e0a317a4be81?v=20f89104ecf980afb978000c2f1c3830"
                        >See our DIY Prototypes</ExternalLink
                    >
                {/snippet}
            </IngredientsRow>
            <IngredientsRow title="Participants">
                <p>
                    Participants equipped with these devices, actively engaged
                    in the collection of data through situated observation.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Route of Exploration">
                <p>
                    A defined route or area of exploration, guiding the data
                    walking activity across specific urban sites.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Facilitation Support">
                <p>
                    Facilitation support to introduce the purpose of the
                    activity and ensure participants understand how to use the
                    devices and what to observe during the walk.
                </p>
            </IngredientsRow>
        </IngredientsSection>
        <ProtocolSection title="From Exploratory Walks to Organised Data">
            {#snippet description()}
                The following protocol was developed during the <a
                    href={resolve("/pixel-urbani")}>Pixel Urbani workshop</a
                > and is provided as a replicable framework for conducting similar
                data-walking activities.
            {/snippet}

            <ProtocolRow title="Defining the route and scope">
                <p>
                    The activity begins with the definition of a route based on
                    the purpose of the inquiry and the type of data to be
                    collected. Specific urban areas are selected to frame the
                    exploration, ensuring that the walk enables the observation
                    of relevant conditions and phenomena.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Introducing tools and objectives">
                <p>
                    Participants are introduced to the devices and to the
                    objectives of the activity. This includes an explanation of
                    how the tools function, what types of data are to be
                    collected, and how observation is framed within the context
                    of the inquiry.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Assigning roles and data focus">
                <p>
                    Participants are organised into individuals or small groups
                    and assigned specific tools and/or data-collection tasks.
                    This may involve focusing on particular phenomena (e.g.
                    waste overflow, accessibility, temperature variation) or
                    using different devices to capture complementary data.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Situated data collection during the walk">
                <p>
                    The activity relies on DIY sensing toolkits assembled using
                    low-cost cameras and environmental sensors, which function
                    as mediating artefacts for capturing visual and
                    environmental traces.
                </p>
                <p>During the walk, participants:</p>
                <ul>
                    <li>
                        document ecopoints, bins, and informal waste
                        accumulation sites
                    </li>
                    <li>
                        capture sensor-based images and environmental readings
                    </li>
                    <li>
                        record temperature variations, spatial constraints, and
                        accessibility conditions
                    </li>
                    <li>
                        observe and discuss waste-related practices directly in
                        context
                    </li>
                </ul>
                <p>
                    Data collection is exploratory and situated. Participants
                    engage with urban infrastructures from their own
                    perspective, generating traces grounded in lived experience.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Aggregating and organising the data">
                <p>
                    At the end of the walk, participants return to a shared
                    meeting point where the collected data is downloaded and
                    consolidated onto a computer. This step transforms dispersed
                    traces into an organised dataset, preparing the material for
                    subsequent visualisation and collective interpretation.
                </p>
            </ProtocolRow>
        </ProtocolSection>
    </MethodSection>
    <MethodSection title="4.3 Data Prototyping" id="data-prototyping">
        <DescriptionBlock heading="Definition" lead>
            Data prototyping refers to the design and development of tools and
            procedures that define how data is generated, structured, and made
            perceptible within a specific inquiry. It involves determining the
            nature of the data to be collected (whether quantitative or
            qualitative, continuous or categorical), while identifying gaps and
            absences in existing institutional datasets. This process also
            includes deciding how new traces will be organised and how they will
            be rendered, for instance through real-time visualisations,
            interfaces, or reports. A data prototype remains open-ended and
            adaptable, taking different forms depending on context and research
            objectives. Its role is both methodological and technical, as it
            enables situated data collection, supports collective
            interpretation, and makes visible the assumptions embedded in
            measurement and representation choices. Participants are therefore
            invited to reflect on the implications of their proposed data
            practices, including issues of privacy, potential discrimination,
            and the infrastructural logics that shape how phenomena are
            quantified. In this sense, a data prototype operates both as a tool
            for generating <a href={resolve("/urban-small-data")}>small data</a>
            and as a critical device for examining how data practices are constructed
            and enacted within urban environments. Within the project, DIY sensing
            toolkits combining low-cost sensors and cameras translated environmental
            readings into visual representations, enabling participants to perceive
            waste infrastructures as dynamic and relational rather than static objects.
        </DescriptionBlock>
        <div class="practice-media practice-media-left">
            <img
                src={practiceMedia("data_prototyping", "data-prototyping1.webp")}
                alt="Data prototyping workshop media 1"
            />
        </div>
        <div class="practice-media practice-media-right">
            <AutoplayVideo
                src={practiceMedia("data_prototyping", "data-prototyping2.mp4")}
                ariaLabel="Data prototyping workshop media 2"
            />
        </div>
        <IngredientsSection>
            {#snippet description()}
                The following ingredients define the materials, tools, and
                facilitation conditions that enable the data-prototyping
                activity, highlighting how each component contributes to shaping
                how data is generated and represented.
            {/snippet}

            <IngredientsRow title="DIY Sensing Components">
                <p>
                    DIY sensing components, such as low-cost cameras,
                    environmental sensors, microcontrollers, and basic
                    electronic materials, used to assemble data collection
                    prototypes.
                </p>
                {#snippet links()}
                    <ExternalLink
                        href="https://master-interaction-design.notion.site/22589104ecf980d99d2acf7e21e14ddc?v=22589104ecf9805fb68b000ce4bdecfa"
                    >
                        See our DIY Urban Scraping Kit
                    </ExternalLink>
                {/snippet}
            </IngredientsRow>
            <IngredientsRow title="Assembly Tools & Software">
                <p>
                    Assembly tools and technical setup resources (e.g. wiring
                    materials, power supply, mounting elements), together with
                    software resources, including code snippets for editing the
                    images shared with participants and a project template
                    containing boilerplate code, that enable participants to
                    build and configure the devices.
                </p>
                {#snippet links()}
                    <ExternalLink
                        href="https://master-interaction-design.notion.site/3b7b991267dc444194b7e830091014d5?v=22889104ecf98025acaa000c199d8334"
                    >
                        See our Code Snippets
                    </ExternalLink>
                {/snippet}
            </IngredientsRow>
            <IngredientsRow title="Defined Inquiry">
                <p>
                    A defined inquiry that frames the prototyping activity,
                    guiding the identification of relevant phenomena and the
                    types of data to be generated (e.g. waste overflow,
                    temperature variation, accessibility conditions).
                </p>
            </IngredientsRow>
            <IngredientsRow title="Structured Activity">
                <p>
                    A structured activity, supported by appropriate materials,
                    that engages participants in the design and construction of
                    prototypes, enabling them to shape how data is captured and
                    produced.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Facilitation Support">
                <p>
                    Facilitation support that introduces the purpose of the
                    activity, guides the assembly process, and supports critical
                    reflection on data choices, including how data is
                    structured, represented, and interpreted.
                </p>
            </IngredientsRow>
        </IngredientsSection>
        <ProtocolSection title="DIY Data Prototyping for Urban Inquiry">
            {#snippet description()}
                The following protocol was developed during the DIY Urban
                Scraping workshop, involving students with different
                backgrounds, and is provided as a replicable framework for
                conducting participatory data-prototyping activities.
            {/snippet}

            <ProtocolRow title="Framing the inquiry and identifying data gaps">
                <p>
                    The activity begins by defining the focus of the inquiry and
                    identifying gaps in existing institutional datasets. These
                    gaps were initially identified by the organisers through
                    discussions with the Municipality of Lugano, particularly
                    with stakeholders responsible for waste management. Building
                    on these insights, together with findings from the
                    literature, participants are invited to reflect on what
                    remains unobserved, unrecorded, or insufficiently
                    represented, and to identify possible areas of intervention.
                    This process establishes the conceptual grounding for the
                    phenomena to be explored and the types of data to be
                    generated.
                </p>
            </ProtocolRow>
            <ProtocolRow
                title="Introducing tools and prototyping possibilities"
            >
                <p>
                    Participants are introduced to the available components,
                    such as low-cost sensors, cameras, and microcontrollers, as
                    well as examples of possible configurations. The emphasis is
                    placed on understanding how different devices capture
                    specific aspects of the environment and how these can be
                    translated into data. Image-editing snippets are also
                    provided to explore how distortion can be used to make data
                    visible, treating visual alteration not as an error, but as
                    an intentional design choice when working with data.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Designing the data prototype">
                <p>
                    Working in groups, participants define what data to capture
                    and how to capture it. This includes selecting sensors,
                    determining data types (e.g. images, temperature readings,
                    spatial information), and considering how the data will be
                    structured and later visualised. At this stage, participants
                    actively shape what counts as data within the inquiry.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Assembling and testing the prototype">
                <p>
                    Participants assemble their DIY sensing toolkits using the
                    selected components. Prototypes are tested and adjusted
                    through iterative experimentation, exploring how
                    environmental inputs are captured and transformed into data.
                    This process foregrounds the relationship between material
                    setup, data generation, and interpretation.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Reflecting on data choices and implications">
                <p>
                    Participants are invited to reflect on the data they have
                    chosen to capture and the assumptions embedded in their
                    prototypes. This includes discussing issues such as data
                    relevance, limitations, privacy, and potential biases.
                </p>
                <p>
                    Prototyping is thus extended beyond technical construction
                    into a critical examination of data practices, encompassing
                    both how data is generated and how these practices are made
                    accessible and transferable to others.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Preparing for deployment">
                <p>
                    The assembled prototypes are prepared for use in subsequent
                    activities (e.g. <a href="#data-walking">Data Walking</a>
                    during the
                    <a href={resolve("/pixel-urbani")}>Urban Pixel initiative</a
                    >), where they will be deployed to collect situated data.
                    This step connects prototyping to data collection, ensuring
                    continuity across the methodological process.
                </p>
            </ProtocolRow>
        </ProtocolSection>
    </MethodSection>
    <MethodSection title="4.4 Data Scraping" id="data-scraping">
        <DescriptionBlock heading="Definition" lead>
            <p>
                Data scraping refers to the practice of collecting data from
                digital platforms and online infrastructures in order to access
                and repurpose existing traces of activity. Within this research,
                it is understood as a situated process through which
                participants engage with digitally mediated environments to
                identify, select, and reinterpret relevant data, extending
                beyond its role as an automated extraction technique. This
                understanding is informed by digital methods, which approach
                online data as natively embedded in platforms and advocate
                “following the medium” to analyse how data is generated,
                structured, and circulated (Rogers, 2013).
            </p>
            <p>
                In this perspective, scraped data is approached as produced and
                situated, foregrounding the conditions under which it becomes
                available. Platforms such as mapping services or review systems
                generate traces, such as images, ratings, or textual
                descriptions, that reflect specific user practices, platform
                logics, and regimes of visibility (Marres, 2017).
            </p>
            <p>
                Within a phygital methodological framework, data scraping is
                combined with situated practices to connect online traces with
                embodied and spatial experience. It thus becomes a way to
                explore how digital infrastructures shape what can be known
                about urban flows. By selecting and recontextualising these
                traces, participants contribute to constructing alternative
                datasets that can be combined with other sources, supporting a
                situated and critical understanding of the topic (Jensen et al.,
                2021).
            </p>
        </DescriptionBlock>
        <div class="practice-media practice-media-left">
            <img
                src={practiceMedia("data_scraping", "data-scraping.webp")}
                alt="Data scraping workshop media 1"
            />
        </div>
        <div class="practice-media practice-media-right">
            <AutoplayVideo
                src={practiceMedia("data_scraping", "data-scraping2.mp4")}
                ariaLabel="Data scraping workshop media 2"
            />
        </div>
        <IngredientsSection>
            {#snippet description()}
                The following ingredients describe the materials, tools, and
                conditions required to enact the data-scraping activity,
                outlining how each element supports access to citizen-generated
                data within and about the urban context across different online
                platforms.
            {/snippet}

            <IngredientsRow title="Laptop">
                <p>
                    A laptop for accessing platforms, configuring scraping
                    workflows, and storing datasets.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Research Questions & Prompts">
                <p>
                    A set of research questions and analytical prompts that
                    guide the scraping activity, defining relevant themes,
                    topics, and areas of investigation.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Online Platforms">
                <p>
                    A selection of online platforms used as data sources to
                    address the research questions; these may include for
                    instance social media platforms, review and mapping
                    services, discussion forums, collaborative mapping
                    infrastructures, and news media platforms.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Digital Objects">
                <p>
                    A definition of relevant digital objects used as entry
                    points for data collection, such as hashtags, reviews,
                    comments, geolocated posts, user profiles, URLs, ratings,
                    and discussion threads.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Scraping Infrastructures & Tools">
                <p>
                    A combination of scraping infrastructures and collection
                    tools, including:
                </p>
                <ul>
                    <li>
                        no-code platforms such as Apify (<ExternalLink
                            href="https://apify.com/">apify.com</ExternalLink
                        >)
                    </li>
                    <li>APIs and geospatial queries;</li>
                    <li>
                        custom Python scripts for data extraction, cleaning, and
                        restructuring;
                    </li>
                    <li>browser-based extraction tools.</li>
                </ul>
            </IngredientsRow>
            <IngredientsRow title="Storage Protocol">
                <p>
                    A protocol for organising and storing heterogeneous datasets
                    across formats such as CSV, JSON, GeoJSON, and spreadsheets.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Visual & Analytical Workspace">
                <p>
                    A visual and analytical workspace, including environments
                    such as QGIS and Figma, for mapping, clustering, comparing,
                    and interpreting the collected data.
                </p>
            </IngredientsRow>
        </IngredientsSection>
        <ProtocolSection title="Filling the Data Gaps">
            {#snippet description()}
                The following protocol was developed during the research to
                define a series of data collection methods based on scraping
                practices, which informed the design of the educational
                experience
                <a href={resolve("/interfaces-for-public-debate")}
                    >Interfaces for Public Debate</a
                >.
            {/snippet}

            <ProtocolRow
                title="Identifying data gaps within institutional datasets"
            >
                <p>
                    The process begins with the analysis of existing municipal
                    datasets in order to identify missing or underrepresented
                    dimensions of the urban waste system. These gaps concern
                    infrastructural aspects, such as accessibility and mobility,
                    but also experiential and cultural dimensions related to how
                    waste infrastructures are perceived, discussed, and
                    communicated across urban and digital environments. This
                    phase defines which forms of data are needed to complement
                    institutional knowledge.
                </p>
            </ProtocolRow>
            <ProtocolRow
                title="Selecting relevant platforms and digital objects"
            >
                <p>
                    Based on the identified gaps, online platforms are selected
                    according to the type of data they make accessible,
                    including spatial information, citizen experiences, public
                    discussions, media narratives, and visual communication
                    practices.
                </p>
                <ul>
                    <li>
                        OpenStreetMap is used to access mobility and geospatial
                        infrastructures;
                    </li>
                    <li>
                        Google Maps to collect reviews and perceptions related
                        to waste infrastructures;
                    </li>
                    <li>
                        Instagram to analyse visual narratives surrounding
                        recycling and sustainability;
                    </li>
                    <li>Reddit to observe peer-to-peer discussions;</li>
                    <li>
                        Google News and Twitter (X) to access institutional
                        communication and media coverage related to waste
                        management.
                    </li>
                </ul>
                <p>
                    Relevant digital objects are then defined as entry points
                    for scraping activities, including hashtags, reviews,
                    comments, geolocated posts, URLs, keywords, and discussion
                    threads.
                </p>
            </ProtocolRow>
            <ProtocolRow
                title="Configuring scraping infrastructures and queries"
            >
                <p>
                    Data collection workflows are configured according to the
                    selected platforms and digital objects. Depending on the
                    inquiry, this includes keyword-based searches,
                    location-based queries, profile selection, and the retrieval
                    of platform-specific content. The scraping activity combines
                    no-code infrastructures and custom scripting workflows.
                    Apify actors are used to collect data from Google Maps,
                    Google News, Instagram, Reddit, and Twitter (X), while
                    Python scripts support data cleaning, restructuring, and the
                    extraction of complementary information such as full article
                    texts and spatial datasets. OpenStreetMap data is retrieved
                    through APIs and geospatial queries.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Structuring and connecting datasets">
                <p>
                    The collected datasets are cleaned and organised into
                    consistent formats, combining textual content, images,
                    metadata, ratings, spatial information, and discussion
                    threads. Datasets from different platforms are then
                    connected and compared in order to identify recurring
                    themes, overlaps, and divergences between infrastructural
                    data, citizen experiences, visual narratives, and
                    institutional communication. Spatial datasets are integrated
                    into QGIS environments, while thematic relations across
                    sources are organised through visual workspaces such as
                    Figma.
                </p>
            </ProtocolRow>
            <ProtocolRow
                title="Interpreting and contextualising digital traces"
            >
                <p>
                    The collected traces are analysed qualitatively through
                    thematic clustering, annotation, and visual mapping
                    practices. Reviews, comments, images, articles, and
                    discussion threads are examined to identify recurring
                    perceptions, frictions, needs, and opportunities related to
                    waste infrastructures and recycling practices. Insights
                    emerging across platforms are synthesised into thematic
                    areas connected to possible intervention spaces, including
                    accessibility, communication, sustainability practices,
                    public services, and citizen experiences.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Developing the data architecture">
                <p>
                    A data architecture is progressively developed and updated
                    throughout the research process in order to document
                    datasets, workflows, and transformations across the project.
                    Each data source is tracked according to the type of
                    information collected, the collection method adopted (e.g.
                    manual collection, scraping, API retrieval), retrieval
                    dates, update frequency, data type, spatial scale,
                    processing operations, storage formats, and forms of
                    analysis performed.
                </p>
                <p>
                    This architecture supports transparency, traceability, and
                    comparability across heterogeneous datasets while
                    documenting the evolution of the research process.
                </p>
            </ProtocolRow>
        </ProtocolSection>
    </MethodSection>
    <MethodSection title="4.5 Data Mapping" id="data-mapping">
        <DescriptionBlock heading="Definition" lead>
            <p>
                Data mapping generally refers to the practice of organising and
                representing data in relation to a spatial framework, enabling
                the identification of patterns, relationships, and distributions
                across locations (Kitchin, 2025). This process involves
                translating different forms of information, both quantitative
                and qualitative, into visual or physical variables that can be
                positioned on a map, making data comparable and interpretable in
                relation to place.
            </p>
            <p>
                Within this project, data mapping is approached as a
                participatory and situated practice through which individual
                experiences, behaviours, and observations are encoded and
                spatially arranged to support collective interpretation. The
                traces considered for the mapping activities are those generated
                during the Pixel Urbani workshop. In this context, participants
                were invited to reconstruct their waste-disposal routines using
                Google Maps by tracing their routes across the city. These
                routes were then printed and annotated with materials such as
                coloured stickers, strings, pins, and handwritten notes, through
                which participants embedded contextual information, including
                household size, frequency and timing of disposal, means of
                transport, and related daily activities.
            </p>
            <p>
                Through this process, experiential and contextual data are
                translated into visual and material elements positioned in
                relation to specific urban sites. This enables participants to
                connect personal observations to broader urban patterns,
                revealing how waste flows are distributed and experienced across
                the city. Mapping thus operates not only as a representational
                tool, but as a space for dialogue and reflection, where
                individual perspectives are brought into relation and
                transformed into shared understandings and possibilities for
                reimagining urban environments.
            </p>
        </DescriptionBlock>
        <div class="practice-media practice-media-left">
            <AutoplayVideo
                src={practiceMedia("data_mapping", "data-mapping1.mp4")}
                ariaLabel="Data mapping workshop media 1"
            />
        </div>
        <div class="practice-media practice-media-right">
            <AutoplayVideo
                src={practiceMedia("data_mapping", "data-mapping2.mp4")}
                ariaLabel="Data mapping workshop media 2"
            />
        </div>
        <IngredientsSection>
            {#snippet description()}
                The following ingredients describe the materials, tools, and
                conditions required to enact the data-mapping activity,
                outlining how each element supports the spatial encoding and
                collective interpretation of situated data.
            {/snippet}

            <IngredientsRow title="Digital Device">
                <p>
                    A digital device (e.g. tablet or mobile phone) that enables
                    participants to trace their route from home to the selected
                    disposal ecopoint or ecocentre using mapping platforms
                    (Google Maps).
                </p>
            </IngredientsRow>
            <IngredientsRow title="Printing Setup">
                <p>
                    A printing setup (thermal or standard printer) to produce
                    physical maps with the traced routes highlighted, providing
                    a base for annotation.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Instructions & Physical Probes">
                <p>
                    A set of predefined instructions and physical probes
                    designed to support the encoding of contextual information.
                    These include, for example:
                </p>
                <ul>
                    <li>
                        stickers of different shapes to indicate variations in
                        quantitative data through differences in size;
                    </li>
                    <li>
                        stickers of different colours to represent categorical
                        data values;
                    </li>
                    <li>
                        strings cut to different lengths to represent
                        quantitative data related to physical distances;
                    </li>
                    <li>
                        post-it notes for qualitative annotations and situated
                        observations;
                    </li>
                </ul>
            </IngredientsRow>
            <IngredientsRow title="Display Structure">
                <p>
                    A display structure, such as a wall or a spatial
                    installation (e.g. wooden bars), used to organise the maps
                    according to different areas of the city and to support
                    their collective exhibition.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Facilitation Support">
                <p>
                    Facilitation support to introduce the activity, guide
                    participants through the mapping process, and assist in the
                    use of materials and instructions, ensuring coherence across
                    individual contributions.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Collective Discussion">
                <p>
                    A dedicated moment of collective discussion following the
                    mapping activity, during which participants present and
                    interpret their maps, using the shared display to identify
                    commonalities, differences, and emerging questions.
                </p>
            </IngredientsRow>
        </IngredientsSection>
        <ProtocolSection
            title="Encoding Waste Practices through Physical Mapping"
        >
            {#snippet description()}
                The following protocol was developed during the Pixel Urbani
                workshop and is provided as a replicable framework for
                conducting participatory data-mapping activities.
            {/snippet}

            <ProtocolRow title="Tracing individual routes">
                <p>
                    Participants begin by reconstructing their waste-disposal
                    routines using a digital mapping platform (e.g. Google
                    Maps). They trace the route from their home to the ecopoint
                    preferably or ecocentre they typically use, generating a
                    spatial representation of their everyday practice.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Producing the base map">
                <p>
                    The traced routes are printed using a thermal or standard
                    printer, producing individual maps with highlighted paths.
                    These printed maps serve as the base for subsequent
                    annotation and encoding.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Encoding contextual information">
                <p>
                    Participants annotate their maps using a set of predefined
                    instructions and physical probes (e.g. stickers, strings,
                    pins, and handwritten notes). Through these materials, they
                    encode contextual information such as:
                </p>
                <ul>
                    <li>
                        number of household members (using stickers with
                        different shapes)
                    </li>
                    <li>
                        distance travelled (represented through cut strings)
                    </li>
                    <li>means of transport (mapped along the x-axis)</li>
                    <li>time of waste disposal (mapped along the y-axis)</li>
                    <li>types of waste disposed (using coloured stickers)</li>
                    <li>
                        additional notes on routines, occasions, and
                        observations (on post-its)
                    </li>
                </ul>
                <p>
                    This step transforms individual experiences into structured
                    visual and material representations.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Assembling and positioning the maps">
                <p>
                    The annotated maps are assembled and positioned within a
                    shared display structure (e.g. wall or spatial
                    installation), where they are organised according to
                    different areas of the city. This creates a collective
                    spatial overview of participants’ practices.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Collective interpretation and discussion">
                <p>
                    Participants gather around the shared display to present and
                    interpret their maps. Supported by facilitators, they:
                </p>
                <ul>
                    <li>compare individual routines</li>
                    <li>identify patterns and differences across locations</li>
                    <li>
                        discuss contextual factors influencing waste practices
                    </li>
                    <li>
                        raise questions and curiosities emerging from the mapped
                        data
                    </li>
                </ul>
                <p>
                    Through this process, individual experiences are brought
                    into relation, enabling the emergence of shared insights.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Reflecting and imagining alternatives">
                <p>
                    The discussion extends towards reflection and speculation,
                    as participants are invited to consider how waste practices
                    and urban infrastructures might be improved or reconfigured.
                    Mapping thus becomes a platform for collective imagination
                    and the exploration of alternative urban scenarios.
                </p>
            </ProtocolRow>
        </ProtocolSection>
    </MethodSection>

    <MethodSection title="4.6 Gesture Tracking" id="gesture-tracking">
        <DescriptionBlock heading="Definition" lead>
            <p>
                Gesture tracking refers to an activity in which bodily movements
                are captured through sensing technologies and translated into
                visual representations, enabling participants to observe and
                reflect on the physical and spatial dimensions of everyday
                practices (Domestic Data Streamer, 2025). Within this research,
                the activity was run during the <a
                    href={resolve("/pixel-urbani")}>Urban Pixel initiative</a
                > and focuses on recording waste-disposal gestures as they unfold
                in situ, transforming routine actions into dynamic traces that can
                be visualised and analysed.
            </p>
            <p>
                The activity relies on technological systems, such as motion
                tracking devices, cameras, or depth sensors, that detect and
                record participants’ movements in real time. These systems
                process and project the captured data as visual outputs, making
                visible the sequence, intensity, and spatial configuration of
                gestures such as approaching, bending, reaching, and disposing.
                In this way, technology operates as a mediating layer that
                translates embodied actions into perceptible data, foregrounding
                aspects of interaction that are otherwise difficult to observe.
            </p>
            <p>
                The activity is conducted individually, with participants
                engaging one at a time in the tracking process. This structure
                allows for focused observation of each gesture sequence and its
                relation to the surrounding environment. Following the
                recording, participants are invited to reflect on the visualised
                traces in relation to their own bodily experience, considering
                aspects such as effort, posture, accessibility, and comfort.
            </p>
            <p>
                By translating movement into data, gesture tracking highlights
                how bodily actions are shaped by spatial configurations and
                material conditions. It thus supports a situated understanding
                of how waste infrastructures are physically encountered, while
                opening space for reflecting on how these interactions might be
                redesigned to better accommodate diverse users and practices.
            </p>
        </DescriptionBlock>
        <div class="practice-media practice-media-left">
            <img
                src={practiceMedia("gesture_tracking", "DSC07481-Edit.webp")}
                alt="Gesture tracking workshop media 1"
            />
        </div>
        <div class="practice-media practice-media-right">
            <AutoplayVideo
                src={practiceMedia("gesture_tracking", "wasted_gestures.mp4")}
                ariaLabel="Gesture tracking workshop media 2"
            />
        </div>
        <IngredientsSection>
            {#snippet description()}
                The following ingredients describe the materials, tools, and
                conditions required to enact the gesture-tracking activity,
                outlining how each element supports the capture and
                visualisation of embodied interaction.
            {/snippet}

            <IngredientsRow title="Motion-Capture Setup">
                <p>
                    A motion-capture setup, such as cameras, depth sensors, or
                    tracking devices, capable of detecting and recording
                    participants’ movements in real time, without capturing
                    identifiable features such as faces.
                </p>
                {#snippet links()}
                    <span>See our Gesture Tracker</span>
                {/snippet}
            </IngredientsRow>
            <IngredientsRow title="Processing & Visualisation System">
                <p>
                    A processing and visualisation system that translates
                    captured gestures into dynamic visual outputs (e.g.
                    projections or screen-based renderings), making movement
                    sequences perceptible.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Interaction Scenario">
                <p>
                    A defined interaction scenario involving a waste-disposal
                    action, providing a consistent context in which gestures can
                    be performed and recorded.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Physical Probes">
                <p>
                    Physical probes that simulate waste materials, such as
                    cardboard, different types of plastics, and weighted objects
                    representing glass and inorganic waste, used to make the
                    disposal gesture more realistic and materially grounded.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Participants">
                <p>
                    Participants engaging individually with the system,
                    performing the gesture sequence while being tracked.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Consent & Information Form">
                <p>
                    A consent and information form informing participants about
                    the purpose of the activity, the type of data collected, and
                    the use of motion tracking only (excluding facial
                    recording), ensuring awareness and protection of privacy.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Spatial Setup">
                <p>
                    A spatial setup that accommodates both the performance of
                    the gesture and the visibility of its visualisation,
                    allowing participants to observe the output of their
                    actions.
                </p>
            </IngredientsRow>
            <IngredientsRow title="Facilitation Support">
                <p>
                    Facilitation support to introduce the activity, guide
                    participants through the interaction with the system, and
                    support reflection on the recorded gestures.
                </p>
            </IngredientsRow>
        </IngredientsSection>
        <ProtocolSection
            title="Capturing and reflecting on waste-disposal gestures"
        >
            {#snippet description()}
                The following protocol was developed during the Urban Pixel
                initiative and is provided as a replicable framework for
                conducting gesture-tracking activities.
            {/snippet}

            <ProtocolRow title="Preparing the setup and interaction scenario">
                <p>
                    The activity begins with the configuration of the
                    motion-capture system (e.g. cameras, depth sensors) and the
                    visualisation interface. A disposal scenario is arranged
                    using physical probes, such as cardboard, plastics, and
                    weighted objects, to simulate different types of waste and
                    ensure a realistic interaction context.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Introducing the activity and obtaining consent">
                <p>
                    Participants are introduced to the purpose of the activity,
                    the functioning of the tracking system, and the type of data
                    being collected. A consent and information form is provided,
                    specifying that only movement data is recorded and no
                    identifiable features (e.g. faces) are captured, ensuring
                    transparency and protection of privacy.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Performing the gesture sequence">
                <p>
                    Participants engage individually with the setup, performing
                    a waste-disposal action using the provided materials. Their
                    movements, such as approaching, bending, reaching, and
                    disposing, are captured in real time by the tracking system.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Visualising and observing the gesture">
                <p>
                    The captured movements are processed and translated into
                    dynamic visual outputs, which are displayed in real time or
                    immediately after the interaction. Participants observe how
                    their gestures are represented, gaining insight into their
                    spatial configuration, sequence, and intensity.
                </p>
            </ProtocolRow>
            <ProtocolRow title="Reflecting on embodied interaction">
                <p>
                    Participants are invited to reflect on the visualised traces
                    in relation to their own bodily experience. This includes
                    considering aspects such as effort, posture, accessibility,
                    and comfort, and how these are shaped by the spatial and
                    material conditions of the disposal setting.
                </p>
                <p><span>See our Gesture Tracker Interface</span></p>
            </ProtocolRow>
            <ProtocolRow
                title="Interpreting implications for urban infrastructure"
            >
                <p>
                    The activity concludes with a facilitated reflection on how
                    the observed gestures relate to the design of waste
                    infrastructures. Participants are encouraged to consider how
                    these interactions might inform improvements, highlighting
                    opportunities to redesign systems in ways that better
                    accommodate diverse bodies and practices.
                </p>
            </ProtocolRow>
        </ProtocolSection>
    </MethodSection>
</OverlayArticle>

<style>
    :global(.participatory-data-practices) {
        --description-block-margin-bottom: 76px;
    }

    .practice-media {
        display: flex;
        aspect-ratio: 16 / 9;
        margin-bottom: 32px;
    }

    .practice-media-left {
        grid-column: 4 / span 6;
        justify-content: flex-end;
    }

    .practice-media-right {
        grid-column: 10 / span 6;
        justify-content: flex-start;
    }

    .practice-media img,
    .practice-media :global(video) {
        display: block;
        width: auto;
        height: 100%;
        object-fit: contain;
    }

    @media (max-width: 800px) {
        .practice-media-left,
        .practice-media-right {
            grid-column: 1 / -1;
        }

        .practice-media img,
        .practice-media :global(video) {
            max-width: 100%;
        }
    }
</style>
