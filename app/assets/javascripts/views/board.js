TrelloClone.Views.Board = TrelloClone.Views.ListView.extend({
  template: JST['board'],
  className: 'board',
  initialize: function(options) {
    this.collection = this.model.lists();
    TrelloClone.Views.ListView.prototype.initialize.call(this, options);
  },
  itemView: function () { return TrelloClone.Views.List; },

  render: function () {
    TrelloClone.Views.ListView.prototype.render.call(this);
    this.$el.find('#card-modal-toggler').append(this.cardModal().render().$el);

    return this;
  },

  cardModal: function () {
    return this._cardModal || (this._cardModal = new TrelloClone.Views.CardModal());
  },
  isDropTarget: function(event) {
    return (event.dataTransfer.types.indexOf('list/id') >= 0);
  },
  drop: function(event, ord) {
    ord || (ord = 0);
    if (event.dataTransfer.types.indexOf('list/id') >= 0) {
      var model = this.collection.get(event.dataTransfer.getData('list/id'));
      this.collection.remove(model);
      this.collection.insert(model, ord);
    }
    return false;
  }
},[
  Droppable
]);