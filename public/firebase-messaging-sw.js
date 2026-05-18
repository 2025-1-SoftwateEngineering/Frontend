importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC6mFrSXdyKG-hrzreQEcskt88r31HEHgA',
  authDomain: 'project-9afb2849-a8f7-481e-a41.firebaseapp.com',
  projectId: 'project-9afb2849-a8f7-481e-a41',
  storageBucket: 'project-9afb2849-a8f7-481e-a41.firebasestorage.app',
  messagingSenderId: '14062205846',
  appId: '1:14062205846:web:04eb325b56063459147bb7',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? '알림', {
    body: body ?? '',
    icon: '/favicon.ico',
  });
});
