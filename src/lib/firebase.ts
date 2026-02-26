import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC2um5B98bD_jRq1imiTnlbg5VNfxlFhbM",
  authDomain: "ramadan-413b9.firebaseapp.com",
  databaseURL: "https://ramadan-413b9-default-rtdb.firebaseio.com",
  projectId: "ramadan-413b9",
  storageBucket: "ramadan-413b9.firebasestorage.app",
  messagingSenderId: "552012714956",
  appId: "1:552012714956:android:ce1cb4d1cfdc6a76f40369"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
