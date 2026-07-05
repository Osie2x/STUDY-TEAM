/* Build single-file HTML bundles: framework + one content module each.
   Run: node build.js   (from ma123-study/)  */
const fs = require("fs");
const path = require("path");

const FW = "framework";
const read = (p) => fs.readFileSync(p, "utf8");
const css = read(path.join(FW, "styles.css"));
const engine = read(path.join(FW, "engine.js"));
const engineLA = read(path.join(FW, "engine-la.js"));
const helpers = read(path.join(FW, "content-helpers.js"));
const app = read(path.join(FW, "app.js"));

// content module  ->  output filename + page <title>
const TARGETS = [
  ["lab7.js", "Lab7-Span-Independence-Rank.html", "MA123 Lab 7 — Span, Independence & Rank"],
  ["lab8.js", "Lab8-Bases-Dimension.html", "MA123 Lab 8 — Basis, Dimension & Rank–Nullity"],
  ["lab9.js", "Lab9-Matrix-Transformations.html", "MA123 Lab 9 — Matrix Transformations"],
  ["lab10.js", "Lab10-Eigenvalues-Diagonalization.html", "MA123 Lab 10 — Eigenvalues & Diagonalization"],
  ["ch12.js", "Review-Ch1-2-Systems-Vectors.html", "MA123 Review — Ch 1–2 (Systems & Vectors)"],
  ["ch34.js", "Review-Ch3-4-Matrices-Determinants.html", "MA123 Review — Ch 3–4 (Matrices & Determinants)"],
  ["ch56.js", "Review-Ch5-6-Subspaces-Bases.html", "MA123 Review — Ch 5–6 (Subspaces & Bases)"],
  ["ch7.js", "Review-Ch7-Eigen-Diagonalization.html", "MA123 Review — Ch 7 (Eigenvalues & Diagonalization)"],
  ["mock1.js", "Mock-Final-1-Walkthrough.html", "MA123 Mock Final 1 — Guided Walkthrough"],
  ["mock2.js", "Mock-Final-2-Open-Notes-Timed.html", "MA123 Mock Final 2 — Open Notes + Timer"],
  ["mock3.js", "Mock-Final-3-Closed-Book.html", "MA123 Mock Final 3 — Closed Book"],
  ["mock4.js", "Mock-Final-4-Closed-Book.html", "MA123 Mock Final 4 — Closed Book"],
  ["mock5.js", "Mock-Final-5-Closed-Book.html", "MA123 Mock Final 5 — Closed Book"],
  ["mock6.js", "Mock-Final-6-Closed-Book.html", "MA123 Mock Final 6 — Closed Book"],
  ["index.js", "00-START-HERE-Study-Plan.html", "MA123 — Study Plan & Index"],
];

function shell(title, content) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
<style>
${css}
</style>
<script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]]},svg:{fontCache:"global"},options:{enableMenu:false}};</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</head><body>
<header class="topbar">
  <div class="brand"><span class="brand-mark">MA<br>123</span>
    <span class="brand-text"><b>MA123 Study</b><small>Intro Linear Algebra · Hu et al.</small></span></div>
  <div class="topbar-actions"><a class="btn tiny ghost" href="00-START-HERE-Study-Plan.html">⌂ Index</a>
    <button id="reset-progress" class="btn tiny ghost" title="Reset progress">↺ Reset</button></div>
</header>
<div class="layout">
  <aside class="sidebar"><div class="sidebar-title">Your path</div>
    <nav id="stage-map" class="stage-map"></nav>
    <div class="sidebar-foot">Click any step to jump. Recommended order is top → bottom.</div></aside>
  <main id="main" class="content"></main>
</div>
<div id="tracker" class="tracker">
  <button id="tracker-toggle" class="tracker-toggle">⚠️ Wrong-Answer Tracker <span id="tracker-count" class="tracker-badge">0</span></button>
  <div class="tracker-card"><div class="tracker-head"><span>Concepts to re-drill</span>
    <button id="tracker-clear" class="btn tiny ghost">clear</button></div>
    <div id="tracker-body" class="tracker-body"></div></div>
</div>
<script>
//<![CDATA[
${engine}
//]]>
</script>
<script>
//<![CDATA[
${engineLA}
//]]>
</script>
<script>
//<![CDATA[
${helpers}
//]]>
</script>
<script>
//<![CDATA[
${content}
//]]>
</script>
<script>
//<![CDATA[
${app}
//]]>
</script>
</body></html>`;
}

let built = 0;
for (const [src, out, title] of TARGETS) {
  const p = path.join("content", src);
  if (!fs.existsSync(p)) { console.log("skip (missing): " + src); continue; }
  const content = read(p);
  fs.writeFileSync(path.join("dist", out), shell(title, content));
  built++;
  console.log("built dist/" + out);
}
console.log(`\n${built} file(s) built.`);
