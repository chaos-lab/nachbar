nachbar.controllers = nachbar.controllers || {};

//socket defines interface to remote server. Seperate interface into a stand-alone module is reasonable.
nachbar.controllers.SocketController = Backbone.Model.extend({

  initialize: function() {

    nachbar.socket.on('connect', function () {
      nachbar.me.updateState(nachbar.models.Me.States.CONNECTED);

      if (nachbar.me.isLocated()) nachbar.nearbys.update();

      nachbar.views.showTip('You have been connected to server.', "success");
    });

    nachbar.socket.on('reconnecting', function () {
      nachbar.me.updateState(nachbar.models.Me.States.RECONNECTING);
      nachbar.views.showTip('Attempting to re-connect to the server');
    });

    nachbar.socket.on('error', function (e) {
      nachbar.views.showTip(e ? e : 'A unknown error occurred', "error");
    });

    nachbar.socket.on('user message', function(from, msg) {
      var u = nachbar.nearbys.get(from);
      if (u) u.broadcast(msg);
    })

    nachbar.socket.on('user relocated', function(user) {
      nachbar.nearbys.updateUser(user);
    })

    nachbar.socket.on('user offline', function(user) {
      var u = nachbar.nearbys.get(user._id);
      if (u) u.updateState(nachbar.models.User.States.OFFLINE);

      nachbar.views.showTip("<em>" + user.name + " offline.</em>");
    })
  }

})

