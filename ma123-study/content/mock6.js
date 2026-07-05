/* MOCK FINAL 6 — CLOSED BOOK · full-course hardest mix + concept edges */
const E = Engine, { slot, tfBank, det3, detTri } = H;
const tf = tfBank("edges", [
  { s: "\\(\\det A=0\\) ⇒ \\(A\\vec x=\\vec b\\) has infinitely many solutions.", a: false, why: "False — could have none; depends on \\(\\vec b\\)." },
  { s: "If \\(A\\) is not diagonalizable, it has fewer than \\(n\\) distinct real eigenvalues.", a: true, why: "True (contrapositive of Thm 7.2.8)." },
  { s: "A dependent set must contain the zero vector.", a: false, why: "False." },
  { s: "\\(\\det(A+B)=\\det A+\\det B\\).", a: false, why: "False — no such rule." },
  { s: "If columns of square \\(A\\) are dependent, \\(\\det A=0\\).", a: true, why: "True." },
  { s: "Sum of eigenvalues = trace; product = det.", a: true, why: "True." },
  { s: "\\(k>n\\) vectors in \\(\\mathbb R^n\\) are always dependent.", a: true, why: "True." },
]);
const CURRICULUM = {
  meta: {
    course: "MA123 · Mock Final 6 of 6",
    lab: "Mock Final 6 — Closed Book (final boss)",
    lede: "The last one. Closed book, timed, hardest full-course mix with the nastiest concept edges. If you clear this cleanly, you're ready for Aug 8.",
    pills: ["🚫 closed book", "⏱ timed", "🔥 hardest mix"],
    startLabel: "Read the rules ›", doneTitle: "All 6 mocks done 🏆",
    doneText: "You've completed the full mock-final sequence. Re-drill any tracker items, then rest.",
    how: ["Closed book.", "Timer runs.", "Submit for a score.", "Full walkthrough + follow-up per miss."],
  },
  stages: [],
  exam: { title: "Mock Final 6", blurb: "Closed book · final boss.", timed: true, timeLimitMin: 45, notesAllowed: false, slots: [
    slot("Solve a system", "§1", E.genSystemSolve),
    slot("3×3 determinant", "§4", det3),
    slot("Independence", "§5.2", E.genIndepProblem),
    slot("Span membership", "§5.2", E.genSpanMembership),
    slot("2×2 eigenvalue", "§7", E.genEigen2x2),
    slot("Diagonalizability edge", "§7.2", tf),
    slot("Rank / nullity", "§5–6", E.genRankProblem),
    slot("Matrix transformation", "§3", E.genTransformImage),
    slot("Triangular determinant", "§4", detTri),
    slot("Concept edge T/F", "edges", tf),
  ]},
};
