<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        prevLabel = "Previous",
        nextLabel = "Next",
    }: {
        children: Snippet;
        prevLabel?: string;
        nextLabel?: string;
    } = $props();

    let carousel: HTMLDivElement | undefined = $state();
    let scroller: HTMLDivElement | undefined = $state();
    let atStart = $state(true);
    let atEnd = $state(false);
    let arrowTop = $state("50%");

    function updateArrows() {
        if (!scroller) return;
        const { scrollLeft, scrollWidth, clientWidth } = scroller;
        atStart = scrollLeft <= 1;
        atEnd = scrollLeft >= scrollWidth - clientWidth - 1;
        updateArrowTop();
    }

    /** Vertically center the arrows on the slide's media (image/video), not the whole carousel. */
    function updateArrowTop() {
        if (!scroller || !carousel) return;
        const media = scroller.querySelector(".media");
        if (!media) return;
        const mediaRect = media.getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        arrowTop = `${mediaRect.top + mediaRect.height / 2 - carouselRect.top}px`;
    }

    /**
     * Give every bottom description panel the height of the tallest one, so the
     * black bars line up across slides. Reset to natural height first, measure
     * the max, then apply it. Recomputed on resize (and after fonts load).
     */
    function equalizeDescriptions() {
        if (!scroller) return;
        const panels = scroller.querySelectorAll<HTMLElement>(".project-description");
        if (!panels.length) return;
        panels.forEach((panel) => (panel.style.height = "auto"));
        let maxHeight = 0;
        panels.forEach((panel) => {
            maxHeight = Math.max(maxHeight, panel.offsetHeight);
        });
        panels.forEach((panel) => (panel.style.height = `${maxHeight}px`));
    }

    function onResize() {
        equalizeDescriptions();
        updateArrows();
    }

    $effect(() => {
        equalizeDescriptions();
        updateArrowTop();
        document.fonts?.ready.then(() => {
            equalizeDescriptions();
            updateArrowTop();
        });
    });

    function scrollByOne(direction: 1 | -1) {
        scroller?.scrollBy({
            left: direction * scroller.clientWidth,
            behavior: "smooth",
        });
    }
</script>

<svelte:window onresize={onResize} />

<div class="carousel" bind:this={carousel} style:--arrow-top={arrowTop}>
    {#if !atStart}
        <button
            type="button"
            class="carousel-arrow carousel-arrow-left"
            aria-label={prevLabel}
            onclick={() => scrollByOne(-1)}>&lt;</button
        >
    {/if}
    <div class="projects-scroller" bind:this={scroller} onscroll={updateArrows}>
        {@render children()}
    </div>
    {#if !atEnd}
        <button
            type="button"
            class="carousel-arrow carousel-arrow-right"
            aria-label={nextLabel}
            onclick={() => scrollByOne(1)}>&gt;</button
        >
    {/if}
</div>

<style>
    .carousel {
        grid-column: 1 / -1;
        position: relative;
    }

    .projects-scroller {
        display: flex;
        height: max-content;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        overscroll-behavior-x: contain;
    }

    .carousel-arrow {
        position: absolute;
        top: var(--arrow-top, 50%);
        transform: translateY(-50%);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        padding: 0;
        border: none;
        background-color: black;
        color: white;
        font-family: inherit;
        font-size: var(--text-small);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
    }

    .carousel-arrow-left {
        left: 8px;
    }

    .carousel-arrow-right {
        right: 8px;
    }
</style>
