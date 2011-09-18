global.nachbar = {}

# config
nachbar.config = require('./utils/config')

# models
nachbar.User = require('./models/user')

# logic
nachbar.geocenter = require('./logic/geocenter')

# app
webapp = require('./logic/webserver')
sockapp = require('./logic/socketserver')

webapp.start()
sockapp.start(webapp)

