import type { StoredPhoto } from "@/types/photo";

const DB_NAME = "tamirlanos-photos";
const DB_VERSION = 1;
const STORE = "photos";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STORE, "readonly")
      .objectStore(STORE)
      .getAll();
    request.onsuccess = () => resolve(request.result as StoredPhoto[]);
    request.onerror = () => reject(request.error);
  });
}

export async function addPhoto(photo: StoredPhoto): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(photo);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
