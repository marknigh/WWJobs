declare module '@/lib/firebase-config' {
  import { FirebaseApp } from 'firebase/app';
  import { Firestore } from 'firebase/firestore';
  import { Auth } from 'firebase/auth';
  import { FirebaseStorage } from 'firebase/storage';
  import { Messaging } from 'firebase/messaging';

  export const app: FirebaseApp;
  export const db: Firestore;
  export const auth: Auth;
  export const storage: FirebaseStorage;
  export const messaging: Messaging;
}
