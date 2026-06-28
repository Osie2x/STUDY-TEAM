/* Practice + Gauntlet page */
(function () {
  const params = new URLSearchParams(location.search);
  const stageId = params.get('stage') || 'practice-a';
  const gauntletMode = stageId === 'gauntlet' || params.get('gauntlet') === '1';

  const stage = Lab6Problems.stages.find((s) => s.id === stageId) || Lab6Problems.stages.find((s) => s.id === 'practice-a');
  let queue = getStageProblems(stage);
  let index = 0;
  let awaitingRetry = false;
  let reteachShown = false;

  const els = {
    wrap: document.getElementById('practice-wrap'),
    lock: document.getElementById('gauntlet-lock'),
    title: document.getElementById('page-title'),
    tracker: document.getElementById('tracker-text'),
    wrongList: document.getElementById('wrong-list')
  };

  function updateTracker() {
    const st = Lab6Store.getStats();
    els.tracker.innerHTML = `Stage: <strong>${stage.name}</strong> | Problem <strong>${Math.min(index + 1, queue.length)}</strong>/${queue.length} | Wrong: <strong>${st.wrong}</strong>`;
    const log = Lab6Store.load().wrongLog.slice(-8).reverse();
    els.wrongList.innerHTML = log.length
      ? log.map((w) => `<li>${w.id} — ${new Date(w.at).toLocaleTimeString()}</li>`).join('')
      : '<li>No wrong answers yet — keep going!</li>';
  }

  function showGauntletLock(show) {
    if (!els.lock) return;
    els.lock.classList.toggle('hidden', !show);
    document.body.style.overflow = show ? 'hidden' : '';
  }

  function render() {
    if (index >= queue.length) {
      Lab6Store.markStage(stage.id);
      els.wrap.innerHTML = `<div class="card fade-in"><h2>🎉 ${stage.name} complete!</h2>
        <p>You finished all ${queue.length} problems.</p>
        <div class="btn-row">
          <a href="index.html" class="btn btn-primary">Back to hub</a>
          ${stage.id === 'practice-c' ? '<a href="practice.html?stage=gauntlet" class="btn btn-danger">Enter Final Gauntlet →</a>' : ''}
        </div></div>`;
      showGauntletLock(false);
      return;
    }

    const prob = queue[index];
    const isGauntlet = stage.kind === 'gauntlet' || gauntletMode;
    showGauntletLock(isGauntlet);

    const host = isGauntlet && els.lock ? els.lock.querySelector('.gauntlet-body') : els.wrap;
    if (!host) return;

    host.innerHTML = `
      <div class="card fade-in">
        ${prob.isReview ? '<p style="color:var(--accent)">🔄 Interleaved review from earlier stage</p>' : ''}
        <div class="no-ai-banner">⚠️ <strong>No AI. No internet.</strong> Work on paper first. Type your answer or click "I don't know".</div>
        <p class="problem-source">📚 ${prob.source}</p>
        <div class="problem-prompt">\\(${prob.prompt}\\)</div>
        ${prob.matrix ? '<div class="viz-box" id="prac-viz"></div>' : ''}
        <input type="text" class="answer-box" id="answer-input" placeholder="Your answer (or type IDK)" autocomplete="off" />
        <div class="btn-row">
          <button class="btn btn-primary" id="btn-submit">Check answer</button>
          <button class="btn btn-secondary" id="btn-idk">I don't know</button>
        </div>
        <div id="feedback-area"></div>
        <div id="reteach-area"></div>
      </div>`;

    if (prob.matrix) MatrixViz.render(document.getElementById('prac-viz'), { type: 'cofactor', matrix: prob.matrix, row: 0 });
    Lab6Util.renderMath(host);

    const input = host.querySelector('#answer-input');
    const feedback = host.querySelector('#feedback-area');
    const reteach = host.querySelector('#reteach-area');

    input.focus();
    input.onkeydown = (e) => { if (e.key === 'Enter') host.querySelector('#btn-submit').click(); };

    host.querySelector('#btn-idk').onclick = () => {
      input.value = 'IDK';
      host.querySelector('#btn-submit').click();
    };

    host.querySelector('#btn-submit').onclick = () => {
      if (awaitingRetry && !reteachShown) return;
      const result = checkAnswer(input.value, prob);

      if (result.reason === 'idk') {
        showReteach(prob, reteach, true);
        feedback.innerHTML = `<div class="feedback bad">That's OK — study the re-teach below, then you'll get a similar problem.</div>`;
        Lab6Store.markProblem(prob.id, false);
        awaitingRetry = true;
        reteachShown = true;
        updateTracker();
        return;
      }

      if (result.ok) {
        feedback.innerHTML = `<div class="feedback ok">✓ Correct! ${prob.solution ? `\\(${prob.solution}\\)` : ''}</div>`;
        Lab6Util.renderMath(feedback);
        Lab6Store.markProblem(prob.id, true);
        awaitingRetry = false;
        reteachShown = false;
        updateTracker();
        setTimeout(() => { index++; render(); }, isGauntlet ? 900 : 600);
      } else {
        feedback.innerHTML = `<div class="feedback bad">✗ Not quite. Compare your work — then study the re-teach.</div>`;
        Lab6Store.markProblem(prob.id, false);
        showReteach(prob, reteach, false);
        awaitingRetry = true;
        reteachShown = true;
        updateTracker();
        host.innerHTML += `<div class="btn-row" id="retry-row"><button class="btn btn-success" id="btn-retry">Try a similar problem →</button></div>`;
        host.querySelector('#btn-retry').onclick = () => {
          queue.splice(index + 1, 0, makeVariant(prob));
          awaitingRetry = false;
          reteachShown = false;
          index++;
          render();
        };
      }
    };
    updateTracker();
  }

  function showReteach(prob, container, isIdk) {
    const gid = prob.reteach;
    const guided = gid ? getProblem(gid) : null;
    let html = `<div class="reteach-panel"><h4>📖 Re-teach: ${isIdk ? 'Similar worked example' : 'Review the method'}</h4>`;
    if (guided && guided.steps) {
      html += guided.steps.map((s, i) => `<p><strong>Step ${i + 1}:</strong> ${s.label}<br>\\[${s.math}\\]</p>`).join('');
      html += `<p><strong>Answer:</strong> ${guided.answer}</p>`;
    } else {
      html += `<p>\\(${prob.solution || prob.answer}\\)</p>`;
    }
    html += '</div>';
    container.innerHTML = html;
    Lab6Util.renderMath(container);
  }

  function makeVariant(prob) {
    const variants = {
      'p-2x2-1': { ...prob, id: prob.id + '-v', prompt: '\\(\\det\\begin{bmatrix}3&5\\\\1&4\\end{bmatrix}=\\)?', answer: '7', solution: '12-5=7' },
      'p-3x3-1': { ...prob, id: prob.id + '-v', prompt: '\\(\\det\\begin{bmatrix}2&1&0\\\\-1&3&2\\\\0&0&1\\end{bmatrix}=\\)?', answer: '6', solution: 'Upper triangular: 2·3·1=6' },
      'gnt-1': { ...prob, id: prob.id + '-v', prompt: '\\(\\det\\begin{bmatrix}1&4\\\\2&3\\end{bmatrix}=\\)?', answer: '-5', solution: '3-8=-5' }
    };
    return variants[prob.id] || { ...prob, id: prob.id + '-retry', prompt: prob.prompt + ' (retry)' };
  }

  els.title.textContent = stage.name;
  if (stage.kind === 'gauntlet') showGauntletLock(true);
  render();
})();
