import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRf7-48LB7SIEz-fgP5NTL_P2oEPAaXe0",
    authDomain: "proyecto-final-66a17.firebaseapp.com",
    projectId: "proyecto-final-66a17",
    storageBucket: "proyecto-final-66a17.appspot.com",
    messagingSenderId: "342736321010",
    appId: "1:342736321010:web:b60373ffbad509162d536b"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();
const fs = app.firestore();
const storage = app.storage();


export { auth, fs, storage };







