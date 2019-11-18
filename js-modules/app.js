class Applecation {
  constructor() {}

  save() {
    let obj = {
      columns: {
        idCounter: Column.idCounter,
        items: []
      },
      notes: {
        idCounter: Note.idCounter,
        items: []
      },
    };
    
    document.querySelectorAll('.column')
      .forEach(column => {
        const notes = Array.from(column.querySelectorAll('.note'));

        obj.columns.items.push({
          id: parseInt(column.getAttribute('data-column-id')),
          title: column.querySelector('.title').textContent,
          noteIds: notes.map(note => parseInt(note.getAttribute('data-note-id')))
        });
      });

    document.querySelectorAll('.note')
      .forEach(note => {
        obj.notes.items.push({
          id: parseInt(note.getAttribute('data-note-id')),
          columnId: parseInt(note.closest('.column').getAttribute('data-column-id')),
          text: note.textContent
        });
      });
    
    let plannerJSON = JSON.stringify(obj);
    localStorage.setItem('planner', plannerJSON);
  }

  load() {
    if (!localStorage.getItem('planner')) return;

    const entryPoint = document.querySelector('.columns');
    entryPoint.innerHTML = '';

    const plannerData = JSON.parse(localStorage.getItem('planner'));
    const getNoteById = id => plannerData.notes.items.find(item => item.id === id);

    for (let {id, title, noteIds} of plannerData.columns.items) {
      let column = new Column(id, title);

      entryPoint.append(column.$el);

      for (let noteId of noteIds) {
        let {id, columnId, text} = getNoteById(noteId);
        let entryColumn = document.querySelector(`div[data-column-id = '${columnId}']`);
        let note = new Note(id, text);

        entryColumn.querySelector('[data-notes]')
          .append(note.$el);
      }
    }
  }
}
