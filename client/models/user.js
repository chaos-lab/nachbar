nachbar.models = nachbar.models || {};

// user model
nachbar.models.User = Backbone.Model.extend({
  initialize: function() {
  }

  ,isLocated: function() {
    return this.has('location');
  }

  // update user state
  ,updateState: function(new_state) {
    var old_state = this.get('state');
    this.set({state:  new_state});

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
    this.set({'location': {latitude: lat, longitude: lng}});
  }

  //get google location object
  ,gLocation: function() {
    return new google.maps.LatLng(this.get('location').latitude, this.get('location').longitude);
  }

  //broadcast method. strategy pattern.
  ,broadcast: null

  //chat with me
  ,chat: null


}, {//class properties
  States: {
    OFFLINE  : 0
   ,ONLINE   : 1
  }
})

nachbar.models.UserCollection = Backbone.Collection.extend({
  model: nachbar.models.User
})

