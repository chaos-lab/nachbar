nachbar.controllers = nachbar.controllers || {};

//backbone has no controllers. Extend Backbone.Model for ease of use
nachbar.controllers.NearbysController = Backbone.Model.extend({
  initialize: function() {
    //update is a public interface specific to instance nachbar.nearbys.
    nachbar.nearbys.update = this.updateNearbys;

    //following methods are not intended for public use
    nachbar.nearbys.updateUser = this.updateUser;
    nachbar.nearbys.createUser = this.createUser;
  }

  //update nearbys, this --> nachbar.nearbys
  ,updateNearbys: function() {
    var self = this;
    nachbar.socket.emit("get nearbys", nachbar.me.location.latitude, nachbar.me.location.longitude, function(collection) {
      _.each(collection, function(item) {
        self.updateUser(item);
      })
    })
  }

  //utility function, update user info. this --> nachbar.nearbys
  ,updateUser: function(info) {
    if (info._id == nachbar.me.id) return;

    // if the user already added, only update info
    var user = nachbar.nearbys.get(info._id);
    if (user) {
      user.updateLocation(info.location.latitude, info.location.longitude);
    } else {
      // create new user
      user = nachbar.nearbys.createUser(info);
      nachbar.nearbys.add(user);

      // create user view
      user.view = new nachbar.views.UserMapView( { model: user, map: nachbar.map });

      // listen to view events
      user.view.bind("dblclick", function() {
        // this --> user
        var talker = this;
        if (nachbar.messageBoxManager.existsChatBox(talker.id)) {
          nachbar.messageBoxManager.chatBox(talker.id).show();
        } else {
          // create message box
          var name = "talk with " + talker.name;
          var box = nachbar.messageBoxManager.createChatBox(talker.id, name, function(msg) { nachbar.me.chat(talker, msg); });
          box.show();

          // write pending messages
          _.each(talker.pendingMessages, function(item) {
            box.add(talker.name, item.message, item.time);
          })
          talker.pendingMessages = [];

        }
        // stop marker bounce on map if it's bouncing
        talker.view.stopBounce();

      }, user)

      //set broadcast. strategy pattern
      user.broadcast = function(msg) {
        nachbar.messageBoxManager.broadcast(this, msg);
        this.view.broadcast(msg);
      }

      // user speaks to me, this --> user
      user.chat = function(msg) {
        // if the message box is already open, add to box
        var box = nachbar.messageBoxManager.chatBox(this.id);
        if (box) {
          box.add(this.name, msg);
        } else {
          this.pendingMessages.unshift({message: msg, time: new Date});
        }

        // alert user of message arrival
        if (!box) this.view.bounce();
        else if (box.isMinimized()) box.highlight();
      }

      user.bind("offline", function() {
        nachbar.nearbys.remove(user);
      })
    }
  }

  // create user from json
  ,createUser: function(info) {
    var user = new nachbar.models.User;
    user.id = info._id;
    user.state = nachbar.models.User.States.ONLINE;
    user.name = info.name;
    user.location.latitude = info.location.latitude;
    user.location.longitude = info.location.longitude;

    return user;
  }

})

