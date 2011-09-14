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
    latitude    :  0
   ,longtitude  :  0
  }

  // update user state
  ,updateState: function(val) {
    this.set({state: val})
  }

  // update location
  ,updateLocation: function(lat, lng) {
    this.location.latitude = lat;
    this.location.longtitude = lng;
    this.trigger("change:location");
  }

  //get google location object
  ,gLocation: function() {
    return new google.maps.LatLng(this.location.latitude, this.location.longtitude);
  }

}, {//class properties
  States: {
    DISCONNECTED : 0
   ,CONNECTED    : 1
   ,LOGGED       : 2
  }
})
