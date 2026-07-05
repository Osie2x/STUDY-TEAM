/* ===================================================================
   CHAPTER REVIEW — Ch 1–2: Linear Systems & Vector Geometry
   Final-exam prep. Combines textbook, midterm, and mock-final question
   types for: Gaussian elimination/RREF, dot & cross products, lines/planes.
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M, det2 } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Final Review",
    lab: "Review — Ch 1–2: Systems & Vectors",
    book: "Hu et al. — Ch 1–2",
    lede: "One place for everything in Chapters 1–2: solving linear systems by row reduction, and vector geometry (dot product, angle, projection, cross product, area, lines & planes). Your RREF gets a full workout — you flagged it as rusty.",
    pills: ["⏱ ≈ 75 min", "🧮 heavy RREF", "🎯 4 stages + boss", "📄 textbook + midterm + mocks"],
    sourceNote: "Sources: §1 exercises (1.3–1.6), §2.1–2.2 exercises, past midterm & mock-final vector questions.",
    startLabel: "Start Stage A ›",
    doneTitle: "Ch 1–2 reviewed 🎓",
    doneText: "Row reduction, dot/cross products, and lines/planes are back in your hands.",
  },
  stages: [
    { id: "A", name: "Linear Systems", tagline: "Gaussian elimination & RREF", estMin: 22, sources: ["§1.3–1.6"],
      concept: { title: "Solving systems by row reduction", cards: [
        card(`Write the system as an <b>augmented matrix</b> \\([A\\mid \\vec b]\\), then row-reduce to RREF. The three legal operations: swap rows, scale a row by a nonzero number, add a multiple of one row to another.`),
        card(`Read the outcome off the RREF: a row \\([0\\ \\cdots\\ 0\\mid c]\\) with \\(c\\neq0\\) means <b>no solution</b> (inconsistent). Otherwise: a pivot in every variable column ⇒ <b>unique solution</b>; a free variable ⇒ <b>infinitely many</b>.`),
        card(`Express infinite solution sets in <b>vector form</b>: solve for the pivot variables in terms of the free ones, then write \\(\\vec x = \\vec x_p + t_1\\vec u_1 + \\cdots\\). Number of free variables \\(= n - \\text{rank}\\).`),
      ]},
      guided: { intro: "Two full reductions — every row op shown.", problems: [
        gp("§1", "Solve a 3×3 system", "Row-reduce \\([A\\mid\\vec b]\\) for a unique solution.", null,
          () => E.rrefSolutionSteps([[1, 2, -1, 3], [2, 1, 1, 3], [1, -1, 2, 0]], { coeffCols: 3, splitAt: 3, tail: () => "Identity block on the left ⇒ unique solution; read \\(x_1,x_2,x_3\\) from the last column." })),
        gp("§1", "Reduce a 3×4 (find rank)", "Reduce and report the rank.", [[1, 2, 1, 3], [2, 4, 1, 5], [1, 2, 2, 4]],
          () => E.rrefSolutionSteps([[1, 2, 1, 3], [2, 4, 1, 5], [1, 2, 2, 4]], { tail: (r) => `rank \\(=${r.rank}\\).` })),
      ]},
      practice: { intro: "No AI, no internet — reduce by hand.", slots: [
        slot("Solve a system (find x₁)", "§1", E.genSystemSolve),
        slot("Rank by RREF", "§1", E.genRankProblem),
        slot("Solve a system (find x₁)", "§1", E.genSystemSolve),
      ]},
    },
    { id: "B", name: "Dot Product", tagline: "Length, angle, projection, perpendicularity", estMin: 16, sources: ["§2.1"],
      concept: { title: "The dot product toolkit", cards: [
        card(`\\(\\vec a\\cdot\\vec b = a_1b_1+a_2b_2+\\cdots\\) — a <b>number</b>. Length is \\(\\|\\vec a\\|=\\sqrt{\\vec a\\cdot\\vec a}\\). Perpendicular \\(\\iff \\vec a\\cdot\\vec b=0\\).`),
        card(`Angle: \\(\\cos\\theta = \\dfrac{\\vec a\\cdot\\vec b}{\\|\\vec a\\|\\,\\|\\vec b\\|}\\). Sign of the dot product tells you acute (+), right (0), or obtuse (−).`),
        card(`Projection of \\(\\vec a\\) onto \\(\\vec b\\): \\(\\text{proj}_{\\vec b}\\vec a = \\dfrac{\\vec a\\cdot\\vec b}{\\vec b\\cdot\\vec b}\\,\\vec b\\). The scalar out front is “how much of \\(\\vec a\\) points along \\(\\vec b\\).”`),
      ]},
      guided: { intro: "One worked dot product + angle sign.", problems: [
        gp("§2.1", "Dot product & perpendicularity", "Compute \\(\\vec a\\cdot\\vec b\\) for \\(\\vec a=(2,-1,3),\\ \\vec b=(1,4,1)\\).", null,
          () => ({ steps: [
            step("Multiply matching components, add", tex(`\\vec a\\cdot\\vec b=(2)(1)+(-1)(4)+(3)(1)=2-4+3=1`)),
            step("Interpret", "Positive ⇒ the angle is acute. Not zero ⇒ not perpendicular."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Dot product", "§2.1", E.genDot),
        slot("Dot product", "§2.1", E.genDot),
      ]},
    },
    { id: "C", name: "Cross Product", tagline: "Perpendicular vector, area, normals", estMin: 16, sources: ["§2.2"],
      concept: { title: "The cross product toolkit", cards: [
        card(`\\(\\vec a\\times\\vec b\\) (only in \\(\\mathbb R^3\\)) is a <b>vector perpendicular</b> to both \\(\\vec a\\) and \\(\\vec b\\). Components: \\((a_2b_3-a_3b_2,\\ a_3b_1-a_1b_3,\\ a_1b_2-a_2b_1)\\) — watch the flipped sign in the middle.`),
        card(`\\(\\|\\vec a\\times\\vec b\\|\\) = <b>area of the parallelogram</b> spanned by \\(\\vec a,\\vec b\\). Half of it is the triangle area. Zero ⇒ the vectors are parallel.`),
        card(`The cross product gives a <b>normal vector</b> to a plane through two direction vectors — the bridge to point-normal form in Stage D.`),
      ]},
      guided: { intro: "One worked cross product.", problems: [
        gp("§2.2", "Cross product component", "For \\(\\vec a=(1,2,3),\\ \\vec b=(0,1,-1)\\), find the components of \\(\\vec a\\times\\vec b\\).", null,
          () => ({ steps: [
            step("First component", tex(`a_2b_3-a_3b_2=(2)(-1)-(3)(1)=-5`)),
            step("Second (flip sign!)", tex(`a_3b_1-a_1b_3=(3)(0)-(1)(-1)=1`)),
            step("Third", tex(`a_1b_2-a_2b_1=(1)(1)-(2)(0)=1`) + " ⇒ \\(\\vec a\\times\\vec b=(-5,1,1)\\)."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Cross product component", "§2.2", E.genCrossComponent),
        slot("Cross product component", "§2.2", E.genCrossComponent),
      ]},
    },
    { id: "D", name: "Lines & Planes", tagline: "Forms, relationships, and traps", estMin: 14, sources: ["§2"],
      concept: { title: "Lines and planes", cards: [
        card(`A line: \\(\\vec r=\\vec r_0+t\\vec d\\) (point + direction). A plane has three equivalent forms: <b>vector</b> \\(\\vec r=\\vec r_0+s\\vec u+t\\vec v\\), <b>point-normal</b> \\(\\vec n\\cdot(\\vec r-\\vec r_0)=0\\), and <b>standard</b> \\(ax+by+cz=d\\), where \\((a,b,c)\\) is the normal.`),
        card(`Relationships: two planes are <b>parallel</b> if their normals are parallel; the <b>angle</b> between planes = angle between normals. A line is parallel to a plane if its direction is perpendicular to the plane's normal (\\(\\vec d\\cdot\\vec n=0\\)).`),
      ]},
      guided: { intro: "Straight to the concept gauntlet.", problems: [
        gp("§2", "Normal from a plane equation", "What is a normal vector to \\(3x-2y+z=5\\)?", null,
          () => ({ steps: [
            step("Read the coefficients", "In \\(ax+by+cz=d\\), the normal is \\((a,b,c)\\)."),
            step("Answer", tex(`\\vec n=(3,-2,1)`)),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Lines & planes (T/F)", "§2", tfBank("§2", [
          { s: "The vector \\((a,b,c)\\) is normal to the plane \\(ax+by+cz=d\\).", a: true, why: "True — the coefficients are exactly the normal vector." },
          { s: "If \\(\\vec a\\cdot\\vec b=0\\) then \\(\\vec a\\) and \\(\\vec b\\) are perpendicular.", a: true, why: "True (assuming nonzero vectors)." },
          { s: "\\(\\vec a\\times\\vec b\\) is a scalar.", a: false, why: "False — the cross product is a vector; the dot product is the scalar." },
          { s: "\\(\\|\\vec a\\times\\vec b\\|\\) equals the area of the parallelogram spanned by \\(\\vec a,\\vec b\\).", a: true, why: "True — that's its geometric meaning." },
          { s: "Two planes are parallel iff their normal vectors are parallel.", a: true, why: "True." },
        ])),
        slot("Dot product", "§2.1", E.genDot),
        slot("Cross product component", "§2.2", E.genCrossComponent),
      ]},
    },
  ],
  interleave: {
    afterB: { title: "Interleave · Systems still sharp", blurb: "Row-reduce while doing vectors.", slots: [
      slot("Solve a system", "review", E.genSystemSolve), slot("Rank", "review", E.genRankProblem),
    ]},
    afterC: { title: "Interleave · Dot vs Cross", blurb: "Keep both products straight.", slots: [
      slot("Dot", "review", E.genDot), slot("Cross", "review", E.genCrossComponent),
    ]},
  },
  mock: { title: "Boss · Ch 1–2 mixed", blurb: "No AI, no internet.", slots: [
    slot("Solve a system", "Ch1–2", E.genSystemSolve),
    slot("Dot product", "Ch1–2", E.genDot),
    slot("Cross product", "Ch1–2", E.genCrossComponent),
    slot("Rank", "Ch1–2", E.genRankProblem),
    slot("Vectors T/F", "Ch1–2", tfBank("§2", [
      { s: "\\(\\vec a\\cdot\\vec b=0\\) means perpendicular.", a: true, why: "True for nonzero vectors." },
      { s: "The cross product of parallel vectors is \\(\\vec 0\\).", a: true, why: "True — area is zero." },
    ])),
  ]},
};
