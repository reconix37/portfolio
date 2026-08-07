# AGENTS.md — DANIIL OS (portfolio)

Персональный сайт Даниила Верховского (AI/ML engineer). Концепция: сайт играет роль персональной ОС «DANIIL OS» — терминальный вход, окна-секции, маскот-агент, системные метаданные (версия, локальное время). Вайб: нео-брутализм/old-web (референс: mcp.deploychan.webcam — KISA; poolsuite.net — сайт-роль).

## Стек
Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + React Bits (reactbits.dev, точечно). Токены уже настроены в `src/index.css` (палитра из DESIGN.md: крем #F4EFE6, графит #1F1D1A, терракот #C45C4A, жёлтый #E0A458, зелёный #5C7A5C; hard shadows 4px 4px 0; radius = 0). Шрифты: Syne (заголовки), Space Mono (всё остальное). НЕ менять токены без согласования.

shadcn компоненты добавлять через `npx shadcn@latest add <name>` — они лягут в `src/components/ui/`. React Bits — только выборочно (3-5 фишек, не всё подряд): typewriter/текст-эффекты для hero, шейдер-фон, magnetic/tilt для окон, cursor effects. Бездумный набор компонентов React Bits = AI-слоп, это запрещено.

## Железные правила (нарушение = переделка)

1. **БЕЗ AI-слопа.** Запрещено: градиенты (особенно сине-фиолетовые), glassmorphism, карточки-тайлы (иконка+заголовок+текст ×3), accent-полоски на карточках, иконки в кружках над заголовками, всё по центру без композиции, Inter/system-ui, эмодзи в UI (только inline SVG с fill=currentColor).
2. **Только реальные метрики.** HabitForge: 111+ тестов, 68 pg-миграций RLS, 12 edge functions, 95%+ parse success. AI Chat: 44 персоны, 3 тарифа, 2 бесплатные локальные модели. SLE Terminal: 18K+ LOC, 11 REST-роутеров, 5+ лет M5-данных. Выдумывать цифры нельзя.
3. **Тексты прямые, без воды.** Никаких «passionate», «crafting experiences», «seamless», «unleash». Факты, короткие предложения.
4. **Маскот** — пиксельный кот-робот (сгенерирован через ChatGPT, PNG-спрайты в `public/mascot/`): `mascot-idle.png`, `mascot-happy.png`, `mascot-surprised.png`, `mascot-skeptical.png` (+ `mascot-spritesheet.png` — 2×2 сетка). Компонент `src/components/Mascot.tsx` — проп `mood: 'idle'|'happy'|'surprised'|'skeptical'`, кроссфейд при смене, параллакс за курсором. Реакции: hover проекта → смена эмоции. НЕ заменять на картинку-другой-формат без согласования.
5. **Доступность:** focus-состояния, prefers-reduced-motion, семантический HTML, кликабельные зоны ≥44px.
6. Один PR/коммит = одна логическая единица. Проверяй `npm run build` перед коммитом.

## Структура секций (порядок на странице)

```
sysbar (sticky)      — DANIIL OS v1.0 · часы · переключатель темы
hero                 — заголовок DANIIL VERKHOVSKYI. (outline+сплошной) + маскот + терминал
band                 — marquee-лента со стеком
01 PROJECTS          — HabitForge, AI Chat Platform, SLE Terminal, MSc Thesis (окна)
02 STACK             — категории: Gen AI/LLM, ML/Data, Backend, Frontend, Quality/Ops
03 EDUCATION         — Ing. (in progress, thesis RAG+guardrails), Bc., языки (UA/RU/SK/EN)
04 CONTACT           — email, GitHub, LinkedIn, Telegram
footer (sysbar)      — v1.0 · PREŠOV · время · OPEN TO WORK
```

## Фишки (интерактив)

- Терминал в hero: печатающийся `$ whoami` → ответ → `$ ./greet.sh` → ротация приветствий **Ahoj [SK] / Привіт [UA] / Привет [RU] / Hello [EN]** (4 языка — фишка Дани)
- Маскот следит за курсором
- Окна-секции с drag&drop на десктопе (pointer: fine)
- Счётчики метрик анимируются при появлении (IntersectionObserver)
- Тёмная/светлая тема (localStorage, class .dark)
- Scanline/grain поверх, кастомный курсор (терминальный блок)
- Scroll-reveal секций

## Референсы (смотреть, не копировать)

- mcp.deploychan.webcam — KISA: крем+графит+терракот, ретро-окна, маскот, вайб
- poolsuite.net — сайт-роль, системная эстетика
- lynnandtonic.com — версия сайта «v.XIX» как фича
- dennissnellenberg.com — приветствия на языках, VERSION/LOCAL TIME в футере

Прототип v1 (чистый HTML): `reference/prototype-v1.html` — контент и вайб оттуда, реализация на React.
