var nachbar = nachbar || {};

_.extend(nachbar, Backbone.Events);

// socket.io specific code
nachbar.socket = io.connect();
nachbar.view = nachbar.view || {};

nachbar.me = new nachbar.Profile;

// update map marker
nachbar.me.bind("change:location", function() {
  if (!nachbar.me.marker) {
    var marker = new google.maps.Marker({
      position: nachbar.me.gLocation(),
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: nachbar.map,
      title: "It's you!"
    });
    nachbar.me.marker = marker;

    var infowindow = new google.maps.InfoWindow({
      content: "It's you! Drag to move your location."
    });
    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(nachbar.map, marker);
    })
    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    })
  } else {
    nachbar.me.marker.setPosition(nachbar.me.gLocation());
  }
});

// notify server when location changes
nachbar.me.bind("change:location", function() {
  if (nachbar.me.state == nachbar.Profile.States.ONLINE) {
    nachbar.socket.emit("update position", nachbar.me.location.latitude, nachbar.me.location.longitude)
  }
  else if (nachbar.me.state == nachbar.Profile.States.CONNECTED) {
    nachbar.socket.emit("get nearbys", nachbar.me.location.latitude, nachbar.me.location.longitude, function(data) {
      for (var i = 0; i < data.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data[i].location.latitude, data[i].location.longitude),
          draggable: false,
          animation: google.maps.Animation.DROP,
          map: nachbar.map,
          title: data[i].name
        });
      }
    })
  }
});

// state change
nachbar.me.bind("login", function() {
  nachbar.socket.emit("update position", nachbar.me.location.latitude, nachbar.me.location.longitude)
  nachbar.socket.emit("get nearbys", nachbar.me.location.latitude, nachbar.me.location.longitude, function(data) {
    for (var i = 0; i < data.length; i++) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data[i].location.latitude, data[i].location.longitude),
        draggable: false,
        animation: google.maps.Animation.DROP,
        map: nachbar.map,
        title: data[i].name
      }); 
    }
  })
});

nachbar.socket.on('connect', function () {
  nachbar.me.updateState(nachbar.Profile.States.CONNECTED);

  if (nachbar.me.isLocated()) {
    nachbar.socket.emit("get nearbys", nachbar.me.location.latitude, nachbar.me.location.longitude, function(data) {
      for (var i = 0; i < data.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data[i].location.latitude, data[i].location.longitude),
          draggable: false,
          animation: google.maps.Animation.DROP,
          map: nachbar.map,
          title: data[i].name
        }); 
      }
    })
  }

  //following code should be moved elsewhere
  nachbar.view.message('System', 'You have been connected to server.');
});

nachbar.socket.on('announcement', function (msg) {
  nachbar.view.message("", "<em>" + msg + "</em>");
});

nachbar.socket.on('nicknames', function (nicknames) {
  $('#nicknames').empty().append($('<span>Online: </span>'));
  for (var i = 0; i < nicknames.length; i++) {
    $('#nicknames').append($('<b>').text(nicknames[i]));
  }
});

nachbar.socket.on('reconnecting', function () {
  nachbar.me.updateState(nachbar.Profile.States.RECONNECTING);
  nachbar.view.message('System', 'Attempting to re-connect to the server');
});

nachbar.socket.on('error', function (e) {
  nachbar.view.message('System', e ? e : 'A unknown error occurred');
});

nachbar.socket.on('user message', function(from, msg) {
  nachbar.view.message(from, msg);
})

