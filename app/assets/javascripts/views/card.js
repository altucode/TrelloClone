TrelloClone.Views.Card = TrelloClone.Views.ListView.extend({
  template: JST['card'],
  className: 'card',
  events: {
    'dragstart': 'dragStart'
  },
  initialize: function(options) {
    this.collection = this.model.items();
    this.$el.attr('draggable', true);
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.Item; },

  isDropTarget: function(event) {
    return (event.dataTransfer.types.indexOf('card/id') >= 0);
  },

  dragStart: function (event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('card/id', this.model.id);
    event.dataTransfer.setData('card/list_id', this.model.get('list_id'));
  },

  drop: function (event) {
    if (event.dataTransfer.types.indexOf('card/id') >= 0) {
      event.stopPropagation();
      if (event.dataTransfer.getData('card/id') == this.model.id) {
        return false;
      }
      this.parent.drop(event, this.index);
    }
  },
},[
  Draggable,
  Droppable
]);