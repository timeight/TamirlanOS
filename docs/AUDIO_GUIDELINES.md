# TamirlanOS — Audio Guidelines

Sound is a first-class part of the XP experience, and also the easiest thing to get wrong. This document is the registry of every sound event in the system and the rules governing playback. A sound that is not documented here does not ship; adding a sound event starts by adding it to this file.

Files live in `public/sounds/` as `kebab-case.mp3`. Playback goes exclusively through the audio manager (`core/audio/`), addressed by event name — never by file path. The manager applies global volume and mute from `stores/audio-store.ts` to every event without exception.

## Sound Events

### boot

Played once when the boot screen appears, after the user's first interaction has unlocked audio. The signature sound of the system — warm, rising, unhurried. This is the only event allowed to exceed two seconds. Preloaded before the boot screen renders. Never replays during a session.

### login

Played when the user passes the login screen onto the desktop. Shorter and brighter than boot — an arrival, not an overture. Plays exactly once per session transition; skipped entirely if the user reaches the desktop through any path that bypasses login.

### shutdown

Played when the shutdown sequence begins, before the screen fades. Descending, calm — the mirror of login. The fade-out waits for the sound to finish or two seconds, whichever comes first, so a slow network can never trap the user in shutdown.

### window-open

A short, soft pop as a window finishes opening. Under 300 ms. Fires once per window creation — restoring from minimize is not an open and stays silent.

### window-close

The counterpart to window-open, slightly lower in pitch. Under 300 ms. Fires on close only — minimize and maximize are silent state changes.

### error

The classic blocking-dialog chord. Played when an error dialog appears. Never loops, never stacks: if several errors fire in a burst, one sound plays. This is the loudest event in the system and still stays within the master volume ceiling.

### notification

A gentle two-note chime for non-blocking notifications (balloon tips, background completions). Softer than error by design — the user should notice, not flinch. Multiple notifications within two seconds coalesce into a single sound.

### recycle-bin

A crumpling-paper sound when items are emptied from the Recycle Bin. Dropping items _into_ the bin is silent, as in XP — only emptying speaks.

### click

A faint, dry tick on activation of primary controls: desktop icon double-click, Start menu item selection, taskbar button press. Under 100 ms, mixed noticeably below every other event. Not attached to every button in the UI — only OS-level chrome. Form controls inside applications stay silent.

### hover

Reserved and off by default. XP did not voice hover, and continuous hover sound is fatiguing; the event name exists so the setting has a home, but it maps to silence unless the user explicitly enables it in a future sound settings panel. If enabled: under 50 ms, quieter than click, throttled to one play per 150 ms.

## Volume Philosophy

The system is a guest in the user's speakers. Master volume defaults to a conservative 50%, and every event is mixed so that nothing — including error — startles at that default. Relative loudness is fixed by tier: session sounds (boot, login, shutdown) are the fullest; dialog sounds (error, notification, recycle-bin, window events) sit below them; interaction sounds (click, hover) are barely-there texture. Mute is absolute: it silences every tier with no exceptions and no ducking tricks. Volume and mute changes apply immediately, persist across sessions, and are controlled from the taskbar. No sound ever plays before the browser's autoplay policy has been satisfied by a real user gesture — the audio manager queues nothing and simply stays silent until unlocked.

## General Rules

- One sound per user-perceived event: an action that opens a window and shows a notification plays the window sound only.
- Sounds never overlap themselves; retriggering an event while it plays restarts nothing and adds nothing.
- Every sound has a visual counterpart — nothing in the system is communicated by audio alone.
- Audio files are lazy-loaded on first use except boot, login, and error, which preload during boot.
- Target format: MP3, mono where the source allows, normalized to a shared loudness reference so tier mixing stays true.
- New events require: an entry in this file, a tier assignment, and a duration budget — before the audio file is committed.
