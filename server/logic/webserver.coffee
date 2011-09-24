express = require('express')
stylus = require('stylus')

#create express
module.exports = app = express.createServer()

#configurations
app.configure ->
  app.use stylus.middleware
     src: __dirname + '/../views'
     dest: __dirname + '/../../public'
     compile: (str, path) ->  stylus(str).set('filename', path)

  app.use(express.static(__dirname + '/../../public'))
  app.use(express.static(__dirname + '/../../client'))

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
  app.listen nachbar.config.webserver.port, ->
    addr = app.address()
    console.log('app listening on http://' + addr.address + ':' + addr.port)

