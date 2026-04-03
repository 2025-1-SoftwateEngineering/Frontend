import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function EmailLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-black text-app-black">이메일 로그인</h1>
        <p className="text-sm text-app-gray mt-1">이메일과 비밀번호를 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          autoComplete="email"
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          type="button"
          onClick={() => navigate('/login/password-reset')}
          className="self-end text-xs text-app-gray underline"
        >
          비밀번호를 잊으셨나요?
        </button>

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-2">
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      {/* 데모 계정 안내 */}
      <div className="mt-8 p-4 bg-primary/10 rounded-xl">
        <p className="text-xs font-bold text-primary-dark mb-2">데모 계정</p>
        <p className="text-xs text-app-gray">일반: user@example.com / 1234</p>
        <p className="text-xs text-app-gray">관리자: admin@example.com / admin1234</p>
      </div>
    </div>
  );
}
