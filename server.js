require('coffee-script')

global.nachbar = {}

// config
nachbar.config = require('./config')

// models
nachbar.User = require('./server/models/user')

// logic
nachbar.geocenter = require('./server/logic/geocenter')

// app
webapp = require('./server/logic/webserver')
sockapp = require('./server/logic/socketserver')

webapp.start()
sockapp.start(webapp)

