<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let { lines }: { lines: string[] } = $props();

    let visible = $state(true);
    let done = $state(false);
    let displayed = $state<string[]>([]);
    let animTimer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const IDLE_REPLAY_MS = 30_000;

    function clearAnimTimer() {
        if (!animTimer) return;
        clearInterval(animTimer);
        animTimer = null;
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
        animate();
        resetIdle();
    });
    onDestroy(() => {
        clearAnimTimer();
        if (idleTimer) clearTimeout(idleTimer);
    });
</script>

<svelte:window onpointermove={onActivity} onwheel={onActivity} />

{#if visible}
    <div class="overlay">
        <div class="overlay-text">
            {#each displayed as line, i (lines[i])}
                <div class="line" aria-label={lines[i]}>{line}</div>
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
        pointer-events: none;
    }

    .overlay-text {
        text-align: center;
        text-transform: uppercase;
        font-family: 'OTNeueMontreal-MediumSqueezed', 'Helvetica Neue', sans-serif;
        font-size: clamp(120px, 18vw, 253px);
        line-height: 0.82;
        letter-spacing: 0;
        color: var(--text-black);
        user-select: none;
    }

    .line {
        max-width: calc(100vw - 16px);
        margin-inline: auto;
        font-size: inherit;
        overflow-wrap: break-word;
        text-wrap: balance;
    }

    .overlay-text .line + .line {
        margin-top: 0.12em;
    }

    @media (max-width: 800px) {
        .overlay-text {
            font-size: clamp(72px, 18vw, 120px);
        }
    }
</style>
