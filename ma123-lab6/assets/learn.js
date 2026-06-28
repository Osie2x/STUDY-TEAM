/* Learn page — concepts + guided step-by-step */
(function () {
  const params = new URLSearchParams(location.search);
  const stageId = params.get('stage') || 'guided-1';
  const stage = Lab6Problems.stages.find((s) => s.id === stageId) || Lab6Problems.stages[0];

  let conceptIndex = 0;
  let problemIndex = 0;
  let stepIndex = 0;
  let mode = params.get('mode') === 'problems' ? 'problems' : 'concepts';

  const els = {
    sidebar: document.getElementById('sidebar-nav'),
    main: document.getElementById('main-content'),
    title: document.getElementById('page-title'),
    tracker: document.getElementById('tracker-text')
  };

  function updateTracker() {
    const st = Lab6Store.getStats();
    els.tracker.textContent = `Stage: ${stage.name} | Correct: ${st.correct}/${st.total} | Wrong log: ${st.wrong}`;
  }

  function buildSidebar() {
    const items = [
      { id: 'concepts', label: 'Concept visuals' },
      ...stage.problems.map((pid, i) => ({ id: `p-${i}`, label: getProblem(pid).source.split('—')[0].trim() }))
    ];
    els.sidebar.innerHTML = '<ul class="nav-list">' + items.map((it, i) => {
      const active = (mode === 'concepts' && it.id === 'concepts') || (mode === 'problems' && it.id === `p-${problemIndex}`);
      return `<li><a href="#" class="nav-link ${active ? 'active' : ''}" data-jump="${it.id}">${it.label}</a></li>`;
    }).join('') + '</ul>';

    els.sidebar.querySelectorAll('[data-jump]').forEach((a) => {
      a.onclick = (e) => {
        e.preventDefault();
        const j = a.dataset.jump;
        if (j === 'concepts') { mode = 'concepts'; renderConcepts(); }
        else { mode = 'problems'; problemIndex = parseInt(j.split('-')[1], 10); stepIndex = 0; renderProblem(); }
        buildSidebar();
      };
    });
  }

  function renderConcepts() {
    els.title.textContent = 'Concept Visuals — Read, then say aloud';
    const concepts = Lab6Problems.concepts;
    const c = concepts[conceptIndex];

    els.main.innerHTML = `
      <div class="card fade-in">
        <p class="step-counter">Concept ${conceptIndex + 1} / ${concepts.length}</p>
        <h2>${c.title}</h2>
        <p class="concept-plain">${c.plain}</p>
        <div class="viz-box" id="concept-viz"></div>
        <div class="connection-line">🔗 ${c.connection}</div>
        <div id="formula-block" class="hidden">
          <p><strong>In notation:</strong></p>
          <div class="step-math">\\(${c.formula}\\)</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-secondary" id="btn-show-formula">Show formula</button>
          <button class="btn btn-primary" id="btn-next-concept">${conceptIndex < concepts.length - 1 ? 'Next concept' : 'Start guided problems →'}</button>
        </div>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-top:1rem">👁 Read 2× → look away → say aloud → write the formula on paper.</p>
      </div>`;

    MatrixViz.render(document.getElementById('concept-viz'), c.viz);
    Lab6Util.renderMath(els.main);

    document.getElementById('btn-show-formula').onclick = () => {
      document.getElementById('formula-block').classList.remove('hidden');
      Lab6Util.renderMath(els.main);
    };

    document.getElementById('btn-next-concept').onclick = () => {
      if (conceptIndex < concepts.length - 1) {
        conceptIndex++;
        renderConcepts();
        buildSidebar();
      } else {
        mode = 'problems';
        problemIndex = 0;
        stepIndex = 0;
        renderProblem();
        buildSidebar();
      }
    };
    updateTracker();
  }

  function renderProblem() {
    const pid = stage.problems[problemIndex];
    const prob = getProblem(pid);
    els.title.textContent = stage.name;

    const steps = prob.steps || [];
    const step = steps[stepIndex];
    const isLast = stepIndex >= steps.length - 1;
    const isFinalProblem = problemIndex >= stage.problems.length - 1;

    let skipHtml = '';
    if (stage.optional && problemIndex === 1) {
      skipHtml = `<div class="optional-skip">
        <strong>Optional:</strong> ${stage.skipLabel || 'Skip remaining guided problems'}
        <div class="btn-row"><button class="btn btn-secondary" id="btn-skip-guided">Skip to practice →</button></div>
      </div>`;
    }

    els.main.innerHTML = `
      ${skipHtml}
      <div class="card fade-in">
        <p class="problem-source">📚 ${prob.source}</p>
        <div class="problem-prompt">\\(${prob.prompt}\\)</div>
        <div class="viz-box" id="problem-viz"></div>
        <div class="step-panel">
          <p class="step-counter">Step ${stepIndex + 1} of ${steps.length}</p>
          <p class="step-label">${step.label}</p>
          <div class="step-math">\\[${step.math}\\]</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-secondary" id="btn-prev-step" ${stepIndex === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn btn-primary" id="btn-next-step">${isLast ? (isFinalProblem ? 'Finish stage ✓' : 'Next problem →') : 'Next step →'}</button>
        </div>
        ${isLast ? `<p style="color:var(--success);margin-top:0.75rem">Final answer: <strong>${prob.answer}</strong></p>` : ''}
      </div>`;

    MatrixViz.render(document.getElementById('problem-viz'), prob.viz || { type: 'cofactor', matrix: prob.matrix, row: 0 });
    Lab6Util.renderMath(els.main);

    document.getElementById('btn-prev-step').onclick = () => {
      if (stepIndex > 0) { stepIndex--; renderProblem(); }
    };

    document.getElementById('btn-next-step').onclick = () => {
      if (!isLast) {
        stepIndex++;
        renderProblem();
      } else {
        Lab6Store.markProblem(prob.id, true);
        if (!isFinalProblem) {
          problemIndex++;
          stepIndex = 0;
          renderProblem();
          buildSidebar();
        } else {
          Lab6Store.markStage(stage.id);
          els.main.innerHTML += `<div class="card"><h3>Stage complete!</h3><p>Move to practice or the next guided stage.</p>
            <div class="btn-row">
              <a class="btn btn-primary" href="practice.html?stage=${nextPracticeStage(stage.id)}">Practice this topic →</a>
              <a class="btn btn-secondary" href="index.html">Back to hub</a>
            </div></div>`;
        }
        updateTracker();
      }
    };

    const skipBtn = document.getElementById('btn-skip-guided');
    if (skipBtn) {
      skipBtn.onclick = () => {
        const s = Lab6Store.load();
        s.skippedGuided = true;
        Lab6Store.save(s);
        location.href = `practice.html?stage=${nextPracticeStage(stage.id)}`;
      };
    }
    updateTracker();
  }

  function nextPracticeStage(guidedId) {
    const map = { 'guided-1': 'practice-a', 'guided-2': 'practice-b', 'guided-3': 'practice-c' };
    return map[guidedId] || 'practice-a';
  }

  buildSidebar();
  if (mode === 'concepts') renderConcepts();
  else renderProblem();
})();
