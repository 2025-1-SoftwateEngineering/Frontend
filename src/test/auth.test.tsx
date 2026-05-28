/**
 * B. AuthContext 테스트
 * 로그인, 로그아웃, 세션 복원, 회원가입 흐름 검증
 */
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server, MOCK_TOKEN, MOCK_PROFILE } from './handlers'
import { renderWithProviders, setMockUser, MOCK_MEMBER } from './utils'
import { useAuth } from '../main/features/domain/auth/AuthContext'
import { tokenStorage } from '../main/config/apiConfig'

const AUTH = 'https://vocabuddy.site/auth/v1'
const API  = 'https://vocabuddy.site/api/v1'

// ── 테스트용 컴포넌트 ──────────────────────────────────────────────────────────
function AuthDisplay() {
  const { currentUser, isLoading, login, logout, register } = useAuth()
  if (isLoading) return <p>로딩 중</p>
  if (!currentUser) return (
    <div>
      <p>비로그인</p>
      <button onClick={() => login({ email: 'user@test.com', password: 'pw123' })}>
        로그인
      </button>
      <button onClick={() => register({ email: 'new@test.com', password: 'pw123', nickname: '신규' })}>
        회원가입
      </button>
    </div>
  )
  return (
    <div>
      <p>닉네임: {currentUser.nickname}</p>
      <p>코인: {currentUser.coin}</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  )
}

describe('B. AuthContext', () => {

  // B-01 ─────────────────────────────────────────────────────────────────────
  it('B-01: 로그인 성공 → currentUser 세팅, 토큰 저장', async () => {
    renderWithProviders(<AuthDisplay />)

    await waitFor(() => expect(screen.queryByText('로딩 중')).not.toBeInTheDocument())
    expect(screen.getByText('비로그인')).toBeInTheDocument()

    await act(async () => {
      await userEvent.click(screen.getByText('로그인'))
    })

    await waitFor(() => {
      expect(screen.getByText(`닉네임: ${MOCK_PROFILE.nickname}`)).toBeInTheDocument()
    })
    expect(tokenStorage.getAccessToken()).toBe(MOCK_TOKEN.accessToken)
  })

  // B-02 ─────────────────────────────────────────────────────────────────────
  it('B-02: 로그인 실패 (API 오류) → currentUser 변화 없음', async () => {
    server.use(
      http.post(`${AUTH}/login`, () =>
        HttpResponse.json({ isSuccess: false, code: 'ERR', message: '이메일/비밀번호 불일치', result: null })
      )
    )
    renderWithProviders(<AuthDisplay />)

    await waitFor(() => expect(screen.queryByText('로딩 중')).not.toBeInTheDocument())

    await act(async () => {
      await userEvent.click(screen.getByText('로그인')).catch(() => {})
    })

    // 여전히 비로그인 상태
    expect(screen.getByText('비로그인')).toBeInTheDocument()
  })

  // B-03 ─────────────────────────────────────────────────────────────────────
  it('B-03: 로그아웃 → currentUser null, 토큰 삭제', async () => {
    setMockUser(MOCK_MEMBER)
    renderWithProviders(<AuthDisplay />)

    await waitFor(() => {
      expect(screen.getByText(`닉네임: ${MOCK_MEMBER.nickname}`)).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('로그아웃'))

    await waitFor(() => {
      expect(screen.getByText('비로그인')).toBeInTheDocument()
    })
    expect(tokenStorage.getAccessToken()).toBeNull()
  })

  // B-04 ─────────────────────────────────────────────────────────────────────
  it('B-04: 앱 재시작 시 localStorage 유저 복원 (토큰 없음 → API 호출 없음)', async () => {
    setMockUser(MOCK_MEMBER) // 토큰 없이 유저만 저장
    renderWithProviders(<AuthDisplay />)

    await waitFor(() => {
      expect(screen.getByText(`닉네임: ${MOCK_MEMBER.nickname}`)).toBeInTheDocument()
    })
  })

  // B-05 ─────────────────────────────────────────────────────────────────────
  it('B-05: 회원가입 성공 → currentUser 세팅', async () => {
    renderWithProviders(<AuthDisplay />)

    await waitFor(() => expect(screen.queryByText('로딩 중')).not.toBeInTheDocument())

    await act(async () => {
      await userEvent.click(screen.getByText('회원가입'))
    })

    await waitFor(() => {
      expect(screen.getByText(`닉네임: ${MOCK_PROFILE.nickname}`)).toBeInTheDocument()
    })
  })

  // B-06 ─────────────────────────────────────────────────────────────────────
  it('B-06: 액세스 토큰 있을 때 → 서버에서 최신 프로필 조회', async () => {
    const serverNickname = '서버에서온닉네임'
    server.use(
      http.get(`${API}/members/me`, () =>
        HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { ...MOCK_PROFILE, nickname: serverNickname },
        })
      )
    )
    // 토큰 있는 유저 세팅
    localStorage.setItem('vocabuddy_auth_user', JSON.stringify(MOCK_MEMBER))
    localStorage.setItem('vocabuddy_access_token', 'valid-token')

    renderWithProviders(<AuthDisplay />)

    await waitFor(() => {
      expect(screen.getByText(`닉네임: ${serverNickname}`)).toBeInTheDocument()
    })
  })

})
