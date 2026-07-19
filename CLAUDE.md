# TamirlanOS — Engineering Constitution

TamirlanOS is a Windows XP–inspired desktop experience built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, and zustand. Every rule below applies to every task in this repository unless the task explicitly overrides it.

## Coding Philosophy

- One file, one responsibility. If a file needs "and" to describe what it does, split it.
- Prefer composition over configuration. Small components composed together beat large components with many props.
- Delete code rather than comment it out. Git is the archive.
- No speculative abstractions. Build what the current sprint needs; generalize on the second concrete use case, not the first.
- Code must read as if a person wrote it deliberately: no boilerplate comments, no generated-looking scaffolding, no dead exports.
- Comments explain _why_, never _what_. If the code needs a _what_ comment, rewrite the code.
- Fake data, demo pages, and placeholder UI are forbidden. A feature ships working or it does not ship.

## File Naming

- Components: `PascalCase.tsx` — `WindowFrame.tsx`, `TaskbarButton.tsx`.
- Hooks: `use-kebab-case.ts` — `use-drag.ts`, `use-window-focus.ts`.
- Stores: `kebab-case-store.ts` — `window-store.ts`, `audio-store.ts`.
- Utilities, config, types: `kebab-case.ts` — `cn.ts`, `site.ts`, `window.ts`.
- Sounds: `kebab-case.mp3` in `public/sounds/` — `window-open.mp3`, `recycle-bin.mp3`.
- One exported component per component file; the file name matches the export name.

## Component Rules

- Server Components by default; add `"use client"` only when the component uses state, effects, refs, or browser APIs.
- Props are typed with an explicit `interface` named `<Component>Props`, declared in the same file. Shared/domain types live in `types/`.
- No default exports except Next.js route files (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`).
- Class names are merged with `cn()` from `core/utils/cn.ts` — never template-string concatenation.
- A component reaches into a store via a hook; it never imports another component's internals.
- Keep components under ~150 lines. Larger means it is doing more than one job.
- Reusable primitives live in `components/ui/`; feature-specific components live in a folder named after the feature.

## Folder Ownership

- `app/` — routing, layouts, metadata only. No business logic, no UI beyond composition of components.
- `components/` — all React components. Nothing here imports from `app/`.
- `core/` — framework-agnostic logic: config, utilities, managers. Nothing here imports React.
- `hooks/` — reusable React hooks. Hooks may import from `core/` and `stores/`, never from `components/`.
- `stores/` — zustand stores. Stores may import from `core/` and `types/` only.
- `styles/` — global CSS and Tailwind theme tokens. Component styling stays in the component.
- `types/` — shared TypeScript types and interfaces. No runtime code.
- `public/assets/` — images and icons. `public/sounds/` — audio files.
- Dependency direction: `app → components → hooks → stores → core → types`. Imports never flow the other way.

## Animation Rules

- Animate `transform` and `opacity` only. Never animate `top`, `left`, `width`, `height`, or `box-shadow` in transitions.
- Window movement during drag uses `transform: translate` driven by pointer events, not CSS transitions.
- Durations: 100–150 ms for micro-interactions (hover, press), 150–250 ms for window open/close/minimize. Nothing above 300 ms.
- Every animation respects `prefers-reduced-motion: reduce` by collapsing to an instant state change.
- No animation libraries until a concrete need is documented in an ADR; CSS transitions and the Web Animations API come first.

## Audio Rules

- All playback flows through the audio manager in `core/audio/`. Components never construct `Audio` or `AudioContext` directly.
- Every sound event is named in `docs/AUDIO_GUIDELINES.md` before its file is added. Undocumented sounds do not ship.
- Sound never plays before a user gesture has unlocked audio (browser autoplay policy).
- The user's mute and volume settings persist and are honored by every event without exception.

## Performance Rules

- The desktop shell must stay interactive at 60 fps during drag, resize, and window transitions.
- No layout reads (`getBoundingClientRect`, `offsetWidth`) inside pointer-move handlers; measure once on gesture start.
- Client bundles stay lean: check what a `"use client"` boundary pulls in before adding it.
- Images go through `next/image`; audio files are lazy-loaded on first use, except boot-critical sounds which preload.
- Zustand selectors select the narrowest slice needed; no component subscribes to a whole store.
- Measure before optimizing: a perf change requires a before/after number in the PR description.

## Accessibility Rules

- Every interactive element is keyboard-reachable and shows a visible focus state.
- Windows are `role="dialog"` with `aria-label`; the taskbar is `role="toolbar"`; menus use proper `menu`/`menuitem` semantics.
- Focus is trapped inside modal dialogs and restored to the invoker on close.
- Color is never the only carrier of meaning; contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 UI).
- Touch targets are at least 44×44 px on coarse pointers.
- Sound always has a visual counterpart — no information is audio-only.

## Git Commit Style

- Conventional Commits: `type(scope): summary` in imperative mood, lower case, no trailing period.
- Types: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `chore`, `test`.
- Scopes match folders or features: `window`, `taskbar`, `audio`, `desktop`, `core`, `docs`.
- One logical change per commit. A commit that touches the window manager and the audio manager is two commits.
- Examples: `feat(window): add drag handling to WindowFrame`, `fix(audio): respect mute during boot sequence`.

## Pull Request Checklist

- `npm run type-check`, `npm run lint`, and `npm run build` pass locally.
- `npm run format:check` is clean.
- No new dependency added without prior agreement recorded in the PR description.
- New components follow naming, ownership, and dependency-direction rules above.
- Interactive changes verified with keyboard only and with `prefers-reduced-motion` enabled.
- New sounds are documented in `docs/AUDIO_GUIDELINES.md`; new windows follow `docs/WINDOW_SYSTEM.md`.
- Screenshots or a screen recording attached for any visual change.
- No commented-out code, no unused exports, no stray `console.log`.
