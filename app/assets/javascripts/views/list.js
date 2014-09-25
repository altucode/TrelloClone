TrelloClone.Views.List = TrelloClone.Views.ListView.extend({
  template: JST['list'],
  className: 'list toggler',
  events: {
    'dragstart': 'dragStart'
  },

  initialize: function(options) {
    this.collection = this.model.cards();
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.Card; },

  dragProps: function () {
    return ['id', 'board_id'];
  },

  drop: function (event, ord) {
    ord || (ord = 0);
    if (event.dataTransfer.types.indexOf('card/id') >= 0) {
      var list = this.model.collection.get(event.dataTransfer.getData('card/list_id'));
      var model = list.cards().get(event.dataTransfer.getData('card/id'));
      list.cards().remove(model);
      this.collection.insert(model, ord);
    } else if (event.dataTransfer.types.indexOf('list/id') >= 0) {
      event.stopPropagation();
      if (event.dataTransfer.getData('list/id') == this.model.id) {
        return false;
      }
      this.parent.drop(event, this.index);
    }
    return false;
  }
},[
  Draggable,
  Droppable
]);