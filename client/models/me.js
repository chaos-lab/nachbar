nachbar.models = nachbar.models || {};

// model of me
nachbar.models.Me = Backbone.Model.extend({
  // refer to nachbar.models.Me.States
  state : 0

  //name
  ,name : ""

  //location
  ,location: {
    latitude    :  10000
   ,longitude  :  10000
  }

  //broadcast send & receive range, in meters. Assume ( send range == receive range ) for ease of use.
  ,range: 1000

  ,isLocated: function() {
    return this.location.latitude < 360 && this.location.longitude < 360
  }

  // update user state
  ,updateState: function(new_state) {
    var old_state = this.state;
    this.state =  new_state;

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
    this.location.latitude = lat;
    this.location.longitude = lng;
    this.trigger("change:location");
  }

  //get google location object
  ,gLocation: function() {
    return new google.maps.LatLng(this.location.latitude, this.location.longitude);
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
