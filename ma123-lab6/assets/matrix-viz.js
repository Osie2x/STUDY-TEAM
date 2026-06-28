/* Interactive matrix visualizations */
const MatrixViz = {
  render(container, spec) {
    if (!spec) {
      container.innerHTML = '<p class="viz-caption">Visualization appears with the problem.</p>';
      return;
    }
    container.innerHTML = '';
    const cap = document.createElement('p');
    cap.className = 'viz-caption';

    switch (spec.type) {
      case 'cofactor':
        this.cofactorViz(container, cap, spec);
        break;
      case 'signGrid':
        this.signGrid(container, cap, spec.size || 3);
        break;
      case 'triangular':
        this.triangular(container, cap, spec.matrix);
        break;
      case 'highlightRow':
        this.matrixHighlight(container, cap, spec.matrix, { row: spec.row });
        break;
      case 'duplicateRows':
        this.matrixHighlight(container, cap, spec.matrix, { duplicateRows: [0, 1] });
        break;
      case 'proportionalCols':
        this.proportionalCols(container, cap, spec.matrix || [[1, -2, 7], [-4, 8, 5], [2, -4, 3]], spec.cols);
        break;
      case 'rowOps':
        this.rowOpsDemo(container, cap, spec);
        break;
      case 'invertible':
        this.invertibleDemo(container, cap, spec.det);
        break;
      case 'scalar':
        this.scalarDemo(container, cap, spec);
        break;
      default:
        if (spec.matrix) this.matrixHighlight(container, cap, spec.matrix, {});
    }
    container.appendChild(cap);
  },

  buildGrid(matrix, classesFn) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 52px)`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell ' + (classesFn ? classesFn(r, c, matrix[r][c]) : '');
        cell.textContent = matrix[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        grid.appendChild(cell);
      }
    }
    return grid;
  },

  cofactorViz(container, cap, spec) {
    const matrix = spec.matrix || [[3, 1, 0], [-2, -4, 3], [5, 4, -2]];
    const row = spec.row ?? 0;
    const col = spec.col ?? 0;
    let phase = 0;

    const update = () => {
      container.querySelectorAll('.matrix-wrap').forEach((n) => n.remove());
      const wrap = document.createElement('div');
      wrap.className = 'matrix-wrap';

      const grid = this.buildGrid(matrix, (r, c) => {
        const cls = [];
        if (phase >= 1 && r === row) cls.push('hl-row');
        if (phase >= 2 && c === col) cls.push('hl-col');
        if (phase >= 3 && (r === row || c === col)) cls.push('deleted');
        const sign = ((r + c) % 2 === 0) ? 'sign-plus' : 'sign-minus';
        if (phase >= 1 && r === row && c === col) cls.push(sign);
        return cls.join(' ');
      });
      wrap.appendChild(grid);
      container.insertBefore(wrap, cap);

      const msgs = [
        'The full matrix A.',
        `Highlight row ${row + 1} for cofactor expansion.`,
        `Focus on entry (${row + 1}, ${col + 1}): highlight its column.`,
        'Cross out row & column → this minor remains.',
        `Sign at (${row + 1},${col + 1}): ${((row + col) % 2 === 0) ? '+' : '−'}`
      ];
      cap.textContent = msgs[phase];
    };

    update();
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.textContent = 'Animate next';
    btn.onclick = () => { phase = (phase + 1) % 5; update(); };
    container.appendChild(btn);
  },

  signGrid(container, cap, n) {
    const signs = [];
    for (let r = 0; r < n; r++) {
      signs[r] = [];
      for (let c = 0; c < n; c++) signs[r][c] = (r + c) % 2 === 0 ? '+' : '−';
    }
    const grid = this.buildGrid(signs, (r, c, v) => v === '+' ? 'sign-plus' : 'sign-minus');
    container.appendChild(grid);
    cap.textContent = 'Checkerboard: (1,1) is +, then alternate. Corners & center are +.';
  },

  triangular(container, cap, matrix) {
    const grid = this.buildGrid(matrix, (r, c) => {
      if (c > r) return 'deleted';
      if (r === c) return 'diag';
      return '';
    });
    container.appendChild(grid);
    cap.textContent = 'Green diagonal multiplies; entries above diagonal are 0 (ignored).';
  },

  matrixHighlight(container, cap, matrix, opts) {
    const grid = this.buildGrid(matrix, (r, c) => {
      const cls = [];
      if (opts.row === r) cls.push('hl-row');
      if (opts.col === c) cls.push('hl-col');
      if (opts.duplicateRows && opts.duplicateRows.includes(r)) cls.push('hl-row');
      return cls.join(' ');
    });
    container.appendChild(grid);
    cap.textContent = opts.duplicateRows
      ? 'Two identical rows → determinant is 0.'
      : `Expanding along row ${(opts.row ?? 0) + 1} (sparse row saves work).`;
  },

  proportionalCols(container, cap, matrix, cols) {
    const [a, b] = cols || [0, 1];
    const grid = this.buildGrid(matrix, (r, c) => {
      if (c === a || c === b) return 'hl-col';
      return '';
    });
    container.appendChild(grid);
    cap.textContent = `Column ${b + 1} = −2 × column ${a + 1} → det = 0.`;
  },

  rowOpsDemo(container, cap, spec) {
    const ops = ['Row swap → det × (−1)', 'Scale row k → det × k', 'Add multiple → det unchanged'];
  const idx = { swap: 0, scale: 1, replace: 2 }[spec.op] ?? 0;
    const box = document.createElement('div');
    box.style.fontSize = '1.15rem';
    box.style.textAlign = 'center';
    box.innerHTML = ops.map((o, i) => `<div style="opacity:${i === idx ? 1 : 0.35};margin:0.4rem 0">${o}</div>`).join('');
    container.appendChild(box);
    cap.textContent = 'Track every type-1 and type-2 operation when row-reducing.';
  },

  invertibleDemo(container, cap, det) {
    const el = document.createElement('div');
    el.style.fontSize = '1.4rem';
    el.style.textAlign = 'center';
    el.innerHTML = det === 0
      ? '<span style="color:#f87171">det = 0 → singular → not invertible</span>'
      : '<span style="color:#34d399">det ≠ 0 → invertible</span>';
    container.appendChild(el);
    cap.textContent = 'Equivalent: rank = n, RREF = I, columns independent.';
  },

  scalarDemo(container, cap, spec) {
    const { n = 3, k = -2 } = spec;
    const el = document.createElement('div');
    el.style.textAlign = 'center';
    el.style.fontSize = '1.2rem';
    el.innerHTML = `\\( \\det(${k}A) = ${k}^{${n}}\\det(A) = ${Math.pow(k, n)}\\det(A) \\)`;
    container.appendChild(el);
    Lab6Util.renderMath(container);
    cap.textContent = `Each of ${n} rows scales by ${k} → multiply det ${n} times.`;
  }
};

window.MatrixViz = MatrixViz;
