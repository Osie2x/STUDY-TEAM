/* ===================================================================
   MA123 Lab 6 — Determinants Engine
   Pure math: determinant computation + verified step-by-step solution
   generators + interactive-matrix visualization state builders.

   Everything in here is data-in / data-out. The UI layer (app.js)
   turns the returned "step" objects into the on-screen step player.
   Keeping the math here means every guided walkthrough AND every
   auto-generated practice/reteach solution is guaranteed correct.
=================================================================== */

const Engine = (() => {
  /* ---------- number formatting helpers ---------- */
  const fmt = (n) => {
    // pass strings (symbolic entries like "x") straight through
    if (typeof n !== "number") return String(n);
    // keep small fractions readable, otherwise integers
    if (Number.isInteger(n)) return String(n);
    const r = Math.round(n * 1000) / 1000;
    return String(r);
  };
  // wrap negatives in parentheses for clean multiplication display
  const paren = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));

  /* ---------- matrix helpers ---------- */
  const clone = (M) => M.map((row) => row.slice());
  const size = (M) => M.length;

  const minor = (M, i, j) =>
    M.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j));

  // recursive determinant via first-row cofactor expansion (exact for ints)
  const det = (M) => {
    const n = M.length;
    if (n === 1) return M[0][0];
    if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
    let total = 0;
    for (let j = 0; j < n; j++) {
      const sign = j % 2 === 0 ? 1 : -1;
      total += sign * M[0][j] * det(minor(M, 0, j));
    }
    return total;
  };

  /* ---------- LaTeX matrix rendering ---------- */
  // kind: 'b' => bmatrix (brackets), 'v' => vmatrix (det bars)
  const latexMatrix = (M, kind = "b", highlight = null) => {
    const env = kind === "v" ? "vmatrix" : "bmatrix";
    const body = M.map((row, r) =>
      row
        .map((val, c) => {
          let cell = fmt(val);
          if (
            highlight &&
            highlight.r === r &&
            (highlight.c === undefined || highlight.c === c)
          ) {
            cell = `\\boxed{${cell}}`;
          }
          return cell;
        })
        .join(" & ")
    ).join(" \\\\ ");
    return `\\begin{${env}}${body}\\end{${env}}`;
  };

  const tex = (s) => `\\(${s}\\)`;
  const texBlock = (s) => `\\[${s}\\]`;

  /* ===================================================================
     STEP GENERATORS
     A "step" = { title, html, viz } where viz is an optional config the
     visualizer in app.js can render (highlighting / crossing out cells).
  =================================================================== */

  /* ----- 2x2 determinant, fully worked ----- */
  const steps2x2 = (M) => {
    const [[a, b], [c, d]] = M;
    const result = a * d - b * c;
    return {
      result,
      steps: [
        {
          title: "Set up the 2×2 rule",
          html: `A 2×2 determinant is the <b>down-diagonal product minus the up-diagonal product</b>.
                 ${texBlock(`\\det${latexMatrix(M, "b")} = ad - bc`)}`,
          viz: { type: "two", M, phase: "setup" },
        },
        {
          title: "Mark the diagonals",
          html: `Green diagonal (top-left → bottom-right) is <b>+ad</b>.
                 Red diagonal (top-right → bottom-left) is <b>−bc</b>.`,
          viz: { type: "two", M, phase: "diagonals" },
        },
        {
          title: "Substitute the numbers",
          html: texBlock(
            `\\det(A) = (${fmt(a)})(${fmt(d)}) - (${fmt(b)})(${fmt(c)})`
          ),
          viz: { type: "two", M, phase: "diagonals" },
        },
        {
          title: "Compute",
          html: texBlock(
            `\\det(A) = ${fmt(a * d)} - (${fmt(b * c)}) = \\mathbf{${fmt(
              result
            )}}`
          ),
          viz: { type: "two", M, phase: "result", result },
        },
      ],
    };
  };

  /* ----- 3x3 determinant by cofactor expansion along row 0 ----- */
  const steps3x3 = (M, expandRow = 0) => {
    const n = 3;
    const row = expandRow;
    const result = det(M);
    const steps = [];

    steps.push({
      title: "Choose a row to expand along",
      html: `We use <b>cofactor expansion along row ${row + 1}</b>.
             The sign pattern (checkerboard) starts with + at the top-left:
             ${texBlock(`\\begin{matrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{matrix}`)}
             Each term is <b>entry × sign × (determinant of the leftover 2×2)</b>.`,
      viz: { type: "cofactor", M, row, phase: "intro" },
    });

    const termPieces = [];
    for (let j = 0; j < n; j++) {
      const entry = M[row][j];
      const sgn = (row + j) % 2 === 0 ? 1 : -1;
      const sub = minor(M, row, j);
      const subDet = det(sub);
      const term = sgn * entry * subDet;
      termPieces.push({ entry, sgn, sub, subDet, term, j });

      steps.push({
        title: `Term ${j + 1}: cover row ${row + 1}, column ${j + 1}`,
        html: `Take the entry ${tex(fmt(entry))}. Its position sign is
               <b>${sgn === 1 ? "+" : "−"}</b>. Delete its row and column — the
               leftover 2×2 is its <b>minor</b>:
               ${texBlock(
                 `${sgn === 1 ? "+" : "-"}\\,(${paren(entry)})\\cdot${latexMatrix(
                   sub,
                   "v"
                 )}`
               )}`,
        viz: {
          type: "cofactor",
          M,
          row,
          phase: "term",
          col: j,
          sign: sgn,
          minor: sub,
        },
      });
    }

    // compute each 2x2 minor
    steps.push({
      title: "Evaluate each 2×2 minor",
      html: termPieces
        .map(
          (p) =>
            `${texBlock(
              `${latexMatrix(p.sub, "v")} = (${fmt(p.sub[0][0])})(${fmt(
                p.sub[1][1]
              )}) - (${fmt(p.sub[0][1])})(${fmt(p.sub[1][0])}) = ${fmt(p.subDet)}`
            )}`
        )
        .join(""),
      viz: { type: "cofactor", M, row, phase: "intro" },
    });

    // assemble
    const assembled = termPieces
      .map(
        (p) =>
          `${p.sgn === 1 ? "+" : "-"}\\,${paren(p.entry)}\\cdot(${fmt(
            p.subDet
          )})`
      )
      .join(" ");
    const numeric = termPieces
      .map((p) => `${p.term < 0 ? "-" : "+"}\\,${fmt(Math.abs(p.term))}`)
      .join(" ");

    steps.push({
      title: "Add the three terms",
      html: texBlock(`\\det(A) = ${assembled}`) +
            texBlock(`\\det(A) = ${numeric} = \\mathbf{${fmt(result)}}`),
      viz: { type: "cofactor", M, row, phase: "result", result },
    });

    return { result, steps };
  };

  /* ----- triangular determinant ----- */
  const stepsTriangular = (M) => {
    const n = M.length;
    const diag = M.map((row, i) => row[i]);
    const result = diag.reduce((a, b) => a * b, 1);
    return {
      result,
      steps: [
        {
          title: "Spot the triangular shape",
          html: `Every entry on one side of the main diagonal is 0, so this is a
                 <b>triangular matrix</b>. For triangular (and diagonal) matrices the
                 determinant is just the <b>product of the diagonal entries</b> — the
                 other entries do not matter at all.`,
          viz: { type: "diagonal", M, phase: "intro" },
        },
        {
          title: "Multiply the diagonal",
          html: texBlock(
            `\\det(A) = ${diag.map(paren).join(" \\cdot ")}`
          ),
          viz: { type: "diagonal", M, phase: "diag" },
        },
        {
          title: "Result",
          html: texBlock(`\\det(A) = \\mathbf{${fmt(result)}}`),
          viz: { type: "diagonal", M, phase: "result", result },
        },
      ],
    };
  };

  /* ===================================================================
     RANDOM PROBLEM GENERATORS  (for the practice gauntlet — infinite)
  =================================================================== */
  const ri = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
  const nz = (lo, hi) => {
    let v = 0;
    while (v === 0) v = ri(lo, hi);
    return v;
  };

  const gen2x2 = () => {
    const M = [
      [nz(-6, 6), ri(-6, 6)],
      [ri(-6, 6), nz(-6, 6)],
    ];
    return { M, answer: det(M), kind: "2x2" };
  };

  const gen3x3 = () => {
    // keep one zero in for friendlier arithmetic sometimes
    const M = [
      [ri(-4, 4), ri(-4, 4), ri(-4, 4)],
      [ri(-4, 4), ri(-4, 4), ri(-4, 4)],
      [ri(-4, 4), ri(-4, 4), ri(-4, 4)],
    ];
    return { M, answer: det(M), kind: "3x3" };
  };

  const genTriangular = (n = 3) => {
    const M = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if (j < i) M[i][j] = ri(-5, 5); // lower triangular fill
        else if (j === i) M[i][j] = nz(-4, 4);
      }
    return { M, answer: det(M), kind: "triangular" };
  };

  // 4x4 with a sparse row to reward smart expansion
  const genSparse4 = () => {
    const M = [
      [ri(-3, 3), ri(-3, 3), ri(-3, 3), ri(-3, 3)],
      [0, nz(-3, 3), 0, 0],
      [ri(-3, 3), ri(-3, 3), ri(-3, 3), ri(-3, 3)],
      [ri(-3, 3), ri(-3, 3), ri(-3, 3), ri(-3, 3)],
    ];
    return { M, answer: det(M), kind: "sparse4" };
  };

  /* ----- property / algebra question generators (Stage C & D) ----- */
  // det(kA) = k^n det(A)
  const genScalarMultiple = () => {
    const n = ri(2, 3);
    const d = nz(-6, 6);
    const k = nz(-3, 3);
    const answer = Math.pow(k, n) * d;
    return {
      kind: "scalar",
      n,
      k,
      d,
      answer,
      prompt: `\\(A\\) is an \\(${n}\\times ${n}\\) matrix with \\(\\det(A) = ${d}\\). Find \\(\\det(${k}A)\\).`,
      reteach: `Scaling <b>every</b> row of an \\(n\\times n\\) matrix by \\(k\\) multiplies the determinant by \\(k\\) once per row — and there are \\(n\\) rows. So \\(\\det(kA)=k^{n}\\det(A)\\), NOT \\(k\\det(A)\\). Here \\(n=${n}\\), \\(k=${k}\\): \\(\\det(${k}A) = (${k})^{${n}}\\cdot(${d}) = ${Math.pow(
        k,
        n
      )}\\cdot(${d}) = ${answer}.\\) Watch the sign: a negative \\(k\\) with odd \\(n\\) stays negative.`,
    };
  };
  // det(AB) = det(A)det(B)
  const genProduct = () => {
    const a = nz(-6, 6);
    const b = nz(-6, 6);
    return {
      kind: "product",
      answer: a * b,
      prompt: `\\(\\det(A) = ${a}\\) and \\(\\det(B) = ${b}\\). Find \\(\\det(AB)\\).`,
      reteach: `The determinant of a product is the product of the determinants: \\(\\det(AB)=\\det(A)\\det(B) = (${a})(${b}) = ${
        a * b
      }.\\) (Order does not matter for the determinant: \\(\\det(AB)=\\det(BA)\\).)`,
    };
  };
  // det(A^{-1}) = 1/det(A)
  const genInverse = () => {
    const choices = [2, -2, 4, -4, 5, -5, 1, -1];
    const a = choices[ri(0, choices.length - 1)];
    const ans = 1 / a;
    return {
      kind: "inverse",
      answer: ans,
      prompt: `\\(\\det(A) = ${a}\\). Find \\(\\det(A^{-1})\\). (Enter a fraction like 1/2 if needed.)`,
      reteach: `Since \\(\\det(A)\\det(A^{-1}) = \\det(I) = 1\\), we get \\(\\det(A^{-1}) = \\dfrac{1}{\\det(A)} = \\dfrac{1}{${a}}.\\)`,
    };
  };

  return {
    fmt,
    paren,
    clone,
    size,
    minor,
    det,
    latexMatrix,
    tex,
    texBlock,
    steps2x2,
    steps3x3,
    stepsTriangular,
    gen2x2,
    gen3x3,
    genTriangular,
    genSparse4,
    genScalarMultiple,
    genProduct,
    genInverse,
  };
})();
