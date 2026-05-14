import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { MobileLayout } from '../components/MobileLayout';

export function RegisterScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!email.trim() || !nickname.trim() || !password.trim()) {
      setError('이메일, 닉네임, 비밀번호를 모두 입력해 주세요.'); return;
    }
    if (password !== pwCheck) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }

    setLoading(true);
    try {
      await register({ email: email.trim(), nickname: nickname.trim(), password, isAdmin });
      if (isAdmin) {
        alert('관리자 가입 요청이 전송되었습니다. 승인 후 로그인하실 수 있습니다.');
        navigate('/login');
      } else {
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        navigate('/login/email');
      }
    } catch (e: any) {
      setError(e.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <div className="flex items-center px-4 pt-12 pb-4 flex-shrink-0">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate('/login')}
            className="text-text-sub bg-transparent border-0"
          >
            <ChevronLeft size={26} />
          </button>
        </div>

        <motion.div
          className="flex flex-col px-6 pb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-main mb-1.5">회원가입</h1>
            <p className="text-sm text-text-sub">정보를 입력하고 학습을 시작하세요</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center bg-brand-blue border-[3px] border-brand-blue-dark">
              <span className="text-4xl font-bold text-white">
                {nickname.trim() ? nickname.trim().charAt(0).toUpperCase() : '👤'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] text-text-sub mb-1.5 block">이메일 *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main" />
            </div>
            <div>
              <label className="text-[13px] text-text-sub mb-1.5 block">닉네임 *</label>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)}
                placeholder="사용할 닉네임"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main" />
            </div>
            <div>
              <label className="text-[13px] text-text-sub mb-1.5 block">비밀번호 *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                  className="w-full px-4 py-3.5 pr-12 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub bg-transparent border-0">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[13px] text-text-sub mb-1.5 block">비밀번호 확인 *</label>
              <input type={showPw ? 'text' : 'password'} value={pwCheck}
                onChange={(e) => setPwCheck(e.target.value)}
                placeholder="비밀번호 재입력"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main" />
            </div>
          </div>

          <div className={`flex items-start gap-3 mt-5 p-4 rounded-xl ${isAdmin ? 'bg-brand-beige' : 'bg-[#f8f8f8]'}`}>
            <input
              type="checkbox"
              id="admin-check"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-[18px] h-[18px] mt-0.5 flex-shrink-0 accent-brand-blue-dark"
            />
            <label htmlFor="admin-check" className="text-sm text-text-main leading-relaxed cursor-pointer">
              <span className="font-semibold">관리자로 가입 (ROLE_ADMIN)</span><br />
              <span className="text-xs text-text-sub">
                체크 시 관리자 승인 요청이 전송됩니다. 단어장 생성·편집 권한이 부여됩니다.
              </span>
            </label>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[13px] text-destructive mt-2.5 text-center">
              {error}
            </motion.p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full rounded-2xl py-4 mt-6 active:scale-95 transition-transform text-base font-bold text-text-main ${loading ? 'bg-brand-blue-dim' : 'bg-brand-blue'}`}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
