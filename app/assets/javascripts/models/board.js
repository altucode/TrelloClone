TrelloClone.Models.Board = Backbone.Model.extend({
  name: "board",
  urlRoot: "api/boards",
  parse: function(response) {
    if (response.user) {
      this.user().set(response.user, { parse: true });
      delete response.user;
    }
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
  user: function () {
    return this._user || (this._user = new TrelloClone.Model());
  },
  lists: function () {
    return this._lists || (this._lists = new TrelloClone.Collection([], {
      model: TrelloClone.Models.List,
      url: 'api/lists',
      owner: this
    }));
  },
  members: function () {
    return this._members || (this._members = new TrelloClone.Collection([], {
      url: 'api/board_memberships',
      owner: this
    }))
  }
});