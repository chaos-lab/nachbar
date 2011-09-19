var nachbar = nachbar || {};

nachbar.User = Backbone.Model.extend({
  /*
   *  state definition:
   *    0 : offline
   *    1 : online
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

    if (old_state == nachbar.User.States.OFFLINE
     && new_state == nachbar.Profile.States.ONLINE) {
      this.trigger("online");
    } else if (old_state == nachbar.User.States.ONLINE
     && new_state == nachbar.User.States.OFFLINE) {
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

  //broadcast
  ,broadcast: function(msg) {
    nachbar.view.message(this.name, msg);

    var dt = new Date;
    this.window.content =  "<strong>" + this.name + "</strong>    " + dt.toLocaleTimeString() + "<br/>" + msg;
    this.window.open(nachbar.map, this.marker);
    var window = this.window;
    setTimeout(function(){ window.close();}, 2000);
  }


}, {//class properties
  States: {
    OFFLINE  : 0
   ,ONLINE   : 1
  }
})

nachbar.UserCollection = Backbone.Collection.extend({
  model: nachbar.User
})
