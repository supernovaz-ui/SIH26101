/* =========================================================
   CareerPath — Onboarding Logic
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. ROLE-SPECIFIC Q3 OPTIONS
     --------------------------------------------------------- */

  const Q3_OPTIONS_BY_ROLE = {

    /* -----------------------------------------
       STATISTICAL OFFICER
       ----------------------------------------- */
    stat_officer: [
      { value: "statistical_analysis", icon: "📊", label: "Statistical Analysis" },
      { value: "sampling", icon: "🎯", label: "Sampling & Survey Methods" },
      { value: "data_quality", icon: "✓", label: "Data Quality & Validation" },
      { value: "time_series", icon: "📈", label: "Time-Series Analysis" },
      { value: "data_visualization", icon: "📉", label: "Data Visualization" },
      { value: "stat_software", icon: "🧮", label: "Statistical Software" },
      { value: "python", icon: "🐍", label: "Python / Programming" },
      { value: "sql", icon: "🗄️", label: "SQL & Databases" },
      { value: "other", icon: "•••", label: "Other" },
      {
        value: "none",
        icon: "—",
        label: "I don't currently use these",
        exclusive: true
      }
    ],

    /* -----------------------------------------
       DATA / STATISTICAL ANALYST
       ----------------------------------------- */
    data_analyst: [
      { value: "statistical_analysis", icon: "📊", label: "Statistical Analysis" },
      { value: "data_cleaning", icon: "🧹", label: "Data Cleaning & Validation" },
      { value: "data_visualization", icon: "📉", label: "Data Visualization" },
      { value: "python", icon: "🐍", label: "Python / Programming" },
      { value: "sql", icon: "🗄️", label: "SQL & Databases" },
      { value: "time_series", icon: "📈", label: "Time-Series Analysis" },
      { value: "stat_software", icon: "🧮", label: "Statistical Software" },
      { value: "ai_ml", icon: "🤖", label: "AI / Machine Learning" },
      { value: "other", icon: "•••", label: "Other" },
      {
        value: "none",
        icon: "—",
        label: "I don't currently use these",
        exclusive: true
      }
    ],

    /* -----------------------------------------
       FIELD / SURVEY OFFICER
       ----------------------------------------- */
    field_officer: [
      { value: "survey_methodology", icon: "📋", label: "Survey Methodology" },
      { value: "sampling", icon: "🎯", label: "Sampling Methods" },
      { value: "data_collection", icon: "📱", label: "Data Collection" },
      { value: "data_quality", icon: "✓", label: "Data Quality & Validation" },
      { value: "field_operations", icon: "🧭", label: "Field Operations" },
      { value: "data_interpretation", icon: "🔎", label: "Data Interpretation" },
      { value: "excel", icon: "📊", label: "Excel / Spreadsheets" },
      { value: "gis", icon: "🗺️", label: "GIS Tools" },
      { value: "survey_systems", icon: "📲", label: "Survey / Data Collection Systems" },
      { value: "other", icon: "•••", label: "Other" },
      {
        value: "none",
        icon: "—",
        label: "I don't currently use these",
        exclusive: true
      }
    ],

    /* -----------------------------------------
       IT / DATA SYSTEMS OFFICER
       ----------------------------------------- */
    it_officer: [
      { value: "sql", icon: "🗄️", label: "SQL & Databases" },
      { value: "python", icon: "🐍", label: "Python / Programming" },
      { value: "data_engineering", icon: "⚙️", label: "Data Engineering" },
      { value: "statistical_systems", icon: "🏛️", label: "Statistical Data Systems" },
      { value: "api_integration", icon: "🔗", label: "APIs / System Integration" },
      { value: "data_quality", icon: "✓", label: "Data Quality & Validation" },
      { value: "data_security", icon: "🔐", label: "Data Security" },
      { value: "cloud", icon: "☁️", label: "Cloud Technologies" },
      { value: "other", icon: "•••", label: "Other" },
      {
        value: "none",
        icon: "—",
        label: "I don't currently use these",
        exclusive: true
      }
    ],

    /* -----------------------------------------
       MANAGER / SUPERVISOR
       ----------------------------------------- */
    manager: [
      { value: "statistical_planning", icon: "📋", label: "Statistical Planning" },
      { value: "data_interpretation", icon: "🔎", label: "Data Interpretation" },
      { value: "quality_assurance", icon: "✓", label: "Quality Assurance" },
      { value: "decision_making", icon: "🧠", label: "Evidence-Based Decision Making" },
      { value: "team_management", icon: "👥", label: "Team Management" },
      { value: "project_management", icon: "📅", label: "Project Management" },
      { value: "communication", icon: "💬", label: "Communication & Reporting" },
      { value: "data_visualization", icon: "📊", label: "Data Visualization" },
      { value: "other", icon: "•••", label: "Other" },
      {
        value: "none",
        icon: "—",
        label: "I don't currently use these",
        exclusive: true
      }
    ],

    /* -----------------------------------------
       OTHER / FALLBACK
       ----------------------------------------- */
    other: [
      { value: "statistical_analysis", icon: "📊", label: "Statistical Analysis" },
      { value: "data_interpretation", icon: "🔎", label: "Data Interpretation" },
      { value: "data_quality", icon: "✓", label: "Data Quality & Validation" },
      { value: "data_visualization", icon: "📉", label: "Data Visualization" },
      { value: "excel", icon: "📊", label: "Excel / Spreadsheets" },
      { value: "sql", icon: "🗄️", label: "SQL & Databases" },
      { value: "stat_software", icon: "🧮", label: "Statistical Software" },
      { value: "python", icon: "🐍", label: "Python / Programming" },
      { value: "other", icon: "•••", label: "Other" },
      {
        value: "none",
        icon: "—",
        label: "I don't currently use these",
        exclusive: true
      }
    ]
  };


  /* ---------------------------------------------------------
     2. CONTENT / DATA MODEL
     --------------------------------------------------------- */

  const STAGES = [
    {
      id: "role",
      title: "Current Role",
      sidebarDesc: "Let's start with where you are today.",

      questions: [

        /* Q1 */
        {
          id: "currentRole",
          type: "single",
          eyebrow: "CURRENT ROLE",
          question: "What is your current role?",
          subtext: "Tell us where you are in your current career journey.",

          options: [
            {
              value: "stat_officer",
              icon: "📊",
              label: "Statistical Officer"
            },
            {
              value: "data_analyst",
              icon: "📈",
              label: "Data / Statistical Analyst"
            },
            {
              value: "field_officer",
              icon: "🧭",
              label: "Field / Survey Officer"
            },
            {
              value: "it_officer",
              icon: "💻",
              label: "IT / Data Systems Officer"
            },
            {
              value: "manager",
              icon: "👥",
              label: "Manager / Supervisor"
            },
            {
              value: "other",
              icon: "•••",
              label: "Other"
            }
          ]
        },

        /* Q2 */
        {
          id: "experience",
          type: "single",
          eyebrow: "CURRENT ROLE",
          question: "How many years of experience do you have?",
          subtext: "This helps us understand your career stage.",

          options: [
            {
              value: "0-1",
              icon: "🌱",
              label: "0–1 year"
            },
            {
              value: "1-3",
              icon: "📘",
              label: "1–3 years"
            },
            {
              value: "3-5",
              icon: "📗",
              label: "3–5 years"
            },
            {
              value: "5+",
              icon: "📙",
              label: "5+ years"
            }
          ]
        }
      ]
    },

    /* -------------------------------------------------------
       Q3 — DYNAMIC SKILLS
       ------------------------------------------------------- */

    {
      id: "skills",
      title: "Skills & Technology",
      sidebarDesc: "Your skills and technologies.",

      questions: [
        {
          id: "tools",
          type: "multi",
          maxSelect: 4,
          eyebrow: "SKILLS & TECHNOLOGY",

          question: "Which skills or technologies are you most comfortable using?",

          subtext: "Select up to 4 that best describe your current strengths.",

          /*
             IMPORTANT:
             Options are dynamically generated based on Q1.
          */
          get options() {
            const selectedRole = state.answers.currentRole;

            return (
              Q3_OPTIONS_BY_ROLE[selectedRole] ||
              Q3_OPTIONS_BY_ROLE.other
            );
          }
        }
      ]
    }
  ];


  const STAGE_RANGE = 100 / STAGES.length;


  /* ---------------------------------------------------------
     3. STATE
     --------------------------------------------------------- */

  const state = {
    stageIndex: 0,
    questionIndex: 0,

    answers: {},

    completed: false,
    reviewMode: false,
    isAnimating: false
  };


  /* ---------------------------------------------------------
     4. DOM REFERENCES
     --------------------------------------------------------- */

  const el = {
    journeyList: document.getElementById("journeyList"),
    progressSub: document.getElementById("progressSub"),
    progressPercent: document.getElementById("progressPercent"),
    progressFill: document.getElementById("progressFill"),
    progressBarWrap: document.getElementById("progressBarWrap"),
    milestones: document.getElementById("milestones"),
    questionViewport: document.getElementById("questionViewport"),
    navControls: document.getElementById("navControls"),
    backBtn: document.getElementById("backBtn"),
    continueBtn: document.getElementById("continueBtn"),
    continueLabel: document.getElementById("continueLabel"),
    plantHolderSmall: document.getElementById("plantHolderSmall"),
    plantHolderLarge: document.getElementById("plantHolderLarge"),
    toast: document.getElementById("toast")
  };


  /* ---------------------------------------------------------
     5. PLANT SVG
     --------------------------------------------------------- */

  function plantSvgMarkup() {
    return `
      <svg class="plant-visual" data-stage="0" viewBox="0 0 60 80"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Growth plant illustration">

        <ellipse cx="30" cy="71" rx="17" ry="4"
          fill="#D7DEE4" opacity="0.55"></ellipse>

        <path d="M17 61 L43 61 L39 74 L21 74 Z"
          fill="#8B5E3C"></path>

        <rect x="15" y="57" width="30" height="6" rx="2.5"
          fill="#A97C50"></rect>

        <line class="plant-stem"
          x1="30" y1="59" x2="30" y2="59"
          stroke="#3F7D4C"
          stroke-width="3"
          stroke-linecap="round"></line>

        <path class="plant-leaf leaf-1"
          d="M30 51 C23 49 19 44 21 39 C28 41 31 46 30 51 Z"
          fill="#4CAF6D"></path>

        <path class="plant-leaf leaf-1"
          d="M30 51 C37 49 41 44 39 39 C32 41 29 46 30 51 Z"
          fill="#3F9E5F"></path>

        <path class="plant-leaf leaf-2"
          d="M30 42 C22 40 18 34 20 28 C29 30 32 36 30 42 Z"
          fill="#4CAF6D"></path>

        <path class="plant-leaf leaf-2"
          d="M30 42 C38 40 42 34 40 28 C31 30 28 36 30 42 Z"
          fill="#399457"></path>

        <path class="plant-leaf leaf-3"
          d="M30 33 C21 31 17 24 19 18 C29 20 32 27 30 33 Z"
          fill="#4CAF6D"></path>

        <path class="plant-leaf leaf-3"
          d="M30 33 C39 31 43 24 41 18 C31 20 28 27 30 33 Z"
          fill="#358C4F"></path>

        <path class="plant-leaf leaf-4"
          d="M30 24 C20 22 16 14 18 8 C29 10 33 18 30 24 Z"
          fill="#4CAF6D"></path>

        <path class="plant-leaf leaf-4"
          d="M30 24 C40 22 44 14 42 8 C31 10 27 18 30 24 Z"
          fill="#2E7F47"></path>

        <circle class="plant-bud"
          cx="30" cy="14" r="4.5"
          fill="#F2C64C"></circle>

        <circle class="plant-crown"
          cx="30" cy="16" r="15"
          fill="#F2C64C"></circle>
      </svg>
    `;
  }


  el.plantHolderSmall.innerHTML = plantSvgMarkup();
  el.plantHolderLarge.innerHTML = plantSvgMarkup();


  function updatePlant(percent) {

    const stemY2 = 59 - (percent / 100) * 44;

    let stage = 0;

    if (percent >= 100) stage = 5;
    else if (percent >= 80) stage = 4;
    else if (percent >= 60) stage = 3;
    else if (percent >= 40) stage = 2;
    else if (percent >= 20) stage = 1;

    document.querySelectorAll(".plant-stem").forEach((line) => {
      line.setAttribute("y2", stemY2.toFixed(1));
    });

    document.querySelectorAll(".plant-visual").forEach((svg) => {
      svg.setAttribute("data-stage", String(stage));
    });
  }


  /* ---------------------------------------------------------
     6. PROGRESS CALCULATION
     --------------------------------------------------------- */

  function currentPercent() {

    if (state.completed) return 100;

    const totalQ = STAGES[state.stageIndex].questions.length;

    const base = state.stageIndex * STAGE_RANGE;

    return base +
      (state.questionIndex / totalQ) * STAGE_RANGE;
  }


  function isStageFullyAnswered(stageIdx) {

    return STAGES[stageIdx].questions.every((q) =>
      isAnswered(q)
    );
  }


  function isAnswered(question) {

    const val = state.answers[question.id];

    if (question.type === "multi") {
      return Array.isArray(val) && val.length > 0;
    }

    return val !== undefined && val !== null;
  }


  /* ---------------------------------------------------------
     7. RENDER: SIDEBAR + MILESTONES
     --------------------------------------------------------- */

  function stageStatus(stageIdx) {

    if (state.completed) return "completed";

    if (stageIdx < state.stageIndex) {
      return "completed";
    }

    if (stageIdx === state.stageIndex) {
      return "current";
    }

    return "upcoming";
  }


  function renderJourney() {

    el.journeyList.innerHTML = STAGES.map((stage, i) => {

      const status = stageStatus(i);

      const num = status === "completed"
        ? `
          <svg width="11" height="11"
            viewBox="0 0 16 16"
            fill="none">
            <path
              d="M3 8.5L6.2 11.5L13 4.5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"/>
          </svg>
        `
        : (i + 1);

      return `
        <li class="journey-item ${status}">
          <span class="journey-node">${num}</span>

          <span class="journey-text">
            <span class="journey-label">
              ${stage.title}
            </span>

            <span class="journey-desc">
              ${stage.sidebarDesc}
            </span>
          </span>
        </li>
      `;

    }).join("");
  }


  function renderMilestones() {

    const shortLabels = [
      "Role",
      "Work",
      "Skills"
    ];

    el.milestones.innerHTML = STAGES.map((stage, i) => {

      const status = stageStatus(i);

      const icon = status === "completed"
        ? `
          <svg width="9" height="9"
            viewBox="0 0 16 16"
            fill="none">
            <path
              d="M3 8.5L6.2 11.5L13 4.5"
              stroke="white"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"/>
          </svg>
        `
        : (i + 1);

      return `
        <li class="milestone ${status}">
          <span class="milestone-dot">
            ${icon}
          </span>

          <span>${shortLabels[i]}</span>
        </li>
      `;

    }).join("");
  }


  function renderProgressBar() {

    const pct = Math.round(currentPercent());

    el.progressPercent.textContent = pct + "%";

    el.progressFill.style.width = pct + "%";

    el.progressBarWrap.setAttribute(
      "aria-valuenow",
      String(pct)
    );

    if (state.completed) {

      el.progressSub.textContent =
        "All stages complete";

    } else {

      el.progressSub.textContent =
        `Step ${state.stageIndex + 1} of ${STAGES.length} · ${STAGES[state.stageIndex].title}`;
    }

    updatePlant(pct);
  }


  /* ---------------------------------------------------------
     8. RENDER: QUESTION PANEL
     --------------------------------------------------------- */

  function checkmarkSvg() {

    return `
      <svg width="11" height="11"
        viewBox="0 0 16 16"
        fill="none">

        <path
          d="M3 8.5L6.2 11.5L13 4.5"
          stroke="white"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"/>

      </svg>
    `;
  }


  function buildQuestionPanelHTML(
    stage,
    question,
    qIndex,
    totalQ
  ) {

    const val = state.answers[question.id];

    const isMulti = question.type === "multi";

    /*
      IMPORTANT:
      question.options may be a getter,
      so this gets the CURRENT role-specific options.
    */
    const options = question.options || [];

    const optionsHTML = options.map((opt) => {

      const selected = isMulti
        ? Array.isArray(val) &&
          val.includes(opt.value)
        : val === opt.value;

      return `
        <button
          type="button"
          class="option-card ${selected ? "selected" : ""}"
          data-value="${opt.value}"
          role="${isMulti ? "checkbox" : "radio"}"
          aria-pressed="${selected}"
          aria-checked="${selected}"
          aria-label="${opt.label}">

          <span
            class="option-icon"
            aria-hidden="true">
            ${opt.icon}
          </span>

          <span class="option-label">
            ${opt.label}
          </span>

          <span class="option-selector">
            ${checkmarkSvg()}
          </span>

        </button>
      `;

    }).join("");


    const limitHint = isMulti && question.maxSelect

      ? `
        <p class="limit-hint">
          Select up to ${question.maxSelect}.
        </p>
      `

      : "";


    return `
      <div class="question-panel">

        <div class="stage-eyebrow">
          <span class="dot"></span>
          ${question.eyebrow}
          · QUESTION ${qIndex + 1}/${totalQ}
        </div>

        <h1 class="question-title">
          ${question.question}
        </h1>

        <p class="question-subtext">
          ${question.subtext}
        </p>

        ${limitHint}

        <div
          class="options-grid"
          data-question-id="${question.id}"
          data-multi="${isMulti}"
          data-max="${question.maxSelect || ""}">

          ${optionsHTML}

        </div>

      </div>
    `;
  }


  function buildCompletionHTML() {

    return `
      <div class="question-panel completion-panel">

        <span
          class="completion-emoji"
          aria-hidden="true">
          🎉
        </span>

        <h1 class="completion-title">
          You're all set!
        </h1>

        <p class="completion-text">
          We've got what we need to start building your personalized career path.
        </p>

        <div class="completion-buttons">

          <button
            type="button"
            class="btn btn-dashboard"
            id="dashboardBtn">
            Go to Dashboard →
          </button>

          <button
            type="button"
            class="btn btn-review"
            id="reviewBtn">
            Review / Edit responses
          </button>

        </div>

      </div>
    `;
  }


  function renderQuestionView(direction) {

    const doRender = () => {

      if (state.completed) {

        el.questionViewport.innerHTML =
          buildCompletionHTML();

        el.navControls.style.display = "none";

        bindCompletionEvents();

      } else {

        el.navControls.style.display = "flex";

        const stage =
          STAGES[state.stageIndex];

        const question =
          stage.questions[state.questionIndex];

        el.questionViewport.innerHTML =
          buildQuestionPanelHTML(
            stage,
            question,
            state.questionIndex,
            stage.questions.length
          );

        bindOptionEvents();
      }


      updateNavButtons();


      const panel =
        el.questionViewport.querySelector(
          ".question-panel"
        );


      if (direction && panel) {

        panel.classList.add(
          direction === "forward"
            ? "enter-from-right"
            : "enter-from-left"
        );

        void panel.offsetWidth;

        requestAnimationFrame(() => {

          panel.classList.remove(
            "enter-from-right",
            "enter-from-left"
          );

        });
      }
    };


    if (!direction) {

      doRender();

      return;
    }


    const currentPanel =
      el.questionViewport.querySelector(
        ".question-panel"
      );


    if (!currentPanel) {

      doRender();

      return;
    }


    state.isAnimating = true;


    currentPanel.classList.add(
      direction === "forward"
        ? "exit-left"
        : "exit-right"
    );


    window.setTimeout(() => {

      doRender();

      state.isAnimating = false;

    }, 380);
  }


  /* ---------------------------------------------------------
     9. NAVIGATION
     --------------------------------------------------------- */

  function updateNavButtons() {

    const isFirstQuestion =
      state.stageIndex === 0 &&
      state.questionIndex === 0;


    el.backBtn.toggleAttribute(
      "hidden",
      isFirstQuestion &&
      !state.completed &&
      !state.reviewMode
    );


    el.backBtn.disabled =
      isFirstQuestion;


    if (state.completed) return;


    const stage =
      STAGES[state.stageIndex];

    const question =
      stage.questions[state.questionIndex];


    const answered =
      isAnswered(question);


    el.continueBtn.disabled =
      !answered;


    const isVeryLast =
      state.stageIndex === STAGES.length - 1 &&
      state.questionIndex === stage.questions.length - 1;


    el.continueLabel.textContent =
      isVeryLast
        ? "Finish"
        : "Continue";
  }


  /* ---------------------------------------------------------
     10. OPTION SELECTION
     --------------------------------------------------------- */

  function bindOptionEvents() {

    const grid =
      el.questionViewport.querySelector(
        ".options-grid"
      );


    if (!grid) return;


    const questionId =
      grid.dataset.questionId;


    const isMulti =
      grid.dataset.multi === "true";


    const maxSelect =
      parseInt(grid.dataset.max, 10) || null;


    grid
      .querySelectorAll(".option-card")
      .forEach((card) => {

        card.addEventListener(
          "click",
          () => {

            selectOption(
              questionId,
              card.dataset.value,
              isMulti,
              maxSelect
            );

          }
        );

      });
  }


  function findQuestionById(id) {

    for (const stage of STAGES) {

      for (const q of stage.questions) {

        if (q.id === id) {
          return q;
        }

      }
    }

    return null;
  }


  function selectOption(
    questionId,
    value,
    isMulti,
    maxSelect
  ) {

    const question =
      findQuestionById(questionId);


    if (!question) return;


    /*
      Because Q3 options are role-dependent,
      we resolve the CURRENT options here.
    */
    const options =
      question.options || [];


    const optionMeta =
      options.find(
        (o) => o.value === value
      );


    if (!isMulti) {

      /*
        If Q1 changes role, clear Q3's old
        role-specific selections.
      */
      if (questionId === "currentRole") {

        const previousRole =
          state.answers.currentRole;

        state.answers[questionId] =
          value;


        if (
          previousRole &&
          previousRole !== value
        ) {
          delete state.answers.tools;
        }

      } else {

        state.answers[questionId] =
          value;
      }

    } else {

      let current =
        Array.isArray(
          state.answers[questionId]
        )
          ? state.answers[questionId].slice()
          : [];


      if (
        optionMeta &&
        optionMeta.exclusive
      ) {

        current =
          current.includes(value)
            ? []
            : [value];

      } else {

        /*
          Remove "none" if another option
          is selected.
        */
        current =
          current.filter((v) => {

            const meta =
              options.find(
                (o) => o.value === v
              );

            return !(
              meta &&
              meta.exclusive
            );
          });


        if (current.includes(value)) {

          current =
            current.filter(
              (v) => v !== value
            );

        } else {

          if (
            maxSelect &&
            current.length >= maxSelect
          ) {

            showToast(
              `You can select up to ${maxSelect} options for this question.`
            );

            return;
          }


          current.push(value);
        }
      }


      state.answers[questionId] =
        current;
    }


    renderQuestionView(null);

    renderProgressBar();
  }


  /* ---------------------------------------------------------
     11. NAVIGATION
     --------------------------------------------------------- */

  function goNext() {

    if (state.isAnimating) return;


    const stage =
      STAGES[state.stageIndex];


    const question =
      stage.questions[state.questionIndex];


    if (!isAnswered(question)) {
      return;
    }


    const isLastQuestionInStage =
      state.questionIndex ===
      stage.questions.length - 1;


    const isLastStage =
      state.stageIndex ===
      STAGES.length - 1;


    if (
      isLastQuestionInStage &&
      isLastStage
    ) {

      completeOnboarding();

      return;
    }


    if (isLastQuestionInStage) {

      state.stageIndex += 1;

      state.questionIndex = 0;

    } else {

      state.questionIndex += 1;
    }


    renderAll("forward");
  }


  function goBack() {

    if (state.isAnimating) return;


    if (state.completed) {
      return;
    }


    const isFirstQuestionInStage =
      state.questionIndex === 0;


    const isFirstStage =
      state.stageIndex === 0;


    if (
      isFirstQuestionInStage &&
      isFirstStage
    ) {
      return;
    }


    if (isFirstQuestionInStage) {

      state.stageIndex -= 1;

      state.questionIndex =
        STAGES[state.stageIndex]
          .questions.length - 1;

    } else {

      state.questionIndex -= 1;
    }


    renderAll("backward");
  }


  function completeOnboarding() {

    state.completed = true;

    state.reviewMode = false;

    renderAll("forward");

    showToast(
      "Onboarding complete — nice work!"
    );
  }


  /* ---------------------------------------------------------
     12. COMPLETION EVENTS
     --------------------------------------------------------- */

  function bindCompletionEvents() {

    const dashboardBtn =
      document.getElementById(
        "dashboardBtn"
      );


    const reviewBtn =
      document.getElementById(
        "reviewBtn"
      );


    if (dashboardBtn) {

      dashboardBtn.addEventListener(
        "click",
        () => {

          showToast(
            "Heading to your dashboard…"
          );

        }
      );
    }


    if (reviewBtn) {

      reviewBtn.addEventListener(
        "click",
        () => {

          state.completed = false;

          state.reviewMode = true;

          state.stageIndex = 0;

          state.questionIndex = 0;

          renderAll("backward");

        }
      );
    }
  }


  /* ---------------------------------------------------------
     13. TOAST
     --------------------------------------------------------- */

  let toastTimer = null;


  function showToast(message) {

    el.toast.textContent =
      message;


    el.toast.classList.add(
      "visible"
    );


    window.clearTimeout(
      toastTimer
    );


    toastTimer =
      window.setTimeout(
        () => {

          el.toast.classList.remove(
            "visible"
          );

        },
        2400
      );
  }


  /* ---------------------------------------------------------
     14. MASTER RENDER
     --------------------------------------------------------- */

  function renderAll(direction) {

    renderJourney();

    renderMilestones();

    renderProgressBar();

    renderQuestionView(
      direction || null
    );
  }


  /* ---------------------------------------------------------
     15. EVENT WIRING
     --------------------------------------------------------- */

  el.continueBtn.addEventListener(
    "click",
    goNext
  );


  el.backBtn.addEventListener(
    "click",
    goBack
  );


  /* ---------------------------------------------------------
     16. INIT
     --------------------------------------------------------- */

  renderAll(null);

})();