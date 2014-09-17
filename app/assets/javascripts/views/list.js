TrelloClone.Views.List = TrelloClone.Views.ListView.extend({
  template: JST['list'],
  className: 'list toggler',
  events: {
    'dragover': 'dragOver',
    'drop': 'drop'
  },

  initialize: function(options) {
    this.collection = this.model.cards();
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.Card; },

  dragOver: function (event) {
    if (event.dataTransfer.getData('card/id')) {
      event.preventDefault();
    }
  },

  drop: function (event) {
    var id = event.dataTransfer.getData('card/id');
    if (id) {
      var list_id = event.dataTransfer.getData('card/list_id');
      var model = this.parent.lists().get(list_id).cards().get(id);
      this.parent.lists().get(list_id).cards().remove(model);
      this.add()
    }
  }
});