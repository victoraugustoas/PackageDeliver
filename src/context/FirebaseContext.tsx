import { createContext, type ReactNode, useContext } from "react";

import { type FirebaseApp, initializeApp } from "firebase/app";
import { type AI, getAI, GoogleAIBackend } from "firebase/ai";
import { type Firestore, getFirestore } from "firebase/firestore";

interface FirebaseContextState {
  firebase: FirebaseApp;
  googleAI: AI;
  firestore: Firestore;
}

const firebaseConfig = {
  apiKey: "AIzaSyDp2k6TqBVrnj3Nhp4Feqzb_EoSxKL-2CA",
  authDomain: "package-deliver-874ff.firebaseapp.com",
  projectId: "package-deliver-874ff",
  storageBucket: "package-deliver-874ff.firebasestorage.app",
  messagingSenderId: "1020960442096",
  appId: "1:1020960442096:web:9cbcb7cf7c8547d27ea435",
  measurementId: "G-BGXJDKCTET",
};

const app = initializeApp(firebaseConfig);

const FirebaseContext = createContext<FirebaseContextState>(
  {} as FirebaseContextState,
);

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const db = getFirestore(app);

  return (
    <FirebaseContext.Provider
      value={{ firebase: app, googleAI: ai, firestore: db }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
