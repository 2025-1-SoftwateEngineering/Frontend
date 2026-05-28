/**
 * D. PetScreen 테스트
 * 펫 정보 렌더링, 사료주기, 물주기, 아이템 없을 때 동작
 */
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server, MOCK_PET } from './handlers'
import { renderWithProviders, setMockUser, MOCK_MEMBER } from './utils'
import { PetScreen } from '../app/pages/PetScreen.tsx'

const API = 'https://vocabuddy.site/api/v1'

describe('D. PetScreen', () => {

  beforeEach(() => setMockUser(MOCK_MEMBER))

  // D-01 ─────────────────────────────────────────────────────────────────────
  it('D-01: 펫 정보 로딩 → 레벨·사료·물 수량 렌더링', async () => {
    renderWithProviders(<PetScreen />, { initialEntries: ['/pet'] })

    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('불러오는 중...')).not.toBeInTheDocument()
    })

    // foodCount(3)개, waterCount(1)개 표시
    expect(screen.getByText('3개')).toBeInTheDocument()
    expect(screen.getByText('1개')).toBeInTheDocument()
  })

  // D-02 ─────────────────────────────────────────────────────────────────────
  it('D-02: getMyPet + createPet 모두 실패 → 오류 UI + 다시 시도', async () => {
    server.use(
      http.get(`${API}/pets/me`, () =>
        HttpResponse.json({ isSuccess: false, code: 'ERR', message: '없음', result: null })
      ),
      http.post(`${API}/pets`, () =>
        HttpResponse.json({ isSuccess: false, code: 'ERR', message: '생성 실패', result: null })
      )
    )
    renderWithProviders(<PetScreen />, { initialEntries: ['/pet'] })

    await waitFor(() => {
      expect(screen.getByText('펫 정보를 불러올 수 없어요')).toBeInTheDocument()
    })
    expect(screen.getByText('다시 시도')).toBeInTheDocument()
  })

  // D-03 ─────────────────────────────────────────────────────────────────────
  it('D-03: 사료주기 버튼 클릭 → storeApi.useItem 호출, 수량 감소', async () => {
    let useItemCalled = false
    server.use(
      http.post(`${API}/store/items/:itemId/use`, () => {
        useItemCalled = true
        return HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { itemName: '펫 음식', remainingCount: 2, hintResult: null },
        })
      })
    )

    renderWithProviders(<PetScreen />, { initialEntries: ['/pet'] })

    // 로딩 완료 대기
    await waitFor(() => expect(screen.getByText('사료주기')).toBeInTheDocument())

    await userEvent.click(screen.getByText('사료주기'))

    await waitFor(() => expect(useItemCalled).toBe(true))
    // 3개 → 2개로 감소
    await waitFor(() => expect(screen.getByText('2개')).toBeInTheDocument())
  })

  // D-04 ─────────────────────────────────────────────────────────────────────
  it('D-04: foodCount=0 → 사료주기 클릭해도 useItem 호출 안 됨', async () => {
    server.use(
      http.get(`${API}/store/my-items`, () =>
        HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { items: [], totalCount: 0 }, // 아이템 없음
        })
      )
    )

    let useItemCalled = false
    server.use(
      http.post(`${API}/store/items/:itemId/use`, () => {
        useItemCalled = true
        return HttpResponse.json({ isSuccess: true, code: 'SUCCESS', message: '', result: {} })
      })
    )

    renderWithProviders(<PetScreen />, { initialEntries: ['/pet'] })

    await waitFor(() => expect(screen.getByText('사료주기')).toBeInTheDocument())
    // foodCount = 0 → '0개' 표시
    expect(screen.getAllByText('0개').length).toBeGreaterThan(0)

    await userEvent.click(screen.getByText('사료주기'))

    // useItem 호출 안 됨
    expect(useItemCalled).toBe(false)
  })

  // D-05 ─────────────────────────────────────────────────────────────────────
  it('D-05: 펫 없으면 자동 생성 (POST /pets) 호출', async () => {
    let createCalled = false
    server.use(
      http.get(`${API}/pets/me`, () =>
        HttpResponse.json({ isSuccess: false, code: 'ERR', message: '없음', result: null })
      ),
      http.post(`${API}/pets`, () => {
        createCalled = true
        return HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { ...MOCK_PET, stage: 'EGG', currentXp: 0, hunger: 0, thirst: 0 },
        })
      })
    )

    renderWithProviders(<PetScreen />, { initialEntries: ['/pet'] })

    await waitFor(() => expect(createCalled).toBe(true))
  })

})
