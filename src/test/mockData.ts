import type { Member } from '../main/features/domain/member/types';
import type { VocaBook } from '../main/features/domain/voca/types';

// ─── Mock delay ───────────────────────────────────────────────────────────────
export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Mock users ───────────────────────────────────────────────────────────────
export interface MockUser { password: string; member: Member }

export const MOCK_USERS: MockUser[] = [
  {
    password: 'user123',
    member: {
      member_id: 1,
      email: 'user@test.com',
      nickname: '단어왕',
      authorize: 'ROLE_USER',
      login_at: new Date().toISOString(),
      streak: 5,
      coin: 120,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
  },
  {
    password: 'admin123',
    member: {
      member_id: 2,
      email: 'admin@test.com',
      nickname: '관리자',
      authorize: 'ROLE_ADMIN',
      login_at: new Date().toISOString(),
      streak: 10,
      coin: 500,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      deleted_at: null,
    },
  },
];

// ─── Mock vocabulary data (55 TOEIC words) ───────────────────────────────────
export let MOCK_VOCA_BOOKS: VocaBook[] = [
  {
    voca_id: 1,
    level: 1,
    solved_coin: 50,
    created_at: '2026-01-10T09:00:00Z',
    words: [
      { word_id: 101, voca_id: 1, english_word: 'abandon',    meaning: '포기하다, 버리다' },
      { word_id: 102, voca_id: 1, english_word: 'accomplish', meaning: '성취하다, 이루다' },
      { word_id: 103, voca_id: 1, english_word: 'acquire',    meaning: '획득하다, 얻다' },
      { word_id: 104, voca_id: 1, english_word: 'adjust',     meaning: '조정하다, 맞추다' },
      { word_id: 105, voca_id: 1, english_word: 'allocate',   meaning: '배분하다, 할당하다' },
      { word_id: 106, voca_id: 1, english_word: 'analyze',    meaning: '분석하다' },
      { word_id: 107, voca_id: 1, english_word: 'announce',   meaning: '발표하다, 알리다' },
      { word_id: 108, voca_id: 1, english_word: 'anticipate', meaning: '예상하다, 기대하다' },
      { word_id: 109, voca_id: 1, english_word: 'apply',      meaning: '지원하다, 적용하다' },
      { word_id: 110, voca_id: 1, english_word: 'appoint',    meaning: '임명하다' },
      { word_id: 111, voca_id: 1, english_word: 'approve',    meaning: '승인하다' },
      { word_id: 112, voca_id: 1, english_word: 'arrange',    meaning: '준비하다, 배열하다' },
      { word_id: 113, voca_id: 1, english_word: 'assess',     meaning: '평가하다' },
      { word_id: 114, voca_id: 1, english_word: 'assist',     meaning: '돕다, 지원하다' },
      { word_id: 115, voca_id: 1, english_word: 'assume',     meaning: '가정하다, 맡다' },
      { word_id: 116, voca_id: 1, english_word: 'attain',     meaning: '달성하다' },
      { word_id: 117, voca_id: 1, english_word: 'authorize',  meaning: '승인하다, 허가하다' },
      { word_id: 118, voca_id: 1, english_word: 'benefit',    meaning: '이익을 얻다; 혜택' },
      { word_id: 119, voca_id: 1, english_word: 'calculate',  meaning: '계산하다' },
      { word_id: 120, voca_id: 1, english_word: 'collaborate',meaning: '협력하다' },
    ],
  },
  {
    voca_id: 2,
    level: 2,
    solved_coin: 80,
    created_at: '2026-01-15T09:00:00Z',
    words: [
      { word_id: 201, voca_id: 2, english_word: 'commitment',  meaning: '헌신, 약속' },
      { word_id: 202, voca_id: 2, english_word: 'compensate',  meaning: '보상하다, 보충하다' },
      { word_id: 203, voca_id: 2, english_word: 'compete',     meaning: '경쟁하다' },
      { word_id: 204, voca_id: 2, english_word: 'confirm',     meaning: '확인하다' },
      { word_id: 205, voca_id: 2, english_word: 'consider',    meaning: '고려하다' },
      { word_id: 206, voca_id: 2, english_word: 'contribute',  meaning: '기여하다' },
      { word_id: 207, voca_id: 2, english_word: 'coordinate',  meaning: '조율하다' },
      { word_id: 208, voca_id: 2, english_word: 'deadline',    meaning: '마감일' },
      { word_id: 209, voca_id: 2, english_word: 'delegate',    meaning: '위임하다' },
      { word_id: 210, voca_id: 2, english_word: 'demonstrate', meaning: '증명하다, 시연하다' },
      { word_id: 211, voca_id: 2, english_word: 'describe',    meaning: '설명하다, 묘사하다' },
      { word_id: 212, voca_id: 2, english_word: 'develop',     meaning: '개발하다, 발전시키다' },
      { word_id: 213, voca_id: 2, english_word: 'distribute',  meaning: '배포하다, 유통하다' },
      { word_id: 214, voca_id: 2, english_word: 'efficient',   meaning: '효율적인' },
      { word_id: 215, voca_id: 2, english_word: 'evaluate',    meaning: '평가하다' },
      { word_id: 216, voca_id: 2, english_word: 'expand',      meaning: '확장하다' },
      { word_id: 217, voca_id: 2, english_word: 'generate',    meaning: '생성하다, 발생시키다' },
      { word_id: 218, voca_id: 2, english_word: 'implement',   meaning: '실행하다, 시행하다' },
      { word_id: 219, voca_id: 2, english_word: 'negotiate',   meaning: '협상하다' },
      { word_id: 220, voca_id: 2, english_word: 'obtain',      meaning: '얻다, 획득하다' },
    ],
  },
  {
    voca_id: 3,
    level: 3,
    solved_coin: 120,
    created_at: '2026-02-01T09:00:00Z',
    words: [
      { word_id: 301, voca_id: 3, english_word: 'initiative',  meaning: '계획, 주도권' },
      { word_id: 302, voca_id: 3, english_word: 'innovation',  meaning: '혁신' },
      { word_id: 303, voca_id: 3, english_word: 'inspect',     meaning: '검사하다' },
      { word_id: 304, voca_id: 3, english_word: 'invest',      meaning: '투자하다' },
      { word_id: 305, voca_id: 3, english_word: 'maintain',    meaning: '유지하다' },
      { word_id: 306, voca_id: 3, english_word: 'optimize',    meaning: '최적화하다' },
      { word_id: 307, voca_id: 3, english_word: 'organize',    meaning: '조직하다, 정리하다' },
      { word_id: 308, voca_id: 3, english_word: 'perform',     meaning: '수행하다, 실행하다' },
      { word_id: 309, voca_id: 3, english_word: 'prioritize',  meaning: '우선순위를 정하다' },
      { word_id: 310, voca_id: 3, english_word: 'propose',     meaning: '제안하다' },
      { word_id: 311, voca_id: 3, english_word: 'provide',     meaning: '제공하다' },
      { word_id: 312, voca_id: 3, english_word: 'qualify',     meaning: '자격을 갖추다' },
      { word_id: 313, voca_id: 3, english_word: 'reduce',      meaning: '줄이다, 감소시키다' },
      { word_id: 314, voca_id: 3, english_word: 'require',     meaning: '요구하다, 필요로 하다' },
      { word_id: 315, voca_id: 3, english_word: 'revenue',     meaning: '수익, 매출' },
    ],
  },
];
