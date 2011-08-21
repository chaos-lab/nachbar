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
    socket.on 'user message', (msg) ->
      socket.broadcast.emit('user message', socket.nickname, msg)
  
    socket.on 'nickname', (nick, fn) ->
      console.log 'nickname function'
      User.findOne {name:nick}, (err, doc) ->
        if doc
          fn(true)
        else
          fn(false)

          user = new User()
          user.name =  socket.nickname = nick
          user.socket = socket
          user.save()

          socket.broadcast.emit('announcement', nick + ' connected')
          User.find {}, (err, docs) ->
            nicknames = []
            nicknames.unshift  doc.name for doc in docs
            io.sockets.emit('nicknames', nicknames)
  
    socket.on 'disconnect', ->
      return if !socket.nickname
  
      User.findOne {name:socket.nickname}, (err, doc) ->
        doc.remove() if doc

      socket.broadcast.emit('announcement', socket.nickname + ' disconnected')
      User.find {}, (err, docs) ->
        nicknames = []
        nicknames.unshift  doc.name for doc in docs
        io.sockets.emit('nicknames', nicknames)

