import type { PhotoCategory } from "@/types/photo";

export interface CategoryInfo {
  id: PhotoCategory;
  label: string;
}

export const PHOTO_CATEGORIES: readonly CategoryInfo[] = [
  { id: "city", label: "cat.city" },
  { id: "people", label: "cat.people" },
  { id: "street", label: "cat.street" },
  { id: "nature", label: "cat.nature" },
];
