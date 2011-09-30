nachbar.views = nachbar.views || {};

nachbar.views.MapView = Backbone.View.extend({
  id: "map-area"

  ,tagName: "div"

  ,className: "span-24"

  ,events: {
  }

  ,initialize: function() {
    this.defaultCenter = new google.maps.LatLng(32.060255, 118.796877);
    this.render();
    this.map = this.createMap();
    this.getLocation();
  }

  //render message box using template
  ,render: function() {
    $("#map-container").append(this.el);
  }

  //create map
  ,createMap: function() {
    var myOptions = {
      zoom: 2,
      center: this.defaultCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    return new google.maps.Map($("#map-area").get(0),  myOptions);
  }

  //get location
  ,getLocation: function() {
    // Try W3C Geolocation (Preferred)
    var self = this;
    if(navigator.geolocation) {
      var browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        self.map.setCenter(pos);
        self.map.setZoom(13);

        nachbar.me.updateLocation(position.coords.latitude, position.coords.longitude);
      }, function() {
        self.handleNoGeolocation(browserSupportFlag);
      });
    // Try Google Gears Geolocation
    } else if (google.gears) {
      var browserSupportFlag = true;
      var geo = google.gears.factory.create('beta.geolocation');
      geo.getCurrentPosition(function(position) {
        var initialLocation = new google.maps.LatLng(position.latitude, position.longitude);
        self.map.setCenter(initialLocation);
        self.map.setZoom(13);

        nachbar.me.updateLocation(position.coords.latitude, position.coords.longitude);
      }, function() {
        self.handleNoGeoLocation(browserSupportFlag);
      });
    // Browser doesn't support Geolocation
    } else {
      var browserSupportFlag = false;
      self.handleNoGeolocation(browserSupportFlag);
    }
  }

  ,handleNoGeolocation: function(errorFlag) {
    if (errorFlag == true) {
      nachbar.views.showTip("Geolocation service failed. You can move your icon to set your location. ");
    } else {
      nachbar.views.showTip("Your browser doesn't support geolocation. Please move your icon to set your location. ");
    }

    this.map.setZoom(2);
    var self = this;
    nachbar.me.updateLocation(self.defaultCenter.lat(), self.defaultCenter.lng());
  }

})

