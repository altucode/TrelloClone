TrelloClone.Models.Board = Backbone.Model.extend({
  name: "board",
  urlRoot: "api/boards",
  parse: function(response) {
    if (response.lists) {
      this.lists().set(response.lists, { parse: true });
      delete response.lists;
    }
    if (response.members) {
      this.members().set(response.members, { parse: true });
      delete response.members;
    }

    return response;
  },
  lists: function () {
    return this._lists || (this._lists = new TrelloClone.Collection([], {
      model: TrelloClone.Models.List,
      url: 'api/lists'
    }));
  },
  members: function () {
    return this._members || (this._members = new TrelloClone.Collection([], {
      model: TrelloClone.Models.User,
      url: 'api/users'
    }))
  }
});