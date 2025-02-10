
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyCzDNbrsqkaMs6P0_o9Bmx_zJ5DWtqSm3s",
  authDomain: "todolist-e7ddb.firebaseapp.com",
  projectId: "todolist-e7ddb",
  storageBucket: "todolist-e7ddb.firebasestorage.app",
  messagingSenderId: "969299007078",
  appId: "1:969299007078:web:85557fa6527a8a87ed3fa7",
  measurementId: "G-DEKLT837JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Firestore database instance
const db = getFirestore(app);

// Function to Add Data
export const addTodo = async (task) => {
    try {
        await addDoc(collection(db, "tasks"), { task });
        console.log("Task added successfully!");
      } catch (error) {
        console.error("Error adding task:", error);
      }
};

// Function to Fetch Data
export const getTodos = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export default db;