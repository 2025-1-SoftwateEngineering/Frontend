import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Mail } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';

export function LoginOptionsScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center px-4 pt-12 pb-6">
          <button type="button" onClick={() => navigate('/welcome')} className="text-text-sub bg-transparent border-0" aria-label="뒤로 가기">
            <ChevronLeft size={26} />
          </button>
        </div>

        <motion.div
          className="flex flex-col flex-1 px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-10">
            <h1 className="text-[26px] font-bold text-text-main mb-1.5">로그인</h1>
            <p className="text-sm text-text-sub">계속하려면 로그인 방식을 선택해 주세요</p>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login/email')}
              className="w-full flex items-center rounded-2xl py-4 px-5 gap-3 shadow-sm bg-brand-blue text-text-main border-0 text-base"
            >
              <span className="flex items-center justify-center w-7">
                <Mail size={20} color="#1c1c1c" />
              </span>
              <span className="flex-1 text-center font-semibold text-[15px]">이메일로 로그인</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#e5e7eb]" />
            <span className="text-xs text-text-sub">또는</span>
            <div className="flex-1 h-px bg-[#e5e7eb]" />
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full rounded-2xl py-4 bg-surface-muted text-text-main text-[15px] font-semibold"
          >
            회원가입
          </button>

          <div className="mt-8 p-4 rounded-xl bg-brand-peach">
            <p className="text-xs text-brand-purple text-center leading-[1.7]">
              <strong>데모 계정</strong><br />
              일반: user@test.com / user123<br />
              관리자: admin@test.com / admin123
            </p>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
