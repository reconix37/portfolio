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



## ✅ CURRENT TASK v2 — DONE (tabbed app)

Рефакторинг выполнен: сайт = приложение с вкладками (WHOAMI/PROJECTS/STACK/EDUCATION/CONTACT/RADIO), AppFrame, каталог-таблица, CHIPRADIO, маскот-анимации. Ниже — архив ТЗ.

## ⚡ CURRENT TASK v3 — ДЕЛАЙ ЭТО СЕЙЧАС (после чтения архива v2, если нужно)

Даня прислал два жёстких фидбека по текущему состоянию: (1) копирайт — не тот, нужен добрый/живой/на английском как у KISA; (2) радио играет синтез-«пиздец» — заменить на реальные mp3 (уже скачаны в `public/music/`). Выполни Шаги 8-10 из архива ниже, они актуальны. Короткая выжимка:

**Шаг 8 (копирайт):** весь текст — на английском, живой/самоироничный в вайбе KISA. Точные тексты — в архиве, Шаг 8.
**Шаг 9 (треки):** `chipRadio.tsx` — заменить WebAudio-осцилляторы на `<audio>` с реальными файлами из `public/music/` (7 mp3, Jamendo CC). Точный маппинг треков — в архиве, Шаг 9.
**Шаг 10:** проверка build + вкладки + радио + тёмная тема + FakeNews + маскот.

После каждого шага — `npm run build` + коммит. В конце — push в main.

## ⚡ CURRENT TASK v4 — ДЕЛАЙ ЭТО СЕЙЧАС (после v3)

Даня посмотрел сайт после v3 и сказал: Stack и Education — «нормисные», скучные таблицы, надо оживить. Выполни Шаги 11-12 ниже, каждый отдельным коммитом.

### Шаг 11. ОЖИВИТЬ STACK — «загрузка ядра» (boot-log)

Сейчас STACK (панель 03) — статичная таблица MODULE/STATUS/EXPORTS. Сделать живой, без библиотек:

- **Появление строк как boot-log**: при открытии вкладки STACK строки таблицы появляются последовательно с задержкой 120-180ms, каждая с `[OK]`-маркером в STATUS (как загрузка ОС). Итог: `[OK] gen.ai.llm — loaded` → пауза → `[OK] ml.data — loaded` → ...
- Реализация: `useState` + `useEffect` с `setTimeout` (или один `setInterval` + counter), строки рендерятся по мере counter'а. Появление — плавный fade/slide-up (opacity + translateY, CSS transition)
- При повторном открытии вкладки (переключение туда-сюда) — анимация НЕ перезапускается (мемоизировать: первый рендер только). Или перезапускается, но быстро (150ms на строку × 5 = 0.75s, терпимо) — решай сам, главное не раздражает
- `prefers-reduced-motion` — отключить анимацию, показать всё сразу
- Вёрстку/таблицу не менять — только добавить эффект появления



### Шаг 12. ОЖИВИТЬ EDUCATION — «компиляция» + уровни

Сейчас EDUCATION (панель 04) — статичная таблица PID/CMD/STATUS/UPTIME + языки. Сделать живой:

- **Progress-бар компиляции у thesis**: в строке `thesis.rag-guardrails` (STATUS: `COMPILING…`) добавить справа мини-прогресс-бар (width 60-70%, заполнение анимируется разово при открытии вкладки: 0 → ~68% за 1.2s, CSS transition). Текстовый лейбл `COMPILING… 68%`
- **Степени как уровни (геймификация)**: в CMD-колонке вместо plain-текста — лейблы уровней: `Bc. — UNLOCKED` (status EXITED 0, зелёный/ok), `Ing. — IN PROGRESS` (status RUNNING, accent), `Thesis — COMPILING` (status COMPILING…, жёлтый). Стиль: маленькие bordered-бейджи (как SectionBadge), моноширинный, uppercase
- Ховер на PID — тултип-самоирония: `PID 01 — 4 years of my life · CPU 100%` (только десктоп, pointer: fine)
- `prefers-reduced-motion` — без анимаций, статично
- Вёрстку таблицы не ломать

## CURRENT TASK v2 (архив) — ПОЛНЫЙ РЕФАКТОРИНГ: сайт = приложение с вкладками

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



### Шаг 8. ДОБРЫЙ КОПИРАЙТ — на АНГЛИЙСКОМ, абсурдный, в вайбе KISA ([deploychan.webcam](http://deploychan.webcam))

Сайт англоязычный — ВЕСЬ копирайт на английском. Вайб как у KISA: добрый, самоироничный, абсурдный, живой. ГЛАВНОЕ ПРАВИЛО: юмор НЕ привязан к стеку Дани — никаких evals/RAG/HabitForge/migrations/edge functions в шутках. У KISA заголовки — чистый абсурд про индустрию и жизнь («Спрос на хентай игры вырос на 665%», «Обнаружен новый вид приматов — вайбкодеры», «Британские ученые: у подписчиков Кисы половая жизнь активнее на 26%», «Gemini V4 pro научилась арифметике», «Налоговая в шоке: безработные платят $300/мес на AI подписки», «Ютуб-комментарии признаны самым нетоксичным местом»). Делаем так же.

**ПОРЯДОК РАБОТЫ (важно):** пройдись по ВСЕМ видимым текстам на сайте — не только по списку ниже. Список ниже — обязательный минимум; если видишь ещё сухой/пафосный текст где-то (модалки, тултипы, подписи, терминал, футер) — перепиши его в том же добром тоне. Три правила: (1) английский; (2) смешно, но в пределах разумного — это рабочее портфолио, никакого NSFW/пошлости; (3) шутки про индустрию/жизнь, не про стек Дани.

**WHOAMI (hero):**

- Кинкер: `// system online — ai/ml engineer · presov` (оставить)
- Заголовок: `ai/ml engineer, thesis-in-progress, and an honest… good guy.` (строчные, многоточие, самоирония — как «…хороший парень» у KISA, но своё)
- Подзаголовок: `I build things that work when it matters. Sometimes they even work when it doesn't.` (тепло, самоирония, БЕЗ упоминания стека)
- Строка под терминалом: `>> 4 products in production · 0 slideware` (факт, без юмора — это серьёзная строка)

**FAKE NEWS тикер** — абсурдные заголовки про IT-индустрию и жизнь (англ), НЕ про проекты Дани. ВАЖНО: это рабочее портфолио — никакого NSFW/пошлости/хентая в заголовках (у KISA есть, нам нельзя — сайт смотрят работодатели). Абсурд должен быть смешным, но безопасным. Взять за основу эти (можно варьировать, сохраняя тон):

- `Scientists baffled: new primate species discovered — vibe coders from Prešov`
- `OpenAI buys Dota 2, community asks why`
- `New Gemini model finally learns basic arithmetic`
- `Morrowind gets DLC in August 2026, fans cry tears of joy`
- `YouTube comments officially declared the least toxic place on the internet`
- `Vibe coders outnumber real coders, nobody notices the difference`
- `Statistics show: writing fake news uses 90% of brain resources`
- `Developer found sleeping under desk, code review passed anyway`
- `Coffee officially declared a required dependency for production`
- `LGTM approved 47 PRs in one minute, quality unchanged`
- `GitHub outage blamed on too many merge requests`
- `Bug survived 5 code reviews, promoted to feature`

**QUOTE.TXT** (цитата в hero): `«I write code not because I have to, but because it's fun. Texts — for the same reason.»` (это перевод вайба KISA-цитаты «Пишу код не потому что надо, а потому что кайфово»)

**Метрики в hero** (цифры НЕ менять, лейблы живо, без привязки к стеку):

- `4 SHIPPED MODULES` → `4 PRODUCTS IN PRODUCTION`
- `111+ TEST SUITES` → `111+ TESTS, ALL GREEN`
- `44 CHAT PERSONAS` → `44 CHAT PERSONAS`
- `18K+ LOC · SLE` → `18K+ LINES OF CODE`

**Футер**: `STATUS: OPEN TO WORK` → `STATUS: OPEN TO WORK · 24/7 ON THE JOB` (как «24/7 ВЕРЕН СВОЕМУ ДЕЛУ» у KISA); `© 2026 · built by hand` → `© 2026 · made with too much coffee` (НЕ «Claude Code» — Даня не им делал)

**ВСЕ ОСТАЛЬНЫЕ ПАНЕЛИ — тоже переписать (не только WHOAMI/тикер). OS-вайб сохранить, но добавить доброты/самоиронии в подзаголовки и описания:**

**PROJECTS (панель 02):**

- Заголовок: `SHIPPED MODULES` + бейдж `// 4 items` — ОСТАВИТЬ (OS-метафора уже ок)
- Подзаголовок: `// real products, real numbers — filter and sort` → `// four things that left the laptop and survived` (добро, самоирония)
- Колонки таблицы: `NAME | STACK | METRICS | STATUS` — оставить
- Блюрбы проектов (описание в деталях) — переписать тепло, НО с реальными цифрами и без воды:
  - HabitForge: `A habit coach that lives on your phone and nags nicely. 111+ tests, 68 migrations, 12 edge functions — the bar stays high.` (тепло, «nags nicely»)
  - AI Chat: `44 personas, 3 tiers, 2 local models that cost nothing to run. Pick a character, it'll talk back.` (живо, без канцелярита)
  - SLE Terminal: `A trading terminal that watched 5 years of M5 data and never blinked. 18K+ LOC of patience.` (тепло, «patience»)
  - Thesis: `RAG pipeline with guardrails that actually guard. Loop engineering because first drafts are for losers. 2027 — real work, not slideware.` (оставить как есть — уже хорошо)

**STACK (панель 03):**

- Заголовок: `LOADED KERNEL` + `// loaded` — оставить
- Подзаголовок: `// $ lsmod | grep daniil` → `// what's actually installed on this machine` (добрее)
- Категории (MODULE/STATUS/EXPORTS) — оставить, это таблица фактов

**EDUCATION (панель 04):**

- Заголовок: `TRAINING HISTORY` + `// in progress` — оставить
- Подзаголовок: `// $ ps aux | grep training` → `// formal training, still compiling` (самоирония: диплом «компилируется» до 2027)
- Детали строк (detail) — оставить факты, но смягчить: `Ing. thesis pipeline — not slideware` уже ок (оставить), остальные не трогать

**CONTACT (панель 05):**

- Заголовок: `ESTABLISH CONNECTION` + `// 24h response` — оставить
- Подзаголовок: `// $ netstat -an | grep LISTEN — click a row to connect` → `// channels are open — pick one, I actually reply` (добро)
- Строка preferred: `>> OPEN TELEGRAM "..." — preferred` — оставить

**QUOTE.TXT** (QuoteBlock, hero): `Ship evals before vibes. Structured output or it doesn't leave the laptop.` → `«I write code not because I have to, but because it's fun. Texts — for the same reason.»` (вайб KISA-цитаты, добро, без стека)

**MAN PAGE (ManModal, клавиша ?):**

- `NAME: daniil-os — personal portfolio as a desktop app` → `daniil-os — a portfolio pretending to be an OS. Everything here is real, except the window buttons.`
- `RADIO: CHIPRADIO under WHOAMI stats — closable. Chip + lo-fi loops via WebAudio (no files).` → `RADIO: lofi radio under WHOAMI — real tracks now (was: chiptune synth, god rest its soul).` (после Шага 9 треки реальные — обновить)
- `MASCOT: Follows cursor. Click = jump. Scroll panel = mood burst. Hover PROJECTS rows = react.` → `MASCOT: follows cursor, blinks, judges your code. Click her — she's been waiting.`
- Остальные секции (TABS/TERMINAL/HOTKEYS) — оставить, они технические

**CHANGELOG (клик по v1.0):** — заголовки версий оставить, но добавить добрые описания фич:

- `FAKE NEWS ticker · boot modal · mascot moods` → `FAKE NEWS ticker (nothing here is true, obviously) · boot modal · mascot moods`
- `PROJECTS catalog table with TYPE/SORT` → `PROJECTS catalog — filter, sort, poke at numbers`
- `RadioDock in WHOAMI flow (closable + lo-fi)` → `RadioDock — real lofi now, your ears can rest`
- Остальные (Tabbed shell, WHOAMI polaroid, Hand callouts) — оставить

**BOOT MODAL:**

- `[OK] cream/graphite/terracotta theme loaded` → `[OK] cream/graphite/terracotta theme loaded (as nature intended)`
- `[OK] chipradio daemon spawned` → после Шага 9: `[OK] radio daemon spawned — real tracks, no oscillators harmed`
- `[ READY ] daniil os v1.0 online_` → `[ READY ] daniil os v1.0 online — coffee in hand_` (добро)

**FS MAP (кнопка MAP):**

- `// click a path to cd` → `// click a path — it's a map, not a suggestion`
- `hero · polaroid · radio · terminal` — оставить (технично)
- `shipped modules catalog` → `shipped modules catalog (4, all real)`
- `lsmod · loaded kernel` → `lsmod · loaded kernel (no bloatware)`
- `training history` → `training history (still compiling)`
- `establish connection` → `establish connection (channels open)`



### Шаг 9. РЕАЛЬНЫЕ ТРЕКИ вместо синтеза (Даня: «то, что там — пиздец»)

Сейчас радио играет WebAudio-синтез (chipRadio.tsx — осцилляторы и мелодии-паттерны). Это звучит убого. В `public/music/` уже лежат 7 РЕАЛЬНЫХ mp3 (Jamendo, CC-лицензия — легально, бесплатно):

- `lofi-memories-children.mp3` (79s)
- `dark-lofi-vibes.mp3` (107s)
- `midnight-lofi-love.mp3` (99s)
- `happy-lofi.mp3` (140s)
- `background-lofi-lifestyle.mp3` (23s)
- `love-lofi-2.mp3` (171s)
- `hiphop-lofi-dance.mp3` (94s)

Переделать `chipRadio.tsx`: вместо осцилляторов — обычный `<audio>` с этими файлами:

- Треки в плеере переименовать в человеческие названия: `night-shift → lofi-memories-children`, `deploy → dark-lofi-vibes`, `coffee-loop → midnight-lofi-love`, `push-to-prod → happy-lofi`, `rainy-commit → background-lofi-lifestyle`, `soft-reboot → love-lofi-2`, `late-pr → hiphop-lofi-dance`
- vibe-фильтры (CHIP/LOFI) — оставить, распределить: первые 4 — chip, последние 3 — lofi (или просто убрать фильтры, если не ложится)
- play/pause/next/prev/progress/volume — сохранить текущий UI, только источник звука заменить на `<audio>` (или HTMLAudioElement в useRef)
- Preload: `preload="metadata"`, лениво грузить при первом play
- Бейдж `// MOCP` (mini-radio) — оставить



### Шаг 10. Проверка после рефакторинга

- `npm run build` — зелёная
- Вкладки переключаются, панели не ломаются
- Радио играет реальные mp3, кнопки работают
- Тёмная тема не ломается
- FakeNews-тикер крутится, заголовки абсурдные
- Маскот анимирован (покачивание, моргание, клик/скролл)



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