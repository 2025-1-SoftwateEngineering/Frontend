import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // 백엔드 연동 시 authService.sendPasswordResetEmail(email) 호출
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="app-container flex flex-col min-h-screen bg-white px-6">
      <button
        onClick={() => navigate(-1)}
        className="mt-12 mb-8 self-start p-1 text-app-black active:opacity-60"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-app-black">비밀번호 찾기</h1>
        <p className="text-sm text-app-gray mt-1 leading-relaxed">
          가입한 이메일을 입력하시면<br />임시 비밀번호를 보내드립니다.
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="가입한 이메일을 입력하세요"
            autoComplete="email"
          />
          <Button type="submit" variant="primary" size="lg" disabled={loading || !email} className="mt-2">
            {loading ? '전송 중...' : '임시 비밀번호 받기'}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-8 animate-fade-up">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.8} className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-bold text-app-black">이메일을 발송했습니다!</p>
            <p className="text-sm text-app-gray mt-1">{email}로<br />임시 비밀번호를 보냈습니다.</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate('/login/email')}>
            로그인 화면으로
          </Button>
        </div>
      )}
    </div>
  );
}
