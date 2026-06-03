// Section the next overlay should scroll to, handed from the diagram to the
// article across a navigation. Passed out-of-band rather than as a URL hash:
// a hash in the navigated URL triggers SvelteKit's native scroll mid-navigation,
// which kills the overlay slide-up. The article reads this once it has mounted
// and scrolls itself after the entrance animation has finished.
let pending: string | null = null;

/** Stash a section hash (e.g. "#data-scraping") to scroll to on next mount. */
export function setPendingScroll(hash: string): void {
    pending = hash;
}

/** Read and clear the stashed section hash, if any. */
export function takePendingScroll(): string | null {
    const hash = pending;
    pending = null;
    return hash;
}
