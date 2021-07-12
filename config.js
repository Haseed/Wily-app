import firebase from 'firebase';
 require('@firebase/firestore');     
     var firebaseConfig = {
    apiKey: "AIzaSyCyQ-q6ofVOXQVpOwVLc7yb2qtCRYfuckg",
    authDomain: "c-73-8e9c6.firebaseapp.com",
    projectId: "c-73-8e9c6",
    storageBucket: "c-73-8e9c6.appspot.com",
    messagingSenderId: "179399545781",
    appId: "1:179399545781:web:b2104deb518603da09bffc"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    export default firebase.firestore();