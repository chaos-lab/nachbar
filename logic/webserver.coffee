express = require('express')
stylus = require('stylus')
config = require('../utils/config')

#create express
module.exports = app = express.createServer()

#configurations
app.configure ->
  app.use stylus.middleware
     src: __dirname + '/../views/styles'
     dest: __dirname + '/../public/stylesheets'
     compile: (str, path) ->
       stylus(str).set('filename', path)

  app.use express.compiler
    src: __dirname + '/../views/scripts'
    dest: __dirname + '/../public/javascripts'
    enable: ['coffeescript']

  app.use(express.static(__dirname + '/../public'))

  app.set('views', __dirname + '/../views')
  app.set('view engine', 'jade')

#development
app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack : true

#production
app.configure 'production', ->
  app.use express.errorHandler()

#routes
app.get '/', (req, res) ->
  res.render('index')

app.start =  ->
  app.listen config.webserver.port, ->
    addr = app.address()
    console.log('app listening on http://' + addr.address + ':' + addr.port)

