# Components

Reusable Svelte components live here, grouped by role:

- `site/`: site-level chrome and persistent layout surfaces.
- `diagram/`: D3/SVG diagram components and diagram-specific UI.
- `overlays/`: full-screen route overlays and animated intro overlays.

Routes should usually import shared components from `$lib/components`.
Components inside this folder can import siblings directly when that keeps dependencies clearer.

`SlideUpOverlay` is the animated, fixed-position container that slides a route in over the home view and owns the overlay grid. `OverlayArticle` is the per-page content shell (head, header, scroll body) rendered inside it. A direct child component can opt into the same columns with a single root element using `class="page-subgrid"`.
