import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { AuthProvider } from '../main/features/domain/auth/AuthContext'
import { ProgressProvider } from '../main/features/domain/voca/ProgressContext'
import type { ReactNode } from 'react'
import type { Member } from '../main/features/domain/member/types'

// ── 공통 Mock 유저 ────────────────────────────────────────────────────────────

export const MOCK_MEMBER: Member = {
  member_id: 1,
  email:      'user@test.com',
  nickname:   '단어왕',
  authorize:  'ROLE_USER',
  login_at:   '2026-05-28T00:00:00Z',
  streak:     5,
  coin:       120,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-05-28T00:00:00Z',
  deleted_at: null,
  activeImages: [],
  profileUrl: '',
}

export const MOCK_ADMIN: Member = {
  ...MOCK_MEMBER,
  member_id: 2,
  email:     'admin@test.com',
  nickname:  '관리자',
  authorize: 'ROLE_ADMIN',
  coin:      500,
}

// ── LocalStorage 헬퍼 ─────────────────────────────────────────────────────────
// AuthContext 세션 복원: access token 없으면 localStorage user 직접 사용 (API 호출 없음)

export function setMockUser(user: Member = MOCK_MEMBER) {
  localStorage.setItem('vocabuddy_auth_user', JSON.stringify(user))
}

export function setMockUserWithToken(user: Member = MOCK_MEMBER) {
  localStorage.setItem('vocabuddy_auth_user', JSON.stringify(user))
  localStorage.setItem('vocabuddy_access_token',  'mock-access-token')
  localStorage.setItem('vocabuddy_refresh_token', 'mock-refresh-token')
}

export function clearMockUser() {
  localStorage.clear()
}

// ── renderWithProviders ───────────────────────────────────────────────────────
// 단순 렌더링 (useParams 불필요한 화면용)

export function renderWithProviders(
  ui: ReactNode,
  { initialEntries = ['/'] }: { initialEntries?: string[] } = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <ProgressProvider>{children}</ProgressProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }
  return render(ui, { wrapper: Wrapper })
}

// ── renderOnRoute ─────────────────────────────────────────────────────────────
// useParams를 사용하는 화면 (예: /choices/:choiceId, /crosswords/:crosswordId)

export function renderOnRoute(
  path:         string,
  element:      ReactNode,
  initialEntry: string,
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <ProgressProvider>
          <Routes>
            <Route path={path} element={element} />
          </Routes>
        </ProgressProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}
