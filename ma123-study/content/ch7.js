/* ===================================================================
   CHAPTER REVIEW — Ch 7: Eigenvalues, Eigenvectors & Diagonalization
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Final Review",
    lab: "Review — Ch 7: Eigenvalues & Diagonalization",
    book: "Hu et al. — §7.1–§7.3",
    lede: "Characteristic polynomial → eigenvalues → eigenvectors → diagonalization. The final chapter, and a prime source of final-exam questions (see §7.3 exercises).",
    pills: ["⏱ ≈ 65 min", "🎯 4 stages + boss", "📄 §7.2/§7.3 exercises"],
    sourceNote: "Sources: §7.2 Diagonalizability, §7.2/§7.3 exercises, textbook §7.",
    startLabel: "Start Stage A ›",
    doneTitle: "Ch 7 reviewed 🎓",
    doneText: "Eigenvalues, eigenvectors, and diagonalization are locked.",
  },
  stages: [
    { id: "A", name: "Eigenvalues", tagline: "det(A − λI) = 0", estMin: 16, sources: ["§7.1"],
      concept: { title: "Finding eigenvalues", cards: [
        card(`\\(\\lambda\\) is an eigenvalue if \\(A\\vec v=\\lambda\\vec v\\) for some nonzero \\(\\vec v\\). Find them from \\(\\det(A-\\lambda I)=0\\). For 2×2: \\(\\lambda^2-(\\text{tr})\\lambda+\\det=0\\).`),
        card(`Triangular/diagonal ⇒ eigenvalues are the diagonal entries. Sum of eigenvalues \\(=\\) trace; product \\(=\\det\\).`,
          { type: "diagonal", M: [[2, 5, 1], [0, -3, 4], [0, 0, 6]], phase: "diag" }),
        card(`Cubic char. polynomial: test integer factors of the constant term for a root, factor it out, solve the leftover quadratic (Example 7.2.13).`),
      ]},
      guided: { intro: "Two worked eigenvalue problems.", problems: [
        gp("§7.1", "2×2 eigenvalues", "Eigenvalues of \\(\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).", [[2, 1], [1, 2]],
          () => ({ steps: [ step("Char. poly", tex(`\\lambda^2-4\\lambda+3=0`)), step("Factor", tex(`(\\lambda-3)(\\lambda-1)=0\\Rightarrow\\lambda=3,1`)) ] })),
        gp("§7.2 Ex7", "Factor a cubic", "Factor \\(\\lambda^3-2\\lambda^2-\\lambda+2\\), given \\(\\lambda=-1\\) is a root.", null,
          () => ({ steps: [ step("Divide", tex(`=(\\lambda+1)(\\lambda^2-3\\lambda+2)`)), step("Factor quadratic", tex(`=(\\lambda+1)(\\lambda-1)(\\lambda-2)`) + " ⇒ \\(\\lambda=-1,1,2\\).") ] })),
      ]},
      practice: { intro: "No AI, no internet. (Largest eigenvalue.)", slots: [
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
        slot("Triangular eigenvalue", "§7.1", E.genEigenTriangular3),
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
      ]},
    },
    { id: "B", name: "Eigenvectors", tagline: "Null space of A − λI", estMin: 14, sources: ["§7.1"],
      concept: { title: "Eigenvectors & eigenspaces", cards: [
        card(`For each \\(\\lambda\\), solve \\((A-\\lambda I)\\vec v=\\vec 0\\) (row-reduce, read the null space). The <b>eigenspace</b> \\(E_\\lambda\\) is the span of those vectors; its dimension is the <b>geometric multiplicity</b> \\(g_\\lambda=n-\\text{rank}(A-\\lambda I)\\).`),
      ]},
      guided: { intro: "One worked eigenvector.", problems: [
        gp("§7.1", "Eigenvector for λ=3", "For \\(\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\), λ=3.", [[2, 1], [1, 2]],
          () => ({ steps: [ step("A − 3I", tex(`\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}`)), step("Reduce & read", tex(`v_1=v_2\\Rightarrow\\vec v=(1,1)`)) ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Rank of A−λI", "§7.1", E.genRankProblem),
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
      ]},
    },
    { id: "C", name: "Diagonalization", tagline: "P⁻¹AP = D", estMin: 18, sources: ["§7.2"],
      concept: { title: "Diagonalizing", cards: [
        card(`\\(A=PDP^{-1}\\): \\(P\\) = eigenvectors as columns, \\(D\\) = eigenvalues on the diagonal (matching order). Works iff there's a basis of eigenvectors ⇔ geometric multiplicities sum to \\(n\\). Quick win: \\(n\\) distinct eigenvalues ⇒ diagonalizable.`),
        card(`Fails when a repeated eigenvalue is deficient (\\(g_\\lambda<m_\\lambda\\)). Symmetric matrices are always diagonalizable. Diagonalizable ≠ invertible (independent properties).`),
        card(`Payoff: \\(A^k=PD^kP^{-1}\\) makes high powers trivial — this is how §7.3 computes \\((A-I)^{10}\\) and closed forms for recursive sequences.`),
      ]},
      guided: { intro: "One diagonalization + one failure.", problems: [
        gp("§7.2", "Diagonalize", "Diagonalize \\(\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).", [[2, 1], [1, 2]],
          () => ({ steps: [ step("Eigen-data", tex(`\\lambda=3(v=(1,1)),\\ \\lambda=1(v=(1,-1))`)), step("P, D", tex(`P=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix},D=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}`)) ] })),
        gp("Ex 7.2.18", "Not diagonalizable", "\\(\\begin{bmatrix}1&3&0\\\\0&1&0\\\\0&0&2\\end{bmatrix}\\).", [[1, 3, 0], [0, 1, 0], [0, 0, 2]],
          () => ({ steps: [ step("Eigenvalues", "λ=1 (mult 2), λ=2."), step("g₁", tex(`g_1=3-\\text{rank}(I-A)=1<2=m_1`)), step("Verdict", "Sum of geom. mult. \\(=2<3\\) ⇒ not diagonalizable.") ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Diagonalizable? (T/F)", "§7.2", tfBank("§7.2", [
          { s: "3 distinct real eigenvalues ⇒ diagonalizable.", a: true, why: "True (Thm 7.2.8)." },
          { s: "Every invertible matrix is diagonalizable.", a: false, why: "False — \\(\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}\\)." },
          { s: "Every symmetric matrix is diagonalizable.", a: true, why: "True (Thm 7.2.24)." },
          { s: "Diagonalizable iff sum of geometric multiplicities \\(=n\\).", a: true, why: "True (Thm 7.2.17)." },
          { s: "Fewer than \\(n\\) distinct eigenvalues ⇒ not diagonalizable.", a: false, why: "False — repeated eigenvalues can still have enough eigenvectors (e.g. \\(I\\))." },
        ])),
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
      ]},
    },
    { id: "D", name: "Applications", tagline: "Powers & polynomial eigenvalues", estMin: 12, sources: ["§7.3"],
      concept: { title: "Using eigenvalues", cards: [
        card(`If \\(\\lambda\\) is an eigenvalue of \\(A\\): \\(p(\\lambda)\\) is an eigenvalue of \\(p(A)\\), \\(\\lambda^k\\) of \\(A^k\\), and \\(1/\\lambda\\) of \\(A^{-1}\\) (when invertible). Same eigenvectors throughout.`),
        card(`\\((A-I)^{10}\\) via diagonalization: \\((A-I)^{10}=P(D-I)^{10}P^{-1}\\), and \\((D-I)^{10}\\) is just each \\((\\lambda-1)^{10}\\) on the diagonal (§7.3 Exercise 1).`),
      ]},
      guided: { intro: "Straight to the gauntlet.", problems: [
        gp("§7.2 Ex8", "Eigenvalues of a polynomial in A", "If λ=3 is an eigenvalue of \\(A\\), what eigenvalue does \\(A^2-A\\) get from it?", null,
          () => ({ steps: [ step("Apply p(λ)", tex(`p(\\lambda)=\\lambda^2-\\lambda=3^2-3=6`)), step("Answer", "6 is an eigenvalue of \\(A^2-A\\).") ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Eigenvalue algebra (T/F)", "§7.2", tfBank("§7.2", [
          { s: "λ=2 of \\(A\\) ⇒ λ=8 of \\(A^3\\).", a: true, why: "True (\\(\\lambda^3\\))." },
          { s: "λ=2 of invertible \\(A\\) ⇒ \\(\\tfrac12\\) of \\(A^{-1}\\).", a: true, why: "True (\\(1/\\lambda\\))." },
          { s: "Sum of eigenvalues = trace.", a: true, why: "True." },
        ])),
        slot("Triangular eigenvalue", "§7.1", E.genEigenTriangular3),
      ]},
    },
  ],
  interleave: {
    afterB: { title: "Interleave · Eigenvalues stay sharp", blurb: "Recompute while learning eigenvectors.", slots: [
      slot("2×2 eigenvalue", "review", E.genEigen2x2), slot("Rank", "review", E.genRankProblem),
    ]},
  },
  mock: { title: "Boss · Ch 7 mixed", blurb: "No AI, no internet.", slots: [
    slot("2×2 eigenvalue", "Ch7", E.genEigen2x2),
    slot("Triangular eigenvalue", "Ch7", E.genEigenTriangular3),
    slot("Diagonalizable? T/F", "Ch7", tfBank("§7.2", [
      { s: "3 distinct eigenvalues ⇒ diagonalizable.", a: true, why: "True." },
      { s: "Every invertible matrix is diagonalizable.", a: false, why: "False." },
    ])),
    slot("Rank", "Ch7", E.genRankProblem),
    slot("2×2 eigenvalue", "Ch7", E.genEigen2x2),
  ]},
};
