# TamirlanOS — Architecture

TamirlanOS renders a desktop operating system experience inside a single Next.js page. The browser tab is the machine; the React tree is the screen. There is no server-side application logic — the server's job is to deliver the shell fast, and everything after first paint is client-driven.

## System Architecture

The system is organized in four layers:

1. **Shell (app/)** — the Next.js App Router entry. It renders the desktop root, provides fonts and global styles, and defines metadata. It contains no OS logic.
2. **Presentation (components/)** — everything visible: desktop surface, windows, taskbar, icons, cursors, menus. Components are thin; they render state and forward user intent to stores.
3. **State (stores/ + hooks/)** — zustand stores hold the OS state (which windows exist, which is focused, what the audio settings are). Hooks are the typed doorway between components and stores.
4. **Core (core/)** — framework-agnostic managers and utilities: window geometry math, z-index allocation, audio playback, configuration. Core code never imports React, which keeps it unit-testable and portable.

Data flows one way: user input → component event → store action → state change → re-render. Managers in `core/` are invoked from store actions, not from components.

## Folder Responsibilities

- `app/` — routes, root layout, metadata, viewport. Composition only.
- `components/` — `ui/` for primitives shared across the OS; feature folders (desktop, window, taskbar) for feature-specific pieces.
- `core/` — `config/` (site and OS constants), `utils/` (pure helpers like `cn`), and future managers (`window/`, `audio/`).
- `hooks/` — reusable client hooks; gesture handling, media queries, store selectors with derived data.
- `stores/` — one zustand store per domain. Stores are the single source of truth for OS state.
- `styles/` — Tailwind v4 theme tokens and global resets in `globals.css`.
- `types/` — shared domain types (window descriptors, app manifests, sound event names).
- `public/assets/`, `public/sounds/` — static images, icons, and audio files.

## Window Manager

The window manager is the heart of the OS. It lives as pure logic in `core/window/` (geometry, z-order, snapping math) with its state in `stores/window-store.ts`. It owns the registry of open windows — each described by an id, owning application, title, position, size, and state (normal, minimized, maximized) — plus the focus order and z-index stack. Components such as `WindowFrame` render what the manager decides; they never decide layout themselves. The full behavioral contract is specified in `docs/WINDOW_SYSTEM.md`.

## Desktop Manager

The desktop manager owns everything behind the windows: wallpaper, desktop icons and their grid placement, selection rectangles, and the desktop context menu. It also owns session state — boot, login, active session, shutdown — and coordinates the transitions between them. Applications never draw on the desktop directly; they request things (an icon, a notification) through the desktop manager's store.

## Audio Manager

The audio manager in `core/audio/` is the only code allowed to touch browser audio APIs. It maps named sound events to files in `public/sounds/`, handles preloading, honors the autoplay-unlock gesture, and applies the global volume and mute state from `stores/audio-store.ts`. Callers fire events by name (`play("window-open")`) and never reference file paths. Event names and behavior are specified in `docs/AUDIO_GUIDELINES.md`.

## Future Applications

Applications (file explorer, notepad, media player, recycle bin, and whatever comes later) are self-contained packages under `components/apps/<app-name>/`. Each app declares a manifest — id, title, icon, default window size and constraints — and exports a single root component rendered inside a `WindowFrame`. Apps talk to the OS only through public hooks (open a window, play a sound, show a notification). This keeps every app removable: deleting its folder and manifest entry must leave the OS fully working.

## State Management

Zustand is the single state layer. One store per domain: windows, desktop/session, audio, and future app-specific stores. Rules:

- Stores expose actions; components never call `setState` on a store from outside.
- Selectors are narrow — a taskbar button subscribes to its own window's state, not the whole window list.
- Derived data is computed in selectors or hooks, never duplicated into state.
- Persistence (volume, wallpaper choice) uses zustand's persist middleware scoped to the store that owns the setting.
- React state (`useState`) remains correct for purely local concerns — an input's draft value, a hover flag.

## Rendering Philosophy

Server Components deliver the static shell; the interactive desktop is a client island. Within it, the guiding rule is: the DOM is cheap to keep, expensive to churn. Windows stay mounted while minimized (display toggled, state preserved) rather than unmounted and rebuilt. Continuous gestures — drag, resize — bypass React state and write `transform` styles directly through refs, committing to the store once at gesture end. React renders discrete state changes; the compositor handles continuous motion. Anything animated uses `transform`/`opacity` so the main thread stays free and the shell holds 60 fps.
