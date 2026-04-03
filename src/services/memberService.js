// domain/member에 대응하는 서비스
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const memberService = {
  async getProfile() {
    const res = await fetch(`${API_BASE}/api/member/profile`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('프로필 조회 실패');
    return res.json();
  },

  async updateProfile(data) {
    const formData = new FormData();
    if (data.nickname) formData.append('nickname', data.nickname);
    if (data.profileImage) formData.append('profileImage', data.profileImage);
    if (data.profileBackground) formData.append('profileBackground', data.profileBackground);

    const res = await fetch(`${API_BASE}/api/member/profile`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) throw new Error('프로필 수정 실패');
    return res.json();
  },

  async withdraw() {
    const res = await fetch(`${API_BASE}/api/member/withdraw`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('회원 탈퇴 실패');
    return res.json();
  },
};
