window.TrelloClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new TrelloClone.Routers.Router();
    Backbone.history.start();
  }
};

TrelloClone.Collection = Backbone.Collection.extend({
  initialize: function(models, options) {
    if (options) {
      options.model && (this.model = options.model);
      options.url && (this.url = options.url);
    }
    Backbone.Collection.prototype.initialize.call(this, models, options);
  },
  getOrFetch: function(id) {
    var collection = this;
    var model;
    if (model = this.get(id)) {
      model.fetch();
    } else {
      model = new this.model({ id: id });
      model.fetch({
        success: function () {
          collection.add(model);
        }
      });
    }

    return model;
  }
});

TrelloClone.Model = Backbone.Model.extend({

});

TrelloClone.Views.ListView = Backbone.View.extend({
  events: {
    'submit form': 'addNew',
    'click .add': 'showForm',
    'click #clear': 'clearAll',
    'blur .input': 'updateItem',
    'click .delete': 'removeItem'
  },
  initialize: function (options) {
    options.tagName && (this.tagName = options.tagName);
    options.template && (this.template = options.template);
    this.ord = options.ord;
    this.listenTo(this.model, "add change remove", this.render);
  },

  render: function(n) {
    var content = !!this.template && this.template({ model: this.model, ord: this.ord });
    this.$el.html(content);

    var ol = this.$el.find('ol');
    var list = this;
    var i = 0;
    this.collection().forEach(function(model) {
      var subview = new (list.itemView())({ tagName: 'li', model: model, ord: i });
      list.subviews().push(subview);
      ol.append(subview.render().$el);
      ++i;
    });
    this.delegateEvents();

    return this;
  },

  addItem: function(item) {
    item.set('ord', this.collection().length);
    this.collection().add(item);
  },

  addNew: function(event) {
    event.preventDefault();

    var item = $(event.target).serializeJSON();
    item[this._assoc_name()] = this.model.id;
    this.collection().create(item, {
      success: function(model, response, options) {
        delete this.errors;
        $(event.target).siblings('form').toggleClass('hidden');
        $(event.target).toggleClass('hidden');
      },
      error: function(model, response, options) {
        this.errors = response.responseText;
      }
    });
    return false;
  },

  clearAll: function(event) {
    this.collection().reset();
    this.render();
  },

  removeItem: function(event) {
    event.preventDefault();

    var item = this.collection().at($(event.target).parents('li').attr('data-ord'));
    this.collection().remove(item);
  },

  updateItem: function(event) {
    event.preventDefault();

    var item = this.collection().at($(event.target).parents('li').attr('data-index'));
    var hash = {};
    hash[$(event.target).attr('name')] = $(event.target).val();
    item.set(hash);
  },

  remove: function() {
    this.subviews().forEach(function(subview) {
      subview.remove();
    });
    Backbone.View.prototype.remove.call(this);
  },

  showForm: function(event) {
    $(event.target).siblings('form').toggleClass('hidden');
    $(event.target).toggleClass('hidden');
    return false;
  },

  subviews: function() {
    return this._subviews || (this._subviews = []);
  },

  _assoc_name: function() {
    return this.model.name + "_id";
  }
});