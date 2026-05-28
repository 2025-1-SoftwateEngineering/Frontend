/**
 * A. apiFetch 래퍼 테스트
 * 401 자동 재발급, isSuccess=false throw, 정상 응답 등 핵심 로직 검증
 */
import { http, HttpResponse } from 'msw'
import { apiFetch, tokenStorage } from '../main/config/apiConfig'
import { server } from './handlers'

const API = 'https://vocabuddy.site/api/v1'
const AUTH = 'https://vocabuddy.site/auth/v1'

describe('A. apiFetch 래퍼', () => {

  // A-01 ─────────────────────────────────────────────────────────────────────
  it('A-01: 200 정상 응답 → data 반환', async () => {
    server.use(
      http.get(`${API}/vocabularies`, () =>
        HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: { vocas: [], totalCount: 0 },
        })
      )
    )
    const res = await apiFetch('/vocabularies', {}, API)
    expect(res.isSuccess).toBe(true)
    expect(res.result).toEqual({ vocas: [], totalCount: 0 })
  })

  // A-02 ─────────────────────────────────────────────────────────────────────
  it('A-02: 401 → reissue 성공 → 원래 요청 재시도 후 데이터 반환', async () => {
    let callCount = 0

    server.use(
      http.get(`${API}/protected`, () => {
        callCount++
        if (callCount === 1) {
          return new HttpResponse(
            JSON.stringify({ isSuccess: false, code: 'UNAUTHORIZED', message: '인증 필요', result: null }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          )
        }
        return HttpResponse.json({ isSuccess: true, code: 'SUCCESS', message: '', result: 'ok' })
      }),
      http.post(`${AUTH}/reissue`, () =>
        HttpResponse.json({
          isSuccess: true, code: 'SUCCESS', message: '',
          result: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            refreshExpiration: '2027-01-01T00:00:00Z',
          },
        })
      )
    )

    tokenStorage.setTokens('old-token', 'old-refresh')

    const res = await apiFetch('/protected', {}, API)
    expect(callCount).toBe(2)
    expect(res.result).toBe('ok')
  })

  // A-03 ─────────────────────────────────────────────────────────────────────
  it('A-03: isSuccess=false → message로 throw', async () => {
    server.use(
      http.get(`${API}/fail`, () =>
        HttpResponse.json({
          isSuccess: false, code: 'ERR', message: '오류가 발생했습니다', result: null,
        })
      )
    )
    await expect(apiFetch('/fail', {}, API)).rejects.toThrow('오류가 발생했습니다')
  })

  // A-04 ─────────────────────────────────────────────────────────────────────
  it('A-04: 401 → reissue 실패 → throw', async () => {
    server.use(
      http.get(`${API}/no-access`, () =>
        new HttpResponse(
          JSON.stringify({ isSuccess: false, code: 'UNAUTHORIZED', message: '토큰 만료', result: null }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      ),
      http.post(`${AUTH}/reissue`, () =>
        HttpResponse.json({
          isSuccess: false, code: 'REISSUE_FAIL', message: '리프레시 토큰 만료', result: null,
        })
      )
    )
    tokenStorage.setTokens('expired-token', 'expired-refresh')
    await expect(apiFetch('/no-access', {}, API)).rejects.toThrow()
  })

  // A-05 ─────────────────────────────────────────────────────────────────────
  it('A-05: 네트워크 오류 → throw', async () => {
    server.use(
      http.get(`${API}/network-error`, () => {
        throw new Error('Network Error')
      })
    )
    await expect(apiFetch('/network-error', {}, API)).rejects.toThrow()
  })

})
