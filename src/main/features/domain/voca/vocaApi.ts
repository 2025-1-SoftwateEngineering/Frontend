import { apiFetch, API_URL, ADMIN_URL } from '../../../config/apiConfig';
import type { VocaBook, Word } from './types';

// ─── 백엔드 응답 타입 ──────────────────────────────────────────────────────────

interface WordDto {
  wordId:       number;
  englishWord:  string;
  meaning:      string;
}

interface WordListResult {
  words:         WordDto[];
  totalPages:    number;
  totalElements: number;
}

// GET /api/v1/voca
interface VocaDto {
  vocaId:      number;
  description: string;
  wordCount:   number;
  createdAt:   string;
}
interface VocaListResult {
  vocas:      VocaDto[];
  totalCount: number;
}

// GET /api/v1/voca/my
interface MyVocaDto {
  vocaId:          number;
  description:     string;
  learningWordCnt: number;
  correctCnt:      number;
  solvedAt:        string | null;
}
interface MyVocaListResult {
  vocas:      MyVocaDto[];
  totalCount: number;
}

// GET|POST /api/v1/voca/{vocaId}/memorize
interface MemorizedResult {
  memorizedWordIds: number[];
  totalCount:       number;
}

// GET /api/v1/voca/{vocaId}/test
interface TestQuestionDto {
  wordId:  number;
  meaning: string;
}

// POST /api/v1/voca/{vocaId}/test/submit (단건 채점, 인증 불필요)
interface SingleAnswerResult {
  wordId:          number;
  meaning:         string;
  correctAnswer:   string;
  submittedAnswer: string;
  isCorrect:       boolean;
}

// POST /api/v1/voca/{vocaId}/test/complete (전체 완료, JWT 필요)
interface TestWordResult {
  wordId:          number;
  meaning:         string;
  correctAnswer:   string;
  submittedAnswer: string;
  isCorrect:       boolean;
}

export interface TestCompleteResult {
  totalCount:   number;
  correctCount: number;
  wrongCount:   number;
  earnedCoins:  number;
  results:      TestWordResult[];
}

export interface TestSubmitAnswer {
  wordId:  number;
  answer:  string;
}

// ─── DTO → 내부 타입 변환 ──────────────────────────────────────────────────────
function toWord(dto: WordDto, vocaId: number): Word {
  return {
    word_id:      dto.wordId,
    english_word: dto.englishWord,
    meaning:      dto.meaning,
    voca_id:      vocaId,
  };
}

// ─── Voca API ─────────────────────────────────────────────────────────────────
export const vocaApi = {
  /**
   * GET /api/v1/voca/{vocaId}/words
   * 단어장의 단어 목록을 가져옵니다. (인증 불필요)
   */
  getWords: async (
    vocaId:   number,
    page:     number = 0,
    pageSize: number = 100,
  ): Promise<{ words: Word[]; totalPages: number; totalElements: number }> => {
    const query = new URLSearchParams({
      page:     String(page),
      pageSize: String(pageSize),
    });
    const res = await apiFetch<WordListResult>(`/vocabularies/${vocaId}/words?${query}`, {}, API_URL);
    return {
      words:         (res.result?.words ?? []).map((w) => toWord(w, vocaId)),
      totalPages:    res.result?.totalPages    ?? 0,
      totalElements: res.result?.totalElements ?? 0,
    };
  },

  /**
   * getBook: 기존 화면 코드와의 호환성 유지.
   * 내부적으로 getWords를 호출하여 VocaBook 형태로 반환합니다.
   */
  getBook: async (vocaId: number): Promise<VocaBook> => {
    const { words } = await vocaApi.getWords(vocaId);
    return {
      voca_id:     vocaId,
      level:       0,
      solved_coin: 0,
      created_at:  '',
      words,
    };
  },

  /**
   * GET /api/v1/voca
   * 전체 단어장 목록을 가져옵니다. (인증 불필요)
   */
  getBooks: async (): Promise<VocaBook[]> => {
    const res = await apiFetch<VocaListResult>('/vocabularies', {}, API_URL);
    return (res.result?.vocas ?? []).map((v) => ({
      voca_id:     v.vocaId,
      level:       0,
      solved_coin: 0,
      created_at:  v.createdAt,
      description: v.description,
      wordCount:   v.wordCount,
      words:       [],
    }));
  },

  /**
   * GET /api/v1/voca/my
   * 내가 학습한 단어장 목록을 가져옵니다. (JWT 필요)
   */
  getMyBooks: async (): Promise<MyVocaDto[]> => {
    const res = await apiFetch<MyVocaListResult>('/vocabularies/my', {}, API_URL);
    return res.result?.vocas ?? [];
  },

  /**
   * GET /api/v1/voca/{vocaId}/test
   * 테스트 문제(단어 ID + 뜻, 랜덤)를 가져옵니다.
   */
  getTestQuestions: async (vocaId: number): Promise<TestQuestionDto[]> => {
    const res = await apiFetch<TestQuestionDto[]>(`/vocabularies/${vocaId}/test`, {}, API_URL);
    return res.result ?? [];
  },

  /**
   * POST /api/v1/voca/{vocaId}/test/submit
   * 단어 하나를 즉시 채점합니다. (인증 불필요, 대소문자 구분 없음)
   */
  submitSingleAnswer: async (
    vocaId:  number,
    wordId:  number,
    answer:  string,
  ): Promise<SingleAnswerResult> => {
    const res = await apiFetch<SingleAnswerResult>(`/vocabularies/${vocaId}/test/submit`, {
      method: 'POST',
      body:   JSON.stringify({ wordId, answer }),
    }, API_URL);
    return res.result!;
  },

  /**
   * POST /api/v1/voca/{vocaId}/test/complete
   * 테스트 전체 완료 - 최종 결과, 획득 코인, 스트릭을 서버에 반영합니다. (JWT 필요)
   */
  completeTest: async (
    vocaId:  number,
    answers: TestSubmitAnswer[],
  ): Promise<TestCompleteResult> => {
    const res = await apiFetch<TestCompleteResult>(`/vocabularies/${vocaId}/test/complete`, {
      method: 'POST',
      body:   JSON.stringify({ answers }),
    }, API_URL);
    return res.result!;
  },

  /**
   * GET /api/v1/voca/{vocaId}/memorize
   * 해당 단어장에서 암기한 단어 ID 목록을 가져옵니다.
   */
  getMemorized: async (vocaId: number): Promise<MemorizedResult> => {
    const res = await apiFetch<MemorizedResult>(`/vocabularies/${vocaId}/memorize`, {}, API_URL);
    return res.result!;
  },

  /**
   * POST /api/v1/voca/{vocaId}/memorize
   * 암기한 단어 ID 목록을 서버에 저장합니다. (JWT 필요)
   */
  saveMemorized: async (
    vocaId:  number,
    wordIds: number[],
  ): Promise<MemorizedResult> => {
    const res = await apiFetch<MemorizedResult>(`/vocabularies/${vocaId}/memorize`, {
      method: 'POST',
      body:   JSON.stringify({ wordIds }),
    }, API_URL);
    return res.result!;
  },

  // ─── 관리자 전용 엔드포인트 (admin API 사용) ─────────────────────────────────

  createBook: async (data: Omit<VocaBook, 'voca_id' | 'created_at'>): Promise<VocaBook> => {
    const body = [{ description: data.description ?? '', solvedCoin: data.solved_coin, level: 1 }];
    const bookRes = await apiFetch<[{ id: number; addedAt: string }]>(
      '/voca-books',
      { method: 'POST', body: JSON.stringify(body) },
      ADMIN_URL,
    );
    const vocaId = bookRes.result![0].id;

    if (data.words.length > 0) {
      await apiFetch(
        '/words',
        { method: 'POST', body: JSON.stringify(data.words.map(w => ({ english: w.english_word, meaning: w.meaning, vocabularyId: vocaId }))) },
        ADMIN_URL,
      );
    }

    return { ...data, voca_id: vocaId, created_at: bookRes.result![0].addedAt };
  },

  updateBook: async (vocaId: number, data: { description?: string; solvedCoin?: number }): Promise<void> => {
    await apiFetch(`/voca-books/${vocaId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, ADMIN_URL);
  },

  deleteBook: async (vocaId: number): Promise<void> => {
    await apiFetch(`/voca-books/${vocaId}`, { method: 'DELETE' }, ADMIN_URL);
  },

  updateWord: async (wordId: number, data: { english?: string; meaning?: string }): Promise<void> => {
    await apiFetch(`/words/${wordId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, ADMIN_URL);
  },

  deleteWord: async (wordId: number): Promise<void> => {
    await apiFetch(`/words/${wordId}`, { method: 'DELETE' }, ADMIN_URL);
  },

  addWords: async (words: { english: string; meaning: string; vocabularyId: number }[]): Promise<void> => {
    if (words.length === 0) return;
    await apiFetch('/words', {
      method: 'POST',
      body: JSON.stringify(words),
    }, ADMIN_URL);
  },
};

// ─── Quiz API 타입 ─────────────────────────────────────────────────────────────

interface CursorResult<T> {
  data: T[];
  nextCursor: string;
  hasNext: boolean;
  pageSize: number;
}

export interface ChoiceListItem {
  id: number;
  solvedCoin: number;
  cnt: number;
}

export interface ChoiceOption {
  id: number;
  text: string;
}

export interface ChoiceQuestion {
  id: number;
  score: number;
  question: string;
  choices: ChoiceOption[];
}

export interface ChoiceSubmitResult {
  isCorrect: boolean;
  hasNext: boolean;
  nextCurrent: number | null;
  score: number;
}

export interface CrosswordListItem {
  id: number;
  solvedCoin: number;
  cnt: number;
}

export type ClueDirection = 'ACROSS' | 'DOWN';

export interface CrosswordClue {
  id: number;
  clueType: ClueDirection;
  wordLength: number;
  verticalStartPoint: number;
  horizontalStartPoint: number;
  clueDescription: string;
}

export interface CrosswordData {
  N: number;
  elements: CrosswordClue[];
}

export interface CrosswordSubmitResult {
  isCorrect: boolean;
  hasNext: boolean;
  score: string | null;
}

// ─── Quiz API ─────────────────────────────────────────────────────────────────

export const quizApi = {
  // ── 사지선다 ──────────────────────────────────────────────────────────────
  getChoiceList: async (): Promise<ChoiceListItem[]> => {
    const res = await apiFetch<CursorResult<ChoiceListItem>>('/choices?pageSize=50', {}, API_URL);
    return res.result?.data ?? [];
  },

  getChoiceQuestion: async (choiceId: number, current: number): Promise<ChoiceQuestion | null> => {
    try {
      const res = await apiFetch<ChoiceQuestion>(`/choices/${choiceId}?current=${current}`, {}, API_URL);
      return res.result ?? null;
    } catch {
      return null;
    }
  },

  submitChoiceAnswer: async (
    choiceId: number,
    answerId: number,
    current: number,
  ): Promise<ChoiceSubmitResult> => {
    const res = await apiFetch<ChoiceSubmitResult>(
      `/choices/${choiceId}/submit?answer=${answerId}&current=${current}`,
      { method: 'POST' },
      API_URL,
    );
    return res.result!;
  },

  createChoiceQuiz: async (
    solvedCoin: number,
    choices: { word: string; isWord: boolean }[],
  ): Promise<void> => {
    await apiFetch('/choices', {
      method: 'POST',
      body: JSON.stringify({ solvedCoin, choices }),
    }, ADMIN_URL);
  },

  // ── 십자말풀이 ────────────────────────────────────────────────────────────
  getCrosswordList: async (): Promise<CrosswordListItem[]> => {
    const res = await apiFetch<CursorResult<CrosswordListItem>>('/crosswords?pageSize=50', {}, API_URL);
    return res.result?.data ?? [];
  },

  getCrossword: async (crosswordId: number): Promise<CrosswordData> => {
    const res = await apiFetch<CrosswordData>(`/crosswords/${crosswordId}`, {}, API_URL);
    return res.result!;
  },

  submitCrosswordAnswer: async (
    crosswordId: number,
    hintId: number,
    answer: string,
  ): Promise<CrosswordSubmitResult> => {
    const params = new URLSearchParams({ crosswordHintId: String(hintId), answer });
    const res = await apiFetch<CrosswordSubmitResult>(
      `/crosswords/${crosswordId}/submit?${params}`,
      { method: 'POST' },
      API_URL,
    );
    return res.result!;
  },
};
