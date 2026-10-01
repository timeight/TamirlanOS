"use client";

import { useState } from "react";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import { signIn, signUp } from "@/core/vk/api/profiles";
import { vkConfigured } from "@/core/vk/supabase";

const USERNAME = /^[a-z0-9_]{3,20}$/;

export function VkAuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const register = mode === "register";

  const submit = async () => {
    setError(null);
    if (register && !USERNAME.test(username.toLowerCase())) {
      setError("Адрес страницы: 3–20 знаков, латиница, цифры и _");
      return;
    }
    if (register && (!firstName.trim() || !lastName.trim())) {
      setError("Укажите имя и фамилию");
      return;
    }
    setBusy(true);
    const message = register
      ? await signUp({ email, password, username, firstName, lastName })
      : await signIn(email, password);
    setBusy(false);
    if (message) setError(message);
  };

  if (!vkConfigured) {
    return (
      <div className="mx-auto mt-10 w-[420px] border border-[#dae1e8] bg-white p-4 text-[11px] leading-[17px] text-[#333]">
        <p className="mb-2 text-[13px] font-bold text-[#2b587a]">
          Сайт временно недоступен
        </p>
        <p>
          Сервер не настроен: сборка прошла без ключей Supabase. Добавьте
          NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 w-[460px]">
      <div className="border border-[#dae1e8] bg-white">
        <div className="border-b border-[#dae1e8] bg-[#f7f8fa] px-3 py-1.5">
          <span className="text-[12px] font-bold text-[#45688e]">
            {register ? "Регистрация" : "Вход на сайт"}
          </span>
        </div>

        <form
          className="px-3 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          {register && (
            <>
              <VkField label="Имя:" value={firstName} onChange={setFirstName} />
              <VkField
                label="Фамилия:"
                value={lastName}
                onChange={setLastName}
              />
              <VkField
                label="Адрес страницы:"
                value={username}
                onChange={setUsername}
                placeholder="durov"
                hint="vk.com/вашадрес — латиница, цифры, подчёркивание"
              />
            </>
          )}

          <VkField
            label="Эл. почта:"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <VkField
            label="Пароль:"
            value={password}
            onChange={setPassword}
            type="password"
            hint={register ? "не короче шести знаков" : undefined}
          />

          {error && (
            <p className="mt-2 ml-[120px] max-w-[280px] border border-[#e0b4b4] bg-[#fdf4f4] px-2 py-1 text-[11px] text-[#9b2c2c]">
              {error}
            </p>
          )}

          <div className="mt-3 ml-[120px]">
            <button
              type="submit"
              disabled={busy}
              className="border border-[#b2bdc8] bg-[#edf1f5] px-4 py-1 text-[11px] text-[#2b587a] hover:bg-[#e2e8ee] active:translate-y-px disabled:text-[#aaa]"
            >
              {busy
                ? "Подождите..."
                : register
                  ? "Зарегистрироваться"
                  : "Войти"}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-2 text-center text-[11px]">
        <button
          type="button"
          onClick={() => {
            setMode(register ? "login" : "register");
            setError(null);
          }}
          className="text-[#2b587a] hover:underline"
        >
          {register ? "У меня уже есть страница" : "Зарегистрироваться"}
        </button>
      </p>

      <p className="mt-6 text-center text-[10px] leading-4 text-[#939393]">
        Учебная реконструкция внутри TamirlanOS. Не вводите пароль, который
        используете на других сайтах.
      </p>
    </div>
  );
}
