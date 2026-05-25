const siteContent = {
  navigation: ["Главная", "Тесты", "Как это работает", "Отзывы", "О нас"],
  heroBadges: [
    { icon: "psi", title: "Психология от Александра" },
    { icon: "date", title: "Цифровой анализ от Анны" },
    { icon: "steps", title: "Практические шаги" },
    { icon: "heart", title: "Личный разбор ситуации" },
  ],
  tests: [
    {
      title: "Он стал холоднее и отдалился?",
      text: "Если стало меньше внимания, тепла и общения, а вы всё чаще думаете: 'Что я сделала не так?'",
      image: "linear-gradient(145deg, rgba(255, 250, 241, 0.94), rgba(219, 185, 124, 0.24)), url('assets/alexander-anna-experts.png')",
    },
    {
      title: "Вы устали тянуть отношения одна?",
      text: "Если вы стараетесь, объясняете, спасаете, а внутри всё больше усталости, обиды и одиночества.",
      image: "linear-gradient(145deg, rgba(255, 250, 241, 0.92), rgba(185, 136, 76, 0.2)), url('assets/alexander-anna-experts.png')",
    },
    {
      title: "Почему вас тянет к тем, кто не выбирает вас до конца?",
      text: "Если мужчина то приближается, то отдаляется, а вы всё сильнее привязываетесь и ждёте ясности.",
      image: "linear-gradient(145deg, rgba(255, 250, 241, 0.93), rgba(203, 166, 101, 0.24)), url('assets/alexander-anna-experts.png')",
    },
  ],
  benefits: [
    "Персональный разбор вашей ситуации",
    "Понимание сценария, который повторяется в отношениях",
    "Практические рекомендации от Александра и Анны",
    "Доступ к короткому бесплатному маршруту в личном кабинете",
    "Возможность записаться на диагностику отношений",
  ],
  steps: [
    {
      title: "Проходите короткий тест",
      text: "Отвечаете на несколько вопросов о вашей ситуации.",
    },
    {
      title: "Получаете первый персональный разбор",
      text: "Система показывает, какой сценарий сейчас влияет на отношения.",
    },
    {
      title: "Открывается личный кабинет",
      text: "Там вас ждут короткие видео и задания, которые помогают глубже понять себя и отношения.",
    },
    {
      title: "Записываетесь на диагностику",
      text: "На встрече Александр и Анна разбирают уже вашу конкретную ситуацию.",
    },
  ],
  experts: [
    {
      name: "Александр",
      role: "Семейный психолог. Помогает увидеть эмоциональные сценарии, которые разрушают близость, и вернуть спокойный диалог в отношениях.",
    },
    {
      name: "Анна",
      role: "Специалист по цифровому анализу личности. Помогает увидеть сильные стороны, внутренние конфликты и особенности поведения через дату рождения.",
    },
    {
      name: "Вместе",
      role: "Соединяем психологию и цифровой анализ, чтобы человек увидел не только проблему, но и понятный путь выхода.",
    },
  ],
  testimonials: [
    {
      text: "Я пришла с мыслью, что он просто разлюбил. А на разборе увидела, что годами жила в тревоге и сама всё время пыталась заслужить тепло.",
      name: "Марина, 34 года",
    },
    {
      text: "После теста я впервые поняла, почему меня тянет к мужчинам, которые дают надежду, но не дают стабильности.",
      name: "Ольга, 41 год",
    },
    {
      text: "Было очень бережно. Без обвинений. Но при этом Александр и Анна очень точно показали, где я сама теряю опору.",
      name: "Екатерина, 37 лет",
    },
  ],
  quizQuestions: [
    "Как часто вы чувствуете, что эмоционально остаетесь в отношениях одна?",
    "Что обычно происходит, когда вы пытаетесь поговорить о близости?",
    "Насколько часто вы начинаете сомневаться в себе после его отстранения?",
    "Есть ли ощущение, что вы вкладываетесь больше, чем получаете?",
  ],
  cabinetRoute: [
    "Видео: почему тревога усиливает дистанцию",
    "Задание: где я теряю опору в отношениях",
    "Видео: как говорить без давления и контроля",
    "Диагностика: разбор вашей ситуации с Александром и Анной",
  ],
};

const iconMap = {
  psi: '<path d="M12 4c-2.8 0-5 2.2-5 5 0 2.5 1.8 4.5 4.2 4.9V20h1.6v-6.1A5 5 0 0 0 12 4Z"/><path d="M12 4c2.8 0 5 2.2 5 5 0 2.1-1.3 3.9-3.1 4.6"/><path d="M8 20h8"/>',
  date: '<path d="M7 3v4M17 3v4M4 8h16"/><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01"/>',
  steps: '<path d="M5 18c4-7 10 1 14-8"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="10" r="2"/><path d="M10 14h.01M14 13h.01"/>',
  heart: '<path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1Z"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  quote: '<path d="M9 7H5v5h4v5H4v-5c0-3.3 1.7-5 5-5ZM20 7h-4v5h4v5h-5v-5c0-3.3 1.7-5 5-5Z"/>',
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${iconMap[name]}</svg>`;
}

function Header() {
  return `
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Александр и Анна">
        <span class="brand-mark">
          <img src="assets/alexander-anna-logo.png" alt="">
        </span>
        <span>
          <strong>Александр и Анна</strong>
          <small>психология + цифровой анализ</small>
        </span>
      </a>
      <nav class="main-nav" aria-label="Навигация">
        ${siteContent.navigation.map((item) => `<a href="#${navTarget(item)}">${item}</a>`).join("")}
      </nav>
      <a class="cabinet-button" href="#final">Личный кабинет</a>
    </header>
  `;
}

function Hero() {
  return `
    <section id="top" class="hero section-grid">
      <div class="hero-copy">
        <p class="eyebrow">Бесплатный первый разбор отношений</p>
        <h1>
          <span>Он рядом,</span>
          <span>но вы всё чаще</span>
          <span class="accent">чувствуете себя одной?</span>
        </h1>
        <p class="hero-lead">Пройдите короткий тест и узнайте, какой сценарий сейчас разрушает близость — и какие шаги помогут вернуть внимание, спокойствие и уверенность в себе.</p>
        <div class="hero-actions">
          <a class="primary-button" href="#tests">Пройти тест и получить разбор</a>
          <p>Бесплатно · Конфиденциально · 5–7 минут · Без регистрации на первом шаге</p>
        </div>
      </div>
      <div class="hero-visual" aria-label="Александр и Анна">
        <div class="portrait-ring"></div>
        <img src="assets/alexander-anna-experts.png" alt="Александр и Анна">
        <div class="portrait-caption">
          <strong>Александр и Анна</strong>
          <span>бережный взгляд на отношения с двух сторон</span>
        </div>
      </div>
      <div class="hero-badges">
        ${siteContent.heroBadges.map((badge) => `
          <article>
            <span class="line-icon">${icon(badge.icon)}</span>
            <strong>${badge.title}</strong>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function TrustNote() {
  return `
    <section class="trust-note">
      <span class="note-icon">${icon("shield")}</span>
      <div>
        <h2>Это не развлекательный тест</h2>
        <p>Он помогает увидеть повторяющийся сценарий: где вы теряете себя, почему мужчина отдаляется и что можно изменить без давления, контроля и унижения.</p>
      </div>
    </section>
  `;
}

function TestCards() {
  return `
    <section id="tests" class="section-block tests-section">
      <div class="section-heading">
        <p class="eyebrow">Точка входа</p>
        <h2>Выберите, что сейчас ближе к вашей ситуации</h2>
      </div>
      <div class="test-grid">
        ${siteContent.tests.map((test, index) => `
          <article class="test-card">
            <div class="test-image" style="background-image: ${test.image};"></div>
            <span class="test-number">0${index + 1}</span>
            <h3>${test.title}</h3>
            <p>${test.text}</p>
            <button class="secondary-button" type="button" data-start-test="${index}">Пройти тест</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function Benefits() {
  return `
    <section class="section-block benefits-section">
      <div class="section-heading">
        <p class="eyebrow">Первый результат</p>
        <h2>После теста вы получите</h2>
      </div>
      <div class="benefits-list">
        ${siteContent.benefits.map((benefit) => `
          <article>
            <span>${icon("check")}</span>
            <p>${benefit}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function HowItWorks() {
  return `
    <section id="how" class="section-block how-section">
      <div class="section-heading">
        <p class="eyebrow">Маршрут</p>
        <h2>Как это работает</h2>
      </div>
      <div class="steps-path">
        ${siteContent.steps.map((step, index) => `
          <article class="step-card">
            <span class="step-index">${index + 1}</span>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
            ${index < siteContent.steps.length - 1 ? `<span class="step-arrow">${icon("arrow")}</span>` : ""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function Experts() {
  return `
    <section id="about" class="section-block experts-section">
      <div class="section-heading">
        <p class="eyebrow">Доверие</p>
        <h2>Почему нам доверяют</h2>
      </div>
      <div class="experts-grid">
        ${siteContent.experts.map((expert) => `
          <article class="expert-card">
            <span>${expert.name.slice(0, 1)}</span>
            <h3>${expert.name}</h3>
            <p>${expert.role}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function Testimonials() {
  return `
    <section id="reviews" class="section-block testimonials-section">
      <div class="section-heading">
        <p class="eyebrow">Отзывы</p>
        <h2>Отзывы женщин, которым мы помогли</h2>
      </div>
      <div class="testimonial-grid">
        ${siteContent.testimonials.map((testimonial) => `
          <article class="testimonial-card">
            <span class="quote-icon">${icon("quote")}</span>
            <p>${testimonial.text}</p>
            <strong>${testimonial.name}</strong>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function FinalCTA() {
  return `
    <section id="final" class="final-cta">
      <div>
        <p class="eyebrow">Начните с первого честного шага</p>
        <h2>Хотите понять, что происходит именно в вашей ситуации?</h2>
        <p>Пройдите тест и получите первый персональный разбор. А если почувствуете, что хотите глубже — после теста сможете открыть личный кабинет и записаться на бесплатную диагностику с Александром и Анной.</p>
        <a class="primary-button" href="#tests">Начать с теста</a>
        <small>Бесплатно · Конфиденциально · 5–7 минут · Без регистрации на первом шаге</small>
      </div>
    </section>
  `;
}

function FunnelModal() {
  return `
    <div class="funnel-modal" data-funnel hidden>
      <section class="funnel-card" role="dialog" aria-modal="true" aria-labelledby="funnelTitle">
        <button class="modal-close" type="button" data-close-funnel aria-label="Закрыть">×</button>
        <div data-funnel-stage="quiz">
          <p class="eyebrow">Короткий тест</p>
          <h2 id="funnelTitle">Ответьте на несколько вопросов</h2>
          <p class="funnel-intro" data-funnel-subtitle></p>
          <div class="quiz-list">
            ${siteContent.quizQuestions.map((question, index) => `
              <fieldset>
                <legend>${index + 1}. ${question}</legend>
                <label><input type="radio" name="question-${index}" checked> Часто</label>
                <label><input type="radio" name="question-${index}"> Иногда</label>
                <label><input type="radio" name="question-${index}"> Почти никогда</label>
              </fieldset>
            `).join("")}
          </div>
          <button class="primary-button" type="button" data-show-result>Получить первый разбор</button>
          <small>Регистрация не нужна. Ответы используются только для первичного разбора.</small>
        </div>
        <div data-funnel-stage="result" hidden>
          <p class="eyebrow">Первый разбор</p>
          <h2>Сейчас главный сценарий похож на тревожное удержание близости</h2>
          <p class="funnel-intro">Вы много чувствуете, стараетесь сохранить контакт и можете брать на себя слишком много ответственности за настроение мужчины. Первый шаг — вернуть внутреннюю опору и увидеть, где забота превращается в напряжение.</p>
          <div class="result-panel">
            <strong>Что поможет уже сейчас</strong>
            <p>Не усиливать контроль, а мягко отделить свои чувства от его дистанции: что происходит со мной, что действительно делает партнёр, и какой разговор нужен без давления.</p>
          </div>
          <button class="primary-button" type="button" data-open-cabinet>Открыть личный кабинет</button>
          <small>В кабинете откроется короткий бесплатный маршрут и запись на диагностику.</small>
        </div>
        <div data-funnel-stage="cabinet" hidden>
          <p class="eyebrow">Личный кабинет</p>
          <h2>Ваш бесплатный маршрут открыт</h2>
          <div class="route-list">
            ${siteContent.cabinetRoute.map((item, index) => `
              <article>
                <span>${index + 1}</span>
                <p>${item}</p>
              </article>
            `).join("")}
          </div>
          <a class="primary-button" href="mailto:hello@example.com?subject=Диагностика отношений">Записаться на бесплатную диагностику</a>
          <small>На встрече Александр и Анна разбирают уже вашу конкретную ситуацию.</small>
        </div>
      </section>
    </div>
  `;
}

function navTarget(label) {
  const map = {
    "Главная": "top",
    "Тесты": "tests",
    "Как это работает": "how",
    "Отзывы": "reviews",
    "О нас": "about",
  };

  return map[label] || "top";
}

function App() {
  return `
    ${Header()}
    <main>
      ${Hero()}
      ${TrustNote()}
      ${TestCards()}
      ${Benefits()}
      ${HowItWorks()}
      ${Experts()}
      ${Testimonials()}
      ${FinalCTA()}
    </main>
    ${FunnelModal()}
  `;
}

document.querySelector("#app").innerHTML = App();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);
window.addEventListener("load", () => window.scrollTo(0, 0));

const funnel = document.querySelector("[data-funnel]");
const funnelSubtitle = document.querySelector("[data-funnel-subtitle]");
const stages = [...document.querySelectorAll("[data-funnel-stage]")];

function showStage(name) {
  stages.forEach((stage) => {
    stage.hidden = stage.dataset.funnelStage !== name;
  });
}

function openFunnel(testIndex) {
  const test = siteContent.tests[testIndex] || siteContent.tests[0];
  funnelSubtitle.textContent = test.title;
  showStage("quiz");
  funnel.hidden = false;
  document.body.classList.add("modal-open");
}

function closeFunnel() {
  funnel.hidden = true;
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-start-test]").forEach((button) => {
  button.addEventListener("click", () => openFunnel(Number(button.dataset.startTest)));
});

document.querySelector("[data-show-result]").addEventListener("click", () => showStage("result"));
document.querySelector("[data-open-cabinet]").addEventListener("click", () => showStage("cabinet"));
document.querySelector("[data-close-funnel]").addEventListener("click", closeFunnel);
funnel.addEventListener("click", (event) => {
  if (event.target === funnel) closeFunnel();
});
