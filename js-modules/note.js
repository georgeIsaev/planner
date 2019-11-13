class NewNote {
  constructor() {
    this.notes = document.querySelectorAll('.note');
    this.idCounter = +this.notes[this.notes.length-1].getAttribute('data-note-id') + 1;
    this.dragged = null;
  }

  create(column) {
    const addNoteBtn = column.querySelector('[data-action-addNote]');
  
    addNoteBtn.addEventListener('click', function(e) {
      const newNote = document.createElement('div');
      newNote.classList.add('note');
      newNote.setAttribute('draggable', 'true');
      newNote.setAttribute('data-note-id', Note.idCounter);
  
      Note.idCounter++;
  
      column.querySelector('[data-notes]').append(newNote);
      newNote.setAttribute('contenteditable', 'true');
      newNote.focus();
  
      Note.edit(newNote);
      Note.drag(newNote);
    });

    return this;
  }

  edit(note) {
    note.addEventListener('dblclick', function(e) {
      note.setAttribute('contenteditable', 'true');
      note.removeAttribute('draggable');
      note.closest('.column').removeAttribute('draggable');
      note.focus();
    })
  
    note.addEventListener('blur', function(e) {
      note.removeAttribute('contenteditable');
      note.setAttribute('draggable', 'true');
      note.closest('.column').setAttribute('draggable', 'true');
  
      if (!note.textContent.trim().length) {
        note.remove();
      }
    })

    return this;
  }

  drag(note) {
    note.addEventListener('dragstart', Note.dragstart);
    note.addEventListener('dragend', Note.dragend);
    note.addEventListener('dragenter', Note.dragenter);
    note.addEventListener('dragover', Note.dragover);
    note.addEventListener('dragleave', Note.dragleave);
    note.addEventListener('drop', Note.drop);

    return this;
  }

  dragstart(event) {
    this.classList.add('dragged')
    Note.dragged = this;
    event.stopPropagation();
  }

  dragend(event) {
    this.classList.remove('dragged')
    Note.dragged = null;
  
    document.querySelectorAll('.note').forEach(x => {
      x.classList.remove('under');
    })
  }
  
  dragenter(event) {
    if (this === Note.dragged) return;
    this.classList.add('under');
  }

  dragover(event) {
    event.preventDefault();
    if (this === Note.dragged) return;
  }

  dragleave(event) {
    if (this === Note.dragged) return;
    this.classList.remove('under');
  }

  drop(event) {
    event.stopPropagation();
    if (this === Note.dragged) return;
  
    if (this.parentElement === Note.dragged.parentElement) {
      const notes = Array.from(this.parentElement.querySelectorAll('.note'));
      const indexA = notes.indexOf(this);
      const indexB = notes.indexOf(Note.dragged);
  
      if (indexA < indexB) this.parentElement.insertBefore(Note.dragged, this);
      if (indexA > indexB) this.parentElement.insertBefore(Note.dragged, this.nextElementSibling);
  
    } else {
      this.parentElement.insertBefore(Note.dragged, this);
    }
  }
}

const Note = new NewNote();