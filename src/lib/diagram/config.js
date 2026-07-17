import { BADGE_SIZE } from '../constants.js';

export const FLOW_ANIMATION_MS = 900;
export const FLOW_INITIAL_VISIBLE_LENGTH = 18;
export const ROW_GUIDE_LABEL_GAP = 12;
export const ROW_GUIDE_TOP_INSET = 26;
export const DIAGRAM_LEFT_OFFSET = 28;
export const ROW_ARROW_HEIGHT = 8;
export const ROW_ARROW_WIDTH = 9;
export const MOBILE_ROW_LABEL_INDENT = ROW_ARROW_WIDTH + 4;
export const MOBILE_ROW_ARROW_RISE = 7;
export const PAGE_PLUS_DIAMETER = BADGE_SIZE;
export const PAGE_PLUS_RADIUS = PAGE_PLUS_DIAMETER / 2;
export const MOBILE_NODE_GAP = 16;
export const MOBILE_ROOT_ROW = 4;
export const MOBILE_ROOT_LABELS = new Set(['thinking', 'seeing', 'sharing', 'sensing']);

/** @param {string} label */
export const isMobileRootNode = (label) => MOBILE_ROOT_LABELS.has(label.toLowerCase().trim());
