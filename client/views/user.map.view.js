nachbar.views = nachbar.views || {};

nachbar.views.UserMapView = Backbone.View.extend({

  //bind model events
  initialize: function() {
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

    google.maps.event.addListener(this.marker, 'click', function() {
      self.trigger("click");
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
      title: this.model.get('name'),
      icon: "/images/blue-dot.png"
    });
  }

  //create info window
  ,createInfoWindow: function() {
    return new google.maps.InfoWindow({
      content: "<strong>" + this.model.get('name') + "</strong>"
    });
  }

  //broadcast
  ,broadcast: function(msg) {
    var dt = new Date;
    this.infoWindow.content =  "<strong>" + this.model.get('name') + "</strong>    " + dt.toLocaleTimeString() + "<br/>" + msg;
    this.infoWindow.open(this.map, this.marker);
    var window = this.infoWindow;
    setTimeout(function(){ window.close();}, 2000);
  }

  //get offset
  ,offset: function() {
    // Calculate marker position in pixels form upper left corner
    var scale = Math.pow(2, this.map.getZoom());
    var pixelCoordsCenter = this.map.getProjection().fromLatLngToPoint(this.map.getCenter());
    return {
      x_offset: Math.floor((pixelCoordsMarker.x - pixelCoordsCenter.x) * scale + $(this.map.getDiv()).width()/2),
      y_offset: Math.floor((pixelCoordsMarker.y - pixelCoordsCenter.y) * scale + $(this.map.getDiv()).height()/2)
    }
  }
})

