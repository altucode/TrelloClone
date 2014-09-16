TrelloClone.Views.Item = Backbone.View.extend({
  template: JST["item"],
  className: 'item',
  initialize: function(options) {
    this.tagName = options.tagName;
  },
  render: function() {
    var content = this.template({ model: this.model });
    this.$el.html(content);

    return this;
  }
});