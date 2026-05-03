// ─── Enums ────────────────────────────────────────────────────────────────────

/** clue_type: 십자말풀이 힌트 방향 (DB enum: ACROSS | DOWN) */
export type ClueType = 'ACROSS' | 'DOWN';

// ─── Entities ─────────────────────────────────────────────────────────────────

/**
 * voca (단어장)
 * DB Table: voca
 */
export interface Voca {
  /** PK */
  voca_id: number;
  /** 단어장 난이도 레벨 */
  level: number;
  /** 단어장 완료 시 지급 코인 */
  solved_coin: number;
  /** 생성 시각 */
  created_at: string;
}

/**
 * word (단어)
 * DB Table: word
 */
export interface Word {
  /** PK */
  word_id: number;
  /** 영어 단어 */
  english_word: string;
  /** 한국어 의미 */
  meaning: string;
  /** FK → voca.voca_id */
  voca_id: number;
}

/**
 * choice (사지선다 미니게임)
 * DB Table: choice
 */
export interface Choice {
  /** PK */
  choice_id: number;
  /** 완료 시 지급 코인 */
  solved_coin: number;
  /** 생성 시각 */
  created_at: string;
}

/**
 * crossword (십자말풀이 미니게임)
 * DB Table: crossword
 */
export interface Crossword {
  /** PK */
  crossword_id: number;
  /** 완료 시 지급 코인 */
  solved_coin: number;
  /** 생성 시각 */
  created_at: string;
}

/**
 * member_voca (사용자 단어장)
 * DB Table: member_voca
 */
export interface MemberVoca {
  /** PK */
  member_voca_id: number;
  /** 학습 중인 단어 수 */
  learning_word_cnt: number;
  /** 맞힌 단어 수 */
  correct_cnt: number;
  /** 완료 시각 (NULL = 미완료) */
  solved_at: string | null;
  /** FK → member.member_id */
  member_id: number;
  /** FK → voca.voca_id */
  voca_id: number;
}

/**
 * member_choice (사용자 사지선다)
 * DB Table: member_choice
 */
export interface MemberChoice {
  /** PK */
  member_choice_id: number;
  /** 완료 시각 (NULL = 미완료) */
  solved_at: string | null;
  /** 맞힌 문제 수 */
  correct_cnt: number;
  /** 점수 */
  score: number;
  /** FK → member.member_id */
  member_id: number;
  /** FK → choice.choice_id */
  choice_id: number;
}

/**
 * member_crossword (사용자 십자말풀이)
 * DB Table: member_crossword
 */
export interface MemberCrossword {
  /** PK */
  member_crossword_id: number;
  /** 완료 시각 (NULL = 미완료) */
  solved_at: string | null;
  /** 맞힌 단어 수 */
  correct_cnt: number;
  /** 점수 */
  score: number;
  /** FK → member.member_id */
  member_id: number;
  /** FK → crossword.crossword_id */
  crossword_id: number;
}

/**
 * choice_question (사지선다 질문)
 * DB Table: choice_question
 */
export interface ChoiceQuestion {
  /** PK */
  choice_question_id: number;
  /** FK → choice.choice_id */
  choice_id: number;
  /** FK → word.word_id */
  word_id: number;
}

/**
 * crossword_hint (십자말풀이 힌트)
 * DB Table: crossword_hint
 */
export interface CrosswordHint {
  /** PK */
  crossword_hint_id: number;
  /** 힌트 방향 (ACROSS | DOWN) */
  clue_type: ClueType;
  /** 힌트 내용 */
  clue_content: string;
  /** FK → crossword.crossword_id */
  crossword_id: number;
  /** FK → word.word_id */
  word_id: number;
}

// ─── Frontend Aggregation Types ───────────────────────────────────────────────

/**
 * VocaBook: 프론트엔드 전용 집계 타입 (Voca + Words)
 * 실제 API는 voca + word 목록을 조합하여 반환
 */
export interface VocaBook extends Voca {
  words: Word[];
}

// ─── Progress Tracking (Frontend-Only) ───────────────────────────────────────

export interface TestResult {
  score: number;
  total: number;
  date: string;
}

export interface BookProgress {
  learnedWordIds: number[];
  testResults: TestResult[];
}

export type AllProgress = Record<number, BookProgress>;
