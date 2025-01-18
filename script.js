
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoITq1gnioqWnnecAO16gtuO4vysiBL0k",
    authDomain: "savenote-d0c9f.firebaseapp.com",
    projectId: "savenote-d0c9f",
    storageBucket: "savenote-d0c9f.appspot.com",
    messagingSenderId: "597978562739",
    appId: "1:597978562739:web:907b0b2ada3766b4c470c6",
    databaseURL: "https://savenote-d0c9f-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUID = user.uid;
        console.log("User is authenticated:", user.uid);
        showUpdateStorage();
        showAchive();
    } else {
        currentUserUID = null;
        console.error("No user is authenticated. Please log in.");
        alert("Please log in to view and manage your notes.");
        window.location.href = "login.html";
    }
});


const testRef = ref(db, "test"); 
set(testRef, { message: "Hello, Firebase!" })
    .then(() => console.log("Data written successfully"))
    .catch((error) => console.error("Error writing data:", error));

const createBtn = document.querySelector(".create-btn");
const createNote = document.querySelector(".create-note");
const noteText = document.querySelector("#note-text");
const note =document.querySelector(".note");
const inputBox = document.querySelector(".input");
const inputBoxHeader = document.querySelector(".inputheader");
const downTools = document.querySelector(".tools");
const saveNote = document.querySelector(".save-note");
const store = document.querySelector(".store");
const achiveBtn = document.querySelector(".achive")
const achiveContainer = document.querySelector(".achieve-container");
const achiveContainerHeader = document.querySelector(".achieve-container-header");
const achiveTextCon = document.querySelector(".achive-textcontent");
const errorText = document.querySelector(".error");
const border = document.querySelector(".border");
const deleteBin = document.querySelectorAll(".bin");
const borderContainerElement = document.querySelector(".bordercontainer");


const inputHeader = document.querySelector(".inputheader");
achiveContainerHeader.style.fontWeight="300";

createBtn.addEventListener("click", handleTextArea);
saveNote.addEventListener("click", saveClick);
achiveBtn.addEventListener("click", archiveClick);

function handleTextArea(){
    note.classList.toggle("hide");
    noteText.classList.toggle("hide");
    inputBox.classList.add("hide");
    downTools.classList.add("hide");
}

noteText.addEventListener("click", ()=>{
    inputBox.classList.remove("hide");
    downTools.classList.remove("hide");
});

function achieveValueLength(){
    let achiveLength = document.querySelectorAll(".bordercontainer2").length;
    console.log(achiveLength);
    let acrhiveContainerNew = document.querySelector(".achieve-container-header");
    acrhiveContainerNew.innerHTML=`Your Archive (${achiveLength})`
}



achiveContainerHeader.addEventListener("click", ()=>{
    achiveTextCon.classList.toggle("hide");
});


function saveClick (){
    const saveNoteHeader = inputBoxHeader.value;
    const saveNoteText = noteText.value;
    if (noteText.value === ""){
        errorDisplay ();
        return;
    }

    const saveClickData = {
        header: saveNoteHeader || "Untitled", 
        text: saveNoteText
    }

    saveNoteToFirebase(saveClickData);
}

function archiveClick (){
    const saveNoteHeader = inputBoxHeader.value;
    const saveNoteText = noteText.value;
    if (noteText.value === ""){
        errorDisplay ();
        return;
    }

    const archiveClickData = {
        header: saveNoteHeader || "Untitled",
        text: saveNoteText
    }

    archiveNoteToFirebase(archiveClickData);

}

function showUpdateStorage() {
    if (!currentUserUID) return;
    const notesRef = ref(db, `users/${currentUserUID}/notes`);
    onValue(notesRef, (snapshot) => {
        store.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const note = childSnapshot.val();
            createNoteUI(note, childSnapshot.key, "notes");
        });
    });
}

function showAchive() {
    if (!currentUserUID) return;
    const archivesRef = ref(db, `users/${currentUserUID}/archive`);
    onValue(archivesRef, (snapshot) => {
        achiveTextCon.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const archive = childSnapshot.val();
            console.log("Archiving item:", archive);
            createNoteUI(archive, childSnapshot.key, "archive");
        });
        achieveValueLength()
    });

    
}


function createNoteUI(data, key, type){
    const containerNote = document.createElement("div");
    containerNote.setAttribute("class", type === "notes" ? "bordercontainer" : "bordercontainer2");

    const header = document.createElement("h1");
    header.innerHTML = data.header;

    const text = document.createElement("p");
    text.innerHTML = data.text;

    const deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("class", "delete-btn");
    deleteBtn.src = "images/trash3-fill.svg";
    deleteBtn.addEventListener("click", () => {
        console.log("Delete button clicked");
    remove(ref(db, `users/${currentUserUID}/${type}/${key}`));
    });

    containerNote.appendChild(header);
    containerNote.appendChild(text);
    containerNote.appendChild(deleteBtn);

    if(type === "notes"){
        store.appendChild(containerNote);
    }else if(type === "archive") {
        achiveTextCon.appendChild(containerNote);
    }
}

function saveNoteToFirebase(saveClickData){
    inputHeader.value = ""; 
    noteText.value = "";
    
    if (!currentUserUID) return;
    const notesRef = ref(db, `users/${currentUserUID}/notes`);
    push(notesRef, saveClickData);

}

function archiveNoteToFirebase(archiveClickData){
    
    if (!currentUserUID) return;

    const archivesRef = ref(db, `users/${currentUserUID}/archive`);
    push(archivesRef, archiveClickData)
        .then(() => {
            console.log("Note archived successfully!");
            showAchive();  
        })
        .catch((error) => {
            console.error("Error archiving note:", error);
    });

    inputHeader.value = ""; 
    noteText.value = "";
}

function errorDisplay () {
    errorText.classList.remove("hide");
    errorText.innerHTML="Note cannot be empty!!!"
    setTimeout(() => {
    errorText.style.display = 'none';
    }, 3000);
}

showUpdateStorage();
showAchive();