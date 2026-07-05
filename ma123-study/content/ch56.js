/* ===================================================================
   CHAPTER REVIEW — Ch 5–6: Subspaces, Span, Independence, Basis, Dimension
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Final Review",
    lab: "Review — Ch 5–6: Subspaces & Bases",
    book: "Hu et al. — §5.1–§6",
    lede: "Subspaces, span, linear independence, basis, dimension, rank & nullity — all decided by RREF. This is the heart of the post-midterm final material.",
    pills: ["⏱ ≈ 70 min", "🧮 RREF-driven", "🎯 4 stages + boss"],
    sourceNote: "Sources: §5.1 (subspaces), §5.2 (span/independence), §6 (basis/dimension), Lab 7 solutions.",
    startLabel: "Start Stage A ›",
    doneTitle: "Ch 5–6 reviewed 🎓",
    doneText: "Subspaces, span, independence, and bases are locked.",
  },
  stages: [
    { id: "A", name: "Subspaces", tagline: "The three conditions", estMin: 14, sources: ["§5.1"],
      concept: { title: "What makes a subspace", cards: [
        card(`A subset \\(V\\subseteq\\mathbb R^n\\) is a <b>subspace</b> if: it contains \\(\\vec 0\\); it's closed under addition (\\(\\vec u+\\vec v\\in V\\)); and closed under scalar multiplication (\\(c\\vec u\\in V\\)). Fail any one ⇒ not a subspace.`),
        card(`Fast checks: solution sets of <b>homogeneous</b> systems (\\(=\\vec 0\\)) are always subspaces; anything defined by a nonzero constant (\\(=1\\)) or a nonlinear condition (\\(x^2\\), inequalities) usually fails (no \\(\\vec 0\\), or not closed).`),
      ]},
      guided: { intro: "One subspace check.", problems: [
        gp("§5.1", "Is it a subspace?", "Is \\(\\{(x_1,x_2,x_3): x_1+4x_2-x_3=0\\}\\) a subspace of \\(\\mathbb R^3\\)?", null,
          () => ({ steps: [
            step("Contains 0?", "Plug in \\(\\vec 0\\): \\(0+0-0=0\\) ✓. It's a homogeneous equation."),
            step("Closed?", "Sums and scalar multiples of solutions to a homogeneous linear equation are again solutions ✓."),
            step("Verdict", "Yes — it's a subspace (a plane through the origin). Compare: the same equation \\(=1\\) would NOT be a subspace."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Subspace? (T/F)", "§5.1", tfBank("§5.1", [
          { s: "The solution set of \\(x_1+4x_2-x_3=0\\) is a subspace of \\(\\mathbb R^3\\).", a: true, why: "True — homogeneous linear equation ⇒ subspace (plane through origin)." },
          { s: "The solution set of \\(x_1+3x_2+2x_3=1\\) is a subspace of \\(\\mathbb R^3\\).", a: false, why: "False — doesn't contain \\(\\vec0\\) (RHS is 1, not 0)." },
          { s: "\\(\\{(x_1,x_2,x_3): x_1^2-x_2^2+x_3=0\\}\\) is a subspace.", a: false, why: "False — nonlinear (squares); not closed under addition/scaling." },
          { s: "\\(\\{\\vec x: \\vec x\\cdot\\vec n=0\\}\\) for a fixed \\(\\vec n\\) is a subspace.", a: true, why: "True — it's a homogeneous linear condition (a hyperplane through origin)." },
        ])),
      ]},
    },
    { id: "B", name: "Span & Independence", tagline: "RREF decides both", estMin: 18, sources: ["§5.2"],
      concept: { title: "Span and independence", cards: [
        card(`\\(\\vec w\\in\\text{Span}(S)\\) \\(\\iff\\) the augmented system \\([\\text{vectors}\\mid\\vec w]\\) is <b>consistent</b>. Vectors are <b>independent</b> \\(\\iff\\) rank (as columns) equals the number of vectors.`),
        card(`Free variables \\(=k-\\text{rank}\\). Independent means zero free variables. More vectors than the dimension ⇒ automatically dependent.`),
      ]},
      guided: { intro: "One span + one independence.", problems: [
        gp("§5.2", "Is w in the span?", "Test \\(\\vec w=(1,2,3)\\) against \\((1,0,1),(0,1,1)\\).", [[1, 0, 1], [0, 1, 2], [1, 1, 3]],
          () => E.rrefSolutionSteps([[1, 0, 1], [0, 1, 2], [1, 1, 3]], { coeffCols: 2, splitAt: 2, tail: () => "Consistent ⇒ in the span (\\(\\vec w=\\vec v_1+2\\vec v_2\\))." })),
        gp("§5.2", "Independent?", "Columns \\((0,2,-2,3),(1,-1,2,4),(3,2,-1,0)\\) — compare rank to \\(k=3\\).", [[0, 1, 3], [2, -1, 2], [-2, 2, -1], [3, 4, 0]],
          () => E.rrefSolutionSteps([[0, 1, 3], [2, -1, 2], [-2, 2, -1], [3, 4, 0]], { tail: (r) => `rank \\(=${r.rank}\\); with \\(k=3\\), ${r.rank === 3 ? "independent" : "dependent"}.` })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Is w in the span?", "§5.2", E.genSpanMembership),
        slot("Independent?", "§5.2", E.genIndepProblem),
        slot("Rank", "§5.2", E.genRankProblem),
      ]},
    },
    { id: "C", name: "Basis & Dimension", tagline: "Independent + spanning; count them", estMin: 16, sources: ["§6"],
      concept: { title: "Basis and dimension", cards: [
        card(`A <b>basis</b> is independent AND spanning. To extract one from a spanning set: row-reduce and keep the <b>original</b> pivot columns. <b>Dimension</b> = number of basis vectors = rank.`),
        card(`<b>Rank–nullity</b>: rank + nullity = number of columns, where nullity = free variables = \\(\\dim\\) of the null space of \\(A\\).`),
      ]},
      guided: { intro: "One basis extraction.", problems: [
        gp("§6", "Basis + dimension", "Basis for the column space of \\(\\begin{bmatrix}1&1&3\\\\2&1&5\\\\1&3&5\\end{bmatrix}\\).", [[1, 1, 3], [2, 1, 5], [1, 3, 5]],
          () => E.rrefSolutionSteps([[1, 1, 3], [2, 1, 5], [1, 3, 5]], { tail: (r) => `Pivot columns ${r.pivots.map((p) => p + 1).join(", ")} ⇒ dim \\(=${r.rank}\\).` })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Dimension = rank", "§6", E.genRankProblem),
        slot("Basis? (independence)", "§6", E.genIndepProblem),
      ]},
    },
    { id: "D", name: "Traps", tagline: "Basis / span True-False", estMin: 10, sources: ["§5–6"],
      concept: { title: "The conceptual edges", cards: [
        card(`A spanning set can be too big (dependent); an independent set can be too small (doesn't span). A basis is exactly right. Any two bases of the same space have the same size.`),
        card(`In \\(\\mathbb R^n\\): more than \\(n\\) vectors ⇒ dependent; fewer than \\(n\\) ⇒ can't span; exactly \\(n\\) independent ⇒ basis.`),
      ]},
      guided: { intro: "Straight to the gauntlet.", problems: [
        gp("§5–6", "Quick check", "Can 4 vectors be independent in \\(\\mathbb R^3\\)?", null,
          () => ({ steps: [ step("Rank cap", "Rank in \\(\\mathbb R^3\\) is at most 3."), step("Answer", "No — 4 vectors in \\(\\mathbb R^3\\) are always dependent.") ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Basis/dimension (T/F)", "§5–6", tfBank("§5–6", [
          { s: "5 vectors in \\(\\mathbb R^4\\) can be independent.", a: false, why: "False — \\(k>n\\) forces dependence." },
          { s: "Any 3 independent vectors in \\(\\mathbb R^3\\) form a basis.", a: true, why: "True." },
          { s: "Every subspace has a unique dimension.", a: true, why: "True — all bases have the same size." },
          { s: "A set containing \\(\\vec 0\\) can be independent.", a: false, why: "False — always dependent." },
        ])),
        slot("Independent?", "§5–6", E.genIndepProblem),
        slot("Rank", "§5–6", E.genRankProblem),
      ]},
    },
  ],
  interleave: {
    afterB: { title: "Interleave · RREF stays sharp", blurb: "Reduce while learning bases.", slots: [
      slot("Rank", "review", E.genRankProblem), slot("Span?", "review", E.genSpanMembership),
    ]},
  },
  mock: { title: "Boss · Ch 5–6 mixed", blurb: "No AI, no internet.", slots: [
    slot("Independent?", "Ch5–6", E.genIndepProblem),
    slot("Span membership", "Ch5–6", E.genSpanMembership),
    slot("Rank", "Ch5–6", E.genRankProblem),
    slot("Subspace T/F", "Ch5–6", tfBank("§5", [
      { s: "A homogeneous solution set is a subspace.", a: true, why: "True." },
      { s: "5 vectors in \\(\\mathbb R^4\\) are dependent.", a: true, why: "True (\\(k>n\\))." },
    ])),
    slot("Independent?", "Ch5–6", E.genIndepProblem),
  ]},
};
