"use client";

import { useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { signOut } from "@/core/vk/api/profiles";
import type { VkAccount } from "@/hooks/use-vk-account";

interface VkMobileAccountProps {
  account: VkAccount;
}

export function VkMobileAccount({ account }: VkMobileAccountProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      <p className="px-[10px] py-2 text-[13px] text-[#8a8a8a]">
        Почта: <span className="text-[#333]">{account.email ?? "..."}</span>
      </p>

      <VkMobileGroupLabel>Смена пароля</VkMobileGroupLabel>
      <form
        className="px-[10px] py-2.5"
        onSubmit={async (event) => {
          event.preventDefault();
          await account.updatePassword(current, next, repeat);
          setCurrent("");
          setNext("");
          setRepeat("");
        }}
      >
        <VkMobileField
          label="Текущий пароль"
          type="password"
          value={current}
          onChange={setCurrent}
        />
        <VkMobileField
          label="Новый пароль"
          type="password"
          value={next}
          onChange={setNext}
        />
        <VkMobileField
          label="Ещё раз"
          type="password"
          value={repeat}
          onChange={setRepeat}
        />
        <VkMobileButton
          type="submit"
          disabled={account.busy}
          className="w-full"
        >
          Изменить пароль
        </VkMobileButton>
      </form>

      <VkMobileGroupLabel>Смена почты</VkMobileGroupLabel>
      <form
        className="px-[10px] py-2.5"
        onSubmit={async (event) => {
          event.preventDefault();
          await account.updateEmail(email);
          setEmail("");
        }}
      >
        <VkMobileField label="Новая почта" value={email} onChange={setEmail} />
        <p className="mb-2 text-[12px] text-[#9aa4ad]">
          Письмо придёт на новый адрес; старый работает до подтверждения.
        </p>
        <VkMobileButton
          type="submit"
          disabled={account.busy}
          className="w-full"
        >
          Изменить почту
        </VkMobileButton>
      </form>

      <div className="border-t border-[#d5d9de] px-[10px] py-2.5">
        <VkMobileButton
          tone="secondary"
          className="w-full"
          onClick={() => void signOut()}
        >
          Выйти из аккаунта
        </VkMobileButton>
      </div>
    </>
  );
}
