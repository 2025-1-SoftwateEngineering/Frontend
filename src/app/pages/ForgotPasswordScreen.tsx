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
      <div className="flex-1 flex flex-col" style={{ background: '#fff' }}>
        <div className="flex items-center px-4 pt-12 pb-4">
          <button onClick={() => navigate('/login/email')} style={{ color: '#737373', background: 'none', border: 'none' }}>
            <ChevronLeft size={26} />
          </button>
        </div>

        <motion.div
          className="flex flex-col flex-1 px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1c1c1c', marginBottom: 6 }}>비밀번호 찾기</h1>
            <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.6 }}>
              가입한 이메일을 입력하면<br />임시 비밀번호를 보내드립니다
            </p>
          </div>

          {!sent ? (
            <>
              <div className="mb-4">
                <label style={{ fontSize: 13, color: '#737373', marginBottom: 6, display: 'block' }}>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입한 이메일 입력"
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 14,
                    border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none',
                    background: '#fafafa', color: '#1c1c1c',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
              </div>

              {error && (
                <p style={{ fontSize: 13, color: '#d4183d', marginBottom: 12 }}>{error}</p>
              )}

              <button
                onClick={handleSend}
                disabled={loading}
                className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{ background: loading ? '#c8ddf8' : '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
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
              <div className="rounded-full flex items-center justify-center"
                style={{ width: 80, height: 80, background: '#EDE9BF' }}>
                <span style={{ fontSize: 36 }}>📬</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1c1c1c' }}>이메일을 확인해 주세요</h2>
              <p style={{ fontSize: 14, color: '#737373', textAlign: 'center', lineHeight: 1.7 }}>
                <strong style={{ color: '#1c1c1c' }}>{email}</strong>으로<br />
                임시 비밀번호를 전송했습니다.<br />
                이메일을 확인 후 로그인해 주세요.
              </p>
              <button
                onClick={() => navigate('/login/email')}
                className="w-full rounded-2xl py-4 mt-4"
                style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
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
