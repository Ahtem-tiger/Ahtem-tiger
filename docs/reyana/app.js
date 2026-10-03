const app = document.getElementById("app");

const slides = [
  { img: "photos/p1.jpg", text: "Даже когда ты просто дурачишься на солнце, рядом хочется остаться." },
  { img: "photos/p2.jpg", text: "Ты умеешь стоять так, будто весь вечер собрался только ради тебя." },
  { img: "photos/p3.jpg", text: "С тобой даже закат становится жестом — лёгким и своим." },
  { img: "photos/p4.jpg", text: "В профиль ты ещё честнее. И от этого ещё красивее." },
  { img: "photos/p5.jpg", text: "Если время и правда можно ускорить, то только ради того, чтобы снова быть рядом с тобой." },
];

const CLOCK = `
  <div class="machine">
    <svg class="clock" id="clock" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="face" cx="50%" cy="40%" r="60%">
          <stop offset="0" stop-color="#3a2438"/>
          <stop offset="1" stop-color="#1a1018"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="#f0c36a" stroke-width="3"/>
      <circle cx="100" cy="100" r="80" fill="url(#face)" stroke="rgba(240,195,106,.35)"/>
      <g fill="#f0c36a">
        <rect x="98" y="24" width="4" height="14" rx="1"/>
        <rect x="98" y="162" width="4" height="14" rx="1"/>
        <rect x="24" y="98" width="14" height="4" rx="1"/>
        <rect x="162" y="98" width="14" height="4" rx="1"/>
      </g>
      <g class="hand hour">
        <line x1="100" y1="100" x2="100" y2="54" stroke="#ffd789" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g class="hand minute">
        <line x1="100" y1="100" x2="100" y2="38" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
      </g>
      <circle cx="100" cy="100" r="6" fill="#f0c36a"/>
    </svg>
  </div>`;

const ticks = ["день", "неделя", "ещё немного", "почти", "ещё ближе", "достаточно"];

function show(html) {
  return new Promise((resolve) => {
    const prev = app.querySelector(".screen");
    const draw = () => {
      app.innerHTML = `<section class="screen">${html}</section>`;
      resolve();
    };
    if (!prev) {
      draw();
      return;
    }
    prev.classList.add("out");
    setTimeout(draw, 240);
  });
}

function onClick(id, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", fn);
}

async function intro() {
  await show(`
    <p class="kicker">личное сообщение</p>
    <h1>Реяна</h1>
    <p class="lead">Я собрал для тебя машину времени,<br/>чтобы ускорить время.</p>
    <button class="btn main" type="button" id="go">Подойти ближе</button>
  `);
  onClick("go", machine);
}

async function machine() {
  await show(`
    ${CLOCK}
    <h2>Машина времени</h2>
    <p class="lead">Нажми кнопку — и время начнёт бежать быстрее.</p>
    <p class="fly" id="fly"></p>
    <div class="hold-wrap">
      <button class="btn hold" type="button" id="boost">Ускорить время</button>
      <div class="bar"><i id="bar"></i></div>
    </div>
  `);

  const boost = document.getElementById("boost");
  const bar = document.getElementById("bar");
  const fly = document.getElementById("fly");
  const clock = document.getElementById("clock");
  let running = false;
  let value = 0;
  let frame = 0;

  const tick = () => {
    if (!running) return;
    value = Math.min(100, value + 1.15);
    bar.style.width = `${value}%`;
    fly.textContent = ticks[Math.min(ticks.length - 1, Math.floor(value / 17))];
    if (value >= 100) {
      enough();
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  boost.addEventListener("click", () => {
    if (running) return;
    running = true;
    boost.disabled = true;
    boost.textContent = "Ускоряю...";
    clock.classList.add("fast");
    frame = requestAnimationFrame(tick);
  });
}

async function enough() {
  await show(`
    <p class="kicker">готово</p>
    <h1>Достаточно</h1>
    <p class="lead">Время ускорилось. Теперь можно сказать то, для чего я это собрал.</p>
    <button class="btn main" type="button" id="go">Дальше</button>
  `);
  onClick("go", () => photos(0));
}

async function photos(i) {
  const last = i === slides.length - 1;
  const slide = slides[i];
  await show(`
    <img class="shot" src="${slide.img}" alt="Реяна"/>
    <p class="letter">${slide.text}</p>
    <div class="dots">${slides.map((_, n) => `<b class="${n === i ? "on" : ""}"></b>`).join("")}</div>
    <button class="btn main" type="button" id="go">${last ? "Ещё раз с начала" : "Дальше"}</button>
  `);
  onClick("go", last ? intro : () => photos(i + 1));
}

const start = new URLSearchParams(location.search).get("s");
if (start === "machine") machine();
else if (start === "enough") enough();
else if (start === "photos") photos(0);
else intro();
