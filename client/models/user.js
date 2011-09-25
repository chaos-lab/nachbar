nachbar.models = nachbar.models || {};

// user model
nachbar.models.User = Backbone.Model.extend({
  /*
   *  state definition:
   *    0 : offline
   *    1 : online
   *
   * */
  state : 0

  //name
  ,name : ""

  //pending messages
  ,pendingMessages: []

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

    if (old_state == nachbar.models.User.States.OFFLINE
     && new_state == nachbar.models.User.States.ONLINE) {
      this.trigger("online");
    } else if (old_state == nachbar.models.User.States.ONLINE
     && new_state == nachbar.models.User.States.OFFLINE) {
      this.trigger("offline");
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

  //broadcast method. strategy pattern.
  ,broadcast: null

  //speak to me
  ,speak: null


}, {//class properties
  States: {
    OFFLINE  : 0
   ,ONLINE   : 1
  }
})

nachbar.models.UserCollection = Backbone.Collection.extend({
  model: nachbar.models.User
})

