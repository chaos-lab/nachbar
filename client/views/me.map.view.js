nachbar.views = nachbar.views || {};

nachbar.views.MeMapView = Backbone.View.extend({
  //marker on map
  marker: null

  //window
  ,infoWindow: null

  //map
  ,map: null

  //bind model events
  ,initialize: function() {
    this.map = this.options.map;

    this.model.bind("change:location", this.locationChangedHandler, this);
    this.model.bind("offline", function() { this.marker.setVisible(false); }, this);

    // create marker if it's already located
    if (this.model.isLocated) this.locationChangedHandler();
  }

  //locate changed
  ,locationChangedHandler: function() {
    // only create marker if me is positioned
    if (!this.marker) {
      this.marker = this.createMarker();
      this.circle = this.createCircle(this.marker);
      this.infoWindow = this.createInfoWindow();

      var self = this;
      google.maps.event.addListener(this.marker, 'mouseover', function() {
        self.infoWindow.open(self.map, self.marker);
      })
  
      google.maps.event.addListener(this.marker, 'mouseout', function() {
        self.infoWindow.close();
      }) 
  
      google.maps.event.addListener(this.marker, 'dragend', function() {
        var cur_pos = self.marker.getPosition();
        self.model.updateLocation(cur_pos.lat(), cur_pos.lng());
      });
    } else {
        this.render();
    }
  }

  //render user on map
  ,render: function() {
    this.marker.setPosition(this.model.gLocation());
  }

  //create marker
  ,createMarker: function() {
    return new google.maps.Marker({
      position: this.model.gLocation(),
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: this.map,
      title: "It's you!",
      icon: "/images/orange-dot.png"
    });
  }

  //create circle
  ,createCircle: function(marker) {
    var options = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      radius: 1000
    };

    circle = new google.maps.Circle(options);
    circle.bindTo('map', marker, 'map');
    circle.bindTo('center', marker, 'position');
  }

  //create info window
  ,createInfoWindow: function() {
    return new google.maps.InfoWindow({
      content: "It's you! Drag to move your location."
    });
  }

  //broadcast
  ,broadcast: function(msg) {
    var dt = new Date;
    this.infoWindow.content =  "<strong>" + this.model.name + "</strong>    " + dt.toLocaleTimeString() + "<br/>" + msg;
    this.infoWindow.open(this.map, this.marker);
    var window = this.infoWindow;
    setTimeout(function(){ window.close();}, 2000);
  }

})

