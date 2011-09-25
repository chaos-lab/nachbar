nachbar.views = nachbar.views || {};

nachbar.views.UserMapView = Backbone.View.extend({
  //marker on map
  marker: null

  //window
  ,infoWindow: null

  //map
  ,map: null

  //bind model events
  ,initialize: function() {
    this.map = this.options.map;

    this.marker = this.createMarker();
    this.infoWindow = this.createInfoWindow();

    var self = this;
    google.maps.event.addListener(this.marker, 'mouseover', function() {
      self.infoWindow.open(this.map, self.marker);
    })

    google.maps.event.addListener(this.marker, 'mouseout', function() {
      self.infoWindow.close();
    }) 

    google.maps.event.addListener(this.marker, 'dblclick', function() {
      self.trigger("dblclick");
    }) 

    this.model.bind("change:location", this.render, this);
    this.model.bind("offline", function() { this.marker.setVisible(false); }, this);
  }

  //render user on map
  ,render: function() {
    this.marker.setPosition(this.model.gLocation());
  }

  //bounce
  ,bounce: function() {
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
  }

  //stop bounce
  ,stopBounce: function() {
    this.marker.setAnimation(null);
  }

  //create marker
  ,createMarker: function() {
    return new google.maps.Marker({
      position: this.model.gLocation(),
      draggable: false,
      animation: google.maps.Animation.DROP,
      map: this.map,
      title: this.model.name,
      icon: "/images/blue-dot.png"
    });
  }

  //create info window
  ,createInfoWindow: function() {
    return new google.maps.InfoWindow({
      content: "<strong>" + this.model.name + "</strong>"
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

