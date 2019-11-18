const app = new Applecation();

// Добавление новой колонки
document.querySelector('[data-action-addColumn]')
  .addEventListener('click', function(e) {
    let column = new Column();

    document.querySelector('.columns')
      .append(column.$el);
    
    app.save();
  });

app.load();
app.save();
