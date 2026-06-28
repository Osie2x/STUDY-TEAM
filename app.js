const STORAGE_KEY = "ma123-lab6-progress-v1";

const state = {
  progress: loadProgress(),
  gauntlet: {
    active: false,
    queue: [],
    index: 0,
    correct: 0,
    title: "Practice"
  },
  cofactorMatrix: [
    [1, -2, 3],
    [-4, -5, -6],
    [7, -8, 9]
  ],
  rowOpMatrix: [
    [3, -6, 9],
    [0, 1, 5],
    [2, 6, 5]
  ],
  rowOpFactor: 1,
  rowOpNote: "Original determinant factor: 1"
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      completed: {},
      wrong: {},
      streak: 0
    };
  } catch {
    return { completed: {}, wrong: {}, streak: 0 };
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  renderDashboard();
  renderWrongTracker();
}

function $(id) {
  return document.getElementById(id);
}

function normalizeAnswer(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:]$/g, "");
}

function answerMatches(input, question) {
  const answer = normalizeAnswer(input);
  if (!answer) return false;
  return question.accepted.some((accepted) => normalizeAnswer(accepted) === answer);
}

function getQuestion(id) {
  return APP_DATA.questions.find((question) => question.id === id);
}

function questionBank() {
  return APP_DATA.questions;
}

function byStage(stage) {
  return questionBank().filter((question) => question.stage === stage);
}

function interleavedQueue(stage) {
  const main = byStage(stage);
  const review = [];
  if (stage === "B") review.push(...byStage("A").slice(0, 2));
  if (stage === "C") review.push(byStage("A")[2], byStage("B")[0]);
  if (stage === "D") review.push(byStage("A")[0], byStage("B")[1], byStage("C")[0]);
  return weave(main, review.filter(Boolean));
}

function mixedQueue() {
  const stages = ["A", "B", "C", "D"].map(byStage);
  const maxLength = Math.max(...stages.map((stage) => stage.length));
  const mixed = [];
  for (let i = 0; i < maxLength; i += 1) {
    stages.forEach((stage) => {
      if (stage[i]) mixed.push(stage[i]);
    });
  }
  return mixed;
}

function weave(main, review) {
  const output = [];
  main.forEach((question, index) => {
    output.push(question);
    if ((index + 1) % 3 === 0 && review.length) {
      output.push(review.shift());
    }
  });
  return output.concat(review);
}

function renderDashboard() {
  const completed = Object.keys(state.progress.completed).length;
  const wrongIds = Object.keys(state.progress.wrong);
  $("completedCount").textContent = completed;
  $("wrongCount").textContent = wrongIds.length;
  $("streakCount").textContent = state.progress.streak;
  $("reviewDue").textContent = wrongIds.length;
}

function renderPath() {
  $("pathGrid").innerHTML = APP_DATA.stages
    .map((stage) => `
      <article class="path-card">
        <div class="path-card__badge">${stage.id}</div>
        <h3>${stage.title}</h3>
        <p>${stage.goal}</p>
        <ol>${stage.path.map((item) => `<li>${item}</li>`).join("")}</ol>
        <button class="button button--small" data-stage-start="${stage.id}">Start ${stage.id}</button>
      </article>
    `)
    .join("");
}

function renderLessons() {
  $("lessonList").innerHTML = APP_DATA.lessons
    .map((lesson) => `
      <article class="lesson card" data-lesson="${lesson.id}">
        <div class="lesson__header">
          <div>
            <p class="eyebrow">${lesson.source}</p>
            <h3>${lesson.title}</h3>
            <p>${lesson.summary}</p>
          </div>
          <button class="button button--small" data-lesson-reset="${lesson.id}">Restart</button>
        </div>
        <div class="lesson__steps" id="steps-${lesson.id}"></div>
        <div class="lesson__actions">
          <button class="button button--primary" data-lesson-next="${lesson.id}">Reveal next step</button>
          <button class="button" data-lesson-all="${lesson.id}">Show all steps</button>
        </div>
      </article>
    `)
    .join("");

  APP_DATA.lessons.forEach((lesson) => {
    renderLessonSteps(lesson.id, 0);
  });
}

function renderLessonSteps(lessonId, count) {
  const lesson = APP_DATA.lessons.find((item) => item.id === lessonId);
  const container = $(`steps-${lessonId}`);
  const visible = Number(container.dataset.visible || count || 0);
  container.dataset.visible = visible;
  container.innerHTML = lesson.steps
    .slice(0, visible)
    .map((step, index) => `
      <div class="step">
        <div class="step__number">${index + 1}</div>
        <div>
          <h4>${step.label}</h4>
          <p>${step.body}</p>
        </div>
      </div>
    `)
    .join("");
  if (visible === 0) {
    container.innerHTML = '<div class="empty-state">Click "Reveal next step." Do not rush: write each math line on paper before revealing the next one.</div>';
  }
}

function renderPracticeList() {
  const groups = ["A", "B", "C", "D"];
  $("practiceList").innerHTML = groups
    .map((stage) => {
      const items = byStage(stage);
      return `
        <article class="practice-stage card">
          <h3>Stage ${stage}</h3>
          <div class="question-chips">
            ${items
              .map((question) => `
                <button class="question-chip" data-single-question="${question.id}">
                  <span>${question.title}</span>
                  <small>${question.source}</small>
                </button>
              `)
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWrongTracker() {
  const wrong = Object.entries(state.progress.wrong)
    .map(([id, record]) => ({ question: getQuestion(id), record }))
    .filter((item) => item.question);

  if (!wrong.length) {
    $("wrongTracker").innerHTML = '<div class="empty-state">No wrong answers yet. Start a gauntlet to create a retry queue.</div>';
    return;
  }

  $("wrongTracker").innerHTML = wrong
    .map(({ question, record }) => `
      <article class="wrong-item">
        <div>
          <h3>${question.title}</h3>
          <p>${question.prompt}</p>
          <small>${question.source} | Missed ${record.count} time(s) | Last: ${record.lastAnswer || "IDK"}</small>
        </div>
        <button class="button button--small" data-single-question="${question.id}">Retry</button>
      </article>
    `)
    .join("");
}

function renderCofactorViz() {
  const row = Number($("cofactorRow").value);
  const col = Number($("cofactorCol").value);
  const matrix = state.cofactorMatrix;
  const submatrix = matrix.filter((_, r) => r !== row).map((items) => items.filter((_, c) => c !== col));
  const sign = (row + col + 2) % 2 === 0 ? "+" : "-";
  const subdet = submatrix[0][0] * submatrix[1][1] - submatrix[0][1] * submatrix[1][0];
  const cofactor = sign === "+" ? subdet : -subdet;

  $("cofactorViz").innerHTML = `
    <div>
      <p class="viz-label">Original matrix</p>
      ${matrixHtml(matrix, (r, c) => {
        if (r === row && c === col) return "selected";
        if (r === row || c === col) return "deleted";
        return "";
      })}
    </div>
    <div class="arrow">-></div>
    <div>
      <p class="viz-label">Remaining submatrix</p>
      ${matrixHtml(submatrix)}
    </div>
  `;
  $("cofactorText").textContent = `C_${row + 1}${col + 1} = ${sign} det([[${submatrix[0].join(", ")}], [${submatrix[1].join(", ")}]]) = ${cofactor}`;
}

function renderRowOpViz() {
  $("rowOpViz").innerHTML = matrixHtml(state.rowOpMatrix);
  $("detStatus").textContent = `${state.rowOpNote}. Current det factor relative to original: ${state.rowOpFactor}`;
}

function renderTriangularViz() {
  const matrix = [
    [-1, 0, 0, 0, 0],
    ["5x", 3, 0, 0, 0],
    ["x+6", 2, 2, 0, 0],
    [4, -13, 0, 1, 0],
    [0, "4x^2", 9, 6, -2]
  ];
  $("triangularViz").innerHTML = matrixHtml(matrix, (r, c) => (r === c ? "selected" : c > r ? "deleted" : ""));
}

function matrixHtml(matrix, classForCell = () => "") {
  return `<div class="matrix">${matrix
    .map((row, r) => `<div class="matrix__row">${row
      .map((value, c) => `<span class="${classForCell(r, c)}">${value}</span>`)
      .join("")}</div>`)
    .join("")}</div>`;
}

function applyRowOperation(op) {
  if (op === "reset") {
    state.rowOpMatrix = [
      [3, -6, 9],
      [0, 1, 5],
      [2, 6, 5]
    ];
    state.rowOpFactor = 1;
    state.rowOpNote = "Original determinant factor: 1";
  }
  if (op === "replace") {
    state.rowOpMatrix[2] = state.rowOpMatrix[2].map((value, index) => value - 2 * state.rowOpMatrix[0][index]);
    state.rowOpNote = "Row replacement preserves the determinant";
  }
  if (op === "swap") {
    [state.rowOpMatrix[0], state.rowOpMatrix[1]] = [state.rowOpMatrix[1], state.rowOpMatrix[0]];
    state.rowOpFactor *= -1;
    state.rowOpNote = "Row swap flips the determinant sign";
  }
  if (op === "scale") {
    state.rowOpMatrix[1] = state.rowOpMatrix[1].map((value) => value * 3);
    state.rowOpFactor *= 3;
    state.rowOpNote = "Scaling one row by 3 multiplies the determinant by 3";
  }
  renderRowOpViz();
}

function startGauntlet(queue, title) {
  state.gauntlet = {
    active: true,
    queue,
    index: 0,
    correct: 0,
    title
  };
  $("gauntlet").classList.add("is-open");
  $("gauntlet").setAttribute("aria-hidden", "false");
  $("gauntletTitle").textContent = title;
  $("pledgeCheck").checked = false;
  $("pledgeBox").style.display = "block";
  renderGauntletQuestion();
}

function renderGauntletQuestion(feedback = "") {
  const question = state.gauntlet.queue[state.gauntlet.index];
  const progress = `${state.gauntlet.index + 1}/${state.gauntlet.queue.length}`;
  $("gauntletProgress").textContent = progress;

  if (!question) {
    finishGauntlet();
    return;
  }

  const locked = !$("pledgeCheck").checked;
  $("gauntletCard").innerHTML = `
    <div class="source-line">${question.source} | Stage ${question.stage} | ${question.type.toUpperCase()}</div>
    <h3>${question.title}</h3>
    <p class="gauntlet-prompt">${question.prompt}</p>
    ${locked ? '<div class="empty-state">Check the no-AI pledge to unlock the answer box.</div>' : answerForm(question)}
    ${feedback}
  `;
}

function answerForm(question) {
  const label = question.type === "truefalse" ? "Type True or False" : "Enter your answer";
  return `
    <label class="answer-label">${label}
      <input id="answerInput" class="answer-input" autocomplete="off" />
    </label>
    <div class="gauntlet-actions">
      <button class="button button--primary" id="submitAnswer">Submit answer</button>
      <button class="button" id="submitIdk">IDK</button>
    </div>
  `;
}

function submitCurrentAnswer(idk = false) {
  const question = state.gauntlet.queue[state.gauntlet.index];
  const input = idk ? "IDK" : ($("answerInput") ? $("answerInput").value : "");
  if (!idk && !input.trim()) return;

  if (!idk && answerMatches(input, question)) {
    markCorrect(question);
    state.gauntlet.correct += 1;
    showCorrect(question);
    return;
  }

  markWrong(question, input);
  showWrong(question, idk);
}

function markCorrect(question) {
  state.progress.completed[question.id] = {
    at: new Date().toISOString()
  };
  delete state.progress.wrong[question.id];
  state.progress.streak += 1;
  saveProgress();
}

function markWrong(question, answer) {
  const old = state.progress.wrong[question.id] || { count: 0 };
  state.progress.wrong[question.id] = {
    count: old.count + 1,
    lastAnswer: answer,
    at: new Date().toISOString()
  };
  state.progress.streak = 0;
  saveProgress();
}

function showCorrect(question) {
  const feedback = `
    <div class="feedback feedback--correct">
      <h4>Correct. Now check the full math.</h4>
      ${solutionHtml(question)}
      <button class="button button--primary" id="nextQuestion">Next question</button>
    </div>
  `;
  renderGauntletQuestion(feedback);
}

function showWrong(question, idk) {
  const retry = findRetry(question);
  const feedback = `
    <div class="feedback feedback--wrong">
      <h4>${idk ? "IDK logged" : "Wrong or not exact enough"} - reteach before the next rep.</h4>
      <p>${question.reteach}</p>
      ${solutionHtml(question)}
      <div class="mini-recall">
        <strong>Say aloud:</strong> What rule did this problem require? Then write the key line on paper.
      </div>
      <button class="button button--primary" id="nextQuestion">Give me another question</button>
    </div>
  `;
  if (retry && !state.gauntlet.queue.slice(state.gauntlet.index + 1).some((item) => item.id === retry.id)) {
    state.gauntlet.queue.splice(state.gauntlet.index + 1, 0, retry);
  }
  renderGauntletQuestion(feedback);
}

function solutionHtml(question) {
  return `<ol class="solution">${question.solution.map((line) => `<li>${line}</li>`).join("")}</ol>`;
}

function findRetry(question) {
  return questionBank().find((item) => item.stage === question.stage && item.id !== question.id);
}

function nextQuestion() {
  state.gauntlet.index += 1;
  renderGauntletQuestion();
}

function finishGauntlet() {
  $("gauntletCard").innerHTML = `
    <div class="finish-card">
      <h3>Gauntlet complete</h3>
      <p>Score this run: ${state.gauntlet.correct}/${state.gauntlet.queue.length}</p>
      <p>Now write the wrong-answer list on paper. Redo those without looking before tomorrow's lab.</p>
      <button class="button button--primary" id="closeGauntlet">Return to study guide</button>
      <button class="button" id="restartWrongFromFinish">Practice wrong queue now</button>
    </div>
  `;
  $("gauntletProgress").textContent = "Done";
}

function closeGauntlet() {
  $("gauntlet").classList.remove("is-open");
  $("gauntlet").setAttribute("aria-hidden", "true");
}

function startWrongQueue() {
  const wrongQueue = Object.keys(state.progress.wrong).map(getQuestion).filter(Boolean);
  if (!wrongQueue.length) {
    alert("No wrong answers in the tracker yet.");
    return;
  }
  startGauntlet(wrongQueue, "Wrong-answer retry queue");
}

function wireEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    const stageStart = target.dataset.stageStart;
    const lessonNext = target.dataset.lessonNext;
    const lessonAll = target.dataset.lessonAll;
    const lessonReset = target.dataset.lessonReset;
    const singleQuestion = target.closest("[data-single-question]")?.dataset.singleQuestion;
    const rowOp = target.dataset.op;

    if (stageStart) startGauntlet(interleavedQueue(stageStart), `Stage ${stageStart} gauntlet`);
    if (lessonNext) {
      const container = $(`steps-${lessonNext}`);
      const lesson = APP_DATA.lessons.find((item) => item.id === lessonNext);
      const next = Math.min(Number(container.dataset.visible || 0) + 1, lesson.steps.length);
      container.dataset.visible = next;
      renderLessonSteps(lessonNext, next);
    }
    if (lessonAll) {
      const lesson = APP_DATA.lessons.find((item) => item.id === lessonAll);
      const container = $(`steps-${lessonAll}`);
      container.dataset.visible = lesson.steps.length;
      renderLessonSteps(lessonAll, lesson.steps.length);
    }
    if (lessonReset) {
      const container = $(`steps-${lessonReset}`);
      container.dataset.visible = 0;
      renderLessonSteps(lessonReset, 0);
    }
    if (singleQuestion) startGauntlet([getQuestion(singleQuestion)].filter(Boolean), "Single-question focus");
    if (rowOp) applyRowOperation(rowOp);
    if (target.id === "submitAnswer") submitCurrentAnswer(false);
    if (target.id === "submitIdk") submitCurrentAnswer(true);
    if (target.id === "nextQuestion") nextQuestion();
    if (target.id === "closeGauntlet") closeGauntlet();
    if (target.id === "restartWrongFromFinish") startWrongQueue();
  });

  $("cofactorRow").addEventListener("change", renderCofactorViz);
  $("cofactorCol").addEventListener("change", renderCofactorViz);
  $("pledgeCheck").addEventListener("change", () => {
    $("pledgeBox").style.display = $("pledgeCheck").checked ? "none" : "block";
    renderGauntletQuestion();
  });
  $("startGauntletHero").addEventListener("click", () => startGauntlet(mixedQueue(), "Mixed interleaved gauntlet"));
  $("startStageA").addEventListener("click", () => startGauntlet(interleavedQueue("A"), "Stage A gauntlet"));
  $("startStageB").addEventListener("click", () => startGauntlet(interleavedQueue("B"), "Stage B gauntlet"));
  $("startStageC").addEventListener("click", () => startGauntlet(interleavedQueue("C"), "Stage C gauntlet"));
  $("startMixed").addEventListener("click", () => startGauntlet(mixedQueue(), "Mixed interleaved gauntlet"));
  $("startWrongQueue").addEventListener("click", startWrongQueue);
  $("clearTracker").addEventListener("click", () => {
    if (confirm("Clear all wrong-answer tracker data?")) {
      state.progress.wrong = {};
      state.progress.streak = 0;
      saveProgress();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && $("gauntlet").classList.contains("is-open") && $("answerInput")) {
      submitCurrentAnswer(false);
    }
  });
}

function init() {
  renderPath();
  renderLessons();
  renderPracticeList();
  renderDashboard();
  renderWrongTracker();
  renderCofactorViz();
  renderRowOpViz();
  renderTriangularViz();
  wireEvents();
}

init();
