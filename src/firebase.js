import firebase from 'firebase'

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyA-bSHG52f5ZF6iLAoWWdfh-Od4UHxW8RM",
    authDomain: "instagram-clone-react-42f4b.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-42f4b-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-42f4b",
    storageBucket: "instagram-clone-react-42f4b.appspot.com",
    messagingSenderId: "1016799579230",
    appId: "1:1016799579230:web:f5f92a996386939922b8cf",
    measurementId: "G-5V012T882Q"
  });

const db=firebaseApp.firestore();
const auth=firebaseApp.auth();
const storage=firebaseApp.storage();

export {db,auth,storage};