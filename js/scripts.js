// Elementos
const notesContainer = document.querySelector('#notes-container');
const noteInput = document.querySelector('#note-content');
const addNoteBtn = document.querySelector('.add-note');
const exportBtn = document.querySelector('#export-notes');

let notes = [];

// Funções
function addNote() {
  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  }

  const noteEl = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteEl);
  notes.push(noteObject);
  saveNotesToStorage();
  noteInput.value = "";
}

function generateId() {
  return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed) {
  const elem = document.createElement("div");
  elem.classList.add("note");

  const textarea = document.createElement("textarea");
  textarea.setAttribute("spellcheck", "false");
  textarea.value = content;
  textarea.placeholder = "Adicione algum texto...";

  elem.appendChild(textarea);

  const pinIcon = document.createElement("i");
  pinIcon.classList.add("bi", "bi-pin");
  pinIcon.title = 'Fixar nota';
  elem.appendChild(pinIcon);

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("bi", "bi-x-lg");
  deleteIcon.title = 'Excluir nota';
  elem.appendChild(deleteIcon);

  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add("bi", "bi-file-earmark-plus");
  duplicateIcon.title = 'Copiar nota';
  elem.appendChild(duplicateIcon);

  if (fixed) {
    elem.classList.add("fixed");
  }

  elem.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  })

  elem.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, elem);
  })

  elem.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
    copyNote(id);
  })

  return elem;
}

function deleteNote(id, elem) {
  notes = notes.filter(note => note.id !== id);
  saveNotesToStorage();
  notesContainer.removeChild(elem);
}

function toggleFixNote(id) {
  const myNote = notes.filter(note => note.id === id)[0];
  myNote.fixed = !myNote.fixed;
  saveNotesToStorage();
  showNotes();
}

function copyNote(id) {
  const note = notes.filter(note => note.id === id)[0];

  const noteObj = {
    id: generateId(),
    content: note.content,
    fixed: false,
  }

  const noteElem = createNote(noteObj.id, noteObj.content, noteObj.fixed);
  notesContainer.appendChild(noteElem);
  notes.push(noteObj);
  saveNotesToStorage();
}

function saveNotesToStorage() {
  localStorage.setItem("devnotes", JSON.stringify(notes));
}

function getNotesFromStorage() {
  notes = JSON.parse(localStorage.getItem("devnotes") || "[]");
  showNotes();
}

function showNotes() {
  clearNotes();
  notes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1);

  notes.forEach(note => {
    const noteEl = createNote(note.id, note.content, note.fixed);
    notesContainer.appendChild(noteEl);
  })
}

function clearNotes() {
  notesContainer.replaceChildren([]);
}

const linkCsv = (string) =>
  `data:text/csvcharset=utf-8,${encodeURIComponent(string)}`

function exportNotesToCSV() {
  const output = notes.map(note => {
    return `${note.id} | ${note.fixed} | ${note.content}`;
  })
  .join('\n');
  return output
}

// Eventos
addNoteBtn.addEventListener("click", addNote);

exportBtn.addEventListener("click", () => {
  const stringCsv = exportNotesToCSV();
  exportBtn.setAttribute('href', linkCsv(stringCsv))
  exportBtn.setAttribute('download', 'notes.csv')
});

// On Load
getNotesFromStorage();
