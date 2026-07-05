/* MOCK FINAL 5 — CLOSED BOOK · computation-heavy */
const E = Engine, { slot, tfBank, det3, det2, detTri } = H;
const tf = tfBank("mixed", [
  { s: "\\(\\det(kA)=k^n\\det A\\).", a: true, why: "True." },
  { s: "\\(AB=BA\\) for all square \\(A,B\\).", a: false, why: "False — matrix product isn't commutative." },
  { s: "Triangular matrix determinant = product of the diagonal.", a: true, why: "True." },
  { s: "\\(\\det(A^{-1})=1/\\det(A)\\).", a: true, why: "True." },
]);
const CURRICULUM = {
  meta: {
    course: "MA123 · Mock Final 5 of 6",
    lab: "Mock Final 5 — Closed Book (computation-heavy)",
    lede: "Closed book, timed, weighted toward <b>hand computation</b>: systems, determinants, matrix products, eigenvalues. Speed and accuracy under the clock.",
    pills: ["🚫 closed book", "⏱ timed", "🧮 computation heavy"],
    startLabel: "Read the rules ›", doneTitle: "Mock 5 done 🎓",
    doneText: "Computation speed drilled. One more: Mock 6.",
    how: ["Closed book.", "Timer runs — push your speed.", "Submit for a score.", "Full walkthrough + follow-up per miss."],
  },
  stages: [],
  exam: { title: "Mock Final 5", blurb: "Closed book · computation heavy.", timed: true, timeLimitMin: 40, notesAllowed: false, slots: [
    slot("Solve a system", "§1", E.genSystemSolve),
    slot("3×3 determinant", "§4", det3),
    slot("Triangular determinant", "§4", detTri),
    slot("Matrix product entry", "§3", E.genMatMulEntry),
    slot("2×2 eigenvalue", "§7", E.genEigen2x2),
    slot("Rank", "§5–6", E.genRankProblem),
    slot("Dot product", "§2.1", E.genDot),
    slot("Cross product", "§2.2", E.genCrossComponent),
    slot("2×2 determinant", "§4", det2),
    slot("Concept T/F", "mixed", tf),
  ]},
};
