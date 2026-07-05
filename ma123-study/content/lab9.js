/* ===================================================================
   LAB 9 PREP — Matrix Transformations & Compositions
   Confirmed style: ma123-lab-report-9 (Winter 2025) — standard matrix,
   composition = matrix product, geometric transformations.
=================================================================== */
const E = Engine, { card, gp, slot, tfBank, mcBank, numBank, step, tex, M } = H;

const CURRICULUM = {
  meta: {
    course: "MA123 · Lab 9 Prep",
    lab: "Lab 9 — Matrix Transformations",
    book: "Hu et al. — matrix transformations · Lab 9 notes",
    lede: "A transformation \\(T_A(\\vec x)=A\\vec x\\) is just “multiply by a matrix.” We cover finding the standard matrix, applying it, composing transformations (= multiplying matrices), and the eight geometric transformations.",
    pills: ["⏱ ≈ 55 min", "🎯 4 stages + boss", "📄 Source: Lab 9 notes (W25)"],
    sourceNote: "Source: <b>ma123-lab-report-9-matrix-transformations-and-compositions.pdf</b> + Lab 9 notes.",
    startLabel: "Start Stage A ›",
    doneTitle: "Lab 9 locked 🎓",
    doneText: "You can build standard matrices, apply them, compose them (order matters!), and name every geometric transformation.",
  },
  stages: [
    { id: "A", name: "Applying T", tagline: "Image of a vector under T(x)=Ax", estMin: 12, sources: ["Lab 9 notes"],
      concept: { title: "A transformation is matrix multiplication", cards: [
        card(`A <b>matrix transformation</b> is \\(T_A(\\vec x)=A\\vec x\\): feed in a vector (the <b>pre-image</b>), multiply by the <b>standard matrix</b> \\(A\\), get out a vector (the <b>image</b>). That's the entire idea.`),
        card(`Applying it is just the row-times-vector rule. For \\(A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\), \\(\\vec x=\\begin{bmatrix}5\\\\-1\\end{bmatrix}\\): \\(A\\vec x=\\begin{bmatrix}1(5)+2(-1)\\\\3(5)+4(-1)\\end{bmatrix}=\\begin{bmatrix}3\\\\11\\end{bmatrix}\\).`,
          { type: "rowop", before: [[1, 2], [3, 4]], after: [[3], [11]], op: "A\\vec x", effect: "no change" }),
        card(`Size rule: an \\(m\\times n\\) matrix sends \\(\\mathbb R^n\\to\\mathbb R^m\\). Columns of \\(A\\) = dimension in; rows = dimension out.`),
      ]},
      guided: { intro: "One worked image.", problems: [
        gp("Lab 9 notes", "Image of a vector", "Apply \\(A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\) to \\(\\vec x=(5,-1)\\).", [[1, 2], [3, 4]],
          () => ({ steps: [
            step("Row × vector", tex(`A\\vec x=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}5\\\\-1\\end{bmatrix}=\\begin{bmatrix}1(5)+2(-1)\\\\3(5)+4(-1)\\end{bmatrix}`)),
            step("Result", tex(`=\\begin{bmatrix}3\\\\11\\end{bmatrix}`)),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Image component", "Lab 9", E.genTransformImage),
        slot("Image component", "Lab 9", E.genTransformImage),
      ]},
    },
    { id: "B", name: "Finding A", tagline: "Standard matrix from a formula", estMin: 12, sources: ["Lab 9 notes"],
      concept: { title: "Build the standard matrix", cards: [
        card(`Given a formula for \\(T\\), the standard matrix is \\(A=[\\,T(\\vec e_1)\\ T(\\vec e_2)\\ \\cdots\\ T(\\vec e_n)\\,]\\): feed in each standard basis vector, and the images become the <b>columns</b>.`),
        card(`Example: \\(T(\\vec x)=(-5x_1+7x_2,\\ 9x_1-6x_2)\\). Then \\(T(\\vec e_1)=(-5,9)\\), \\(T(\\vec e_2)=(7,-6)\\), so \\(A=\\begin{bmatrix}-5&7\\\\9&-6\\end{bmatrix}\\).`),
      ]},
      guided: { intro: "One worked standard-matrix build.", problems: [
        gp("Lab 9 notes", "Standard matrix from a formula", "Find \\(A\\) for \\(T(\\vec x)=(-5x_1+7x_2,\\ 9x_1-6x_2)\\).", null,
          () => ({ steps: [
            step("Feed in e₁", tex(`T(\\vec e_1)=T(1,0)=(-5(1)+7(0),\\ 9(1)-6(0))=(-5,9)`)),
            step("Feed in e₂", tex(`T(\\vec e_2)=T(0,1)=(-5(0)+7(1),\\ 9(0)-6(1))=(7,-6)`)),
            step("Columns = images", tex(`A=\\begin{bmatrix}-5&7\\\\9&-6\\end{bmatrix}`)),
          ] })),
      ]},
      practice: { intro: "No AI, no internet. (Identify the geometric transformation.)", slots: [
        slot("Which transformation?", "Lab 9", E.genGeoTransform),
        slot("Which transformation?", "Lab 9", E.genGeoTransform),
      ]},
    },
    { id: "C", name: "Composition", tagline: "Do two transformations = multiply matrices", estMin: 14, sources: ["Lab 9 notes"],
      concept: { title: "Composition is matrix product (order matters!)", cards: [
        card(`“Apply \\(T_B\\) first, then \\(T_A\\)” is the composition \\((T_A\\circ T_B)(\\vec x)=T_A(T_B(\\vec x))=A(B\\vec x)=(AB)\\vec x\\). The standard matrix of the composition is the <b>product \\(AB\\)</b> — in that order (rightmost acts first).`),
        card(`Order matters because \\(AB\\neq BA\\) in general. “\\(T_B\\) then \\(T_A\\)” = \\(AB\\); “\\(T_A\\) then \\(T_B\\)” = \\(BA\\). Getting the order backwards is the #1 lab mistake.`),
      ]},
      guided: { intro: "One worked composition.", problems: [
        gp("Lab 9 notes", "Compose two transformations", "\\(A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\), \\(B=\\begin{bmatrix}-5&7\\\\9&-6\\end{bmatrix}\\). Find the matrix for “\\(T_B\\) then \\(T_A\\).”", null,
          () => ({ steps: [
            step("Order", "“\\(T_B\\) first, then \\(T_A\\)” ⇒ standard matrix \\(AB\\)."),
            step("Multiply", tex(`AB=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}-5&7\\\\9&-6\\end{bmatrix}=\\begin{bmatrix}1(-5)+2(9)&1(7)+2(-6)\\\\3(-5)+4(9)&3(7)+4(-6)\\end{bmatrix}`)),
            step("Result", tex(`AB=\\begin{bmatrix}13&-5\\\\21&-3\\end{bmatrix}`) + "Different from \\(BA\\) — order matters."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet. (Entry of a product AB.)", slots: [
        slot("Product entry (AB)", "§3 / Lab 9", E.genMatMulEntry),
        slot("Product entry (AB)", "§3 / Lab 9", E.genMatMulEntry),
        slot("Image component", "Lab 9", E.genTransformImage),
      ]},
    },
    { id: "D", name: "Geometry", tagline: "The eight standard 2×2 transformations", estMin: 12, sources: ["Lab 9 notes"],
      concept: { title: "Recognize the geometric matrices", cards: [
        card(`Rotation by \\(\\theta\\) (CCW): \\(\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}\\). Reflections: over x-axis \\(\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}\\), over y-axis \\(\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}\\), over \\(y=x\\) \\(\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\).`),
        card(`Stretches/scaling: horizontal \\(\\begin{bmatrix}t&0\\\\0&1\\end{bmatrix}\\), vertical \\(\\begin{bmatrix}1&0\\\\0&t\\end{bmatrix}\\), full scaling \\(\\begin{bmatrix}t&0\\\\0&t\\end{bmatrix}\\). Shears: horizontal \\(\\begin{bmatrix}1&s\\\\0&1\\end{bmatrix}\\), vertical \\(\\begin{bmatrix}1&0\\\\s&1\\end{bmatrix}\\).`),
      ]},
      guided: { intro: "Straight to the recognition gauntlet.", problems: [
        gp("Lab 9 notes", "Identify a matrix", "What does \\(\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\) do?", [[0, 1], [1, 0]],
          () => ({ steps: [
            step("Test e₁", tex(`\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\begin{bmatrix}1\\\\0\\end{bmatrix}=\\begin{bmatrix}0\\\\1\\end{bmatrix}`) + "\\((1,0)\\mapsto(0,1)\\): x and y swap."),
            step("Conclusion", "Swapping coordinates is <b>reflection over the line \\(y=x\\)</b>."),
          ] })),
      ]},
      practice: { intro: "No AI, no internet.", slots: [
        slot("Which transformation?", "Lab 9", E.genGeoTransform),
        slot("Which transformation?", "Lab 9", E.genGeoTransform),
        slot("Which transformation?", "Lab 9", E.genGeoTransform),
      ]},
    },
  ],
  interleave: {
    afterC: { title: "Interleave · Apply + Compose", blurb: "Mix applying a matrix with multiplying two.", slots: [
      slot("Image component", "review", E.genTransformImage),
      slot("Product entry", "review", E.genMatMulEntry),
    ]},
  },
  mock: { title: "Boss Gauntlet · Predicted Lab 9", blurb: "Mixed transformation questions. No AI, no internet.", slots: [
    slot("Q · image", "Predicted", E.genTransformImage),
    slot("Q · product entry", "Predicted", E.genMatMulEntry),
    slot("Q · identify transform", "Predicted", E.genGeoTransform),
    slot("Q · image", "Predicted", E.genTransformImage),
    slot("Q · identify transform", "Predicted", E.genGeoTransform),
  ]},
};
