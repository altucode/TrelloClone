window.TrelloClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    jQuery.event.props.push('dataTransfer');
    jQuery.event.props.push('clientX');
    jQuery.event.props.push('clientY');
    new TrelloClone.Routers.Router();
    Backbone.history.start();
  }
};

TrelloClone.Collection = Backbone.Collection.extend({
  comparator: 'ord',
  initialize: function(models, options) {
    if (options) {
      options.owner && (this.owner = options.owner);
      options.model && (this.model = options.model);
      options.url && (this.url = options.url);
    }
    Backbone.Collection.prototype.initialize.call(this, models, options);
  },
  remove: function (models, options) {
    if (! (models instanceof Array)) { models = [models]; }
    var collection = this;
    models.forEach(function (model) {
      collection.forEach(function (item) {
        if (item.get('ord') > model.get('ord')) {
          item.set('ord', item.get('ord') - 1);
        }
      });
    });
    Backbone.Collection.prototype.remove.call(this, models, options);
  },
  create: function (attributes, options) {
    attributes.ord = this.length;
    Backbone.Collection.prototype.create.call(this, attributes, options);
  },
  add: function (models, options) {
    if (! (models instanceof Array)) { models = [models]; }
    var collection = this;
    models.forEach(function (model) {
      if (model.get('ord') === 'undefined') { model.set('ord', this.length); }
      if (collection.owner) {
        var prop = collection.owner.name + '_id';
        if (model.has(prop)) {
          model.set(prop, collection.owner.id);
        }
      }
    });
    Backbone.Collection.prototype.add.call(this, models, options);
  },
  insert: function (model, i) {
    console.log("INSERT AT", i);
    model.set('ord', i);
    for (var n = i; n < this.length;) {
      this.at(n).set('ord', ++n);
    }
    this.add(model);
    while (i < this.length) {
      this.at(i++).save();
    }
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
  initialize: function (options) {
    options || (options = {});
    options.tagName && (this.tagName = options.tagName);
    options.template && (this.template = options.template);
    options.parent && (this.parent = options.parent);
    options.hasOwnProperty('index') && (this.index = options.index);
    this.model && this.listenTo(this.model, "change", this.render);
    Backbone.View.prototype.initialize.call(this, options);
  },
  render: function() {
    if (this.template) {
      var content = this.template({ model: this.model, ord: this.index });
      if (typeof this.index != "undefined") { this.$el.attr('data-ord', this.index); }
      this.$el.html(content);
    }
    return this;
  },
  containsMouse: function(event) {
    var rect = this.el.getBoundingClientRect();
    return  event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

  }
},{
  extend: function(properties, modules) {
    modules || (modules = []);
    var child = Backbone.View.extend.call(this, properties);
    modules.forEach(function(module) {
      for (var prop in module) {
        switch (prop) {
        case 'initialize':
          break;
        case 'events':
          child.prototype.events = _.extend({}, module.events, child.prototype.events);
          break;
        default:
          child.prototype[prop] || (child.prototype[prop] = module[prop]);
        }
      }
    });
    var init = child.prototype.initialize;
    child.prototype.initialize = function(options) {
      var obj = this;
      init.call(this, options);
      for (var i = 0; i < modules.length; ++i)
        if (modules[i].initialize)
          modules[i].initialize.call(obj, options);
    };
    if (this.prototype.className && view.prototype.className != this.prototype.className) {
      var base = this.prototype;
      child.prototype.className = function() {
        return _.result(base, 'className') + ' ' + _.result(properties, 'className');
      };
    }

    child.prototype.events = _.extend({}, this.prototype.events, child.prototype.events);
    return child;
  }
});

TrelloClone.Views.ListView = TrelloClone.View.extend({
  itemView: function() { return TrelloClone.View; },
  events: {
    'submit form': 'addNew',
    'blur .input.free:not([type=checkbox])': 'updateItem',
    'click .input.free[type=checkbox]': 'updateItem',
    'click #clear': 'clearAll',
    'click .save': 'saveItem',
    'click .delete': 'removeItem'
  },
  initialize: function (options) {
    options.itemView && (this.itemView = function () { return options.itemView; });
    options.itemTemplate && (this.itemTemplate = options.itemTemplate);
    options.pushFront && (this.pushFront = options.pushFront);
    options.emptyOnRender && (this.emptyOnRender = options.emptyOnRender);
    this.selector = options.selector || ('.' + this.collection.model.prototype.name + 's');
    this.collection && this.listenTo(this.collection, "add change remove", this.render);

    TrelloClone.View.prototype.initialize.call(this, options);
  },

  render: function() {
    TrelloClone.View.prototype.render.call(this);

    var ele = this.$el.find(this.selector);
    if (this.emptyOnRender) {
      ele.empty();
    }
    var adder = this.pushFront ? ele.prepend : ele.append;
    var list = this;
    var i = 0;
    this.collection.forEach(function(model) {
      var subview = new (list.itemView())({
        template: list.itemTemplate,
        tagName: 'li',
        model: model,
        index: i,
        parent: list
      });
      list.subviews().push(subview);
      adder.call(ele, subview.render().$el);
      ++i;
    });
    this.delegateEvents();

    return this;
  },

  addItem: function(item, i) {
    i || (i = this.collection.length);
    item.set('ord', i)
    this.collection.add(item);
  },

  addNew: function(event) {
    console.log(this);
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
    return false
  },

  clearAll: function(event) {
    this.collection.reset();
    this.render();
  },

  removeItem: function(event) {
    event.stopPropagation();
    var item = this.collection.at($(event.target).parents('li').attr('data-ord'));
    this.collection.remove(item);
    item.destroy();
    return false;
  },

  saveItem: function(event) {
    event.stopPropagation();
    var item = this.collection.at($(event.target).parents('li').attr('data-ord'));
    var siblings = $(event.target).siblings('.input:not([type=hidden])');
    var hash = {};
    siblings.each(function(i, e) {
      hash[e.name] = e.type == 'checkbox' ? e.checked : e.value;
    });
    item.set(hash);
    item.save();
  },

  updateItem: function(event) {
    event.stopPropagation();
    var item = this.collection.at($(event.target).parents('li').attr('data-ord'));
    var hash = {};
    hash[event.target.name] = event.target.type == 'checkbox' ? event.target.checked : event.target.value;
    item.set(hash);
    item.save();
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
  },

  _model_name: function() {
    return this.model.name;
  }
});

var Draggable = {
  events: {
    'dragstart': 'dragStart',
  },
  initialize: function(options) {
    this.$el.attr('draggable', true);
  },
  dragStart: function(event) {
    var props = this.dragProps();
    event.dataTransfer.effectAllowed = 'move';
    for (var i = 0; i < props.length; ++i) {
      event.dataTransfer.setData(this.model.name + '/' + props[i], this.model.get(props[i]));
    }
  },
  dragProps: function() {
    return [];
  }
};

var Droppable = {
  events: {
    'dragover': 'dragOver',
    'dragenter': 'toggleDragOver',
    'dragleave': 'toggleDragOver',
    'drop': '_drop'
  },
  dragOver: function(event) {
    return !this.isDropTarget(event);
  },
  toggleDragOver: function (event) {
    if (this.isDropTarget(event)) {
      this.$el.toggleClass('dragover');
      return false;
    }
  },
  isDropTarget: function (event) {
    return (event.dataTransfer.types.indexOf(this.collection.name + '/id') >= 0) ||
            (event.dataTransfer.types.indexOf(this.model.name + '/id') >= 0);
  },
  _drop: function(event) {
    this.$el.removeClass('dragover');
    return this.drop(event);
  }
};

var Sortable = {

};