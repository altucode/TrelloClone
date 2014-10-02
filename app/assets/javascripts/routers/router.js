TrelloClone.Routers.Router = Backbone.Router.extend({
  routes: {
    '': 'root',
    'boards': 'boardIndex',
    'boards/:id': 'boardShow',
    'lists/:id': 'listShow',
    'users/:id': 'userShow',
  },

  boardIndex: function() {
    this.boards().fetch();
    var boardsView = new TrelloClone.Views.ListView({
      template: JST['board_index'],
      collection: this.boards(),
      itemTemplate: JST['board_small']
    });
    this._swapView(boardsView);
  },

  boardShow: function(id) {
    var board = this.boards().getOrFetch(id);
    var boardView = new TrelloClone.Views.Board({ model: board });
    this._swapView(boardView);
  },

  _swapView: function(newView) {
    this._currentView && this._currentView.remove();

    $("#content").html(newView.render().$el);
    this._currentView = newView;
  },

  boards: function() {
    return this._boards || (this._boards = new TrelloClone.Collection([], {
      model: TrelloClone.Models.Board,
      url: 'api/boards'
    }));
  }
});