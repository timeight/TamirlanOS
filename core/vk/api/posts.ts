import { friendly } from "@/core/vk/api/errors";
import { PHOTO_BUCKET, publicUrl } from "@/core/vk/api/photos";
import { supabase } from "@/core/vk/supabase";
import { fullName, type VkPostRow, type VkWallPost } from "@/core/vk/vk-types";

/**
 * Likes and comments come back as nested rows and are folded into counts here:
 * at this scale one round trip beats a view plus a second query.
 */
const WALL_SELECT = `
  id, author_id, wall_owner_id, content, created_at, updated_at,
  author:profiles!posts_author_id_fkey (
    id, username, first_name, last_name, avatar_url
  ),
  photo:photos!posts_photo_id_fkey ( id, storage_path, caption ),
  likes ( user_id ),
  comments (
    id, post_id, author_id, content, created_at,
    author:profiles!comments_author_id_fkey (
      id, username, first_name, last_name, avatar_url
    )
  )
`;

function toWallPost(row: VkPostRow, viewerId: string | null): VkWallPost {
  const comments = [...(row.comments ?? [])].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author ? fullName(row.author) : "Удалённая страница",
    authorAvatar: row.author?.avatar_url ?? null,
    content: row.content,
    createdAt: row.created_at,
    photoUrl: row.photo
      ? publicUrl(PHOTO_BUCKET, row.photo.storage_path)
      : null,
    photoCaption: row.photo?.caption ?? null,
    likes: row.likes?.length ?? 0,
    liked: Boolean(viewerId && row.likes?.some((l) => l.user_id === viewerId)),
    comments,
    mine: row.author_id === viewerId,
    onMyWall: row.wall_owner_id === viewerId,
  };
}

export async function fetchWall(
  ownerId: string,
  viewerId: string | null,
): Promise<readonly VkWallPost[]> {
  const { data } = await supabase
    .from("posts")
    .select(WALL_SELECT)
    .eq("wall_owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(50);
  const rows = (data as unknown as VkPostRow[] | null) ?? [];
  return rows.map((row) => toWallPost(row, viewerId));
}

/**
 * Лента: записи свои и друзей. Список авторов приходит из базы, потому что
 * RLS показывает клиенту только его собственные строки дружбы.
 */
export interface VkFeedPage {
  posts: readonly VkWallPost[];
  /** Пришло ровно столько, сколько просили — значит есть что показать дальше. */
  hasMore: boolean;
}

export async function fetchFeed(
  viewerId: string,
  size: number,
): Promise<VkFeedPage> {
  const { data: authors } = await supabase.rpc("feed_authors");
  const ids = (authors as string[] | null) ?? [];
  if (ids.length === 0) return { posts: [], hasMore: false };

  // Запрашиваем на одну запись больше предела: лишняя не показывается,
  // но говорит, что следующая страница существует.
  const { data } = await supabase
    .from("posts")
    .select(WALL_SELECT)
    .in("author_id", ids)
    .order("created_at", { ascending: false })
    .limit(size + 1);

  const rows = (data as unknown as VkPostRow[] | null) ?? [];
  return {
    posts: rows.slice(0, size).map((row) => toWallPost(row, viewerId)),
    hasMore: rows.length > size,
  };
}

/** Уведомление знает только id записи, а открыть нужно стену её владельца. */
export async function fetchPostWallOwner(
  postId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("posts")
    .select("wall_owner_id")
    .eq("id", postId)
    .maybeSingle();
  return (data as { wall_owner_id: string } | null)?.wall_owner_id ?? null;
}

export async function createPost(
  authorId: string,
  wallOwnerId: string,
  content: string,
  photoId?: string | null,
): Promise<string | null> {
  const { error } = await supabase.from("posts").insert({
    author_id: authorId,
    wall_owner_id: wallOwnerId,
    content,
    photo_id: photoId ?? null,
  });
  return friendly(error);
}

export async function editPost(
  postId: string,
  content: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("posts")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", postId);
  return friendly(error);
}

export async function deletePost(postId: string): Promise<string | null> {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  return friendly(error);
}

export async function setLike(
  postId: string,
  userId: string,
  liked: boolean,
): Promise<string | null> {
  if (liked) {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
    return friendly(error);
  }
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
  return friendly(error);
}

export async function addComment(
  postId: string,
  authorId: string,
  content: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, content });
  return friendly(error);
}

export async function deleteComment(commentId: string): Promise<string | null> {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  return friendly(error);
}
