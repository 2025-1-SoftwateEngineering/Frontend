import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { ApiResponse } from '../main/config/apiConfig'

const AUTH  = 'https://vocabuddy.site/auth/v1'
const API   = 'https://vocabuddy.site/api/v1'

function ok<T>(result: T): ApiResponse<T> {
  return { isSuccess: true, code: 'SUCCESS', message: '성공', result }
}

function fail(message: string): ApiResponse<null> {
  return { isSuccess: false, code: 'ERROR', message, result: null }
}

// ── 공통 모킹 응답 데이터 ─────────────────────────────────────────────────────────

export const MOCK_PROFILE = {
  nickname: '단어왕',
  email: 'user@test.com',
  streak: 5,
  coin: 120,
  authorize: 'ROLE_USER',
  profileUrl: '',
  images: [],
}

export const MOCK_TOKEN = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  refreshExpiration: '2027-01-01T00:00:00Z',
}

export const MOCK_ITEMS = [
  { itemId: 1, name: '연속학습 프리즈',    price: 200, itemType: 'STREAK_FREEZE' },
  { itemId: 2, name: '펫 음식',            price: 50,  itemType: 'PET_FOOD'      },
  { itemId: 3, name: '펫 물',              price: 30,  itemType: 'PET_WATER'     },
  { itemId: 4, name: '사지선다 +10초',      price: 80,  itemType: 'CHOICE_TIME_10' },
  { itemId: 5, name: '십자말 시작 힌트',    price: 100, itemType: 'CROSSWORD_HINT_START' },
  { itemId: 6, name: '무료 기본 아이템',    price: 0,   itemType: 'PET_BG'        },
]

export const MOCK_MY_ITEMS = [
  { item: MOCK_ITEMS[0], count: 2, isEquipped: false },
  { item: MOCK_ITEMS[1], count: 3, isEquipped: false },
  { item: MOCK_ITEMS[2], count: 1, isEquipped: false },
  { item: MOCK_ITEMS[3], count: 0, isEquipped: false },
]

export const MOCK_PET = {
  petId: 1,
  level: 1,
  stage: 'BABY',
  currentXp: 100,
  hunger: 50,
  thirst: 30,
  activeBackgroundItemId: null,
  activeAccessoryItemId: null,
  petImageUrl: '',
  activeBackgroundUrl: null,
  activeAccessoryUrl: null,
  foodCount: 3,
  waterCount: 1,
}

export const MOCK_CROSSWORD = {
  N: 5,
  elements: [
    {
      id: 1,
      clueType: 'ACROSS',
      wordLength: 3,
      verticalStartPoint: 0,
      horizontalStartPoint: 0,
      clueDescription: '빨갛고 달콤한 과일',
    },
    {
      id: 2,
      clueType: 'DOWN',
      wordLength: 4,
      verticalStartPoint: 0,
      horizontalStartPoint: 2,
      clueDescription: '동물의 왕',
    },
  ],
}

export const MOCK_CHOICE_QUESTION = {
  id: 1,
  score: 0,
  question: '포기하다, 버리다',
  choices: [
    { id: 1, text: 'abandon'    },
    { id: 2, text: 'accomplish' },
    { id: 3, text: 'acquire'    },
    { id: 4, text: 'adjust'     },
  ],
}

// ── MSW 핸들러 ────────────────────────────────────────────────────────────────

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post(`${AUTH}/login`, () =>
    HttpResponse.json(ok(MOCK_TOKEN))
  ),
  http.post(`${AUTH}/sign-up`, () =>
    HttpResponse.json(ok(MOCK_TOKEN))
  ),
  http.post(`${AUTH}/reissue`, () =>
    HttpResponse.json(ok(MOCK_TOKEN))
  ),

  // ── Member ────────────────────────────────────────────────────────────────
  http.get(`${API}/members/me`, () =>
    HttpResponse.json(ok(MOCK_PROFILE))
  ),
  http.patch(`${API}/members/me`, () =>
    HttpResponse.json(ok({ ...MOCK_PROFILE, nickname: '새닉네임' }))
  ),

  // ── Store ─────────────────────────────────────────────────────────────────
  http.get(`${API}/store/items`, () =>
    HttpResponse.json(ok({ items: MOCK_ITEMS, totalCount: MOCK_ITEMS.length }))
  ),
  http.get(`${API}/store/my-items`, () =>
    HttpResponse.json(ok({ items: MOCK_MY_ITEMS, totalCount: MOCK_MY_ITEMS.length }))
  ),
  http.post(`${API}/store/items/:itemId/purchase`, () =>
    HttpResponse.json(ok({ remainingCoins: 70, purchasedItem: MOCK_ITEMS[1] }))
  ),
  http.post(`${API}/store/items/:itemId/use`, () =>
    HttpResponse.json(ok({ itemName: '펫 음식', remainingCount: 2, hintResult: null }))
  ),

  // ── Vocabulary ────────────────────────────────────────────────────────────
  http.get(`${API}/vocabularies`, () =>
    HttpResponse.json(ok({
      vocas: [
        { vocaId: 1, description: 'TOEIC 기본',  wordCount: 20, createdAt: '2026-01-10T09:00:00Z' },
        { vocaId: 2, description: 'TOEIC 심화',  wordCount: 20, createdAt: '2026-01-15T09:00:00Z' },
      ],
      totalCount: 2,
    }))
  ),
  http.get(`${API}/vocabularies/my`, () =>
    HttpResponse.json(ok({ vocas: [], totalCount: 0 }))
  ),
  http.get(`${API}/vocabularies/:vocaId/words`, () =>
    HttpResponse.json(ok({
      words: [
        { wordId: 101, englishWord: 'abandon',    meaning: '포기하다' },
        { wordId: 102, englishWord: 'accomplish', meaning: '성취하다' },
      ],
      totalPages: 1,
      totalElements: 2,
    }))
  ),
  http.get(`${API}/vocabularies/:vocaId/test`, () =>
    HttpResponse.json(ok([
      { wordId: 101, meaning: '포기하다' },
      { wordId: 102, meaning: '성취하다' },
    ]))
  ),
  http.post(`${API}/vocabularies/:vocaId/test/submit`, () =>
    HttpResponse.json(ok({
      wordId: 101, meaning: '포기하다',
      correctAnswer: 'abandon', submittedAnswer: 'abandon', isCorrect: true,
    }))
  ),
  http.post(`${API}/vocabularies/:vocaId/test/complete`, () =>
    HttpResponse.json(ok({
      totalCount: 2, correctCount: 2, wrongCount: 0, earnedCoins: 50, results: [],
    }))
  ),

  // ── Choices (사지선다) ─────────────────────────────────────────────────────
  http.get(`${API}/choices`, () =>
    HttpResponse.json(ok({
      data: [
        { id: 1, solvedCoin: 50, cnt: 10 },
        { id: 2, solvedCoin: 80, cnt: 5  },
      ],
      nextCursor: '', hasNext: false, pageSize: 50,
    }))
  ),
  http.get(`${API}/choices/:choiceId`, () =>
    HttpResponse.json(ok(MOCK_CHOICE_QUESTION))
  ),
  http.post(`${API}/choices/:choiceId/submit`, () =>
    HttpResponse.json(ok({ isCorrect: true, hasNext: true, nextCurrent: 1, score: 10 }))
  ),

  // ── Crossword (십자말풀이) ─────────────────────────────────────────────────
  http.get(`${API}/crosswords`, () =>
    HttpResponse.json(ok({
      data: [
        { id: 1, solvedCoin: 100, cnt: 5 },
        { id: 2, solvedCoin: 150, cnt: 2 },
      ],
      nextCursor: '', hasNext: false, pageSize: 50,
    }))
  ),
  http.get(`${API}/crosswords/:crosswordId`, () =>
    HttpResponse.json(ok(MOCK_CROSSWORD))
  ),
  http.post(`${API}/crosswords/:crosswordId/submit`, () =>
    HttpResponse.json(ok({ isCorrect: true, hasNext: false, score: '100' }))
  ),

  // ── Pet ───────────────────────────────────────────────────────────────────
  http.get(`${API}/pets/me`, () =>
    HttpResponse.json(ok(MOCK_PET))
  ),
  http.post(`${API}/pets`, () =>
    HttpResponse.json(ok({ ...MOCK_PET, stage: 'EGG', currentXp: 0, hunger: 0, thirst: 0 }))
  ),
]

export { fail }
export const server = setupServer(...handlers)
