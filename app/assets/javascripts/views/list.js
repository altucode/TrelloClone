TrelloClone.Views.List = TrelloClone.Views.ListView.extend({
  template: JST['list'],
  className: 'list expander',
  itemView: function () { return TrelloClone.Views.Card; },
  collection: function() { return this.model.cards(); },
});