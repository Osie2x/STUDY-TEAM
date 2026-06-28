# MA123 Lab 6 — Determinants Study Guide

Interactive offline study app for **Lab 6** (Sections 4.1 & 4.2, Hu et al.).

## Open it

1. Open `ma123-lab6/index.html` in Chrome, Firefox, or Safari.
2. No install or server required — progress saves in your browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Hub — recommended path, stage picker, wrong-answer log |
| `learn.html` | Concept visuals + guided problems (one step per click) |
| `practice.html` | Practice stages + Final Gauntlet (lockdown mode) |
| `assets/problems.js` | All problems, sources, and stages (edit here to add more) |
| `assets/styles.css` | Visual design |
| `assets/app.js` | Progress tracking & answer checking |
| `assets/matrix-viz.js` | Matrix animations |
| `assets/learn.js` | Guided page logic |
| `assets/practice.js` | Practice & gauntlet logic |

## Recommended study order

1. Hub → **Stage 0 Guided** (learn.html)
2. **Stage A Practice**
3. **Stage B Guided** (optional skip after 2 problems)
4. **Stage C–E Practice** (interleaved review built in)
5. **Final Gauntlet**
6. **Predicted Lab Questions**

**Day Minimum:** finish Stage A (~45 min).

## Sources used

- Lab Notes S26 (`MA123 Lab 6.pdf`)
- Pre-Lab 6 MATLAB Grader
- Textbook §4.1 & §4.2 (Hu et al.)
- Lab 6 Prep Guide (invertibility / MATLAB connections)

## Improving with Cursor

To add problems: edit `assets/problems.js` → add to `problems` object and reference in a `stages` entry.

To change visuals: edit `assets/matrix-viz.js`.

To adjust styling: edit `assets/styles.css`.
