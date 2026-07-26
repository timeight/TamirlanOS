import type { PhotoCategory } from "@/types/photo";

export interface CategoryInfo {
  id: PhotoCategory;
  label: string;
}

export const PHOTO_CATEGORIES: readonly CategoryInfo[] = [
  { id: "city", label: "Город" },
  { id: "people", label: "Люди" },
  { id: "street", label: "Стрит" },
  { id: "nature", label: "Природа" },
];
