global.nachbar = {}

# models
nachbar.User = require('./models/user')

# geocenter
nachbar.geocenter = require('./geocenter')

# config
nachbar.config = require('./utils/config')

# app
webapp = require('./logic/webserver')
sockapp = require('./logic/socketserver')

webapp.start()
sockapp.start(webapp)

