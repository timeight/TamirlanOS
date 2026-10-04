"use client";

import { useCallback, useEffect, useState } from "react";
import {
  changeEmail,
  changePassword,
  currentEmail,
  purgeAccount,
  savePrivacy,
  type PrivacyPatch,
} from "@/core/vk/api/account";
import { fetchProfile } from "@/core/vk/api/profiles";
import type { VkProfileRow } from "@/core/vk/vk-types";
import { useVkSessionStore } from "@/stores/vk-session-store";

export interface VkAccount {
  email: string | null;
  busy: boolean;
  /** Последнее сообщение: ошибка либо подтверждение успеха. */
  notice: string | null;
  ok: boolean;
  setPrivacy: (patch: PrivacyPatch) => Promise<void>;
  updatePassword: (
    current: string,
    next: string,
    repeat: string,
  ) => Promise<void>;
  updateEmail: (next: string) => Promise<void>;
  purge: () => Promise<void>;
}

export function useVkAccount(me: VkProfileRow): VkAccount {
  const setProfile = useVkSessionStore((state) => state.setProfile);
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    void currentEmail().then(setEmail);
  }, []);

  const report = useCallback((message: string | null, success: string) => {
    setNotice(message ?? success);
    setOk(!message);
  }, []);

  const setPrivacy = useCallback(
    async (patch: PrivacyPatch) => {
      setBusy(true);
      const message = await savePrivacy(me.id, patch);
      if (!message) {
        const fresh = await fetchProfile(me.id);
        if (fresh) setProfile(fresh);
      }
      report(message, "Настройки сохранены");
      setBusy(false);
    },
    [me.id, report, setProfile],
  );

  const updatePassword = useCallback(
    async (current: string, next: string, repeat: string) => {
      if (!email) return;
      setBusy(true);
      report(
        await changePassword(email, current, next, repeat),
        "Пароль изменён",
      );
      setBusy(false);
    },
    [email, report],
  );

  const updateEmail = useCallback(
    async (next: string) => {
      setBusy(true);
      report(
        await changeEmail(next),
        "Письмо отправлено на новый адрес. Старый работает до подтверждения",
      );
      setBusy(false);
    },
    [report],
  );

  const purge = useCallback(async () => {
    setBusy(true);
    report(await purgeAccount(), "Данные удалены");
    setBusy(false);
  }, [report]);

  return {
    email,
    busy,
    notice,
    ok,
    setPrivacy,
    updatePassword,
    updateEmail,
    purge,
  };
}
