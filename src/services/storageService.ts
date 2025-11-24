import { Book } from '../types';

const DB_NAME = 'AIScribeDB';
const STORE_NAME = 'books';
const DB_VERSION = 1;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'createdAt' });
      }
    };
  });
};

export const saveBook = async (book: Book): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(book); 
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to save book to history:", error);
  }
};

export const getRecentBooks = async (): Promise<Book[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const books = request.result as Book[];
        // Sort by date descending
        books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(books);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
};

export const deleteBook = async (createdAt: Date): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(createdAt);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
  } catch (error) {
      console.error("Failed to delete book:", error);
  }
}