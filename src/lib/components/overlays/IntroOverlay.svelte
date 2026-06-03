<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let { lines }: { lines: string[] } = $props();

    let visible = $state(true);
    let done = $state(false);
    let displayed = $state<string[]>([]);
    let animTimer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function lineScale(line: string) {
        return Math.min(1, 12 / Math.max(line.length, 1));
    }

    function animate() {
        if (animTimer) clearInterval(animTimer);
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
        idleTimer = setTimeout(animate, 60_000);
    }

    function onMove() {
        if (done && visible) visible = false;
        resetIdle();
    }

    onMount(() => {
        animate();
        resetIdle();
    });
    onDestroy(() => {
        if (animTimer) clearInterval(animTimer);
        if (idleTimer) clearTimeout(idleTimer);
    });
</script>

<svelte:window onmousemove={onMove} />

{#if visible}
    <div class="overlay">
        <div class="overlay-text">
            {#each displayed as line, i (lines[i])}
                <div class="line" style:--line-scale={lineScale(lines[i])} aria-label={lines[i]}>{line}</div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: transparent;
        display: grid;
        place-items: center;
        z-index: 2000;
    }

    .overlay-text {
        text-align: center;
        text-transform: uppercase;
        font-family: 'OTNeueMontreal-MediumSqueezed', 'Helvetica Neue', sans-serif;
        line-height: 0.82;
        letter-spacing: 0;
        color: var(--text-black);
        pointer-events: none;
        user-select: none;
    }

    .line {
        max-width: calc(100vw - 16px);
        margin-inline: auto;
        font-size: calc(clamp(120px, 18vw, 253.19px) * var(--line-scale));
        overflow-wrap: break-word;
        text-wrap: balance;
    }

    .overlay-text .line + .line {
        margin-top: 0.12em;
    }

    @media (max-width: 800px) {
        .line {
            font-size: calc(clamp(72px, 18vw, 120px) * var(--line-scale));
        }
    }
</style>
