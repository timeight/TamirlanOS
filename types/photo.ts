export type PhotoCategory = "city" | "people" | "street" | "nature";

export interface StoredPhoto {
  id: string;
  category: PhotoCategory;
  name: string;
  createdAt: number;
  dataUrl: string;
}
