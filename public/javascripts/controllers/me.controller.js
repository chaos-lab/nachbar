nachbar.controllers = nachbar.controllers || {};

//backbone has no controllers. Extend Backbone.Model for ease of use
nachbar.controllers.MeController = Backbone.Model.extend({

  initialize: function() {
    nachbar.me.broadcast = this.broadcast;
    nachbar.me.login = this.login;

    nachbar.me.bind("change:location", function() {
      if (nachbar.me.state == nachbar.models.Me.States.ONLINE) {
        nachbar.socket.emit("update position", nachbar.me.location.latitude, nachbar.me.location.longitude);
      }
      nachbar.nearbys.update();
    });

    nachbar.me.bind("login", function() {
      nachbar.socket.emit("update position", nachbar.me.location.latitude, nachbar.me.location.longitude);
      nachbar.nearbys.update();
    });
  }

  // nachbar.me instance method, this --> nachbar.me
  ,broadcast: function(msg) {
    if (this.state == nachbar.models.Me.States.CONNECTED) {
      this.login(function() {
        if (nachbar.me.state == nachbar.models.Me.States.ONLINE) nachbar.me.broadcast(msg);
      })

      return false;
    }

    nachbar.broadcastMessageView.add('me', msg);
    nachbar.socket.emit('user message', msg);

    this.view.broadcast(msg);
  }

  // nachbar.me instance method, this --> nachbar.me
  ,login: function(callback) {
    $("#nickname").dialog({
      autoOpen: true,
      position: 'center',
      modal: true,
      close: function() {
        if(callback) callback();
      }   
    })
  }

})

