TrelloClone.Routers.Router = Backbone.Router.extend({
  routes: {
    '': 'root',
    'boards': 'boardIndex',
    'boards/:id': 'boardShow',
    'lists/:id': 'listShow',
    'users/:id': 'userShow',
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