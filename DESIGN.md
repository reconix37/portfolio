# DESIGN.md — daniil.dev (DANIIL OS v1.0)

## Surface
Command/Explore — персональная «система»: терминальный вход (Command) + рабочее пространство с окнами-секциями (Explore). НЕ Decide/Learn — никакого hero + 3 карточки.

## Concept
Сайт играет роль персональной ОС Данила: окна, терминал, системные метаданные (версия, локальное время), маскот-агент. Контент — реальный, из резюме. Только реальные достижения (правило Дани).

## Color Tokens — Light (default) / Dark
```
Light:
--bg:        #F4EFE6   /* тёплый крем */
--surface:   #EDE6D8   /* чуть глубже для окон */
--ink:       #1F1D1A   /* графит, основной текст */
--ink-soft:  #4A453E   /* вторичный */
--muted:     #8A8378   /* приглушённый */
--line:      #1F1D1A   /* рамки окон — контурные */
--accent:    #C45C4A   /* терракот (hiss-бренд) */
--accent-2:  #E0A458   /* тёплый жёлтый, хайлайты */
--ok:        #5C7A5C   /* моно-зелёный, метрики */
--shadow:    4px 4px 0 #1F1D1A

Dark:
--bg:        #121110
--surface:   #1C1A17
--ink:       #E8E4DC
--ink-soft:  #B5AFA3
--muted:     #6E675C
--line:      #E8E4DC
--accent:    #E0765F   /* терракот светлее для контраста */
--accent-2:  #E0A458
--ok:        #7FA07F
--shadow:    4px 4px 0 #E8E4DC
```

Правило: контраст текста ≥ 4.5:1 на bg. Акцент — только для акцентов, не для body-текста.

## Typography
- Заголовки: **Syne** 700/800 (extra-bold, характер) — «DANIIL», «OS», секции
- Тело/UI/мета: **Space Mono** 400/700 — терминальный вайб, всё моно
- Кегли: hero 64–96px, секции 28–40px, body 15–16px, мета 12–13px uppercase
- letter-spacing: заголовки −0.02em, мета +0.12em uppercase

## Spacing
4px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96

## Radius
Окна: 0 (прямые углы, hard shadow 4px 4px 0) — брутализм. Кнопки: 0. Никаких скруглений «SaaS».

## Components
1. **Window** — секция-окно: border 2px var(--line), hard shadow, заголовок-бар `// 01 — PROJECTS`, кнопки —/□/× (декор, только SVG). Drag&drop на десктопе.
2. **Terminal hero** — окно с приглашением `$`, печатающийся текст, мигающий блок-курсор.
3. **Mascot** — пиксельный SVG-агент (монитор-голова), глаза следят за курсором в hero, меняет выражение на hover проектов. Inline SVG, fill=currentColor. БЕЗ эмодзи.
4. **Metric** — «живая» цифра: 111+ / 68 / 12 / 18K+, анимируется при появлении (counter), в паре с подписью mono. Никаких «монумент-стат» без контекста.
5. **Lang-rotator** — приветствия: Ahoj / Привіт / Привет / Hello — ротация каждые 2.4s в hero.
6. **Btn** — border 2px ink, hard shadow, hover: сдвиг 2px, без скруглений.
7. **Sysbar (футер)** — `v1.0 · PREŠOV · LOCAL TIME · OK` — системные метаданные.

## States
1. Loading — терминальный boot-текст (быстрый, 600ms)
2. Hover на окно — shadow усиливается до 6px 6px 0, заголовок подсвечивается
3. Theme — toggle светлая/тёмная, сохранение в localStorage
4. Reduced motion — все анимации off

## Anti-patterns (ЗАПРЕЩЕНО)
- ❌ Градиенты (особенно сине-фиолетовые «tech gradient»)
- ❌ Generic indigo/violet акцент
- ❌ Feature-tile grid (иконка+заголовок+текст ×3)
- ❌ Accent rail (цветная полоска слева на карточках)
- ❌ Glassmorphism / blur без системы
- ❌ Monument stat без контекста
- ❌ Icon topper (иконка в кружке над заголовком)
- ❌ Center stack (всё по центру)
- ❌ Inter / system-ui по умолчанию
- ❌ Эмодзи в UI — только inline SVG fill=currentColor
- ❌ AI-слоп в текстах: «passionate», «crafting experiences», «seamless», «unleash» — только прямые факты
- ❌ Выдуманные метрики — только реальные из резюме
- ❌ Шаблонные «Hello world, welcome to my portfolio» — вместо этого терминальный whoami
