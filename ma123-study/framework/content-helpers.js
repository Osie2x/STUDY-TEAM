/* ===================================================================
   Content helpers — small builders shared by every study module.
   Included in every bundle so content files stay short and readable.
=================================================================== */
const H = (() => {
  const E = Engine;
  // concept card
  const card = (html, viz) => ({ html, viz: viz || { type: "none" } });
  // guided problem
  const gp = (source, title, promptHtml, matrix, build) => ({ source, title, promptHtml, matrix, build });
  // a practice slot
  const slot = (label, source, generate) => ({ label, source, generate });

  // True/False bank -> generator that serves a random one
  const tfBank = (source, list) => () => {
    const q = list[Math.floor(Math.random() * list.length)];
    return { type: "tf", source, promptHtml: q.s, answer: q.a, reteachHtml: q.why };
  };
  // Multiple-choice bank
  const mcBank = (source, list) => () => {
    const q = list[Math.floor(Math.random() * list.length)];
    // shuffle choices, track correct
    const idxs = q.choices.map((_, i) => i).sort(() => Math.random() - 0.5);
    const choices = idxs.map((i) => q.choices[i]);
    const answer = choices.findIndex((c) => c.correct);
    return { type: "mc", source, promptHtml: q.prompt, choices, answer, reteachHtml: q.why };
  };
  // fixed numeric bank (curated problems with worked steps)
  const numBank = (source, list) => () => {
    const q = list[Math.floor(Math.random() * list.length)];
    return { type: "numeric", source, promptHtml: q.prompt, matrix: q.matrix || null, answer: q.answer, solution: q.solution, reteachHtml: q.why };
  };
  // step helpers
  const step = (title, html, viz) => ({ title, html, viz: viz || { type: "none" } });
  const tex = E.texBlock;
  const M = (m, kind) => E.latexMatrix(m, kind || "b");

  // reusable determinant practice problems (with worked solutions)
  const det3 = () => { const g = E.gen3x3(); return { type: "numeric", source: "§4 Determinants", promptHtml: "Compute the determinant:", matrix: g.M, answer: g.answer, solution: { steps: E.steps3x3(g.M).steps } }; };
  const det2 = () => { const g = E.gen2x2(); return { type: "numeric", source: "§4 Determinants", promptHtml: "Compute the determinant:", matrix: g.M, answer: g.answer, solution: { steps: E.steps2x2(g.M).steps } }; };
  const detTri = () => { const g = E.genTriangular(4); return { type: "numeric", source: "§4 Determinants", promptHtml: "Compute the determinant (triangular):", matrix: g.M, answer: g.answer, solution: { steps: E.stepsTriangular(g.M).steps } }; };

  return { card, gp, slot, tfBank, mcBank, numBank, step, tex, M, E, det3, det2, detTri };
})();
