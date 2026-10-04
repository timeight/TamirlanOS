import { friendly } from "@/core/vk/api/errors";
import { supabase } from "@/core/vk/supabase";
import type { VkPhotoRow } from "@/core/vk/social-types";

export const WALL_ALBUM = "Фотографии на стене";
export const AVATAR_BUCKET = "avatars";
export const PHOTO_BUCKET = "photos";

const MAX_BYTES = 5 * 1024 * 1024;

/** Первый сегмент пути — id владельца: политика storage проверяет именно его. */
function objectPath(ownerId: string, file: File): string {
  const dot = file.name.lastIndexOf(".");
  const extension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "jpg";
  return `${ownerId}/${crypto.randomUUID()}.${extension}`;
}

function reject(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Это не изображение";
  if (file.size > MAX_BYTES) return "Файл больше 5 МБ";
  return null;
}

export function publicUrl(bucket: string, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Прошлый файл аватара удаляется, иначе каждая замена копит мусор в бакете. */
async function dropPreviousAvatar(previous: string | null): Promise<void> {
  if (!previous) return;
  const marker = `/${AVATAR_BUCKET}/`;
  const at = previous.indexOf(marker);
  if (at < 0) return;
  await supabase.storage
    .from(AVATAR_BUCKET)
    .remove([previous.slice(at + marker.length)]);
}

export async function uploadAvatar(
  ownerId: string,
  file: File,
  previousUrl: string | null = null,
): Promise<string | null> {
  const bad = reject(file);
  if (bad) return bad;

  const path = objectPath(ownerId, file);
  const upload = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: false });
  if (upload.error) return friendly(upload.error);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl(AVATAR_BUCKET, path) })
    .eq("id", ownerId);
  if (error) return friendly(error);

  await dropPreviousAvatar(previousUrl);
  return null;
}

async function ensureAlbum(title: string): Promise<string | null> {
  const { data } = await supabase.rpc("ensure_album", { title });
  return (data as string | null) ?? null;
}

export interface UploadedPhoto {
  photo: VkPhotoRow;
  url: string;
}

export async function uploadPhoto(
  ownerId: string,
  file: File,
  caption?: string,
): Promise<UploadedPhoto | string> {
  const bad = reject(file);
  if (bad) return bad;

  const albumId = await ensureAlbum(WALL_ALBUM);
  if (!albumId) return "Не удалось открыть альбом";

  const path = objectPath(ownerId, file);
  const upload = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { upsert: false });
  if (upload.error) {
    return friendly(upload.error) ?? "Не удалось загрузить файл";
  }

  const { data, error } = await supabase
    .from("photos")
    .insert({
      album_id: albumId,
      owner_id: ownerId,
      storage_path: path,
      caption: caption?.trim() || null,
    })
    .select("*")
    .single();
  if (error || !data) {
    // Файл уже в бакете, а строки нет — такой файл не увидит никто и никогда,
    // поэтому откатываем загрузку, а не оставляем мусор.
    await supabase.storage.from(PHOTO_BUCKET).remove([path]);
    return friendly(error) ?? "Не удалось сохранить фото";
  }

  return { photo: data as VkPhotoRow, url: publicUrl(PHOTO_BUCKET, path) };
}

export async function fetchPhotos(
  ownerId: string,
): Promise<readonly VkPhotoRow[]> {
  const { data } = await supabase
    .from("photos")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as VkPhotoRow[] | null) ?? [];
}

/**
 * Поставить аватаром уже загруженную фотографию. Владелец проверяется здесь,
 * потому что бакет публичный и адрес чужого файла знать не запрещено.
 */
export async function setAvatarFromPhoto(
  photo: VkPhotoRow,
  userId: string,
): Promise<string | null> {
  if (photo.owner_id !== userId) return "Это не ваша фотография";
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl(PHOTO_BUCKET, photo.storage_path) })
    .eq("id", userId);
  return friendly(error);
}

/**
 * Сначала строка, потом файл. Обратный порядок хуже: при отказе на втором
 * шаге в галерее осталась бы запись с исчезнувшей картинкой. Здесь же
 * худший случай — невидимый файл в бакете, о котором мы честно сообщаем.
 */
export async function deletePhoto(photo: VkPhotoRow): Promise<string | null> {
  const { error } = await supabase.from("photos").delete().eq("id", photo.id);
  if (error) return friendly(error);

  const removal = await supabase.storage
    .from(PHOTO_BUCKET)
    .remove([photo.storage_path]);
  if (removal.error) {
    return "Фотография удалена, но файл остался на сервере";
  }
  return null;
}
