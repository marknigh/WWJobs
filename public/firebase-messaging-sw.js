importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyA9zrKJqlBzHwqGzyvnGCVzmLBCvRvgL10',
  authDomain: 'warson-woods-jobs.firebaseapp.com',
  projectId: 'warson-woods-jobs',
  storageBucket: 'warson-woods-jobs.appspot.com',
  messagingSenderId: '301535237396',
  appId: '1:301535237396:web:987ea2d36dbf5843e51e01',
  measurementId: 'G-P7HKREW6T7',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const notificationTitle = payload.notification?.title || 'No Title';
  const notificationOptions = {
    body: payload.notification?.body || 'No Body',
    icon: payload.notification?.icon || '/default-icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
