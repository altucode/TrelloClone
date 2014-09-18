TrelloClone.Models.List = Backbone.Model.extend({
  name: "list",
  urlRoot: "api/lists",
  parse: function(response) {
    if (response.cards) {
      this.cards().set(response.cards, { parse: true });
      delete response.cards;
    }

    return response;
  },
  cards: function () {
    return this._cards || (this._cards = new TrelloClone.Collection([], {
      model: TrelloClone.Models.Card,
      url: 'api/cards',
      owner: this
    }));
  }
});