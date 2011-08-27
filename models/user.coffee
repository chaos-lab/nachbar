mongoose = require('mongoose')
Schema = mongoose.Schema

UserSchema = new Schema({
  name        : { type: String, required: true, index: true },
  sex         : Number,
  signature   : String,
  birthday    : Date
})

User = mongoose.model('User', UserSchema)
exports = module.exports = User

# user's connection channel
User::socket = null

# stores (user name, user) pair
User.collections = {}

# add a user, store it in DB & memory
User.add = (name, socket) ->
  user = new User()
  user.name =  name
  user.socket = socket
  socket.user = user
  # currently just save data in memory
  # user.save()
  User.collections[name] = user

# update user profile, except name
User.update = (data) ->


# return an array of user names
User.names = ->
  nicknames = []
  nicknames.unshift name for name, user of User.collections
  return nicknames

console.log "user.coffeescript required"

# User realtime information
#
# User  <---->  EndPoints
#
# Socket
#  socket --> many? 
#  socket   <>    url(html content MD5 hash & url)   <>   user 
#  
#  same address: 
#    (1) same url, slightly or completely different content; 
#       a) slightly different : with log status header; with different advertisement;
#       b) completely different: personal profile with the same url
#
#    (2) different url, same content;
#       a) A page has more than one address
#
#  only support: (1) same url -> most contents of the url are the same; (2) one page can have different address. Use <head> MD5 to judge sameness.
#
# Status
#   - online
#   - offline
#   - hotline
#



