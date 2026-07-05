/* MOCK FINAL 4 — CLOSED BOOK · emphasis on Ch 5–7 (post-midterm core) */
const E = Engine, { slot, tfBank, det3 } = H;
const tf = tfBank("Ch5–7", [
  { s: "3 distinct eigenvalues ⇒ diagonalizable.", a: true, why: "True." },
  { s: "Every invertible matrix is diagonalizable.", a: false, why: "False." },
  { s: "Diagonalizable iff sum of geometric multiplicities \\(=n\\).", a: true, why: "True (7.2.17)." },
  { s: "A set containing \\(\\vec0\\) is dependent.", a: true, why: "True." },
  { s: "λ=2 of \\(A\\) ⇒ λ=8 of \\(A^3\\).", a: true, why: "True." },
  { s: "Removing a vector from an independent set keeps it independent.", a: true, why: "True." },
]);
const CURRICULUM = {
  meta: {
    course: "MA123 · Mock Final 4 of 6",
    lab: "Mock Final 4 — Closed Book (Ch 5–7 core)",
    lede: "Closed book, timed, weighted toward the <b>post-midterm core</b> the final most likely emphasizes: span, independence, rank, eigenvalues, and diagonalization.",
    pills: ["🚫 closed book", "⏱ timed", "🎯 Ch 5–7 heavy"],
    startLabel: "Read the rules ›", doneTitle: "Mock 4 done 🎓",
    doneText: "Post-midterm core drilled. Onto Mock 5.",
    how: ["Closed book.", "Timer runs.", "Submit for a score.", "Full walkthrough + follow-up per miss."],
  },
  stages: [],
  exam: { title: "Mock Final 4", blurb: "Closed book · Ch 5–7 heavy.", timed: true, timeLimitMin: 40, notesAllowed: false, slots: [
    slot("Independence", "§5.2", E.genIndepProblem),
    slot("Span membership", "§5.2", E.genSpanMembership),
    slot("Rank / nullity", "§5–6", E.genRankProblem),
    slot("2×2 eigenvalue", "§7", E.genEigen2x2),
    slot("Triangular eigenvalue", "§7", E.genEigenTriangular3),
    slot("Diagonalizability", "§7.2", tf),
    slot("Rank of A−λI", "§7.1", E.genRankProblem),
    slot("3×3 determinant", "§4", det3),
    slot("Independence", "§5.2", E.genIndepProblem),
    slot("Concept T/F", "Ch5–7", tf),
  ]},
};
