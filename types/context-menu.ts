export interface MenuAction {
  kind: "action";
  label: string;
  onSelect?: () => void;
  /** Пункт виден, но не работает: за ним нет настоящего действия. */
  disabled?: boolean;
}

export interface MenuSubmenu {
  kind: "submenu";
  label: string;
  items: readonly MenuEntry[];
  disabled?: boolean;
}

export interface MenuSeparator {
  kind: "separator";
}

export type MenuEntry = MenuAction | MenuSubmenu | MenuSeparator;

export interface MenuRequest {
  x: number;
  y: number;
  items: readonly MenuEntry[];
}
