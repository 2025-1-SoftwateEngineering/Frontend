import { MOCK_VOCA_BOOKS, delay } from '../../../../test/mockData';
import type { VocaBook } from './types';

// ─── Voca API (maps to backend /voca) ────────────────────────────────────────
export const vocaApi = {
  getBooks: async (): Promise<VocaBook[]> => {
    await delay(400);
    return [...MOCK_VOCA_BOOKS];
  },

  getBook: async (voca_id: number): Promise<VocaBook> => {
    await delay(250);
    const book = MOCK_VOCA_BOOKS.find((b) => b.voca_id === voca_id);
    if (!book) throw new Error('단어장을 찾을 수 없습니다.');
    return { ...book, words: [...book.words] };
  },

  createBook: async (data: Omit<VocaBook, 'voca_id' | 'created_at'>): Promise<VocaBook> => {
    await delay(600);
    const newBook: VocaBook = {
      ...data,
      voca_id: Date.now(),
      created_at: new Date().toISOString(),
    };
    MOCK_VOCA_BOOKS.push(newBook);
    return newBook;
  },

  updateBook: async (
    voca_id: number,
    data: Partial<Omit<VocaBook, 'voca_id' | 'created_at'>>,
  ): Promise<VocaBook> => {
    await delay(600);
    const idx = MOCK_VOCA_BOOKS.findIndex((b) => b.voca_id === voca_id);
    if (idx === -1) throw new Error('단어장을 찾을 수 없습니다.');
    MOCK_VOCA_BOOKS[idx] = { ...MOCK_VOCA_BOOKS[idx], ...data };
    return MOCK_VOCA_BOOKS[idx];
  },

  deleteBook: async (voca_id: number): Promise<void> => {
    await delay(400);
    const idx = MOCK_VOCA_BOOKS.findIndex((b) => b.voca_id === voca_id);
    if (idx !== -1) MOCK_VOCA_BOOKS.splice(idx, 1);
  },
};
