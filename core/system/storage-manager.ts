import { createToken, type Manager } from "@/core/kernel/manager";

export interface StorageManager extends Manager {
  read<T>(key: string, fallback: T): T;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
  keys(): string[];
  clearNamespace(): void;
}

export const STORAGE_MANAGER = createToken<StorageManager>("StorageManager");

const NAMESPACE = "tamirlanos";
const VERSION_KEY = `${NAMESPACE}:schema`;
const SCHEMA_VERSION = 1;

/**
 * The only place that touches localStorage. Everything is namespaced and
 * failures degrade to memory, so private mode never breaks the OS.
 */
export function createStorageManager(): StorageManager {
  const memory = new Map<string, string>();
  let persistent = true;

  const raw = (key: string) => `${NAMESPACE}:${key}`;

  const getItem = (key: string): string | null => {
    if (!persistent) return memory.get(key) ?? null;
    try {
      return window.localStorage.getItem(raw(key));
    } catch {
      persistent = false;
      return memory.get(key) ?? null;
    }
  };

  const setItem = (key: string, value: string): void => {
    memory.set(key, value);
    if (!persistent) return;
    try {
      window.localStorage.setItem(raw(key), value);
    } catch {
      persistent = false;
    }
  };

  return {
    id: "storage",

    start() {
      const stored = Number(getItem("schema") ?? "0");
      if (stored !== SCHEMA_VERSION) {
        // Future migrations branch here; today we only stamp the version.
        setItem("schema", String(SCHEMA_VERSION));
      }
      void VERSION_KEY;
    },

    read<T>(key: string, fallback: T): T {
      const value = getItem(key);
      if (value === null) return fallback;
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    },

    write<T>(key: string, value: T) {
      setItem(key, JSON.stringify(value));
    },

    remove(key) {
      memory.delete(key);
      if (!persistent) return;
      try {
        window.localStorage.removeItem(raw(key));
      } catch {
        persistent = false;
      }
    },

    keys() {
      if (!persistent) return [...memory.keys()];
      try {
        return Object.keys(window.localStorage)
          .filter((key) => key.startsWith(`${NAMESPACE}:`))
          .map((key) => key.slice(NAMESPACE.length + 1));
      } catch {
        return [...memory.keys()];
      }
    },

    clearNamespace() {
      for (const key of this.keys()) this.remove(key);
    },
  };
}
