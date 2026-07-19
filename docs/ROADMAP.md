# TamirlanOS — Roadmap

Development proceeds in phases. A phase is complete when its exit criteria are met and `type-check`, `lint`, and `build` pass. Later phases may begin only when everything they depend on is done.

## Phase 0 — Foundation (complete)

Next.js 15 + React 19 + TypeScript strict + Tailwind v4 scaffold; ESLint, Prettier, Husky, lint-staged; folder architecture; engineering documentation (this constitution).

Exit criteria: clean build, documented architecture. ✔

## Phase 1 — Desktop Shell

The static face of the OS: full-screen desktop surface with XP-style wallpaper and theme tokens (colors, fonts, borders, shadows) defined in `styles/`; taskbar with Start button and clock; desktop icon grid with selection; cursor styling.

Exit criteria: pixel-stable desktop at all viewport sizes, keyboard-navigable icons, no interactivity beyond selection.

## Phase 2 — Window System

The behavioral core specified in `docs/WINDOW_SYSTEM.md`: window store and geometry core, `WindowFrame` with title bar and controls, dragging, focus and z-ordering, resizing, minimize/maximize/restore, taskbar integration.

Exit criteria: multiple simultaneous windows pass the full interaction contract at 60 fps.

## Phase 3 — Audio System

The audio manager specified in `docs/AUDIO_GUIDELINES.md`: event-name registry, playback core with autoplay unlock, volume/mute store with persistence, taskbar volume control, sounds wired to window and session events.

Exit criteria: every documented event plays its sound, mute and volume persist across reloads, no audio before user gesture.

## Phase 4 — Session Lifecycle

Boot screen, login screen, and shutdown sequence with their sounds and transitions; session state in the desktop store; the desktop only becomes interactive after login.

Exit criteria: full boot → login → desktop → shutdown cycle, with reduced-motion variants.

## Phase 5 — Core Applications

First-party apps built on the app manifest system: Recycle Bin, Notepad, File Explorer over a virtual file system store, and an About/System Properties dialog. Start menu listing installed apps.

Exit criteria: each app opens, runs, and closes through the window manager with no special-casing; deleting an app's folder leaves the OS working.

## Phase 6 — Polish

Sound design pass, animation timing pass, accessibility audit against WCAG 2.1 AA, performance profiling of drag/resize paths, mobile and touch adaptation of the shell.

Exit criteria: audit findings resolved or explicitly waived in a documented decision.

## Phase 7 — Release

Production hardening: error boundaries around every app, 404 and error routes in shell style, metadata/OG images, favicon set, analytics decision, deployment pipeline, custom domain.

Exit criteria: deployed publicly; Lighthouse performance and accessibility ≥ 90 on the desktop shell.
