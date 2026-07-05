/* ===================================================================
   LAB 10 PREP — Eigenvalues, Eigenvectors & Diagonalization (Ch 7)
   Scope: §7.1–7.3 (characteristic polynomial, eigenvalues/vectors,
   diagonalizability). Predicted lab topic — the term's final chapter.
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Lab 10 Prep",
    lab: "Lab 10 — Eigenvalues & Diagonalization (Ch 7)",
    book: "Hu et al. — §7.1–§7.3",
    lede: "The course finale. Find eigenvalues from the characteristic polynomial, find eigenvectors from the null space of \\(A-\\lambda I\\), and decide diagonalizability. This is predicted scope — the term's last chapter.",
    pills: ["⏱ ≈ 60 min", "🎯 4 stages + boss", "📄 Source: §7.2/§7.3 exercises"],
    sourceNote: "Source: <b>Section_7.2_Diagonalizability.md</b>, §7.2/§7.3 exercises, textbook §7.",
    startLabel: "Start Stage A ›",
    doneTitle: "Lab 10 locked 🎓",
    doneText: "You can compute eigenvalues, test diagonalizability, and explain algebraic vs geometric multiplicity.",
  },
  stages: [
    { id: "A", name: "Eigenvalues", tagline: "Roots of the characteristic polynomial", estMin: 16, sources: ["§7.1"],
      concept: { title: "What eigenvalues are and how to find them", cards: [
        card(`\\(\\lambda\\) is an <b>eigenvalue</b> of \\(A\\) if \\(A\\vec v=\\lambda\\vec v\\) for some <b>nonzero</b> \\(\\vec v\\) (the eigenvector). Geometrically: \\(A\\) just <b>stretches</b> \\(\\vec v\\) by \\(\\lambda\\), no turning.`),
        card(`Find them from the <b>characteristic polynomial</b>: \\(\\det(A-\\lambda I)=0\\). For a 2×2, this is always \\(\\lambda^2-(\\text{tr}A)\\lambda+\\det A=0\\) — trace is the diagonal sum, det is \\(ad-bc\\).`),
        card(`Triangular shortcut: for any triangular (or diagonal) matrix, the eigenvalues are exactly the <b>diagonal entries</b>. No polynomial needed.`,
          { type: "diagonal", M: [[3, 1, 2], [0, -1, 4], [0, 0, 5]], phase: "diag" }),
        card(`For a cubic characteristic polynomial, test the integer factors of the constant term (\\(\\pm1,\\pm2,\\dots\\)) to find one root, then factor it out and solve the leftover quadratic (textbook Example 7.2.13).`),
      ]},
      guided: { intro: "Two worked eigenvalue problems.", problems: [
        gp("§7.1", "2×2 eigenvalues", "Find the eigenvalues of \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).", [[2, 1], [1, 2]],
          () => ({ steps: [
            step("Characteristic polynomial", tex(`\\det(A-\\lambda I)=\\lambda^2-(\\text{tr})\\lambda+\\det=\\lambda^2-4\\lambda+3`)),
            step("Factor / solve", tex(`\\lambda^2-4\\lambda+3=(\\lambda-3)(\\lambda-1)=0`)),
            step("Eigenvalues", tex(`\\lambda=3,\\ 1`) + "Two distinct real eigenvalues."),
          ] })),
        gp("Example 7.2.9", "Triangular eigenvalues", "Eigenvalues of \\(\\begin{bmatrix}-1&2&4\\\\0&3&1\\\\0&0&5\\end{bmatrix}\\).", [[-1, 2, 4], [0, 3, 1], [0, 0, 5]],
          () => ({ steps: [
            step("Triangular shortcut", "Eigenvalues are the diagonal entries.", { type: "diagonal", M: [[-1, 2, 4], [0, 3, 1], [0, 0, 5]], phase: "diag" }),
            step("Read off", tex(`\\lambda=-1,\\ 3,\\ 5`) + "Three distinct ⇒ diagonalizable (Thm 7.2.8)."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet. (Largest eigenvalue.)", slots: [
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
        slot("Triangular eigenvalue", "§7.1", E.genEigenTriangular3),
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
      ]},
    },
    { id: "B", name: "Eigenvectors", tagline: "Null space of A − λI", estMin: 14, sources: ["§7.1"],
      concept: { title: "Finding eigenvectors and eigenspaces", cards: [
        card(`For each eigenvalue \\(\\lambda\\), the eigenvectors solve \\((A-\\lambda I)\\vec v=\\vec 0\\). So you build \\(A-\\lambda I\\), row-reduce, and read off the null space — the same RREF skill from Lab 7.`),
        card(`The <b>eigenspace</b> \\(E_\\lambda\\) is the span of those eigenvectors. Its dimension is the <b>geometric multiplicity</b> \\(g_\\lambda=n-\\text{rank}(A-\\lambda I)\\) — the number of free variables.`),
      ]},
      guided: { intro: "One worked eigenvector.", problems: [
        gp("§7.1", "Eigenvector for λ=3", "For \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\), find an eigenvector for \\(\\lambda=3\\).", [[2, 1], [1, 2]],
          () => ({ steps: [
            step("Form A − 3I", tex(`A-3I=\\begin{bmatrix}2-3&1\\\\1&2-3\\end{bmatrix}=\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}`)),
            step("Reduce", tex(`\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}\\to\\begin{bmatrix}1&-1\\\\0&0\\end{bmatrix}`) + "So \\(v_1=v_2\\), one free variable."),
            step("Eigenvector", tex(`\\vec v=\\begin{bmatrix}1\\\\1\\end{bmatrix}`) + "Any nonzero multiple works. \\(g_3=1\\)."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet. (Rank of A−λI tells geometric multiplicity.)", slots: [
        slot("Rank (for eigenspace dim)", "§7.1", E.genRankProblem),
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
      ]},
    },
    { id: "C", name: "Diagonalization", tagline: "P and D such that P⁻¹AP = D", estMin: 16, sources: ["§7.2"],
      concept: { title: "When and how to diagonalize", cards: [
        card(`\\(A\\) is <b>diagonalizable</b> if \\(P^{-1}AP=D\\) for a diagonal \\(D\\). Recipe: \\(P\\) has the eigenvectors as columns; \\(D\\) has the matching eigenvalues on the diagonal (same order).`),
        card(`It works <b>iff</b> \\(\\mathbb R^n\\) has a basis of eigenvectors (Thm 7.2.3), equivalently the geometric multiplicities sum to \\(n\\) (Thm 7.2.17). Quick win: <b>\\(n\\) distinct eigenvalues ⇒ diagonalizable</b> (Thm 7.2.8).`),
        card(`It <b>fails</b> when some eigenvalue is “deficient” — its geometric multiplicity is less than its algebraic multiplicity (a repeated root that doesn't give enough independent eigenvectors), e.g. \\(\\begin{bmatrix}1&3&0\\\\0&1&0\\\\0&0&2\\end{bmatrix}\\) has \\(g_1=1<2=m_1\\), so NOT diagonalizable.`),
        card(`Two free facts: every <b>symmetric</b> matrix is diagonalizable (Thm 7.2.24); and “invertible” has nothing to do with diagonalizable (a matrix can be one without the other).`),
      ]},
      guided: { intro: "One full diagonalization + one failure.", problems: [
        gp("§7.2", "Diagonalize a 2×2", "Diagonalize \\(A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}\\).", [[2, 1], [1, 2]],
          () => ({ steps: [
            step("Eigen-data", tex(`\\lambda=3\\ (\\vec v=(1,1)),\\quad \\lambda=1\\ (\\vec v=(1,-1))`)),
            step("Build P and D", tex(`P=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix},\\quad D=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}`)),
            step("Check", tex(`P^{-1}AP=D`) + "Two distinct eigenvalues, so it was guaranteed to work."),
          ] })),
        gp("Example 7.2.18", "A matrix that is NOT diagonalizable", "Show \\(\\begin{bmatrix}1&3&0\\\\0&1&0\\\\0&0&2\\end{bmatrix}\\) is not diagonalizable.", [[1, 3, 0], [0, 1, 0], [0, 0, 2]],
          () => ({ steps: [
            step("Eigenvalues", "Triangular ⇒ \\(\\lambda=1\\) (repeated, \\(m_1=2\\)) and \\(\\lambda=2\\)."),
            step("Geometric multiplicity of λ=1", tex(`g_1=3-\\text{rank}(I-A)=3-2=1`) + "But \\(m_1=2\\)."),
            step("Conclusion", "Sum of geometric multiplicities \\(=1+1=2<3\\). By Thm 7.2.17, <b>not diagonalizable</b>."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet. Commit before revealing.", slots: [
        slot("Diagonalizable? (T/F)", "§7.2", tfBank("§7.2", [
          { s: "A 3×3 matrix with 3 distinct real eigenvalues is diagonalizable.", a: true, why: "True (Thm 7.2.8): \\(n\\) distinct eigenvalues give \\(n\\) independent eigenvectors." },
          { s: "Every invertible matrix is diagonalizable.", a: false, why: "False. e.g. \\(\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}\\) is invertible but not diagonalizable (deficient eigenvalue 1)." },
          { s: "If a square matrix of order \\(n\\) has fewer than \\(n\\) distinct eigenvalues, it cannot be diagonalizable.", a: false, why: "False. A repeated eigenvalue can still have enough independent eigenvectors (e.g. the identity)." },
          { s: "Every symmetric matrix is diagonalizable.", a: true, why: "True (Thm 7.2.24)." },
          { s: "A matrix is diagonalizable iff the sum of geometric multiplicities equals \\(n\\).", a: true, why: "True (Thm 7.2.17)." },
        ])),
        slot("Diagonalizable? (T/F)", "§7.2", tfBank("§7.2", [
          { s: "If \\(A\\) is not diagonalizable, then \\(A\\) has fewer than \\(n\\) distinct real eigenvalues.", a: true, why: "True: \\(n\\) distinct ⇒ diagonalizable, so failing diagonalizability forces \\(<n\\) distinct eigenvalues." },
          { s: "The sum of the eigenvalues of \\(A\\) equals its trace.", a: true, why: "True — a standard fact (\\(\\text{tr}=\\sum\\lambda_i\\))." },
          { s: "The product of the eigenvalues equals \\(\\det(A)\\).", a: true, why: "True — another standard fact (\\(\\det=\\prod\\lambda_i\\))." },
        ])),
        slot("2×2 eigenvalue", "§7.1", E.genEigen2x2),
      ]},
    },
    { id: "D", name: "Applications", tagline: "Powers, factoring char. polynomials", estMin: 12, sources: ["§7.2/§7.3"],
      concept: { title: "Why diagonalization is useful", cards: [
        card(`If \\(A=PDP^{-1}\\) then \\(A^k=PD^kP^{-1}\\), and \\(D^k\\) is just each diagonal entry to the \\(k\\)-th power. That's how §7.3 computes \\((A-I)^{10}\\) painlessly, and how recursive sequences get closed forms.`),
        card(`For eigenvalues of a matrix polynomial: if \\(\\lambda\\) is an eigenvalue of \\(A\\), then \\(p(\\lambda)\\) is an eigenvalue of \\(p(A)\\), and \\(1/\\lambda\\) is an eigenvalue of \\(A^{-1}\\). (§7.2 Exercise 8.)`),
      ]},
      guided: { intro: "One factoring walkthrough.", problems: [
        gp("§7.2 Ex 7", "Factor a cubic with a known root", "Factor \\(f(\\lambda)=\\lambda^3-5\\lambda^2+7\\lambda-3\\), given \\(\\lambda=1\\) is a root.", null,
          () => ({ steps: [
            step("Divide out (λ−1)", tex(`\\lambda^3-5\\lambda^2+7\\lambda-3=(\\lambda-1)(\\lambda^2-4\\lambda+3)`)),
            step("Factor the quadratic", tex(`\\lambda^2-4\\lambda+3=(\\lambda-1)(\\lambda-3)`)),
            step("Full factorization", tex(`f(\\lambda)=(\\lambda-1)^2(\\lambda-3)`) + "So \\(\\lambda=1\\) (mult 2), \\(\\lambda=3\\)."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Eigenvalue algebra (T/F)", "§7.2", tfBank("§7.2", [
          { s: "If \\(\\lambda=2\\) is an eigenvalue of \\(A\\), then \\(\\lambda=8\\) is an eigenvalue of \\(A^3\\).", a: true, why: "True: eigenvalues of \\(A^3\\) are \\(\\lambda^3=2^3=8\\)." },
          { s: "If \\(\\lambda=2\\) is an eigenvalue of invertible \\(A\\), then \\(\\tfrac12\\) is an eigenvalue of \\(A^{-1}\\).", a: true, why: "True: eigenvalues of \\(A^{-1}\\) are \\(1/\\lambda\\)." },
          { s: "For any diagonalizable \\(A,B\\) of the same size, \\(A+B\\) is diagonalizable.", a: false, why: "False (§7.2 Ex 1) — diagonalizability is not preserved under addition in general." },
        ])),
        slot("Triangular eigenvalue", "§7.1", E.genEigenTriangular3),
      ]},
    },
  ],
  interleave: {
    afterB: { title: "Interleave · Eigenvalues stay sharp", blurb: "Recompute eigenvalues while learning eigenvectors.", slots: [
      slot("2×2 eigenvalue", "review", E.genEigen2x2),
      slot("Rank", "review", E.genRankProblem),
    ]},
  },
  mock: { title: "Boss Gauntlet · Predicted Lab 10", blurb: "Mixed eigen/diagonalization. No AI, no internet.", slots: [
    slot("Q · 2×2 eigenvalue", "Predicted", E.genEigen2x2),
    slot("Q · triangular eigenvalue", "Predicted", E.genEigenTriangular3),
    slot("Q · diagonalizable? T/F", "Predicted", tfBank("§7.2", [
      { s: "3 distinct eigenvalues ⇒ diagonalizable.", a: true, why: "True (Thm 7.2.8)." },
      { s: "Every invertible matrix is diagonalizable.", a: false, why: "False — counterexample \\(\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}\\)." },
    ])),
    slot("Q · eigenspace rank", "Predicted", E.genRankProblem),
    slot("Q · 2×2 eigenvalue", "Predicted", E.genEigen2x2),
  ]},
};
