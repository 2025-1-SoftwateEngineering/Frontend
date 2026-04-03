import { useNavigate } from 'react-router-dom';

export default function LoginOptionsPage() {
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인은 백엔드 연동 후 지원됩니다.`);
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

      <div className="mb-10">
        <h1 className="text-2xl font-black text-app-black">로그인</h1>
        <p className="text-sm text-app-gray mt-1">VocaMaster에 오신 것을 환영합니다.</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleSocialLogin('Google')}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-app-black active:bg-gray-50 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google로 로그인
        </button>

        <button
          onClick={() => handleSocialLogin('카카오톡')}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#FEE500] text-sm font-semibold text-[#3A1D1D] active:opacity-80 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3A1D1D">
            <path d="M12 3C6.477 3 2 6.597 2 11.036c0 2.906 1.858 5.454 4.664 6.91-.194.74-.703 2.684-.804 3.098-.125.517.188.51.396.37.163-.112 2.586-1.757 3.633-2.47.685.098 1.392.15 2.111.15 5.523 0 10-3.597 10-8.036C22 6.597 17.523 3 12 3z" />
          </svg>
          카카오톡으로 로그인
        </button>

        <button
          onClick={() => navigate('/login/email')}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-primary-dark text-sm font-semibold text-primary-dark active:bg-primary/10 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          이메일로 로그인
        </button>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-app-gray">또는</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        onClick={() => navigate('/signup')}
        className="w-full py-3.5 rounded-xl bg-cream text-sm font-semibold text-app-black active:opacity-80 transition-all"
      >
        회원가입
      </button>

      <p className="mt-6 text-center text-xs text-app-gray leading-relaxed">
        로그인 시 <span className="underline">이용약관</span> 및{' '}
        <span className="underline">개인정보처리방침</span>에 동의합니다.
      </p>
    </div>
  );
}
