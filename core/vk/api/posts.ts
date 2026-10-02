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
  return error?.message ?? null;
}

export async function editPost(
  postId: string,
  content: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("posts")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", postId);
  return error?.message ?? null;
}

export async function deletePost(postId: string): Promise<void> {
  await supabase.from("posts").delete().eq("id", postId);
}

export async function setLike(
  postId: string,
  userId: string,
  liked: boolean,
): Promise<void> {
  if (liked) {
    await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    return;
  }
  await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
}

export async function addComment(
  postId: string,
  authorId: string,
  content: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, content });
  return error?.message ?? null;
}

export async function deleteComment(commentId: string): Promise<void> {
  await supabase.from("comments").delete().eq("id", commentId);
}
