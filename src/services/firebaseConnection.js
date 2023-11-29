import {  initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
import {} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCrh_3a-5decaLppSHK8Vo_mW30YglK0xw",
  authDomain: "tickets-fa202.firebaseapp.com",
  projectId: "tickets-fa202",
  storageBucket: "tickets-fa202.appspot.com",
  messagingSenderId: "766805342174",
  appId: "1:766805342174:web:59a8ace487117c876f4f4f",
  measurementId: "G-L33L1VM964"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getFirestore(firebaseApp);

export { auth, db, storage };








