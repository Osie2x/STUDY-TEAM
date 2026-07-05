/* ===================================================================
   START HERE — MA123 Study Plan & Index (links to every guide)
=================================================================== */
const E = Engine;
const L = (href, txt) => `<a class="btn primary idx-link" href="${href}">${txt}</a>`;
const Lg = (href, txt) => `<a class="btn ghost idx-link" href="${href}">${txt}</a>`;

const CURRICULUM = {
  meta: {
    course: "MA123 · Intro Linear Algebra",
    lab: "📚 Your Complete MA123 Study Hub",
    book: "Introductory Linear Algebra, Hu et al.",
    lede: "Everything for the rest of MA123 — the four remaining labs, full chapter reviews, and six mock finals — each its own interactive, by-hand guide. Final exam: <b>Saturday Aug 8, 8:30 a.m., LH1009.</b>",
    pills: ["🧪 4 lab guides", "📖 4 chapter reviews", "📝 6 mock finals", "🎯 same engine as the Lab 6 app"],
    startLabel: "You're all set — pick a guide above ▲",
    how: [
      "Every guide is its own page — <b>download the whole folder</b> and open any file by double-clicking.",
      "All practice is <b>no-AI, no-internet, by hand</b>; miss a question and it reteaches, then hands you a fresh one.",
      "Misses are tracked per guide (bottom-right); progress saves automatically.",
      "Use the <b>⌂ Index</b> button in any guide's top bar to return here.",
    ],
    doneTitle: "Go get it 💪",
    doneText: "Pick the next guide and start.",
    body: `
      <div class="idx-block"><h3>① Priority — Lab 7 (due July 6)</h3>
        <p>Start today. Rebuilds your RREF (you flagged it rusty) + span, independence, rank — exact Fall-2025 Lab 7 style.</p>
        <div class="idx-links">${L("Lab7-Span-Independence-Rank.html", "▶ Lab 7 — Span, Independence & Rank")}</div></div>

      <div class="idx-block"><h3>② Remaining labs (Jul 13 / 20 / 27)</h3>
        <div class="idx-links">
          ${L("Lab8-Bases-Dimension.html", "▶ Lab 8 — Basis & Dimension")}
          ${L("Lab9-Matrix-Transformations.html", "▶ Lab 9 — Matrix Transformations")}
          ${L("Lab10-Eigenvalues-Diagonalization.html", "▶ Lab 10 — Eigenvalues & Diagonalization")}
        </div></div>

      <div class="idx-block"><h3>③ Chapter reviews (final-exam prep)</h3>
        <p>Ch 1–3.5 feels rusty, so these carry the whole course. Do Ch 1–2 & 3–4 to shake off rust, then Ch 5–6 & 7 (the post-midterm core the final emphasizes).</p>
        <div class="idx-links">
          ${L("Review-Ch1-2-Systems-Vectors.html", "▶ Ch 1–2 — Systems & Vectors")}
          ${L("Review-Ch3-4-Matrices-Determinants.html", "▶ Ch 3–4 — Matrices & Determinants")}
          ${L("Review-Ch5-6-Subspaces-Bases.html", "▶ Ch 5–6 — Subspaces & Bases")}
          ${L("Review-Ch7-Eigen-Diagonalization.html", "▶ Ch 7 — Eigenvalues & Diagonalization")}
        </div></div>

      <div class="idx-block"><h3>④ Mock finals (do in order)</h3>
        <p>#1 shows every solution (learn the map). #2 open-notes + timer. #3–6 closed-book, timed, graded — target your misses on the next one.</p>
        <div class="idx-links">
          ${L("Mock-Final-1-Walkthrough.html", "▶ Mock 1 — Walkthrough")}
          ${Lg("Mock-Final-2-Open-Notes-Timed.html", "Mock 2 — Open Notes + Timer")}
          ${Lg("Mock-Final-3-Closed-Book.html", "Mock 3 — Closed Book")}
          ${Lg("Mock-Final-4-Closed-Book.html", "Mock 4 — Ch 5–7 core")}
          ${Lg("Mock-Final-5-Closed-Book.html", "Mock 5 — Computation")}
          ${Lg("Mock-Final-6-Closed-Book.html", "Mock 6 — Final boss")}
        </div></div>

      <div class="idx-block tip"><h3>Suggested rhythm</h3>
        <p>A lab guide 1–2 days before each lab; a chapter review whenever you have a longer block; then one mock final per day (1→6) in the final week. Re-run whatever the wrong-answer tracker flags before moving on. Little and often beats one big cram.</p></div>
    `,
  },
  stages: [],
};
