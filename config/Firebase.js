import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD9gkvVnUAUciCuS-BEeIjIFNR2r25m9K4",
    authDomain: "helpu-c53ec.firebaseapp.com",
    databaseURL: "https://helpu-c53ec.firebaseio.com",
    projectId: "helpu-c53ec",
    storageBucket: "helpu-c53ec.appspot.com",
    messagingSenderId: "999243242809",
    appId: "1:999243242809:web:9366c4ef2ca1359279dce8",
    measurementId: "G-DKYLDQ85NY"
}

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig);

export const db = Firebase.firestore();
export const st = Firebase.storage();

export default Firebase;
