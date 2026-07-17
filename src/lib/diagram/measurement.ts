import type { Attachment } from 'svelte/attachments';
import {
	BADGE_PAD,
	BADGE_SIZE,
	COLS,
	LAYOUT_SIDE_PADDING,
	LINE_H,
	MARGIN,
	PAD_Y
} from '../constants.js';
import { measureNodes } from '../nodeBuilder.js';
import { createSegmenter } from '../textUtils.js';
import type { Flow, NodeData, TooltipData } from '../types';
import { MOBILE_NODE_GAP, PAGE_PLUS_DIAMETER, ROW_GUIDE_TOP_INSET } from './config.js';
import { nodeKey, visibleNodeKeys } from './model.js';
import { buildNodeRenderModel, cloneNodes, wrapToWidth } from './renderModel.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

type MeasurementOptions = {
	getNodes: () => NodeData[];
	getFlowIndex: () => Map<string, Flow[]>;
	isMobileRootNode: (label: string) => boolean;
	onMeasured: (nodes: NodeData[]) => void;
	onMobileMeasured: (nodesByRoot: Map<string, NodeData[]>) => void;
	onMobileAnchorChange: (anchorY: number) => void;
};

export function createNodeMeasurementAttachment(options: MeasurementOptions): Attachment<HTMLDivElement> {
	return (container) => {
		let cancelled = false;
		let observer: ResizeObserver | null = null;
		let measurementSvg: SVGSVGElement | null = null;

		void document.fonts.ready.then(() => {
			if (cancelled) return;
			measurementSvg = document.createElementNS(SVG_NS, 'svg');
			measurementSvg.classList.add('diagram-measurement');
			measurementSvg.setAttribute('width', '0');
			measurementSvg.setAttribute('height', '0');
			measurementSvg.style.position = 'absolute';
			measurementSvg.style.visibility = 'hidden';
			container.appendChild(measurementSvg);

			const measureElement = document.createElementNS(SVG_NS, 'text');
			measureElement.setAttribute('font-size', '14');
			measureElement.setAttribute('opacity', '0');
			measurementSvg.appendChild(measureElement);
			const measureWidth = (text: string) => {
				measureElement.textContent = text;
				return measureElement.getComputedTextLength();
			};

			const measureLineWidth = (line: NodeData['lineData'][number], isFirst: boolean, hasPage: boolean) =>
				line.segments.reduce((width, segment) => {
					return width + measureWidth(segment.text) + (segment.tooltip ? BADGE_PAD * 2 + BADGE_SIZE : 0);
				}, 0) + (isFirst && hasPage ? BADGE_PAD + PAGE_PLUS_DIAMETER : 0);

			const finalizeNodes = (nodes: NodeData[]) => {
				measureNodes(nodes, measurementSvg as SVGSVGElement, LINE_H, PAD_Y);
				for (const node of nodes) {
					node.lineData.forEach((line, index) => {
						line.width = measureLineWidth(line, index === 0, node.hasPage ?? false);
					});
					const maxWidth = Math.max(0, ...node.lineData.map((line) => line.width));
					node.bbox.width = maxWidth;
					node.rectW = maxWidth;
					node.render = buildNodeRenderModel(node, measureWidth, {
						lineHeight: LINE_H,
						badgePad: BADGE_PAD,
						badgeSize: BADGE_SIZE,
						pagePlusDiameter: PAGE_PLUS_DIAMETER
					});
				}
			};

			const nodes = cloneNodes(options.getNodes());
			finalizeNodes(nodes);
			options.onMeasured(nodes);

			const tooltipMap = new Map<string, TooltipData>();
			for (const node of options.getNodes()) {
				for (const line of node.lineData) {
					for (const segment of line.segments) {
						if (segment.tooltip) tooltipMap.set(segment.tooltip.label.toLowerCase().trim(), segment.tooltip);
					}
				}
			}
			const segmentLine = createSegmenter(tooltipMap);

			const updateAnchor = () => {
				const rect = container.getBoundingClientRect();
				const viewport = window.visualViewport;
				const viewportCenter = viewport ? viewport.offsetTop + viewport.height / 2 : window.innerHeight / 2;
				const layoutHeight = Math.max(0, rect.height - ROW_GUIDE_TOP_INSET);
				options.onMobileAnchorChange(
					Math.max(0, Math.min(layoutHeight, viewportCenter - rect.top - ROW_GUIDE_TOP_INSET))
				);
			};

			let lastMobileWidth = -1;
			const rebuildMobileMeasurements = (containerWidth: number) => {
				const availableWidth = Math.max(
					0,
					containerWidth - MARGIN.left - MARGIN.right - LAYOUT_SIDE_PADDING * 2
				);
				if (Math.abs(availableWidth - lastMobileWidth) < 0.5) return;
				lastMobileWidth = availableWidth;
				const sourceNodes = options.getNodes();
				const flowIndex = options.getFlowIndex();
				const variants = new Map<string, NodeData[]>();

				for (const root of sourceNodes.filter((node) => options.isMobileRootNode(node.label))) {
					const rootKey = nodeKey(root.row, root.label);
					const visibleKeys = visibleNodeKeys(sourceNodes, rootKey, flowIndex, options.isMobileRootNode);
					const counts = Array.from({ length: COLS.length }, (_, row) =>
						sourceNodes.filter((node) => node.row === row && visibleKeys.has(nodeKey(node.row, node.label))).length
					);
					const columnWidths = counts.map((count) =>
						count > 1 ? Math.max(1, (availableWidth - MOBILE_NODE_GAP * (count - 1)) / count) : availableWidth
					);
					const mobileNodes = cloneNodes(sourceNodes);

					for (const node of mobileNodes) {
						const count = counts[node.row] ?? 0;
						if (!visibleKeys.has(nodeKey(node.row, node.label)) || count <= 1 || options.isMobileRootNode(node.label)) continue;
						const maxTextWidth = Math.max(
							1,
							columnWidths[node.row] - (node.hasPage ? BADGE_PAD + PAGE_PLUS_DIAMETER : 0)
						);
						const members = node.memberRanges ? [...node.memberRanges.keys()] : [node.label];
						const lines: string[] = [];
						const memberRanges = node.memberRanges ? new Map<string, { start: number; end: number }>() : null;
						for (const member of members) {
							const start = lines.length;
							lines.push(...wrapToWidth(member, maxTextWidth, measureWidth));
							memberRanges?.set(member, { start, end: lines.length - 1 });
						}
						node.lines = lines;
						node.memberRanges = memberRanges;
						node.lineData = lines.map((line) => ({ segments: segmentLine(line), width: 0 }));
					}
					finalizeNodes(mobileNodes);
					for (const node of mobileNodes) {
						const count = counts[node.row] ?? 0;
						if (count > 1 && !options.isMobileRootNode(node.label) && visibleKeys.has(nodeKey(node.row, node.label))) {
							node.bbox.width = columnWidths[node.row];
						}
					}
					variants.set(rootKey, mobileNodes);
				}
				options.onMobileMeasured(variants);
			};

			updateAnchor();
			rebuildMobileMeasurements(container.clientWidth);
			observer = new ResizeObserver(([entry]) => {
				updateAnchor();
				rebuildMobileMeasurements(entry.contentRect.width);
			});
			observer.observe(container);
		});

		return () => {
			cancelled = true;
			observer?.disconnect();
			measurementSvg?.remove();
		};
	};
}
