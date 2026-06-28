/* ===================================================================
   MA123 Lab 6 — Determinants  ::  APP (UI engine)
   Ties the curriculum + engine to the screen:
     • recommended path + free navigation
     • one-step-at-a-time step player
     • interactive matrix visualizations
     • the locked practice "gauntlet"
     • the wrong-answer tracker (persisted)
=================================================================== */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------- MathJax typesetting helper ----------
     MathJax v3 breaks (NaN-size SVGs) if typesetPromise calls overlap.
     We serialize every request through a single promise chain. */
  let mjQueue = Promise.resolve();
  function typeset(node) {
    if (!(window.MathJax && MathJax.typesetPromise)) return mjQueue;
    mjQueue = mjQueue
      .then(() => {
        if (node && MathJax.typesetClear) {
          try {
            MathJax.typesetClear([node]);
          } catch {}
        }
        return MathJax.typesetPromise(node ? [node] : undefined);
      })
      .catch(() => {});
    return mjQueue;
  }

  /* ---------- persistent state ---------- */
  const LS_KEY = "ma123_lab6_state_v1";
  const state = loadState();
  function loadState() {
    try {
      return (
        JSON.parse(localStorage.getItem(LS_KEY)) || {
          completed: {},
          wrongLog: [],
        }
      );
    } catch {
      return { completed: {}, wrongLog: [] };
    }
  }
  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }

  /* ---------- build the recommended path ---------- */
  const path = buildPath();
  let current = 0;

  function buildPath() {
    const nodes = [{ type: "intro", id: "intro", label: "Start here" }];
    CURRICULUM.stages.forEach((st) => {
      nodes.push({ type: "concept", id: `${st.id}-concept`, stage: st, label: `Learn` });
      nodes.push({ type: "guided", id: `${st.id}-guided`, stage: st, label: `Guided` });
      nodes.push({ type: "practice", id: `${st.id}-practice`, stage: st, label: `Practice` });
      const inter = CURRICULUM.interleave[`after${st.id}`];
      if (inter)
        nodes.push({
          type: "interleave",
          id: `${st.id}-interleave`,
          data: inter,
          label: "Review",
        });
    });
    nodes.push({ type: "mock", id: "mock", data: CURRICULUM.mock, label: "Boss" });
    nodes.push({ type: "done", id: "done", label: "Finish" });
    return nodes;
  }

  /* =================================================================
     MATRIX VISUALIZER
  ================================================================= */
  function matrixGrid(M, opts = {}) {
    const n = M.length;
    const cols = M[0].length;
    const grid = el("div", "mx");
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    M.forEach((row, r) => {
      row.forEach((val, c) => {
        const cell = el("div", "mx-cell", String(val));
        if (opts.highlight && opts.highlight.r === r && opts.highlight.c === c)
          cell.classList.add("hl");
        if (opts.dimRow === r) cell.classList.add("dim");
        if (opts.dimCol === c) cell.classList.add("dim");
        if (opts.diag && r === c) cell.classList.add("diag");
        if (opts.greenDiag && r === c) cell.classList.add("green");
        if (opts.redAnti && r + c === n - 1) cell.classList.add("red");
        if (opts.changedRows && opts.changedRows.includes(r))
          cell.classList.add("changed");
        grid.appendChild(cell);
      });
    });
    return grid;
  }

  function renderViz(container, viz) {
    container.innerHTML = "";
    if (!viz || viz.type === "none") {
      container.appendChild(el("div", "viz-empty", "🧮"));
      return;
    }
    const wrap = el("div", "viz-wrap fade");

    if (viz.type === "two") {
      const opts = {};
      if (viz.phase === "diagonals") {
        opts.greenDiag = true;
        opts.redAnti = true;
      }
      wrap.appendChild(matrixGrid(viz.M, opts));
      if (viz.phase === "diagonals") {
        const legend = el(
          "div",
          "viz-legend",
          `<span class="chip green">+ad (down →)</span><span class="chip red">− bc (up ↗)</span>`
        );
        wrap.appendChild(legend);
      }
      if (viz.phase === "result")
        wrap.appendChild(el("div", "viz-result", `det = ${viz.result}`));
    } else if (viz.type === "cofactor") {
      const opts = {};
      if (viz.phase === "term") {
        opts.highlight = { r: viz.row, c: viz.col };
        opts.dimRow = viz.row;
        opts.dimCol = viz.col;
      }
      wrap.appendChild(matrixGrid(viz.M, opts));
      if (viz.phase === "term") {
        const arrow = el("div", "viz-arrow", "↓ delete its row &amp; column");
        wrap.appendChild(arrow);
        const minorWrap = el("div", "viz-minor-wrap");
        const sign = el(
          "span",
          `sign-badge ${viz.sign === 1 ? "pos" : "neg"}`,
          viz.sign === 1 ? "+" : "−"
        );
        minorWrap.appendChild(sign);
        minorWrap.appendChild(matrixGrid(viz.minor, {}));
        wrap.appendChild(minorWrap);
      }
      if (viz.phase === "result")
        wrap.appendChild(el("div", "viz-result", `det(A) = ${viz.result}`));
    } else if (viz.type === "diagonal") {
      wrap.appendChild(matrixGrid(viz.M, { diag: true }));
      if (viz.phase === "result")
        wrap.appendChild(el("div", "viz-result", `det = ${viz.result}`));
      else
        wrap.appendChild(
          el("div", "viz-legend", `<span class="chip diag-chip">multiply the diagonal</span>`)
        );
    } else if (viz.type === "signgrid") {
      const n = viz.n || 3;
      const grid = el("div", "mx sign-grid");
      grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++) {
          const s = (r + c) % 2 === 0 ? "+" : "−";
          const cell = el("div", `mx-cell sign ${s === "+" ? "pos" : "neg"}`, s);
          grid.appendChild(cell);
        }
      wrap.appendChild(grid);
      wrap.appendChild(
        el("div", "viz-legend", `<span class="chip">corners + center are +, edges are −</span>`)
      );
    } else if (viz.type === "rowop") {
      const row = el("div", "rowop");
      row.appendChild(matrixGrid(viz.before, {}));
      const mid = el("div", "rowop-mid");
      mid.appendChild(el("div", "rowop-op", `\\(${viz.op}\\)`));
      mid.appendChild(el("div", "rowop-arrow", "⟶"));
      const eff =
        viz.effect === "no change"
          ? "effect-ok"
          : viz.effect.includes("−1")
          ? "effect-flip"
          : "effect-scale";
      mid.appendChild(el("div", `rowop-effect ${eff}`, `det ${viz.effect}`));
      row.appendChild(mid);
      row.appendChild(matrixGrid(viz.after, {}));
      wrap.appendChild(row);
    } else if (viz.type === "matrixOnly") {
      wrap.appendChild(matrixGrid(viz.M, {}));
      if (viz.note) wrap.appendChild(el("div", "viz-legend", `<span class="chip">${viz.note}</span>`));
    }

    container.appendChild(wrap);
    typeset(container);
  }

  /* =================================================================
     STEP PLAYER  (one step at a time, Next/Back)
  ================================================================= */
  function stepPlayer(mountText, mountViz, steps, opts = {}) {
    let i = 0;
    const total = steps.length;

    const dots = el("div", "step-dots");
    for (let k = 0; k < total; k++) dots.appendChild(el("span", "dot"));

    const titleEl = el("div", "step-title");
    const bodyEl = el("div", "step-body");
    const nav = el("div", "step-nav");
    const back = el("button", "btn ghost", "‹ Back");
    const next = el("button", "btn primary", "Next step ›");
    const counter = el("span", "step-counter");
    nav.append(back, counter, next);

    mountText.innerHTML = "";
    mountText.append(dots, titleEl, bodyEl, nav);

    function render() {
      const s = steps[i];
      titleEl.textContent = `Step ${i + 1}. ${s.title}`;
      bodyEl.className = "step-body fade";
      bodyEl.innerHTML = s.html;
      // restart fade animation
      void bodyEl.offsetWidth;
      typeset(bodyEl);
      renderViz(mountViz, s.viz);
      counter.textContent = `${i + 1} / ${total}`;
      back.disabled = i === 0;
      [...dots.children].forEach((d, k) =>
        d.classList.toggle("on", k <= i)
      );
      next.textContent = i === total - 1 ? "Done ✓" : "Next step ›";
    }

    back.onclick = () => {
      if (i > 0) {
        i--;
        render();
      }
    };
    next.onclick = () => {
      if (i < total - 1) {
        i++;
        render();
      } else if (opts.onDone) {
        opts.onDone();
      }
    };
    render();
  }

  /* =================================================================
     NODE RENDERERS
  ================================================================= */
  const main = () => $("#main");

  function sourceTag(src) {
    const cls = src && src.includes("Lab 6") ? "tag-lab" : src && src.includes("Predicted") ? "tag-pred" : "tag-book";
    return `<span class="src-tag ${cls}">${src}</span>`;
  }

  function go(idx) {
    current = Math.max(0, Math.min(path.length - 1, idx));
    renderSidebar();
    renderNode(path[current]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markComplete(id) {
    state.completed[id] = true;
    saveState();
    renderSidebar();
  }

  function nextButton(label = "Continue ›") {
    const b = el("button", "btn primary big", label);
    b.onclick = () => go(current + 1);
    return b;
  }

  function renderNode(node) {
    const m = main();
    m.innerHTML = "";
    if (node.type === "intro") return renderIntro(m);
    if (node.type === "concept") return renderConcept(m, node);
    if (node.type === "guided") return renderGuided(m, node);
    if (node.type === "practice") return renderPractice(m, node, node.stage.practice, `Stage ${node.stage.id} · Practice`);
    if (node.type === "interleave") return renderInterleave(m, node);
    if (node.type === "mock") return renderMock(m, node);
    if (node.type === "done") return renderDone(m);
  }

  /* ----- intro ----- */
  function renderIntro(m) {
    const meta = CURRICULUM.meta;
    const card = el("div", "card hero");
    card.innerHTML = `
      <div class="kicker">${meta.course}</div>
      <h1>${meta.lab}</h1>
      <p class="lede">A guided, visual, by-hand workout for tomorrow's lab — built only from
        <b>${meta.book}</b>, scoped by your Lab 6 notes (<b>determinants</b>).</p>
      <div class="meta-row">
        <div class="meta-pill">⏱ Full run ≈ ${meta.estTotalMin} min</div>
        <div class="meta-pill">✅ Day-minimum at ≈ ${meta.dayMinMin} min (through Stage C)</div>
        <div class="meta-pill">🧠 ${CURRICULUM.stages.length} stages · spaced review · boss gauntlet</div>
      </div>
      <div class="how">
        <h3>How this works</h3>
        <ul>
          <li><b>Learn</b> each idea one card at a time — the matrix on the right shows exactly what changes.</li>
          <li><b>Guided</b>: 2–3 fully worked problems, revealed one step per click. Feel ready? Skip straight to practice.</li>
          <li><b>Practice = a locked gauntlet.</b> No AI, no internet, no calculator app. Type your answer or hit “I don't know.” Miss it and I reteach, then hand you a fresh one until it's locked.</li>
          <li><b>Interleaving</b>: after later stages, earlier skills pop back up so they actually stick.</li>
          <li>Everything you get wrong lands in the <b>Wrong-Answer Tracker</b> (bottom-right).</li>
        </ul>
      </div>
      <div class="recommend">
        <b>Recommended path:</b> just keep clicking <i>Continue</i>. Or jump anywhere from the map on the left.
      </div>
    `;
    m.appendChild(card);
    const cta = nextButton("Start Stage A ›");
    m.appendChild(cta);
    typeset(m);
  }

  /* ----- concept ----- */
  function renderConcept(m, node) {
    const st = node.stage;
    const head = el("div", "node-head");
    head.innerHTML = `<div class="kicker">Stage ${st.id} · Learn</div>
      <h2>${st.concept.title}</h2>
      <p class="tagline">${st.tagline}</p>`;
    m.appendChild(head);

    const stagewrap = el("div", "stage-grid");
    const left = el("div", "panel text-panel");
    const right = el("div", "panel viz-panel");
    stagewrap.append(left, right);
    m.appendChild(stagewrap);

    const steps = st.concept.cards.map((c, i) => ({
      title: i === 0 ? "Core idea" : `Build on it`,
      html: c.html,
      viz: c.viz || { type: "none" },
    }));

    stepPlayer(left, right, steps, {
      onDone: () => {
        markComplete(node.id);
        const foot = el("div", "node-foot");
        foot.appendChild(
          el("div", "ok-note", "Concept covered. Now lock it in with the guided problems.")
        );
        foot.appendChild(nextButton("Go to guided problems ›"));
        m.appendChild(foot);
        typeset(foot);
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      },
    });
  }

  /* ----- guided ----- */
  function renderGuided(m, node) {
    const st = node.stage;
    const head = el("div", "node-head");
    head.innerHTML = `<div class="kicker">Stage ${st.id} · Guided</div>
      <h2>Worked problems — one step at a time</h2>
      <p class="tagline">${st.guided.intro}</p>`;
    m.appendChild(head);

    let gi = 0;
    const probs = st.guided.problems;

    const stagewrap = el("div", "stage-grid");
    const left = el("div", "panel text-panel");
    const right = el("div", "panel viz-panel");
    stagewrap.append(left, right);
    m.appendChild(stagewrap);

    const controls = el("div", "guided-controls");
    m.appendChild(controls);

    function loadProblem(idx) {
      gi = idx;
      const p = probs[idx];
      const built = p.build();
      // prepend a framing step that shows the problem
      const framing = {
        title: p.title,
        html: `${sourceTag(p.source)}<p class="prob-intro">${p.promptHtml}</p>`,
        viz: p.matrix ? { type: "matrixOnly", M: p.matrix, note: "" } : { type: "none" },
      };
      const steps = [framing, ...built.steps];
      stepPlayer(left, right, steps, {
        onDone: () => buildControls(true),
      });
      buildControls(false);
    }

    function buildControls(done) {
      controls.innerHTML = "";
      const dotline = el("div", "guided-progress");
      probs.forEach((p, k) => {
        const d = el("button", "gdot" + (k === gi ? " on" : "") + (k < gi ? " seen" : ""), String(k + 1));
        d.onclick = () => loadProblem(k);
        dotline.appendChild(d);
      });
      controls.appendChild(dotline);

      const row = el("div", "guided-btnrow");
      if (gi < probs.length - 1) {
        const nextProb = el("button", "btn primary", `Next worked problem (${gi + 2}/${probs.length}) ›`);
        nextProb.onclick = () => loadProblem(gi + 1);
        row.appendChild(nextProb);
      }
      // optional skip after 2 guided problems
      if (gi >= 1) {
        const skip = el("button", "btn accent", "I'm ready — skip to Practice ⏭");
        skip.onclick = () => {
          markComplete(node.id);
          go(current + 1);
        };
        row.appendChild(skip);
      }
      if (gi === probs.length - 1) {
        const toPractice = el("button", "btn primary big", "Start the Practice gauntlet ›");
        toPractice.onclick = () => {
          markComplete(node.id);
          go(current + 1);
        };
        row.appendChild(toPractice);
      }
      controls.appendChild(row);
    }

    loadProblem(0);
  }

  /* ----- practice (gauntlet) ----- */
  function renderPractice(m, node, practice, headline) {
    const head = el("div", "node-head");
    head.innerHTML = `<div class="kicker">${headline}</div>
      <h2>Practice gauntlet</h2>
      <p class="tagline">${practice.intro}</p>`;
    m.appendChild(head);

    const card = el("div", "card gate");
    card.innerHTML = `
      <div class="gate-icon">🔒</div>
      <h3>${practice.slots.length}-question gauntlet</h3>
      <p>Once you start, the page locks to one question at a time. Answer it (or press
        <b>I don't know</b>) to move on. Wrong answers get retaught and replaced with a
        fresh variant until you clear them.</p>
      <p class="warn">✋ No AI. No internet. No calculator app. Paper and brain only.</p>
    `;
    const startBtn = el("button", "btn primary big", "Begin gauntlet ▶");
    startBtn.onclick = () =>
      runGauntlet(practice.slots, headline, () => {
        markComplete(node.id);
        card.innerHTML = `<div class="gate-icon">✅</div><h3>Gauntlet cleared!</h3>
          <p>Every question answered correctly. Keep the momentum.</p>`;
        card.appendChild(nextButton());
        typeset(card);
      });
    card.appendChild(startBtn);
    m.appendChild(card);
    typeset(m);
  }

  /* ----- interleave ----- */
  function renderInterleave(m, node) {
    const d = node.data;
    const head = el("div", "node-head");
    head.innerHTML = `<div class="kicker">Spaced Review</div>
      <h2>${d.title}</h2>
      <p class="tagline">${d.blurb}</p>`;
    m.appendChild(head);
    const card = el("div", "card gate review");
    card.innerHTML = `<div class="gate-icon">🔁</div><h3>${d.slots.length} quick recall questions</h3>
      <p>Same locked rules. This is interleaving — proving old skills still fire when mixed in.</p>`;
    const b = el("button", "btn primary big", "Begin review ▶");
    b.onclick = () =>
      runGauntlet(d.slots, d.title, () => {
        markComplete(node.id);
        card.innerHTML = `<div class="gate-icon">✅</div><h3>Review cleared!</h3>`;
        card.appendChild(nextButton());
        typeset(card);
      });
    card.appendChild(b);
    m.appendChild(card);
    typeset(m);
  }

  /* ----- mock ----- */
  function renderMock(m, node) {
    const d = node.data;
    const head = el("div", "node-head");
    head.innerHTML = `<div class="kicker">Final</div><h2>${d.title}</h2>
      <p class="tagline">${d.blurb}</p>`;
    m.appendChild(head);
    const card = el("div", "card gate boss");
    card.innerHTML = `<div class="gate-icon">🏆</div><h3>${d.slots.length}-question boss gauntlet</h3>
      <p class="warn">✋ No AI. No internet. No calculator app. This is the dress rehearsal.</p>`;
    const b = el("button", "btn primary big", "Enter the boss gauntlet ▶");
    b.onclick = () =>
      runGauntlet(d.slots, d.title, () => {
        markComplete(node.id);
        card.innerHTML = `<div class="gate-icon">🎉</div><h3>Boss cleared — you're ready for the lab.</h3>`;
        card.appendChild(nextButton("See summary ›"));
        typeset(card);
      });
    card.appendChild(b);
    m.appendChild(card);
    typeset(m);
  }

  /* ----- done ----- */
  function renderDone(m) {
    const wrongCount = state.wrongLog.length;
    const card = el("div", "card hero");
    card.innerHTML = `<div class="kicker">Lab 6 · Determinants</div>
      <h1>You made it 🎓</h1>
      <p class="lede">You've covered cofactor expansion, triangular shortcuts, row operations,
        determinant algebra, and invertibility — all by hand.</p>
      <div class="meta-row">
        <div class="meta-pill">Stages cleared: ${CURRICULUM.stages.length}/${CURRICULUM.stages.length}</div>
        <div class="meta-pill">Logged misses: ${wrongCount}</div>
      </div>
      <p>Best last move before bed: open the <b>Wrong-Answer Tracker</b> and re-run any
        concept that shows up there. Then sleep — recall beats cramming.</p>`;
    m.appendChild(card);
    const row = el("div", "guided-btnrow");
    const restart = el("button", "btn ghost", "↺ Restart from the top");
    restart.onclick = () => go(0);
    const replayWrong = el("button", "btn accent", "Re-drill my missed concepts ▶");
    replayWrong.onclick = () => drillWrong();
    row.append(replayWrong, restart);
    m.appendChild(row);
    typeset(m);
  }

  /* =================================================================
     THE GAUNTLET  (locked modal, one question at a time)
  ================================================================= */
  function runGauntlet(slots, contextLabel, onAllDone) {
    const overlay = el("div", "overlay");
    document.body.appendChild(overlay);
    document.body.classList.add("locked");

    let slotIndex = 0;
    let cleared = 0;
    const totalSlots = slots.length;

    function nextSlot() {
      if (slotIndex >= totalSlots) {
        // finished
        overlay.remove();
        document.body.classList.remove("locked");
        onAllDone();
        return;
      }
      showProblem(slots[slotIndex]);
    }

    function showProblem(slot) {
      const prob = slot.generate();
      overlay.innerHTML = "";
      const modal = el("div", "modal fade");

      const top = el("div", "modal-top");
      top.innerHTML = `<div class="modal-context">${contextLabel}</div>
        <div class="modal-progress">Question ${slotIndex + 1} / ${totalSlots} · cleared ${cleared}</div>`;
      modal.appendChild(top);

      const lockNote = el("div", "lock-note", "🔒 Locked — no AI, no internet. Answer to continue.");
      modal.appendChild(lockNote);

      const qcard = el("div", "qcard");
      qcard.innerHTML = `${slot.source ? sourceTag(slot.source) : prob.source ? sourceTag(prob.source) : ""}
        <div class="qprompt">${prob.promptHtml || "Compute the determinant:"}</div>`;
      if (prob.matrix) {
        const mwrap = el("div", "qmatrix");
        mwrap.innerHTML = `\\[${Engine.latexMatrix(prob.matrix, "v")}\\]`;
        qcard.appendChild(mwrap);
      }
      modal.appendChild(qcard);

      const answerZone = el("div", "answer-zone");
      modal.appendChild(answerZone);

      const feedback = el("div", "feedback");
      modal.appendChild(feedback);

      overlay.appendChild(modal);
      typeset(modal);

      // test-only probe (active only with ?test=1 in the URL) so automated
      // tests can verify the correct-answer path. Never set during normal use.
      if (/[?&]test=1/.test(location.search)) window.__currentProb = prob;

      // build inputs per type
      if (prob.type === "tf") {
        const row = el("div", "tf-row");
        const tBtn = el("button", "btn choice", "TRUE");
        const fBtn = el("button", "btn choice", "FALSE");
        tBtn.onclick = () => judge(true === prob.answer, prob, feedback, answerZone, slot, true);
        fBtn.onclick = () => judge(false === prob.answer, prob, feedback, answerZone, slot, false);
        row.append(tBtn, fBtn);
        answerZone.appendChild(row);
        answerZone.appendChild(idkButton(prob, feedback, answerZone, slot));
      } else if (prob.type === "mc") {
        const list = el("div", "mc-list");
        prob.choices.forEach((ch, k) => {
          const b = el("button", "btn choice mc", ch.html);
          b.onclick = () => judge(k === prob.answer, prob, feedback, answerZone, slot, k);
          list.appendChild(b);
        });
        answerZone.appendChild(list);
        answerZone.appendChild(idkButton(prob, feedback, answerZone, slot));
        typeset(answerZone);
      } else {
        // numeric
        const row = el("div", "num-row");
        const input = el("input", "num-input");
        input.type = "text";
        input.setAttribute("inputmode", "text");
        input.placeholder = "your answer (e.g. -6 or 1/2)";
        const submit = el("button", "btn primary", "Submit");
        const tryJudge = () => {
          const v = parseNumeric(input.value);
          if (Number.isNaN(v)) {
            feedback.className = "feedback warn-fb show";
            feedback.textContent = "Type a number (integer, decimal, or a/b fraction).";
            return;
          }
          judge(approx(v, prob.answer), prob, feedback, answerZone, slot, input.value);
        };
        submit.onclick = tryJudge;
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") tryJudge();
        });
        row.append(input, submit);
        answerZone.appendChild(row);
        answerZone.appendChild(idkButton(prob, feedback, answerZone, slot));
        setTimeout(() => input.focus(), 50);
      }
    }

    function idkButton(prob, feedback, answerZone, slot) {
      const b = el("button", "btn idk", "I don't know");
      b.onclick = () => judge(false, prob, feedback, answerZone, slot, "IDK", true);
      return b;
    }

    function judge(correct, prob, feedback, answerZone, slot, picked, isIDK) {
      // disable inputs
      answerZone.querySelectorAll("button, input").forEach((n) => (n.disabled = true));
      if (correct) {
        feedback.className = "feedback ok-fb show";
        feedback.innerHTML = `✅ Correct.`;
        // if MC/correct, optionally show why
        const cont = el("button", "btn primary big", slotIndex + 1 >= totalSlots ? "Finish ✓" : "Next question ›");
        cont.onclick = () => {
          cleared++;
          slotIndex++;
          nextSlot();
        };
        feedback.appendChild(el("div", "spacer"));
        feedback.appendChild(cont);
      } else {
        // log the miss
        logWrong(prob, contextLabel);
        feedback.className = "feedback bad-fb show";
        feedback.innerHTML = isIDK
          ? `🟡 No problem — let's learn it. Here's the full reasoning:`
          : `❌ Not quite. Here's exactly how it works:`;
        const reteach = el("div", "reteach");
        renderReteach(reteach, prob);
        feedback.appendChild(reteach);

        const again = el("button", "btn primary big", "Got it — give me a fresh one ↻");
        again.onclick = () => showProblem(slot); // brand new variant, same slot
        feedback.appendChild(el("div", "spacer"));
        feedback.appendChild(again);
        typeset(feedback);
      }
    }

    nextSlot();
  }

  function renderReteach(container, prob) {
    if (prob.solution && prob.solution.steps) {
      // mini step player inside the reteach
      const wrap = el("div", "reteach-grid");
      const txt = el("div", "reteach-text");
      const viz = el("div", "reteach-viz");
      wrap.append(txt, viz);
      container.appendChild(wrap);
      stepPlayer(txt, viz, prob.solution.steps, {});
    } else if (prob.reteachHtml) {
      container.innerHTML = `<div class="reteach-plain">${prob.reteachHtml}</div>`;
      typeset(container);
    } else if (prob.type === "mc" && prob.choices) {
      const correct = prob.choices[prob.answer];
      container.innerHTML = `<div class="reteach-plain">Correct choice: <b>${correct.html}</b>${
        correct.why ? `<br>${correct.why}` : ""
      }</div>`;
      typeset(container);
    } else {
      container.innerHTML = `<div class="reteach-plain">The correct answer is <b>${prob.answer}</b>.</div>`;
    }
  }

  /* ---------- wrong-answer tracker ---------- */
  function logWrong(prob, context) {
    const label =
      prob.type === "tf"
        ? "True/False trap"
        : prob.type === "mc"
        ? "Concept choice"
        : prob.matrix
        ? "Determinant computation"
        : "Determinant property";
    state.wrongLog.unshift({
      label,
      source: prob.source || "—",
      context,
      when: Date.now(),
    });
    if (state.wrongLog.length > 60) state.wrongLog.pop();
    saveState();
    renderTracker();
  }

  function renderTracker() {
    const panel = $("#tracker-body");
    if (!panel) return;
    const log = state.wrongLog;
    $("#tracker-count").textContent = log.length;
    if (!log.length) {
      panel.innerHTML = `<div class="tracker-empty">No misses yet. 🎯<br><span>Anything you miss in a gauntlet lands here so you can re-drill it.</span></div>`;
      return;
    }
    // group by label+context
    const groups = {};
    log.forEach((w) => {
      const key = `${w.label} · ${w.context}`;
      groups[key] = (groups[key] || 0) + 1;
    });
    panel.innerHTML = Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([k, n]) =>
          `<div class="tracker-row"><span class="tracker-label">${k}</span><span class="tracker-n">×${n}</span></div>`
      )
      .join("");
  }

  function drillWrong() {
    // build a quick gauntlet from concepts seen wrong (best-effort mapping)
    const slots = [
      { label: "recall", generate: () => numericFromEngine() },
      { label: "recall", generate: () => CURRICULUM_propRandom() },
      { label: "recall", generate: () => genInvertTF() },
    ];
    runGauntlet(slots, "Re-drill · your misses", () => go(path.length - 1));
  }
  function numericFromEngine() {
    const g = Engine.gen3x3();
    return {
      type: "numeric",
      source: "Re-drill",
      promptHtml: "Compute the determinant:",
      matrix: g.M,
      answer: g.answer,
      solution: { steps: Engine.steps3x3(g.M).steps },
    };
  }
  function CURRICULUM_propRandom() {
    return propProblem(Engine.genScalarMultiple());
  }

  /* ---------- numeric parsing ---------- */
  function parseNumeric(str) {
    if (str == null) return NaN;
    const s = String(str).trim().replace(/\s+/g, "");
    if (s === "") return NaN;
    if (/^[-+]?\d+\/[-+]?\d+$/.test(s)) {
      const [a, b] = s.split("/").map(Number);
      if (b === 0) return NaN;
      return a / b;
    }
    const v = Number(s);
    return Number.isFinite(v) ? v : NaN;
  }
  const approx = (a, b) => Math.abs(a - b) < 1e-6;

  /* =================================================================
     SIDEBAR (stage map + free navigation)
  ================================================================= */
  function renderSidebar() {
    const sb = $("#stage-map");
    sb.innerHTML = "";
    path.forEach((node, idx) => {
      if (node.type === "done") return;
      const item = el("button", "map-item");
      if (idx === current) item.classList.add("active");
      if (state.completed[node.id]) item.classList.add("complete");

      let icon = "•";
      let title = node.label;
      let sub = "";
      if (node.type === "intro") {
        icon = "🚀";
        title = "Welcome";
      } else if (node.type === "concept") {
        icon = node.stage.id;
        title = node.stage.name;
        sub = "Learn";
        item.classList.add("stage-start");
      } else if (node.type === "guided") {
        icon = "✎";
        sub = "Guided";
        title = `${node.stage.name}`;
      } else if (node.type === "practice") {
        icon = "🎯";
        sub = "Practice";
        title = `${node.stage.name}`;
      } else if (node.type === "interleave") {
        icon = "🔁";
        title = "Spaced review";
      } else if (node.type === "mock") {
        icon = "🏆";
        title = "Boss gauntlet";
      }
      item.innerHTML = `<span class="map-icon">${icon}</span>
        <span class="map-text"><span class="map-title">${title}</span>${
          sub ? `<span class="map-sub">${sub}</span>` : ""
        }</span>${state.completed[node.id] ? '<span class="map-check">✓</span>' : ""}`;
      item.onclick = () => go(idx);
      sb.appendChild(item);
    });
  }

  /* =================================================================
     INIT
  ================================================================= */
  function init() {
    renderSidebar();
    renderTracker();
    renderNode(path[current]);

    // tracker toggle
    $("#tracker-toggle").onclick = () =>
      $("#tracker").classList.toggle("open");
    $("#tracker-clear").onclick = () => {
      state.wrongLog = [];
      saveState();
      renderTracker();
    };
    // reset progress
    $("#reset-progress").onclick = () => {
      if (confirm("Reset all progress and the wrong-answer tracker?")) {
        state.completed = {};
        state.wrongLog = [];
        saveState();
        go(0);
        renderTracker();
      }
    };
  }

  // expose a couple helpers used by curriculum-generated reteach (none needed globally now)
  window.__MA123 = { go };

  document.addEventListener("DOMContentLoaded", init);
})();
