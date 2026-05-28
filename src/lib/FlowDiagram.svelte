<script lang="ts">
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import * as d3 from "d3";
  import {
    MARGIN,
    GROUP_COLORS,
    CLUSTER_COLS,
    BADGE_SIZE,
    BADGE_PAD,
    LINE_H,
    PAD_Y,
    COLS,
    GAP,
    CORNER_R,
    CLUSTER_PAD_LEFT,
    STUB_LEN,
  } from "./constants.js";

  import { isClusterNode } from "./clusterProcessing.js";
  import { measureNodes, adjustBadgeWidths } from "./nodeBuilder.js";
  import { computeLayout } from "./layoutEngine.js";
  import { createFlowPathGenerator, nearestLengthOnPolyline } from "./geometry.js";
  import type { NodeData, Flow, TooltipData, LineData } from "./types";

  const FLOW_ANIMATION_MS = 900;
  const FLOW_INITIAL_VISIBLE_LENGTH = 18;
  const ROW_GUIDE_LABELS: string[] = [
    "object of study",
    "purpose",
    "modality",
    "row label 4",
    "method",
    "type of data",
    "data source",
    "participatory practice",
    "workshop",
  ];
  const ROW_GUIDE_LABEL_GAP = 12;
  const ROW_GUIDE_TOP_INSET = 26;
  const HIDDEN_ROW_GUIDE_LABELS = new Set([3]);
  const DIAGRAM_LEFT_OFFSET = 28;
  const ROW_ARROW_HREF = `${base}/images/icona_freccia.svg`;
  const ROW_ARROW_WIDTH = 9;
  const ROW_ARROW_HEIGHT = 8;

  let {
    allNodes,
    uniqueFlows,
    realClusterLabelSet,
    onOpenTooltip,
  }: {
    allNodes: NodeData[];
    uniqueFlows: Flow[];
    realClusterLabelSet: Map<number, Set<string>>;
    onOpenTooltip: (
      event: MouseEvent,
      tipData: TooltipData,
      anchorX: number,
      anchorY: number,
    ) => void;
  } = $props();

  let containerEl: HTMLDivElement;

  onMount(() => {
    let destroyed = false;
    let cleanupResize = () => {};
    let width = containerEl.clientWidth - MARGIN.left - MARGIN.right;
    let height = containerEl.clientHeight;

    const svgEl = d3
      .select(containerEl)
      .append("svg")
      .attr("width", containerEl.clientWidth)
      .attr("height", containerEl.clientHeight);

    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    document.fonts.ready.then(() => {
      if (destroyed) return;

      // SVG-based text measurement — inherits all CSS (uppercase, letter-spacing, etc.)
      const svgMeasureEl = svg.append("text")
        .attr("font-size", 14)
        .attr("opacity", 0);
      const measureWidth = (str: string) => {
        svgMeasureEl.text(str);
        return svgMeasureEl.node()!.getComputedTextLength();
      };

      const measureLineWidth = (line: LineData, isFirst: boolean, hasPage: boolean) =>
        line.segments.reduce((sum, seg) => {
          let w = measureWidth(seg.text);
          if (seg.tooltip) w += BADGE_PAD * 2 + BADGE_SIZE;
          return sum + w;
        }, 0) + (isFirst && hasPage ? BADGE_PAD + measureWidth("+") : 0);

      measureNodes(allNodes, svg as any, LINE_H, PAD_Y);
      adjustBadgeWidths(allNodes, BADGE_PAD, BADGE_SIZE);

      // Compute per-line widths and set node rectW to the max
      allNodes.forEach((d) => {
        if (d.lineData && d.lineData.length) {
          d.lineData.forEach((line, i) => {
            line.width = measureLineWidth(line, i === 0, d.hasPage ?? false);
          });
          const maxW = Math.max(...d.lineData.map((l) => l.width));
          d.bbox.width = maxW;
          d.rectW = maxW;
        }
      });

      svgMeasureEl.remove();

      const layoutHeight = Math.max(0, height - ROW_GUIDE_TOP_INSET);
      computeLayout(
        allNodes,
        COLS.length,
        Math.max(0, width - DIAGRAM_LEFT_OFFSET),
        layoutHeight,
        GAP,
      );

      const applyRowGuideTopInset = () => {
        allNodes.forEach((d) => {
          d.y += ROW_GUIDE_TOP_INSET;
        });
      };

      const applyDiagramLeftOffset = () => {
        allNodes.forEach((d) => {
          d.x += DIAGRAM_LEFT_OFFSET;
        });
      };

      applyRowGuideTopInset();
      applyDiagramLeftOffset();

      type RowGuideLabelDatum = { row: number; y: number; label: string };
      const rowGuideLabels = svg.append("g").attr("class", "row-guide-labels");

      const buildRowGuideLabelData = (): RowGuideLabelDatum[] =>
        d3
          .range(COLS.length)
          .filter((row: number) => !HIDDEN_ROW_GUIDE_LABELS.has(row))
          .map((row: number) => {
            const rowNodes = allNodes.filter((d) => d.row === row);
            const rowTopY =
              d3.min(rowNodes, (d: NodeData) => d.y + d.rectY) ?? 0;

            return {
              row,
              y: rowTopY - ROW_GUIDE_LABEL_GAP,
              label: ROW_GUIDE_LABELS[row] ?? "",
            };
          });

      const updateRowGuideLabels = () => {
        rowGuideLabels
          .selectAll<SVGTextElement, RowGuideLabelDatum>("text.row-guide-label")
          .data(buildRowGuideLabelData(), (d: RowGuideLabelDatum) => String(d.row))
          .join("text")
          .attr("class", "row-guide-label")
          .attr("x", 0)
          .attr("y", (d: RowGuideLabelDatum) => d.y)
          .text((d: RowGuideLabelDatum) => d.label);
      };

      updateRowGuideLabels();

      type RowArrowDatum = { row: number; x: number; y: number };
      const rowArrows = svg.append("g").attr("class", "row-arrows");

      const buildRowArrowData = (): RowArrowDatum[] =>
        d3.range(COLS.length).map((row: number) => {
          const rowNodes = allNodes.filter((d) => d.row === row);
          const firstTextLineY =
            d3.min(rowNodes, (d: NodeData) => {
              const textBlockH = (d.lineData.length - 1) * LINE_H;
              return d.y - textBlockH / 2;
            }) ?? 0;

          return {
            row,
            x: 0,
            y: firstTextLineY - ROW_ARROW_HEIGHT / 2,
          };
        });

      const updateRowArrows = () => {
        rowArrows
          .selectAll<SVGImageElement, RowArrowDatum>("image.row-arrow")
          .data(buildRowArrowData(), (d: RowArrowDatum) => String(d.row))
          .join("image")
          .attr("class", "row-arrow")
          .attr("href", ROW_ARROW_HREF)
          .attr("width", ROW_ARROW_WIDTH)
          .attr("height", ROW_ARROW_HEIGHT)
          .attr("x", (d: RowArrowDatum) => d.x)
          .attr("y", (d: RowArrowDatum) => d.y);
      };

      updateRowArrows();

      const isClusterNodeFn = (colIdx: number, label: string) =>
        isClusterNode(colIdx, label, CLUSTER_COLS, realClusterLabelSet);
      const buildFlowGen = () =>
        createFlowPathGenerator(allNodes, uniqueFlows, isClusterNodeFn, {
          lineH: LINE_H,
          clusterPadLeft: CLUSTER_PAD_LEFT,
          cornerR: CORNER_R,
          stubLen: STUB_LEN,
        });
      let flowGen = buildFlowGen();

      const flowPaths = svg
        .append("g")
        .selectAll("path")
        .data<Flow>(uniqueFlows)
        .join("path")
        .attr("d", flowGen.pathD)
        .attr("fill", "none")
        .attr("stroke", (f: Flow) => GROUP_COLORS[f.group - 1])
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0);

      const animateFlowFromNode = (
        path: SVGPathElement,
        flow: Flow,
        originNode: NodeData,
      ) => {
        const polyline = flowGen.polyline(flow);
        if (!polyline) return;
        const total = polyline.totalLength;
        if (!total) return;

        const origin = nearestLengthOnPolyline(polyline, originNode.x, originNode.y);
        const initialStart = Math.max(0, origin - FLOW_INITIAL_VISIBLE_LENGTH / 2);
        const initialEnd = Math.min(total, origin + FLOW_INITIAL_VISIBLE_LENGTH / 2);
        const initialVisible = Math.max(0.1, initialEnd - initialStart);

        const selection = d3.select(path)
          .attr(
            "stroke-dasharray",
            `0 ${initialStart} ${initialVisible} ${total - initialEnd}`,
          )
          .attr("stroke-dashoffset", 0)
          .attr("stroke-opacity", 0.9);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            selection
              .transition()
              .duration(FLOW_ANIMATION_MS)
              .ease(d3.easeCubicOut)
              .attrTween("stroke-dasharray", () => (t: number) => {
                const start = initialStart * (1 - t);
                const end = initialEnd + (total - initialEnd) * t;
                const visible = Math.max(0.1, end - start);
                const rest = Math.max(0, total - end);
                return `0 ${start} ${visible} ${rest}`;
              })
              .on("end", () => {
                d3.select(path)
                  .attr("stroke-dasharray", null)
                  .attr("stroke-dashoffset", null);
              });
          });
        });
      };

      const nodeGroups = svg
        .append("g")
        .selectAll("g")
        .data<NodeData>(allNodes)
        .join("g")
        .attr("transform", (d: NodeData) => `translate(${d.x},${d.y})`);

      // Draw one rect per line instead of one rect per node
      nodeGroups.each((d: NodeData, _i: number, nodes: SVGGElement[]) => {
        const g = d3.select(nodes[_i] as SVGGElement);
        const lineRectH = d.rectH / d.lineData.length;
        d.lineData.forEach((line, i) => {
          g.append("rect")
            .attr("class", "line-rect")
            .attr("x", -d.rectW / 2)
            .attr("y", d.rectY + i * lineRectH)
            .attr("width", line.width)
            .attr("height", lineRectH)
            .attr("fill", "transparent");
        });
      });

      nodeGroups.each((d: NodeData, _i: number, nodes: SVGGElement[]) => {
        const g = d3.select(nodes[_i] as SVGGElement);
        const el = g
          .append("text")
          .attr("text-anchor", "start")
          .attr("font-size", 14)
          .attr("fill", "#333");

        const textBlockH = (d.lineData.length - 1) * LINE_H;
        const startY = -textBlockH / 2;
        const startX = -d.rectW / 2;

        d.lineData.forEach((line: LineData, i: number) => {
          let cx = startX;
          const ly = startY + i * LINE_H;

          line.segments.forEach((seg: import("./types").Segment) => {
            if (seg.tooltip) cx += BADGE_PAD;
            const tspan = el.append("tspan")
              .text(seg.text)
              .attr("x", cx)
              .attr("y", ly)
              .attr("dy", "0.35em");

            cx += tspan.node()!.getComputedTextLength();

            if (seg.tooltip) {
              cx += BADGE_PAD;
              const tipData = seg.tooltip;
              const badgeG = g
                .append("g")
                .attr("class", "badge")
                .attr("pointer-events", "all")
                .style("cursor", "pointer")
                .attr(
                  "transform",
                  `translate(${cx},${ly + 14 * 0.35 - BADGE_SIZE + 2})`,
                )
                .on("click", (event: MouseEvent) => {
                  event.stopPropagation();
                  const rect = (
                    event.currentTarget as SVGGElement
                  ).getBoundingClientRect();
                  onOpenTooltip(event, tipData, rect.left, rect.top);
                });

              badgeG
                .append("rect")
                .attr("width", BADGE_SIZE)
                .attr("height", BADGE_SIZE)
                .attr("fill", "black");

              badgeG
                .append("text")
                .attr("class", "badge-label")
                .attr("x", BADGE_SIZE / 2)
                .attr("y", BADGE_SIZE / 2)
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .text(String(seg.tooltip.id));

              cx += BADGE_SIZE + BADGE_PAD;
            }
          });

          if (i === 0 && d.hasPage) {
            cx += BADGE_PAD;
            el.append("tspan")
              .text("+")
              .attr("x", cx)
              .attr("y", ly)
              .attr("dy", "0.25em")
              .attr("fill", "black");
          }
        });
      });

      nodeGroups
        .on("mouseenter", (_: MouseEvent, d: NodeData) => {
          const match = (f: Flow) => f.path[d.row] === d.label;
          flowPaths.interrupt();
          flowPaths
            .attr("stroke-opacity", 0)
            .attr("stroke", (f: Flow) => GROUP_COLORS[f.group - 1])
            .attr("stroke-width", (f: Flow) => (match(f) ? 2 : 1))
            .attr("stroke-dasharray", null)
            .attr("stroke-dashoffset", null)
            .filter(match)
            .each(function (this: SVGPathElement, f: Flow) {
              animateFlowFromNode(this as SVGPathElement, f, d);
            });
          const matchingFlows = uniqueFlows.filter(match);
          nodeGroups.each(function (this: SVGGElement, nd: NodeData) {
            const nodeFlows = matchingFlows.filter(
              (f) => f.path[nd.row] === nd.label,
            );
            let color = "transparent";
            if (nodeFlows.length > 0) {
              const counts: Record<number, number> = {};
              nodeFlows.forEach((f) => {
                counts[f.group] = (counts[f.group] || 0) + 1;
              });
              const topGroup = Object.entries(counts).sort(
                (a, b) => b[1] - a[1],
              )[0][0];
              color = GROUP_COLORS[+topGroup - 1];
            }
            d3.select(this).selectAll(".line-rect").attr("fill", color);
          });
        })
        .on("mouseleave", () => {
          flowPaths.interrupt();
          flowPaths
            .attr("stroke-opacity", 0)
            .attr("stroke", (f: Flow) => GROUP_COLORS[f.group - 1])
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", null)
            .attr("stroke-dashoffset", null);
          nodeGroups.selectAll(".line-rect").attr("fill", "transparent");
        });

      const handleResize = () => {
        width = containerEl.clientWidth - MARGIN.left - MARGIN.right;
        height = containerEl.clientHeight;

        svgEl
          .attr("width", containerEl.clientWidth)
          .attr("height", containerEl.clientHeight);

        const layoutHeight = Math.max(0, height - ROW_GUIDE_TOP_INSET);
        computeLayout(
          allNodes,
          COLS.length,
          Math.max(0, width - DIAGRAM_LEFT_OFFSET),
          layoutHeight,
          GAP,
        );
        applyRowGuideTopInset();
        applyDiagramLeftOffset();
        updateRowGuideLabels();
        updateRowArrows();

        nodeGroups.attr(
          "transform",
          (d: NodeData) => `translate(${d.x},${d.y})`,
        );
        flowGen = buildFlowGen();
        flowPaths.attr("d", flowGen.pathD);
      };

      window.addEventListener("resize", handleResize);
      cleanupResize = () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      destroyed = true;
      cleanupResize();
      svgEl.remove();
    };
  });
</script>

<div class="sankey-container" bind:this={containerEl}></div>

<style>
  .sankey-container {
    width: 100%;
    height: 100%;
  }

  :global(svg text) {
    font-family: "Helvetica Neue", sans-serif;
    font-size: 13.38px;
    letter-spacing: 0.1px;
    line-height: 111%;
    text-transform: uppercase;
    pointer-events: none;
    user-select: none;
  }

  :global(svg .badge-label) {
    font-size: 13.38px !important;
    letter-spacing: 0.1px !important;
  }

  :global(svg .row-guide-label) {
    fill: #ADADAD;
    font-size: 11px;
    letter-spacing: 0.1px;
    text-transform: lowercase;
  }

  :global(circle) {
    cursor: pointer;
  }
</style>
