TrelloClone.Views.Card = TrelloClone.Views.ListView.extend({
  template: JST['card'],
  className: 'card',
  events: {
    'dragstart': 'dragStart',
    'dragover': 'dragOver',
    'dragenter': 'toggleDrag',
    'dragleave': 'toggleDrag',
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

  toggleDrag: function (event) {
    this.$el.toggleClass('dragover');
    event.preventDefault();
  },

  removeDrag: function (event) {
    this.$el.removeClass('dragover');
    event.preventDefault();
  },

  drop: function (event) {
    if (event.dataTransfer.types.indexOf('card/id') >= 0) {
      if (event.dataTransfer.getData('card/id') === this.model.id) {
        event.preventDefault();
      }
      this.parent.drop(event, this.index);
      event.stopPropagation();
    }
  },
});