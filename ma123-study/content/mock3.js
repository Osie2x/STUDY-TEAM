/* MOCK FINAL 3 — CLOSED BOOK (timed, graded, follow-ups) */
const E = Engine, { slot, tfBank, det3, detTri } = H;
const tf = tfBank("mixed", [
  { s: "A homogeneous system's solution set is a subspace.", a: true, why: "True." },
  { s: "\\(\\det(A^T)=\\det(A)\\).", a: true, why: "True." },
  { s: "Every symmetric matrix is diagonalizable.", a: true, why: "True (7.2.24)." },
  { s: "2 vectors can span \\(\\mathbb R^3\\).", a: false, why: "False." },
  { s: "Swapping two rows flips the sign of the determinant.", a: true, why: "True." },
  { s: "If rank\\(=k\\) (k columns), columns are independent.", a: true, why: "True." },
]);
const CURRICULUM = {
  meta: {
    course: "MA123 · Mock Final 3 of 6",
    lab: "Mock Final 3 — Closed Book",
    lede: "Real conditions now: <b>no notes, no AI, no internet.</b> Timer on, submit for a graded report, full walkthrough + follow-up on every miss. Whatever you miss here, target it before Mock 4.",
    pills: ["🚫 closed book", "⏱ timed", "📊 graded"],
    startLabel: "Read the rules ›", doneTitle: "Mock 3 done 🎓",
    doneText: "Closed-book run complete. Re-drill your misses, then Mock 4.",
    how: ["Closed book — nothing but paper and brain.", "Timer runs.", "Submit for a score.", "Each miss: full solution + follow-up."],
  },
  stages: [],
  exam: { title: "Mock Final 3", blurb: "Closed book · timed.", timed: true, timeLimitMin: 40, notesAllowed: false, slots: [
    slot("Solve a system", "§1", E.genSystemSolve),
    slot("Rank", "§5–6", E.genRankProblem),
    slot("3×3 determinant", "§4", det3),
    slot("Independence", "§5.2", E.genIndepProblem),
    slot("Span membership", "§5.2", E.genSpanMembership),
    slot("2×2 eigenvalue", "§7", E.genEigen2x2),
    slot("Diagonalizability T/F", "§7.2", tf),
    slot("Matrix product entry", "§3", E.genMatMulEntry),
    slot("Cross product", "§2.2", E.genCrossComponent),
    slot("Concept T/F", "mixed", tf),
  ]},
};
