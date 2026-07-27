import { create } from "zustand";

export interface Notification {
  id: number;
  iconSrc: string;
  title: string;
  body: string;
}

interface NotificationStore {
  items: Notification[];
  notify: (notification: Omit<Notification, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useNotificationStore = create<NotificationStore>((set) => ({
  items: [],
  notify: (notification) =>
    set((state) => ({
      items: [...state.items, { ...notification, id: nextId++ }].slice(-3),
    })),
  dismiss: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}));
