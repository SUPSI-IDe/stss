<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let { lines }: { lines: string[] } = $props();

    let visible = $state(true);
    let done = $state(false);
    let displayed = $state<string[]>([]);
    let animTimer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

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

    if (browser) {
        onMount(() => {
            animate();
            resetIdle();
            window.addEventListener('mousemove', onMove, { passive: true });
        });
        onDestroy(() => {
            if (animTimer) clearInterval(animTimer);
            if (idleTimer) clearTimeout(idleTimer);
            window.removeEventListener('mousemove', onMove);
        });
    }
</script>

{#if visible}
    <div class="overlay" aria-live="polite">
        <div class="overlay-text">
            {#each displayed as line, i}
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
    }

    .overlay-text {
        text-align: center;
        text-transform: uppercase;
        font-family: 'OTNeueMontreal-MediumSqueezed', 'Helvetica Neue', sans-serif;
        font-size: clamp(120px, 18vw, 253.19px);
        line-height: 0.8;
        letter-spacing: -6px;
        color: var(--text-black);
        pointer-events: none;
        user-select: none;
    }

    .overlay-text .line + .line {
        margin-top: 0.12em;
    }
</style>
