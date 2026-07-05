/* ===================================================================
   CHAPTER REVIEW — Ch 3–4: Matrix Algebra & Determinants
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M, det2, det3, detTri } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Final Review",
    lab: "Review — Ch 3–4: Matrices & Determinants",
    book: "Hu et al. — Ch 3–4",
    lede: "Matrix multiplication, inverses, matrices as transformations, and the full determinant toolkit (cofactor expansion, triangular shortcut, properties, invertibility). Determinant engine reused from the Lab 6 app.",
    pills: ["⏱ ≈ 70 min", "🎯 4 stages + boss", "📄 textbook + midterm + mocks"],
    sourceNote: "Sources: §3 (matrices, inverses), §4.1–4.4 (determinants), past midterm + mock finals.",
    startLabel: "Start Stage A ›",
    doneTitle: "Ch 3–4 reviewed 🎓",
    doneText: "Matrix products, transformations, and determinants are locked.",
  },
  stages: [
    { id: "A", name: "Matrix Algebra", tagline: "Multiply, add, scale", estMin: 16, sources: ["§3"],
      concept: { title: "Matrix operations", cards: [
        card(`Add/scale entry-by-entry (same size). <b>Multiply</b> with the row-times-column rule: \\((AB)_{ij}\\) = row \\(i\\) of \\(A\\) dotted with column \\(j\\) of \\(B\\). Inner dimensions must match: \\((m\\times n)(n\\times p)=(m\\times p)\\).`),
        card(`Order matters: \\(AB\\neq BA\\) in general. Identity \\(I\\) acts like 1: \\(AI=IA=A\\). \\((AB)^T=B^TA^T\\) — the order reverses.`),
      ]},
      guided: { intro: "One worked product entry.", problems: [
        gp("§3", "A product entry", "Find \\((AB)_{11}\\) for \\(A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix},B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}\\).", null,
          () => ({ steps: [
            step("Row 1 · Column 1", tex(`(AB)_{11}=(1)(5)+(2)(7)=5+14=19`)),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Product entry", "§3", E.genMatMulEntry), slot("Product entry", "§3", E.genMatMulEntry),
      ]},
    },
    { id: "B", name: "Transformations", tagline: "Matrices as transformations", estMin: 14, sources: ["§3"],
      concept: { title: "Matrices move vectors", cards: [
        card(`\\(T_A(\\vec x)=A\\vec x\\). Columns of the standard matrix are the images of the basis vectors. Composition of transformations = <b>product</b> of their matrices (rightmost acts first).`),
        card(`The eight standard 2×2 geometric matrices: rotation, horizontal/vertical stretch, scaling, horizontal/vertical shear, and reflections over the x-axis, y-axis, and \\(y=x\\).`),
      ]},
      guided: { intro: "One worked identification.", problems: [
        gp("§3", "Identify a transform", "What is \\(\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}\\)?", [[1, 0], [0, -1]],
          () => ({ steps: [ step("Test basis", "\\((0,1)\\mapsto(0,-1)\\): y flips, x stays."), step("Answer", "Reflection over the x-axis.") ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Identify transform", "§3", E.genGeoTransform), slot("Image component", "§3", E.genTransformImage),
      ]},
    },
    { id: "C", name: "Determinants", tagline: "Cofactor, triangular, properties", estMin: 22, sources: ["§4.1–4.4"],
      concept: { title: "Computing determinants fast", cards: [
        card(`2×2: \\(ad-bc\\). Bigger: <b>cofactor expansion</b> along a row/column (pick the one with most zeros), each term = entry × sign × minor, signs from the \\(+-+\\) checkerboard.`),
        card(`Shortcuts: triangular/diagonal ⇒ product of the diagonal. Zero row/col, equal or proportional rows ⇒ \\(\\det=0\\). Row ops: swap flips sign, scaling a row multiplies det by that factor, adding a multiple of a row leaves det unchanged.`),
        card(`Algebra: \\(\\det(AB)=\\det A\\det B\\), \\(\\det(A^T)=\\det A\\), \\(\\det(A^{-1})=1/\\det A\\), \\(\\det(kA)=k^n\\det A\\). And the big one: \\(A\\) invertible \\(\\iff \\det A\\neq 0\\).`),
      ]},
      guided: { intro: "One 3×3 by cofactor.", problems: [
        gp("§4.1", "3×3 determinant", "Cofactor-expand along row 1.", [[3, 1, 0], [-2, -4, 3], [5, 4, -2]],
          () => E.steps3x3([[3, 1, 0], [-2, -4, 3], [5, 4, -2]], 0)),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("3×3 determinant", "§4.1", det3),
        slot("Triangular determinant", "§4.2", detTri),
        slot("2×2 determinant", "§4.1", det2),
      ]},
    },
    { id: "D", name: "Invertibility", tagline: "det ≠ 0 ⟺ invertible", estMin: 12, sources: ["§4.2"],
      concept: { title: "The invertibility web", cards: [
        card(`For a square \\(A\\), these are all the same statement: \\(\\det A\\neq0\\); \\(A\\) invertible; non-singular; columns/rows independent; RREF \\(=I\\); rank \\(=n\\); \\(A\\vec x=\\vec 0\\) has only \\(\\vec x=\\vec 0\\).`),
        card(`Trap: \\(\\det A=0\\) means singular, but does NOT tell you if \\(A\\vec x=\\vec b\\) has no solution or infinitely many — that depends on \\(\\vec b\\).`),
      ]},
      guided: { intro: "Straight to the trap gauntlet.", problems: [
        gp("§4.2", "Is it invertible?", "Decide from the determinant.", [[1, 2, 1], [2, 2, 0], [1, 3, 1]],
          () => { const s = E.steps3x3([[1, 2, 1], [2, 2, 0], [1, 3, 1]], 0); s.steps.push(step("Interpret", "\\(\\det=2\\neq0\\) ⇒ invertible.")); return s; }),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Determinant algebra (T/F)", "§4.2", tfBank("§4.2", [
          { s: "\\(\\det(2A)=2\\det(A)\\) for an \\(n\\times n\\) matrix.", a: false, why: "False: \\(\\det(2A)=2^n\\det A\\)." },
          { s: "\\(\\det(A^T)=\\det(A)\\).", a: true, why: "True (Thm 4.2.18)." },
          { s: "If \\(A\\) has two identical rows, it is invertible.", a: false, why: "False: identical rows ⇒ \\(\\det=0\\) ⇒ singular." },
          { s: "\\(\\det(AB)=\\det(BA)\\) even when \\(AB\\neq BA\\).", a: true, why: "True — both equal \\(\\det A\\det B\\)." },
          { s: "\\(\\det A=0\\) guarantees \\(A\\vec x=\\vec b\\) has infinitely many solutions.", a: false, why: "False — could be no solution; depends on \\(\\vec b\\)." },
        ])),
        slot("3×3 determinant", "§4.1", det3),
        slot("Product entry", "§3", E.genMatMulEntry),
      ]},
    },
  ],
  interleave: {
    afterC: { title: "Interleave · Products + Determinants", blurb: "Two skills, back to back.", slots: [
      slot("Product entry", "review", E.genMatMulEntry), slot("3×3 determinant", "review", det3),
    ]},
  },
  mock: { title: "Boss · Ch 3–4 mixed", blurb: "No AI, no internet.", slots: [
    slot("Product entry", "Ch3–4", E.genMatMulEntry),
    slot("3×3 determinant", "Ch3–4", det3),
    slot("Triangular determinant", "Ch3–4", detTri),
    slot("Identify transform", "Ch3–4", E.genGeoTransform),
    slot("Determinant T/F", "Ch3–4", tfBank("§4.2", [
      { s: "\\(\\det(kA)=k^n\\det A\\).", a: true, why: "True." },
      { s: "Invertible \\(\\iff\\det\\neq0\\).", a: true, why: "True (Thm 4.2.15)." },
    ])),
  ]},
};
