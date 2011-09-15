var nachbar = nachbar || {};

nachbar.Profile = Backbone.Model.extend({
  /*
   *  state definition:
   *    0 : not connected
   *    1 : connected
   *    2 : logged in
   *
   * */
  state : 0

  //name
  ,name : ""

  //location
  ,location: {
    latitude    :  10000
   ,longitude  :  10000
  }

  ,isLocated: function() {
    return this.location.latitude < 360 && this.location.longitude < 360
  }

  // update user state
  ,updateState: function(new_state) {
    var old_state = this.state;
    this.state =  new_state;

    if (old_state == nachbar.Profile.States.CONNECTED
     && new_state == nachbar.Profile.States.ONLINE) {
      this.trigger("login");
    } else if (old_state == nachbar.Profile.States.RECONNECTING
     && new_state == nachbar.Profile.States.CONNECTED) {
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

}, {//class properties
  States: {
    DISCONNECTED : 0
   ,CONNECTED    : 1
   ,RECONNECTING : 2
   ,ONLINE       : 3
  }
})
