<div
    class="desktop-disclaimer"
    role="dialog"
    aria-modal="true"
    aria-labelledby="desktop-disclaimer-title"
>
    <div class="desktop-disclaimer__content">
        <p id="desktop-disclaimer-title" class="desktop-disclaimer__title">
            This website is optimised for desktop browsing.
        </p>
        <p class="desktop-disclaimer__body">
            Please visit from a larger screen for the full experience.
        </p>
    </div>
</div>

<style>
    .desktop-disclaimer {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
        place-items: center;
        padding: 24px;
        background: var(--bg);
        color: var(--text-black);
        pointer-events: auto;
        touch-action: none;
    }

    .desktop-disclaimer__content {
        width: min(100%, 520px);
        text-align: center;
    }

    .desktop-disclaimer__title {
        font-family: "OTNeueMontreal-MediumSqueezed", "Helvetica Neue", sans-serif;
        font-size: clamp(72px, 20vw, 140px);
        line-height: 0.82;
        letter-spacing: 0;
        text-transform: uppercase;
        text-wrap: balance;
    }

    .desktop-disclaimer__body {
        margin-top: 18px;
        font-size: var(--text-base);
        line-height: 1.2;
        color: var(--text-muted);
        text-wrap: balance;
    }

    @media (max-width: 1023px) {
        .desktop-disclaimer {
            display: grid;
        }
    }
</style>
