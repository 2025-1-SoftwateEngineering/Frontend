import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Mail } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';

export function LoginOptionsScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col" style={{ background: '#fff' }}>
        <div className="flex items-center px-4 pt-12 pb-6">
          <button onClick={() => navigate('/welcome')} style={{ color: '#737373', background: 'none', border: 'none' }}>
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
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1c1c1c', marginBottom: 6 }}>로그인</h1>
            <p style={{ fontSize: 14, color: '#737373' }}>계속하려면 로그인 방식을 선택해 주세요</p>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login/email')}
              className="w-full flex items-center rounded-2xl py-4 px-5 gap-3 shadow-sm"
              style={{ background: '#B8D0FA', color: '#1c1c1c', border: 'none', fontSize: 16 }}
            >
              <span className="flex items-center justify-center" style={{ width: 28 }}>
                <Mail size={20} color="#1c1c1c" />
              </span>
              <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 15 }}>이메일로 로그인</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ fontSize: 12, color: '#737373' }}>또는</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full rounded-2xl py-4"
            style={{ background: '#f3f3f5', color: '#1c1c1c', fontSize: 15, fontWeight: 600 }}
          >
            회원가입
          </button>

          <div className="mt-8 p-4 rounded-xl" style={{ background: '#F8EDD6' }}>
            <p style={{ fontSize: 12, color: '#776A77', textAlign: 'center', lineHeight: 1.7 }}>
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
