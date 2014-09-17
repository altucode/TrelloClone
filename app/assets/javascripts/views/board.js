TrelloClone.Views.Board = TrelloClone.Views.ListView.extend({
  template: JST['board'],
  className: 'board',
  initialize: function(options) {
    this.collection = this.model.lists();
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.List; }
});