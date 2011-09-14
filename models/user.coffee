mongoose = require('mongoose')
Schema = mongoose.Schema

UserSchema = new Schema({
  name        : { type: String, required: true, index: true },
  sex         : Number,
  signature   : String,
  birthday    : Date,
  vision      : { type: Number, default: nachbar.config.user.default_vision },
  hearing     : { type: Number, default: nachbar.config.user.default_vision },
  location    : {
    latitude    : {type: Number},
    longitude   : {type: Number}
  }
})

UserSchema.index({location : "2d"})

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
  user.save()
  User.collections[name] = user

# update user profile, except name
User::updateLocation = (lat, long) ->
  @location.latitude = lat
  @location.longtitude = long
  this.save()


# return an array of user names
User.names = ->
  nicknames = []
  nicknames.unshift name for name, user of User.collections
  return nicknames

