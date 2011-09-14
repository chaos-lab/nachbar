sio = require('socket.io')

#db settings
mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nachbar')

#models
User = require('../models/user')

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

    socket.on 'get nearbys', (latitude, longtitude, fn) ->
      # send a list of users to client
      nachbar.geocenter.getNearbys latitude, longtitude, (data) ->
        fn(data)

    # set position
    socket.on 'update position', (latitude, longtitude) ->
      return if !socket.user
      socket.user.updateLocation(parseFloat(latitude), parseFloat(longtitude))

    # set nickname event
    socket.on 'nickname', (nick, fn) ->
      # name already used
      if User.collections[nick]
         fn(true)
         return

      fn(false)
      User.add(nick, socket)

      socket.broadcast.emit('announcement', nick + ' connected')
      io.sockets.emit('nicknames', User.names())

    # disconnect event
    socket.on 'disconnect', ->
      return if !socket.user

      # delete user from data store
      delete User.collections[socket.user.name]

      socket.broadcast.emit('announcement', socket.user.name + ' disconnected')
      io.sockets.emit('nicknames', User.names())

