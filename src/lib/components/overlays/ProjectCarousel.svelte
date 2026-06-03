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

    let scroller: HTMLDivElement | undefined = $state();
    let atStart = $state(true);
    let atEnd = $state(false);

    function updateArrows() {
        if (!scroller) return;
        const { scrollLeft, scrollWidth, clientWidth } = scroller;
        atStart = scrollLeft <= 1;
        atEnd = scrollLeft >= scrollWidth - clientWidth - 1;
    }

    function scrollByOne(direction: 1 | -1) {
        scroller?.scrollBy({
            left: direction * scroller.clientWidth,
            behavior: "smooth",
        });
    }
</script>

<svelte:window onresize={updateArrows} />

<div class="carousel">
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
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border: none;
        background-color: black;
        color: white;
        font-family: inherit;
        font-size: var(--text-base);
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
