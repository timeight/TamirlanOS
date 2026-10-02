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

export async function uploadAvatar(
  ownerId: string,
  file: File,
): Promise<string | null> {
  const bad = reject(file);
  if (bad) return bad;

  const path = objectPath(ownerId, file);
  const upload = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: false });
  if (upload.error) return upload.error.message;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl(AVATAR_BUCKET, path) })
    .eq("id", ownerId);
  return error?.message ?? null;
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
  if (upload.error) return upload.error.message;

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
  if (error || !data) return error?.message ?? "Не удалось сохранить фото";

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

export async function fetchPhoto(id: string): Promise<VkPhotoRow | null> {
  const { data } = await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as VkPhotoRow | null) ?? null;
}

export async function deletePhoto(photo: VkPhotoRow): Promise<string | null> {
  const { error } = await supabase.from("photos").delete().eq("id", photo.id);
  if (error) return error.message;
  await supabase.storage.from(PHOTO_BUCKET).remove([photo.storage_path]);
  return null;
}
