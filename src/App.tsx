import { BrowserRouter as Router } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes'; // Import routes from the new file
import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './lib/firebase-config';

function App() {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
      } else {
        console.warn('No notification payload found:', payload);
      }
    });

    async function requestPermission() {
      try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        if (permission !== 'granted') {
          console.warn('Notification permission denied');
          return;
        }

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then((registration) => {
              console.log(
                'Service Worker registered with scope:',
                registration.scope
              );
            })
            .catch((error) => {
              console.error('Service Worker registration failed:', error);
            });
        } else {
          console.error('Service Worker not supported in this browser');
        }

        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
        });
        if (token) {
          console.log('FCM Token:', token);
        } else {
          console.warn('Failed to retrieve FCM Token');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }

    requestPermission();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
