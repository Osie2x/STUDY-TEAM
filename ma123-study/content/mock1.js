/* ===================================================================
   MOCK FINAL 1 — GUIDED WALKTHROUGH
   Every question type is fully solved first (problem-type breakdown +
   the logic/implications), THEN you immediately get a similar one to try.
   Baseline format from the provided mock finals (F24 / W25 / S25).
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M, det3, det2, detTri } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Mock Final 1 of 6",
    lab: "Mock Final 1 — Guided Walkthrough",
    book: "Format from F24 / W25 / S25 mock finals",
    lede: "The teaching mock. Each exam question type is <b>fully solved</b> with the reasoning spelled out, then you immediately practice a similar one. Focus on Ch 5–7 (post-midterm) with Ch 1–4 carried in. No timer — this one is for learning the map.",
    pills: ["📖 solutions shown", "🎯 one practice per type", "🧠 whole-course map"],
    sourceNote: "Sources: mock-ma123-final-exam-f24 / w25 / s25, past midterm, textbook.",
    startLabel: "Start Q1 walkthrough ›",
    doneTitle: "Mock 1 complete 🎓",
    doneText: "You've seen every question type solved and tried one of each. Next: Mock Final 2 (open notes + timer).",
    how: [
      "Each <b>Learn</b> card explains the question type and the logic/implications the exam is testing.",
      "Each <b>Guided</b> shows the full worked solution — every line.",
      "Each <b>Practice</b> gives you a fresh similar question right away.",
      "Wrong answers are retaught and replaced until locked; misses go to the tracker.",
    ],
  },
  stages: [
    { id: "A", name: "Q-type: Systems / RREF", tagline: "Row-reduce & interpret", estMin: 12, sources: ["§1"],
      concept: { title: "Question type 1 — solving a system", cards: [
        card(`<b>What it tests:</b> row-reduce an augmented matrix, then interpret. The implication chain: pivot in every variable column ⇒ unique solution; a free variable ⇒ infinitely many; a contradiction row \\([0\\cdots0\\mid c\\neq0]\\) ⇒ none.`),
        card(`<b>Watch for:</b> the exam loves “for which value of a parameter is the system consistent / has infinitely many solutions.” That's a rank comparison on \\(A\\) vs \\([A\\mid\\vec b]\\).`),
      ]},
      guided: { intro: "Full solution, every row op.", problems: [
        gp("Mock final", "Solve a 3×3 system", "Row-reduce for the unique solution.", null,
          () => E.rrefSolutionSteps([[1, 2, -1, 3], [2, 1, 1, 3], [1, -1, 2, 0]], { coeffCols: 3, splitAt: 3, tail: () => "Identity on the left ⇒ unique solution read off the last column." })),
      ]},
      practice: { intro: "Your turn — no AI, no internet.", slots: [ slot("Solve a system", "Mock", E.genSystemSolve), slot("Rank", "Mock", E.genRankProblem) ] },
    },
    { id: "B", name: "Q-type: Determinant", tagline: "Cofactor / triangular / properties", estMin: 12, sources: ["§4"],
      concept: { title: "Question type 2 — determinant", cards: [
        card(`<b>What it tests:</b> compute a determinant efficiently and use it. Implication: \\(\\det\\neq0\\iff\\) invertible \\(\\iff\\) independent columns \\(\\iff\\) rank \\(=n\\). A determinant question is often secretly an invertibility question.`),
        card(`<b>Watch for:</b> the \\(\\det(kA)=k^n\\det A\\) trap and using row operations to shortcut a big determinant to triangular form.`),
      ]},
      guided: { intro: "Full 3×3 by cofactor.", problems: [
        gp("Mock final", "3×3 determinant", "Cofactor-expand along row 1.", [[3, 1, 0], [-2, -4, 3], [5, 4, -2]],
          () => E.steps3x3([[3, 1, 0], [-2, -4, 3], [5, 4, -2]], 0)),
      ]},
      practice: { intro: "Your turn — no AI, no internet.", slots: [ slot("3×3 determinant", "Mock", det3), slot("Triangular determinant", "Mock", detTri) ] },
    },
    { id: "C", name: "Q-type: Span / Independence", tagline: "Rank decides everything", estMin: 12, sources: ["§5.2"],
      concept: { title: "Question type 3 — independence & span", cards: [
        card(`<b>What it tests:</b> put vectors as columns, row-reduce, compare rank to the count. rank \\(=k\\) ⇒ independent; consistent augmented system ⇒ \\(\\vec w\\) in the span. Implication: independence = uniqueness = (if square) invertibility.`),
        card(`<b>Watch for:</b> “without further work” follow-ups — a subset of an independent set stays independent; \\(k>n\\) is automatically dependent.`),
      ]},
      guided: { intro: "Full independence solution.", problems: [
        gp("Fall-2025 Lab 7", "Independent?", "Columns \\((0,2,-2,3),(1,-1,2,4),(3,2,-1,0)\\).", [[0, 1, 3], [2, -1, 2], [-2, 2, -1], [3, 4, 0]],
          () => E.rrefSolutionSteps([[0, 1, 3], [2, -1, 2], [-2, 2, -1], [3, 4, 0]], { tail: (r) => `rank \\(=${r.rank}=k\\) ⇒ independent.` })),
      ]},
      practice: { intro: "Your turn — no AI, no internet.", slots: [ slot("Independent?", "Mock", E.genIndepProblem), slot("Span membership", "Mock", E.genSpanMembership) ] },
    },
    { id: "D", name: "Q-type: Eigenvalues", tagline: "Characteristic polynomial", estMin: 12, sources: ["§7.1"],
      concept: { title: "Question type 4 — eigenvalues", cards: [
        card(`<b>What it tests:</b> \\(\\det(A-\\lambda I)=0\\). For 2×2, \\(\\lambda^2-(\\text{tr})\\lambda+\\det=0\\); triangular ⇒ diagonal entries. Implication: sum of eigenvalues = trace, product = det.`),
      ]},
      guided: { intro: "Full 2×2 eigenvalue solution.", problems: [
        gp("Mock final", "2×2 eigenvalues", "Eigenvalues of \\(\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).", [[2, 1], [1, 2]],
          () => ({ steps: [ step("Char. poly", tex(`\\lambda^2-4\\lambda+3=0`)), step("Solve", tex(`(\\lambda-3)(\\lambda-1)=0\\Rightarrow\\lambda=3,1`)) ] })),
      ]},
      practice: { intro: "Your turn — no AI, no internet.", slots: [ slot("2×2 eigenvalue", "Mock", E.genEigen2x2), slot("Triangular eigenvalue", "Mock", E.genEigenTriangular3) ] },
    },
    { id: "E", name: "Q-type: Diagonalizability", tagline: "Basis of eigenvectors?", estMin: 12, sources: ["§7.2"],
      concept: { title: "Question type 5 — diagonalizability", cards: [
        card(`<b>What it tests:</b> is there a basis of eigenvectors? \\(n\\) distinct eigenvalues ⇒ yes. Repeated eigenvalue: check \\(g_\\lambda=m_\\lambda\\). Symmetric ⇒ always yes. Implication: diagonalizable ⇒ \\(A^k=PD^kP^{-1}\\).`),
      ]},
      guided: { intro: "Full True/False reasoning.", problems: [
        gp("Mock final", "Is it diagonalizable?", "Is \\(\\begin{bmatrix}1&3&0\\\\0&1&0\\\\0&0&2\\end{bmatrix}\\) diagonalizable?", [[1, 3, 0], [0, 1, 0], [0, 0, 2]],
          () => ({ steps: [ step("Eigenvalues", "λ=1 (mult 2), λ=2."), step("Check g₁", tex(`g_1=3-\\text{rank}(I-A)=1<2`)), step("Verdict", "No — deficient eigenvalue.") ] })),
      ]},
      practice: { intro: "Your turn — no AI, no internet.", slots: [ slot("Diagonalizable? (T/F)", "Mock", tfBank("§7.2", [
        { s: "3 distinct eigenvalues ⇒ diagonalizable.", a: true, why: "True (Thm 7.2.8)." },
        { s: "Every invertible matrix is diagonalizable.", a: false, why: "False — \\(\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}\\)." },
        { s: "Every symmetric matrix is diagonalizable.", a: true, why: "True (Thm 7.2.24)." },
      ])) ] },
    },
    { id: "F", name: "Q-type: Transformations & Vectors", tagline: "Ax, dot, cross", estMin: 12, sources: ["§2–3"],
      concept: { title: "Question type 6 — transformations & vector geometry", cards: [
        card(`<b>What it tests:</b> apply \\(T(\\vec x)=A\\vec x\\), compose (= multiply matrices, order matters), and vector geometry (dot for angle/perpendicular, cross for a normal/area). Carried-in from the midterm but fair game.`),
      ]},
      guided: { intro: "Full application.", problems: [
        gp("Mock final", "Image under T", "Apply \\(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\) to \\((5,-1)\\).", [[1, 2], [3, 4]],
          () => ({ steps: [ step("Multiply", tex(`\\begin{bmatrix}1(5)+2(-1)\\\\3(5)+4(-1)\\end{bmatrix}=\\begin{bmatrix}3\\\\11\\end{bmatrix}`)) ] })),
      ]},
      practice: { intro: "Your turn — no AI, no internet.", slots: [ slot("Image component", "Mock", E.genTransformImage), slot("Dot product", "Mock", E.genDot), slot("Cross product", "Mock", E.genCrossComponent) ] },
    },
  ],
  mock: { title: "Boss · Mock 1 full mix", blurb: "One shuffled pass over every type. No AI, no internet.", slots: [
    slot("Solve a system", "Mock", E.genSystemSolve),
    slot("3×3 determinant", "Mock", det3),
    slot("Independent?", "Mock", E.genIndepProblem),
    slot("2×2 eigenvalue", "Mock", E.genEigen2x2),
    slot("Image component", "Mock", E.genTransformImage),
    slot("Rank", "Mock", E.genRankProblem),
  ]},
};
