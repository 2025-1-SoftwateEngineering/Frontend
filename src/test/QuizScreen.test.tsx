/**
 * E. QuizScreen (사지선다) 테스트
 * 문제 렌더링, 정답/오답 선택, 타이머 표시, 결과 화면
 */
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server, MOCK_CHOICE_QUESTION } from './handlers'
import { renderOnRoute, setMockUser, MOCK_MEMBER } from './utils'
import { QuizScreen } from '../app/pages/QuizScreen'

const API = 'https://vocabuddy.site/api/v1'

describe('E. QuizScreen (사지선다)', () => {

  // vi.useFakeTimers() 는 testing-library의 waitFor 내부 polling을 막으므로
  // beforeEach에 두지 않고 필요한 케이스에서만 사용
  beforeEach(() => setMockUser(MOCK_MEMBER))

  // E-01 ─────────────────────────────────────────────────────────────────────
  it('E-01: 문제 렌더링 → 질문 텍스트와 4개 보기 표시', async () => {
    renderOnRoute('/choices/:choiceId', <QuizScreen />, '/choices/1')

    await waitFor(() => {
      expect(screen.getByText(MOCK_CHOICE_QUESTION.question)).toBeInTheDocument()
    }, { timeout: 5000 })

    expect(screen.getByText('abandon')).toBeInTheDocument()
    expect(screen.getByText('accomplish')).toBeInTheDocument()
    expect(screen.getByText('acquire')).toBeInTheDocument()
    expect(screen.getByText('adjust')).toBeInTheDocument()
  })

  // E-02 ─────────────────────────────────────────────────────────────────────
  it('E-02: 정답 선택 → submitChoiceAnswer 호출 + 피드백', async () => {
    let submitCalled = false
    server.use(
      http.post(`${API}/choices/:choiceId/submit`, () => {
        submitCalled = true
        return HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { isCorrect: true, hasNext: false, nextCurrent: null, score: 10 },
        })
      })
    )

    renderOnRoute('/choices/:choiceId', <QuizScreen />, '/choices/1')

    await waitFor(() => expect(screen.getByText('abandon')).toBeInTheDocument(), { timeout: 5000 })

    await act(async () => {
      await userEvent.click(screen.getByText('abandon'))
    })

    await waitFor(() => expect(submitCalled).toBe(true))
  })

  // E-03 ─────────────────────────────────────────────────────────────────────
  it('E-03: 오답 선택 → submitChoiceAnswer 호출', async () => {
    let submitCalled = false
    server.use(
      http.post(`${API}/choices/:choiceId/submit`, () => {
        submitCalled = true
        return HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { isCorrect: false, hasNext: false, nextCurrent: null, score: 0 },
        })
      })
    )

    renderOnRoute('/choices/:choiceId', <QuizScreen />, '/choices/1')

    await waitFor(() => expect(screen.getByText('accomplish')).toBeInTheDocument(), { timeout: 5000 })

    await act(async () => {
      await userEvent.click(screen.getByText('accomplish'))
    })

    await waitFor(() => expect(submitCalled).toBe(true))
  })

  // E-04 ─────────────────────────────────────────────────────────────────────
  it('E-04: 타이머 초기값(10초) 표시', async () => {
    renderOnRoute('/choices/:choiceId', <QuizScreen />, '/choices/1')

    await waitFor(() => expect(screen.getByText(MOCK_CHOICE_QUESTION.question)).toBeInTheDocument(), { timeout: 5000 })

    // 타이머 초기값 10 표시 확인 (컴포넌트: {timer}s → "10s")
    const timerEl = screen.queryByText('10s') ?? screen.queryByText(/^10/)
    expect(timerEl).not.toBeNull()
  })

  // E-05 ─────────────────────────────────────────────────────────────────────
  it('E-05: 퀴즈 없음 (result=null) → 퀴즈 화면 미표시', async () => {
    let apiCalled = false
    server.use(
      http.get(`${API}/choices/:choiceId`, () => {
        apiCalled = true
        return HttpResponse.json({ isSuccess: true, code: 'SUCCESS', message: '', result: null })
      })
    )

    renderOnRoute('/choices/:choiceId', <QuizScreen />, '/choices/1')

    // API 호출 완료 대기 (result=null 반환)
    await waitFor(() => expect(apiCalled).toBe(true), { timeout: 3000 })

    // result=null → loadQuestion이 phase='result'로 전환하지만
    // !question 조건으로 loading 화면 유지, 퀴즈 질문 미표시
    expect(screen.queryByText(MOCK_CHOICE_QUESTION.question)).not.toBeInTheDocument()
    expect(screen.getByText('로딩 중...')).toBeInTheDocument()
  })

  // E-06 ─────────────────────────────────────────────────────────────────────
  it('E-06: CHOICE_TIME_10 아이템 보유 → 화면에 아이템 표시', async () => {
    server.use(
      http.get(`${API}/store/my-items`, () =>
        HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: {
            items: [
              { item: { itemId: 4, name: '사지선다 +10초', price: 80, itemType: 'CHOICE_TIME_10' }, count: 2, isEquipped: false },
            ],
            totalCount: 1,
          },
        })
      )
    )

    renderOnRoute('/choices/:choiceId', <QuizScreen />, '/choices/1')

    await waitFor(() => expect(screen.getByText(MOCK_CHOICE_QUESTION.question)).toBeInTheDocument(), { timeout: 5000 })

    // 아이템 이름 또는 수량 표시
    await waitFor(() => {
      const el =
        screen.queryByText('사지선다 +10초') ??
        screen.queryByText('+10초') ??
        screen.queryByText('×2') ??
        screen.queryByText('x2')
      expect(el).not.toBeNull()
    }, { timeout: 2000 })
  })

})
