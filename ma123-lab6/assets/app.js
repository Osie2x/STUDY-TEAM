/* Shared app utilities — progress, grading, KaTeX rendering */
const Lab6Store = {
  key: 'ma123-lab6-progress-v1',

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || this.defaultState();
    } catch {
      return this.defaultState();
    }
  },

  defaultState() {
    return {
      completedProblems: {},
      completedStages: {},
      wrongLog: [],
      stageProgress: {},
      gauntletIndex: 0,
      skippedGuided: false
    };
  },

  save(state) {
    localStorage.setItem(this.key, JSON.stringify(state));
  },

  markProblem(id, correct) {
    const s = this.load();
    s.completedProblems[id] = { correct, at: Date.now() };
    if (!correct) {
      s.wrongLog.push({ id, at: Date.now() });
    }
    this.save(s);
  },

  markStage(stageId) {
    const s = this.load();
    s.completedStages[stageId] = Date.now();
    this.save(s);
  },

  getWrongCount() {
    return this.load().wrongLog.length;
  },

  getStats() {
    const s = this.load();
    const total = Object.keys(s.completedProblems).length;
    const correct = Object.values(s.completedProblems).filter((x) => x.correct).length;
    return { total, correct, wrong: s.wrongLog.length };
  },

  reset() {
    localStorage.removeItem(this.key);
  }
};

function normalizeAnswer(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/−/g, '-')
    .replace(/×/g, '*');
}

function checkAnswer(userInput, problem) {
  if (!userInput || userInput.trim() === '') return { ok: false, reason: 'empty' };
  const raw = normalizeAnswer(userInput);
  if (raw === 'idk' || raw === "i don't know" || raw === 'dont know') {
    return { ok: false, reason: 'idk' };
  }

  const mode = problem.check || 'exact';
  const answers = [problem.answer, ...(problem.accept || [])].map(normalizeAnswer);

  if (mode === 'tf') {
    const tf = { t: 'true', f: 'false', true: 'true', false: 'false', yes: 'true', no: 'false', y: 'true', n: 'false' };
    const u = tf[raw] || raw;
    const expected = answers.map((a) => tf[a] || a);
    return { ok: expected.includes(u), reason: u };
  }

  if (mode === 'contains') {
    const ok = answers.every((token) => raw.includes(token) || answers.some((a) => raw.includes(a.split(',')[0])));
    const loose = answers.some((a) => a.split(/[, ]+/).every((part) => raw.includes(part.trim())));
    return { ok: ok || loose, reason: raw };
  }

  // numeric tolerance
  const numUser = parseFloat(raw.replace(/[^0-9.\-/]/g, ''));
  const numAns = parseFloat(String(problem.answer).replace(/[^0-9.\-/]/g, ''));
  if (!Number.isNaN(numUser) && !Number.isNaN(numAns)) {
    if (Math.abs(numUser - numAns) < 0.01) return { ok: true, reason: raw };
  }

  return { ok: answers.includes(raw), reason: raw };
}

function renderMath(el) {
  if (!window.renderMathInElement) return;
  renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ],
    throwOnError: false
  });
}

function getProblem(id) {
  return Lab6Problems.problems[id];
}

function getStageProblems(stage) {
  const ids = [...(stage.problems || [])];
  const data = Lab6Store.load();

  if (stage.interleaveFrom) {
    const prior = Lab6Problems.stages.find((s) => s.id === stage.interleaveFrom);
    if (prior) {
      const wrongFromPrior = prior.problems.filter((pid) => {
        const rec = data.completedProblems[pid];
        return rec && !rec.correct;
      });
      const sample = wrongFromPrior.length
        ? wrongFromPrior.slice(0, stage.interleaveCount || 2)
        : prior.problems.slice(0, stage.interleaveCount || 2);
      ids.unshift(...sample.map((p) => `review-${p}`));
    }
  }

  if (stage.interleaveAlsoFrom) {
    const also = Lab6Problems.stages.find((s) => s.id === stage.interleaveAlsoFrom);
    if (also) {
      ids.splice(Math.floor(ids.length / 2), 0, ...also.problems.slice(0, stage.interleaveAlsoCount || 2).map((p) => `review-${p}`));
    }
  }

  return ids.map((id) => {
    if (id.startsWith('review-')) {
      const base = getProblem(id.replace('review-', ''));
      return { ...base, id, source: `Review ← ${base.source}`, isReview: true };
    }
    return getProblem(id);
  }).filter(Boolean);
}

function stageProgress(stage) {
  const probs = getStageProblems(stage);
  const data = Lab6Store.load();
  const done = probs.filter((p) => data.completedProblems[p.id]).length;
  return { done, total: probs.length, pct: probs.length ? Math.round((done / probs.length) * 100) : 0 };
}

window.Lab6Store = Lab6Store;
window.Lab6Util = { normalizeAnswer, checkAnswer, renderMath, getProblem, getStageProblems, stageProgress };
