import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeIpjKuqgrm9E3DJHNPeE4iNBlVKa-D50",
    authDomain: "proyectofinal-2d034.firebaseapp.com",
    projectId: "proyectofinal-2d034",
    storageBucket: "proyectofinal-2d034.appspot.com",
    messagingSenderId: "295952897902",
    appId: "1:295952897902:web:46a83c413c972efb38d37f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();
const fs = app.firestore();
const storage = app.storage();


export { auth, fs, storage };







