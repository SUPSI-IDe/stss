/**
 * Single source of truth for diagram columns, in display order (top row first).
 * Everything keyed by column index is derived from this — no magic offsets.
 * - `key`: TSV column holding this row's value.
 * - `guide`: row-guide label; omit to render no guide for that row.
 * - `clusterCol`: TSV column holding the cluster id; present only on clustered rows.
 * @type {{ key: string, guide?: string, clusterCol?: string }[]}
 */
export const COLUMNS = [
  { key: "A", guide: "object of study" },
  { key: "B", guide: "purpose" },
  { key: "C", guide: "modality" },
  { key: "SD" },
  { key: "D", guide: "method" },
  { key: "E", guide: "type of data", clusterCol: "cluster" },
  { key: "F", guide: "data source" },
  { key: "G", guide: "participatory practice", clusterCol: "cluster_g" },
  { key: "H", guide: "workshop" },
];

export const COLS = COLUMNS.map((c) => c.key);
/** @type {Map<number, string>} */
export const CLUSTER_COLS = new Map(
  COLUMNS.flatMap((c, i) => (c.clusterCol ? [[i, c.clusterCol]] : [])),
);
/** Row-guide label per column index, or null where no guide should render. */
export const ROW_GUIDE_LABELS = COLUMNS.map((c) => c.guide ?? null);

export const GROUP_COLORS = [
  "#FF6027", // thinking
  "#26FF00", // seeing
  "#B7FF00", // second seeing flow
  "#00FFE5", // governance/sharing
  "#FF39A9", // sensing
];
export const MAX_LINE = 30;
export const MARGIN = { top: 0, right: 8, bottom: 0, left: 8 };
export const BADGE_SIZE = 14;
export const BADGE_PAD = 4;
export const LINE_H = 13.5;
export const CORNER_R = 6;
export const CLUSTER_PAD_LEFT = 8;
export const STUB_LEN = 14;
export const PAD_Y = 1;
export const SITE_TITLE = "Small Data Practices for Urban Dialogue";

/**
 * Per-overlay metadata, keyed by route path (without the base prefix). Used to
 * render the pinned header bar of pages further down the overlay stack, which
 * are not mounted and so can't supply their own chapter/title.
 * @type {Record<string, { chapter: number, title: string }>}
 */
export const PAGE_META = {
  "/waste-flow": { chapter: 1, title: "Waste Flow" },
  "/urban-small-data": { chapter: 2, title: "Urban Small Data" },
  "/source-of-small-data": { chapter: 3, title: "Sources of Small Data" },
  "/participatory-data-practices": { chapter: 4, title: "Participatory Data Practices" },
  "/urban-scraping": { chapter: 5, title: "Urban Scraping" },
  "/pixel-urbani": { chapter: 6, title: "Pixel Urbani" },
  "/interfaces-for-public-debate": { chapter: 7, title: "Interfaces for Public Debate" },
};

export const PAGE_ROUTES = new Map([
  ["waste flow", "/waste-flow"],
  ["small data", "/urban-small-data"],
  ["seeing", "/urban-small-data#seeing"],
  ["sensing", "/urban-small-data#sensing"],
  ["thinking", "/urban-small-data#thinking"],
  ["sharing", "/urban-small-data#sharing"],
  ["data plotting", "/participatory-data-practices#data-plotting"],
  ["data walking", "/participatory-data-practices#data-walking"],
  ["data prototyping", "/participatory-data-practices#data-prototyping"],
  ["data scraping", "/participatory-data-practices#data-scraping"],
  ["data mapping", "/participatory-data-practices#data-mapping"],
  ["gesture tracking", "/participatory-data-practices#gesture-tracking"],
  ["urban scraping", "/urban-scraping"],
  ["pixel urbani", "/pixel-urbani"],
  ["urban context", "/source-of-small-data"],
  ["personal experience", "/source-of-small-data"],
  ["online platform", "/source-of-small-data"],
  ["interfaces for public debate", "/interfaces-for-public-debate"],
]);
