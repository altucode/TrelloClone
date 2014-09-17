TrelloClone.Views.Card = TrelloClone.Views.ListView.extend({
  template: JST['card'],
  className: 'card',
  events: {
    'dragStart': 'dragStart',
    'drop': 'drop'
  },
  initialize: function(options) {
    this.collection = this.model.items();
    this.$el.attr('draggable', true);
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.Item; },
  dragStart: function (event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('card/id', this.model.id);
    event.dataTransfer.setData('card/list_id', this.model.get('list_id'));
  },
  drop: function (event) {
    if (event.dataTransfer.get('card/id')) {
      event.dataTransfer.set('card/ord', this.model.get('ord'));
    }
  }
});