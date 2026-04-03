// domain/voca에 대응하는 서비스
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const vocaService = {
  // 단어장 목록 조회
  async getVocaBooks() {
    const res = await fetch(`${API_BASE}/api/voca/books`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('단어장 목록 조회 실패');
    return res.json();
  },

  // 단어장 단일 조회
  async getVocaBook(bookId) {
    const res = await fetch(`${API_BASE}/api/voca/books/${bookId}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('단어장 조회 실패');
    return res.json();
  },

  // 단어장 생성 (관리자)
  async createVocaBook(data) {
    const res = await fetch(`${API_BASE}/api/voca/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('단어장 생성 실패');
    return res.json();
  },

  // 단어장 수정 (관리자)
  async updateVocaBook(bookId, data) {
    const res = await fetch(`${API_BASE}/api/voca/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('단어장 수정 실패');
    return res.json();
  },

  // 단어장 삭제 (관리자)
  async deleteVocaBook(bookId) {
    const res = await fetch(`${API_BASE}/api/voca/books/${bookId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('단어장 삭제 실패');
    return res.json();
  },

  // 학습 진도 업데이트
  async updateProgress(bookId, wordId) {
    const res = await fetch(`${API_BASE}/api/voca/books/${bookId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('진도 업데이트 실패');
    return res.json();
  },
};
