import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyC6mFrSXdyKG-hrzreQEcskt88r31HEHgA',
  authDomain: 'project-9afb2849-a8f7-481e-a41.firebaseapp.com',
  projectId: 'project-9afb2849-a8f7-481e-a41',
  storageBucket: 'project-9afb2849-a8f7-481e-a41.firebasestorage.app',
  messagingSenderId: '14062205846',
  appId: '1:14062205846:web:04eb325b56063459147bb7',
  measurementId: 'G-QHM8KX0VTW',
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// VAPID 키는 Firebase 콘솔 → 프로젝트 설정 → 클라우드 메시징 → 웹 푸시 인증서에서 확인
const VAPID_KEY = '';

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY || undefined });
    return token ?? null;
  } catch {
    return null;
  }
}

export { onMessage };
