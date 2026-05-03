import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { MobileLayout } from '../components/MobileLayout';

export function SplashScreen() {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      navigate(currentUser ? '/home' : '/welcome', { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [isLoading, currentUser, navigate]);

  return (
    <MobileLayout>
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ background: '#B8D0FA' }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="rounded-3xl flex items-center justify-center shadow-lg"
            style={{ width: 96, height: 96, background: '#fff' }}
          >
            <span style={{ fontSize: 48 }}>📖</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
              VocaBuddy
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              영단어 학습 코치
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex gap-2 absolute"
          style={{ bottom: 80 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 8, height: 8, background: 'rgba(255,255,255,0.7)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </MobileLayout>
  );
}