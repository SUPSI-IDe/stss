import { tsvParse, csvParse } from 'd3-dsv';
import { COLS, CLUSTER_COLS, MAX_LINE } from '$lib/constants.js';
import { buildClusterData, isClusterNode } from '$lib/clusterProcessing.js';
import { buildLayers, buildFlows, deduplicateFlows } from '$lib/flowProcessing.js';
import { buildAllNodes } from '$lib/nodeBuilder.js';
import { createSegmenter } from '$lib/textUtils.js';
import { base } from '$app/paths';

/** @typedef {import('$lib/types').RawRow} RawRow */
/** @typedef {import('$lib/types').Flow} Flow */
/** @typedef {import('$lib/types').NodeData} NodeData */
/** @typedef {import('$lib/types').TooltipData} TooltipData */

export async function load({ fetch }) {
	const [tsvText, csvText] = await Promise.all([
		fetch(`${base}/sourcedata.tsv`).then((r) => r.text()),
		fetch(`${base}/TooltipTable.csv`).then((r) => r.text())
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

	const allNodes = buildAllNodes(layers, isClusterNodeFn, MAX_LINE);
	const segmentLine = createSegmenter(tooltipMap);
	allNodes.forEach((d) => {
		d.segmentedLines = d.lines.map((line) => segmentLine(line));
	});

	return { allNodes, uniqueFlows, tooltipMap, realClusterLabelSet };
}
