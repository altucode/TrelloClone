TrelloClone.Models.Card = Backbone.Model.extend({
  name: "card",
  urlRoot: "api/cards",
  parse: function(response) {
    if (response.items) {
      this.items().set(response.items, { parse: true });
      delete response.items;
    }
    if (response.members) {
      this.members().set(response.members, { parse: true });
      delete response.members;
    }
    return response;
  },
  items: function () {
    return this._items || (this._items = new TrelloClone.Collection([], {
      url: 'api/items',
      owner: this,
      comparator: 'id'
    }));
  },
  members: function() {
    return this._members || (this._members = new TrelloClone.Collection([], {
      url: 'api/card_assignments',
      owner: this
    }))
  }
});