var nachbar = nachbar || {};

_.extend(nachbar, Backbone.Events);

// socket.io specific code
nachbar.socket = io.connect();
nachbar.view = nachbar.view || {};

nachbar.me = new nachbar.Profile;
nachbar.nearbys = new nachbar.UserCollection;

// ap marker
nachbar.me.bind("change:location", function() {
  if (!nachbar.me.marker) {
    var marker = new google.maps.Marker({
      position: nachbar.me.gLocation(),
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: nachbar.map,
      title: "It's you!"
    });

    var infowindow = new google.maps.InfoWindow({
      content: "It's you! Drag to move your location."
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(nachbar.map, marker);
    })

    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    })

    google.maps.event.addListener(marker, 'dragend', function() {
      var cur_pos = marker.getPosition();
      nachbar.me.updateLocation(cur_pos.lat(), cur_pos.lng());
    });

    nachbar.me.marker = marker;
    nachbar.me.window = infowindow;

  } else {
    nachbar.me.marker.setPosition(nachbar.me.gLocation());
  }
});

// notify server when location changes
nachbar.me.bind("change:location", function() {
  if (nachbar.me.state == nachbar.Profile.States.ONLINE) {
    nachbar.socket.emit("update position", nachbar.me.location.latitude, nachbar.me.location.longitude)
  }
  nachbar.updateNearbys();
});

// update nearbys from server
nachbar.updateNearbys = function() {
  nachbar.socket.emit("get nearbys", nachbar.me.location.latitude, nachbar.me.location.longitude, function(collection) {
    _.each(collection, function(item) {
      nachbar.updateUser(item);
    })
  })
}

nachbar.updateUser = function(info) {
  if (info._id == nachbar.me.id) return;

  // if the user already added, only update info
  user = nachbar.nearbys.get(info._id);
  if (user) {
     user.updateLocation(info.location.latitude, info.location.longitude);
     return;
  }
  
  // create model for new user
  user = new nachbar.User;
  user.id = info._id;
  user.state = nachbar.User.States.ONLINE;
  user.name = info.name;
  user.location.latitude = info.location.latitude;
  user.location.longitude = info.location.longitude;
  nachbar.nearbys.add(user);

  // add marker for new user
  var marker = new google.maps.Marker({
    position: user.gLocation(),
    draggable: false,
    animation: google.maps.Animation.DROP,
    map: nachbar.map,
    title: user.name,
    icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png"
  });

  var infowindow = new google.maps.InfoWindow({
    content: "<strong>" + user.name + "</strong>"
  });

  google.maps.event.addListener(marker, 'mouseover', function() {
    infowindow.open(nachbar.map, marker);
  })

  google.maps.event.addListener(marker, 'mouseout', function() {
    infowindow.close();
  })

  user.marker = marker;
  user.window = infowindow;

  user.bind("change:location", function() {
    user.marker.setPosition(user.gLocation());
  })

  user.bind("offline", function() {
    user.marker.setVisible(false);
    nachbar.nearbys.remove(user);
  })
}

// state change
nachbar.me.bind("login", function() {
  nachbar.socket.emit("update position", nachbar.me.location.latitude, nachbar.me.location.longitude)
  nachbar.updateNearbys();
});

nachbar.socket.on('connect', function () {
  nachbar.me.updateState(nachbar.Profile.States.CONNECTED);

  if (nachbar.me.isLocated()) nachbar.updateNearbys();

  //following code should be moved elsewhere
  nachbar.view.message('System', 'You have been connected to server.');
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
  var u = nachbar.nearbys.get(from);
  if (u) u.broadcast(msg);
})

nachbar.socket.on('user relocated', function(user) {
  nachbar.updateUser(user); 
})

nachbar.socket.on('user offline', function(user) {
  var u = nachbar.nearbys.get(user._id);
  if (u) u.updateState(nachbar.User.States.OFFLINE);

  nachbar.view.message("", "<em>" + u.name + " offline.</em>");
})

