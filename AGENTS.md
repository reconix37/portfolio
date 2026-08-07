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

## ⚡ CURRENT TASK v2 — ПОЛНЫЙ РЕФАКТОРИНГ: сайт = приложение с вкладками

Даня хочет уровень KISA (mcp.deploychan.webcam). KISA — это НЕ скролл-лендинг, а **приложение-окно**: весь сайт в рамке, контент переключается вкладками, страница не скроллится. Делаем то же самое. Это главная задача. Все старые пункты CURRENT TASK (терминал, лейблы, плашки, бейджи, стикеры) УЖЕ СДЕЛАНЫ — сохрани их, но адаптируй под новую структуру.

### Шаг 0. Общая архитектура

```
+-----------------------------------------------+
| sysbar (sticky): DANIIL OS v1.0 · часы · тема |
+-----------------------------------------------+
| [рамка-окно браузера: кнопки — · □ × слева]   |
| [табы: 01 WHOAMI | 02 PROJECTS | 03 STACK |   |
|        04 EDUCATION | 05 CONTACT | 06 RADIO ]  |
| +-------------------------------------------+  |
| | ПАНЕЛЬ выбранной вкладки (единственная,   |  |
| | без скролла страницы; внутренний скролл   |  |
| | панели, если контент не влезает)          |  |
| +-------------------------------------------+  |
| footer: v1.0 · PREŠOV · время · OPEN TO WORK  |
+-----------------------------------------------+
```

- Сайт больше НЕ скроллится по вертикали как лендинг: вся «страница» — это одно окно, табы переключают панели кликом (как у KISA: HOME/CONNECT/CATALOG/FAQ)
- `main` содержит: sysbar + окно-рамка (табы + активная панель) + footer
- Каждая панель — отдельный компонент: `src/components/tabs/Whoami.tsx`, `Projects.tsx`, `Stack.tsx`, `Education.tsx`, `Contact.tsx`, `Radio.tsx`
- Таб-бар — `src/components/TabBar.tsx`: кнопки-табы, активный — accent-фон (как у KISA), переключение через useState в App, без роутера
- Высота окна: панели контентятся в `min-h-[calc(100vh-...)]`, при переполнении — `overflow-y-auto` внутри панели
- Band (marquee-лента) — оставить внизу панели WHOAMI или над футером, решай сам
- FloatingMascot — оставить (плавает при скролле внутри панели)

### Шаг 1. Окно-рамка
Вокруг контента (после sysbar) — рамка-окно как у KISA: верхняя полоса с тремя декоративными кнопками (— □ ×, нефункциональные, в стиле ретро-окна, border-2), внутри — табы и панель. Панель — с внутренним бордером, чтобы читалось как «окно внутри окна».

### Шаг 2. Табы
6 табов: `01 — WHOAMI`, `02 — PROJECTS`, `03 — STACK`, `04 — EDUCATION`, `05 — CONTACT`, `06 — RADIO`. Стиль: моноширинный, uppercase, tracking, border-2, активный таб `bg-accent text-bg dark:text-[#121110]`, неактивные — прозрачные. На мобиле — табы скроллятся горизонтально (overflow-x-auto), панель одна.

### Шаг 3. Копирайтинг — тексты как у KISA (короткие, с характером, без воды)
Заменить существующие заголовки/описания на эти (точные тексты, НЕ переписывать своими словами):

**WHOAMI (панель 01):**
- Кинкер (верх): `// system online — ai/ml engineer · presov`
- Заголовок: `I BUILD AI PRODUCTS THAT SURVIVE PRODUCTION` — слова `AI PRODUCTS` и `SURVIVE PRODUCTION` — терракотовые плашки (bg-accent text-bg), остальное — обычный текст
- Подзаголовок: `Generative pipelines. Structured LLM output. Evals that catch regressions before users do.` (слова `Structured LLM output` — accent, как сейчас)
- Терминал (уже есть) — оставить, он в этой панели
- Под терминалом строка: `>> 4 products shipped · 0 slideware` (моноширинный, muted)

**PROJECTS (панель 02) — это каталог-таблица как CATALOG у KISA:**
- Заголовок: `SHIPPED MODULES` + бейдж `// 4 items`
- Подзаголовок: `// real products, real numbers — filter and sort`
- ВЕРХНЯЯ СТРОКА КАК У KISA: слева `TYPE:` кнопки-фильтры `ALL | MOBILE | AI | BACKEND | THESIS`; справа `SORT:` кнопки `RECOMMENDED | NEW | NAME`. Активные — accent-фон.
- НИЖЕ — ТАБЛИЦА (не карточки-в-карточках!): тёмная строка-заголовок, колонки: `NAME | STACK | METRICS | STATUS`. Строки:
  - `HabitForge | React Native · Supabase · Gemini | 111+ tests · 68 migrations · 12 edge fn | shipped`
  - `AI Chat Platform | FastAPI · PostgreSQL · Redis | 44 personas · 3 tiers · 2 local models | shipped`
  - `SLE Terminal | FastAPI · XGBoost · Next.js | 18K+ LOC · 11 routers · 5+ yr data | shipped`
  - `MSc Thesis — RAG | RAG · Guardrails · Loop Eng | in progress | 2027`
  - Каждая строка — hover: bg-surface-2, курсор pointer, маскот реагирует (onMouseEnter → mood из мапы)
  - Фильтры реально фильтруют таблицу (useState, массив фильтруется)
- Стиль таблицы: border-2, заголовок — bg-ink text-bg (тёмный), строки чередуются bg-transparent / bg-surface

**STACK (панель 03):**
- Заголовок: `LOADED KERNEL` + бейдж `// loaded`
- Подзаголовок: `// what i actually ship with`
- Категории-строки (как сейчас, но компактнее): `GEN AI / LLM:`, `ML / DATA:`, `BACKEND:`, `FRONTEND:`, `QUALITY / OPS:` — каждая строка: лейбл + теги-стек (моноширинный, через ·). Никаких карточек-в-карточках.

**EDUCATION (панель 04):**
- Заголовок: `TRAINING HISTORY` + бейдж `// in progress`
- Подзаголовок: `// fvt tuke · presov`
- Две записи (Ing. in progress + Bc.), компактно, строки с годами
- Языки: `LANGUAGES :: UA (native) · RU (native) · SK (B2) · EN (B2)` — строкой, не карточками

**CONTACT (панель 05):**
- Заголовок: `ESTABLISH CONNECTION` + бейдж `// 24h response`
- Строки-контакты: `EMAIL — verchovskyidania@gmail.com [copy]`, `GITHUB — github.com/reconix37 [copy]`, `LINKEDIN — daniil-verkhovskyi`, `TELEGRAM — @daniil_vk`
- `[copy]` — маленькая кнопка, копирует значение в буфер (navigator.clipboard), меняется на `copied!` на 1.5s

### Шаг 4. RADIO (панель 06) — винтажный плеер
Реальный плеер с WebAudio API (без внешних файлов, без библиотек):
- Синтез чиптюн/lo-fi лупов: 3-4 трека (например: `night-shift`, `deploy`, `coffee-loop`, `push-to-prod`) — квадратные/треугольные волны + noise, 110-120 BPM, 8-16 сек лупы
- UI: как ретро-плеер: `▶/⏸` кнопка, `next`, название трека, псевдо-эквилайзер (3-5 полосок, анимируются пока играет), `VOL` слайдер, треки в списке (клик — играет)
- Кнопки — brutalist: border-2, hard shadow, hover — сдвиг
- Стоп музыки при уходе с вкладки RADIO (или продолжить — решай, но при выключении таба — пауза, чтобы не фонить в фоне)
- Это фишка-«вау»: у KISA нет плеера, у нас будет

### Шаг 5. Повёрнутые тексты + плашки (уже частично есть — закрепить)
- Вертикальные лейблы секций ВНУТРИ панелей — оставить (уже сделаны)
- Кинкеры `// ...` над заголовками — уже есть, оставить
- Плашки слов в заголовке WHOAMI — см. Шаг 3 (сделать!)

### Шаг 6. Маскот-анимации (из прошлого CURRENT TASK, НЕ потерять)
Маскот УЖЕ на месте: аниме-тян, 4 спрайта в `public/mascot/` (950×1000, одна поза, меняется лицо). Компонент `hero/Mascot.tsx` — mood → картинка. НЕ менять картинки, НЕ менять API. Оживить кодом:
- **Idle-покачивание** («дыхание», CSS keyframes, translateY 1-2px, 3-4s loop)
- **Моргание**: каждые 3-5 сек на 150-200ms переключить на happy-спрайт (глаза закрыты — выглядит как моргание), обратно
- **Клик по маскоту** → прыжок + surprised на 400ms
- **Скролл** (внутри панели): вниз → skeptical на 600ms, резко вверх → surprised
- FloatingMascot — тоже с покачиванием
- `prefers-reduced-motion` — отключать анимации

### Шаг 7. Фиксинг
- `npm run build` после каждого шага
- Проверить тёмную тему для новых панелей/таблицы/плеера
- Убрать дубли: старые секции-компоненты (sections/Projects.tsx и т.д.), которые не влезают в новую структуру — удалить, заменить на tabs/
- Footer оставить

## После завершения
Запушить всё в main. Каждый шаг — отдельный коммит с осмысленным сообщением. Не делать ничего сверх списка. Обновить README если нужно.

## Фишки (интерактив) — уже реализовано (сохранить, адаптировать под вкладки)

- Терминал в hero (WHOAMI): печатающийся `$ whoami` → ротация приветствий **Ahoj [SK] / Привіт [UA] / Привет [RU] / Hello [EN]** + интерактивный ввод команд (help/projects/contact/theme/clear/sudo hire/cat secret.txt), история стрелками
- Маскот следит за курсором
- Счётчики метрик анимируются при появлении (IntersectionObserver)
- Тёмная/светлая тема (localStorage, class .dark)
- Scanline/grain поверх, кастомный курсор
- Scroll-reveal секций (внутри панелей)
- Drag&drop окон на десктопе (проверить, что не конфликтует с панелями)

## Референсы (смотреть, не копировать)

- mcp.deploychan.webcam — KISA: крем+графит+терракот, ретро-окна, маскот, вайб
- poolsuite.net — сайт-роль, системная эстетика
- lynnandtonic.com — версия сайта «v.XIX» как фича
- dennissnellenberg.com — приветствия на языках, VERSION/LOCAL TIME в футере

Прототип v1 (чистый HTML): `reference/prototype-v1.html` — контент и вайб оттуда, реализация на React.
