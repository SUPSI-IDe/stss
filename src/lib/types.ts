export interface RawRow {
  [key: string]: string | undefined;
  A: string;
  B: string;
  C: string;
  D: string;
  SD: string;
  E: string;
  F: string;
  G: string;
  H: string;
  cluster?: string;
  cluster_g?: string;
  'group flow': string;
}

export interface TooltipData {
  id: number;
  label: string;
  definition: string;
}

export interface Segment {
  text: string;
  tooltip: TooltipData | null;
}

export type SegmentedLine = Segment[];

export interface LineData {
  segments: Segment[];
  width: number;
}

/** Precomputed, node-relative draw positions so the SVG can be rendered
 * declaratively without measuring text during render. */
export interface NodeTspan {
  x: number;
  y: number;
  text: string;
  plus?: boolean;
}

export interface NodeBadge {
  x: number;
  y: number;
  tooltip: TooltipData;
}

export interface NodeLineRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NodeRenderModel {
  lineRects: NodeLineRect[];
  tspans: NodeTspan[];
  badges: NodeBadge[];
}

export interface NodeData {
  row: number;
  label: string;
  lines: string[];
  memberRanges: Map<string, { start: number; end: number }> | null;
  bbox: { x: number; y: number; width: number; height: number };
  rectW: number;
  rectH: number;
  rectY: number;
  x: number;
  y: number;
  lineData: LineData[];
  hasPage?: boolean;
  pageRoute?: string;
  render?: NodeRenderModel;
}

export interface Flow {
  path: string[];
  rawClusterVals: Map<number, string>;
  group: number;
}

export interface LayoutOpts {
  lineH: number;
  clusterPadLeft: number;
  cornerR: number;
  stubLen: number;
}
