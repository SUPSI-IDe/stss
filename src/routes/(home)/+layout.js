import { tsvParse, csvParse } from 'd3-dsv';
import { COLS, CLUSTER_COLS, MAX_LINE, PAGE_ROUTES, GROUP_COLORS } from '$lib/constants.js';
import { buildClusterData, isClusterNode } from '$lib/clusterProcessing.js';
import { buildLayers, buildFlows, deduplicateFlows } from '$lib/flowProcessing.js';
import { buildAllNodes } from '$lib/nodeBuilder.js';
import { createSegmenter } from '$lib/textUtils.js';
import { asset } from '$app/paths';

/** @typedef {import('$lib/types').RawRow} RawRow */
/** @typedef {import('$lib/types').TooltipData} TooltipData */

export async function load({ fetch }) {
	const [tsvText, csvText] = await Promise.all([
		fetch(asset('/sourcedata.tsv')).then((r) => r.text()),
		fetch(asset('/TooltipTable.csv')).then((r) => r.text())
	]);

	const raw = /** @type {RawRow[]} */ (tsvParse(tsvText));
	const tooltipRaw = /** @type {TooltipData[]} */ (csvParse(csvText));

	/** @type {Map<string, TooltipData>} */
	const tooltipMap = new Map();
	tooltipRaw.forEach((t) => {
		tooltipMap.set(t.label.toLowerCase().trim(), {
			id: +t.id,
			label: t.label.trim(),
			definition: t.definition.trim()
		});
	});

	const { clusterLabels, realClusters, realClusterLabelSet, valToCluster } = buildClusterData(
		raw,
		COLS,
		CLUSTER_COLS
	);

	/** @type {(colIdx: number, label: string) => boolean} */
	const isClusterNodeFn = (colIdx, label) =>
		isClusterNode(colIdx, label, CLUSTER_COLS, realClusterLabelSet);

	const layers = buildLayers(raw, COLS, CLUSTER_COLS, clusterLabels, realClusters);
	const flows = buildFlows(raw, COLS, CLUSTER_COLS, valToCluster);
	const uniqueFlows = deduplicateFlows(flows);

	// Surface bad `group flow` cells at build time — an out-of-range or
	// non-numeric group otherwise renders an invisible flow (GROUP_COLORS[NaN]).
	uniqueFlows.forEach((f) => {
		if (!Number.isInteger(f.group) || f.group < 1 || f.group > GROUP_COLORS.length) {
			console.warn(
				`Flow has invalid group ${f.group} (expected 1–${GROUP_COLORS.length}): ${f.path.join(' → ')}`
			);
		}
	});

	const allNodes = buildAllNodes(layers, isClusterNodeFn, MAX_LINE);
	const segmentLine = createSegmenter(tooltipMap);
	allNodes.forEach((d) => {
		const pageRoute = PAGE_ROUTES.get(d.label.toLowerCase().trim());

		d.lineData = d.lines.map((line) => ({
			segments: segmentLine(line),
			width: 0
		}));
		d.hasPage = Boolean(pageRoute);
		d.pageRoute = pageRoute;
	});

	return { allNodes, uniqueFlows, realClusterLabelSet };
}
