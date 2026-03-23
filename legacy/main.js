import "./style.css";
import * as d3 from "d3";

const cols = ["A", "B", "C", "D", "E", "F", "G", "H"];
const groupColors = ["#39ff14", "#ff7a00", "#ffd600", "#c9a3ff", "#5ec7ff"];
const MAX_LINE = 30;
const GAP = 52;

// Cluster columns: column index → TSV column name for cluster IDs
const CLUSTER_COLS = new Map([
  [4, "cluster"],   // column E
  [6, "cluster_g"], // column G
]);

const margin = { top: 0, right: 20, bottom: 0, left: 20 };
const appEl = document.getElementById("app");
// contentHeight excludes CSS padding (24px top + 24px bottom)
const padV = 48;
let width = appEl.clientWidth - margin.left - margin.right;
let height = appEl.clientHeight - padV;

const svgEl = d3
  .select("#app")
  .append("svg")
  .attr("width", appEl.clientWidth)
  .attr("height", appEl.clientHeight - padV);

const svg = svgEl
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Word-wrap: split label into lines of max `limit` chars, breaking at spaces
function wrapText(text, limit) {
  const words = text.split(" ");
  const lines = [];
  let cur = words[0];
  for (let i = 1; i < words.length; i++) {
    if (cur.length + 1 + words[i].length <= limit) {
      cur += " " + words[i];
    } else {
      lines.push(cur);
      cur = words[i];
    }
  }
  lines.push(cur);
  return lines;
}

Promise.all([d3.tsv("sourcedata.tsv"), document.fonts.ready]).then(([raw]) => {
  // Build cluster maps per cluster column
  // clusterMaps: colIdx → Map(clusterId → Set of values)
  // clusterLabels: colIdx → Map(clusterId → joined label)
  // realClusters: colIdx → Set of cluster IDs with >1 member
  // realClusterLabelSet: colIdx → Set of cluster labels that are real clusters
  // valToCluster: colIdx → Map(rawValue → clusterLabel) [only for real clusters]
  const clusterMaps = new Map();
  const clusterLabels = new Map();
  const realClusters = new Map();
  const realClusterLabelSet = new Map();
  const valToCluster = new Map();

  for (const [colIdx, tsvCol] of CLUSTER_COLS) {
    const colName = cols[colIdx];
    const cmap = new Map();
    raw.forEach((r) => {
      const cid = r[tsvCol] ? r[tsvCol].trim() : "";
      if (!cid) return;
      if (!cmap.has(cid)) cmap.set(cid, new Set());
      cmap.get(cid).add(r[colName].trim());
    });
    clusterMaps.set(colIdx, cmap);

    const labels = new Map();
    const real = new Set();
    cmap.forEach((members, cid) => {
      labels.set(cid, [...members].join(", "));
      if (members.size > 1) real.add(cid);
    });
    clusterLabels.set(colIdx, labels);
    realClusters.set(colIdx, real);

    const labelSet = new Set();
    cmap.forEach((members, cid) => {
      if (real.has(cid)) labelSet.add(labels.get(cid));
    });
    realClusterLabelSet.set(colIdx, labelSet);

    const vmap = new Map();
    raw.forEach((r) => {
      const cid = r[tsvCol] ? r[tsvCol].trim() : "";
      if (cid && real.has(cid)) {
        vmap.set(r[colName].trim(), labels.get(cid));
      }
    });
    valToCluster.set(colIdx, vmap);
  }

  function isClusterNode(colIdx, label) {
    return CLUSTER_COLS.has(colIdx) && realClusterLabelSet.get(colIdx).has(label);
  }

  // Build layers: for cluster columns, merge real clusters; keep singles as-is
  const layers = cols.map((c, i) => {
    if (CLUSTER_COLS.has(i)) {
      const tsvCol = CLUSTER_COLS.get(i);
      const labels = clusterLabels.get(i);
      const real = realClusters.get(i);
      const seen = new Set();
      const result = [];
      raw.forEach((r) => {
        const cid = r[tsvCol] ? r[tsvCol].trim() : "";
        const val = r[c].trim();
        if (cid && real.has(cid)) {
          const label = labels.get(cid);
          if (!seen.has(label)) {
            seen.add(label);
            result.push(label);
          }
        } else {
          if (!seen.has(val)) {
            seen.add(val);
            result.push(val);
          }
        }
      });
      return result;
    }
    return [...new Set(raw.map((r) => r[c].trim()))];
  });

  // Build flows using cluster labels for cluster columns (real clusters only)
  const flows = raw.map((r) => ({
    path: cols.map((c, i) => {
      const val = r[c].trim();
      if (CLUSTER_COLS.has(i)) {
        const vmap = valToCluster.get(i);
        return vmap.has(val) ? vmap.get(val) : val;
      }
      return val;
    }),
    rawClusterVals: new Map(
      [...CLUSTER_COLS.keys()].map((colIdx) => [colIdx, r[cols[colIdx]].trim()])
    ),
    group: +r["group flow"],
  }));

  // Deduplicate flows (include raw cluster values so different members stay separate)
  const seen = new Set();
  const uniqueFlows = flows.filter((f) => {
    const clusterKeys = [...f.rawClusterVals.entries()]
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    const key = f.path.join("|") + "|" + clusterKeys;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const padX = 2;
  const padY = 1;

  const allNodes = layers.flatMap((labels, row) =>
    labels.map((label) => {
      let lines, memberRanges;
      if (isClusterNode(row, label)) {
        const members = label.split(", ");
        lines = [];
        memberRanges = new Map();
        for (const m of members) {
          const start = lines.length;
          lines.push(...wrapText(m, MAX_LINE));
          memberRanges.set(m, { start, end: lines.length - 1 });
        }
      } else {
        lines = wrapText(label, MAX_LINE);
        memberRanges = null;
      }
      return { row, label, lines, memberRanges };
    })
  );

  // Render text offscreen to measure, using the exact same rendering as final
  const measure = svg.append("g").attr("class", "measure").attr("opacity", 0);
  const lineH = 15.4;

  measure
    .selectAll("g")
    .data(allNodes)
    .join("g")
    .each(function (d) {
      const multiLine = d.lines.length > 1;
      const el = d3.select(this).append("text")
        .attr("text-anchor", multiLine ? "start" : "middle")
        .attr("font-size", 14);

      const textBlockH = (d.lines.length - 1) * lineH;
      const startY = -textBlockH / 2;
      const xOffset = multiLine ? 0 : 0; // measure at x=0, we only need dimensions

      d.lines.forEach((line, i) => {
        el.append("tspan")
          .text(line)
          .attr("x", xOffset)
          .attr("y", startY + i * lineH)
          .attr("dy", "0.35em");
      });

      const bbox = el.node().getBBox();
      d.bbox = bbox;
      d.rectW = bbox.width + padX * 2;
      d.rectH = bbox.height + padY * 2;
      d.rectY = bbox.y - padY;
    });

  measure.remove();

  // Compute max node height per row
  function maxRowHeight(row) {
    return Math.max(...allNodes.filter((d) => d.row === row).map((d) => d.rectH));
  }

  // Build yScale so rows fit within available height, accounting for node heights
  function buildYScale() {
    const lastRowH = maxRowHeight(cols.length - 1);
    const firstRowH = maxRowHeight(0);
    // First row top at 0, last row bottom at height
    return d3.scalePoint()
      .domain(d3.range(cols.length))
      .range([firstRowH / 2, height - lastRowH / 2])
      .padding(0);
  }
  let yScale = buildYScale();

  // Step 2: compute x positions per row using measured widths + GAP
  function computeLayout() {
    yScale = buildYScale();
    for (const row of d3.range(cols.length)) {
      const rowNodes = allNodes.filter((d) => d.row === row);
      const totalW = rowNodes.reduce((s, d) => s + d.bbox.width, 0) + GAP * (rowNodes.length - 1);
      let cursor = width / 2 - totalW / 2;
      for (const d of rowNodes) {
        d.x = cursor + d.bbox.width / 2;
        cursor += d.bbox.width + GAP;
      }
      const rowTop = yScale(row) - maxRowHeight(row) / 2;
      for (const d of rowNodes) {
        // Position so that the rect top aligns with rowTop
        d.y = rowTop - d.rectY;
      }
    }
  }
  computeLayout();

  // Lookup helpers
  function findNode(row, label) {
    return allNodes.find((n) => n.row === row && n.label === label);
  }
  function nodeTop(row, label) {
    const d = findNode(row, label);
    return [d.x, d.y + d.rectY];
  }
  function nodeBottom(row, label) {
    const d = findNode(row, label);
    return [d.x, d.y + d.rectY + d.rectH];
  }
  // Cluster member: y-offset of a specific member relative to node center
  function memberYOffset(node, member) {
    const range = node.memberRanges.get(member);
    const textBlockH = (node.lines.length - 1) * lineH;
    const startY = -textBlockH / 2;
    return (startY + range.start * lineH + startY + range.end * lineH) / 2;
  }
  const clusterPadLeft = 8; // extra padding so links don't overlap cluster text
  function clusterLeft(row, label, rawVal) {
    const d = findNode(row, label);
    return [d.x - d.rectW / 2 - clusterPadLeft, d.y + memberYOffset(d, rawVal)];
  }
  function clusterRight(row, label, rawVal) {
    const d = findNode(row, label);
    return [d.x + d.rectW / 2, d.y + memberYOffset(d, rawVal)];
  }

  // Orthogonal path with rounded corners
  const cornerR = 6;
  function orthoPath(pts, midYOverrides) {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      if (x1 === x2 || y1 === y2) {
        d += ` L${x2},${y2}`;
      } else {
        const midY = midYOverrides && midYOverrides[i - 1] != null
          ? midYOverrides[i - 1]
          : (y1 + y2) / 2;
        const dx = x2 > x1 ? 1 : -1;
        const cr = Math.min(cornerR, Math.abs(x2 - x1) / 2, Math.abs(midY - y1), Math.abs(y2 - midY));
        d += ` L${x1},${midY - cr}`;
        d += ` Q${x1},${midY} ${x1 + dx * cr},${midY}`;
        d += ` L${x2 - dx * cr},${midY}`;
        d += ` Q${x2},${midY} ${x2},${midY + cr}`;
        d += ` L${x2},${y2}`;
      }
    }
    return d;
  }

  // Compute flow path geometry
  function flowPathD(f) {
    const pts = [];
    const midYOverrides = {};
    let lastClusterBottomY = null;
    let pendingClusterExit = false;

    const stubLen = 14;
    f.path.forEach((label, i) => {
      const isCNode = isClusterNode(i, label);
      const rawVal = isCNode ? f.rawClusterVals.get(i) : null;

      if (i > 0) {
        if (isCNode) {
          const clusterNode = findNode(i, label);
          const clusterTopY = clusterNode.y + clusterNode.rectY;
          midYOverrides[pts.length - 1] =
            (pts[pts.length - 1][1] + clusterTopY) / 2;
          const lp = clusterLeft(i, label, rawVal);
          pts.push(lp);
          pts.push([lp[0] + stubLen, lp[1]]);
        } else {
          if (pendingClusterExit) {
            const targetTopY = nodeTop(i, label)[1];
            midYOverrides[pts.length - 1] =
              (lastClusterBottomY + targetTopY) / 2;
            pendingClusterExit = false;
          }
          pts.push(nodeTop(i, label));
        }
      }
      if (i < f.path.length - 1) {
        if (isCNode) {
          const lp = clusterLeft(i, label, rawVal);
          pts.push([lp[0] + stubLen, lp[1]]);
          pts.push(lp);
          const clusterNode = findNode(i, label);
          lastClusterBottomY = clusterNode.y + clusterNode.rectY + clusterNode.rectH;
          pendingClusterExit = true;
        } else {
          pts.push(nodeBottom(i, label));
        }
      }
    });
    return orthoPath(pts, midYOverrides);
  }

  // Draw flow lines
  const flowPaths = svg
    .append("g")
    .selectAll("path")
    .data(uniqueFlows)
    .join("path")
    .attr("d", flowPathD)
    .attr("fill", "none")
    .attr("stroke", (f) => groupColors[f.group - 1])
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0);

  // Draw nodes
  const nodeGroups = svg
    .append("g")
    .selectAll("g")
    .data(allNodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  // Invisible hit area for hover
  nodeGroups
    .append("rect")
    .attr("x", (d) => -d.rectW / 2)
    .attr("y", (d) => d.rectY)
    .attr("width", (d) => d.rectW)
    .attr("height", (d) => d.rectH)
    .attr("fill", "transparent");

  // Draw labels centered in the node area
  nodeGroups.each(function (d) {
    const multiLine = d.lines.length > 1;
    const el = d3.select(this).append("text")
      .attr("text-anchor", multiLine ? "start" : "middle")
      .attr("font-size", 14)
      .attr("fill", "#333");

    const textBlockH = (d.lines.length - 1) * lineH;
    const startY = -textBlockH / 2;
    const xOffset = multiLine ? -d.bbox.width / 2 : 0;

    d.lines.forEach((line, i) => {
      el.append("tspan")
        .text(line)
        .attr("x", xOffset)
        .attr("y", startY + i * lineH)
        .attr("dy", "0.35em");
    });
  });

  // Hover: highlight flows through a node
  const highlightColor = "#09FF00";
  nodeGroups
    .on("mouseenter", (_, d) => {
      const match = (f) => f.path[d.row] === d.label;
      flowPaths
        .attr("stroke-opacity", (f) => (match(f) ? 0.9 : 0))
        .attr("stroke", (f) => groupColors[f.group - 1])
        .attr("stroke-width", (f) => (match(f) ? 2 : 1));
      const matchingFlows = uniqueFlows.filter(match);
      nodeGroups.select("rect").attr("fill", function (nd) {
        const nodeFlows = matchingFlows.filter((f) => f.path[nd.row] === nd.label);
        if (nodeFlows.length === 0) return "transparent";
        // Use the color of the most common group among matching flows
        const counts = {};
        nodeFlows.forEach((f) => { counts[f.group] = (counts[f.group] || 0) + 1; });
        const topGroup = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        return groupColors[+topGroup - 1];
      });
    })
    .on("mouseleave", () => {
      flowPaths
        .attr("stroke-opacity", 0)
        .attr("stroke", (f) => groupColors[f.group - 1])
        .attr("stroke-width", 1);
      nodeGroups.select("rect").attr("fill", "transparent");
    });

  // Recompute layout on window resize
  window.addEventListener("resize", () => {
    width = appEl.clientWidth - margin.left - margin.right;
    height = appEl.clientHeight - padV;

    svgEl
      .attr("width", appEl.clientWidth)
      .attr("height", appEl.clientHeight - padV);

    computeLayout();

    nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
    flowPaths.attr("d", flowPathD);
  });
});
