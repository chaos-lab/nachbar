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
    this.createPair("broadcast");
    this.createPair("test 1");
    this.createPair("test 2");

    this.messageBoxMap["broadcast"].bind("sendmessage", function(msg) { nachbar.me.broadcast(msg); });
    this.navigationView.select("broadcast");

  }

  ,createPair: function(key) {
    this.messageBoxMap[key] = new nachbar.views.MessageBoxView;
    this.messageBoxMap[key].key = key;
    this.navigationView.add(key)
  }

  ,broadcast: function(from, msg) {
    this.messageBoxMap["broadcast"].add(from, msg);
  }

  ,selectedChanged: function(e) {
    var selected = this.navigationView.selected;
    _.each(this.messageBoxMap, function(val, key) {
      if (val.key == selected) {
        val.show();
      } else {
        val.hide();
      }
    })
  }
})

