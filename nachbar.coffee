webapp = require('./logic/webserver')
sockapp = require('./logic/socketserver')

webapp.start()
sockapp.start(webapp)

