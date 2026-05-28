/**
 * C. ShopScreen 테스트
 * 아이템 목록 렌더링, 카테고리 분리, 구매 플로우, 코인 부족, API 오류
 */
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from './handlers'
import { renderWithProviders, setMockUser, MOCK_MEMBER } from './utils'
import { ShopScreen } from '../app/pages/ShopScreen.tsx'

const API = 'https://vocabuddy.site/api/v1'

describe('C. ShopScreen', () => {

  beforeEach(() => {
    setMockUser(MOCK_MEMBER)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  // C-01 ─────────────────────────────────────────────────────────────────────
  it('C-01: 아이템 목록 로딩 → 카테고리 섹션 렌더링', async () => {
    renderWithProviders(<ShopScreen />)

    await waitFor(() => {
      expect(screen.getByText('연속학습 프리즈')).toBeInTheDocument()
    })
    expect(screen.getByText('펫 음식')).toBeInTheDocument()
    expect(screen.getByText('펫 물')).toBeInTheDocument()
  })

  // C-02 ─────────────────────────────────────────────────────────────────────
  it('C-02: price=0 인 아이템은 상점에 표시되지 않음', async () => {
    renderWithProviders(<ShopScreen />)

    await waitFor(() => {
      expect(screen.getByText('연속학습 프리즈')).toBeInTheDocument()
    })
    // MOCK_ITEMS에서 price=0 인 '무료 기본 아이템'은 미표시
    expect(screen.queryByText('무료 기본 아이템')).not.toBeInTheDocument()
  })

  // C-03 ─────────────────────────────────────────────────────────────────────
  it('C-03: 구매 성공 → 보유 수량 +1 표시', async () => {
    renderWithProviders(<ShopScreen />)

    await waitFor(() => {
      expect(screen.getByText('펫 음식')).toBeInTheDocument()
    })

    // 구매 전: 3개 보유 배지
    expect(screen.getByText('3개 보유')).toBeInTheDocument()

    // 펫 음식 클릭
    await userEvent.click(screen.getByText('펫 음식'))

    // 구매 후: 4개 보유
    await waitFor(() => {
      expect(screen.getByText('4개 보유')).toBeInTheDocument()
    })
  })

  // C-04 ─────────────────────────────────────────────────────────────────────
  it('C-04: 코인 부족 → "코인이 부족해요!" alert 표시', async () => {
    // 코인 0원인 유저
    setMockUser({ ...MOCK_MEMBER, coin: 0 })
    renderWithProviders(<ShopScreen />)

    await waitFor(() => {
      expect(screen.getByText('펫 음식')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('펫 음식'))

    expect(window.alert).toHaveBeenCalledWith('코인이 부족해요!')
  })

  // C-05 ─────────────────────────────────────────────────────────────────────
  it('C-05: getItems API 오류 → 오류 UI + 다시 시도 버튼', async () => {
    server.use(
      http.get(`${API}/store/items`, () =>
        HttpResponse.json({ isSuccess: false, code: 'ERR', message: '서버 오류', result: null })
      )
    )
    renderWithProviders(<ShopScreen />)

    await waitFor(() => {
      expect(screen.getByText('상점을 불러오는 중 오류가 발생했어요')).toBeInTheDocument()
    })
    expect(screen.getByText('다시 시도')).toBeInTheDocument()
  })

  // C-06 ─────────────────────────────────────────────────────────────────────
  it('C-06: 현재 코인 잔액 헤더에 표시', async () => {
    renderWithProviders(<ShopScreen />)

    await waitFor(() => {
      // MOCK_MEMBER.coin = 120
      expect(screen.getByText('120')).toBeInTheDocument()
    })
  })

  // C-07 ─────────────────────────────────────────────────────────────────────
  it('C-07: 구매 진행 중 중복 클릭 방지 (buying=true)', async () => {
    let purchaseCount = 0
    server.use(
      http.post(`${API}/store/items/:itemId/purchase`, async () => {
        purchaseCount++
        await new Promise(r => setTimeout(r, 100))
        return HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { remainingCoins: 70, purchasedItem: { itemId: 2, name: '펫 음식', price: 50, itemType: 'PET_FOOD' } },
        })
      })
    )

    renderWithProviders(<ShopScreen />)

    await waitFor(() => expect(screen.getByText('펫 음식')).toBeInTheDocument())

    // ItemCard의 클릭 영역: 아이템 이름 텍스트를 포함하는 가장 가까운 클릭 가능 요소
    const itemName = screen.getByText('펫 음식')

    // 빠르게 두 번 클릭 (두 번째는 buying=true 상태에서 막혀야 함)
    await userEvent.click(itemName)
    await userEvent.click(itemName)

    await waitFor(() => screen.getByText('4개 보유'), { timeout: 3000 })
    expect(purchaseCount).toBe(1) // 구매 API는 1번만 호출
  })

})
