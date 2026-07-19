export enum CursorKind {
  Default = "default",
  Pointer = "pointer",
  Move = "move",
  Text = "text",
  Wait = "wait",
  ResizeNS = "resize-ns",
  ResizeEW = "resize-ew",
  ResizeNESW = "resize-nesw",
  ResizeNWSE = "resize-nwse",
}

export const CURSOR_CSS: Readonly<Record<CursorKind, string>> = {
  [CursorKind.Default]: "default",
  [CursorKind.Pointer]: "pointer",
  [CursorKind.Move]: "move",
  [CursorKind.Text]: "text",
  [CursorKind.Wait]: "wait",
  [CursorKind.ResizeNS]: "ns-resize",
  [CursorKind.ResizeEW]: "ew-resize",
  [CursorKind.ResizeNESW]: "nesw-resize",
  [CursorKind.ResizeNWSE]: "nwse-resize",
};
