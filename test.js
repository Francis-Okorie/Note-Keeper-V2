
saveNote.addEventListener("click", ()=>{
    if(noteText.value === ""){
        
        errorText.classList.remove("hide");
        errorText.innerHTML="Note cannot be empty!!!"
        setTimeout(() => {
            errorText.style.display = 'none';
        }, 3000);
    }
    else{

    let borderCon = document.createElement("div");
    borderCon.setAttribute("class", "bordercontainer");
    let storeHeader = document.createElement("h1");
    storeHeader.innerHTML = inputHeader.value;
    let deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("class", "delete-btn");

    deleteBtn.src ="images/trash3-fill.svg";
    

    let storeText = document.createElement("p");
    storeText.innerText = noteText.value;
    borderCon.appendChild(storeHeader);
    borderCon.appendChild(storeText);
    borderCon.appendChild(deleteBtn);
    store.appendChild(borderCon);

    deleteBtn.addEventListener("click", (e)=>{
        if(e.target.tagName === "IMG"){
           e.target.parentElement.remove(); 
           updateLocalStorage() 
        }
        
    });

    saveNoteToFirebase(noteData);
    inputHeader.value = ""; 
    noteText.value = "";
    }
});




achiveBtn.addEventListener("click", ()=>{
    if(noteText.value === ""){
        
        errorText.classList.remove("hide");
        errorText.innerHTML="Note cannot be empty!!!";
        setTimeout(() => {
            errorText.style.display = 'none';
        }, 3000);
    }
    else {
    
    let borderCon = document.createElement("div");
    borderCon.setAttribute("class", "bordercontainer2");
    let storeHeader = document.createElement("h1");
    storeHeader.innerHTML = inputHeader.value;
    achiveTextCon.appendChild(storeHeader);

    let storeText = document.createElement("p");
    storeText.innerText = noteText.value;
    achiveTextCon.appendChild(storeText);
    let deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("class", "delete-btn");

    deleteBtn.src ="images/trash3-fill.svg";
    

    borderCon.appendChild(storeHeader);
    borderCon.appendChild(storeText);
    borderCon.appendChild(deleteBtn);

    achiveTextCon.appendChild(borderCon);
    

    deleteBtn.addEventListener("click", (e)=>{
        if(e.target.tagName === "IMG"){
            e.target.parentElement.remove();
            saveAchive()
        }
    });

    achieveValueLength();

    

    saveAchive()
    inputHeader.value = ""; 
    noteText.value = "";

    }
    
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

function showUpdateStorage() {
    const notesRef = ref(db, "notes");
    onValue(notesRef, (snapshot) => {
        store.innerHTML = ""; // Clear the current UI
      snapshot.forEach((childSnapshot) => {
        const note = childSnapshot.val();
        const borderCon = document.createElement("div");
        borderCon.setAttribute("class", "bordercontainer");
        let storeHeader = document.createElement("h1");
        storeHeader.innerText = note.header;
        let storeText = document.createElement("p");
        storeText.innerText = note.text;
        let deleteBtn = document.createElement("img");
        deleteBtn.setAttribute("class", "delete-btn");
        deleteBtn.src = "images/trash3-fill.svg";
        deleteBtn.addEventListener("click", () => {
          remove(ref(db, `notes/${childSnapshot.key}`));
        });
        borderCon.appendChild(storeHeader);
        borderCon.appendChild(storeText);
        borderCon.appendChild(deleteBtn);
        store.appendChild(borderCon);
      });
    });
}
  
function showAchive() {
    const archivesRef = ref(db, "archives");
    onValue(archivesRef, (snapshot) => {
      achiveTextCon.innerHTML = ""; // Clear the current UI
      snapshot.forEach((childSnapshot) => {
        const archive = childSnapshot.val();
        const borderCon = document.createElement("div");
        borderCon.setAttribute("class", "bordercontainer2");
        let storeHeader = document.createElement("h1");
        storeHeader.innerText = archive.header;
        let storeText = document.createElement("p");
        storeText.innerText = archive.text;
        let deleteBtn = document.createElement("img");
        deleteBtn.setAttribute("class", "delete-btn");
        deleteBtn.src = "images/trash3-fill.svg";
        deleteBtn.addEventListener("click", () => {
          remove(ref(db, `archives/${childSnapshot.key}`));
        });
        borderCon.appendChild(storeHeader);
        borderCon.appendChild(storeText);
        borderCon.appendChild(deleteBtn);
        achiveTextCon.appendChild(borderCon);
      });
    });
}

showUpdateStorage();
showAchive();

function saveNoteToFirebase(noteData) {
    const notesRef = ref(db, "notes");
    push(notesRef, noteData);
}
  
function saveAchiveToFirebase(archiveData) {
    const archivesRef = ref(db, "archives");
    push(archivesRef, archiveData);
}
