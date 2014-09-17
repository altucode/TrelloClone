TrelloClone.Views.CardModal = Backbone.View.extend({
  template: JST['card_modal'],
  className: 'toggler modal',

  render: function() {
    var model = this.model;
    var available = model.list.board.members().models.filter(function (member) {
      return !model.members().findWhere({ id: member.id });
    });
    var content = this.template({ model: this.model, available: available });
    this.$el.html(content);
    this.itemView().setElement()
  },
  remove: function() {
    this.memberView().remove();
    this.itemView().remove();
    Backbone.View.prototype.remove.call(this);
  },
  itemView: function() {
    return this._itemView || (this._itemView = new TrelloClone.Views.ListView({
      model: this.model,
      collection: this.model.items(),
      selector: 'ol'
    }));
  },
  memberView: function() {
    return this._memberView || (this._memberView = new TrelloClone.Views.ListView({
      model: this.model,
      collection: this.model.members(),
      selector: 'ol'
    }));
  }
});