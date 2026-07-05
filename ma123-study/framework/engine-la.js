/* ===================================================================
   MA123 Study — Linear Algebra Engine Extension
   Attaches new, exact math to the shared Engine object:
     • Fraction (exact rational arithmetic)
     • rrefSteps: Gauss–Jordan with every row operation recorded
     • generators: span/independence/rank, matrix mult, dot/cross,
       eigenvalues (2×2 + triangular), transformations, linear systems
   All answers are computed, so practice + reteach are always correct.
=================================================================== */
(function (E) {
  /* ---------------- Fraction ---------------- */
  const gcd = (a, b) => {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
  };
  class Fr {
    constructor(n, d = 1) {
      if (d === 0) d = 1;
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d);
      this.n = n / g; this.d = d / g;
    }
    static from(x) { return x instanceof Fr ? x : new Fr(x, 1); }
    add(o) { o = Fr.from(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Fr.from(o); return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Fr.from(o); return new Fr(this.n * o.n, this.d * o.d); }
    div(o) { o = Fr.from(o); return new Fr(this.n * o.d, this.d * o.n); }
    neg() { return new Fr(-this.n, this.d); }
    isZero() { return this.n === 0; }
    isOne() { return this.n === this.d; }
    eq(o) { o = Fr.from(o); return this.n === o.n && this.d === o.d; }
    val() { return this.n / this.d; }
    tex() { return this.d === 1 ? String(this.n) : (this.n < 0 ? `-\\tfrac{${-this.n}}{${this.d}}` : `\\tfrac{${this.n}}{${this.d}}`); }
    str() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
  }

  const toFrMat = (M) => M.map((r) => r.map((x) => (x instanceof Fr ? x : new Fr(x, 1))));
  const frLatex = (M, kind = "b") => {
    const env = kind === "v" ? "vmatrix" : "bmatrix";
    return `\\begin{${env}}` +
      M.map((r) => r.map((x) => (x instanceof Fr ? x.tex() : String(x))).join(" & ")).join(" \\\\ ") +
      `\\end{${env}}`;
  };
  // augmented latex ([A | b]) with a vertical bar before last col(s)
  const augLatex = (M, splitAt) => {
    const cols = M[0].length;
    const spec = Array.from({ length: cols }, (_, i) => "c").join("");
    const withBar = spec.slice(0, splitAt) + "|" + spec.slice(splitAt);
    return `\\left[\\begin{array}{${withBar}}` +
      M.map((r) => r.map((x) => (x instanceof Fr ? x.tex() : String(x))).join(" & ")).join(" \\\\ ") +
      `\\end{array}\\right]`;
  };

  /* ---------------- RREF with recorded steps ---------------- */
  // returns { rank, pivots, R (Fr matrix), steps:[{desc, M(Fr)}] }
  function rrefSteps(input, opts = {}) {
    const M = toFrMat(input);
    const rows = M.length, cols = M[0].length;
    const splitAt = opts.splitAt; // for augmented display
    const steps = [];
    const snap = (desc) => steps.push({ desc, M: M.map((r) => r.map((x) => new Fr(x.n, x.d))) });
    snap("Start");
    let pivotRow = 0;
    const pivots = [];
    const limitCols = opts.coeffCols != null ? opts.coeffCols : cols;
    for (let col = 0; col < limitCols && pivotRow < rows; col++) {
      // find pivot
      let sel = -1;
      for (let r = pivotRow; r < rows; r++) if (!M[r][col].isZero()) { sel = r; break; }
      if (sel === -1) continue;
      if (sel !== pivotRow) {
        [M[sel], M[pivotRow]] = [M[pivotRow], M[sel]];
        snap(`R_{${pivotRow + 1}} \\leftrightarrow R_{${sel + 1}}`);
      }
      // scale pivot to 1
      if (!M[pivotRow][col].isOne()) {
        const p = M[pivotRow][col];
        M[pivotRow] = M[pivotRow].map((x) => x.div(p));
        snap(`\\tfrac{1}{${p.str()}}R_{${pivotRow + 1}} \\to R_{${pivotRow + 1}}`);
      }
      // eliminate other rows
      for (let r = 0; r < rows; r++) {
        if (r === pivotRow || M[r][col].isZero()) continue;
        const f = M[r][col];
        M[r] = M[r].map((x, j) => x.sub(f.mul(M[pivotRow][j])));
        snap(`R_{${r + 1}} - (${f.str()})R_{${pivotRow + 1}} \\to R_{${r + 1}}`);
      }
      pivots.push(col);
      pivotRow++;
    }
    return { rank: pivots.length, pivots, R: M, steps, splitAt };
  }

  // build stepPlayer steps from an rref run (each shown as a matrix + op)
  function rrefSolutionSteps(input, opts = {}) {
    const res = rrefSteps(input, opts);
    const steps = res.steps.map((s, i) => ({
      title: i === 0 ? "Write the matrix" : `Row operation`,
      html: (i === 0
        ? `Set it up, then reduce with row operations (each one shown):`
        : `Apply \\(${s.desc}\\):`) +
        E.texBlock(opts.splitAt != null ? augLatex(s.M, opts.splitAt) : frLatex(s.M)),
      viz: { type: "none" },
    }));
    steps.push({
      title: "Read off the result",
      html: `RREF reached. <b>rank = ${res.rank}</b>` +
        (opts.tail ? `<br>${opts.tail(res)}` : ""),
      viz: { type: "none" },
    });
    return { res, steps };
  }

  /* ---------------- vector / matrix helpers ---------------- */
  const ri = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
  const nz = (lo, hi) => { let v = 0; while (v === 0) v = ri(lo, hi); return v; };
  const colLatex = (v) => `\\begin{bmatrix}${v.join(" \\\\ ")}\\end{bmatrix}`;
  const rowsFromCols = (cols) => {
    const n = cols[0].length;
    return Array.from({ length: n }, (_, r) => cols.map((c) => c[r]));
  };
  const matMul = (A, B) => {
    const r = A.length, c = B[0].length, k = B.length;
    const out = Array.from({ length: r }, () => Array(c).fill(0));
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) { let s = 0; for (let t = 0; t < k; t++) s += A[i][t] * B[t][j]; out[i][j] = s; }
    return out;
  };
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* ============================================================
     GENERATORS
  ============================================================ */

  // Linear independence / rank of k vectors in R^n (columns)
  function genIndep(n = 3, k = 3, forceDependent = null) {
    let cols, rank, guard = 0;
    do {
      cols = Array.from({ length: k }, () => Array.from({ length: n }, () => ri(-3, 3)));
      // occasionally force a dependent set by making col3 = col1 + col2
      if (forceDependent === true || (forceDependent === null && Math.random() < 0.4 && k >= 2)) {
        cols[k - 1] = cols[0].map((x, i) => x + (cols[1] ? cols[1][i] : 0));
      }
      rank = rrefSteps(rowsFromCols(cols)).rank;
      guard++;
    } while (guard < 30 && ((forceDependent === true && rank === k) || (forceDependent === false && rank !== k)));
    const A = rowsFromCols(cols);
    const independent = rank === k;
    const sol = rrefSolutionSteps(A, {
      tail: (r) => independent
        ? `Since rank \\(= ${r.rank}\\) equals the number of vectors \\(k=${k}\\), the vectors are <b>linearly independent</b>.`
        : `Since rank \\(= ${r.rank} \\neq ${k}\\) (the number of vectors), the vectors are <b>linearly dependent</b>. Free variables: \\(k-\\text{rank} = ${k - r.rank}\\).`,
    });
    return { cols, A, rank, independent, sol };
  }

  function genIndepProblem() {
    const k = ri(2, 3), n = ri(k, 4);
    const g = genIndep(n, k);
    const vhtml = g.cols.map((c, i) => `\\vec v_{${i + 1}}=${colLatex(c)}`).join(",\\ ");
    return {
      type: "mc",
      source: "§5.2 (Lab 7)",
      promptHtml: `Are these vectors linearly independent? ${E.texBlock(vhtml)} <span class="mini-note">(Put them as columns, row-reduce, compare rank to the number of vectors.)</span>`,
      choices: [
        { html: "Linearly independent", correct: g.independent },
        { html: "Linearly dependent", correct: !g.independent },
      ],
      answer: g.independent ? 0 : 1,
      solution: { steps: g.sol.steps },
    };
  }

  function genRankProblem() {
    const rows = ri(2, 3), cols = ri(2, 4);
    const M = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ri(-3, 3)));
    const sol = rrefSolutionSteps(M, {});
    return {
      type: "numeric",
      source: "§5.2 (Lab 7)",
      promptHtml: `Find the <b>rank</b> of ${E.texBlock(E.latexMatrix(M, "b"))}`,
      answer: sol.res.rank,
      solution: { steps: sol.steps },
    };
  }

  // Is w in span(v1..vk)?  augmented [A|w] consistent?
  function genSpanMembership() {
    const n = ri(2, 3), k = ri(2, 3);
    const cols = Array.from({ length: k }, () => Array.from({ length: n }, () => ri(-3, 3)));
    const inSpan = Math.random() < 0.55;
    let w;
    if (inSpan) {
      const coeffs = Array.from({ length: k }, () => ri(-2, 2));
      w = cols[0].map((_, r) => cols.reduce((s, c, j) => s + c[r] * coeffs[j], 0));
    } else {
      w = Array.from({ length: n }, () => ri(-4, 4));
    }
    const aug = rowsFromCols(cols).map((r, i) => [...r, w[i]]);
    const res = rrefSteps(aug, { coeffCols: k, splitAt: k });
    // consistent iff no row [0..0 | nonzero]
    let consistent = true;
    for (const r of res.R) {
      const lhsZero = r.slice(0, k).every((x) => x.isZero());
      if (lhsZero && !r[k].isZero()) consistent = false;
    }
    const sol = rrefSolutionSteps(aug, {
      coeffCols: k, splitAt: k,
      tail: () => consistent
        ? `No row says \\(0 = \\text{nonzero}\\), so the system is <b>consistent</b> — \\(\\vec w\\) <b>is</b> in the span.`
        : `A row reads \\(0 = \\text{nonzero}\\), so the system is <b>inconsistent</b> — \\(\\vec w\\) is <b>not</b> in the span.`,
    });
    const vhtml = cols.map((c, i) => `\\vec v_{${i + 1}}=${colLatex(c)}`).join(",\\ ") + `,\\ \\vec w=${colLatex(w)}`;
    return {
      type: "mc",
      source: "§5.2 (Lab 7)",
      promptHtml: `Is \\(\\vec w\\) in \\(\\text{Span}(\\vec v_1,\\dots)\\)? ${E.texBlock(vhtml)}`,
      choices: [
        { html: "Yes — \\(\\vec w\\) is in the span", correct: consistent },
        { html: "No — \\(\\vec w\\) is not in the span", correct: !consistent },
      ],
      answer: consistent ? 0 : 1,
      solution: { steps: sol.steps },
    };
  }

  // Matrix multiplication — ask a specific entry
  function genMatMulEntry() {
    const m = ri(2, 3), n = ri(2, 3), p = ri(2, 3);
    const A = Array.from({ length: m }, () => Array.from({ length: n }, () => ri(-4, 4)));
    const B = Array.from({ length: n }, () => Array.from({ length: p }, () => ri(-4, 4)));
    const C = matMul(A, B);
    const i = ri(0, m - 1), j = ri(0, p - 1);
    const rowA = A[i], colB = B.map((r) => r[j]);
    const terms = rowA.map((x, t) => `(${x})(${colB[t]})`).join(" + ");
    return {
      type: "numeric",
      source: "§3 Matrix algebra",
      promptHtml: `For ${E.texBlock(`A=${E.latexMatrix(A, "b")},\\quad B=${E.latexMatrix(B, "b")}`)}
        find the entry \\((AB)_{${i + 1}${j + 1}}\\).`,
      answer: C[i][j],
      solution: { steps: [
        { title: "Row × column rule", html: `The \\((${i + 1},${j + 1})\\) entry is <b>row ${i + 1} of \\(A\\)</b> dotted with <b>column ${j + 1} of \\(B\\)</b>.`, viz: { type: "none" } },
        { title: "Multiply and add", html: E.texBlock(`(AB)_{${i + 1}${j + 1}} = ${terms} = ${C[i][j]}`), viz: { type: "none" } },
      ] },
    };
  }

  function genDot() {
    const n = ri(2, 3);
    const a = Array.from({ length: n }, () => ri(-5, 5));
    const b = Array.from({ length: n }, () => ri(-5, 5));
    const terms = a.map((x, i) => `(${x})(${b[i]})`).join(" + ");
    return {
      type: "numeric",
      source: "§2 Vector geometry",
      promptHtml: `Compute \\(\\vec a\\cdot\\vec b\\) for \\(\\vec a=${colLatex(a)},\\ \\vec b=${colLatex(b)}\\).`,
      answer: dot(a, b),
      solution: { steps: [
        { title: "Dot product", html: E.texBlock(`\\vec a\\cdot\\vec b = ${terms} = ${dot(a, b)}`), viz: { type: "none" } },
        { title: "Meaning", html: `If \\(\\vec a\\cdot\\vec b = 0\\) the vectors are <b>perpendicular</b>. Sign tells you the angle is acute (+) or obtuse (−).`, viz: { type: "none" } },
      ] },
    };
  }

  function genCrossComponent() {
    const a = Array.from({ length: 3 }, () => ri(-4, 4));
    const b = Array.from({ length: 3 }, () => ri(-4, 4));
    const c = cross(a, b);
    const idx = ri(0, 2);
    const labels = ["first (i)", "second (j)", "third (k)"];
    const formulas = [
      `a_2 b_3 - a_3 b_2 = (${a[1]})(${b[2]}) - (${a[2]})(${b[1]})`,
      `a_3 b_1 - a_1 b_3 = (${a[2]})(${b[0]}) - (${a[0]})(${b[2]})`,
      `a_1 b_2 - a_2 b_1 = (${a[0]})(${b[1]}) - (${a[1]})(${b[0]})`,
    ];
    return {
      type: "numeric",
      source: "§2 Vector geometry",
      promptHtml: `For \\(\\vec a=${colLatex(a)},\\ \\vec b=${colLatex(b)}\\), find the <b>${labels[idx]}</b> component of \\(\\vec a\\times\\vec b\\).`,
      answer: c[idx],
      solution: { steps: [
        { title: "Cross product component", html: `Watch the middle component's sign — it is \\(a_3b_1 - a_1b_3\\) (note the flip).`, viz: { type: "none" } },
        { title: "Compute", html: E.texBlock(`${formulas[idx]} = ${c[idx]}`), viz: { type: "none" } },
      ] },
    };
  }

  // 2x2 eigenvalues (integer)
  function genEigen2x2() {
    let A, tr, det, disc, s, l1, l2, guard = 0;
    do {
      A = [[ri(-4, 4), ri(-4, 4)], [ri(-4, 4), ri(-4, 4)]];
      tr = A[0][0] + A[1][1]; det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      disc = tr * tr - 4 * det; s = Math.round(Math.sqrt(disc));
      guard++;
    } while (guard < 200 && (disc < 0 || s * s !== disc || (tr + s) % 2 !== 0 || tr * tr - 4 * det === 0));
    l1 = (tr + s) / 2; l2 = (tr - s) / 2;
    const larger = Math.max(l1, l2);
    return {
      type: "numeric",
      source: "§7 Eigenvalues",
      promptHtml: `Find the <b>largest eigenvalue</b> of ${E.texBlock(E.latexMatrix(A, "b"))}`,
      answer: larger,
      solution: { steps: [
        { title: "Characteristic polynomial", html: `Eigenvalues solve \\(\\det(A-\\lambda I)=0\\), i.e. \\(\\lambda^2 - (\\text{tr})\\lambda + \\det = 0\\).`, viz: { type: "none" } },
        { title: "Plug in trace and determinant", html: E.texBlock(`\\lambda^2 - (${tr})\\lambda + (${det}) = 0`), viz: { type: "none" } },
        { title: "Solve", html: E.texBlock(`\\lambda = \\frac{${tr} \\pm \\sqrt{${disc}}}{2} = ${l1},\\ ${l2}`) + `<p>Largest eigenvalue: <b>${larger}</b>.</p>`, viz: { type: "none" } },
      ] },
    };
  }

  // triangular 3x3 eigenvalues (diagonal) + diagonalizability of distinct
  function genEigenTriangular3() {
    const d = [nz(-4, 4), nz(-4, 4), nz(-4, 4)];
    const M = [[d[0], ri(-3, 3), ri(-3, 3)], [0, d[1], ri(-3, 3)], [0, 0, d[2]]];
    const larger = Math.max(...d);
    return {
      type: "numeric",
      source: "§7 Eigenvalues",
      promptHtml: `This matrix is triangular. Find its <b>largest eigenvalue</b>. ${E.texBlock(E.latexMatrix(M, "b"))}`,
      answer: larger,
      solution: { steps: [
        { title: "Triangular shortcut", html: `For a triangular matrix, the eigenvalues are exactly the <b>diagonal entries</b>: \\(${d.join(",\\ ")}\\).`, viz: { type: "diagonal", M, phase: "diag" } },
        { title: "Largest", html: `The largest is <b>${larger}</b>.`, viz: { type: "none" } },
      ] },
    };
  }

  // transformation image: apply standard matrix to a vector
  function genTransformImage() {
    const A = [[ri(-3, 3), ri(-3, 3)], [ri(-3, 3), ri(-3, 3)]];
    const x = [ri(-4, 4), ri(-4, 4)];
    const y = [A[0][0] * x[0] + A[0][1] * x[1], A[1][0] * x[0] + A[1][1] * x[1]];
    const comp = ri(0, 1);
    return {
      type: "numeric",
      source: "§ Matrix transformations",
      promptHtml: `The transformation \\(T(\\vec x)=A\\vec x\\) has \\(A=${E.latexMatrix(A, "b")}\\). Find the <b>${comp === 0 ? "first" : "second"}</b> component of the image of \\(\\vec x=${colLatex(x)}\\).`,
      answer: y[comp],
      solution: { steps: [
        { title: "Apply the matrix", html: E.texBlock(`A\\vec x = ${E.latexMatrix(A, "b")}${colLatex(x)} = \\begin{bmatrix}(${A[0][0]})(${x[0]})+(${A[0][1]})(${x[1]})\\\\(${A[1][0]})(${x[0]})+(${A[1][1]})(${x[1]})\\end{bmatrix} = ${colLatex(y)}`), viz: { type: "none" } },
      ] },
    };
  }

  // identify a geometric transformation from its matrix (mc)
  const GEO = [
    { A: [[1, 0], [0, -1]], name: "Reflection over the x-axis" },
    { A: [[-1, 0], [0, 1]], name: "Reflection over the y-axis" },
    { A: [[0, 1], [1, 0]], name: "Reflection over the line y = x" },
    { A: [[0, -1], [1, 0]], name: "90° counter-clockwise rotation" },
    { A: [[3, 0], [0, 1]], name: "Horizontal stretch (factor 3)" },
    { A: [[1, 0], [0, 3]], name: "Vertical stretch (factor 3)" },
    { A: [[1, 2], [0, 1]], name: "Horizontal shear (s = 2)" },
    { A: [[2, 0], [0, 2]], name: "Scaling / dilation (factor 2)" },
  ];
  function genGeoTransform() {
    const pick = GEO[ri(0, GEO.length - 1)];
    const distract = [...GEO].filter((g) => g.name !== pick.name).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [pick, ...distract].sort(() => Math.random() - 0.5);
    return {
      type: "mc",
      source: "§ Matrix transformations",
      promptHtml: `Which geometric transformation has standard matrix ${E.texBlock(E.latexMatrix(pick.A, "b"))}?`,
      choices: opts.map((o) => ({ html: o.name, correct: o.name === pick.name })),
      answer: opts.findIndex((o) => o.name === pick.name),
      reteachHtml: `This is <b>${pick.name}</b>. Learn the eight standard 2×2 matrices (rotation, horizontal/vertical stretch, scaling, horizontal/vertical shear, reflections over x-axis, y-axis, and y=x).`,
    };
  }

  // small linear system, unique integer solution — ask x1
  function genSystemSolve() {
    let A, sol, b, det, guard = 0;
    const n = ri(2, 3);
    do {
      A = Array.from({ length: n }, () => Array.from({ length: n }, () => ri(-3, 3)));
      sol = Array.from({ length: n }, () => ri(-4, 4));
      b = A.map((row) => row.reduce((s, a, j) => s + a * sol[j], 0));
      det = E.det(A);
      guard++;
    } while (guard < 60 && det === 0);
    const aug = A.map((r, i) => [...r, b[i]]);
    const s = rrefSolutionSteps(aug, {
      coeffCols: n, splitAt: n,
      tail: () => `Read the solution straight from the identity block: \\(x_1 = ${sol[0]}\\).`,
    });
    return {
      type: "numeric",
      source: "§1 Linear systems",
      promptHtml: `Solve the system (find \\(x_1\\)) by row-reducing the augmented matrix: ${E.texBlock(E.augHelper ? "" : "")}${E.texBlock(augLatex(aug.map((r) => r.map((x) => new Fr(x))), n))}`,
      answer: sol[0],
      solution: { steps: s.steps },
    };
  }

  /* expose */
  Object.assign(E, {
    Fr, rrefSteps, rrefSolutionSteps, frLatex, augLatex, colLatex, rowsFromCols, matMul, dot, cross,
    genIndep, genIndepProblem, genRankProblem, genSpanMembership, genMatMulEntry,
    genDot, genCrossComponent, genEigen2x2, genEigenTriangular3, genTransformImage,
    genGeoTransform, genSystemSolve,
  });
})(Engine);
