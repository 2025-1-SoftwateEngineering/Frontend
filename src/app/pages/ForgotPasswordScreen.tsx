import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Send } from 'lucide-react';
import { authApi } from '../../main/features/domain/auth/authApi';
import { MobileLayout } from '../components/MobileLayout';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email.trim()) { setError('이메일을 입력해 주세요.'); return; }
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      setError(e.message || '이메일 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center px-4 pt-12 pb-4">
          <button
            type="button"
            onClick={() => navigate('/login/email')}
            aria-label="뒤로가기"
            title="뒤로가기"
            className="text-[#737373] bg-transparent border-none"
          >
            <ChevronLeft size={26} />
          </button>
        </div>

        <motion.div
          className="flex flex-col flex-1 px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-[#1c1c1c] mb-1.5">비밀번호 찾기</h1>
            <p className="text-sm text-[#737373] leading-[1.6]">
              가입한 이메일을 입력하면<br />임시 비밀번호를 보내드립니다
            </p>
          </div>

          {!sent ? (
            <>
              <div className="mb-4">
                <label className="text-[13px] text-[#737373] mb-1.5 block">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입한 이메일 입력"
                  className="w-full py-3.5 px-4 rounded-[14px] border-[1.5px] border-[#e5e7eb] text-base outline-none bg-[#fafafa] text-[#1c1c1c]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#d4183d] mb-3">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className={`w-full rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform text-[#1c1c1c] text-[16px] font-bold ${loading ? 'bg-[#c8ddf8]' : 'bg-[#B8D0FA]'}`}
              >
                <Send size={18} />
                {loading ? '전송 중...' : '임시 비밀번호 전송'}
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 mt-10"
            >
              <div className="rounded-full flex items-center justify-center w-20 h-20 bg-[#EDE9BF]">
                <span className="text-[36px]">📬</span>
              </div>
              <h2 className="text-[20px] font-bold text-[#1c1c1c']">이메일을 확인해 주세요</h2>
              <p className="text-sm text-[#737373] text-center leading-[1.7]">
                <strong className="text-[#1c1c1c]">{email}</strong>으로<br />
                임시 비밀번호를 전송했습니다.<br />
                이메일을 확인 후 로그인해 주세요.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login/email')}
                className="w-full rounded-2xl py-4 mt-4 bg-[#B8D0FA] text-[#1c1c1c] text-[16px] font-bold"
              >
                로그인하러 가기
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
