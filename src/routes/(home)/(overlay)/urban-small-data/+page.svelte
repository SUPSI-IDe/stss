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

    const smallDataVideo = (name: string) =>
        asset(`/images/pages/small data/small-data-${name}.mp4`);
</script>

<OverlayArticle
    chapter={2}
    title="Urban Small Data"
    pageClass="urban-small-data"
>
    <IntroductoryParagraph>
        <p>
            Contemporary urban governance is increasingly shaped by data-driven
            approaches that prioritise prediction and efficiency, yet tend to
            overlook the situated knowledge and lived experience through which
            people experience and navigate the city. In this context, small data
            has been introduced as a way to reconnect data practices with
            everyday urban life, shifting the focus from scale to proximity,
            interpretation, and situated engagement (Autuori et al., 2026).
        </p>
        <p>
            The notion of small data has been taken up across distinct scholarly
            traditions. In personal informatics and healthcare, "small data,
            where n = me" (Estrin, 2014) (Gray, 2025) foregrounds how data
            generated through individual routines supports personalised
            understanding, privileging closeness over statistical
            generalisation. From a critical data studies perspective, small data
            is characterised by limited volume, non-continuity, and orientation
            towards specific practical concerns (Kitchin &amp; Lauriault, 2014).
            In digital methods, it is framed through the selective
            reinterpretation of traces extracted from larger platforms,
            repurposing fragments of existing infrastructures to investigate
            specific issues rather than collecting data at scale (Rogers, 2013).
            Across these traditions, small data is always oriented towards
            something particular, a person, a question, a context, rather than
            towards generalisation.
        </p>
        <p>
            This situated quality makes small data a complementary mode of
            knowing rather than an alternative to big data. In public data
            cultures, it functions as a counterpoint that brings contextual
            depth and interpretive nuance to large-scale datasets (Gray, 2025),
            a role that becomes especially significant in urban contexts where
            data-driven systems tend to reduce complex lived realities into
            predefined categories (Bowker &amp; Star, 2008; Van Dijck, 2014).
            Small data can thus do critical work, foregrounding situated
            perspectives and exposing the blind spots of data-intensive
            infrastructures, particularly for marginalised or
            resource-constrained communities.
        </p>
        <p>
            Attending to what gets left out also means attending to how data is
            experienced and interpreted. Small data connects here to the notion
            of thick data, centring meaning, affect, and context as constitutive
            of data practice (Geertz, 1973; Wang, 2016). It operates through
            hybrid forms that combine quantitative traces with qualitative
            annotations, emotions, and contextual reflections, blurring the
            boundary between measurement and narrative. Within this framing,
            digital technologies such as wearables, apps, and personal devices
            play a central role, not only generating small data but mediating
            how individuals access and make sense of it, acting as interpretive
            infrastructures between people and their own traces (Lupton, 2017,
            2018).
        </p>
        <p>
            This raises the central question driving this research: how might
            small data practices foster collective forms of knowledge-making and
            reconfigure the relationship between data, citizenship, and urban
            governance?
        </p>
        <p>
            Grounding this question in practice, the project mobilises small
            data through participatory engagements, attending to the material,
            social, and sensory dimensions of urban life, including routines,
            gestures, movements, annotations, and personal accounts, ordinarily
            rendered invisible by large-scale datasets. Four interrelated
            methodological practices structure this inquiry: seeing with,
            thinking through, sharing through, and sensing small data.
        </p>
    </IntroductoryParagraph>
    <CitationList>
        <Citation>
            Bowker, G. C., &amp; Star, S. L. (2008). Sorting things out:
            Classification and its consequences (1. paperback ed., 8. print).
            MIT Press.
        </Citation>

        <Citation>
            Estrin, D. (2014). Small data, where n = me. Communications of the
            ACM, 57(4), 32–34.
            <ExternalLink href="https://doi.org/10.1145/2580944">
                https://doi.org/10.1145/2580944
            </ExternalLink>
        </Citation>

        <Citation>
            Geertz, C. (1973). Thick Description: Toward an Interpretive Theory
            of Culture. In The Interpretation of Cultures: Selected Essays (pp.
            3–30). Basic Books.
            <ExternalLink href="https://philpapers.org/archive/geettd.pdf">
                https://philpapers.org/archive/geettd.pdf
            </ExternalLink>
        </Citation>

        <Citation>
            Gray, J. W. Y. (2025). Public data cultures. Polity Press.
        </Citation>

        <Citation>
            Kitchin, R., &amp; Lauriault, T. P. (2014). Small Data, Data
            Infrastructures and Big Data. SSRN Electronic Journal.
            <ExternalLink href="https://doi.org/10.2139/ssrn.2376148">
                https://doi.org/10.2139/ssrn.2376148
            </ExternalLink>
        </Citation>

        <Citation>
            Lupton, D. (2017). Feeling your data: Touch and making sense of
            personal digital data. New Media and Society, 19(10), 1599–1614.
            <ExternalLink href="https://doi.org/10.1177/1461444817717515">
                https://doi.org/10.1177/1461444817717515
            </ExternalLink>
        </Citation>

        <Citation>
            Lupton, D. (2018). How do data come to matter? Living and becoming
            with personal data. Big Data and Society, 5(2).
            <ExternalLink href="https://doi.org/10.1177/2053951718786314">
                https://doi.org/10.1177/2053951718786314
            </ExternalLink>
        </Citation>

        <Citation>
            Rogers, R. (2013). Digital Methods. The MIT Press.
            <ExternalLink href="https://doi.org/10.7551/mitpress/8718.001.0001">
                https://doi.org/10.7551/mitpress/8718.001.0001
            </ExternalLink>
        </Citation>

        <Citation>
            Van Dijck, J. (2014). Datafication, dataism and dataveillance: Big
            Data between scientific paradigm and ideology. Surveillance &amp;
            Society, 12(2), 197–208.
            <ExternalLink href="https://doi.org/10.24908/ss.v12i2.4776">
                https://doi.org/10.24908/ss.v12i2.4776
            </ExternalLink>
        </Citation>

        <Citation>
            Wang, T. (2016, December 5). Why Big Data Needs Thick Data.
            Ethnography Matters.
            <ExternalLink
                href="https://medium.com/ethnography-matters/why-big-data-needs-thick-data-b4b3e75e3d7"
            >
                https://medium.com/ethnography-matters/why-big-data-needs-thick-data-b4b3e75e3d7
            </ExternalLink>
        </Citation>
    </CitationList>

    <MethodSection title="2.1 Seeing" id="seeing">
        <DescriptionBlock heading="Definition" lead>
            Seeing with <a href={resolve("/urban-small-data")}>small data</a> refers to the practice of situated observation
            and data collection, in which citizens engage with the urban flow as active
            participants rather than passive observers. The act of seeing conceptualises
            data collection as an epistemic and participatory method that entails
            attentiveness, relationality, and reflexivity. Through recording and capturing
            small data, participants are enabled to recognise patterns, rhythms, and
            dynamics typically invisible from institutional forms of monitoring.
        </DescriptionBlock>
        <div class="small-data-media">
            <AutoplayVideo
                src={smallDataVideo("seeing")}
                ariaLabel="Seeing with small data"
            />
        </div>
        <DescriptionBlock heading="Application">
            During the <a href={resolve("/urban-scraping")}>Urban Scraping workshop</a> in Lugano,
            multidisciplinary students prototyped DIY sensing devices using
            low-cost sensors and cameras, converting environmental data into
            real-time visualisations such as thermal mapping and algorithmic
            overlays. Citizens then used these toolkits during collective data
            walks of the <a href={resolve("/pixel-urbani")}>Urban Pixel initiative</a>, documenting eco-points,
            circulation routes, and overflow patterns across neighbourhoods. The
            collected data revealed micro-level dynamics, such as localised
            inefficiencies, temporal fluctuations, and spatial asymmetries, that
            were missing from institutional monitoring systems.
        </DescriptionBlock>
        <DescriptionBlock heading="Role within the framework">
            Seeing thus grounds urban inquiry in lived contexts, offering
            citizens situated access to the city's material realities while
            providing institutional actors with an alternative, fine-grained
            perspective on urban complexity.
        </DescriptionBlock>
    </MethodSection>
    <MethodSection title="2.2 Sharing" id="sharing">
        <DescriptionBlock heading="Definition" lead>
            Sharing through <a href={resolve("/urban-small-data")}>small data</a> refers to the communicative and dialogical
            dimension of participatory inquiry, in which dispersed observations are
            converged into a unique artefact that fosters dialogue, co-creation, and
            mutual learning. The act of sharing extends participation from individual
            interpretation to collective meaning-making, materialising lived experiences
            into visual forms that can be seen, compared, and discussed. Through participatory
            mapping and co-design practices, sharing makes everyday routines visible
            and opens inquiries to collaborative reflection among citizens, researchers,
            and institutions.
        </DescriptionBlock>
        <div class="small-data-media">
            <AutoplayVideo
                src={smallDataVideo("sharing")}
                ariaLabel="Sharing through small data"
            />
        </div>
        <DescriptionBlock heading="Application">
            During the <a href={resolve("/urban-scraping")}>Urban Scraping workshop</a> in Lugano, participants actively
            reconstructed their waste-disposal routines using Google Maps. They then
            materialised these routes through printed maps, enriching them with coloured
            stickers, strings, pins, and handwritten annotations. These additions
            embedded contextual information, such as household size, disposal frequency,
            and modes of transport, transforming individual practices into situated,
            interpretable traces. Individual maps were assembled into a collective
            installation, revealing shared patterns and differences that provided
            a visual ground for identifying challenges and imagining improvements.
        </DescriptionBlock>
        <DescriptionBlock heading="Role within the framework">
            Sharing thus acts as a mediation between individual experience and
            collective understanding, turning small data into a catalyst for
            participatory learning and the co-production of situated urban
            knowledge.
        </DescriptionBlock>
    </MethodSection>
    <MethodSection title="2.3 Thinking" id="thinking">
        <DescriptionBlock heading="Definition" lead>
            Thinking through <a href={resolve("/urban-small-data")}>small data</a> refers to the interpretive dimension
            of participatory inquiry, in which data becomes a medium for collective
            reflection and critical analysis. The act of thinking shifts the focus
            from collection to comprehension, exploring how small data generates common
            insights once revisited, visualised, and discussed with those who contributed
            to their production. In this perspective, data are not fixed representations
            but evolving artefacts that acquire meaning through interpretation, dialogue,
            and their relation to lived experience.
        </DescriptionBlock>
        <div class="small-data-media">
            <AutoplayVideo
                src={smallDataVideo("thinking")}
                ariaLabel="Thinking through small data"
            />
        </div>
        <DescriptionBlock heading="Application">
            During the <a href={resolve("/urban-scraping")}>Urban Scraping workshop</a> in Lugano, data generated through
            collective walks were visualised and discussed in a dedicated activity.
            This process enabled participants to connect each representation with
            its mode of collection, recall the conditions under which the data were
            produced, and situate the results within specific spatial and temporal
            contexts.
        </DescriptionBlock>
        <DescriptionBlock heading="Role within the framework">
            Thinking through <a href={resolve("/urban-small-data")}>small data</a> transforms interpretation into a process
            of dialogue and contextualisation, connecting sensor-based traces to lived
            experiences and enabling communities and public actors to negotiate shared
            understandings of the city.
        </DescriptionBlock>
    </MethodSection>
    <MethodSection title="2.4 Sensing" id="sensing">
        <DescriptionBlock heading="Definition" lead>
            Sensing <a href={resolve("/urban-small-data")}>small data</a> refers to the embodied and experiential dimension
            of participatory inquiry, in which the body becomes a site of perception
            and situated knowledge. The act of sensing extends participation beyond
            the production of shared artefacts to direct physical engagement with
            the urban flow. Through gestures, movements, and sensory interactions,
            sensing reveals physical aspects of everyday life that remain hidden to
            abstract representations of data.
        </DescriptionBlock>
        <div class="small-data-media">
            <AutoplayVideo
                src={smallDataVideo("sensing")}
                ariaLabel="Sensing small data"
            />
        </div>
        <DescriptionBlock heading="Application">
            The <a href={resolve("/participatory-data-practices")}>Gesture Tracker interactive experience</a>, organised during
            the
            <a href={resolve("/pixel-urbani")}>Urban Pixel initiative</a>, captured participants' waste-disposal
            movements as they unfolded in situ, translating them into real-time
            visualisations that foregrounded the bodily, spatial, and temporal
            negotiation of an everyday practice. By rendering gestures as
            dynamic traces, the system made visible how routine actions are
            shaped by factors such as infrastructure, effort, and environmental
            constraints. Following the recording, participants annotated these
            visualisations with reflections on sensation, posture, and context,
            thereby reconnecting the abstracted movement data with their lived,
            embodied conditions and supporting a situated process of
            meaning-making.
        </DescriptionBlock>
        <DescriptionBlock heading="Role within the framework">
            Sensing thus transforms corporeal experience into situated
            knowledge, linking individual bodily engagement with collective
            meaning-making.
        </DescriptionBlock>
    </MethodSection>
</OverlayArticle>

<style>
    .small-data-media {
        grid-column: 7 / span 6;
        margin-bottom: 32px;
        background: var(--placeholder);
    }

    .small-data-media :global(video) {
        display: block;
        width: 100%;
        height: auto;
    }

    @media (max-width: 800px) {
        .small-data-media {
            grid-column: 1 / -1;
        }
    }
</style>
