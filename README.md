# DANIIL OS — personal site

Персональный сайт Даниила Верховского — AI/ML engineer. Сайт = приложение-окно: вкладки (WHOAMI / PROJECTS / STACK / EDUCATION / CONTACT / RADIO), маскот-агент, терминал, WebAudio chipradio.

Вайб: нео-брутализм / old-web (референс [KISA](https://mcp.deploychan.webcam/), Poolsuite). Никакого AI-слопа.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Syne + Space Mono
- WebAudio API (чиптюн-радио, без внешних треков)

## Dev

```bash
npm install
npm run dev
```

## Structure

```
sysbar → AppFrame (titlebar + tabs + panel) → footer
tabs/: Whoami · Projects · Stack · Education · Contact · Radio
```

Страница не скроллится — скролл только внутри активной панели.

## Design system

`DESIGN.md` — токены, компоненты, антипаттерны. Токены уже в `src/index.css`.
`AGENTS.md` — правила и бриф для AI-агентов (Cursor).

## Content

Контент — реальный, из резюме (проекты HabitForge, AI Chat Platform, SLE Terminal, thesis). Только реальные метрики.
