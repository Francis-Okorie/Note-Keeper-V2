
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDoITq1gnioqWnnecAO16gtuO4vysiBL0k",
    authDomain: "savenote-d0c9f.firebaseapp.com",
    projectId: "savenote-d0c9f",
    storageBucket: "savenote-d0c9f.appspot.com",
    messagingSenderId: "597978562739",
    appId: "1:597978562739:web:907b0b2ada3766b4c470c6",
    databaseURL: "https://savenote-d0c9f-default-rtdb.firebaseio.com/"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const logoutBtn = document.querySelector(".log-out");
logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out successfully.");
            alert("You have been logged out. Redirecting to login page...");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error logging out:", error);
            alert("An error occurred while logging out. Please try again.");
        });
});

let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUID = user.uid;
        console.log("User is authenticated:", user.uid);
        const emailName = document.querySelector(".email-id");
        emailName.innerHTML = user.email;
        showUpdateStorage();
    } else {
        currentUserUID = null;
        window.location.href = "index.html";
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



window.addEventListener('load', function () {
    document.querySelector('.pre-loader').className += ' hidden';
});

const inputHeader = document.querySelector(".inputheader");
achiveContainerHeader.style.fontWeight="300";

createBtn.addEventListener("click", handleTextArea);
saveNote.addEventListener("click", saveClick);

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

    const date = new Date;
    const createdAt ={
        day : date.getDate(),
        month : date.getMonth(),
        year : date.getFullYear(),
        hour : date.getHours(),
        minutes : date.getMinutes().toString().padStart(2, "0"),
    }

    const saveClickData = {
        header: saveNoteHeader || "Untitled",
        text: saveNoteText,
        createdAt,
    };

    saveNoteToFirebase(saveClickData);
}



function showUpdateStorage() {
    if (!currentUserUID) return;
    const notesRef = ref(db, `users/${currentUserUID}/notes`);
    onValue(notesRef, (snapshot) => {
        store.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const noteKey = childSnapshot.key;
            const noteData = childSnapshot.val();
            if(noteData && noteKey){
                createNoteUI(noteData, noteKey);
            }
        });
    });
}




function createNoteUI(noteData, noteKey){
    const containerNote = document.createElement("div");
    containerNote.setAttribute("class", "bordercontainer");

    const header = document.createElement("h1");
    header.setAttribute("class", "header-font")
    header.innerHTML = noteData.header;

    const text = document.createElement("p");
    text.setAttribute("class", "text-small");
    text.innerHTML = noteData.text;

    const createdAt = noteData.createdAt || {};
    const { day, month, year, hour, minutes } = createdAt;

    const monthNames = [
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "August", "Sept", "Oct", "Nov", "Dec"
    ];

    const formattedMonth = monthNames[month] || "Unknown";
    
    const dateContent = document.createElement("div");
    dateContent.setAttribute("class", "date-content")

    const dateContainer = document.createElement("p")
    dateContainer.innerHTML = `${day} ${formattedMonth}, ${year}`

    const timeContainer = document.createElement("p")
    timeContainer.innerHTML = `${hour}:${minutes}`

    const deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("class", "delete-btn");
    deleteBtn.src = "images/trash3-fill.svg";
    deleteBtn.addEventListener("click", () => {
        console.log("Delete button clicked");
        const deletedHeader = header.innerHTML;
        const deletedText = text.innerHTML;
        
        const deletedArchive = document.createElement("div");
        deletedArchive.setAttribute("class", "bordercontainer2");

        const deletedNoteData = {
            header: deletedHeader,
            text: deletedText,
            
        };

        const archiveRef = ref(db, `users/${currentUserUID}/archives/${noteKey}`);
        set(archiveRef, deletedNoteData)
        .then(() => {
            remove(ref(db, `users/${currentUserUID}/notes/${noteKey}`))
        })
        .then(() => {
            containerNote.remove();
        })
        .catch((error) => {
            console.error("Error moving to archive:", error);
        });


        const deletedH1 = document.createElement("h1")
        const deletedp = document.createElement("p");
        const deletedImage = document.createElement("img");
        deletedImage.setAttribute("class", "delete-btn");
        const createdAt = noteData.createdAt;
        deletedImage.src = "images/trash3-fill.svg"

        deletedH1.innerHTML = deletedHeader;
        deletedp.innerHTML = deletedText;

        
        


        deletedImage.addEventListener("click", () => {
            remove(ref(db, `users/${currentUserUID}/archives/${noteKey}`))
            .then(() => {
                deletedArchive.remove()
            })
            .catch((error) => {
                console.error("Error deleting archived note:", error);
            })
        });

        deletedArchive.appendChild(deletedH1);
        deletedArchive.appendChild(deletedp);
        deletedArchive.appendChild(deletedImage);
        achiveTextCon.appendChild(deletedArchive);

    


        
    });

    dateContent.appendChild(dateContainer);
    dateContent.appendChild(timeContainer);

    containerNote.appendChild(header);
    containerNote.appendChild(text);
    containerNote.appendChild(deleteBtn);
    containerNote.appendChild(dateContent)
    if(store){
        store.appendChild(containerNote);
    }else {
        console.log("No Parent Element");
    }

    
}


function deletedArchiveToFirebase(){}



function saveNoteToFirebase(saveClickData){
    inputHeader.value = ""; 
    noteText.value = "";
    if (!currentUserUID) return;
    const notesRef = ref(db, `users/${currentUserUID}/notes`);
    push(notesRef, saveClickData);

}



function errorDisplay () {
    errorText.classList.remove("hide");
    errorText.innerHTML="Note cannot be empty!!!"
    setTimeout(() => {
    errorText.style.display = 'none';
    }, 3000);
}

const speechBtn = document.querySelector(".speech-btn");
const speech = true;
window.SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true; 
let isRecording = false;

recognition.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("");
    noteText.innerHTML = transcript;
});

speechBtn.addEventListener("click", ()=> {
    
    if(isRecording){
        recognition.stop();
        isRecording = false;
    }else {
        recognition.start();
        isRecording = true;
    }
});

showUpdateStorage();
