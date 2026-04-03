import { createContext, useContext, useState } from 'react';
import { demoVocaBooks } from '../data/vocaData';

const VocaContext = createContext(null);

export function VocaProvider({ children }) {
  const [vocaBooks, setVocaBooks] = useState(demoVocaBooks);

  const addVocaBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
      learnedWords: 0,
      totalWords: book.words?.length || 0,
    };
    setVocaBooks((prev) => [...prev, newBook]);
    return newBook;
  };

  const updateVocaBook = (bookId, updates) => {
    setVocaBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, ...updates, totalWords: updates.words?.length ?? b.totalWords }
          : b
      )
    );
  };

  const deleteVocaBook = (bookId) => {
    setVocaBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const getVocaBook = (bookId) => {
    return vocaBooks.find((b) => b.id === Number(bookId));
  };

  return (
    <VocaContext.Provider value={{ vocaBooks, addVocaBook, updateVocaBook, deleteVocaBook, getVocaBook }}>
      {children}
    </VocaContext.Provider>
  );
}

export function useVoca() {
  const ctx = useContext(VocaContext);
  if (!ctx) throw new Error('useVoca must be used within VocaProvider');
  return ctx;
}
