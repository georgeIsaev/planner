class Note {
  static idCounter = 1
  static dragged = null

  constructor(id = null, content = '') {
    const $el = this.$el = document.createElement('div');

    $el.classList.add('note');
    $el.setAttribute('draggable', 'true');

    if (id) {
      $el.setAttribute('data-note-id', id);
      Note.idCounter = (id + 1) > Note.idCounter ? id + 1 : Note.idCounter;
    } else {
      $el.setAttribute('data-note-id', Note.idCounter);
      Note.idCounter++;
    }
    $el.textContent = content;
    
    Note.edit($el);
    Note.drag($el, this);
  }

  static edit(note) {
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
        if ( (Note.idCounter - 1) == parseInt(this.getAttribute('data-note-id')) ) {
          Note.idCounter--;
        }
        note.remove();
      }
      app.save();
    })
  }

  static drag(note, ths) {
    note.addEventListener('dragstart', ths.dragstart.bind(ths));
    note.addEventListener('dragend', ths.dragend.bind(ths));
    note.addEventListener('dragenter', ths.dragenter.bind(ths));
    note.addEventListener('dragover', ths.dragover.bind(ths));
    note.addEventListener('dragleave', ths.dragleave.bind(ths));
    note.addEventListener('drop', ths.drop.bind(ths));
  }

  dragstart(event) {
    event.stopPropagation();

    this.$el.classList.add('dragged');
    Note.dragged = this.$el;
  }

  dragend(event) {
    event.stopPropagation();

    this.$el.classList.remove('dragged');
    Note.dragged = null;
  
    document.querySelectorAll('.note')
      .forEach(x => x.classList.remove('under'));

    
    app.save();
  }
  
  dragenter(event) {
    event.stopPropagation();

    if (!Note.dragged || this.$el === Note.dragged) return;
    this.$el.classList.add('under');
  }

  dragover(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!Note.dragged || this.$el === Note.dragged) return;
  }

  dragleave(event) {
    event.stopPropagation();

    if (!Note.dragged || this.$el === Note.dragged) return;
    this.$el.classList.remove('under');
  }

  drop(event) {
    event.stopPropagation();

    if (this.$el === Note.dragged) return;
  
    if (this.$el.parentElement === Note.dragged.parentElement) {
      const notes = Array.from(this.$el.parentElement.querySelectorAll('.note'));
      const indexA = notes.indexOf(this.$el);
      const indexB = notes.indexOf(Note.dragged);
  
      if (indexA < indexB) this.$el.parentElement.insertBefore(Note.dragged, this.$el);
      if (indexA > indexB) this.$el.parentElement.insertBefore(Note.dragged, this.$el.nextElementSibling);
  
    } else {
      this.$el.parentElement.insertBefore(Note.dragged, this.$el);
    }
  }
}
