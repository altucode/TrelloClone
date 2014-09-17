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
  comparator: 'ord',
  initialize: function(models, options) {
    if (options) {
      options.model && (this.model = options.model);
      options.url && (this.url = options.url);
    }
    Backbone.Collection.prototype.initialize.call(this, models, options);
  },
  remove: function (models, options) {
    if (collection.models.prototype.default.ord) {
      if (! models instanceof Array) models = [models];
      var collection = this;
      models.forEach(function (model) {
        collection.forEach(function (item) {
          if (item.get('ord') >= model.get('ord')) {
            item.set('ord', item.get('ord') - 1);
          }
        });
      });
    }
    Backbone.Collection.prototype.remove.call(models, options);
  },
  add: function (models, options) {
    if (collection.models.prototype.default.ord) {
      if (! models instanceof Array) models = [models];
      var collection = this;
      models.forEach(function (model) {
        collection.forEach(function (item) {
          if (item.get('ord') >= model.get('ord')) {
            item.set('ord', item.get('ord') + 1);
          }
        });
      });
    }
    Backbone.Collection.prototype.add.call(models, options);
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

TrelloClone.View = Backbone.View.extend({
  template: function() { return ""; },
  initialize: function (options) {
    options.tagName && (this.tagName = options.tagName);
    options.template && (this.template = options.template);
    options.parent && (this.parent = options.parent);
    Backbone.View.prototype.initialize.call(this, options);
  },
  render: function() {
    var content = !!this.template && this.template({ model: this.model, ord: this.ord });
    if (this.hasOwnProperty('ord')) { this.$el.attr('data-ord', this.ord); }
    this.$el.html(content);

    return this;
  }
});

TrelloClone.Views.ListView = TrelloClone.View.extend({
  events: {
    'submit form': 'addNew',
    'click #clear': 'clearAll',
    'blur .input': 'updateItem',
    'click li .delete': 'removeItem'
  },
  initialize: function (options) {
    options.itemView && this.itemView = function () { return options.itemView; };
    this.selector = options.selector || ('.' + this.collection.model.prototype.name + 's');
    this.model && this.listenTo(this.model, "change", this.render);
    this.collection && this.listenTo(this.collection, "add change remove", this.render);

    TrelloClone.View.prototype.initialize.call(this, options);
  },

  render: function() {
    TrelloClone.View.prototype.render.call(this);

    var ele = this.$el.find(this.selector);
    var list = this;
    var i = 0;
    this.collection.forEach(function(model) {
      var subview = new (list.itemView())({ tagName: 'li', model: model, ord: i });
      list.subviews().push(subview);
      ele.append(subview.render().$el);
      ++i;
    });
    this.delegateEvents();

    return this;
  },

  addItem: function(item) {
    if (!item.has('ord')) { item.set('ord', this.collection.length); }
    this.collection.add(item);
  },

  addNew: function(event) {
    event.preventDefault();

    var item = $(event.target).serializeJSON();
    item[this._model_name() + "_id"] = this.model.id;
    this.collection.create(item, {
      success: function(model, response, options) {
        delete this.errors;
      },
      error: function(model, response, options) {
        this.errors = response.responseText;
      }
    });
    return false;
  },

  clearAll: function(event) {
    this.collection.reset();
    this.render();
  },

  removeItem: function(event) {
    event.preventDefault();
    var item = this.collection.at($(event.target).parents('li').attr('data-ord'));
    this.collection.remove(item);
    item.destroy();
    return false;
  },

  updateItem: function(event) {
    event.preventDefault();

    var item = this.collection.at($(event.target).parents('li').attr('data-ord'));
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

  subviews: function() {
    return this._subviews || (this._subviews = []);
  },

  _item_name: function() {
    return this.collection.model.prototype.name;
  }

  _model_name: function() {
    return this.model.name;
  }
});