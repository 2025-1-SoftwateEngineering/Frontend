// ============================================================
//  ★ Firebase 설정값은 여기 한 곳만 수정하면 됩니다 ★
//  백엔드에서 제공받은 값으로 아래 플레이스홀더(firebaseConfig)를 교체하세요.
// ============================================================
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, type Messaging } from 'firebase/messaging';
import { apiFetch } from './apiConfig';

const firebaseConfig = {
  apiKey:            'AIzaSyC6mFrSXdyKG-hrzreQEcskt88r31HEHgA',        // ← 교체
  authDomain:        'project-9afb2849-a8f7-481e-a41.firebaseapp.com',    // ← 교체
  projectId:         'project-9afb2849-a8f7-481e-a41',     // ← 교체
  storageBucket:     'project-9afb2849-a8f7-481e-a41.firebasestorage.app', // ← 교체
  messagingSenderId: '14062205846', // ← 교체
  appId:             '1:14062205846:web:04eb325b56063459147bb7',         // ← 교체
  measurementId:     'G-QHM8KX0VTW', // ← 교체
};

// 중복 초기화 방지
let firebaseApp: FirebaseApp;
let messaging: Messaging | null = null;

export function initFirebase(): FirebaseApp {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  return firebaseApp;
}

// FCM Messaging 인스턴스 (브라우저 환경에서만 동작)
export function getFirebaseMessaging(): Messaging | null {
  try {
    if (!messaging) {
      const app = initFirebase();
      messaging = getMessaging(app);
    }
    return messaging;
  } catch {
    console.warn('[Firebase] 메시징을 초기화할 수 없습니다. (서비스 워커 미등록 등)');
    return null;
  }
}

// ─── FCM 토큰 발급 및 백엔드 등록 ────────────────────────────────────────────
/**
 * FCM 토큰을 발급받아 백엔드(POST /auth/v1/fcm)에 등록합니다.
 * - VAPID 키는 Firebase 콘솔 > 프로젝트 설정 > 클라우드 메시징에서 확인
 */
export async function registerFcmToken(vapidKey: string = '[FIREBASE_VAPID_KEY]'): Promise<void> {
  const msg = getFirebaseMessaging();
  if (!msg) return;

  try {
    const fcmToken = await getToken(msg, { vapidKey });
    if (!fcmToken) {
      console.warn('[Firebase] FCM 토큰을 가져올 수 없습니다.');
      return;
    }

    await apiFetch('/fcm', {
      method: 'POST',
      body:   JSON.stringify({ fcmToken }),
    });

    console.info('[Firebase] FCM 토큰이 백엔드에 등록되었습니다.');
  } catch (err) {
    console.error('[Firebase] FCM 토큰 등록 실패:', err);
  }
}
