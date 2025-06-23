import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAm7L_B4ve6ximY_0fvfx2HlKbXPEH_rw4",
  authDomain: "mae-mobile-finance-assistant.firebaseapp.com",
  projectId: "mae-mobile-finance-assistant",
  storageBucket: "mae-mobile-finance-assistant.firebasestorage.app",
  messagingSenderId: "951500087922",
  appId: "1:951500087922:web:618824072d5f396dd858eb"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;

export default firebase;
