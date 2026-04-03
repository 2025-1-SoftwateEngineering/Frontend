# VocaMaster - TOEIC 영단어 학습 앱

대학생을 위한 TOEIC 영단어 암기 및 테스트 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 18 + Vite + Tailwind CSS v3
- **라우팅**: react-router-dom v6
- **상태 관리**: React Context API

## 주요 기능 (Sprint 1)

- 이메일 로그인 / 회원가입 (관리자 / 일반 사용자)
- 단어장 목록 조회 및 상세 보기
- 단어 암기 모드 (카드 스와이프)
- 스펠링 테스트 (뜻 보고 영단어 입력)
- 관리자 단어장 CRUD
- 프로필 관리

## 로컬 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 데모 계정

| 구분 | 이메일 | 비밀번호 |
|------|--------|----------|
| 일반 사용자 | user@example.com | 1234 |
| 관리자 | admin@example.com | admin1234 |

## 프로젝트 구조

```
src/
├── context/         # AuthContext, VocaContext
├── data/            # 데모 단어 데이터
├── pages/
│   ├── auth/        # 로그인, 회원가입 등
│   ├── home/        # 홈, 상점, 친구
│   ├── vocab/       # 단어장, 암기, 테스트
│   └── member/      # 프로필
├── components/
│   └── common/      # BottomNav, Modal, Button 등
└── router/          # 라우터 설정
```

## 브랜치 전략

- `main` — 배포 브랜치
- `front_kwon` — 프론트엔드 개발 브랜치
