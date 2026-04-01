import { motion } from 'motion/react';
import { Users } from 'lucide-react';

export function FriendsScreen() {
  return (
    <div className="flex flex-col" style={{ minHeight: '100%', background: '#f8f9ff' }}>
      <div className="px-5 pt-14 pb-5" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div className="flex items-center gap-2">
          <Users size={22} color="#94B9F3" />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1c1c1c' }}>친구</h1>
        </div>
        <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>친구와 함께 학습하면 더 재미있어요</p>
      </div>

      <motion.div
        className="flex-1 flex flex-col items-center justify-center gap-4 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="rounded-full flex items-center justify-center"
          style={{ width: 100, height: 100, background: '#EDE9BF' }}>
          <span style={{ fontSize: 48 }}>👫</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1c1c1c' }}>준비 중입니다</h2>
        <p style={{ fontSize: 14, color: '#737373', textAlign: 'center', lineHeight: 1.7 }}>
          친구 기능이 곧 업데이트됩니다!<br />
          친구를 추가하고 함께 랭킹을 겨뤄보세요 🏆
        </p>

        <div className="w-full rounded-2xl p-4 mt-4" style={{ background: '#F8EDD6' }}>
          <p style={{ fontSize: 13, color: '#776A77', fontWeight: 600, marginBottom: 8 }}>예정 기능</p>
          {['친구 추가 및 팔로우', '학습 랭킹 비교', '함께 단어 테스트 하기', '학습 현황 공유'].map((f) => (
            <div key={f} className="flex items-center gap-2 py-1.5">
              <div className="rounded-full" style={{ width: 6, height: 6, background: '#DDDEA5', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#1c1c1c' }}>{f}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
