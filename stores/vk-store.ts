import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  VK_PROFILE,
  VK_SEED_POSTS,
  type VkPost,
} from "@/core/browser/vk/vk-data";

interface VkStore {
  posts: VkPost[];
  /** Post ids whose comment thread is expanded. */
  open: string[];
  toggleLike: (postId: string) => void;
  toggleComments: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  removeComment: (postId: string, commentId: string) => void;
  publish: (text: string) => void;
  reset: () => void;
}

let counter = 0;

function id(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

function stamp(): string {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return `сегодня в ${time}`;
}

export const useVkStore = create<VkStore>()(
  persist(
    (set) => ({
      posts: VK_SEED_POSTS.map((post) => ({
        ...post,
        comments: [...post.comments],
      })),
      open: [],

      toggleLike: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likes: post.likes + (post.liked ? -1 : 1),
                }
              : post,
          ),
        })),

      toggleComments: (postId) =>
        set((state) => ({
          open: state.open.includes(postId)
            ? state.open.filter((item) => item !== postId)
            : [...state.open, postId],
        })),

      addComment: (postId, text) =>
        set((state) => ({
          open: state.open.includes(postId)
            ? state.open
            : [...state.open, postId],
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: id("c"),
                      author: VK_PROFILE.name,
                      text,
                      at: stamp(),
                    },
                  ],
                }
              : post,
          ),
        })),

      removeComment: (postId, commentId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (item) => item.id !== commentId,
                  ),
                }
              : post,
          ),
        })),

      publish: (text) =>
        set((state) => ({
          posts: [
            {
              id: id("post"),
              author: VK_PROFILE.name,
              at: stamp(),
              text,
              likes: 0,
              liked: false,
              comments: [],
            },
            ...state.posts,
          ],
        })),

      reset: () =>
        set({
          posts: VK_SEED_POSTS.map((post) => ({
            ...post,
            comments: [...post.comments],
          })),
          open: [],
        }),
    }),
    { name: "tamirlanos:vk" },
  ),
);
