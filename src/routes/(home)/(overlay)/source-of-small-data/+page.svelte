<script lang="ts">
    import { resolve } from "$app/paths";
    import { IntroductoryParagraph, OverlayArticle } from "$lib/components";
</script>

<OverlayArticle
    chapter={3}
    title="Sources of Small Data"
    pageClass="source-of-small-data"
>
    <IntroductoryParagraph>
        <p>
            To investigate waste-disposal and recycling practices, the project
            draws on <a href={resolve("/urban-small-data")}>urban small data</a
            >, engaging a range of complementary data sources. This approach is
            meant to expand beyond institutional or large-scale datasets by
            incorporating data emerging from environments, embodied experience,
            and digital infrastructures. Each source generates specific traces
            and viewpoints shaped by the conditions of their production.
            Together, these sources ground the analysis in the everyday dynamics
            of the city and support a situated and contextualised understanding
            of waste as an urban flow.
        </p>
        <p>
            The following section presents the data sources engaged and shows
            how each contributes to understanding the
            <a href={resolve("/waste-flow")}>flow of waste</a>
            within the
            <a href={resolve("/about")}>Blue City project</a>.
        </p>
    </IntroductoryParagraph>

    <div class="sources-list page-subgrid">
        <div class="source-row page-subgrid">
            <span class="source-num">3.1</span>
            <span class="source-tag">#Urban Context</span>
            <p class="source-def">
                Considered as a source of
                <a href={resolve("/urban-small-data")}>small data</a>, the urban
                context refers to the interconnected material, social, and
                infrastructural conditions that shape everyday city life. It
                encompasses spatial configurations, cultural practices, mobility
                patterns, and governance systems, whose entangled dynamics often
                remain imperceptible in large-scale datasets yet become
                accessible through situated forms of participation and
                observation.
            </p>
        </div>

        <div class="source-row page-subgrid">
            <span class="source-num">3.2</span>
            <span class="source-tag">#Personal Experience</span>
            <p class="source-def">
                Considered as a source of
                <a href={resolve("/urban-small-data")}>small data</a>, personal
                experience refers to the lived, embodied, and sensory engagement
                through which individuals encounter and interpret their everyday
                environments. It encompasses tacit knowledge, routines,
                gestures, and reflections, through which understanding is
                grounded in proximity to one’s own context rather than in
                abstract data.
            </p>
        </div>

        <div class="source-row page-subgrid">
            <span class="source-num">3.3</span>
            <span class="source-tag">#Online Platform</span>
            <p class="source-def">
                Considered as a source of
                <a href={resolve("/urban-small-data")}>small data</a>, digital
                infrastructures refer to intermediary systems that facilitate
                informational, navigational, transactional, and social exchange.
                This category includes platforms such as social networks, where
                interaction and communication are central. Across these
                environments, users generate situated traces through profiles,
                reviews, posts, and other contributions, embedding personal
                experience within collectively produced knowledge systems and
                shaping how waste flows are understood and shared.
            </p>
        </div>
    </div>
</OverlayArticle>

<style>
    .source-row {
        padding: 0 8px;
        margin-bottom: 18px;
    }

    .sources-list {
        margin-bottom: auto;
    }

    .source-num {
        grid-column: 1 / 2;
    }

    .source-tag {
        grid-column: 2 / 4;
    }

    .source-def {
        grid-column: 4 / -1;
        font-size: var(--text-lead);
        color: var(--text-muted);
        line-height: var(--text-muted-leading);
    }
</style>
