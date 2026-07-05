/* MOCK FINAL 2 — OPEN NOTES + TIMER (submit, get graded, follow-ups on misses) */
const E = Engine, { slot, tfBank, det3, det2, detTri } = H;
const tfPool = tfBank("mixed", [
  { s: "\\(\\det(2A)=2\\det(A)\\) for \\(n\\times n\\) \\(A\\).", a: false, why: "False: \\(2^n\\det A\\)." },
  { s: "3 distinct eigenvalues ⇒ diagonalizable.", a: true, why: "True (Thm 7.2.8)." },
  { s: "5 vectors in \\(\\mathbb R^4\\) are dependent.", a: true, why: "True (\\(k>n\\))." },
  { s: "\\(\\vec a\\cdot\\vec b=0\\) ⇒ perpendicular.", a: true, why: "True." },
  { s: "Every invertible matrix is diagonalizable.", a: false, why: "False." },
  { s: "\\(\\det A=0\\) ⇒ infinitely many solutions to \\(A\\vec x=\\vec b\\).", a: false, why: "False — could be none." },
  { s: "rank + nullity = number of columns.", a: true, why: "True." },
]);
const CURRICULUM = {
  meta: {
    course: "MA123 · Mock Final 2 of 6",
    lab: "Mock Final 2 — Open Notes + Timer",
    lede: "Exam conditions, gentler: <b>notes allowed</b>, but a <b>timer runs</b> and you <b>submit</b> for a graded score report. Everything you miss gets a full walkthrough plus a follow-up question.",
    pills: ["📖 notes allowed", "⏱ timed", "📊 graded + follow-ups"],
    startLabel: "Read the rules ›",
    doneTitle: "Mock 2 done 🎓",
    doneText: "You've had a graded, open-notes run. Next: Mock 3 — closed book.",
    how: ["Notes are allowed for this one.", "A timer runs (target below).", "Answer all, then see your score.", "Each miss: full solution + a follow-up to lock it in."],
  },
  stages: [],
  exam: {
    title: "Mock Final 2", blurb: "Open notes · timed · graded.", timed: true, timeLimitMin: 40, notesAllowed: true,
    slots: [
      slot("Solve a system", "§1", E.genSystemSolve),
      slot("3×3 determinant", "§4", det3),
      slot("Independence", "§5.2", E.genIndepProblem),
      slot("Span membership", "§5.2", E.genSpanMembership),
      slot("Rank / nullity", "§5–6", E.genRankProblem),
      slot("2×2 eigenvalue", "§7", E.genEigen2x2),
      slot("Triangular eigenvalue", "§7", E.genEigenTriangular3),
      slot("Diagonalizability", "§7.2", tfPool),
      slot("Matrix transformation", "§3", E.genTransformImage),
      slot("Concept T/F", "mixed", tfPool),
    ],
  },
};
