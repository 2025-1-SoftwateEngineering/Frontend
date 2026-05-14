import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { MobileLayout } from '../components/MobileLayout';

export function EmailLoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/home', { replace: true });
    } catch (e: any) {
      setError(e.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center px-4 pt-12 pb-4">
          <button type="button" onClick={() => navigate('/login')} className="text-text-sub bg-transparent border-0" title="뒤로 가기">
            <ChevronLeft size={26} />
          </button>
        </div>

        <motion.div
          className="flex flex-col flex-1 px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-main mb-1.5">이메일로 로그인</h1>
            <p className="text-sm text-text-sub">가입한 이메일과 비밀번호를 입력해 주세요</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] text-text-sub mb-1.5 block">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label className="text-[13px] text-text-sub mb-1.5 block">비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-3.5 pr-12 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub bg-transparent border-0"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-[13px] text-destructive text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full rounded-2xl py-4 mt-6 active:scale-95 transition-transform text-base font-bold text-text-main ${loading ? 'bg-brand-blue-dim' : 'bg-brand-blue'}`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <div className="flex justify-center mt-5">
            <button
              onClick={() => navigate('/login/forgot-password')}
              className="text-[13px] text-brand-blue-dark bg-transparent border-0 underline"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
