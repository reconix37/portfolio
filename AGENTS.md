# AGENTS.md — DANIIL OS (portfolio)

Персональный сайт Даниила Верховского (AI/ML engineer). Концепция: сайт играет роль персональной ОС «DANIIL OS» — терминальный вход, окна-секции, маскот-агент, системные метаданные (версия, локальное время). Вайб: нео-брутализм/old-web (референс: mcp.deploychan.webcam — KISA; poolsuite.net — сайт-роль).

## Стек
Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + React Bits (reactbits.dev, точечно). Токены уже настроены в `src/index.css` (палитра из DESIGN.md: крем #F4EFE6, графит #1F1D1A, терракот #C45C4A, жёлтый #E0A458, зелёный #5C7A5C; hard shadows 4px 4px 0; radius = 0). Шрифты: Syne (заголовки), Space Mono (всё остальное). НЕ менять токены без согласования.

shadcn компоненты добавлять через `npx shadcn@latest add <name>` — они лягут в `src/components/ui/`. React Bits — только выборочно (3-5 фишек, не всё подряд): typewriter/текст-эффекты для hero, шейдер-фон, magnetic/tilt для окон, cursor effects. Бездумный набор компонентов React Bits = AI-слоп, это запрещено.

## Железные правила (нарушение = переделка)

1. **БЕЗ AI-слопа.** Запрещено: градиенты (особенно сине-фиолетовые), glassmorphism, карточки-тайлы (иконка+заголовок+текст ×3), accent-полоски на карточках, иконки в кружках над заголовками, всё по центру без композиции, Inter/system-ui, эмодзи в UI (только inline SVG с fill=currentColor).
2. **Только реальные метрики.** HabitForge: 111+ тестов, 68 pg-миграций RLS, 12 edge functions, 95%+ parse success. AI Chat: 44 персоны, 3 тарифа, 2 бесплатные локальные модели. SLE Terminal: 18K+ LOC, 11 REST-роутеров, 5+ лет M5-данных. Выдумывать цифры нельзя.
3. **Тексты прямые, без воды.** Никаких «passionate», «crafting experiences», «seamless», «unleash». Факты, короткие предложения.
4. **Маскот** — аниме-тян инженер (PNG-спрайты в `public/mascot/`: `mascot-idle.png`, `mascot-happy.png`, `mascot-surprised.png`, `mascot-skeptical.png`, все 950×1000). Компонент `src/components/hero/Mascot.tsx` — проп `mood: 'idle'|'happy'|'surprised'|'skeptical'`, кроссфейд при смене, параллакс за курсором. Компонент абстрактный — менять только если поменяется API. Картинки НЕ менять (это финальные). Оживление маскота (анимации, реакции) — см. CURRENT TASK п.6, делается кодом, не картинками.
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

## ⚡ CURRENT TASK — делай это СЕЙЧАС, в этом порядке

Разбор KISA (mcp.deploychan.webcam) показал, почему он «живее» нашего сайта. Реализуй следующие апгрейды. Каждый — отдельный коммит с проверкой `npm run build`.

### 1. Интерактивный терминал-шелл (приоритет №1)
Сейчас терминал в hero только печатает. Сделай его **реально интерактивным**: пользователь вводит команды, терминал отвечает.
- Поддерживаемые команды: `help`, `whoami`, `projects`, `contact`, `stack`, `theme`, `clear`, `sudo hire` (пасхалка — «nice try, send email instead»), `cat secret.txt` (пасхалка — ASCII-арт кота)
- `help` — список всех команд
- `projects` — вывести 4 проекта одной строкой каждый: `[01] HabitForge — AI habit tracker`
- `contact` — email + github
- Неизвестная команда: `command not found: <cmd>. try 'help'`
- Ввод через реальный input в терминале (не prompt()), история через ArrowUp/ArrowDown
- Фокус: клик по терминалу → фокус в input, мигающий курсор
- Пасхалки — в том же стиле, сухо, без эмодзи

### 2. Повёрнутые вертикальные лейблы секций
Как `DEPLOY-TAN` на 90° у KISA: лейблы секций (`01 — PROJECTS`, `02 — STACK`, `03 — EDUCATION`, `04 — CONTACT`) — вертикально, `writing-mode: vertical-rl`, слева от каждой секции, моноширинный, маленький, muted. На мобиле — скрыть.

### 3. Хайлайт-плашки слов в hero
В заголовке hero слова **AI/ML** и **ENGINEER** — сплошная терракотовая плашка (`bg-accent text-[var(--bg)]`) прямо в строке, как `AGENT` и `KISA'S` у KISA. Прямоугольные блоки, без скруглений, без подчёркиваний.

### 4. Бейджи-мета у секций
Как `~30 sec` у KISA: у заголовков секций маленький bordered-бейдж с метаданными:
- PROJECTS → `// 4 shipped`
- STACK → `// loaded`
- EDUCATION → `// in progress`
- CONTACT → `// 24h response`
Моноширинный, 11px, uppercase, border 2px, без фона (или surface).

### 5. Заголовки в системной метафоре
Сменить заголовки секций на OS-вайб (тексты прямые, без воды, но с характером):
- `What I've built` → `SHIPPED MODULES` (или оставить как есть, если не уверен — спросить в PR-описании)
- `Toolkit //` → `LOADED KERNEL`
- `School of hard knocks` → `TRAINING HISTORY`
- `Let's talk` → `ESTABLISH CONNECTION`
Подзаголовки-описания сохранить (они хорошие).

### 6. Оживить маскота (ПРИОРИТЕТ — Даня хочет именно это)
Маскот УЖЕ на месте: аниме-тян инженер, 4 спрайта в `public/mascot/` (`mascot-idle.png`, `mascot-happy.png`, `mascot-surprised.png`, `mascot-skeptical.png`, все 950×1000, одна поза, меняется только лицо). Компонент `hero/Mascot.tsx` — mood → картинка, кроссфейд, параллакс за курсором. Не менять картинки и не менять API компонента. НО маскот сейчас статично стоит — надо оживить (Кодом, через CSS/JS, без новых картинок):

- **Idle-анимация**: лёгкое покачивание/«дыхание» (CSS keyframes, transform translateY/rotate на 1-2px, медленно, ~3-4s loop)
- **Моргание**: периодически (каждые 3-5 сек) на 150-200ms переключать на happy-спрайт (там глаза закрыты в улыбке — это выглядит как моргание), затем обратно
- **Реакция на клик по маскоту**: короткий прыжок/тряска + смена на surprised на 400ms
- **Реакция на скролл**: скролл вниз → skeptical на ~600ms, резкий скролл вверх → surprised
- **FloatingMascot** (угол при скролле) — тоже должен иметь idle-покачивание
- Всё через CSS animations + небольшой JS, без библиотек. Учесть `prefers-reduced-motion` (отключать анимации)

Плюс: сцена вокруг маскота в hero (как у KISA — артефакты вокруг деплой-тян): 2-3 мини-элемента рядом — маленькие окошки-стикеры с `HABITFORGE`, `RAG`, `EVALS` (brutalist-стиль, border 2px, hard shadow, мелкий моноширинный текст). Это добавит «мир» вокруг персонажа.

### 7. Фиксинг-минор
- Проверить, что drag&drop окон работает на десктопе (пункт из плана, мог не реализоваться)
- Scroll-прогресс: тонкая полоска-загрузка сверху (2px, accent, фиксированная, по скроллу)

## После завершения
Запушить всё в main. Обновить README если нужно. Каждый пункт — отдельный коммит с осмысленным сообщением. Не делать ничего сверх списка.

## Фишки (интерактив) — уже реализовано

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
