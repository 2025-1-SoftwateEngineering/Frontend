# 📖 SCOI — 스마트 영단어 학습 앱 (프론트엔드)

TOEIC 단어 학습에 특화된 모바일 웹 앱입니다.  
React + Vite + Tailwind CSS 기반으로 구현된 프론트엔드이며, Java Spring 백엔드와의 연동을 전제로 설계되었습니다.

---

## 시작하기

### 사전 요구 사항

| 도구 | 권장 버전 | 확인 명령어 |
|------|-----------|-------------|
| Node.js | 20 이상 | `node -v` |
| pnpm | 9 이상 | `pnpm -v` |
| Git | 최신 | `git --version` |

> **pnpm이 없다면**  
> ```bash
> npm install -g pnpm
> ```

---

### 1. 저장소 클론

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
```

---

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 열어 백엔드 URL을 입력합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

> 현재는 `mockData.ts`의 인메모리 Mock API를 사용하므로,  
> 백엔드가 준비되기 전까지 이 변수를 비워 두어도 앱이 정상 동작합니다.

---

### 3. 의존성 설치

```bash
pnpm install
```

---

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173` 접속 후 데모 계정으로 로그인합니다.

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| 일반 유저 | `user@test.com` | `user123` |
| 관리자 | `admin@test.com` | `admin123` |

---

### 5. 자주 쓰는 명령어

```bash
pnpm dev          # 개발 서버 실행 (HMR 포함)
pnpm build        # 프로덕션 빌드 → dist/
pnpm preview      # 빌드 결과물 로컬 미리보기
pnpm type-check   # TypeScript 타입 검사 (emit 없음)
```

---

### 6. 권장 VSCode 확장

| 확장 | 용도 |
|------|------|
| ESLint | 코드 품질 |
| Prettier | 코드 포맷 |
| Tailwind CSS IntelliSense | 클래스 자동완성 |
| TypeScript (내장) | 타입 지원 |

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **이메일 로그인 / 회원가입** | 이메일·비밀번호 기반 인증, 세션 복원(localStorage) |
| **역할 기반 접근 제어** | `USER` / `ADMIN` 두 가지 역할, 관리자 전용 UI 분기 |
| **단어장 목록** | 50개 이상의 TOEIC 단어장 제공, 카테고리별 탐색 |
| **단어장 상세** | 단어 카드 뷰, 학습 진도·테스트 점수 표시 |
| **단어 암기 모드** | 플래시카드 방식, 좌/우 스와이프로 학습 완료 처리 |
| **단어 테스트** | 뜻을 보고 영어 스펠링 직접 입력, 예문 내 단어 마스킹 `( ? )` |
| **테스트 결과** | 점수·정답수·획득 XP 표시, 오답 복습 목록 |
| **XP / 레벨 시스템** | 정답 1개당 10 XP, 100 XP마다 레벨업 |
| **관리자 단어장 CRUD** | 단어장 생성·수정·삭제, 단어 행 동적 추가/삭제, 중복 단어 실시간 감지 |
| **프로필 편집** | 닉네임·프로필 이미지·배경·프레임 변경 |
| **상점 / 친구** | UI 구현 완료 (기능 확장 예정) |

---

## 기술 스택

### 코어

| 항목 | 버전 | 역할 |
|------|------|------|
| React | 18.3.1 | UI 렌더링 |
| Vite | 6.3.5 | 번들러 / 개발 서버 |
| TypeScript | (vite 내장) | 정적 타입 |
| Tailwind CSS | 4.1.12 | 유틸리티 스타일링 |

### 주요 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| react-router | 7.13.0 | 클라이언트 사이드 라우팅 (Data Mode) |
| motion | 12.23.24 | 애니메이션 (`motion/react` 서브패스 사용) |
| lucide-react | 0.487.0 | 아이콘 |
| react-hook-form | 7.55.0 | 폼 상태 관리 |
| recharts | 2.15.2 | 차트 |
| @radix-ui/* | 다수 | 접근성 준수 헤드리스 UI 컴포넌트 |
| sonner | 2.0.3 | Toast 알림 |
| canvas-confetti | 1.9.4 | 축하 이펙트 |
| tailwind-merge / clsx | — | 조건부 클래스 병합 |

---

## 프로젝트 구조

```
src/
└── app/
    ├── App.tsx                  # 앱 루트: Provider 트리 + RouterProvider
    ├── routes.ts                # react-router createBrowserRouter 라우트 정의
    │
    ├── types/
    │   └── index.ts             # 전역 TypeScript 인터페이스 (도메인별 분리)
    │
    ├── data/
    │   └── mockData.ts          # API 계층 목(Mock) 구현체
    │                            # → 백엔드 연동 시 fetch 호출로 교체
    │
    ├── context/
    │   ├── AuthContext.tsx      # 인증 전역 상태 (currentUser, login, logout …)
    │   └── ProgressContext.tsx  # 학습 진도 전역 상태 (XP, 레벨, 암기 기록)
    │
    ├── components/
    │   ├── MobileLayout.tsx     # 스마트폰 뷰포트 시뮬레이션 래퍼 (max-width: 430px)
    │   ├── BottomNav.tsx        # 하단 탭바 (5개 탭)
    │   ├── ConfirmModal.tsx     # 공용 확인 다이얼로그
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx  # 이미지 폴백 처리 컴포넌트
    │   └── ui/                  # shadcn/ui 기반 기본 UI 컴포넌트 모음
    │
    └── pages/
        ├── SplashScreen.tsx         # (1) 스플래시
        ├── WelcomeScreen.tsx        # (2) 첫 인사
        ├── LoginOptionsScreen.tsx   # (3) 로그인 방식 선택
        ├── EmailLoginScreen.tsx     # (4) 이메일 로그인
        ├── ForgotPasswordScreen.tsx # (5) 비밀번호 찾기
        ├── RegisterScreen.tsx       # (6) 회원가입
        ├── AppLayout.tsx            # 인증 가드 + 하단 탭 레이아웃
        ├── HomeScreen.tsx           # (7) 홈
        ├── ShopScreen.tsx           # (8) 상점
        ├── FriendsScreen.tsx        # (9) 친구
        ├── VocabularyListScreen.tsx # (10) 단어장 목록
        ├── VocabularyBookScreen.tsx # (11) 단어장 상세
        ├── WordTestScreen.tsx       # (12) 단어 테스트
        ├── WordMemorizeScreen.tsx   # (13) 단어 암기
        ├── VocabularyEditScreen.tsx # (14) 관리자 단어장 생성/편집
        ├── ProfileScreen.tsx        # (15) 프로필
        └── ProfileEditScreen.tsx    # (16) 프로필 편집
```

---

## 아키텍처

### 1. 라우팅 — React Router Data Mode

`createBrowserRouter` (Data Mode)를 사용합니다.  
`AppLayout`이 중첩 라우트의 부모로, **인증 가드**와 **하단 탭바**를 담당합니다.

```
/                    → SplashScreen
/welcome             → WelcomeScreen
/login               → LoginOptionsScreen
/login/email         → EmailLoginScreen
/login/forgot-password → ForgotPasswordScreen
/register            → RegisterScreen

[AppLayout] — 인증 가드 + BottomNav
  /home              → HomeScreen
  /shop              → ShopScreen
  /friends           → FriendsScreen
  /vocabulary        → VocabularyListScreen
  /profile           → ProfileScreen

[Full-screen — 하단 탭바 없음]
  /vocabulary/create         → VocabularyEditScreen (생성)
  /vocabulary/:bookId        → VocabularyBookScreen
  /vocabulary/:bookId/test   → WordTestScreen
  /vocabulary/:bookId/memorize → WordMemorizeScreen
  /vocabulary/:bookId/edit   → VocabularyEditScreen (수정)
  /profile/edit              → ProfileEditScreen
```

### 2. 전역 상태 — React Context

두 개의 Context가 `App.tsx`에서 Provider 형태로 앱 전체를 감쌉니다.

#### `AuthContext`
- 책임: 로그인 세션 관리
- 저장소: `localStorage` (`scoi_auth_user` 키)
- 제공 값: `currentUser`, `isLoading`, `login()`, `logout()`, `register()`, `updateUser()`, `deleteAccount()`
- 세션 복원: 앱 마운트 시 `localStorage`에서 유저 정보를 읽어 자동 복원

#### `ProgressContext`
- 책임: 단어별 암기 기록, 테스트 점수, XP/레벨 누적
- 저장소: `localStorage` (`scoi_progress`, `scoi_exp` 두 키)
- 제공 값: `progress`, `markLearned()`, `addTestResult()`, `getBookProgress()`, `totalExp`, `level`
- 레벨 계산: `Math.floor(exp / 100) + 1`

### 3. 데이터 계층 — mockData.ts

백엔드 도메인 구조(`auth`, `member`, `voca`)에 맞게 API 네임스페이스를 분리합니다.

```ts
authApi.login(req)           // POST /auth/login
authApi.register(req)        // POST /auth/register

memberApi.updateMember(id, data)  // PATCH /member/:id
memberApi.deleteMember(id)        // DELETE /member/:id

vocaApi.getBooks()           // GET /voca
vocaApi.getBook(id)          // GET /voca/:id
vocaApi.createBook(data)     // POST /voca
vocaApi.updateBook(id, data) // PUT /voca/:id
vocaApi.deleteBook(id)       // DELETE /voca/:id
```

현재는 모두 인메모리 Mock 구현체이며, **각 함수를 실제 `fetch` 호출로 교체**하는 것만으로 백엔드 연동이 완료됩니다.

### 4. 타입 시스템 — types/index.ts

백엔드 도메인 구조와 1:1로 대응하는 인터페이스를 정의합니다.

```
auth 도메인
  └── LoginRequest, RegisterRequest

member 도메인
  └── Role ('USER' | 'ADMIN'), Member

voca 도메인
  └── Word, VocaBook

로컬 전용 (백엔드 비연동)
  └── TestResult, BookProgress, AllProgress
```

### 5. 역할 기반 UI 분기

`currentUser.role === 'ADMIN'` 조건으로 관리자 전용 기능을 렌더링합니다.

- **단어장 목록**: 관리자일 때 "새 단어장 만들기" 버튼 노출
- **단어장 상세**: 관리자일 때 편집·삭제 버튼 노출
- **VocabularyEditScreen**: 단어 CRUD 전용 화면 (일반 유저 접근 불가)

### 6. 단어 테스트 핵심 로직

1. 단어 목록을 `sort(() => Math.random() - 0.5)`로 셔플
2. 예문 내 정답 단어를 정규식으로 탐지 → `( ? )` 뱃지로 마스킹 (대소문자 무관, 변형어 포함)
3. 정답 확인 후 마스킹 해제 → 원문 노출
4. 오답 시 정답 단어를 즉시 표시 (복습 유도)
5. 전체 종료 시 XP 계산 후 `ProgressContext.addTestResult()` 호출

### 7. 관리자 단어장 편집 — 중복 감지

렌더 시점마다 `Set<string>`으로 중복 rowId를 추적합니다.

- 입력 즉시 실시간 감지 (대소문자 무관)
- 중복 행의 입력칸 테두리 빨간색 + 경고 문구 표시
- 저장 버튼 클릭 시 중복이 있으면 저장 차단

### 8. 스타일 시스템

- **Tailwind CSS v4**: 유틸리티 클래스 우선 적용
- **인라인 스타일**: 브랜드 컬러·컴포넌트별 세밀한 조정에 사용
- **MobileLayout**: `max-width: 430px`, `min-height: 100dvh`로 스마트폰 뷰포트 시뮬레이션

#### 브랜드 컬러 팔레트

| 이름 | 값 | 용도 |
|------|----|------|
| 메인 | `#B8D0FA` | 주요 버튼, 강조 |
| 서브 | `#94B9F3` | 보조 버튼, 아이콘 활성 |
| 퍼플 | `#776A77` | 설명 텍스트 |
| 옐로우 | `#DDDEA5` | XP 획득 표시 |
| 크림 | `#EDE9BF` | 배경 포인트 |
| 피치 | `#F8EDD6` | 데모 힌트 박스 |
| 흰색 | `#FFFFFF` | 카드·배경 |
| 검은색 | `#1c1c1c` | 본문 텍스트 |
| 회색 | `#737373` | 보조 텍스트 |

---

## 데모 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| 일반 유저 | `user@test.com` | `user123` |
| 관리자 | `admin@test.com` | `admin123` |

---

## 백엔드 연동 가이드

1. `src/app/data/mockData.ts`의 각 API 함수를 실제 `fetch` / `axios` 호출로 교체합니다.
2. 백엔드 베이스 URL을 환경변수 `VITE_API_BASE_URL`로 관리하는 것을 권장합니다.
3. 백엔드 응답 형식이 현재 `types/index.ts`의 인터페이스와 다를 경우, 타입만 수정하면 됩니다.
4. JWT 토큰 방식 도입 시 `AuthContext`의 `login()` 함수에서 토큰을 `localStorage`에 저장하고, `memberApi` 요청 헤더에 `Authorization: Bearer <token>`을 추가합니다.

```ts
// 예시: mockData.ts → 실제 fetch 교체
export const authApi = {
  login: async (req: LoginRequest) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('로그인 실패');
    return res.json(); // { member: Member }
  },
  // ...
};
```