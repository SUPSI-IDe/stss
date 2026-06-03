import { base } from "$app/paths";
import { goto } from "$app/navigation";
import { PAGE_META } from "./constants";

/**
 * The open overlay pages, bottom→top. The last entry is the page currently in
 * view; the earlier entries are the pinned header bars stacked above it. The
 * stack is mutated only through {@link navigateTo}, called from the overlay
 * layout's `beforeNavigate`, so it always tracks the active route. The action
 * methods just compute a target and navigate — the resulting navigation flows
 * back through `navigateTo` to update the stack.
 *
 * @typedef {{ path: string, chapter: number, title: string }} StackEntry
 */
class OverlayStack {
  /** @type {StackEntry[]} */
  stack = $state([]);

  /** Pages below the current one — their headers are pinned by the layout. */
  get ancestors() {
    return this.stack.slice(0, -1);
  }

  /** Index of the current page; drives panel z-index (see SlideUpOverlay). */
  get depth() {
    return Math.max(0, this.stack.length - 1);
  }

  /**
   * Is this page currently a pinned ancestor (i.e. in the stack but not the
   * top)? Such a page's header is drawn by the layout, so its panel hides its
   * own header to avoid a duplicate while it lingers behind a page opening over
   * it. A page leaving the stack entirely is not an ancestor, so it keeps its
   * header and slides away as one unit.
   * @param {string} path route path without the base prefix
   */
  isAncestorPath(path) {
    const i = this.stack.findIndex((e) => e.path === path);
    return i !== -1 && i < this.stack.length - 1;
  }

  /**
   * Sync the stack to a navigation target and report the animation direction.
   * A path already in the stack means we're going *back* (truncate above it);
   * a new path means we're going *forward* (push it on top).
   * @param {string} path route path without the base prefix, e.g. "/waste-flow"
   * @returns {"forward" | "back"}
   */
  navigateTo(path) {
    const idx = this.stack.findIndex((e) => e.path === path);
    if (idx === -1) {
      this.stack = [...this.stack, { path, ...PAGE_META[path] }];
      return "forward";
    }
    this.stack = this.stack.slice(0, idx + 1);
    return "back";
  }

  /** Leaving the overlays entirely (to home / about). */
  clear() {
    this.stack = [];
  }

  /** Click a pinned header: reveal that page, dropping everything above it. */
  selectAt(/** @type {number} */ i) {
    this.#goto(this.stack[i].path);
  }

  /** Close a page (and everything stacked on it), revealing the one below. */
  closeAt(/** @type {number} */ i) {
    if (i <= 0) goto(`${base}/`);
    else this.#goto(this.stack[i - 1].path);
  }

  /** Close button on the page in view. */
  closeCurrent() {
    this.closeAt(this.stack.length - 1);
  }

  #goto(/** @type {string} */ path) {
    goto(`${base}${path}`);
  }
}

export const overlayStack = new OverlayStack();
