import { escapeLike, friendly, quoteFilterValue } from "@/core/vk/api/errors";
import { supabase } from "@/core/vk/supabase";

export const AUDIO_BUCKET = "audio";
const MAX_BYTES = 20 * 1024 * 1024;
const SIGNED_SECONDS = 3600;

export interface VkTrack {
  id: string;
  owner_id: string;
  group_id: string | null;
  title: string;
  artist: string;
  storage_path: string;
  duration: number;
  created_at: string;
}

/** Бакет закрытый, поэтому адрес выдаётся на час и не живёт в разметке. */
export async function trackUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(path, SIGNED_SECONDS);
  return data?.signedUrl ?? null;
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Длительность читает сам браузер из метаданных файла. Отдельная библиотека
 * ради одного числа сюда бы не поместилась.
 */
export function readDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const probe = new Audio();
    const done = (value: number) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    probe.addEventListener("loadedmetadata", () =>
      done(Number.isFinite(probe.duration) ? probe.duration : 0),
    );
    probe.addEventListener("error", () => done(0));
    probe.src = url;
  });
}

function rejectFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const looksAudio =
    file.type.startsWith("audio/") ||
    name.endsWith(".mp3") ||
    name.endsWith(".m4a");
  if (!looksAudio) return "Поддерживаются только аудиофайлы";
  if (file.size > MAX_BYTES) return "Файл больше 20 МБ";
  return null;
}

export interface UploadTrack {
  title: string;
  artist: string;
  groupId?: string | null;
}

export async function uploadTrack(
  ownerId: string,
  file: File,
  meta: UploadTrack,
): Promise<VkTrack | string> {
  const bad = rejectFile(file);
  if (bad) return bad;
  if (!meta.title.trim() || !meta.artist.trim()) {
    return "Укажите исполнителя и название";
  }

  const duration = await readDuration(file);
  const dot = file.name.lastIndexOf(".");
  const extension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "mp3";
  const path = `${ownerId}/${crypto.randomUUID()}.${extension}`;

  const upload = await supabase.storage.from(AUDIO_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || "audio/mpeg",
  });
  if (upload.error) {
    return friendly(upload.error) ?? "Не удалось загрузить файл";
  }

  const { data, error } = await supabase
    .from("audio_tracks")
    .insert({
      owner_id: ownerId,
      group_id: meta.groupId ?? null,
      title: meta.title.trim(),
      artist: meta.artist.trim(),
      storage_path: path,
      duration: Math.round(duration),
    })
    .select("*")
    .single();

  if (error || !data) {
    // Без отката файл остался бы в бакете навсегда и невидимым.
    await supabase.storage.from(AUDIO_BUCKET).remove([path]);
    return friendly(error) ?? "Не удалось сохранить запись";
  }
  return data as VkTrack;
}

export async function fetchTracks(
  ownerId: string,
): Promise<readonly VkTrack[]> {
  const { data } = await supabase
    .from("audio_tracks")
    .select("*")
    .eq("owner_id", ownerId)
    .is("group_id", null)
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as VkTrack[] | null) ?? [];
}

export async function fetchGroupTracks(
  groupId: string,
): Promise<readonly VkTrack[]> {
  const { data } = await supabase
    .from("audio_tracks")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as VkTrack[] | null) ?? [];
}

/** Экранирование то же, что в поиске людей и сообществ. */
export async function searchTracks(query: string): Promise<readonly VkTrack[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  const pattern = quoteFilterValue(`%${escapeLike(term)}%`);
  const { data } = await supabase
    .from("audio_tracks")
    .select("*")
    .or(`title.ilike.${pattern},artist.ilike.${pattern}`)
    .limit(50);
  return (data as VkTrack[] | null) ?? [];
}

export async function renameTrack(
  id: string,
  title: string,
  artist: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("audio_tracks")
    .update({ title: title.trim(), artist: artist.trim() })
    .eq("id", id);
  return friendly(error);
}

/** Сначала строка, затем файл: обратный порядок оставил бы битую строку. */
export async function deleteTrack(track: VkTrack): Promise<string | null> {
  const { error } = await supabase
    .from("audio_tracks")
    .delete()
    .eq("id", track.id);
  if (error) return friendly(error);

  const removal = await supabase.storage
    .from(AUDIO_BUCKET)
    .remove([track.storage_path]);
  if (removal.error) {
    return "Запись удалена, но файл остался на сервере";
  }
  return null;
}
