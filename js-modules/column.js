class Column {
  static idCounter = 1
  static dragged = null

  constructor(id = null, title = 'В плане') {

    const $el = this.$el = document.createElement('div');
    $el.classList.add('column');
    $el.setAttribute('draggable', 'true');

    if (id) {
      $el.setAttribute('data-column-id', id);
      Column.idCounter = (id + 1) > Column.idCounter ? id + 1 : Column.idCounter;
    } else {
      $el.setAttribute('data-column-id', Column.idCounter);
      Column.idCounter++;
    }
  
    $el.innerHTML = `
      <div class="column-header">
        <p class="title">${title}</p>
        <span data-action-delCol class="delete"></span>
      </div>
      <div data-notes></div>
      <p class="column-footer">
        <span data-action-addNote class="action">+ Добавить карточку</span>
      </p>
    `;

    Column.addNewNoteBtn($el);
    Column.editHeader($el.querySelector('.title'));
    Column.drag($el, this);
    Column.delete($el);    
  }

  static addNewNoteBtn(column) {
    column.querySelector('[data-action-addNote]')
    .addEventListener('click', function(e) {
      const newNote = new Note();

      column.querySelector('[data-notes]').append(newNote.$el);
      newNote.$el.setAttribute('contenteditable', 'true');
      newNote.$el.focus();
    });
  }

  static editHeader(header) {
    header.addEventListener('dblclick', function(e) {
      header.setAttribute('contenteditable', 'true');
      header.closest('.column').removeAttribute('draggable');
      header.focus();
    })
  
    header.addEventListener('blur', function(e) {
      header.removeAttribute('contenteditable');
      header.closest('.column').setAttribute('draggable', 'true');
      app.save();
    })
  }

  static delete(column) {
    column.querySelector('[data-action-delCol]')
      .addEventListener('click', function(e) {
        const notesCount = Array.from(column.querySelectorAll('.note')).length;

        if (notesCount === 0) {
          column.remove();
        } else {
          alert('Сначала удалите все записи из колонки!')
        }
      });
  }

  static drag(column, ths) {
    column.addEventListener('dragstart', ths.dragstart.bind(ths));
    column.addEventListener('dragend', ths.dragend.bind(ths));
    column.addEventListener('dragenter', ths.dragenter.bind(ths));
    column.addEventListener('dragover', ths.dragover.bind(ths));
    column.addEventListener('dragleave', ths.dragleave.bind(ths));
    column.addEventListener('drop', ths.drop.bind(ths));
  }

  dragstart(event) {
    event.stopPropagation();

    this.$el.classList.add('dragged')
    Column.dragged = this.$el;
  }

  dragend(event) {
    event.stopPropagation();

    this.$el.classList.remove('dragged')
    Column.dragged = null;
  
    document.querySelectorAll('.column')
      .forEach(x => x.classList.remove('under'));
  }
  
  dragenter(event) {
    event.stopPropagation();

    if (!Column.dragged || this.$el === Column.dragged || !this.$el.classList.contains('column')) return false;
    Array.from(this.$el.children).forEach(x => x.style.pointerEvents = 'none');

    this.$el.classList.add('under');
  }

  dragover(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!Column.dragged || this.$el === Column.dragged) return;
  }

  dragleave(event) {
    event.stopPropagation();

    if (!Column.dragged || this.$el === Column.dragged || !this.$el.classList.contains('column')) return false;
    Array.from(this.$el.children).forEach(x => x.style.pointerEvents = '');
    this.$el.classList.remove('under');
  }

  drop(event) {
    event.stopPropagation();

    if (this.$el === Column.dragged) return;
  
    if (Note.dragged) {
      return this.$el.querySelector('[data-notes]').append(Note.dragged);
    }
    
    if (Column.dragged) {
      const columns = Array.from(document.querySelectorAll('.column'));
      const indexA = columns.indexOf(this.$el);
      const indexB = columns.indexOf(Column.dragged);

      if (indexA < indexB) this.$el.parentElement.insertBefore(Column.dragged, this.$el);
      if (indexA > indexB) this.$el.parentElement.insertBefore(Column.dragged, this.$el.nextElementSibling);
      Array.from(this.$el.children).forEach(x => x.style.pointerEvents = '');
    }

    app.save();
  }
}
