"use client";

import { useState } from "react";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import { signOut } from "@/core/vk/api/profiles";
import type { VkAccount } from "@/hooks/use-vk-account";

interface VkSettingsAccountProps {
  account: VkAccount;
}

export function VkSettingsAccount({ account }: VkSettingsAccountProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="pt-2 text-[11px]">
      <p className="mb-2 text-[#777]">
        Текущая почта:{" "}
        <span className="text-[#333]">{account.email ?? "..."}</span>
      </p>

      <p className="mt-3 mb-1 border-b border-[#dae1e8] pb-1 font-bold text-[#45688e]">
        Смена пароля
      </p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await account.updatePassword(current, next, repeat);
          setCurrent("");
          setNext("");
          setRepeat("");
        }}
      >
        <VkField
          label="Текущий пароль:"
          type="password"
          value={current}
          onChange={setCurrent}
        />
        <VkField
          label="Новый пароль:"
          type="password"
          value={next}
          onChange={setNext}
        />
        <VkField
          label="Ещё раз:"
          type="password"
          value={repeat}
          onChange={setRepeat}
        />
        <VkButton type="submit" disabled={account.busy} className="ml-[120px]">
          Изменить пароль
        </VkButton>
      </form>

      <p className="mt-4 mb-1 border-b border-[#dae1e8] pb-1 font-bold text-[#45688e]">
        Смена почты
      </p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await account.updateEmail(email);
          setEmail("");
        }}
      >
        <VkField
          label="Новая почта:"
          type="email"
          value={email}
          onChange={setEmail}
          hint="Письмо придёт на новый адрес; старый работает до подтверждения."
        />
        <VkButton type="submit" disabled={account.busy} className="ml-[120px]">
          Изменить почту
        </VkButton>
      </form>

      <p className="mt-4 border-t border-[#dae1e8] pt-2">
        <VkButton tone="quiet" onClick={() => void signOut()}>
          Выйти из аккаунта
        </VkButton>
      </p>
    </div>
  );
}
