class NewColumn {
  constructor() {
    this.columns = document.querySelectorAll('.column');
    this.addBtn = document.querySelector('[data-action-addColumn]');
    this.headers = document.querySelectorAll('.column-header');
    this.idCounter = +this.columns[this.columns.length-1].getAttribute('data-column-id') + 1;
    this.dragged = null;
    this.dropped = null;
  }

  create() {
    const newColumn = document.createElement('div');
    newColumn.classList.add('column');
    newColumn.setAttribute('draggable', 'true');
    newColumn.setAttribute('data-column-id', Column.idCounter);
  
    newColumn.innerHTML = `<p class="column-header">В плане</p>
                          <div data-notes></div>
                          <p class="column-footer">
                            <span data-action-addNote class="action">+ Добавить карточку</span>
                          </p>`;
  
    Column.idCounter++;
  
    document.querySelector('.columns').append(newColumn);
    Note.create(newColumn);
    Column.editHeader(newColumn.querySelector('.column-header'));
    Column.drag(newColumn);
  }

  editHeader(header) {
    header.addEventListener('dblclick', function(e) {
      header.setAttribute('contenteditable', 'true');
      header.removeAttribute('draggable');
      header.closest('.column').removeAttribute('draggable');
      header.focus();
    })
  
    header.addEventListener('blur', function(e) {
      header.removeAttribute('contenteditable');
      header.setAttribute('draggable', 'true');
      header.closest('.column').setAttribute('draggable', 'true');
    })
  }

  drag(column) {
    column.addEventListener('dragstart', Column.dragstart);
    column.addEventListener('dragend', Column.dragend);
    column.addEventListener('dragenter', Column.dragenter);
    column.addEventListener('dragover', Column.dragover);
    column.addEventListener('dragleave', Column.dragleave);
    column.addEventListener('drop', Column.drop);

    return this;
  }

  dragstart(event) {
    event.stopPropagation();

    this.classList.add('dragged')
    Column.dragged = this;
  }

  dragend(event) {
    event.stopPropagation();

    this.classList.remove('dragged')
    Column.dragged = null;
  
    document.querySelectorAll('.column')
      .forEach(x => x.classList.remove('under'));
  }
  
  dragenter(event) {
    event.stopPropagation();

    if (!Column.dragged || this === Column.dragged || !this.classList.contains('column')) return false;
    Array.from(this.children).forEach(x => x.style.pointerEvents = 'none');

    this.classList.add('under');
  }

  dragover(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!Column.dragged || this === Column.dragged) return;

    Column.dropped = this;
  }

  dragleave(event) {
    event.stopPropagation();

    if (!Column.dragged || this === Column.dragged || !this.classList.contains('column')) return false;
    Array.from(this.children).forEach(x => x.style.pointerEvents = '');
    this.classList.remove('under');
  }

  drop(event) {
    event.stopPropagation();

    if (this === Column.dragged) return;
  
    if (Note.dragged) {
      return this.querySelector('[data-notes]').append(Note.dragged);
    }
    
    if (Column.dragged) {
      const columns = Array.from(document.querySelectorAll('.column'));
      const indexA = columns.indexOf(this);
      const indexB = columns.indexOf(Column.dragged);

      if (indexA < indexB) this.parentElement.insertBefore(Column.dragged, this);
      if (indexA > indexB) this.parentElement.insertBefore(Column.dragged, this.nextElementSibling);
      Array.from(this.children).forEach(x => x.style.pointerEvents = '');
    }
  }
}

const Column = new NewColumn();