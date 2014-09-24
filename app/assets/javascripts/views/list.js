TrelloClone.Views.List = TrelloClone.Views.ListView.extend({
  template: JST['list'],
  className: 'list toggler',
  events: {
    'dragenter': 'toggleDrag',
    'dragleave': 'toggleDrag',
    'dragover': 'dragOver',
    'drop': 'drop'
  },

  initialize: function(options) {
    this.collection = this.model.cards();
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.Card; },

  toggleDrag: function (event) {
    this.$el.toggleClass('dragover');
    event.preventDefault();
  },

  dragOver: function (event) {
    if (event.dataTransfer.types.indexOf('card/id') >= 0) {
      event.preventDefault();
    }
  },

  drop: function (event, ord) {
    ord || (ord = 0);
    var id = event.dataTransfer.getData('card/id');
    if (typeof id != 'undefined') {
      var list = this.model.collection.get(event.dataTransfer.getData('card/list_id'));
      var model = list.cards().get(id);
      list.cards().remove(model);
      this.collection.insert(model, ord);
    }
    this.toggleDrag(event);
  }
});