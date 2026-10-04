"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteMessage,
  fetchDialogs,
  fetchMessages,
  markAllRead,
  markRead,
  openDialog,
  sendMessage,
} from "@/core/vk/api/messages";
import { supabase } from "@/core/vk/supabase";
import type { VkDialog, VkMessageRow } from "@/core/vk/social-types";

export interface VkMessenger {
  dialogs: readonly VkDialog[];
  openId: string | null;
  messages: readonly VkMessageRow[];
  loading: boolean;
  open: (conversationId: string) => void;
  openWith: (otherId: string) => Promise<void>;
  close: () => void;
  send: (text: string) => Promise<void>;
  remove: (messageId: string) => Promise<void>;
  /** Пометить прочитанными все переписки — зовётся при открытии раздела. */
  markSeen: () => Promise<void>;
}

export function useVkMessages(
  viewerId: string | null,
  onCountersChanged: () => Promise<void>,
): VkMessenger {
  const [dialogs, setDialogs] = useState<readonly VkDialog[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [messages, setMessages] = useState<readonly VkMessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Подписка читает актуальный диалог без перезапуска канала.
  const openRef = useRef<string | null>(null);
  openRef.current = openId;

  const reloadDialogs = useCallback(async () => {
    if (!viewerId) return;
    setDialogs(await fetchDialogs());
    setLoading(false);
  }, [viewerId]);

  const reloadThread = useCallback(
    async (conversationId: string) => {
      if (!viewerId) return;
      setMessages(await fetchMessages(conversationId));
      await markRead(conversationId, viewerId);
      await onCountersChanged();
    },
    [onCountersChanged, viewerId],
  );

  useEffect(() => {
    void reloadDialogs();
  }, [reloadDialogs]);

  useEffect(() => {
    if (!openId) {
      setMessages([]);
      return;
    }
    void reloadThread(openId);
  }, [openId, reloadThread]);

  useEffect(() => {
    if (!viewerId) return;
    const channel = supabase
      .channel(`vk-messages-${viewerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as VkMessageRow;
          // Свои сообщения уже перечитаны в send(); иначе каждая отправка
          // стоила бы двух лишних запросов.
          if (row.author_id === viewerId) return;
          void reloadDialogs();
          if (row.conversation_id === openRef.current) {
            void reloadThread(row.conversation_id);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [reloadDialogs, reloadThread, viewerId]);

  const openWith = useCallback(async (otherId: string) => {
    const id = await openDialog(otherId);
    if (id) setOpenId(id);
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!openId || !viewerId) return;
      await sendMessage(openId, viewerId, text);
      await reloadThread(openId);
      await reloadDialogs();
    },
    [openId, reloadDialogs, reloadThread, viewerId],
  );

  const remove = useCallback(
    async (messageId: string) => {
      await deleteMessage(messageId);
      if (openId) await reloadThread(openId);
      await reloadDialogs();
    },
    [openId, reloadDialogs, reloadThread],
  );

  const markSeen = useCallback(async () => {
    if (!viewerId) return;
    await markAllRead(viewerId);
    await reloadDialogs();
    await onCountersChanged();
  }, [onCountersChanged, reloadDialogs, viewerId]);

  return {
    dialogs,
    openId,
    messages,
    loading,
    open: setOpenId,
    openWith,
    close: () => setOpenId(null),
    send,
    remove,
    markSeen,
  };
}
