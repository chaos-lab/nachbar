global.nachbar = {}

nachbar.config = require('./utils/config')
nachbar.webapp = require('./logic/webserver')
nachbar.sockapp = require('./logic/socketserver')

nachbar.webapp.start()
nachbar.sockapp.start(nachbar.webapp)

