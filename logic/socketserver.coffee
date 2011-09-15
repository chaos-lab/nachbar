sio = require('socket.io')

#db settings
mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nachbar')

#models
User = require('../models/user')
nachbar.User = User

#geocenter
nachbar.geocenter = require('./geocenter')

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

    # set nickname event
    socket.on 'nickname', (nick, fn) ->
      User.add(nick, socket)

      socket.broadcast.emit('announcement', nick + ' connected')
      User.names (names) ->
        io.sockets.emit('nicknames', names)

    # disconnect event
    socket.on 'disconnect', ->
      return if !socket.user

      #socket.user.online = 0
      #socket.user.save()
      socket.user.remove()

      socket.broadcast.emit('announcement', socket.user.name + ' disconnected')

      User.names (names) ->
        io.sockets.emit('nicknames', names)

