TrelloClone.Views.Board = TrelloClone.Views.ListView.extend({
  template: JST['board'],
  className: 'board',
  itemView: function () { return TrelloClone.Views.List; },
  collection: function() { return this.model.lists(); }
});