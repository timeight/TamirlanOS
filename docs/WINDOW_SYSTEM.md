# TamirlanOS — Window System Specification

This document specifies the behavior of the window system before it is built. Implementation happens in Phase 2 of the roadmap; any code written for windows must conform to this contract. State lives in `stores/window-store.ts`; pure geometry and stacking logic live in `core/window/`; rendering lives in `components/window/`.

## Window Model

Every window is described by: a stable id, the owning application id, a title, a position (x, y), a size (width, height), a state (`normal`, `minimized`, `maximized`), the geometry to restore after maximize, and its position in the z-order. Windows may declare minimum size and whether they are resizable at all (dialogs are not).

## Dragging

- The title bar is the only drag handle. Window controls (minimize, maximize, close) inside the title bar do not start drags.
- Drags use Pointer Events with pointer capture, so the gesture survives the cursor leaving the window or the tab edge.
- A drag starts only after the pointer moves past a small threshold (~3 px), so clicks on the title bar don't jitter the window.
- During the gesture the window moves via `transform: translate` written directly to the element — no React re-render per move, no transitions active. On pointer up, the final position is committed to the store in one action.
- The title bar can never be dragged fully off-screen: some of it must remain reachable on every edge so the window can always be recovered. Top edge is a hard clamp (a window cannot go above the desktop area).
- Dragging a maximized window restores it to normal size under the cursor, then continues the drag — the classic XP tear-off.
- Double-clicking the title bar toggles maximize; it never starts a drag.

## Focus

- Exactly one window is focused at a time, or none when the desktop itself is focused.
- Pointer-down anywhere inside a window focuses it — before any other handling, including the start of a drag.
- Opening or restoring a window focuses it. Closing or minimizing the focused window passes focus to the topmost remaining normal window; if none remains, the desktop takes focus.
- Focused and unfocused windows are visually distinct (title bar treatment), matching XP behavior.
- Keyboard: focus is moved between windows from the taskbar; Escape closes dialogs but never ordinary windows. Browser-level focus (tab order, focus trap in dialogs) follows the accessibility rules in `CLAUDE.md`.

## Z-Index

- The stacking order is an ordered list of window ids in the store — the array is the truth, and each window's `z-index` is derived from its position in it. No incrementing global counter, so values can never grow unbounded.
- Focusing a window moves its id to the top of the list; everything else keeps relative order.
- Reserved layers above all windows, in ascending order: taskbar, menus (Start menu, context menus), system dialogs, and the drag/resize ghost layer.
- Minimized windows keep their place in the list so restore returns them to a sensible depth.

## Resizing

- Resizable windows expose eight handles: four edges and four corners, with correct directional cursors. Handles are invisible hit areas (~6 px) at the frame border.
- Like dragging, resizing is pointer-captured and applied via direct style writes during the gesture, committed to the store on release.
- Minimum size is enforced per window (defaults defined with the window model); there is no maximum beyond the viewport.
- Resizing from the left or top edge moves the origin and resizes together, keeping the opposite edge fixed — the XP behavior.
- Maximized and non-resizable windows show no handles and accept no resize gestures.

## Minimize

- Minimize animates the window toward its taskbar button (transform/opacity only) and then hides it. The component stays mounted; app state inside the window is preserved exactly.
- A minimized window keeps its taskbar button in pressed-out state; clicking the button restores the window to its previous geometry and focuses it.
- Minimizing never changes the window's stored position, size, or restore data.

## Maximize

- Maximize fills the desktop work area — the viewport minus the taskbar. The pre-maximize geometry is stored and restored exactly on un-maximize.
- The maximize control becomes a restore control while maximized; double-clicking the title bar toggles the same transition.
- Maximized windows cannot be dragged (except the tear-off restore described under Dragging) and cannot be resized.
- On viewport resize, maximized windows re-fill the new work area; normal windows are clamped so their title bars remain reachable.

## Taskbar Integration

- Every open window owns exactly one taskbar button showing its icon and title, in launch order. Closing the window removes the button.
- The focused window's button renders pressed; minimized windows' buttons render unpressed; clicking behavior: unfocused → focus and raise; focused → minimize; minimized → restore and focus. This matches XP exactly.
- The taskbar is the keyboard surface for window switching: buttons are focusable in order and activate on Enter/Space.
- Window state changes (open, close, focus, minimize, restore) reach the taskbar only through the window store — the taskbar renders store state and dispatches store actions, with no direct window references.
