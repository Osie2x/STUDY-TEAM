/* ===================================================================
   LAB 7 PREP — §5.2 Linear Combinations, Span, Linear Independence, Rank
   Confirmed scope: 123notes7S26.pdf (current lab notes) + Fall-2025 Lab 7
   solutions. RREF is the engine of this whole lab, so Stage A rebuilds it
   from scratch (your flagged weak spot).
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Lab 7 Prep",
    lab: "Lab 7 — Span, Independence & Rank (§5.2)",
    book: "Introductory Linear Algebra, Hu et al. — §5.2",
    lede: "Everything in Lab 7 runs on <b>RREF</b>. We rebuild your row-reduction from scratch, then use it for linear combinations, span, independence, and rank — exactly the Fall-2025 Lab 7 question types.",
    pills: ["⏱ ≈ 70 min", "🧮 RREF refresher included", "🎯 4 stages + boss", "📄 Source: 123notes7S26"],
    sourceNote: "Source files: <b>123notes7S26.pdf</b> (lab notes) · <b>ma123-lab-report-7-solutions-fall-2025.pdf</b> · textbook §5.2 exercises.",
    startLabel: "Start Stage A — RREF ›",
    doneTitle: "Lab 7 locked 🎓",
    doneText: "You can row-reduce cleanly, test span membership, and decide independence by rank. That's the whole lab.",
  },

  stages: [
    /* ---------------- Stage A: RREF refresher ---------------- */
    {
      id: "A", name: "RREF Refresher", tagline: "Row-reduce anything, cleanly, every time", estMin: 20,
      sources: ["§1 / §5.2"],
      concept: { title: "Reduced Row Echelon Form, rebuilt", cards: [
        card(`Everything in Lab 7 is decided by <b>row reduction</b>. Reduced Row Echelon Form (RREF) is the “fully simplified” version of a matrix. Three things define it: each nonzero row starts with a <b>leading 1</b> (a pivot); each pivot is the <b>only</b> nonzero entry in its column; and pivots move <b>right as you go down</b> (a staircase). Zero rows sink to the bottom.`),
        card(`You reach it with exactly <b>three legal row operations</b>: swap two rows, multiply a row by a nonzero number, or add a multiple of one row to another. That last one is your workhorse — it makes zeros without side effects.`,
          { type: "rowop", before: [[2, 4, 2], [1, 3, 1], [0, 1, 5]], after: [[1, 2, 1], [1, 3, 1], [0, 1, 5]], op: "\\tfrac12 R_1 \\to R_1", effect: "scale" }),
        card(`Two numbers fall out of the RREF and power the rest of the lab: the <b>rank</b> = the number of leading 1s (pivots), and the number of <b>free variables</b> = (number of columns) − rank. Memorize that second one — it tells you how many solutions a system has.`),
        card(`Strategy that never fails: get a 1 in the top-left, clear the rest of column 1 to zeros, move down-right to the next pivot, repeat. Then go back <b>up</b> to clear above each pivot. Slow is smooth; smooth is fast.`),
      ]},
      guided: { intro: "Watch every single row operation — no skipped steps.", problems: [
        gp("§5.2 lab notes", "Row-reduce a 2×3 augmented matrix", "This is the exact linear-combination system from your lab notes. We reduce \\([\\,\\vec v_1\\ \\vec v_2\\mid\\vec w\\,]\\).", [[15, 4, -3], [6, 3, -4]],
          () => E.rrefSolutionSteps([[15, 4, -3], [6, 3, -4]], { coeffCols: 2, splitAt: 2, tail: () => "So \\(t_1=\\tfrac13,\\ t_2=-2\\) — read straight off the identity block." })),
        gp("Predicted", "Row-reduce a 3×3 to the identity", "A full 3×3 reduction. Notice how clearing below, then above, each pivot works.", [[1, 2, -1], [2, 1, 1], [1, -1, 2]],
          () => E.rrefSolutionSteps([[1, 2, -1], [2, 1, 1], [1, -1, 2]], {})),
      ]},
      practice: { intro: "No AI, no internet — reduce by hand. Report the rank.", slots: [
        slot("Rank by RREF", "Predicted Lab Q", E.genRankProblem),
        slot("Rank by RREF", "Predicted Lab Q", E.genRankProblem),
        slot("Solve a system (find x₁)", "§1 systems", E.genSystemSolve),
      ]},
    },

    /* ---------------- Stage B: linear combinations & span ---------------- */
    {
      id: "B", name: "Combinations & Span", tagline: "Is w reachable from these vectors?", estMin: 18,
      sources: ["§5.2"],
      concept: { title: "Linear combinations and span", cards: [
        card(`A <b>linear combination</b> of \\(\\vec v_1,\\dots,\\vec v_k\\) is any \\(t_1\\vec v_1+\\dots+t_k\\vec v_k\\). To find the coefficients \\(t_i\\), you solve the system whose augmented matrix is \\([\\,\\vec v_1\\ \\vec v_2\\ \\cdots\\ \\vec v_k\\mid\\vec w\\,]\\) — the vectors are the columns, \\(\\vec w\\) is the right side.`),
        card(`The <b>span</b> of a set is <b>all</b> of its linear combinations. So “Is \\(\\vec w\\in\\text{Span}(S)\\)?” is the same question as “Is the system \\([\\,\\text{vectors}\\mid\\vec w\\,]\\) <b>consistent</b>?” Row-reduce and look for a contradiction row \\([\\,0\\ 0\\ \\cdots\\ 0\\mid c\\,]\\) with \\(c\\neq 0\\).`),
        card(`If reduction gives a contradiction row → <b>inconsistent</b> → \\(\\vec w\\) is <b>not</b> in the span. If no contradiction → <b>consistent</b> → \\(\\vec w\\) <b>is</b> in the span, and the RREF hands you the coefficients.`),
        card(`Handy fact (notes 2c): a vector that is already a combination of the others is “redundant” — dropping it doesn't change the span. That's the bridge to independence in Stage C.`),
      ]},
      guided: { intro: "Two worked span questions.", problems: [
        gp("§5.2 lab notes", "Write w as a combination", "Reduce \\([\\,\\vec v_1\\ \\vec v_2\\mid\\vec w\\,]\\) with \\(\\vec v_1=(15,6),\\ \\vec v_2=(4,3),\\ \\vec w=(-3,-4)\\).", [[15, 4, -3], [6, 3, -4]],
          () => E.rrefSolutionSteps([[15, 4, -3], [6, 3, -4]], { coeffCols: 2, splitAt: 2, tail: () => "Consistent ⇒ \\(\\vec w=\\tfrac13\\vec v_1-2\\vec v_2\\in\\text{Span}(\\vec v_1,\\vec v_2)\\)." })),
        gp("§5.2 style", "Is w in the span? (R³)", "Test whether \\(\\vec w=(1,2,3)\\) is a combination of \\((1,0,1),(0,1,1)\\).", [[1, 0, 1], [0, 1, 2], [1, 1, 3]],
          () => E.rrefSolutionSteps([[1, 0, 1], [0, 1, 2], [1, 1, 3]], { coeffCols: 2, splitAt: 2, tail: () => "Bottom row becomes \\([\\,0\\ 0\\mid 0\\,]\\) — no contradiction, so \\(\\vec w\\) IS in the span (here \\(\\vec w=\\vec v_1+2\\vec v_2\\))." })),
      ]},
      practice: { intro: "No AI, no internet. Reduce the augmented matrix in your head/paper.", slots: [
        slot("Is w in the span?", "§5.2", E.genSpanMembership),
        slot("Is w in the span?", "§5.2", E.genSpanMembership),
        slot("Rank check", "§5.2", E.genRankProblem),
      ]},
    },

    /* ---------------- Stage C: independence & rank ---------------- */
    {
      id: "C", name: "Independence & Rank", tagline: "rank = k means independent", estMin: 18,
      sources: ["§5.2"],
      concept: { title: "Linear independence via rank", cards: [
        card(`Vectors are <b>linearly independent</b> when the <b>only</b> way to get \\(t_1\\vec v_1+\\dots+t_k\\vec v_k=\\vec 0\\) is the trivial one \\(t_1=\\dots=t_k=0\\). If any other solution exists, they're <b>dependent</b> — one vector is a combination of the others.`),
        card(`The fast test (notes 3a): put the vectors as columns of \\(A\\). Then they are independent <b>iff</b> \\(\\text{rank}(A)=k\\), the number of vectors. Rank short of \\(k\\) ⇒ dependent.`),
        card(`Number of free variables in \\(A\\vec t=\\vec 0\\) is \\(m=k-\\text{rank}(A)\\). Independent means \\(m=0\\) (only the trivial solution). Each free variable is a genuinely different dependency.`),
        card(`Two shortcuts the lab loves: (1) more vectors than the dimension (\\(k>n\\)) ⇒ automatically <b>dependent</b>. (2) A set containing the zero vector is always <b>dependent</b>. (3) If \\(A\\) is square, independent \\(\\iff \\det(A)\\neq 0\\) — ties back to Lab 6.`),
      ]},
      guided: { intro: "Two worked independence problems.", problems: [
        gp("Fall-2025 Lab 7", "Are three R⁴ vectors independent?", "Columns \\(\\vec v_1=(0,2,-2,3),\\vec v_2=(1,-1,2,4),\\vec v_3=(3,2,-1,0)\\). Reduce and compare rank to \\(k=3\\).", [[0, 1, 3], [2, -1, 2], [-2, 2, -1], [3, 4, 0]],
          () => E.rrefSolutionSteps([[0, 1, 3], [2, -1, 2], [-2, 2, -1], [3, 4, 0]], { tail: () => "rank \\(=3=k\\) ⇒ <b>independent</b> (matches the Fall-2025 solution)." })),
        gp("§5.2 lab notes", "A dependent set (rank < k)", "Columns \\((15,6),(4,3),(-3,-4)\\) — three vectors in \\(\\mathbb R^2\\).", [[15, 4, -3], [6, 3, -4]],
          () => E.rrefSolutionSteps([[15, 4, -3], [6, 3, -4]], { tail: () => "rank \\(=2\\neq 3=k\\) ⇒ <b>dependent</b>. Free variables \\(=3-2=1\\). (Also obvious: 3 vectors in \\(\\mathbb R^2\\) must be dependent.)" })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Independent or dependent?", "§5.2", E.genIndepProblem),
        slot("Independent or dependent?", "§5.2", E.genIndepProblem),
        slot("Find the rank", "§5.2", E.genRankProblem),
      ]},
    },

    /* ---------------- Stage D: theory traps + applications ---------------- */
    {
      id: "D", name: "Traps & Applications", tagline: "True/False edges + the RGB / encoding lab style", estMin: 14,
      sources: ["§5.2 exercises", "Lab 7 applications"],
      concept: { title: "The conceptual edges Lab 7 tests", cards: [
        card(`Lab 7 mixes computation with True/False traps straight from §5.2. The classic ones: “a dependent set must contain \\(\\vec 0\\)” (false), “\\(k<n\\) vectors can span \\(\\mathbb R^n\\)” (false — you need at least \\(n\\)), and “removing a vector from an independent set keeps it independent” (true).`),
        card(`Application flavour (Fall-2025 Q2): colours as vectors \\((r,g,b)\\). A new colour is a linear combination \\(\\vec a=c_1\\vec m+c_2\\vec n+c_3\\vec p\\). If the palette is <b>dependent</b>, you can reproduce the same colour with fewer base colours — that's the RREF giving \\(\\vec p=0.5\\vec m+0.1\\vec n\\).`),
        card(`Application flavour (Fall-2024 Q3): encoding a message. Determinant \\(\\neq 0\\) ⇒ the encoding matrix is invertible ⇒ columns independent ⇒ the message can be uniquely decoded. Independence = uniqueness = invertibility. Same idea, three vocabularies.`),
      ]},
      guided: { intro: "One application walkthrough, then straight to the trap gauntlet.", problems: [
        gp("Fall-2025 Lab 7 Q2", "Colour palette dependency", "Palette matrix \\(C=[\\vec m\\ \\vec n\\ \\vec p]\\) reduces to an RREF with a zero row. What does that mean?", null,
          () => ({ steps: [
            step("Set up", "The three colours are columns of \\(C\\). We row-reduce \\(C\\).", { type: "none" }),
            step("RREF has a zero row", tex(`C \\xrightarrow{\\text{RREF}} \\begin{bmatrix}1&0&0.5\\\\0&1&0.1\\\\0&0&0\\end{bmatrix}`) + "A zero row ⇒ rank \\(=2<3\\) ⇒ the colours are <b>dependent</b>.", { type: "none" }),
            step("Read the dependency", "The third column \\((0.5,0.1)\\) says \\(\\vec p=0.5\\vec m+0.1\\vec n\\). So any mix using \\(\\vec p\\) can be rewritten using only \\(\\vec m,\\vec n\\).", { type: "none" }),
          ] })),
      ]},
      practice: { intro: "No AI, no internet. Commit to True/False before revealing.", slots: [
        slot("True / False (§5.2)", "§5.2 exercises", tfBank("§5.2 exercises", [
          { s: "Every linearly dependent set of vectors in \\(\\mathbb R^n\\) contains the zero vector.", a: false, why: "False. e.g. \\(\\{(1,0),(2,0)\\}\\) is dependent but has no zero vector. Dependence means one vector is a combination of others, not that \\(\\vec 0\\) is present." },
          { s: "There is a set of eleven vectors that spans \\(\\mathbb R^{17}\\).", a: false, why: "False. Spanning \\(\\mathbb R^{17}\\) needs at least 17 vectors; 11 can span at most an 11-dimensional subspace." },
          { s: "The set \\(\\{\\vec 0,(1,0,1),(2,1,-1)\\}\\) in \\(\\mathbb R^3\\) is linearly dependent.", a: true, why: "True. Any set containing the zero vector is dependent (take coefficient 1 on \\(\\vec 0\\), 0 on the rest)." },
          { s: "If \\(\\vec u,\\vec v\\) are independent in \\(\\mathbb R^3\\) and \\(\\vec w\\neq\\vec 0\\) is not in their plane, then \\(\\{\\vec u,\\vec v,\\vec w\\}\\) is independent.", a: true, why: "True. \\(\\vec w\\) not in \\(\\text{Span}(\\vec u,\\vec v)\\) means it adds a new direction, so no nontrivial combination gives \\(\\vec 0\\)." },
          { s: "If the columns of a square matrix \\(A\\) are linearly dependent, then \\(\\det(A)=0\\).", a: true, why: "True. Dependent columns ⇒ rank \\(<n\\) ⇒ not invertible ⇒ \\(\\det(A)=0\\) (Lab 6 link)." },
          { s: "Any 4 vectors in \\(\\mathbb R^3\\) are linearly dependent.", a: true, why: "True. More vectors than the dimension (\\(k>n\\)) forces dependence — rank is capped at \\(n=3\\)." },
        ])),
        slot("True / False (§5.2)", "§5.2 exercises", tfBank("§5.2 exercises", [
          { s: "Removing a vector from a linearly independent set leaves it independent.", a: true, why: "True (Fall-2025 Q1d). A subset of an independent set is still independent." },
          { s: "If \\(\\text{rank}(A)=k\\) where \\(A\\) has \\(k\\) columns, the columns are independent.", a: true, why: "True — this is the rank test for independence." },
          { s: "3 vectors in \\(\\mathbb R^3\\) always span \\(\\mathbb R^3\\).", a: false, why: "False. Only if they're independent (rank 3). Three coplanar vectors span just a plane." },
        ])),
        slot("Independent or dependent?", "§5.2", E.genIndepProblem),
      ]},
    },
  ],

  interleave: {
    afterB: { title: "Interleave · RREF still sharp?", blurb: "You just used RREF for span. Prove the raw reduction still fires.", slots: [
      slot("Rank by RREF", "Stage A review", E.genRankProblem),
      slot("Solve a system", "Stage A review", E.genSystemSolve),
    ]},
    afterC: { title: "Interleave · Span + Independence mixed", blurb: "Two questions, two different skills, back to back.", slots: [
      slot("Is w in the span?", "Stage B review", E.genSpanMembership),
      slot("Independent?", "Stage C review", E.genIndepProblem),
    ]},
  },

  mock: {
    title: "Boss Gauntlet · Predicted Lab 7", blurb: "A shuffled mix in the exact Fall-2025 Lab 7 style. No AI, no internet.",
    slots: [
      slot("Q · rank", "Predicted Lab Q", E.genRankProblem),
      slot("Q · independence", "Predicted Lab Q", E.genIndepProblem),
      slot("Q · span membership", "Predicted Lab Q", E.genSpanMembership),
      slot("Q · solve a system", "Predicted Lab Q", E.genSystemSolve),
      slot("Q · §5.2 True/False", "Predicted Lab Q", tfBank("§5.2", [
        { s: "A set containing \\(\\vec 0\\) is always linearly dependent.", a: true, why: "True — coefficient 1 on \\(\\vec 0\\) gives a nontrivial combination equal to \\(\\vec 0\\)." },
        { s: "5 vectors in \\(\\mathbb R^4\\) can be linearly independent.", a: false, why: "False. \\(k=5>4=n\\) forces dependence." },
        { s: "If \\(\\text{rank}(A)<k\\) (k columns), the columns are dependent.", a: true, why: "True — rank test: short of \\(k\\) means a nontrivial null-space vector exists." },
      ])),
      slot("Q · independence", "Predicted Lab Q", E.genIndepProblem),
    ],
  },
};
