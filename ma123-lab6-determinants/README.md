# MA123 · Lab 6 — Determinants (Guided Study App)

An interactive, visual, **by-hand** study app for tomorrow's lab. It teaches
**determinants only** — the scope set by your `MA123 Lab 6.pdf` lab notes — using
exactly two textbook sections: **“Introductory Linear Algebra”, Hu et al., §4.1
(Definition) and §4.2 (Properties of Determinants).**

Anything in §4.1/§4.2 that the lab notes don't touch (e.g. unrelated exercises) is
intentionally left out, so every minute you spend here is on-scope.

---

## How to open it

No build step, no server. Just open **`index.html`** in any modern browser
(double-click it, or drag it into Chrome/Safari/Edge). The only thing it loads
from the internet is MathJax (for the pretty math) and the fonts — everything else
runs locally.

> Want it fully offline? See **“Make it 100% offline”** below.

---

## How it teaches (the method, baked in)

This follows the way you actually learn math:

1. **Learn** — each idea appears **one card at a time**. The panel on the right is a
   live matrix that shows *exactly what's changing* (the cofactor "search & destroy",
   the 2×2 diagonals, the sign checkerboard, the before→after of each row operation).
2. **Guided** — 2–3 fully worked problems, revealed **one step per click** (Step 1 →
   *Next* → Step 2 → …) so nothing dumps on you at once. Feel ready after two? Hit
   **“I'm ready — skip to Practice.”**
3. **Practice = a locked gauntlet** — the page locks to **one question at a time**.
   You either type your answer or press **“I don't know.”** No AI, no internet, no
   calculator app — paper and brain only. Get it wrong and it **reteaches the concept,
   then hands you a brand-new variant** until you lock it in.
4. **Interleaving** — after later stages, earlier skills **pop back up** as quick
   spaced-review gauntlets. Even after you "pass" a stage, it comes back.
5. **Wrong-Answer Tracker** (bottom-right) — every miss is logged by concept so you
   know exactly what to re-drill before bed.
6. **Boss Gauntlet** — a shuffled mix of *predicted Lab 6 questions* across every
   skill: your dress rehearsal.

Every problem is **tagged with its source**: `Lab 6 Notes`, `Textbook 4.1`,
`Textbook 4.2`, or `Predicted Lab Q`.

### The five stages
| Stage | Topic | Built from |
|------|-------|-----------|
| **A** | Cofactor expansion (2×2, 3×3) | Lab 6 notes example (=120), §4.1.3/4.1.4 |
| **B** | Smart expansion: triangular + pick the lazy row | §4.1.8, §4.2.2 |
| **C** | Row/column operations (swap = −, scale = ×k, add = unchanged) | Lab notes properties, §4.2.10/4.2.11/4.2.22 |
| **D** | Determinant algebra: `det(AB)`, `det(Aᵀ)`, `det(kA)=kⁿdet(A)`, `det(A⁻¹)`, instant zeros | §4.2.18/4.2.23/4.2.25, §4.2.28 |
| **E** | Invertibility: `det≠0 ⟺ invertible` + equivalent statements | Lab notes, §4.2.15/4.2.16/4.2.17 |

---

## Project structure (so you — and Cursor — can improve it easily)

It's deliberately **split into small files** so you can upgrade one piece without
touching the rest:

```
ma123-lab6-determinants/
├── index.html          # page shell: loads MathJax, fonts, and the scripts
├── css/styles.css      # all the visual styling
└── js/
    ├── engine.js       # PURE MATH: determinant + step-by-step solution generators
    │                   #   + the random problem generators for the gauntlet
    ├── curriculum.js   # ALL CONTENT: stages, concept cards, guided problems,
    │                   #   practice pools, interleaving, boss gauntlet
    └── app.js          # UI ENGINE: navigation, step player, visualizer,
                        #   the locked gauntlet, the wrong-answer tracker
```

The big idea: **content lives in `curriculum.js`, math lives in `engine.js`, behavior
lives in `app.js`.** Because the math is generated in `engine.js`, every practice
question and every reteach solution is computed and therefore always correct.

---

## Using Cursor to improve this — broken into independent jobs

You don't have to edit one giant file. Pick a job and point Cursor at the right file:

**1. Add or change problems → edit `js/curriculum.js`**
- *“Add a fourth guided problem to Stage B using the matrix `[[…]]`.”*
- *“Change the Stage A practice to also include a 4×4 cofactor question.”*
- A guided problem is just `{ source, title, promptHtml, matrix, build }` where
  `build()` returns `{ result, steps }`. Reuse `E.steps3x3`, `E.steps2x2`,
  `E.stepsTriangular`, or write a custom `steps` array.

**2. Add a brand-new topic/stage → edit `js/curriculum.js`**
- *“Add a Stage F on Cramer's Rule with one concept card, two guided problems, and a
  practice gauntlet.”* Copy an existing stage object in the `stages` array; the
  sidebar, path, and interleaving wire up automatically.

**3. Tune the difficulty / number ranges → edit `js/engine.js`**
- *“Make `gen3x3` use entries from −6 to 6.”* or *“Make triangular practice 4×4 by
  default.”* The generators (`gen2x2`, `gen3x3`, `genTriangular`, …) are at the bottom.

**4. Add a new visualization → edit `renderViz` in `js/app.js` (+ a `viz` object in `curriculum.js`)**
- *“Add a `viz` type `parallelogram` that draws the 2×2 area interpretation.”*
  Each step's `viz` is just a config object; add a new `if (viz.type === '…')` branch.

**5. Change the look → edit `css/styles.css`**
- *“Make the font bigger,”* *“switch to a light theme,”* *“make the matrix cells larger.”*
  Colors and sizes are CSS variables at the top (`:root`).

**6. Change the flow/rules → edit `js/app.js`**
- *“Require two correct in a row to clear a slot,”* *“add a timer to the boss gauntlet,”*
  *“let me skip after the first guided problem instead of the second.”*

---

## Make it 100% offline (optional)

The app already runs locally; only MathJax + Google Fonts come from a CDN. To remove
that dependency, download MathJax's `tex-svg.js` into `js/` and point the
`<script src="…mathjax…">` tag in `index.html` at the local copy, and either bundle
the fonts or let it fall back to system fonts.

---

## Notes on integrity

The practice gauntlet is meant to be done **honestly**: no AI, no internet, no
calculator app — that's the whole point of the lock. (There is a hidden
`?test=1` URL flag used only for automated testing; don't add it when studying.)

---

*Scope: determinants only, Hu et al. §4.1 & §4.2, as dictated by the Lab 6 notes.*
