express = require('express')
stylus = require('stylus')
nib = require('nib')
config = require('../utils/config')

#create express
module.exports = app = express.createServer()

app.configure ->
  compile = (str, path) ->
    return stylus(str).set('filename', path).use(nib())

  app.use(stylus.middleware({ src: __dirname + '/../public', compile: compile }))
  app.use(express.static(__dirname + '/../public'))
  app.set('views', __dirname + '/../views')
  app.set('view engine', 'jade')

#routes
app.get '/', (req, res) ->
  res.render('index', { layout: false })

app.start =  ->
  app.listen config.webserver.port, ->
    addr = app.address()
    console.log('app listening on http://' + addr.address + ':' + addr.port)

