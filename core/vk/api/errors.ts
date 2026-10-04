import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Техническое сообщение Supabase показывать нельзя: оно на английском,
 * называет таблицы и политики и ничего не объясняет человеку. Здесь оно
 * превращается в одну из понятных фраз.
 */
export function friendly(
  error: PostgrestError | { message: string } | null,
): string | null {
  if (!error) return null;
  const text = error.message.toLowerCase();

  if (text.includes("row-level security") || text.includes("permission")) {
    return "Недостаточно прав для этого действия";
  }
  if (text.includes("duplicate") || text.includes("unique")) {
    return "Такая запись уже существует";
  }
  if (text.includes("violates check constraint")) {
    return "Введённые данные не подходят";
  }
  if (text.includes("foreign key")) {
    return "Связанная запись не найдена";
  }
  if (text.includes("failed to fetch") || text.includes("network")) {
    return "Нет связи с сервером";
  }
  return "Не удалось выполнить действие. Попробуйте ещё раз";
}

/**
 * Значение для фильтра PostgREST. Кавычки нужны, потому что .or() разбирает
 * условия по запятым: без них поиск «Иван, Петров» рвётся на два куска.
 * Внутри кавычек обратный слеш служит экранированием, поэтому слеши и
 * кавычки удваиваются.
 */
export function quoteFilterValue(value: string): string {
  return `"${value.replace(/[\\"]/g, (char) => `\\${char}`)}"`;
}

/** %, _ и \ — метасимволы LIKE; без экранирования «%» найдёт вообще всё. */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
