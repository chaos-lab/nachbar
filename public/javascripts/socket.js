// socket.io specific code
var socket = io.connect();

socket.on('connect', function () {
});

socket.on('announcement', function (msg) {
  $('#lines').append($('<p>').append($('<em>').text(msg)));
});

socket.on('nicknames', function (nicknames) {
  $('#nicknames').empty().append($('<span>Online: </span>'));
  for (var i = 0; i < nicknames.length; i++) {
    $('#nicknames').append($('<b>').text(nicknames[i]));
  }
});

socket.on('reconnect', function () {
  $('#lines').remove();
  message('System', 'Reconnected to the server');
});

socket.on('reconnecting', function () {
  message('System', 'Attempting to re-connect to the server');
});

socket.on('error', function (e) {
  message('System', e ? e : 'A unknown error occurred');
});

socket.on('user message', message);
function message (from, msg) {
  dt = new Date;
  msg = msg.replace(/\\n/g, "<br/>");
  $('#lines').append($('<p>').append(dt.toLocaleTimeString(), $('<b>').text(from), msg));
}

