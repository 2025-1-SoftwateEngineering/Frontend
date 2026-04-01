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
      id: 1, email: 'user@test.com', nickname: '단어왕', role: 'USER',
      profileImage: null, profileBackground: null, profileFrame: null,
      level: 3, exp: 240,
    },
  },
  {
    password: 'admin123',
    member: {
      id: 2, email: 'admin@test.com', nickname: '관리자', role: 'ADMIN',
      profileImage: null, profileBackground: null, profileFrame: null,
      level: 10, exp: 980,
    },
  },
];

// ─── Mock vocabulary data (55 TOEIC words) ───────────────────────────────────
export let MOCK_VOCA_BOOKS: VocaBook[] = [
  {
    id: 1,
    title: 'TOEIC 필수 단어 Vol.1',
    description: '비즈니스 현장에서 자주 쓰이는 TOEIC 핵심 동사 모음',
    category: '동사',
    createdAt: '2026-01-10T09:00:00Z',
    words: [
      { id: 101, vocaBookId: 1, word: 'abandon', meaning: '포기하다, 버리다', example: 'The company decided to abandon the project due to budget cuts.' },
      { id: 102, vocaBookId: 1, word: 'accomplish', meaning: '성취하다, 이루다', example: 'She managed to accomplish all her goals this quarter.' },
      { id: 103, vocaBookId: 1, word: 'acquire', meaning: '획득하다, 얻다', example: 'The firm plans to acquire three new companies this year.' },
      { id: 104, vocaBookId: 1, word: 'adjust', meaning: '조정하다, 맞추다', example: 'Please adjust your schedule to meet the deadline.' },
      { id: 105, vocaBookId: 1, word: 'allocate', meaning: '배분하다, 할당하다', example: 'The manager will allocate resources to each department.' },
      { id: 106, vocaBookId: 1, word: 'analyze', meaning: '분석하다', example: 'We need to analyze the market data carefully.' },
      { id: 107, vocaBookId: 1, word: 'announce', meaning: '발표하다, 알리다', example: 'The CEO will announce the new policy tomorrow.' },
      { id: 108, vocaBookId: 1, word: 'anticipate', meaning: '예상하다, 기대하다', example: 'We anticipate strong sales this quarter.' },
      { id: 109, vocaBookId: 1, word: 'apply', meaning: '지원하다, 적용하다', example: 'You can apply for the position online.' },
      { id: 110, vocaBookId: 1, word: 'appoint', meaning: '임명하다', example: 'The board appointed a new director last Friday.' },
      { id: 111, vocaBookId: 1, word: 'approve', meaning: '승인하다', example: 'The committee approved the budget proposal.' },
      { id: 112, vocaBookId: 1, word: 'arrange', meaning: '준비하다, 배열하다', example: 'Please arrange a meeting for next Monday morning.' },
      { id: 113, vocaBookId: 1, word: 'assess', meaning: '평가하다', example: 'The team needs to assess the risks involved.' },
      { id: 114, vocaBookId: 1, word: 'assist', meaning: '돕다, 지원하다', example: 'Our staff will assist you during your visit.' },
      { id: 115, vocaBookId: 1, word: 'assume', meaning: '가정하다, 맡다', example: 'Do not assume the task is complete without verification.' },
      { id: 116, vocaBookId: 1, word: 'attain', meaning: '달성하다', example: 'The team attained the quarterly sales targets.' },
      { id: 117, vocaBookId: 1, word: 'authorize', meaning: '승인하다, 허가하다', example: 'Only managers can authorize overtime payments.' },
      { id: 118, vocaBookId: 1, word: 'benefit', meaning: '이익을 얻다; 혜택', example: 'Employees benefit from the flexible working policy.' },
      { id: 119, vocaBookId: 1, word: 'calculate', meaning: '계산하다', example: 'Please calculate the total cost of the project.' },
      { id: 120, vocaBookId: 1, word: 'collaborate', meaning: '협력하다', example: 'The two departments will collaborate on the new product launch.' },
    ],
  },
  {
    id: 2,
    title: 'TOEIC 필수 단어 Vol.2',
    description: '비즈니스 문서와 회의에서 핵심적으로 등장하는 단어 모음',
    category: '동사/명사',
    createdAt: '2026-01-15T09:00:00Z',
    words: [
      { id: 201, vocaBookId: 2, word: 'commitment', meaning: '헌신, 약속', example: 'The team showed great commitment to the project.' },
      { id: 202, vocaBookId: 2, word: 'compensate', meaning: '보상하다, 보충하다', example: 'The company will compensate employees for overtime work.' },
      { id: 203, vocaBookId: 2, word: 'compete', meaning: '경쟁하다', example: 'Small businesses must compete with large corporations.' },
      { id: 204, vocaBookId: 2, word: 'confirm', meaning: '확인하다', example: 'Please confirm your attendance by Friday.' },
      { id: 205, vocaBookId: 2, word: 'consider', meaning: '고려하다', example: 'We must consider all available options before deciding.' },
      { id: 206, vocaBookId: 2, word: 'contribute', meaning: '기여하다', example: 'Each employee contributes to the company\'s success.' },
      { id: 207, vocaBookId: 2, word: 'coordinate', meaning: '조율하다', example: 'She will coordinate the project schedule across teams.' },
      { id: 208, vocaBookId: 2, word: 'deadline', meaning: '마감일', example: 'The deadline for submissions is next Monday morning.' },
      { id: 209, vocaBookId: 2, word: 'delegate', meaning: '위임하다', example: 'A good manager knows how to delegate tasks effectively.' },
      { id: 210, vocaBookId: 2, word: 'demonstrate', meaning: '증명하다, 시연하다', example: 'The engineer demonstrated how the machine works.' },
      { id: 211, vocaBookId: 2, word: 'describe', meaning: '설명하다, 묘사하다', example: 'Please describe your experience in detail.' },
      { id: 212, vocaBookId: 2, word: 'develop', meaning: '개발하다, 발전시키다', example: 'The company plans to develop new software next year.' },
      { id: 213, vocaBookId: 2, word: 'distribute', meaning: '배포하다, 유통하다', example: 'We will distribute the report to all departments.' },
      { id: 214, vocaBookId: 2, word: 'efficient', meaning: '효율적인', example: 'We need a more efficient system to handle orders.' },
      { id: 215, vocaBookId: 2, word: 'evaluate', meaning: '평가하다', example: 'The manager will evaluate employee performance annually.' },
      { id: 216, vocaBookId: 2, word: 'expand', meaning: '확장하다', example: 'The company wants to expand into new markets abroad.' },
      { id: 217, vocaBookId: 2, word: 'generate', meaning: '생성하다, 발생시키다', example: 'The new product will generate significant revenue.' },
      { id: 218, vocaBookId: 2, word: 'implement', meaning: '실행하다, 시행하다', example: 'We will implement the new policy next month.' },
      { id: 219, vocaBookId: 2, word: 'negotiate', meaning: '협상하다', example: 'Both parties will negotiate the contract terms.' },
      { id: 220, vocaBookId: 2, word: 'obtain', meaning: '얻다, 획득하다', example: 'You need to obtain permission before proceeding.' },
    ],
  },
  {
    id: 3,
    title: 'TOEIC 비즈니스 영어',
    description: '직장 환경과 비즈니스 커뮤니케이션에 필수적인 어휘',
    category: '비즈니스',
    createdAt: '2026-02-01T09:00:00Z',
    words: [
      { id: 301, vocaBookId: 3, word: 'initiative', meaning: '계획, 주도권', example: 'The company launched a new marketing initiative.' },
      { id: 302, vocaBookId: 3, word: 'innovation', meaning: '혁신', example: 'Innovation is key to staying competitive in the market.' },
      { id: 303, vocaBookId: 3, word: 'inspect', meaning: '검사하다', example: 'Safety officers will inspect the facility next week.' },
      { id: 304, vocaBookId: 3, word: 'invest', meaning: '투자하다', example: 'The company plans to invest heavily in new technology.' },
      { id: 305, vocaBookId: 3, word: 'maintain', meaning: '유지하다', example: 'It is important to maintain good client relationships.' },
      { id: 306, vocaBookId: 3, word: 'optimize', meaning: '최적화하다', example: 'We should optimize our production process to cut costs.' },
      { id: 307, vocaBookId: 3, word: 'organize', meaning: '조직하다, 정리하다', example: 'Please organize the files alphabetically by date.' },
      { id: 308, vocaBookId: 3, word: 'perform', meaning: '수행하다, 실행하다', example: 'All employees must perform regular safety checks.' },
      { id: 309, vocaBookId: 3, word: 'prioritize', meaning: '우선순위를 정하다', example: 'Learn to prioritize your tasks effectively each morning.' },
      { id: 310, vocaBookId: 3, word: 'propose', meaning: '제안하다', example: 'She proposed a new marketing strategy to the board.' },
      { id: 311, vocaBookId: 3, word: 'provide', meaning: '제공하다', example: 'We provide excellent customer service at every touchpoint.' },
      { id: 312, vocaBookId: 3, word: 'qualify', meaning: '자격을 갖추다', example: 'You must qualify for the senior position through testing.' },
      { id: 313, vocaBookId: 3, word: 'reduce', meaning: '줄이다, 감소시키다', example: 'The goal is to reduce operational costs by 15%.' },
      { id: 314, vocaBookId: 3, word: 'require', meaning: '요구하다, 필요로 하다', example: 'The job requires strong communication skills.' },
      { id: 315, vocaBookId: 3, word: 'revenue', meaning: '수익, 매출', example: 'The company\'s revenue increased by 20% this year.' },
    ],
  },
];
