TrelloClone.Views.Card = TrelloClone.Views.ListView.extend({
  template: JST['card'],
  className: 'card',
  events: {
    'click .tool.edit': 'showModal'
  },
  initialize: function(options) {
    this.collection = this.model.items();
    this.$el.attr('draggable', true);
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.Item; },

  dragProps: function () {
    return ['id', 'list_id'];
  },

  showModal: function (event) {
    this.parent.parent.cardModal().setModel(this.model);
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