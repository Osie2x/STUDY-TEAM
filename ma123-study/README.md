# MA123 — Complete Study Hub

Interactive, visual, **by-hand** study guides for the rest of MA123 (Intro Linear
Algebra, Hu et al.). Built on the same engine as the Lab 6 Determinants app
(`preview.html`) — one shared framework, many self-contained HTML guides.

**Final exam:** Saturday **Aug 8, 8:30 a.m., LH1009.**

---

## How to use it

Everything is prebuilt in **`dist/`** as standalone `.html` files. Download the
`dist/` folder and **open `00-START-HERE-Study-Plan.html`** — it links to every
guide and lays out a schedule. Or open any single file directly by double-clicking.

Each guide runs offline except MathJax + fonts (loaded from a CDN the first time).

### What's inside `dist/`

| File | What it is |
|------|-----------|
| `00-START-HERE-Study-Plan.html` | The hub: schedule + links to everything |
| `Lab7-Span-Independence-Rank.html` | **Lab 7 (due Jul 6)** — §5.2 + full RREF refresher |
| `Lab8-Bases-Dimension.html` | Lab 8 — basis, dimension, rank–nullity |
| `Lab9-Matrix-Transformations.html` | Lab 9 — transformations & compositions |
| `Lab10-Eigenvalues-Diagonalization.html` | Lab 10 — eigenvalues & diagonalization (Ch 7) |
| `Review-Ch1-2-Systems-Vectors.html` | Final review — systems, RREF, dot/cross, lines/planes |
| `Review-Ch3-4-Matrices-Determinants.html` | Final review — matrix algebra, transformations, determinants |
| `Review-Ch5-6-Subspaces-Bases.html` | Final review — subspaces, span, independence, basis |
| `Review-Ch7-Eigen-Diagonalization.html` | Final review — eigenvalues & diagonalization |
| `Mock-Final-1-Walkthrough.html` | Mock 1 — every question type solved, then a practice variant |
| `Mock-Final-2-Open-Notes-Timed.html` | Mock 2 — open notes, timer, graded, follow-ups on misses |
| `Mock-Final-3..6-Closed-Book.html` | Mocks 3–6 — closed-book, timed, graded, follow-ups |

### How each guide teaches
- **Learn** → **Guided** (one step per click) → **Practice gauntlet** (locked, no AI /
  no internet / no calculator; wrong answers reteach + hand you a fresh one).
- **Interleaving**: earlier skills return as spaced-review gauntlets.
- **Wrong-Answer Tracker** (bottom-right) logs misses; progress saves per guide.
- **Mock finals 2–6** run in exam mode: a timer, submit-for-score, then a full
  walkthrough + a follow-up question for everything you missed.

Every problem is **source-tagged** (Lab notes, §-number, or "Predicted"), and the
practice banks are **generated**, so they're endless and always correct.

---

## Project structure (edit-friendly, Cursor-friendly)

```
ma123-study/
├── framework/            # shared engine + UI (edit once, all guides update)
│   ├── engine.js         #   determinants + step/solution generators (from Lab 6)
│   ├── engine-la.js      #   exact-fraction RREF + LA generators (span, rank,
│   │                     #   eigenvalues, transformations, systems, ...)
│   ├── content-helpers.js#   tiny builders (cards, slots, T/F & MC banks, det gens)
│   ├── app.js            #   navigation, step player, visualizer, gauntlet, EXAM mode
│   └── styles.css        #   all styling
├── content/              # one file per guide — pure content (the part you edit)
│   ├── lab7.js ... lab10.js
│   ├── ch12.js ... ch7.js
│   ├── mock1.js ... mock6.js
│   └── index.js
├── build.js              # bundles framework + each content file -> dist/*.html
└── dist/                 # the ready-to-use single-file HTML guides
```

### Rebuild after editing
```
node build.js      # from ma123-study/  → regenerates everything in dist/
```

### Using Cursor to improve a guide (independent jobs)
- **Add / change problems or wording** → edit that guide's file in `content/`.
  A guide is just a `CURRICULUM` object: `meta`, `stages` (each = concept cards +
  guided problems + practice slots), optional `interleave`, `mock`, or `exam`.
- **Change difficulty / number ranges / add a new question type** → edit the
  generators in `framework/engine-la.js` (or `engine.js` for determinants).
- **Change the look** → `framework/styles.css` (colors are CSS variables at the top).
- **Change flow/rules (timer, grading, gauntlet)** → `framework/app.js`.

After any edit, run `node build.js` and open the file in `dist/`.

---

## Scope notes
- **Confirmed** from source files: Lab 7 = §5.2 (span/independence/rank); Lab 9 =
  matrix transformations; Ch 7 = eigenvalues/diagonalization.
- **Predicted** (labelled in-app): Lab 8 (basis/dimension) and Lab 10 (eigen) follow
  the course's chapter progression; the chapter reviews and mock finals emphasize the
  post-midterm core (Ch 5–7) while carrying Ch 1–4 forward, since the final is "likely
  on content after the midterm" but "may include" earlier material.
- There is a hidden `?test=1` URL flag used only for automated testing — don't add it
  while studying.
