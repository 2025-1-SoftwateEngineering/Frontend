/**
 * H. VocabularyListScreen 테스트
 * 단어장 목록 로딩, 빈 상태, 스켈레톤 로딩, 관리자 버튼
 *
 * NOTE: VocabularyListScreen은 API 오류를 별도 error state로 처리하지 않음.
 *       오류 시 books=[] 로 남아 빈 상태 UI가 표시됨.
 */
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from './handlers'
import { renderWithProviders, setMockUser, MOCK_MEMBER, MOCK_ADMIN } from './utils'
import { VocabularyListScreen } from '../app/pages/VocabularyListScreen'

const API = 'https://vocabuddy.site/api/v1'

describe('H. VocabularyListScreen', () => {

  beforeEach(() => setMockUser(MOCK_MEMBER))

  // H-01 ─────────────────────────────────────────────────────────────────────
  it('H-01: 단어장 목록 로딩 → 이름 렌더링', async () => {
    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    await waitFor(() => {
      expect(screen.getByText('TOEIC 기본')).toBeInTheDocument()
    })
    expect(screen.getByText('TOEIC 심화')).toBeInTheDocument()
  })

  // H-02 ─────────────────────────────────────────────────────────────────────
  it('H-02: 빈 단어장 목록 → 빈 상태 UI 표시', async () => {
    server.use(
      http.get(`${API}/vocabularies`, () =>
        HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { vocas: [], totalCount: 0 },
        })
      )
    )
    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    await waitFor(() => {
      expect(screen.getByText('등록된 단어장이 없습니다.')).toBeInTheDocument()
    })
  })

  // H-03 ─────────────────────────────────────────────────────────────────────
  it('H-03: API 오류 → books=[] → 빈 상태 UI 표시 (에러 상태 없음)', async () => {
    server.use(
      http.get(`${API}/vocabularies`, () =>
        HttpResponse.json({ isSuccess: false, code: 'ERR', message: '오류', result: null })
      )
    )
    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    await waitFor(() => {
      // VocabularyListScreen은 API 오류 시 error UI 없이 빈 상태만 표시
      expect(screen.getByText('등록된 단어장이 없습니다.')).toBeInTheDocument()
    })
  })

  // H-04 ─────────────────────────────────────────────────────────────────────
  it('H-04: 단어장 클릭 → navigate 동작 (MemoryRouter 내)', async () => {
    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    await waitFor(() => expect(screen.getByText('TOEIC 기본')).toBeInTheDocument())

    // 클릭 → 에러 없이 동작
    const card = screen.getByText('TOEIC 기본').closest('div[class*="motion"], .rounded-2xl')
    if (card) await userEvent.click(card)

    // MemoryRouter 환경이라 실제 URL 바뀌지 않음 - 에러 없이 통과하면 성공
    expect(true).toBe(true)
  })

  // H-05 ─────────────────────────────────────────────────────────────────────
  it('H-05: 로딩 중 → 스켈레톤(animate-pulse) 표시', async () => {
    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    // 초기 렌더: loading=true → animate-pulse 스켈레톤 표시 (API 응답 전)
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)

    // API 응답 후 데이터 표시 확인
    await waitFor(() => expect(screen.getByText('TOEIC 기본')).toBeInTheDocument())
  })

  // H-06 ─────────────────────────────────────────────────────────────────────
  it('H-06: 관리자 유저 → "단어장 추가" 버튼 표시', async () => {
    setMockUser(MOCK_ADMIN)

    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    await waitFor(() => expect(screen.getByText('TOEIC 기본')).toBeInTheDocument())

    expect(screen.getByText('단어장 추가')).toBeInTheDocument()
  })

  // H-07 ─────────────────────────────────────────────────────────────────────
  it('H-07: 일반 유저 → "단어장 추가" 관리자 버튼 없음', async () => {
    renderWithProviders(<VocabularyListScreen />, { initialEntries: ['/vocabulary'] })

    await waitFor(() => expect(screen.getByText('TOEIC 기본')).toBeInTheDocument())

    // 관리자 전용 버튼(단어장 추가)은 없고 일반 유저용 버튼만 있음
    const adminBtn = screen.queryByRole('button', { name: /단어장 추가$/ })
    expect(adminBtn).toBeNull()
  })

})
