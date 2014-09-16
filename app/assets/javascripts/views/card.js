TrelloClone.Views.Card = TrelloClone.Views.ListView.extend({
  template: JST['card'],
  className: 'card',
  itemView: function () { return TrelloClone.Views.Item; },
  collection: function() { return this.model.items(); }
});