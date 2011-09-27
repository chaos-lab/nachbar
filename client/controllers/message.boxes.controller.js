nachbar.controllers = nachbar.controllers || {};

nachbar.controllers.MessageBoxesController = Backbone.Model.extend({

  initialize: function() {
    // initialize map
    this.chatBoxMap = {};

    // create broadcast message box
    this.broadcastBox = new nachbar.views.MessageBoxView;
    this.broadcastBox.bind("sendmessage", function(msg) { nachbar.me.broadcast(msg); })
    this.broadcastBox.show();
  }

  // whether a chat box exist
  , existsChatBox: function(key) {
    return this.chatBoxMap[key];
  }

  // create chat box
  ,createChatBox: function(key, name, messageHandler) {
    this.chatBoxMap[key] = new nachbar.views.ChatBoxView({key: key, name: name});
    if (messageHandler) this.chatBoxMap[key].bind("sendmessage", messageHandler);
    return this.chatBoxMap[key];
  }

  // get chat box
  ,chatBox: function(key) {
    return this.chatBoxMap[key];
  }

  ,broadcast: function(from, msg, dt) {
    this.broadcastBox.add(from.name, msg, dt);
  }

})

