// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmW6oaREOdEXyTfj6tLbLwDRaXyrKtJ-s",
    authDomain: "diamondvaluation-1718484187119.firebaseapp.com",
    databaseURL: "https://diamondvaluation-1718484187119-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "diamondvaluation-1718484187119",
    storageBucket: "diamondvaluation-1718484187119.appspot.com",
    messagingSenderId: "1097918965642",
    appId: "1:1097918965642:web:6ab7c6f605327f3e29ca73",
    measurementId: "G-393G1MDFHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

// Export the storage
module.exports = { storage };