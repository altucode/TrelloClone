TrelloClone.Views.CardModal = TrelloClone.View.extend({
  template: JST['card_modal'],
  className: 'card modal on',

  events: {
    'blur .input.free:not([type=checkbox])': 'updateProp',
    'click .input.free[type=checkbox]': 'updateProp',
    'click .save': 'saveProp',
  },

  initialize: function() {
  },

  render: function() {
    if (!this.model) return this;
    var model = this.model;
    var content = this.template({ model: this.model });
    this.$el.html(content);
    this.itemView().setElement(this.$el.find('#items'));
    this.memberView().setElement(this.$el.find('.members'));
    this.itemView().render();
    this.memberView().render();

    this.delegateEvents();

    return this;
  },
  setModel: function(model) {
    this.stopListening(this.model, 'change', this.render);
    this.model = model;
    this.listenTo(this.model, 'change', this.render);
    this.memberView().remove();
    this.itemView().remove();
    this._itemView = null;
    this._memberView = null;
    this.render();
  },
  remove: function() {
    this.memberView().remove();
    this.itemView().remove();
    Backbone.View.prototype.remove.call(this);
  },
  itemView: function() {
    return this._itemView || (this._itemView = new TrelloClone.Views.ListView({
      model: this.model,
      emptyOnRender: true,
      collection: this.model.items(),
      itemView: TrelloClone.Views.Item,
      selector: 'ol'
    }));
  },
  memberView: function() {
    return this._memberView || (this._memberView = new TrelloClone.Views.ListView({
      model: this.model,
      collection: this.model.members(),
      template: JST['member_list'],
      selector: 'ol',
      pushFront: true
    }));
  },
  saveProp: function(event) {
    event.stopPropagation();
    var siblings = $(event.target).siblings('.input:not([type=hidden])');
    var hash = {};
    siblings.each(function(i, e) {
      hash[e.name] = e.type == 'checkbox' ? e.checked : e.value;
    });
    this.model.set(hash);
    this.model.save();
  },

  updateProp: function(event) {
    event.stopPropagation();
    var hash = {};
    hash[event.target.name] = event.target.type == 'checkbox' ? event.target.checked : event.target.value;
    this.model.set(hash);
    itthis.modelem.save();
  }
});