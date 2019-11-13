class NewColumn {
  constructor() {
    this.columns = document.querySelectorAll('.column');
    this.addBtn = document.querySelector('[data-action-addColumn]');
    this.headers = document.querySelectorAll('.column-header');
    this.idCounter = +this.columns[this.columns.length-1].getAttribute('data-column-id') + 1;
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
    column.addEventListener('dragover', function(event) {
      event.preventDefault()
    });
    column.addEventListener('drop', function(event) {
      if (Note.dragged) {
        return column.querySelector('[data-notes]').append(Note.dragged);
      }
    });
  }
}

const Column = new NewColumn();







