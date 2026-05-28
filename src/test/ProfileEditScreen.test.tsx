/**
 * G. ProfileEditScreen 테스트
 * 닉네임 프리필, 빈 닉네임 에러, 저장 성공/실패
 *
 * NOTE: ProfileEditScreen은 `useState(currentUser?.nickname ?? '')`로 초기화하므로
 *       AuthContext를 모킹해서 currentUser를 첫 렌더부터 제공해야 정확히 테스트됩니다.
 */
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ProfileEditScreen } from '../app/pages/ProfileEditScreen'

// ── AuthContext 모킹 ─────────────────────────────────────────────────────────
// ProfileEditScreen이 첫 렌더부터 currentUser를 받을 수 있도록 mock
const mockUpdateProfile = vi.fn()

vi.mock('../main/features/domain/auth/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      member_id: 1,
      email: 'user@test.com',
      nickname: '단어왕',
      authorize: 'ROLE_USER',
      login_at: '2026-05-28T00:00:00Z',
      streak: 5,
      coin: 120,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-05-28T00:00:00Z',
      deleted_at: null,
      activeImages: [],
      profileUrl: '',
    },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    updateUser: vi.fn(),
    updateProfile: mockUpdateProfile,
    deleteAccount: vi.fn(),
    refreshUser: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/profile/edit']}>
      <ProfileEditScreen />
    </MemoryRouter>
  )
}

describe('G. ProfileEditScreen', () => {

  beforeEach(() => {
    mockUpdateProfile.mockReset()
    mockUpdateProfile.mockResolvedValue(undefined)
  })

  // G-01 ─────────────────────────────────────────────────────────────────────
  it('G-01: 현재 닉네임이 입력창에 프리필됨', () => {
    renderScreen()
    // 첫 렌더부터 currentUser가 있으므로 즉시 프리필
    expect(screen.getByDisplayValue('단어왕')).toBeInTheDocument()
  })

  // G-02 ─────────────────────────────────────────────────────────────────────
  it('G-02: 닉네임 비우고 저장 시도 → "닉네임을 입력해 주세요." 에러', async () => {
    renderScreen()

    const nicknameInput = screen.getByDisplayValue('단어왕')
    await userEvent.clear(nicknameInput)

    await userEvent.click(screen.getByText('저장하기'))

    await waitFor(() => {
      expect(screen.getByText('닉네임을 입력해 주세요.')).toBeInTheDocument()
    })
  })

  // G-03 ─────────────────────────────────────────────────────────────────────
  it('G-03: 비밀번호 없이 저장 → "현재 비밀번호를 입력해 주세요." 에러', async () => {
    renderScreen()

    // 닉네임은 그대로, 비밀번호 없이 저장
    await userEvent.click(screen.getByText('저장하기'))

    await waitFor(() => {
      expect(screen.getByText('현재 비밀번호를 입력해 주세요.')).toBeInTheDocument()
    })
  })

  // G-04 ─────────────────────────────────────────────────────────────────────
  it('G-04: 닉네임 변경 + 비밀번호 입력 → updateProfile 호출', async () => {
    renderScreen()

    const nicknameInput = screen.getByDisplayValue('단어왕')
    await userEvent.clear(nicknameInput)
    await userEvent.type(nicknameInput, '새닉네임')

    const pwInput = document.querySelector<HTMLInputElement>('input[type="password"]')
    expect(pwInput).not.toBeNull()
    await userEvent.type(pwInput!, 'mypassword123')

    await act(async () => {
      await userEvent.click(screen.getByText('저장하기'))
    })

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        { nickname: '새닉네임' },
        'mypassword123'
      )
    })
  })

  // G-05 ─────────────────────────────────────────────────────────────────────
  it('G-05: updateProfile API 오류 → 에러 메시지 표시', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('비밀번호가 올바르지 않습니다.'))

    renderScreen()

    const pwInput = document.querySelector<HTMLInputElement>('input[type="password"]')
    if (pwInput) await userEvent.type(pwInput, 'wrongpassword')

    await act(async () => {
      await userEvent.click(screen.getByText('저장하기'))
    })

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 올바르지 않습니다.')).toBeInTheDocument()
    })
  })

  // G-06 ─────────────────────────────────────────────────────────────────────
  it('G-06: 저장 버튼 "저장하기" 텍스트 표시', () => {
    renderScreen()
    expect(screen.getByText('저장하기')).toBeInTheDocument()
  })

})
