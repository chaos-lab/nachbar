var nachbar = nachbar || {};

// socket.io specific code
nachbar.socket = io.connect();
nachbar.view = nachbar.view || {};

nachbar.socket.on('connect', function () {
  nachbar.view.message('System', 'You have been connected to server.');
});

nachbar.socket.on('announcement', function (msg) {
  $('#lines').append($('<p>').append($('<em>').text(msg)));
  nachbar.view.message("", "<em>" + msg + "</em>");
});

nachbar.socket.on('nicknames', function (nicknames) {
  $('#nicknames').empty().append($('<span>Online: </span>'));
  for (var i = 0; i < nicknames.length; i++) {
    $('#nicknames').append($('<b>').text(nicknames[i]));
  }
});

nachbar.socket.on('reconnect', function () {
  $('#lines').html("");
  nachbar.view.message('System', 'Reconnected to the server');
});

nachbar.socket.on('reconnecting', function () {
  nachbar.view.message('System', 'Attempting to re-connect to the server');
});

nachbar.socket.on('error', function (e) {
  nachbar.view.message('System', e ? e : 'A unknown error occurred');
});

nachbar.socket.on('user message', function(from, msg) {
  nachbar.view.message(from, msg);
})

