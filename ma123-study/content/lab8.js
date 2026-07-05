/* ===================================================================
   LAB 8 PREP — Basis, Dimension & Rank–Nullity  (Ch 5–6)
   Predicted scope: the natural continuation of §5.2 (span/independence)
   into bases and dimension. Row-reduction driven, like Lab 7.
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Lab 8 Prep",
    lab: "Lab 8 — Basis, Dimension & Rank–Nullity",
    book: "Hu et al. — §5–§6",
    lede: "A basis is the “just right” spanning set: independent AND spanning. We use RREF to find bases, read dimensions, and apply the rank–nullity theorem. Predicted scope — the follow-on to Lab 7.",
    pills: ["⏱ ≈ 55 min", "🧮 RREF-driven", "🎯 4 stages + boss"],
    sourceNote: "Predicted from course progression (§5.2 → bases/dimension). Uses §5–6 definitions.",
    startLabel: "Start Stage A ›",
    doneTitle: "Lab 8 locked 🎓",
    doneText: "You can find a basis, state a dimension, and use rank + nullity = number of columns.",
  },
  stages: [
    { id: "A", name: "Basis", tagline: "Independent + spanning", estMin: 14, sources: ["§5–6"],
      concept: { title: "What a basis is", cards: [
        card(`A <b>basis</b> for a subspace is a set of vectors that is (1) <b>linearly independent</b> and (2) <b>spans</b> the subspace. It's the smallest set that still reaches everything — no redundancy, no gaps.`),
        card(`To get a basis for the span of some vectors: put them as columns, row-reduce, and keep the <b>original</b> columns that end up with <b>pivots</b>. Those pivot columns are a basis for the column space.`),
        card(`Key facts: any basis of a given subspace has the <b>same number</b> of vectors (that number is the dimension). And any \\(n\\) independent vectors in \\(\\mathbb R^n\\) automatically form a basis of \\(\\mathbb R^n\\).`),
      ]},
      guided: { intro: "One worked basis extraction.", problems: [
        gp("§5–6", "Basis from a spanning set", "Find a basis for the span of the columns of \\(\\begin{bmatrix}1&1&3\\\\2&1&5\\\\1&3&5\\end{bmatrix}\\).", [[1, 1, 3], [2, 1, 5], [1, 3, 5]],
          () => E.rrefSolutionSteps([[1, 1, 3], [2, 1, 5], [1, 3, 5]], { tail: (r) => `Pivots are in columns ${r.pivots.map((p) => p + 1).join(", ")}. Keep those <b>original</b> columns — that's a basis. dim \\(= ${r.rank}\\).` })),
      ]},
      practice: { intro: "No AI, no internet. (rank = size of a basis for the column space.)", slots: [
        slot("Do these form a basis? (independence)", "§5–6", E.genIndepProblem),
        slot("Rank = dim of column space", "§5–6", E.genRankProblem),
      ]},
    },
    { id: "B", name: "Dimension", tagline: "Count the basis vectors", estMin: 12, sources: ["§5–6"],
      concept: { title: "Dimension = number of basis vectors", cards: [
        card(`The <b>dimension</b> of a subspace is the number of vectors in any basis for it. \\(\\dim(\\mathbb R^n)=n\\). A line through the origin has dimension 1; a plane through the origin, dimension 2.`),
        card(`For the span of some vectors, \\(\\dim=\\) rank of the matrix with those vectors as columns. Extra (dependent) vectors don't add dimension.`),
      ]},
      guided: { intro: "One worked dimension.", problems: [
        gp("§5–6", "Dimension of a span", "Find \\(\\dim\\text{Span}\\) of the columns of \\(\\begin{bmatrix}1&2&3\\\\2&4&6\\\\0&1&1\\end{bmatrix}\\).", [[1, 2, 3], [2, 4, 6], [0, 1, 1]],
          () => E.rrefSolutionSteps([[1, 2, 3], [2, 4, 6], [0, 1, 1]], { tail: (r) => `rank \\(=${r.rank}\\), so the dimension of the span is \\(${r.rank}\\) (the three columns are dependent).` })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Dimension = rank", "§5–6", E.genRankProblem),
        slot("Independent set?", "§5–6", E.genIndepProblem),
      ]},
    },
    { id: "C", name: "Rank–Nullity", tagline: "rank + nullity = #columns", estMin: 14, sources: ["§5–6"],
      concept: { title: "The rank–nullity theorem", cards: [
        card(`For a matrix \\(A\\) with \\(n\\) columns: <b>rank</b> (number of pivots) plus <b>nullity</b> (dimension of the solution space of \\(A\\vec x=\\vec 0\\), i.e. number of free variables) equals \\(n\\): \\(\\text{rank}+\\text{nullity}=n\\).`),
        card(`So nullity \\(=n-\\text{rank}\\) = the number of free variables you saw in Lab 7. If nullity \\(=0\\), the columns are independent and \\(A\\vec x=\\vec 0\\) has only the trivial solution.`),
      ]},
      guided: { intro: "One worked rank–nullity.", problems: [
        gp("§5–6", "Find rank and nullity", "For \\(\\begin{bmatrix}1&2&1&3\\\\2&4&1&5\\\\1&2&2&4\\end{bmatrix}\\) (4 columns), find rank and nullity.", [[1, 2, 1, 3], [2, 4, 1, 5], [1, 2, 2, 4]],
          () => E.rrefSolutionSteps([[1, 2, 1, 3], [2, 4, 1, 5], [1, 2, 2, 4]], { tail: (r) => `rank \\(=${r.rank}\\). With \\(n=4\\) columns, nullity \\(=4-${r.rank}=${4 - r.rank}\\).` })),
      ]},
      practice: { intro: "No AI, no internet. (Find the rank; nullity = #cols − rank.)", slots: [
        slot("Rank", "§5–6", E.genRankProblem),
        slot("Rank", "§5–6", E.genRankProblem),
      ]},
    },
    { id: "D", name: "Traps", tagline: "Basis / dimension True-False", estMin: 10, sources: ["§5–6"],
      concept: { title: "The conceptual edges", cards: [
        card(`Common traps: a spanning set need not be a basis (it can be too big / dependent); an independent set need not be a basis (it can be too small / not spanning). A basis is exactly both at once.`),
        card(`Size rules in \\(\\mathbb R^n\\): more than \\(n\\) vectors are always dependent (can't be independent); fewer than \\(n\\) can't span. Exactly \\(n\\) independent vectors ⇒ basis.`),
      ]},
      guided: { intro: "Straight to the trap gauntlet.", problems: [
        gp("§5–6", "Is it a basis?", "Can 2 vectors form a basis of \\(\\mathbb R^3\\)?", null,
          () => ({ steps: [
            step("Dimension check", "\\(\\dim\\mathbb R^3=3\\), so any basis needs exactly 3 vectors."),
            step("Conclusion", "2 vectors can be independent but cannot span \\(\\mathbb R^3\\) — <b>not a basis</b>."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Basis / dimension (T/F)", "§5–6", tfBank("§5–6", [
          { s: "Any 3 linearly independent vectors in \\(\\mathbb R^3\\) form a basis of \\(\\mathbb R^3\\).", a: true, why: "True: \\(n\\) independent vectors in \\(\\mathbb R^n\\) automatically span and form a basis." },
          { s: "A spanning set of \\(\\mathbb R^3\\) with 4 vectors is a basis.", a: false, why: "False: 4 vectors in \\(\\mathbb R^3\\) are dependent, so not a basis (though a subset of 3 pivots is)." },
          { s: "Every basis of a given subspace has the same number of vectors.", a: true, why: "True — that common number is the dimension." },
          { s: "rank + nullity equals the number of columns of the matrix.", a: true, why: "True — the rank–nullity theorem." },
          { s: "2 vectors can span \\(\\mathbb R^3\\).", a: false, why: "False: you need at least 3 vectors to span a 3-dimensional space." },
        ])),
        slot("Independent set?", "§5–6", E.genIndepProblem),
        slot("Rank", "§5–6", E.genRankProblem),
      ]},
    },
  ],
  interleave: {
    afterB: { title: "Interleave · RREF + independence", blurb: "Keep the row-reduction and independence skills hot.", slots: [
      slot("Rank", "review", E.genRankProblem),
      slot("Independent?", "review", E.genIndepProblem),
    ]},
  },
  mock: { title: "Boss Gauntlet · Predicted Lab 8", blurb: "Mixed basis/dimension/rank. No AI, no internet.", slots: [
    slot("Q · rank", "Predicted", E.genRankProblem),
    slot("Q · independence/basis", "Predicted", E.genIndepProblem),
    slot("Q · basis T/F", "Predicted", tfBank("§5–6", [
      { s: "Exactly \\(n\\) independent vectors in \\(\\mathbb R^n\\) form a basis.", a: true, why: "True." },
      { s: "A dependent set can be a basis.", a: false, why: "False — a basis must be independent." },
    ])),
    slot("Q · rank", "Predicted", E.genRankProblem),
    slot("Q · span membership", "Predicted", E.genSpanMembership),
  ]},
};
