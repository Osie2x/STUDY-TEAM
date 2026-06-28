/* MA123 Lab 6 — Determinants (Sections 4.1 & 4.2) problem bank */
window.Lab6Problems = {
  meta: {
    title: 'MA123 Lab 6 — Determinants',
    subtitle: 'Sections 4.1 & 4.2 · Introductory Linear Algebra (Hu et al.)',
    estimatedHours: 3.5,
    dayMinimumMinutes: 45,
    focus: [
      'Cofactor expansion & sign grid',
      'Triangular & diagonal determinants',
      'Elementary row operations & det',
      'Invertibility ↔ det(A) ≠ 0',
      'det(AB), det(kA), det(A⁻¹)',
      'MATLAB det / rank connections'
    ]
  },

  concepts: [
    {
      id: 'cofactor',
      title: 'Cofactor Expansion',
      plain: 'Pick a row or column. Multiply each entry by its cofactor (sign × minor determinant) and add.',
      formula: '\\det(A)=\\sum_{j=1}^{n} a_{ij}C_{ij} \\quad\\text{(row } i\\text{)}',
      connection: 'The sign grid comes from (−1)^{i+j}: even sum → +, odd sum → −.',
      viz: { type: 'cofactor', matrix: [[3, 1, 0], [-2, -4, 3], [5, 4, -2]], row: 0, col: null }
    },
    {
      id: 'sign-grid',
      title: 'Sign Grid (3×3)',
      plain: 'Corners and center are +. Edge-centers are −. Start at (1,1) with + and alternate.',
      formula: '\\begin{bmatrix}+&-&+\\\\-&+&-\\\\+&-&+\\end{bmatrix}',
      connection: 'Do not memorize a 3×3 shortcut rule — cofactor expansion works for every order.',
      viz: { type: 'signGrid', size: 3 }
    },
    {
      id: 'triangular',
      title: 'Triangular Matrices',
      plain: 'If A is upper or lower triangular, det(A) equals the product of diagonal entries.',
      formula: '\\det(A)=a_{11}a_{22}\\cdots a_{nn}',
      connection: 'Complicated entries off the diagonal do not matter — only the diagonal product.',
      viz: { type: 'triangular', matrix: [[-1, 0, 0, 0], [5, 3, 0, 0], [2, 2, 2, 0], [4, -13, 0, 1]] }
    },
    {
      id: 'row-ops',
      title: 'Elementary Row Operations',
      plain: 'Scale a row → multiply det by that scalar. Swap two rows → negate det. Add multiple of row → det unchanged.',
      formula: 'R_i\\leftrightarrow R_j:\\;\\det\\mapsto -\\det \\quad kR_i:\\;\\det\\mapsto k\\det \\quad R_i+kR_j:\\;\\det\\text{ unchanged}',
      connection: 'Use type-3 ops to reach triangular form; track type-1 and type-2 effects at the end.',
      viz: { type: 'rowOps', steps: ['swap', 'scale', 'replace'] }
    },
    {
      id: 'zero-rows',
      title: 'Zero / Duplicate Rows',
      plain: 'A zero row or two identical rows force det(A) = 0.',
      formula: '\\text{duplicate rows} \\Rightarrow \\det(A)=0',
      connection: 'Proposition 4.2.7: expanding along the wrong row of cofactors also gives 0.',
      viz: { type: 'duplicateRows', matrix: [[-2, -4, 3], [-2, -4, 3], [5, 4, -2]] }
    },
    {
      id: 'invertible',
      title: 'Invertibility',
      plain: 'For square A: det(A) ≠ 0 if and only if A is invertible (equivalently: rank = n, RREF = I).',
      formula: 'A\\text{ invertible } \\iff \\det(A)\\neq 0',
      connection: 'det(A)=0 means singular — columns are linearly dependent.',
      viz: { type: 'invertible', det: 0 }
    },
    {
      id: 'product-rule',
      title: 'Product & Scalar Rules',
      plain: 'det(AB) = det(A)det(B). Scaling every entry by k scales det by kⁿ.',
      formula: '\\det(kA)=k^n\\det(A),\\quad \\det(A^{-1})=\\frac{1}{\\det(A)}',
      connection: 'Trap: (−2)³ = −8 for a 3×3 — sign matters when k is negative and n is odd.',
      viz: { type: 'scalar', n: 3, k: -2 }
    }
  ],

  stages: [
  {
    id: 'guided-1',
    name: 'Stage 0 — Guided Warm-Up',
    kind: 'guided',
    optional: false,
    description: '2–3 fully worked problems. Every step appears one at a time.',
    problems: ['g-lab-notes', 'g-414', 'g-413']
  },
  {
    id: 'practice-a',
    name: 'Stage A — Cofactor Basics',
    kind: 'practice',
    description: 'Compute minors, cofactors, and 2×2/3×3 determinants by hand.',
    problems: ['p-2x2-1', 'p-413-c11', 'p-413-c32', 'p-prelab-b', 'p-3x3-1', 'p-tri-3']
  },
  {
    id: 'guided-2',
    name: 'Stage B — Guided Properties',
    kind: 'guided',
    optional: true,
    skipLabel: 'Skip remaining guided → jump to Stage B practice',
    description: 'Smart expansion, row operations, and property shortcuts.',
    problems: ['g-422', 'g-4211', 'g-428b']
  },
  {
    id: 'practice-b',
    name: 'Stage C — Properties & Shortcuts',
    kind: 'practice',
    interleaveFrom: 'practice-a',
    interleaveCount: 2,
    description: 'Triangular det, elementary matrices, proportional rows/columns.',
    problems: ['p-418', 'p-elem-swap', 'p-kA', 'p-428c', 'p-427', 'p-429a', 'p-inv-test']
  },
  {
    id: 'guided-3',
    name: 'Stage D — Guided Row-Reduction',
    kind: 'guided',
    optional: true,
    problems: ['g-4222']
  },
  {
    id: 'practice-c',
    name: 'Stage E — Mixed & Interleaved',
    kind: 'practice',
    interleaveFrom: 'practice-a',
    interleaveCount: 2,
    interleaveAlsoFrom: 'practice-b',
    interleaveAlsoCount: 2,
    description: 'Exam-style mixes. Review pulls from earlier stages.',
    problems: ['p-4229b', 'p-429b', 'p-428a', 'p-429a2', 'p-magic', 'p-equiv', 'p-detAB']
  },
  {
    id: 'gauntlet',
    name: 'Final Gauntlet',
    kind: 'gauntlet',
    description: 'Lockdown practice — no navigation until you answer. Wrong answers trigger re-teach + new variant.',
    problems: ['gnt-1', 'gnt-2', 'gnt-3', 'gnt-4', 'gnt-5', 'gnt-6', 'gnt-7', 'gnt-8', 'gnt-9', 'gnt-10']
  },
  {
    id: 'predicted',
    name: 'Predicted Lab Questions',
    kind: 'practice',
    description: 'Original problems modeled on Lab 6, Pre-Lab 6, and likely in-lab tasks.',
    problems: ['pred-1', 'pred-2', 'pred-3', 'pred-4', 'pred-5', 'pred-6', 'pred-7', 'pred-8']
  }
  ],

  problems: {
    'g-lab-notes': {
      id: 'g-lab-notes',
      source: 'Lab Notes S26 — Worked Example',
      type: 'guided',
      tags: ['cofactor', '3x3'],
      prompt: 'Find \\(\\det(A)\\) for \\(A=\\begin{bmatrix}1&-2&3\\\\-4&-5&-6\\\\7&-8&9\\end{bmatrix}\\) using cofactor expansion along row 1.',
      matrix: [[1, -2, 3], [-4, -5, -6], [7, -8, 9]],
      viz: { type: 'cofactor', row: 0 },
      steps: [
        { label: 'Set up row-1 expansion', math: '\\det(A)=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}' },
        { label: 'Entry (1,1): sign is +', math: 'a_{11}C_{11}=1\\cdot(+1)\\cdot\\det\\begin{bmatrix}-5&-6\\\\-8&9\\end{bmatrix}' },
        { label: 'Compute minor (1,1)', math: '\\det\\begin{bmatrix}-5&-6\\\\-8&9\\end{bmatrix}=(-5)(9)-(-6)(-8)=-45-48=-93' },
        { label: 'Entry (1,2): sign is −', math: 'a_{12}C_{12}=(-2)\\cdot(-1)\\cdot\\det\\begin{bmatrix}-4&-6\\\\7&9\\end{bmatrix}=2\\cdot[(-4)(9)-(-6)(7)]' },
        { label: 'Compute that 2×2', math: '(-4)(9)-(-6)(7)=-36+42=6 \\quad\\Rightarrow\\quad 2\\cdot 6=12' },
        { label: 'Entry (1,3): sign is +', math: 'a_{13}C_{13}=3\\cdot(+1)\\cdot\\det\\begin{bmatrix}-4&-5\\\\7&-8\\end{bmatrix}' },
        { label: 'Compute minor (1,3)', math: '(-4)(-8)-(-5)(7)=32+35=67 \\quad\\Rightarrow\\quad 3\\cdot 67=201' },
        { label: 'Add all three terms', math: '\\det(A)=-93+12+201=120' }
      ],
      answer: '120'
    },

    'g-414': {
      id: 'g-414',
      source: 'Textbook §4.1 — Example 4.1.4',
      type: 'guided',
      tags: ['cofactor', '3x3'],
      prompt: 'Find \\(\\det(A)\\) for \\(A=\\begin{bmatrix}3&1&0\\\\-2&-4&3\\\\5&4&-2\\end{bmatrix}\\) by cofactor expansion along row 1.',
      matrix: [[3, 1, 0], [-2, -4, 3], [5, 4, -2]],
      viz: { type: 'cofactor', row: 0 },
      steps: [
        { label: 'Row-1 expansion', math: '\\det(A)=3\\det\\begin{bmatrix}-4&3\\\\4&-2\\end{bmatrix}-1\\det\\begin{bmatrix}-2&3\\\\5&-2\\end{bmatrix}+0\\cdot(\\cdots)' },
        { label: 'First 2×2', math: '3[(-4)(-2)-(3)(4)]=3(8-12)=3(-4)=-12' },
        { label: 'Second 2×2', math: '-1[(-2)(-2)-(3)(5)]=-1(4-15)=-1(-11)=11' },
        { label: 'Third term is 0', math: '0\\cdot\\det(\\tilde A_{13})=0' },
        { label: 'Final sum', math: '\\det(A)=-12+11+0=-1' }
      ],
      answer: '-1'
    },

    'g-413': {
      id: 'g-413',
      source: 'Textbook §4.1 — Example 4.1.3',
      type: 'guided',
      tags: ['cofactor', 'minor'],
      prompt: 'For \\(A=\\begin{bmatrix}3&1&-4\\\\2&5&6\\\\1&4&8\\end{bmatrix}\\), find \\(C_{11}\\) and \\(C_{32}\\).',
      matrix: [[3, 1, -4], [2, 5, 6], [1, 4, 8]],
      viz: { type: 'cofactor', highlight: [[0, 0], [2, 1]] },
      steps: [
        { label: 'Minor \\(\\tilde A_{11}\\) — delete row 1, col 1', math: '\\tilde A_{11}=\\begin{bmatrix}5&6\\\\4&8\\end{bmatrix}' },
        { label: 'Cofactor \\(C_{11}\\)', math: 'C_{11}=(-1)^{1+1}\\det\\tilde A_{11}=1\\cdot(5\\cdot 8-4\\cdot 6)=40-24=16' },
        { label: 'Minor \\(\\tilde A_{32}\\) — delete row 3, col 2', math: '\\tilde A_{32}=\\begin{bmatrix}3&-4\\\\2&6\\end{bmatrix}' },
        { label: 'Cofactor \\(C_{32}\\)', math: 'C_{32}=(-1)^{3+2}\\det\\tilde A_{32}=(-1)\\cdot(3\\cdot 6-2\\cdot(-4))=-(18+8)=-26' }
      ],
      answer: 'C11=16, C32=-26'
    },

    'g-422': {
      id: 'g-422',
      source: 'Textbook §4.2 — Example 4.2.2',
      type: 'guided',
      tags: ['smart-expansion', '4x4'],
      prompt: 'Compute \\(\\det(A)\\) for \\(A=\\begin{bmatrix}1&3&1&2\\\\0&1&0&0\\\\0&2&-2&0\\\\-1&2&1&1\\end{bmatrix}\\). Choose the sparsest row/column.',
      matrix: [[1, 3, 1, 2], [0, 1, 0, 0], [0, 2, -2, 0], [-1, 2, 1, 1]],
      viz: { type: 'highlightRow', row: 1 },
      steps: [
        { label: 'Row 2 has only one nonzero entry', math: '\\det(A)=1\\cdot(-1)^{2+2}\\det\\begin{bmatrix}1&1&2\\\\0&-2&0\\\\-1&1&1\\end{bmatrix}' },
        { label: 'Expand new matrix along row 2', math: '=(-2)\\cdot(-1)^{2+2}\\det\\begin{bmatrix}1&2\\\\-1&1\\end{bmatrix}' },
        { label: '2×2 finish', math: '=-2\\cdot(1\\cdot 1-2\\cdot(-1))=-2\\cdot(1+2)=-6' }
      ],
      answer: '-6'
    },

    'g-4211': {
      id: 'g-4211',
      source: 'Textbook §4.2 — Example 4.2.11',
      type: 'guided',
      tags: ['row-ops', 'triangular'],
      prompt: 'Compute \\(\\det(A)\\) for \\(A=\\begin{bmatrix}-5&0&6&3\\\\1&3&0&0\\\\3&6&7&0\\\\7&0&2&1\\end{bmatrix}\\) using row operations.',
      matrix: [[-5, 0, 6, 3], [1, 3, 0, 0], [3, 6, 7, 0], [7, 0, 2, 1]],
      viz: { type: 'rowOps', op: 'replace' },
      steps: [
        { label: 'Goal: lower triangular (type-3 ops preserve det)', math: 'R_1\\leftarrow R_1-3R_4' },
        { label: 'New row 1', math: '[-5-3(7),\\;0-0,\\;6-3(2),\\;3-3(1)]=[-26,0,0,0]' },
        { label: 'Matrix is now lower triangular', math: 'A\\sim\\begin{bmatrix}-26&0&0&0\\\\1&3&0&0\\\\3&6&7&0\\\\7&0&2&1\\end{bmatrix}' },
        { label: 'Diagonal product', math: '\\det(A)=(-26)(3)(7)(1)=-546' }
      ],
      answer: '-546'
    },

    'g-428b': {
      id: 'g-428b',
      source: 'Textbook §4.2 — Example 4.2.28(b)',
      type: 'guided',
      tags: ['proportional', 'shortcut'],
      prompt: 'Evaluate \\(\\det\\begin{bmatrix}1&-2&7\\\\-4&8&5\\\\2&-4&3\\end{bmatrix}\\) without full expansion if possible.',
      matrix: [[1, -2, 7], [-4, 8, 5], [2, -4, 3]],
      viz: { type: 'proportionalCols', cols: [0, 1] },
      steps: [
        { label: 'Compare columns 1 and 2', math: 'C_2 = -2\\,C_1' },
        { label: 'Proportional columns ⇒ det = 0', math: '\\det(A)=0 \\quad\\text{(Prop. 4.2.19(c))}' }
      ],
      answer: '0'
    },

    'g-4222': {
      id: 'g-4222',
      source: 'Textbook §4.2 — Example 4.2.22',
      type: 'guided',
      tags: ['row-ops', '3x3'],
      prompt: 'Find \\(\\det\\begin{bmatrix}0&1&5\\\\3&-6&9\\\\2&6&5\\end{bmatrix}\\) using row operations (track sign changes!).',
      matrix: [[0, 1, 5], [3, -6, 9], [2, 6, 5]],
      viz: { type: 'rowOps', op: 'swap' },
      steps: [
        { label: 'Swap rows 1 and 2', math: 'R_1\\leftrightarrow R_2:\\;\\det\\mapsto -\\det' },
        { label: 'Scale row 1 by 1/3', math: '\\tfrac13 R_1\\to R_1:\\;\\det\\mapsto -3\\det' },
        { label: 'Eliminate below pivot', math: 'R_3\\leftarrow R_3-2R_1' },
        { label: 'Eliminate next', math: 'R_3\\leftarrow R_3-10R_2' },
        { label: 'Upper triangular', math: '-3\\det\\begin{bmatrix}1&-2&3\\\\0&1&5\\\\0&0&-51\\end{bmatrix}' },
        { label: 'Diagonal product', math: '(-3)(1)(1)(-51)=153' }
      ],
      answer: '153'
    },

    'p-2x2-1': {
      id: 'p-2x2-1',
      source: 'Lab Prep Guide — Practice 1 (det step)',
      type: 'practice',
      tags: ['2x2'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}4&7\\\\2&6\\end{bmatrix}\\).',
      answer: '10',
      accept: ['10'],
      hint: '2×2: ad − bc',
      reteach: 'g-lab-notes',
      solution: '4\\cdot 6-7\\cdot 2=24-14=10'
    },

    'p-413-c11': {
      id: 'p-413-c11',
      source: 'Textbook §4.1 — Ex. 4.1.3',
      type: 'practice',
      tags: ['cofactor'],
      prompt: 'For \\(A=\\begin{bmatrix}3&1&-4\\\\2&5&6\\\\1&4&8\\end{bmatrix}\\), find \\(C_{11}\\).',
      answer: '16',
      reteach: 'g-413',
      solution: 'C_{11}=\\det\\begin{bmatrix}5&6\\\\4&8\\end{bmatrix}=40-24=16'
    },

    'p-413-c32': {
      id: 'p-413-c32',
      source: 'Textbook §4.1 — Ex. 4.1.3',
      type: 'practice',
      tags: ['cofactor'],
      prompt: 'For the same \\(A\\) above, find \\(C_{32}\\).',
      answer: '-26',
      accept: ['-26'],
      reteach: 'g-413',
      solution: 'C_{32}=-\\det\\begin{bmatrix}3&-4\\\\2&6\\end{bmatrix}=-(18+8)=-26'
    },

    'p-prelab-b': {
      id: 'p-prelab-b',
      source: 'Pre-Lab 6 MATLAB Grader — Q1',
      type: 'practice',
      tags: ['3x3', 'cofactor'],
      prompt: 'Compute \\(\\det(B)\\) where \\(B=\\begin{bmatrix}1&1&3\\\\3&2&6\\\\4&3&10\\end{bmatrix}\\).',
      matrix: [[1, 1, 3], [3, 2, 6], [4, 3, 10]],
      answer: '-1',
      accept: ['-1'],
      reteach: 'g-414',
      solution: 'Expand along row 1 or use row ops; \\det(B)=-1'
    },

    'p-3x3-1': {
      id: 'p-3x3-1',
      source: 'Lab Notes S26 — Example',
      type: 'practice',
      tags: ['3x3'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}1&-2&3\\\\-4&-5&-6\\\\7&-8&9\\end{bmatrix}\\).',
      answer: '120',
      reteach: 'g-lab-notes',
      solution: 'Row-1 cofactor expansion gives 120'
    },

    'p-tri-3': {
      id: 'p-tri-3',
      source: 'Lab Prep Guide — Practice 2',
      type: 'practice',
      tags: ['triangular'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}1&2&3\\\\0&1&4\\\\0&0&5\\end{bmatrix}\\). Is the matrix invertible?',
      answer: '5, yes',
      accept: ['5', '5 yes', '5, yes', 'yes 5', 'invertible'],
      check: 'contains',
      reteach: 'g-4211',
      solution: 'Upper triangular: 1\\cdot 1\\cdot 5=5\\neq 0, so invertible'
    },

    'p-418': {
      id: 'p-418',
      source: 'Textbook §4.1 — Example 4.1.8',
      type: 'practice',
      tags: ['triangular'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}-1&0&0&0&0\\\\5x&3&0&0&0\\\\x+6&2&2&0&0\\\\4&-13&0&1&0\\\\0&4x^2&9&6&-2\\end{bmatrix}\\).',
      answer: '12',
      reteach: 'g-4211',
      solution: 'Lower triangular: (-1)(3)(2)(1)(-2)=12'
    },

    'p-elem-swap': {
      id: 'p-elem-swap',
      source: 'Lab Prep Guide — Practice 6',
      type: 'practice',
      tags: ['elementary'],
      prompt: 'If \\(E\\) is obtained by swapping rows 1 and 2 of \\(I_3\\), what is \\(\\det(E)\\)?',
      answer: '-1',
      accept: ['-1'],
      reteach: 'g-4211',
      solution: 'Row swap changes sign: \\det(E)=-1'
    },

    'p-kA': {
      id: 'p-kA',
      source: 'Textbook §4.2 — Example 4.2.25',
      type: 'practice',
      tags: ['scalar'],
      prompt: 'If \\(A\\) is \\(3\\times 3\\) and \\(\\det(A)=4\\), find \\(\\det(-2A)\\).',
      answer: '-32',
      accept: ['-32'],
      reteach: 'g-428b',
      solution: '\\det(-2A)=(-2)^3\\det(A)=-8\\cdot 4=-32'
    },

    'p-428c': {
      id: 'p-428c',
      source: 'Textbook §4.2 — Example 4.2.28(c)',
      type: 'practice',
      tags: ['proportional'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\end{bmatrix}\\) using column operations.',
      answer: '0',
      reteach: 'g-428b',
      solution: 'C_3-C_2 then C_2-C_1 creates duplicate columns ⇒ det=0'
    },

    'p-427': {
      id: 'p-427',
      source: 'Textbook §4.2 — Example 4.2.9 / Prop. 4.2.7',
      type: 'practice',
      tags: ['cofactor-property'],
      prompt: 'For \\(A=\\begin{bmatrix}3&1&0\\\\-2&-4&3\\\\5&4&-2\\end{bmatrix}\\), compute \\(-2C_{11}-4C_{12}+3C_{13}\\).',
      answer: '0',
      reteach: 'g-414',
      solution: 'This is row 2 entries times row 1 cofactors ⇒ 0 (duplicate-row trick)'
    },

    'p-429a': {
      id: 'p-429a',
      source: 'Textbook §4.2 — Example 4.2.29(a)',
      type: 'practice',
      tags: ['smart-expansion'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}1&0&-1&1\\\\2&0&0&1\\\\666&-3&-1&10^6\\\\1&0&0&1\\end{bmatrix}\\).',
      answer: '3',
      reteach: 'g-422',
      solution: 'Expand along column 2 (three zeros); final value is 3'
    },

    'p-inv-test': {
      id: 'p-inv-test',
      source: 'Textbook §4.2 — Example 4.2.17',
      type: 'practice',
      tags: ['invertible'],
      prompt: 'Is \\(\\begin{bmatrix}1&2&1\\\\2&2&0\\\\1&3&1\\end{bmatrix}\\) invertible? (Answer yes or no, with det.)',
      answer: 'yes, 2',
      accept: ['yes 2', 'yes, 2', 'yes det=2', 'invertible 2'],
      check: 'contains',
      reteach: 'g-414',
      solution: '\\det=2\\neq 0, so yes'
    },

    'p-4229b': {
      id: 'p-4229b',
      source: 'Textbook §4.2 — Example 4.2.29(b)',
      type: 'practice',
      tags: ['4x4'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}3&5&-2&6\\\\1&2&-1&1\\\\2&4&1&5\\\\3&7&5&3\\end{bmatrix}\\).',
      answer: '-18',
      accept: ['-18'],
      reteach: 'g-422',
      solution: 'Expand col 1 then row-reduce minor; \\det=-18'
    },

    'p-429b': {
      id: 'p-429b',
      source: 'Textbook §4.2 — Example 4.2.29(b) variant',
      type: 'practice',
      tags: ['4x4'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}2&0&-1&4\\\\0&3&0&1\\\\5&0&2&0\\\\0&1&0&2\\end{bmatrix}\\). (Pick a sparse row/column.)',
      answer: '-33',
      accept: ['-33'],
      reteach: 'g-422',
      solution: 'Expand along row 2 or column 2'
    },

    'p-428a': {
      id: 'p-428a',
      source: 'Textbook §4.2 — Example 4.2.28(a)',
      type: 'practice',
      tags: ['3x3'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}3&1&0\\\\-2&-4&3\\\\5&4&-2\\end{bmatrix}\\) by column-1 expansion.',
      answer: '-1',
      accept: ['-1'],
      reteach: 'g-414',
      solution: 'Same matrix as 4.1.4; column-1 expansion also gives -1'
    },

    'p-429a2': {
      id: 'p-429a2',
      source: 'Textbook §4.2 — Example 4.2.21',
      type: 'practice',
      tags: ['column-ops'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}1&1&1\\\\-1&1&-1\\\\2&4&8\\end{bmatrix}\\) using column operations.',
      answer: '12',
      reteach: 'g-4211',
      solution: 'C_2-C_1, C_3-C_1 gives upper triangular with diagonal 1,2,6'
    },

    'p-magic': {
      id: 'p-magic',
      source: 'Pre-Lab 6 MATLAB Grader — Q2',
      type: 'practice',
      tags: ['matlab', 'singular'],
      prompt: 'For the \\(8\\times 8\\) magic matrix \\(M\\), what are \\(\\det(M)\\) and \\(\\mathrm{rank}(M)\\)? (format: det, rank)',
      answer: '0, 3',
      accept: ['0 3', '0, 3', 'det=0 rank=3'],
      check: 'contains',
      reteach: 'g-428b',
      solution: 'Magic 8×8 is singular: det=0, rank=3'
    },

    'p-equiv': {
      id: 'p-equiv',
      source: 'Lab Notes S26 — Equivalent Statements',
      type: 'practice',
      tags: ['concept'],
      prompt: 'True or false: If \\(A\\) is \\(3\\times 3\\) and \\(\\det(A)=0\\), then \\(Ax=b\\) has a unique solution for every \\(b\\).',
      answer: 'false',
      accept: ['f', 'false'],
      check: 'tf',
      reteach: 'g-428b',
      solution: 'det=0 ⇒ singular ⇒ not unique for every b'
    },

    'p-detAB': {
      id: 'p-detAB',
      source: 'Textbook §4.2 — Thm 4.2.23',
      type: 'practice',
      tags: ['product'],
      prompt: 'If \\(\\det(A)=-3\\) and \\(\\det(B)=5\\), find \\(\\det(AB)\\) and \\(\\det(A^{-1})\\).',
      answer: '-15, -1/3',
      accept: ['-15 -1/3', '-15, -1/3', '-15 and -1/3'],
      check: 'contains',
      reteach: 'g-428b',
      solution: '\\det(AB)=-15,\\;\\det(A^{-1})=1/(-3)=-1/3'
    },

    'gnt-1': { id: 'gnt-1', source: 'Gauntlet', type: 'gauntlet', tags: ['2x2'], prompt: '\\(\\det\\begin{bmatrix}-2&5\\\\3&1\\end{bmatrix}=\\)?', answer: '-17', reteach: 'g-lab-notes', solution: '-2-15=-17' },
    'gnt-2': { id: 'gnt-2', source: 'Gauntlet', type: 'gauntlet', tags: ['3x3'], prompt: '\\(\\det\\begin{bmatrix}2&0&1\\\\0&3&0\\\\4&0&5\\end{bmatrix}=\\)?', answer: '18', reteach: 'g-422', solution: 'Expand row 2: 3·(2·5-1·4)=18' },
    'gnt-3': { id: 'gnt-3', source: 'Gauntlet', type: 'gauntlet', tags: ['triangular'], prompt: '\\(\\det\\begin{bmatrix}2&0&0\\\\7&-1&0\\\\0&0&5\\end{bmatrix}=\\)?', answer: '-10', reteach: 'g-4211', solution: '2·(-1)·5=-10' },
    'gnt-4': { id: 'gnt-4', source: 'Gauntlet', type: 'gauntlet', tags: ['proportional'], prompt: '\\(\\det\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}=\\)?', answer: '0', reteach: 'g-428b', solution: 'Proportional rows' },
    'gnt-5': { id: 'gnt-5', source: 'Gauntlet', type: 'gauntlet', tags: ['scalar'], prompt: '3×3 matrix, det(A)=2. Find det(3A).', answer: '54', reteach: 'g-428b', solution: '3^3·2=54' },
    'gnt-6': { id: 'gnt-6', source: 'Gauntlet', type: 'gauntlet', tags: ['elementary'], prompt: 'det(E) when E swaps rows 1 and 2 of I₄?', answer: '-1', reteach: 'g-4211', solution: 'Swap ⇒ -1' },
    'gnt-7': { id: 'gnt-7', source: 'Gauntlet', type: 'gauntlet', tags: ['3x3'], prompt: '\\(\\det\\begin{bmatrix}1&0&2\\\\-1&3&1\\\\0&0&4\\end{bmatrix}=\\)?', answer: '12', reteach: 'g-414', solution: 'Lower triangular: 1·3·4=12' },
    'gnt-8': { id: 'gnt-8', source: 'Gauntlet', type: 'gauntlet', tags: ['cofactor'], prompt: 'For A=[[1,2,0],[0,1,3],[2,0,1]], find C₂₃.', answer: '-4', accept: ['-4'], reteach: 'g-413', solution: 'C23=+det[[1,2],[2,0]]=-4' },
    'gnt-9': { id: 'gnt-9', source: 'Gauntlet', type: 'gauntlet', tags: ['tf'], prompt: 'T/F: det(A+B)=det(A)+det(B) in general.', answer: 'false', check: 'tf', reteach: 'g-428b', solution: 'False — Remark 4.2.27 counterexample' },
    'gnt-10': { id: 'gnt-10', source: 'Gauntlet', type: 'gauntlet', tags: ['4x4'], prompt: '\\(\\det\\begin{bmatrix}1&0&0&2\\\\0&2&0&0\\\\0&0&3&0\\\\0&0&0&4\\end{bmatrix}=\\)?', answer: '24', reteach: 'g-422', solution: 'Diagonal: 1·2·3·4=24' },

    'pred-1': {
      id: 'pred-1',
      source: 'Predicted — Lab cofactor task',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'Find \\(\\det(A)\\) if \\(a_{11}C_{21}+a_{12}C_{22}+a_{13}C_{23}\\) for \\(A=\\begin{bmatrix}2&-1&0\\\\0&3&1\\\\4&0&2\\end{bmatrix}\\) equals this expansion along row 2.',
      answer: '8',
      reteach: 'g-422',
      solution: 'Row-2 expansion: 3C_{22}+1C_{23}=3(4)+1(-4)=8'
    },

    'pred-2': {
      id: 'pred-2',
      source: 'Predicted — MATLAB rank/det',
      type: 'practice',
      tags: ['predicted', 'matlab'],
      prompt: 'A 4×4 matrix has det=0 and rank=2. Can A⁻¹ exist? (yes/no)',
      answer: 'no',
      accept: ['no', 'n'],
      check: 'tf',
      reteach: 'g-428b',
      solution: 'det=0 ⇒ not invertible'
    },

    'pred-3': {
      id: 'pred-3',
      source: 'Predicted — Row op tracking',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'Start with det(A)=6. Swap rows 1 and 2, then multiply row 1 by -2. New det?',
      answer: '12',
      reteach: 'g-4211',
      solution: 'Swap: -6; scale by -2: (-2)(-6)=12'
    },

    'pred-4': {
      id: 'pred-4',
      source: 'Predicted — Pascal pattern',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'The 4×4 Pascal matrix has det=1. For 5×5 Pascal, det=?',
      answer: '1',
      reteach: 'g-4211',
      solution: 'Pascal matrices have det=1'
    },

    'pred-5': {
      id: 'pred-5',
      source: 'Predicted — Invertible matrix theorem',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'T/F: For 3×3 A, if rank(A)=3 then det(A)≠0.',
      answer: 'true',
      check: 'tf',
      reteach: 'g-428b',
      solution: 'True — Thm 4.2.16'
    },

    'pred-6': {
      id: 'pred-6',
      source: 'Predicted — Lab style 3×3',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'Compute \\(\\det\\begin{bmatrix}0&2&1\\\\1&0&3\\\\2&1&0\\end{bmatrix}\\).',
      answer: '13',
      reteach: 'g-414',
      solution: 'Cofactor expansion along row 1 gives 13'
    },

    'pred-7': {
      id: 'pred-7',
      source: 'Predicted — det(A^T)',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'If det(A)=7, what is det(Aᵀ)?',
      answer: '7',
      reteach: 'g-428b',
      solution: 'det(A^T)=det(A)=7'
    },

    'pred-8': {
      id: 'pred-8',
      source: 'Predicted — Combined lab concept',
      type: 'practice',
      tags: ['predicted'],
      prompt: 'Classify: \\(\\begin{bmatrix}2&0&0\\\\0&-1&0\\\\0&0&5\\end{bmatrix}\\) — symmetric? diagonal? (answer both)',
      answer: 'both',
      accept: ['both', 'symmetric and diagonal', 'symmetric diagonal'],
      check: 'contains',
      reteach: 'g-4211',
      solution: 'Diagonal matrices are symmetric'
    }
  }
};
