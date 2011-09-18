sio = require('socket.io')

#db settings
mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nachbar')

module.exports = socketServer = {}

socketServer.start = (app) ->
  # Socket.IO server
  io = sio.listen(app)

  io.sockets.on 'connection', (socket) ->
    # send message event
    socket.on 'user message', (msg) ->
      # only user with a nickname can speak
      socket.close if !socket.user
      socket.broadcast.emit('user message', socket.user.name, msg)

    socket.on 'get nearbys', (latitude, longitude, fn) ->
      console.log("lat:#{latitude}, long:#{longitude}")
      # send a list of users to client
      nachbar.geocenter.getNearbys latitude, longitude, (data) ->
        fn(data)

    # set position
    socket.on 'update position', (latitude, longitude) ->
      return if !socket.user
      socket.user.updateLocation(latitude, longitude)
      socket.broadcast.emit('user relocated', socket.user)

    # set nickname event
    socket.on 'nickname', (nick, fn) ->
      user = nachbar.User.add(nick, socket)
      fn(user._id)

    # disconnect event
    socket.on 'disconnect', ->
      return if !socket.user

      #socket.user.online = 0
      #socket.user.save()
      socket.user.remove()

      socket.broadcast.emit('user offline', socket.user)

