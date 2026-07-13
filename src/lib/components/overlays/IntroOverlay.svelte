<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let {
        lines,
        replayOnIdle = true,
    }: {
        lines: string[];
        replayOnIdle?: boolean;
    } = $props();

    let visible = $state(true);
    let done = $state(false);
    let displayed = $state<string[]>([]);
    let fontSize = $state(120);
    let measureEl = $state<HTMLDivElement>();
    let animTimer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const IDLE_REPLAY_MS = 30_000;
    // Font-size search bounds (px) and the viewport padding kept clear of text.
    const MIN_FONT = 24;
    const MAX_FONT = 320;
    const VIEWPORT_PAD = 24;
    // Below this width, never break words: the font shrinks to fit the longest word.
    const MOBILE_MAX = 800;

    let noBreak = $state(false);

    function clearAnimTimer() {
        if (!animTimer) return;
        clearInterval(animTimer);
        animTimer = null;
    }

    // Largest font size at which the full text block fits the viewport, both
    // vertically (block height) and horizontally (no line overflow). Wrapping
    // makes height monotonic in font size, so binary-search is exact.
    function fit() {
        if (!measureEl) return;
        const maxH = window.innerHeight - VIEWPORT_PAD;
        const maxW = window.innerWidth - VIEWPORT_PAD;
        // On mobile keep words whole; a long word then overflows scrollWidth
        // and the search below shrinks the font until it fits on one line.
        // Set inline so the measurement below reflects it synchronously.
        noBreak = window.innerWidth <= MOBILE_MAX;
        measureEl.style.overflowWrap = noBreak ? 'normal' : 'break-word';
        let lo = MIN_FONT, hi = MAX_FONT;
        for (let i = 0; i < 12; i++) {
            const mid = (lo + hi) / 2;
            measureEl.style.fontSize = `${mid}px`;
            if (measureEl.scrollHeight <= maxH && measureEl.scrollWidth <= maxW) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        fontSize = Math.floor(lo);
    }

    function animate() {
        clearAnimTimer();
        visible = true;
        done = false;
        displayed = lines.map(() => '');

        let li = 0, ci = 0;
        animTimer = setInterval(() => {
            if (li >= lines.length) {
                clearInterval(animTimer!);
                animTimer = null;
                done = true;
                return;
            }
            displayed[li] = lines[li].slice(0, ci + 1);
            ci++;
            if (ci >= lines[li].length) { li++; ci = 0; }
        }, 70);
    }

    function resetIdle() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = null;
        if (!replayOnIdle) return;
        idleTimer = setTimeout(animate, IDLE_REPLAY_MS);
    }

    function hide() {
        if (!visible) return;
        clearAnimTimer();
        visible = false;
        done = false;
    }

    function onActivity() {
        hide();
        resetIdle();
    }

    onMount(() => {
        fit();
        // Re-fit once webfonts load, since glyph metrics change wrapping.
        document.fonts?.ready.then(fit);
        animate();
        resetIdle();
    });
    onDestroy(() => {
        clearAnimTimer();
        if (idleTimer) clearTimeout(idleTimer);
    });
</script>

<svelte:window
    onpointermove={onActivity}
    onpointerdown={onActivity}
    onwheel={onActivity}
    onresize={fit}
/>

{#if visible}
    <div class="overlay">
        <div class="overlay-text" class:no-break={noBreak} style:font-size="{fontSize}px">
            {#each displayed as line, i (lines[i])}
                <div class="line" aria-label={lines[i]}>{line}</div>
            {/each}
        </div>
    </div>
{/if}

<!-- Hidden mirror of the full text, used only to measure fit. -->
<div class="overlay-text measure" bind:this={measureEl} aria-hidden="true">
    {#each lines as line (line)}
        <div class="line">{line}</div>
    {/each}
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: transparent;
        display: grid;
        place-items: center;
        z-index: 2000;
        pointer-events: none;
    }

    .overlay-text {
        text-align: center;
        text-transform: uppercase;
        font-family: 'OTNeueMontreal-MediumSqueezed', 'Helvetica Neue', sans-serif;
        line-height: 0.82;
        letter-spacing: 0;
        color: var(--text-black);
        user-select: none;
        overflow-wrap: break-word;
    }

    .overlay-text.no-break {
        overflow-wrap: normal;
    }

    .measure {
        position: fixed;
        top: 0;
        left: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .line {
        max-width: calc(100vw - 24px);
        margin-inline: auto;
        font-size: inherit;
        text-wrap: balance;
    }
</style>
