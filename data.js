const APP_DATA = {
  stages: [
    {
      id: "A",
      title: "Stage A - Cofactor foundation",
      goal: "Know submatrix, minor, cofactor, sign grid, and 2x2 determinant without hesitation.",
      path: [
        "Do Guided Lesson 1.",
        "Do Guided Lesson 2.",
        "Start Stage A gauntlet.",
        "Exit condition: reproduce the 3x3 sign grid and solve two cofactor questions on paper."
      ]
    },
    {
      id: "B",
      title: "Stage B - Compute determinants efficiently",
      goal: "Choose the easiest row/column, use zeros, and use triangular shortcuts.",
      path: [
        "Do Guided Lesson 3.",
        "Use the cofactor visualizer once.",
        "Start Stage B gauntlet.",
        "Then return to two Stage A review questions."
      ]
    },
    {
      id: "C",
      title: "Stage C - Properties and row operations",
      goal: "Track which determinant properties preserve, scale, or flip the determinant.",
      path: [
        "Use the row-operation tracker.",
        "Do Guided Lesson 4.",
        "Start Stage C gauntlet.",
        "Then return to one Stage A and one Stage B review question."
      ]
    },
    {
      id: "D",
      title: "Stage D - Invertibility, rank, linear independence, MATLAB",
      goal: "Connect det(A) != 0, inverse, RREF, rank, unique solutions, and MATLAB outputs.",
      path: [
        "Do Guided Lesson 5.",
        "Run the mixed interleaved gauntlet.",
        "Practice the wrong queue until it is empty twice.",
        "Exit condition: explain every item in the invertible matrix checklist aloud."
      ]
    }
  ],

  lessons: [
    {
      id: "cofactor-basics",
      title: "Guided 1: What a cofactor is",
      source: "Hu et al. Section 4.1 Definition 4.1.1 + Lab Notes",
      summary: "Plain English first: delete, sign, 2x2 determinant.",
      steps: [
        {
          label: "Step 1 - Plain English",
          body: "A cofactor is the determinant of what remains after you delete one row and one column, with a sign attached to its position."
        },
        {
          label: "Step 2 - Sign pattern",
          body: "The sign starts positive at position (1,1), then alternates like a checkerboard: + - + / - + - / + - +."
        },
        {
          label: "Step 3 - Formula as shorthand",
          body: "C_ij = (-1)^(i+j) det(A_ij). The exponent creates the sign. A_ij is the smaller matrix after deleting row i and column j."
        },
        {
          label: "Step 4 - Example setup",
          body: "For A = [[3,1,-4],[2,5,6],[1,4,8]], find C_32. Delete row 3 and column 2."
        },
        {
          label: "Step 5 - Remaining matrix",
          body: "A_32 = [[3,-4],[2,6]]. Position (3,2) has sign (-1)^(3+2) = (-1)^5 = -1."
        },
        {
          label: "Step 6 - Write the math",
          body: "C_32 = -det([[3,-4],[2,6]]) = -[3(6) - (-4)(2)] = -(18 + 8) = -26."
        },
        {
          label: "Recall gate",
          body: "Look away. Say: cofactor = position sign times determinant of the remaining submatrix. Then write the 3x3 sign grid from memory."
        }
      ]
    },
    {
      id: "first-row-expansion",
      title: "Guided 2: 3x3 determinant by cofactor expansion",
      source: "Current MA123 Lab 6 notes + Hu et al. Example 4.1.4",
      summary: "Every term shown; no skipped arithmetic.",
      steps: [
        {
          label: "Step 1 - Problem",
          body: "Find det(A) for A = [[1,-2,3],[-4,-5,-6],[7,-8,9]] using the first row."
        },
        {
          label: "Step 2 - Expansion pattern",
          body: "First-row signs are +, -, +. det(A) = a11 det(A_11) - a12 det(A_12) + a13 det(A_13)."
        },
        {
          label: "Step 3 - Substitute entries",
          body: "det(A) = 1 det([[-5,-6],[-8,9]]) - (-2) det([[-4,-6],[7,9]]) + 3 det([[-4,-5],[7,-8]])."
        },
        {
          label: "Step 4 - Compute first 2x2",
          body: "det([[-5,-6],[-8,9]]) = (-5)(9) - (-6)(-8) = -45 - 48 = -93."
        },
        {
          label: "Step 5 - Compute second 2x2",
          body: "det([[-4,-6],[7,9]]) = (-4)(9) - (-6)(7) = -36 + 42 = 6."
        },
        {
          label: "Step 6 - Compute third 2x2",
          body: "det([[-4,-5],[7,-8]]) = (-4)(-8) - (-5)(7) = 32 + 35 = 67."
        },
        {
          label: "Step 7 - Combine",
          body: "det(A) = 1(-93) - (-2)(6) + 3(67) = -93 + 12 + 201 = 120."
        },
        {
          label: "Trap check",
          body: "The middle sign is the trap. Because a12 = -2, the term is -(-2)(6), not +(-2)(6)."
        }
      ]
    },
    {
      id: "smart-expansion",
      title: "Guided 3: Choose the row or column with zeros",
      source: "Hu et al. Section 4.2 Example 4.2.2",
      summary: "Use zeros to reduce work.",
      steps: [
        {
          label: "Step 1 - Problem",
          body: "Compute det(A) where A = [[1,3,1,2],[0,1,0,0],[0,2,-2,0],[-1,2,1,1]]."
        },
        {
          label: "Step 2 - Choose row",
          body: "Row 2 has three zeros, so expand along row 2. Only a22 = 1 contributes."
        },
        {
          label: "Step 3 - Sign and submatrix",
          body: "Position (2,2) has positive sign. det(A) = 1 det([[1,1,2],[0,-2,0],[-1,1,1]])."
        },
        {
          label: "Step 4 - Choose row again",
          body: "In the 3x3 matrix, row 2 has two zeros. Expand along row 2. The entry is -2 at position (2,2), positive sign."
        },
        {
          label: "Step 5 - Reduce to 2x2",
          body: "det(A) = (-2) det([[1,2],[-1,1]])."
        },
        {
          label: "Step 6 - Finish",
          body: "det([[1,2],[-1,1]]) = 1(1) - 2(-1) = 1 + 2 = 3. So det(A) = -2(3) = -6."
        }
      ]
    },
    {
      id: "row-operations",
      title: "Guided 4: Row operations and determinant changes",
      source: "Current Lab 6 notes + Hu et al. Theorem 4.2.10",
      summary: "Preserve, scale, or flip.",
      steps: [
        {
          label: "Step 1 - The three effects",
          body: "Row replacement does not change det(A). Scaling one row by r multiplies det(A) by r. Swapping two rows changes the sign."
        },
        {
          label: "Step 2 - Example matrix",
          body: "Let det(A) = 5. If B is made by R3 <- R3 + 4R1, then det(B) = 5."
        },
        {
          label: "Step 3 - Scaling",
          body: "If C is made by R2 <- -2R2, then det(C) = (-2)det(A) = -10."
        },
        {
          label: "Step 4 - Swap",
          body: "If D is made by swapping R1 and R3, then det(D) = -det(A) = -5."
        },
        {
          label: "Step 5 - Combined operations",
          body: "If you swap once and then scale one row by 3, the determinant factor is (-1)(3) = -3. Starting from det(A)=5 gives -15."
        },
        {
          label: "Recall gate",
          body: "Say aloud: replace preserves, scale multiplies, swap flips. Then write one example of each."
        }
      ]
    },
    {
      id: "invertibility",
      title: "Guided 5: Determinants and invertibility",
      source: "Current Lab 6 notes + Hu et al. Theorems 4.2.15 and 4.2.16",
      summary: "det(A) decides the invertibility checklist for square matrices.",
      steps: [
        {
          label: "Step 1 - Main condition",
          body: "For an n x n matrix, det(A) != 0 means A is invertible. det(A) = 0 means A is singular."
        },
        {
          label: "Step 2 - What det(A) != 0 also means",
          body: "If det(A) != 0, then RREF(A) = I, rank(A) = n, the columns are linearly independent, and Ax=b has a unique solution for every b."
        },
        {
          label: "Step 3 - What det(A)=0 does not mean",
          body: "det(A)=0 does not automatically tell you 'no solution' or 'infinitely many' for Ax=b. It tells you no unique solution for every b."
        },
        {
          label: "Step 4 - MATLAB connection",
          body: "In MATLAB: det(A) checks singular/non-singular, rank(A) counts pivots, rref(A) shows whether the square matrix reduces to I."
        },
        {
          label: "Step 5 - Pre-lab example",
          body: "For magic(8), MATLAB gave detM = 0 and rankM = 3. Since rankM < 8, M is singular and M^-1 does not exist."
        },
        {
          label: "Recall gate",
          body: "Look away. Say the chain: det nonzero -> invertible -> RREF I -> rank n -> columns independent -> unique Ax=b for every b."
        }
      ]
    }
  ],

  questions: [
    {
      id: "q01",
      stage: "A",
      type: "numeric",
      source: "Hu et al. Example 4.1.3",
      title: "Cofactor C_11",
      prompt: "For A = [[3,1,-4],[2,5,6],[1,4,8]], find C_11.",
      accepted: ["16"],
      reteach: "Delete row 1 and column 1: [[5,6],[4,8]]. Sign at (1,1) is +. C_11 = 5(8)-6(4) = 40-24 = 16.",
      solution: ["A_11 = [[5,6],[4,8]]", "C_11 = (+)det(A_11)", "C_11 = 5(8)-6(4) = 16"]
    },
    {
      id: "q02",
      stage: "A",
      type: "numeric",
      source: "Hu et al. Example 4.1.3",
      title: "Cofactor C_32",
      prompt: "For A = [[3,1,-4],[2,5,6],[1,4,8]], find C_32.",
      accepted: ["-26"],
      reteach: "Position (3,2) is negative. Delete row 3 and column 2: [[3,-4],[2,6]]. det = 3(6)-(-4)(2)=26. Cofactor = -26.",
      solution: ["A_32 = [[3,-4],[2,6]]", "(-1)^(3+2) = -1", "C_32 = -[3(6)-(-4)(2)] = -26"]
    },
    {
      id: "q03",
      stage: "A",
      type: "text",
      source: "Current Lab 6 notes",
      title: "Sign grid recall",
      prompt: "Type the 3x3 cofactor sign grid row by row using + and -. Example format: +-+/-+-/+-+",
      accepted: ["+-+/-+-/+-+", "+ - + / - + - / + - +"],
      reteach: "Start at (1,1) with + and alternate. Corners and center are +. Edges are -.",
      solution: ["Row 1: + - +", "Row 2: - + -", "Row 3: + - +"]
    },
    {
      id: "q04",
      stage: "A",
      type: "numeric",
      source: "Current Lab 6 notes",
      title: "2x2 determinant",
      prompt: "Find det([[4,7],[2,6]]).",
      accepted: ["10"],
      reteach: "For [[a,b],[c,d]], det = ad - bc. Here 4(6)-7(2)=24-14=10.",
      solution: ["det = ad - bc", "det = 4(6)-7(2)", "det = 24-14 = 10"]
    },
    {
      id: "q05",
      stage: "A",
      type: "numeric",
      source: "Likely Lab 6 variant",
      title: "Middle cofactor sign",
      prompt: "For A = [[2,-1,5],[0,3,4],[7,1,-2]], find C_12.",
      accepted: ["28"],
      reteach: "Position (1,2) is negative. Delete row 1 column 2: [[0,4],[7,-2]]. det = 0(-2)-4(7)=-28. Cofactor = -(-28)=28.",
      solution: ["A_12 = [[0,4],[7,-2]]", "C_12 = -det(A_12)", "C_12 = -[0(-2)-4(7)] = 28"]
    },
    {
      id: "q06",
      stage: "B",
      type: "numeric",
      source: "Current Lab 6 notes",
      title: "Full 3x3 determinant",
      prompt: "Find det([[1,-2,3],[-4,-5,-6],[7,-8,9]]) using first-row expansion.",
      accepted: ["120"],
      reteach: "Use + - + along row 1. The middle term is -(-2) times its 2x2 determinant.",
      solution: ["det = 1[(-5)(9)-(-6)(-8)] - (-2)[(-4)(9)-(-6)(7)] + 3[(-4)(-8)-(-5)(7)]", "det = 1(-93) - (-2)(6) + 3(67)", "det = -93 + 12 + 201 = 120"]
    },
    {
      id: "q07",
      stage: "B",
      type: "numeric",
      source: "Hu et al. Example 4.1.4",
      title: "Expansion with zero",
      prompt: "Find det([[3,1,0],[-2,-4,3],[5,4,-2]]) using first-row expansion.",
      accepted: ["-1"],
      reteach: "The third term is zero. Compute 3[(-4)(-2)-3(4)] - 1[(-2)(-2)-3(5)].",
      solution: ["det = 3det([[-4,3],[4,-2]]) - 1det([[-2,3],[5,-2]]) + 0", "det = 3(8-12) - (4-15)", "det = 3(-4) - (-11) = -1"]
    },
    {
      id: "q08",
      stage: "B",
      type: "numeric",
      source: "Hu et al. Example 4.2.2",
      title: "4x4 smart expansion",
      prompt: "Find det([[1,3,1,2],[0,1,0,0],[0,2,-2,0],[-1,2,1,1]]).",
      accepted: ["-6"],
      reteach: "Expand along row 2, then along row 2 of the 3x3. You get (-2)det([[1,2],[-1,1]]) = -2(3) = -6.",
      solution: ["Expand row 2: det(A)=1det([[1,1,2],[0,-2,0],[-1,1,1]])", "Expand row 2 again: det(A)=(-2)det([[1,2],[-1,1]])", "det(A)=(-2)(1(1)-2(-1))=-6"]
    },
    {
      id: "q09",
      stage: "B",
      type: "numeric",
      source: "Hu et al. Example 4.1.8",
      title: "Lower triangular determinant",
      prompt: "A lower triangular matrix has diagonal entries -1, 3, 2, 1, -2. Find its determinant.",
      accepted: ["12"],
      reteach: "For triangular matrices, ignore everything off the diagonal. Multiply the diagonal entries.",
      solution: ["det(A)=(-1)(3)(2)(1)(-2)", "det(A)=12"]
    },
    {
      id: "q10",
      stage: "B",
      type: "numeric",
      source: "Hu et al. Example 4.2.29(a)",
      title: "Expand along sparse column",
      prompt: "Find det([[1,0,-1,1],[2,0,0,1],[666,-3,-1,1000000],[1,0,0,1]]).",
      accepted: ["3"],
      reteach: "The second column has one nonzero entry: -3 at position (3,2), whose sign is negative. Continue with the sparse 3x3.",
      solution: ["det(A)=(-3)(-1)^(3+2)det([[1,-1,1],[2,0,1],[1,0,1]])", "det(A)=3det([[1,-1,1],[2,0,1],[1,0,1]])", "Expand the 3x3 along column 2: det = 3[(-1)(-1)^(1+2)det([[2,1],[1,1]])]", "det = 3[(-1)(-1)(1)] = 3"]
    },
    {
      id: "q11",
      stage: "C",
      type: "numeric",
      source: "Current Lab 6 notes",
      title: "Row replacement effect",
      prompt: "If det(A)=7 and B is made from A by R3 <- R3 + 5R1, find det(B).",
      accepted: ["7"],
      reteach: "Adding a multiple of one row to another row does not change the determinant.",
      solution: ["Row replacement preserves determinant", "det(B)=det(A)=7"]
    },
    {
      id: "q12",
      stage: "C",
      type: "numeric",
      source: "Current Lab 6 notes",
      title: "Row swap effect",
      prompt: "If det(A)=7 and B is made by swapping two rows of A, find det(B).",
      accepted: ["-7"],
      reteach: "One row swap changes the sign of the determinant.",
      solution: ["One swap -> multiply determinant by -1", "det(B)=-det(A)=-7"]
    },
    {
      id: "q13",
      stage: "C",
      type: "numeric",
      source: "Current Lab 6 notes",
      title: "Row scaling effect",
      prompt: "If det(A)=7 and B is made by multiplying row 2 by -3, find det(B).",
      accepted: ["-21"],
      reteach: "Scaling one row by k scales the determinant by k.",
      solution: ["R2 <- -3R2 means det(B)=(-3)det(A)", "det(B)=(-3)(7)=-21"]
    },
    {
      id: "q14",
      stage: "C",
      type: "numeric",
      source: "Likely Lab 6 variant",
      title: "Combined operations",
      prompt: "If det(A)=-4, B is made by one row swap, then R1 <- 2R1, then R3 <- R3 - 9R2. Find det(B).",
      accepted: ["8"],
      reteach: "Swap multiplies by -1. Scaling row 1 by 2 multiplies by 2. Row replacement does nothing.",
      solution: ["Factor = (-1)(2)(1) = -2", "det(B)=(-2)det(A)", "det(B)=(-2)(-4)=8"]
    },
    {
      id: "q15",
      stage: "C",
      type: "truefalse",
      source: "Hu et al. Theorem 4.2.18",
      title: "Transpose property",
      prompt: "True or False: For every square matrix A, det(A^T)=det(A).",
      accepted: ["true", "t"],
      reteach: "Transpose does not change determinant for square matrices.",
      solution: ["True", "det(A^T)=det(A)"]
    },
    {
      id: "q16",
      stage: "C",
      type: "truefalse",
      source: "Hu et al. Remark 4.2.27",
      title: "Addition trap",
      prompt: "True or False: det(A+B)=det(A)+det(B) for all square matrices A and B.",
      accepted: ["false", "f"],
      reteach: "There is no simple determinant rule for matrix addition. Product works; addition does not.",
      solution: ["False", "Example from text: det(A)=1, det(B)=8, but det(A+B)=23, not 9."]
    },
    {
      id: "q17",
      stage: "C",
      type: "numeric",
      source: "Hu et al. Example 4.2.25",
      title: "Scalar multiple of matrix",
      prompt: "A is 3x3 and det(A)=5. Find det(-2A).",
      accepted: ["-40"],
      reteach: "For an n x n matrix, det(kA)=k^n det(A). Here n=3, so (-2)^3(5)=-8(5)=-40.",
      solution: ["det(kA)=k^n det(A)", "det(-2A)=(-2)^3 det(A)", "det(-2A)=-8(5)=-40"]
    },
    {
      id: "q18",
      stage: "C",
      type: "numeric",
      source: "Hu et al. Corollary 4.2.26",
      title: "Determinant of inverse",
      prompt: "If det(A)=-4 and A is invertible, find det(A^-1).",
      accepted: ["-1/4", "-0.25"],
      reteach: "det(A^-1)=1/det(A), so det(A^-1)=1/(-4)=-1/4.",
      solution: ["det(A^-1)=1/det(A)", "det(A^-1)=1/(-4)=-1/4"]
    },
    {
      id: "q19",
      stage: "C",
      type: "numeric",
      source: "Hu et al. Theorem 4.2.23",
      title: "Product property",
      prompt: "If det(A)=-2 and det(B)=6 for same-size square matrices, find det(AB).",
      accepted: ["-12"],
      reteach: "The determinant of a product equals the product of the determinants.",
      solution: ["det(AB)=det(A)det(B)", "det(AB)=(-2)(6)=-12"]
    },
    {
      id: "q20",
      stage: "D",
      type: "text",
      source: "Current Lab 6 notes",
      title: "Invertibility from determinant",
      prompt: "A is 3x3 and det(A)=0. Type 'invertible' or 'singular'.",
      accepted: ["singular", "not invertible", "non-invertible", "not invertible"],
      reteach: "For square matrices, det(A)=0 means A is singular and A^-1 does not exist.",
      solution: ["det(A)=0", "A is singular", "A^-1 does not exist"]
    },
    {
      id: "q21",
      stage: "D",
      type: "truefalse",
      source: "Hu et al. Theorem 4.2.16",
      title: "Unique solution for every b",
      prompt: "True or False: If det(A)!=0 for an n x n matrix, Ax=b has a unique solution for every b in R^n.",
      accepted: ["true", "t"],
      reteach: "This is one of the equivalent statements for square invertible matrices.",
      solution: ["True", "det(A)!=0 -> A invertible -> unique solution for every b."]
    },
    {
      id: "q22",
      stage: "D",
      type: "truefalse",
      source: "MA123 Gemini Adaptive Prompt Guide trap",
      title: "Singular system trap",
      prompt: "True or False: If det(A)=0, then Ax=b always has infinitely many solutions.",
      accepted: ["false", "f"],
      reteach: "det(A)=0 means no unique solution for every b. Depending on b, a system can have no solutions or infinitely many.",
      solution: ["False", "Counterexample: A=[[1,0],[0,0]], b=[[0],[1]] gives 0=1 in row 2, so no solution."]
    },
    {
      id: "q23",
      stage: "D",
      type: "text",
      source: "Current Lab 6 notes",
      title: "Zero row in RREF",
      prompt: "A is 3x3 and rref(A) has a zero row. What is det(A)?",
      accepted: ["0", "zero"],
      reteach: "A zero row in RREF means no pivot in every row, so A is singular and det(A)=0.",
      solution: ["rref(A) has a zero row", "rank(A)<3", "det(A)=0"]
    },
    {
      id: "q24",
      stage: "D",
      type: "text",
      source: "MATLAB Grader pre-lab",
      title: "MATLAB det command",
      prompt: "In MATLAB, what command computes the determinant of matrix A?",
      accepted: ["det(a)", "det(A)"],
      reteach: "MATLAB uses det(A) for the determinant of A.",
      solution: ["Command: det(A)"]
    },
    {
      id: "q25",
      stage: "D",
      type: "numeric",
      source: "MATLAB Grader pre-lab Q1",
      title: "MATLAB matrix B determinant",
      prompt: "For B = [[1,1,3],[3,2,6],[4,3,10]], find det(B).",
      accepted: ["-1"],
      reteach: "This is the pre-lab B matrix. Expanding row 1 gives -2 - 6 + 7 = -1.",
      solution: ["det(B)=1det([[2,6],[3,10]]) - 1det([[3,6],[4,10]]) + 3det([[3,2],[4,3]])", "det(B)=1(20-18) - (30-24) + 3(9-8)", "det(B)=2-6+3=-1"]
    },
    {
      id: "q26",
      stage: "D",
      type: "text",
      source: "MATLAB Grader pre-lab Q2",
      title: "Magic matrix conclusion",
      prompt: "MATLAB gives detM=0 and rankM=3 for an 8x8 matrix M. Does M^-1 exist? Type yes or no.",
      accepted: ["no", "no.", "does not exist"],
      reteach: "For an 8x8 matrix, rank must be 8 to be invertible. rankM=3 and detM=0 mean M is singular.",
      solution: ["detM=0", "rankM=3<8", "M is singular, so M^-1 does not exist."]
    },
    {
      id: "q27",
      stage: "B",
      type: "numeric",
      source: "Hu et al. Example 4.2.17",
      title: "Invertible by determinant",
      prompt: "Find det([[1,2,1],[2,2,0],[1,3,1]]).",
      accepted: ["2"],
      reteach: "Expand along row 1: det = 1(2) - 2(2) + 1(4) = 2.",
      solution: ["det = det([[2,0],[3,1]]) - 2det([[2,0],[1,1]]) + det([[2,2],[1,3]])", "det = 2 - 2(2) + (6-2)", "det = 2 - 4 + 4 = 2"]
    },
    {
      id: "q28",
      stage: "B",
      type: "numeric",
      source: "Hu et al. Example 4.2.28(b)",
      title: "Proportional columns",
      prompt: "Find det([[1,-2,7],[-4,8,5],[2,-4,3]]).",
      accepted: ["0"],
      reteach: "Column 2 is -2 times column 1, so two columns are proportional and determinant is 0.",
      solution: ["C2 = -2C1", "Proportional columns -> det(A)=0"]
    },
    {
      id: "q29",
      stage: "C",
      type: "numeric",
      source: "Hu et al. Example 4.2.22",
      title: "Row-reduction determinant",
      prompt: "Find det([[0,1,5],[3,-6,9],[2,6,5]]).",
      accepted: ["153"],
      reteach: "Track operations: one swap gives a negative, scaling R1 by 1/3 means carry a factor of 3, replacements preserve.",
      solution: ["Swap R1<->R2: det(original) = -det([[3,-6,9],[0,1,5],[2,6,5]])", "Scale R1 by 1/3: det(original) = -3det([[1,-2,3],[0,1,5],[2,6,5]])", "R3<-R3-2R1 and R3<-R3-10R2 preserve", "det(original)=-3det([[1,-2,3],[0,1,5],[0,0,-51]])", "det(original)=(-3)(1)(1)(-51)=153"]
    },
    {
      id: "q30",
      stage: "D",
      type: "truefalse",
      source: "Hu et al. Theorem 4.2.16",
      title: "Columns independent",
      prompt: "True or False: For a square matrix A, det(A)!=0 is equivalent to the columns of A being linearly independent.",
      accepted: ["true", "t"],
      reteach: "For n x n matrices, det(A)!=0, invertibility, rank n, and independent columns are equivalent.",
      solution: ["True", "This is one item in the invertible matrix theorem checklist."]
    },
    {
      id: "q31",
      stage: "A",
      type: "numeric",
      source: "Invented likely lab cofactor question",
      title: "Cofactor C_23",
      prompt: "For A = [[1,0,2],[-3,4,5],[6,1,-2]], find C_23.",
      accepted: ["-1"],
      reteach: "Position (2,3) is negative. Delete row 2 column 3: [[1,0],[6,1]]. det = 1. Cofactor = -1.",
      solution: ["A_23 = [[1,0],[6,1]]", "(-1)^(2+3)=-1", "C_23=-[1(1)-0(6)] = -1"]
    },
    {
      id: "q32",
      stage: "B",
      type: "numeric",
      source: "Invented likely lab determinant question",
      title: "Choose best column",
      prompt: "Find det([[2,0,1],[3,0,-4],[5,7,2]]) by expanding along the column with most zeros.",
      accepted: ["77"],
      reteach: "Column 2 has two zeros. Only 7 at position (3,2) contributes. Its sign is negative. det([[2,1],[3,-4]])=-11, so -7(-11)=77.",
      solution: ["Expand along column 2", "det(A)=7(-1)^(3+2)det([[2,1],[3,-4]])", "det(A)=-7[2(-4)-1(3)]", "det(A)=-7[-11]=77"]
    },
    {
      id: "q34",
      stage: "C",
      type: "truefalse",
      source: "Likely Lab 6 T/F",
      title: "AB versus BA determinant",
      prompt: "True or False: If A and B are same-size square matrices, det(AB)=det(BA), even if AB is not equal to BA.",
      accepted: ["true", "t"],
      reteach: "det(AB)=det(A)det(B)=det(B)det(A)=det(BA). Determinants turn products into numbers, and number multiplication commutes.",
      solution: ["True", "det(AB)=det(A)det(B)=det(B)det(A)=det(BA)"]
    },
    {
      id: "q35",
      stage: "D",
      type: "text",
      source: "Current Lab 6 prep guide",
      title: "Elementary row swap matrix",
      prompt: "If E is made by swapping rows 1 and 2 of I_3, what does EA do to A?",
      accepted: ["swaps rows 1 and 2", "swap rows 1 and 2", "swaps row 1 and row 2", "interchanges rows 1 and 2"],
      reteach: "Left multiplication by an elementary matrix performs the matching row operation on A.",
      solution: ["E is the row-swap elementary matrix", "EA swaps rows 1 and 2 of A"]
    }
  ]
};
