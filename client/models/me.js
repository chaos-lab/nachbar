nachbar.models = nachbar.models || {};

// model of me
nachbar.models.Me = Backbone.Model.extend({

  initialize: function() {
    // state
    this.set({state: 0}, {silent: true});

    //name
    this.set({name: ''}, {silent: true});

    //broadcast send & receive range, in meters. Assume ( send range == receive range ) for ease of use.
    this.set({range: 500}, {silent: true});
  }

  ,isLocated: function() {
    return this.has('location');
  }

  // update user state
  ,updateState: function(new_state) {
    var old_state = this.get('state');
    this.set({state: new_state});

    if (old_state == nachbar.models.Me.States.CONNECTED
     && new_state == nachbar.models.Me.States.ONLINE) {
      this.trigger("login");
    } else if (old_state == nachbar.models.Me.States.RECONNECTING
     && new_state == nachbar.models.Me.States.CONNECTED) {
      this.trigger("reconnect");
    }
  }

  // update location
  ,updateLocation: function(lat, lng) {
    this.set({'location': {latitude: lat, longitude: lng}});
  }

  //get google location object
  ,gLocation: function() {
    return new google.maps.LatLng(this.get('location').latitude, this.get('location').longitude);
  }

  //broadcast method. strategy pattern
  ,broadcast: null

  //chat with someboy
  ,chat: null

  //login
  ,login: null

  //logout
  ,logout: null

}, {//class properties
  States: {
    DISCONNECTED : 0
   ,CONNECTED    : 1
   ,RECONNECTING : 2
   ,ONLINE       : 3
  }
})
