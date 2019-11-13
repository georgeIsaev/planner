
// Добавление новых записей
Column.columns.forEach(column => {
  Note.create(column);
  Column.drag(column);
});

// Добавление новой колонки
Column.addBtn.addEventListener('click', function(e) {
  Column.create();
});

// Изменение записей при двойном клике
Note.notes.forEach(note => {
  Note.edit(note);
  Note.drag(note);
});

// Изменение заголовков при двойном клике
Column.headers.forEach(header => Column.editHeader(header));
