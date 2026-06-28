/* ===================================================================
   MA123 Lab 6 — Determinants  ::  CURRICULUM
   Scope decided by "MA123 Lab 6.pdf" (lab notes): DETERMINANTS only.
   Source textbook: "Introductory Linear Algebra", Hu et al. — §4.1 & §4.2.

   Every problem is tagged with where it comes from:
     • "Lab 6 Notes"     — the example/properties in your lab handout
     • "Textbook 4.1"    — Hu et al. §4.1 worked examples
     • "Textbook 4.2"    — Hu et al. §4.2 worked examples
     • "Predicted Lab Q" — questions I expect this lab could ask

   This file is pure content. Edit a matrix, a number, or a sentence here
   and the whole app updates — no need to touch the engine or UI.
=================================================================== */

const E = Engine;

/* small helpers to build problem objects for the practice gauntlet */
function numericMatrixProblem(M, source, builder, expandRow = 0) {
  const built = builder(M, expandRow);
  return {
    type: "numeric",
    source,
    promptHtml: `Compute the determinant:`,
    matrix: M,
    answer: built.result,
    solution: { steps: built.steps },
  };
}

const CURRICULUM = {
  meta: {
    course: "MA123 — Linear Algebra with Applications",
    lab: "Lab 6 · Determinants",
    book: '“Introductory Linear Algebra”, Hu et al. — §4.1 & §4.2',
    estTotalMin: 110,
    dayMinMin: 45,
  },

  /* =================================================================
     STAGE A — COFACTOR EXPANSION (the definition)
  ================================================================= */
  stages: [
    {
      id: "A",
      name: "Cofactor Expansion",
      tagline: "2×2 and 3×3 determinants straight from the definition",
      estMin: 30,
      sources: ["Lab 6 Notes", "Textbook 4.1"],

      concept: {
        title: "What a determinant is, and the cofactor machine",
        cards: [
          {
            html: `A <b>determinant</b> is a single number squeezed out of a
              <b>square</b> matrix. Its headline job for this lab: it tells you
              whether the matrix is invertible. <b>det = 0 ⟹ singular (no inverse)</b>;
              <b>det ≠ 0 ⟹ invertible</b>. Everything in Stage A is about
              <i>computing</i> that number.`,
          },
          {
            html: `The smallest case sets the pattern. For a 2×2 matrix:
              ${E.texBlock(`\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc`)}
              Down-diagonal product <span style="color:#16a34a">ad</span> minus
              up-diagonal product <span style="color:#dc2626">bc</span>.`,
            viz: { type: "two", M: [[2, -7], [-1, 3]], phase: "diagonals" },
          },
          {
            html: `For bigger matrices we use <b>cofactor expansion</b>. The
              <b>minor</b> of an entry is the determinant of what's left after you
              <b>delete that entry's row and column</b>. The <b>cofactor</b> is the
              minor with a <b>± sign</b> attached:
              ${E.texBlock(`C_{ij} = (-1)^{i+j}\\,\\det(\\tilde{A}_{ij})`)}
              The \\((-1)^{i+j}\\) is just the checkerboard sign generator.`,
          },
          {
            html: `Memorize the sign grid as a <b>picture</b>, not a formula.
              Start at top-left = <b>+</b>, then alternate. Corners and center are
              <b>+</b>; edges are <b>−</b>.
              ${E.texBlock(`\\begin{matrix}+&-&+\\\\-&+&-\\\\+&-&+\\end{matrix}`)}`,
            viz: { type: "signgrid", n: 3 },
          },
          {
            html: `<b>The whole move:</b> pick a row, then for each entry compute
              <b>(entry) × (its sign) × (its minor)</b> and add them up. Picking a
              row with zeros saves work, because a zero entry kills its whole term.
              That's the engine you'll run for every 3×3.`,
          },
        ],
      },

      guided: {
        intro: `Three worked problems. Click <b>Next step</b> to reveal one line at
          a time — watch the matrix on the right show exactly what's changing. After
          the second one you can jump straight to practice if you feel ready.`,
        problems: [
          {
            source: "Lab 6 Notes",
            title: "Warm-up: a 2×2 determinant",
            promptHtml: `From the Lab 6 toolkit — the 2×2 shortcut you'll reuse inside every cofactor expansion.`,
            matrix: [[2, -7], [-1, 3]],
            build: () => E.steps2x2([[2, -7], [-1, 3]]),
          },
          {
            source: "Textbook 4.1",
            title: "Example 4.1.4 — 3×3 along the first row",
            promptHtml: `The first row has a <b>0</b> in it, which makes the third term vanish.`,
            matrix: [[3, 1, 0], [-2, -4, 3], [5, 4, -2]],
            build: () => E.steps3x3([[3, 1, 0], [-2, -4, 3], [5, 4, -2]], 0),
          },
          {
            source: "Lab 6 Notes",
            title: "The exact example from your lab handout",
            promptHtml: `This is the determinant worked in your Lab 6 notes — the answer is <b>120</b>.`,
            matrix: [[1, -2, 3], [-4, -5, -6], [7, -8, 9]],
            build: () => E.steps3x3([[1, -2, 3], [-4, -5, -6], [7, -8, 9]], 0),
          },
        ],
      },

      practice: {
        intro: `Gauntlet rules: <b>no AI, no calculator app, no internet.</b> Work it
          by hand on paper, type your number, and submit. Miss one and I'll reteach
          it, then hand you a fresh one until it's locked.`,
        slots: [
          {
            label: "2×2 determinants",
            source: "Predicted Lab Q",
            generate: () => {
              const g = E.gen2x2();
              return numericMatrixProblem(g.M, "Predicted Lab Q", E.steps2x2);
            },
          },
          {
            label: "2×2 determinants",
            source: "Predicted Lab Q",
            generate: () => {
              const g = E.gen2x2();
              return numericMatrixProblem(g.M, "Predicted Lab Q", E.steps2x2);
            },
          },
          {
            label: "3×3 cofactor expansion",
            source: "Predicted Lab Q",
            generate: () => {
              const g = E.gen3x3();
              return numericMatrixProblem(g.M, "Predicted Lab Q", E.steps3x3);
            },
          },
          {
            label: "3×3 cofactor expansion",
            source: "Textbook 4.1 style",
            generate: () => {
              const g = E.gen3x3();
              return numericMatrixProblem(g.M, "Textbook 4.1 style", E.steps3x3);
            },
          },
        ],
      },
    },

    /* =================================================================
       STAGE B — SMART EXPANSION: triangular + zeros
    ================================================================= */
    {
      id: "B",
      name: "Smart Expansion",
      tagline: "Triangular shortcuts and picking the lazy row/column",
      estMin: 20,
      sources: ["Textbook 4.1", "Textbook 4.2"],

      concept: {
        title: "Stop doing extra work",
        cards: [
          {
            html: `<b>Triangular matrices are free.</b> If all entries above (or all
              below) the diagonal are 0, then
              ${E.texBlock(`\\det(A) = a_{11}\\,a_{22}\\cdots a_{nn}`)}
              Just multiply the diagonal. The messy entries on the other side are
              completely ignored.`,
            viz: {
              type: "diagonal",
              M: [[-1, 0, 0], [5, 3, 0], [4, 2, 2]],
              phase: "diag",
            },
          },
          {
            html: `<b>Laplace's theorem (4.2.1):</b> you may expand along
              <b>any</b> row or column, not just the first. Same answer every time.
              So choose the row or column with the <b>most zeros</b> — each zero
              entry deletes its whole term before you do any work.`,
          },
          {
            html: `<b>A zero row or zero column ⟹ det = 0</b> (Theorem 4.2.3).
              Expanding along that line gives 0 + 0 + ⋯ + 0. Spotting this saves you
              from computing anything.`,
          },
        ],
      },

      guided: {
        intro: `Watch how choosing the right line collapses the work.`,
        problems: [
          {
            source: "Textbook 4.1",
            title: "Example 4.1.8 — a 5×5 that's secretly triangular",
            promptHtml: `Lower triangular. Ignore everything below the diagonal.`,
            matrix: [
              [-1, 0, 0, 0, 0],
              [5, 3, 0, 0, 0],
              [6, 2, 2, 0, 0],
              [4, -13, 0, 1, 0],
              [0, 9, 9, 6, -2],
            ],
            build: () =>
              E.stepsTriangular([
                [-1, 0, 0, 0, 0],
                [5, 3, 0, 0, 0],
                [6, 2, 2, 0, 0],
                [4, -13, 0, 1, 0],
                [0, 9, 9, 6, -2],
              ]),
          },
          {
            source: "Textbook 4.2",
            title: "Example 4.2.2 — expand along the sparse row",
            promptHtml: `Row 2 is \\([0\\ 1\\ 0\\ 0]\\): only one nonzero entry, so only one term survives.`,
            matrix: [
              [1, 3, 1, 2],
              [0, 1, 0, 0],
              [0, 2, -2, 0],
              [-1, 2, 1, 1],
            ],
            build: () => stage_B_example_422(),
          },
        ],
      },

      practice: {
        intro: `No AI, no internet — by hand only. Pick the lazy line!`,
        slots: [
          {
            label: "Triangular determinant",
            source: "Predicted Lab Q",
            generate: () => {
              const g = E.genTriangular(3);
              return numericMatrixProblem(
                g.M,
                "Predicted Lab Q",
                E.stepsTriangular
              );
            },
          },
          {
            label: "Triangular determinant (4×4)",
            source: "Predicted Lab Q",
            generate: () => {
              const g = E.genTriangular(4);
              return numericMatrixProblem(
                g.M,
                "Predicted Lab Q",
                E.stepsTriangular
              );
            },
          },
          {
            label: "4×4 — expand the sparse row",
            source: "Textbook 4.2 style",
            generate: () => {
              const g = E.genSparse4();
              // expand along row 2 (index 1) which is sparse
              return numericMatrixProblem(
                g.M,
                "Textbook 4.2 style",
                (M) => stepsExpandAnyRow(M, 1)
              );
            },
          },
        ],
      },
    },

    /* =================================================================
       STAGE C — ELEMENTARY ROW/COLUMN OPERATIONS
    ================================================================= */
    {
      id: "C",
      name: "Row Operations",
      tagline: "How swapping, scaling, and adding rows change the determinant",
      estMin: 25,
      sources: ["Lab 6 Notes", "Textbook 4.2"],

      concept: {
        title: "Three operations, three effects",
        cards: [
          {
            html: `<b>Swap two rows ⟹ flip the sign.</b>
              ${E.texBlock(`\\det(A_2) = -\\det(A)`)}
              One swap = one factor of \\(-1\\). Two swaps cancel out.`,
            viz: {
              type: "rowop",
              before: [[3, -6, 9], [0, 1, 5], [2, 6, 5]],
              after: [[0, 1, 5], [3, -6, 9], [2, 6, 5]],
              op: "R_1 \\leftrightarrow R_2",
              effect: "× (−1)",
            },
          },
          {
            html: `<b>Multiply one row by \\(r\\) ⟹ determinant ×\\(r\\).</b>
              ${E.texBlock(`\\det(A_1) = r\\,\\det(A)`)}
              Careful — this only pulls out <b>one</b> factor (one row). Scaling the
              <b>whole</b> matrix is different (that's Stage D).`,
            viz: {
              type: "rowop",
              before: [[3, -6, 9], [0, 1, 5], [2, 6, 5]],
              after: [[1, -2, 3], [0, 1, 5], [2, 6, 5]],
              op: "\\tfrac{1}{3}R_1 \\to R_1",
              effect: "pulls out × 3",
            },
          },
          {
            html: `<b>Add a multiple of one row to another ⟹ determinant unchanged.</b>
              ${E.texBlock(`\\det(A_3) = \\det(A)`)}
              This is the workhorse: use it freely to manufacture zeros and march the
              matrix toward triangular form, with <b>no</b> bookkeeping.`,
            viz: {
              type: "rowop",
              before: [[1, -2, 3], [0, 1, 5], [2, 6, 5]],
              after: [[1, -2, 3], [0, 1, 5], [0, 10, -1]],
              op: "-2R_1 + R_3 \\to R_3",
              effect: "no change",
            },
          },
          {
            html: `<b>Strategy:</b> use “add a multiple” (free) to make zeros, and
              only record the sign flips from swaps and the factors from scaling.
              Carry those factors to the very end and multiply them onto the
              triangular product.`,
          },
        ],
      },

      guided: {
        intro: `Two full reductions. Notice which operations cost you a factor and which are free.`,
        problems: [
          {
            source: "Textbook 4.2",
            title: "Example 4.2.11 — one move to triangular",
            promptHtml: `Add \\(-3R_4\\) to \\(R_1\\) (a free operation) and the matrix becomes lower triangular.`,
            matrix: [[-5, 0, 6, 3], [1, 3, 0, 0], [3, 6, 7, 0], [7, 0, 2, 1]],
            build: () => stage_C_example_4211(),
          },
          {
            source: "Textbook 4.2",
            title: "Example 4.2.22 — track the swap and the scale",
            promptHtml: `A swap (×−1) and a scale (×3) get carried to the end. Answer is <b>153</b>.`,
            matrix: [[0, 1, 5], [3, -6, 9], [2, 6, 5]],
            build: () => stage_C_example_4222(),
          },
        ],
      },

      practice: {
        intro: `No AI, no internet. These test the <b>effect</b> of an operation —
          the kind of quick-reasoning question a lab loves.`,
        slots: [
          { label: "Effect of an operation", source: "Lab 6 Notes", generate: genRowOpEffect },
          { label: "Effect of an operation", source: "Lab 6 Notes", generate: genRowOpEffect },
          { label: "Effect of an operation", source: "Predicted Lab Q", generate: genRowOpEffect },
        ],
      },
    },

    /* =================================================================
       STAGE D — DETERMINANT ALGEBRA & ZERO-SHORTCUTS
    ================================================================= */
    {
      id: "D",
      name: "Determinant Algebra",
      tagline: "Products, transposes, scalars, inverses, and instant zeros",
      estMin: 20,
      sources: ["Lab 6 Notes", "Textbook 4.2"],

      concept: {
        title: "The algebra rules (and the famous traps)",
        cards: [
          {
            html: `<b>Instant zeros.</b> If a matrix has a zero row/column, two equal
              rows, or two <b>proportional</b> rows/columns, then \\(\\det = 0\\)
              with no computation (Thms 4.2.3, 4.2.6, Prop 4.2.19).`,
            viz: { type: "matrixOnly", M: [[1, -2, 7], [-4, 8, 5], [2, -4, 3]], note: "Columns 1 & 2 are proportional → det = 0" },
          },
          {
            html: `<b>Transpose does nothing:</b> \\(\\det(A^{T}) = \\det(A)\\).
              That's why every row rule also works for columns.`,
          },
          {
            html: `<b>Products multiply:</b> \\(\\det(AB) = \\det(A)\\det(B)\\), and
              \\(\\det(AB)=\\det(BA)\\) even though \\(AB\\neq BA\\). For the inverse:
              \\(\\det(A^{-1}) = \\dfrac{1}{\\det(A)}\\).
              <br><b>Warning:</b> there is <i>no</i> rule for \\(\\det(A+B)\\).`,
          },
          {
            html: `<b>The scalar trap:</b> for an \\(n\\times n\\) matrix,
              ${E.texBlock(`\\det(kA) = k^{n}\\det(A)`)}
              not \\(k\\det(A)\\). Each of the \\(n\\) rows contributes one factor of
              \\(k\\). And mind the sign: \\(\\det(-2A) = (-2)^{n}\\det(A)\\) — negative
              when \\(n\\) is odd, positive when \\(n\\) is even.`,
          },
        ],
      },

      guided: {
        intro: `These are short logic problems — exactly the style of quick lab/exam questions.`,
        problems: [
          {
            source: "Textbook 4.2",
            title: "Example 4.2.28(b) — spot the proportional columns",
            promptHtml: `No expansion needed once you see the pattern.`,
            matrix: [[1, -2, 7], [-4, 8, 5], [2, -4, 3]],
            build: () => stage_D_proportional(),
          },
          {
            source: "Lab 6 Notes",
            title: "Determinant algebra chain",
            promptHtml: `Given \\(\\det(A)=3,\\ \\det(B)=-2\\), with \\(A,B\\) of order 3.`,
            matrix: null,
            build: () => stage_D_algebra(),
          },
        ],
      },

      practice: {
        intro: `No AI, no internet. Reason it out, type the number.`,
        slots: [
          { label: "det(kA) scalar trap", source: "Predicted Lab Q", generate: () => propProblem(E.genScalarMultiple()) },
          { label: "det(AB) product", source: "Predicted Lab Q", generate: () => propProblem(E.genProduct()) },
          { label: "det(A⁻¹) inverse", source: "Predicted Lab Q", generate: () => propProblem(E.genInverse()) },
          { label: "Instant-zero spotting", source: "Textbook 4.2 style", generate: genZeroSpot },
        ],
      },
    },

    /* =================================================================
       STAGE E — INVERTIBILITY & THE EQUIVALENT STATEMENTS
    ================================================================= */
    {
      id: "E",
      name: "Invertibility",
      tagline: "det ≠ 0 and the chain of equivalent statements",
      estMin: 15,
      sources: ["Lab 6 Notes", "Textbook 4.2"],

      concept: {
        title: "What det = 0 really tells you",
        cards: [
          {
            html: `<b>The master fact:</b> \\(A\\) is invertible
              <b>if and only if</b> \\(\\det(A)\\neq 0\\) (Thm 4.2.15). This is the
              hub that connects determinants to everything else in the lab.`,
          },
          {
            html: `From your Lab 6 notes, these are all <b>the same statement</b>:
              <ul style="margin:.4em 0 0 1.1em;line-height:1.7">
                <li>\\(\\det(A)\\neq 0\\)</li>
                <li>\\(A\\) is invertible</li>
                <li>\\(A\\) is non-singular</li>
                <li>columns/rows are linearly independent</li>
                <li>the RREF of \\(A\\) is the identity \\(I\\)</li>
                <li>\\(\\operatorname{rank}(A)=n\\)</li>
                <li>\\(A\\vec{x}=\\vec 0\\) has only the trivial solution</li>
              </ul>`,
          },
          {
            html: `<b>The trap (Cramer-style):</b> \\(\\det(A)=0\\) means
              <b>singular</b>, but it does <b>not</b> tell you the system
              \\(A\\vec x=\\vec b\\) has infinitely many solutions. It could have
              <b>none</b> instead — which one depends on \\(\\vec b\\).
              Counterexample: \\(A=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix},\\
              \\vec b=\\begin{bmatrix}0\\\\1\\end{bmatrix}\\) → no solution.`,
          },
        ],
      },

      guided: {
        intro: `Two reasoning problems and one parameter problem.`,
        problems: [
          {
            source: "Textbook 4.2",
            title: "Example 4.2.17 — is it invertible?",
            promptHtml: `Compute the determinant; nonzero ⟹ invertible.`,
            matrix: [[1, 2, 1], [2, 2, 0], [1, 3, 1]],
            build: () => stage_E_invertible(),
          },
          {
            source: "Predicted Lab Q",
            title: "Find the value that makes A singular",
            promptHtml: `Set the determinant to 0 and solve for \\(x\\).`,
            matrix: null,
            build: () => stage_E_parameter(),
          },
        ],
      },

      practice: {
        intro: `No AI, no internet. Some are True/False — commit to an answer first.`,
        slots: [
          { label: "Invertible or not?", source: "Predicted Lab Q", generate: genInvertibleNumeric },
          { label: "Find x making A singular", source: "Predicted Lab Q", generate: genSingularParam },
          { label: "True / False trap", source: "Lab 6 Notes", generate: genInvertTF },
          { label: "True / False trap", source: "Lab 6 Notes", generate: genInvertTF },
        ],
      },
    },
  ],

  /* =================================================================
     INTERLEAVED REVIEW — spaced recall woven into the recommended path
     (each entry pulls fresh problems from earlier stages)
  ================================================================= */
  interleave: {
    // after which stage id the review appears  ->  which generators to pull
    afterB: {
      title: "Interleave · Review of Stage A",
      blurb:
        "You just learned shortcuts. Before moving on, prove the raw cofactor skill still fires cold.",
      slots: [
        { label: "Stage A recall · 2×2", generate: () => numericMatrixProblem(E.gen2x2().M, "Stage A review", E.steps2x2) },
        { label: "Stage A recall · 3×3", generate: () => numericMatrixProblem(E.gen3x3().M, "Stage A review", E.steps3x3) },
      ],
    },
    afterC: {
      title: "Interleave · Review of Stages A & B",
      blurb: "Mix raw expansion with triangular shortcuts.",
      slots: [
        { label: "Stage A recall · 3×3", generate: () => numericMatrixProblem(E.gen3x3().M, "Stage A review", E.steps3x3) },
        { label: "Stage B recall · triangular", generate: () => numericMatrixProblem(E.genTriangular(3).M, "Stage B review", E.stepsTriangular) },
      ],
    },
    afterD: {
      title: "Interleave · Review of Stages B & C",
      blurb: "Shortcuts plus operation-effects, side by side.",
      slots: [
        { label: "Stage B recall · 4×4 sparse", generate: () => numericMatrixProblem(E.genSparse4().M, "Stage B review", (M) => stepsExpandAnyRow(M, 1)) },
        { label: "Stage C recall · op effect", generate: genRowOpEffect },
      ],
    },
    afterE: {
      title: "Interleave · Everything together",
      blurb: "A small taste of all five stages before the boss gauntlet.",
      slots: [
        { label: "Recall · 3×3", generate: () => numericMatrixProblem(E.gen3x3().M, "All-stage review", E.steps3x3) },
        { label: "Recall · det(kA)", generate: () => propProblem(E.genScalarMultiple()) },
        { label: "Recall · invertibility T/F", generate: genInvertTF },
      ],
    },
  },

  /* =================================================================
     MOCK LAB GAUNTLET — predicted Lab 6 questions, fully interleaved
  ================================================================= */
  mock: {
    title: "Boss Gauntlet · Predicted Lab 6",
    blurb: `A shuffled mix of every skill, written in the style I expect this lab to
      use. No AI, no internet — this is your dress rehearsal. Clear it and you're
      ready.`,
    slots: [
      { label: "Q · 3×3 by hand", generate: () => numericMatrixProblem(E.gen3x3().M, "Predicted Lab Q", E.steps3x3) },
      { label: "Q · triangular", generate: () => numericMatrixProblem(E.genTriangular(4).M, "Predicted Lab Q", E.stepsTriangular) },
      { label: "Q · det(kA) trap", generate: () => propProblem(E.genScalarMultiple()) },
      { label: "Q · 4×4 smart row", generate: () => numericMatrixProblem(E.genSparse4().M, "Predicted Lab Q", (M) => stepsExpandAnyRow(M, 1)) },
      { label: "Q · det(AB)", generate: () => propProblem(E.genProduct()) },
      { label: "Q · instant zero", generate: genZeroSpot },
      { label: "Q · invertibility T/F", generate: genInvertTF },
      { label: "Q · find x singular", generate: genSingularParam },
    ],
  },
};

/* ===================================================================
   CUSTOM STEP BUILDERS (used by guided problems above)
=================================================================== */

// generic cofactor expansion along an arbitrary row (for 4×4 sparse)
function stepsExpandAnyRow(M, row) {
  const n = M.length;
  const result = E.det(M);
  const steps = [];
  steps.push({
    title: `Expand along row ${row + 1}`,
    html: `Row ${row + 1} has the most zeros, so most terms die instantly.
      Surviving terms are <b>entry × sign × minor</b>.`,
    viz: { type: "cofactor", M, row, phase: "intro" },
  });
  for (let j = 0; j < n; j++) {
    const entry = M[row][j];
    if (entry === 0) continue;
    const sgn = (row + j) % 2 === 0 ? 1 : -1;
    const sub = E.minor(M, row, j);
    steps.push({
      title: `Nonzero entry in column ${j + 1}`,
      html: `${E.texBlock(
        `${sgn === 1 ? "+" : "-"}\\,(${E.paren(entry)})\\cdot${E.latexMatrix(
          sub,
          "v"
        )} = ${sgn === 1 ? "+" : "-"}\\,(${E.paren(entry)})\\cdot(${E.fmt(
          E.det(sub)
        )})`
      )}`,
      viz: { type: "cofactor", M, row, phase: "term", col: j, sign: sgn, minor: sub },
    });
  }
  steps.push({
    title: "Result",
    html: E.texBlock(`\\det(A) = \\mathbf{${E.fmt(result)}}`),
    viz: { type: "cofactor", M, row, phase: "result", result },
  });
  return { result, steps };
}

function stage_B_example_422() {
  const M = [[1, 3, 1, 2], [0, 1, 0, 0], [0, 2, -2, 0], [-1, 2, 1, 1]];
  const sub = [[1, 1, 2], [0, -2, 0], [-1, 1, 1]];
  return {
    result: -6,
    steps: [
      {
        title: "Find the sparse line",
        html: `Row 2 is \\([0\\ 1\\ 0\\ 0]\\) — only the \\(1\\) in column 2 survives.
          Its sign is \\((-1)^{2+2}=+\\).`,
        viz: { type: "cofactor", M, row: 1, phase: "term", col: 1, sign: 1, minor: sub },
      },
      {
        title: "Drop to a 3×3",
        html: E.texBlock(`\\det(A) = 1\\cdot${E.latexMatrix(sub, "v")}`),
        viz: { type: "cofactor", M, row: 1, phase: "term", col: 1, sign: 1, minor: sub },
      },
      {
        title: "That 3×3 also has a sparse row",
        html: `Row 2 of the new matrix is \\([0\\ -2\\ 0]\\). Expand again:
          ${E.texBlock(`= -2\\cdot${E.latexMatrix([[1, 2], [-1, 1]], "v")}`)}`,
        viz: { type: "matrixOnly", M: sub, note: "Expand along its row 2 next" },
      },
      {
        title: "Finish",
        html: E.texBlock(
          `= -2\\big((1)(1)-(2)(-1)\\big) = -2(3) = \\mathbf{-6}`
        ),
        viz: { type: "matrixOnly", M, note: "det(A) = −6" },
      },
    ],
  };
}

function stage_C_example_4211() {
  const before = [[-5, 0, 6, 3], [1, 3, 0, 0], [3, 6, 7, 0], [7, 0, 2, 1]];
  const after = [[-26, 0, 0, 0], [1, 3, 0, 0], [3, 6, 7, 0], [7, 0, 2, 1]];
  return {
    result: -546,
    steps: [
      {
        title: "Goal: reach triangular cheaply",
        html: `Row 1 is close to clean. Use the <b>free</b> operation “add a multiple
          of a row” to wipe out its nonzero off-diagonal entries.`,
        viz: { type: "matrixOnly", M: before, note: "Target: lower triangular" },
      },
      {
        title: "One free move: −3R₄ + R₁ → R₁",
        html: `\\(R_1=[-5,0,6,3]\\), \\(-3R_4=[-21,0,-6,-3]\\). Adding gives
          \\([-26,0,0,0]\\). Type-3 operation ⟹ <b>determinant unchanged</b>.`,
        viz: { type: "rowop", before, after, op: "-3R_4 + R_1 \\to R_1", effect: "no change" },
      },
      {
        title: "Now it's lower triangular",
        html: E.texBlock(
          `\\det(A) = (-26)\\times 3\\times 7\\times 1`
        ),
        viz: { type: "diagonal", M: after, phase: "diag" },
      },
      {
        title: "Result",
        html: E.texBlock(`\\det(A) = \\mathbf{-546}`),
        viz: { type: "diagonal", M: after, phase: "result", result: -546 },
      },
    ],
  };
}

function stage_C_example_4222() {
  const m0 = [[0, 1, 5], [3, -6, 9], [2, 6, 5]];
  const m1 = [[3, -6, 9], [0, 1, 5], [2, 6, 5]];
  const m2 = [[1, -2, 3], [0, 1, 5], [2, 6, 5]];
  const m3 = [[1, -2, 3], [0, 1, 5], [0, 10, -1]];
  const m4 = [[1, -2, 3], [0, 1, 5], [0, 0, -51]];
  return {
    result: 153,
    steps: [
      {
        title: "Swap to get a nonzero pivot (×−1)",
        html: `Top-left is 0, so swap \\(R_1\\leftrightarrow R_2\\). Record a factor
          of \\(-1\\) out front.`,
        viz: { type: "rowop", before: m0, after: m1, op: "R_1 \\leftrightarrow R_2", effect: "× (−1)" },
      },
      {
        title: "Scale the pivot row (pulls out ×3)",
        html: `Divide \\(R_1\\) by 3 to make the pivot 1. That pulls a factor of 3
          out, so the running constant is \\(-3\\).`,
        viz: { type: "rowop", before: m1, after: m2, op: "\\tfrac13 R_1 \\to R_1", effect: "pulls out × 3" },
      },
      {
        title: "Free move: clear column 1",
        html: `\\(-2R_1+R_3\\to R_3\\) (type 3, no change).`,
        viz: { type: "rowop", before: m2, after: m3, op: "-2R_1 + R_3 \\to R_3", effect: "no change" },
      },
      {
        title: "Free move: clear column 2",
        html: `\\(-10R_2+R_3\\to R_3\\) (type 3, no change) → upper triangular.`,
        viz: { type: "rowop", before: m3, after: m4, op: "-10R_2 + R_3 \\to R_3", effect: "no change" },
      },
      {
        title: "Multiply diagonal × the carried constant",
        html: E.texBlock(
          `\\det(A) = (-3)\\cdot(1)(1)(-51) = \\mathbf{153}`
        ),
        viz: { type: "diagonal", M: m4, phase: "result", result: 153 },
      },
    ],
  };
}

function stage_D_proportional() {
  const M = [[1, -2, 7], [-4, 8, 5], [2, -4, 3]];
  return {
    result: 0,
    steps: [
      {
        title: "Look before you compute",
        html: `Compare column 1 \\((1,-4,2)\\) and column 2 \\((-2,8,-4)\\). Column 2
          is exactly \\(-2\\times\\) column 1 — they're <b>proportional</b>.`,
        viz: { type: "matrixOnly", M, note: "Col 2 = −2 · Col 1" },
      },
      {
        title: "Apply the rule",
        html: `Proportional rows/columns ⟹ \\(\\det = 0\\) (Prop 4.2.19c). No
          expansion required.`,
        viz: { type: "matrixOnly", M, note: "det = 0" },
      },
      { title: "Result", html: E.texBlock(`\\det(A) = \\mathbf{0}`), viz: { type: "matrixOnly", M, note: "det = 0" } },
    ],
  };
}

function stage_D_algebra() {
  return {
    result: null,
    steps: [
      {
        title: "Given",
        html: `\\(\\det(A)=3,\\ \\det(B)=-2\\), order \\(n=3\\). We'll chain the rules.`,
        viz: { type: "none" },
      },
      {
        title: "Product & transpose",
        html: E.texBlock(`\\det(A^{T}B) = \\det(A)\\det(B) = (3)(-2) = -6`),
        viz: { type: "none" },
      },
      {
        title: "Scalar (the trap)",
        html: E.texBlock(`\\det(2A) = 2^{3}\\det(A) = 8\\cdot 3 = 24`),
        viz: { type: "none" },
      },
      {
        title: "Inverse",
        html: E.texBlock(`\\det(A^{-1}) = \\frac{1}{\\det(A)} = \\frac{1}{3}`),
        viz: { type: "none" },
      },
    ],
  };
}

function stage_E_invertible() {
  const M = [[1, 2, 1], [2, 2, 0], [1, 3, 1]];
  const inner = E.steps3x3(M, 0);
  const steps = inner.steps.slice();
  steps.push({
    title: "Interpret the result",
    html: `\\(\\det(A) = 2 \\neq 0\\), so by Thm 4.2.15 \\(A\\) is <b>invertible</b>
      (equivalently: non-singular, RREF \\(=I\\), rank \\(=3\\), columns independent).`,
    viz: { type: "matrixOnly", M, note: "det = 2 ≠ 0 → invertible" },
  });
  return { result: 2, steps };
}

function stage_E_parameter() {
  return {
    result: 6,
    steps: [
      {
        title: "The matrix",
        html: E.texBlock(`A=\\begin{bmatrix}1&2\\\\3&x\\end{bmatrix}`),
        viz: { type: "matrixOnly", M: [["1", "2"], ["3", "x"]], note: "Find x making A singular" },
      },
      {
        title: "Singular means det = 0",
        html: E.texBlock(`\\det(A) = (1)(x) - (2)(3) = x - 6`),
        viz: { type: "none" },
      },
      {
        title: "Solve",
        html: E.texBlock(`x - 6 = 0 \\ \\Rightarrow\\ x = \\mathbf{6}`) +
          `<p style="margin-top:.4em">At \\(x=6\\) the rows become proportional, so \\(A\\) is singular (not invertible).</p>`,
        viz: { type: "none" },
      },
    ],
  };
}

/* ===================================================================
   PRACTICE GENERATORS for property / reasoning slots
=================================================================== */

// turn a property generator (from engine) into a gauntlet problem
function propProblem(g) {
  return {
    type: "numeric",
    source: "Predicted Lab Q",
    promptHtml: g.prompt,
    matrix: null,
    answer: g.answer,
    reteachHtml: g.reteach,
  };
}

// effect-of-operation question
function genRowOpEffect() {
  const ops = [
    {
      text: (d) => `\\(B\\) is obtained from \\(A\\) by <b>swapping two rows</b>. If \\(\\det(A)=${d}\\), find \\(\\det(B)\\).`,
      f: (d) => -d,
      why: (d) => `Swapping two rows flips the sign: \\(\\det(B) = -\\det(A) = -(${d}) = ${-d}.\\)`,
    },
    {
      text: (d, k) => `\\(B\\) is obtained from \\(A\\) by <b>multiplying one row by ${k}</b>. If \\(\\det(A)=${d}\\), find \\(\\det(B)\\).`,
      f: (d, k) => d * k,
      why: (d, k) => `Scaling a single row by \\(k\\) scales the determinant by \\(k\\): \\(\\det(B)=${k}\\cdot(${d})=${d * k}.\\)`,
    },
    {
      text: (d, k) => `\\(B\\) is obtained from \\(A\\) by <b>adding ${k} times row 1 to row 2</b>. If \\(\\det(A)=${d}\\), find \\(\\det(B)\\).`,
      f: (d) => d,
      why: (d) => `Adding a multiple of one row to another <b>does not change</b> the determinant: \\(\\det(B)=\\det(A)=${d}.\\)`,
    },
  ];
  const o = ops[Math.floor(Math.random() * ops.length)];
  const d = ((Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 8) + 2));
  const k = Math.floor(Math.random() * 4) + 2;
  return {
    type: "numeric",
    source: "Lab 6 Notes",
    promptHtml: o.text(d, k),
    matrix: null,
    answer: o.f(d, k),
    reteachHtml: o.why(d, k),
  };
}

// instant-zero spotting (MC)
function genZeroSpot() {
  const zeroMats = [
    { M: [[2, 4], [1, 2]], why: "Row 2 is ½·Row 1 — proportional rows ⟹ det = 0." },
    { M: [[1, 2, 3], [0, 0, 0], [4, 5, 6]], why: "Row 2 is all zeros ⟹ det = 0." },
    { M: [[3, 1, 6], [2, 5, 4], [1, 7, 2]], why: "Column 3 = 2·Column 1 — proportional columns ⟹ det = 0." },
  ];
  const z = zeroMats[Math.floor(Math.random() * zeroMats.length)];
  const nzG = E.gen3x3();
  // ensure nonzero is actually nonzero
  let nzM = nzG.M, nzd = nzG.answer, guard = 0;
  while (nzd === 0 && guard++ < 20) {
    const g = E.gen3x3();
    nzM = g.M;
    nzd = g.answer;
  }
  const optionA = { html: E.texBlock(E.latexMatrix(z.M, "b")), correct: true, why: z.why };
  const optionB = {
    html: E.texBlock(E.latexMatrix(nzM, "b")),
    correct: false,
    why: `This one has \\(\\det = ${E.fmt(nzd)} \\neq 0\\) — it's invertible, not an instant zero.`,
  };
  const choices = Math.random() < 0.5 ? [optionA, optionB] : [optionB, optionA];
  return {
    type: "mc",
    source: "Textbook 4.2 style",
    promptHtml: `Which matrix has determinant <b>0</b> by inspection (no computation)?`,
    choices,
    answer: choices.findIndex((c) => c.correct),
  };
}

// invertible-or-not from a generated matrix
function genInvertibleNumeric() {
  const g = Math.random() < 0.5 ? E.gen2x2() : E.gen3x3();
  const invertible = g.answer !== 0;
  return {
    type: "mc",
    source: "Predicted Lab Q",
    promptHtml: `Is this matrix invertible? ${E.texBlock(E.latexMatrix(g.M, "b"))}
      (Compute the determinant first.)`,
    choices: [
      { html: "Invertible (det ≠ 0)", correct: invertible },
      { html: "Not invertible / singular (det = 0)", correct: !invertible },
    ],
    answer: invertible ? 0 : 1,
    reteachHtml: `\\(\\det = ${E.fmt(g.answer)}\\). Since it is ${
      invertible ? "nonzero" : "zero"
    }, the matrix is ${invertible ? "<b>invertible</b>" : "<b>singular</b>"}.`,
  };
}

// find x making a 2×2 / triangular matrix singular
function genSingularParam() {
  const forms = [
    () => {
      const a = nzr(), b = nzr(), c = nzr();
      // [[a,b],[c,x]] singular: a*x - b*c = 0 -> x = b*c/a, choose a dividing
      let A = a, B = b, C = c;
      // make divisible
      const x = ((Math.floor(Math.random() * 5) + 1)) * (Math.random() < 0.5 ? -1 : 1);
      B = Math.random() < 0.5 ? B : B; // keep
      const prod = A * x; // we want a*x = b*c -> set c so b*c = a*x
      // pick b then c = a*x / b if divisible, else fallback
      let bb = nzr();
      // choose cc so bb*cc = A*x
      // ensure integer: pick cc as divisor
      let cc = null;
      for (let t = -6; t <= 6; t++) {
        if (t !== 0 && bb * t === A * x) { cc = t; break; }
      }
      if (cc === null) { bb = 1; cc = A * x; }
      const M = [[A, bb], [cc, "x"]];
      return {
        promptHtml: `For which value of \\(x\\) is this matrix <b>singular</b> (not invertible)? ${E.texBlock(E.latexMatrix(M, "b"))}`,
        answer: x,
        reteachHtml: `Singular ⟺ \\(\\det=0\\). Here \\(\\det = (${A})x - (${bb})(${cc}) = ${A}x - (${bb * cc})\\). Set \\(=0\\): \\(x = \\dfrac{${bb * cc}}{${A}} = ${x}.\\)`,
      };
    },
    () => {
      // triangular [[2,*,*],[0,x,*],[0,0,3]] singular when diagonal product 0 -> x=0
      const M = [[2, 4, 1], [0, "x", 5], [0, 0, 3]];
      return {
        promptHtml: `This upper-triangular matrix is singular for which \\(x\\)? ${E.texBlock(E.latexMatrix(M, "b"))}`,
        answer: 0,
        reteachHtml: `Triangular ⟹ \\(\\det = 2\\cdot x\\cdot 3 = 6x\\). It is 0 only when \\(x=0\\).`,
      };
    },
  ];
  const f = forms[Math.floor(Math.random() * forms.length)]();
  return { type: "numeric", source: "Predicted Lab Q", matrix: null, ...f };
}

function nzr() {
  let v = 0;
  while (v === 0) v = Math.floor(Math.random() * 11) - 5;
  return v;
}

// invertibility True/False traps
function genInvertTF() {
  const bank = [
    {
      s: "If \\(\\det(A)=0\\), then \\(A\\vec x=\\vec b\\) has infinitely many solutions.",
      ans: false,
      why: "False. \\(\\det(A)=0\\) means singular — the system has either NO solution or infinitely many; which one depends on \\(\\vec b\\). Counterexample: \\(\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}\\vec x=\\begin{bmatrix}0\\\\1\\end{bmatrix}\\) has no solution.",
    },
    {
      s: "If \\(\\det(A)\\neq 0\\), then the columns of \\(A\\) are linearly independent.",
      ans: true,
      why: "True. \\(\\det\\neq 0\\) is equivalent to invertibility, which is equivalent to linearly independent columns (and rank \\(=n\\), RREF \\(=I\\)).",
    },
    {
      s: "For an \\(n\\times n\\) matrix, \\(\\det(2A) = 2\\,\\det(A)\\).",
      ans: false,
      why: "False. \\(\\det(2A)=2^{n}\\det(A)\\). It equals \\(2\\det(A)\\) only when \\(n=1\\).",
    },
    {
      s: "\\(\\det(A^{T}) = \\det(A)\\) for every square matrix \\(A\\).",
      ans: true,
      why: "True (Thm 4.2.18). That's exactly why every row property has a column twin.",
    },
    {
      s: "If \\(A\\) has two identical rows, then \\(A\\) is invertible.",
      ans: false,
      why: "False. Two identical rows ⟹ \\(\\det = 0\\) ⟹ singular (not invertible).",
    },
    {
      s: "\\(\\det(AB) = \\det(BA)\\) even when \\(AB \\neq BA\\).",
      ans: true,
      why: "True. Both equal \\(\\det(A)\\det(B)\\); the determinant forgets non-commutativity.",
    },
    {
      s: "There is a rule \\(\\det(A+B) = \\det(A)+\\det(B)\\).",
      ans: false,
      why: "False. No such rule. Example: \\(\\det(I+I)=\\det(2I)=2^{n}\\neq 1+1\\) for \\(n\\ge 2\\).",
    },
  ];
  const q = bank[Math.floor(Math.random() * bank.length)];
  return {
    type: "tf",
    source: "Lab 6 Notes",
    promptHtml: q.s,
    answer: q.ans,
    reteachHtml: q.why,
  };
}
