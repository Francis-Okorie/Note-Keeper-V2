
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDoITq1gnioqWnnecAO16gtuO4vysiBL0k",
  authDomain: "savenote-d0c9f.firebaseapp.com",
  databaseURL: "https://savenote-d0c9f-default-rtdb.firebaseio.com",
  projectId: "savenote-d0c9f",
  storageBucket: "savenote-d0c9f.firebasestorage.app",
  messagingSenderId: "597978562739",
  appId: "1:597978562739:web:907b0b2ada3766b4c470c6",
  measurementId: "G-HDS0TE4S3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();


const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const emailInput = document.querySelector("#signup-email");
    const passwordInput = document.querySelector("#signup-password");
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        const errorMsg = document.querySelector(".error");
        errorMsg.innerHTML ="Please fill in both email and password fields."
        return;
    }
    
 createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    const successText = document.querySelector(".success");
    successText.classList.remove("hide");
    setTimeout(() => {
    successText.style.display = 'none';
    window.location.href ="index.html"
    }, 3000);
    
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const errorMsg = document.querySelector(".error");
    errorMsg.innerHTML = errorMessage;
    // ..
  });
});