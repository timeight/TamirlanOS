import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageKind, PixStatus, type IcqMessage } from "@/core/icq/chat-types";

interface IcqStore {
  /** Kept forever: the whole point is scrolling back months later. */
  messages: IcqMessage[];
  /** Entry ids in delivery order, used by the selector to avoid repeats. */
  sent: string[];
  status: PixStatus;
  unread: number;
  lastMessageAt: number;
  lastSeenAt: number;
  lastVisitAt: number;
  push: (message: IcqMessage, entryId: string) => void;
  reply: (text: string) => void;
  setStatus: (status: PixStatus) => void;
  markSeen: () => void;
  noteVisit: () => number;
  clear: () => void;
}

let counter = 0;

function id(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}`;
}

export const useIcqStore = create<IcqStore>()(
  persist(
    (set, get) => ({
      messages: [],
      sent: [],
      status: PixStatus.Online,
      unread: 0,
      lastMessageAt: 0,
      lastSeenAt: 0,
      lastVisitAt: 0,

      push: (message, entryId) =>
        set((state) => ({
          messages: [...state.messages, message],
          sent: [...state.sent, entryId],
          unread: state.unread + 1,
          lastMessageAt: message.at,
          status: PixStatus.Online,
        })),

      reply: (text) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: id(),
              kind: MessageKind.Thought,
              text,
              at: Date.now(),
              fromPix: false,
            },
          ],
        })),

      setStatus: (status) => set({ status }),
      markSeen: () => set({ unread: 0, lastSeenAt: Date.now() }),

      /** Returns how long the visitor was away, then starts a new session. */
      noteVisit: () => {
        const previous = get().lastVisitAt;
        set({ lastVisitAt: Date.now() });
        return previous ? Date.now() - previous : 0;
      },

      clear: () => set({ messages: [], sent: [], unread: 0 }),
    }),
    {
      name: "tamirlanos:icq",
      partialize: (state) => ({
        messages: state.messages,
        sent: state.sent,
        unread: state.unread,
        lastMessageAt: state.lastMessageAt,
        lastSeenAt: state.lastSeenAt,
        lastVisitAt: state.lastVisitAt,
      }),
    },
  ),
);
