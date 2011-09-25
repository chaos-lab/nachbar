nachbar.controllers = nachbar.controllers || {};

nachbar.controllers.MessageBoxesController = Backbone.Model.extend({

  initialize: function() {
    // initialize map
    this.messageBoxMap = {};

    // create navigation
    this.navigationView = new nachbar.views.NavigationView({ el: $("#navigation-area").get(0) });
    // bind select change event
    this.navigationView.bind("selectedChanged", this.selectedChanged, this);

    // create broadcast message box
    this.createBox("broadcast", "broadcast", function(msg) { nachbar.me.broadcast(msg); });

    this.select("broadcast");
  }

  // select
  , select: function(key) {
    this.navigationView.select(key);
  }

  // selected
  , selected: function() {
    return this.navigationView.selected;
  }

  // whether a message box exist
  , existsBox: function(key) {
    return this.messageBoxMap[key];
  }

  // for private use
  ,createBox: function(key, name, messageHandler) {
    this.messageBoxMap[key] = new nachbar.views.MessageBoxView;
    this.navigationView.add(key, name)

    if (messageHandler) this.messageBoxMap[key].bind("sendmessage", messageHandler);
  }

  ,removeBox: function(key) {
    if (!this.messageBoxMap[key]) return;

    // change selected box
    if (key == this.selected()) this.select("broadcast");

    this.messageBoxMap[key].remove();
    this.navigationView.remove(key);
  }

  ,speak: function(boxID, from, msg, dt) {
    if (!this.messageBoxMap[boxID]) return;

    this.messageBoxMap[boxID].add(from.name, msg, dt);

    if (this.selected() != boxID) this.navigationView.highlight(boxID);
  }

  ,selectedChanged: function(e) {
    var selected = this.navigationView.selected;
    _.each(this.messageBoxMap, function(val, key) {
      if (key == selected) {
        val.show();
      } else {
        val.hide();
      }
    })
  }
})

