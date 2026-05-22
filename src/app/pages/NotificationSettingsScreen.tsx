import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Plus, Trash2, ChevronLeft, Check } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { requestNotificationPermission } from '../../main/features/firebase/firebase';
import { alertApi } from '../../main/features/domain/notification/alertApi';
import type { AlertDto } from '../../main/features/domain/notification/alertApi';

const REPEAT_OPTIONS = [
  { value: 'NONE', label: '1회' },
  { value: 'DAY',  label: '매일' },
  { value: 'WEEK', label: '매주' },
] as const;

export function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('단어 학습할 시간이에요! 📚');
  const [repeat, setRepeat] = useState<'NONE' | 'DAY' | 'WEEK'>('DAY');
  const [alertTime, setAlertTime] = useState('09:00');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotifEnabled(typeof Notification !== 'undefined' && Notification.permission === 'granted');
    void loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const result = await alertApi.getAlerts();
      setAlerts(result?.alerts ?? []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotif = async () => {
    if (notifEnabled) {
      setNotifEnabled(false);
      return;
    }
    const token = await requestNotificationPermission();
    if (token) {
      await alertApi.registerFcmToken(token).catch(() => {});
      setNotifEnabled(true);
    } else {
      alert('알림 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.');
    }
  };

  const handleSave = async () => {
    if (!message.trim()) return;
    setSaving(true);
    try {
      await alertApi.createAlert({ message, repeat, alertedAt: alertTime });
      setShowForm(false);
      setMessage('단어 학습할 시간이에요! 📚');
      setRepeat('DAY');
      setAlertTime('09:00');
      await loadAlerts();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (alertId: number) => {
    await alertApi.deleteAlert(alertId).catch(() => {});
    setAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">
        <div className="px-4 pt-4 pb-3 flex items-center bg-white border-b border-surface-lighter">
          <button type="button" onClick={() => navigate(-1)} className="text-text-sub bg-transparent border-0">
            <ChevronLeft size={26} />
          </button>
          <h1 className="text-lg font-bold text-text-main ml-2">알림 설정</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {/* 푸시 알림 토글 */}
          <div className="rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-blue">
                <Bell size={20} color="#1c1c1c" />
              </div>
              <div>
                <p className="font-semibold text-[15px] text-text-main">푸시 알림</p>
                <p className="text-xs text-text-sub">학습 알림을 받아보세요</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleToggleNotif()}
              className={`w-12 h-6 rounded-full transition-colors relative border-0 ${notifEnabled ? 'bg-brand-blue-dark' : 'bg-surface-lighter'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* 알림 목록 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-text-main">등록된 알림</p>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1 text-[13px] text-brand-blue-dark font-semibold bg-transparent border-0"
              >
                <Plus size={15} />
                추가
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3">
                    <p className="text-sm font-semibold text-text-main">새 알림 만들기</p>
                    <div>
                      <p className="text-xs text-text-sub mb-1">메시지</p>
                      <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-text-main bg-surface-input outline-none"
                        placeholder="알림 메시지를 입력하세요"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-text-sub mb-1">알림 시간</p>
                        <input
                          type="time"
                          value={alertTime}
                          onChange={(e) => setAlertTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-text-main bg-surface-input outline-none"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-text-sub mb-1">반복</p>
                        <div className="flex gap-1 h-[42px]">
                          {REPEAT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setRepeat(opt.value)}
                              className={`flex-1 rounded-xl text-xs font-semibold border-0 ${repeat === opt.value ? 'bg-brand-blue-dark text-white' : 'bg-surface-muted text-text-sub'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 py-2.5 rounded-xl bg-surface-muted text-text-sub text-sm font-semibold border-0"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSave()}
                        disabled={saving || !message.trim()}
                        className="flex-1 py-2.5 rounded-xl bg-brand-blue text-text-main text-sm font-semibold border-0 flex items-center justify-center gap-1"
                      >
                        {saving ? '저장 중...' : <><Check size={14} />저장</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 rounded-2xl animate-pulse bg-[#e5e7eb]" />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <span className="text-[40px]">🔕</span>
                <p className="text-sm text-text-sub">등록된 알림이 없어요</p>
                <p className="text-xs text-text-sub">+ 추가 버튼으로 알림을 만들어보세요</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.alertId}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-3.5 bg-white shadow-sm flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand-blue">
                      <Bell size={16} color="#1c1c1c" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-main truncate">{alert.message}</p>
                      <p className="text-xs text-text-sub">
                        {alert.alertedAt} · {REPEAT_OPTIONS.find((o) => o.value === alert.repeat)?.label ?? alert.repeat}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDelete(alert.alertId)}
                      className="p-2 rounded-xl bg-transparent border-0 text-destructive flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
