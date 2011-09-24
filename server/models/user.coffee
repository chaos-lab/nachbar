mongoose = require('mongoose')
Schema = mongoose.Schema

UserSchema = new Schema
  name        : { type: String, required: true, index: true }
  sex         : Number
  signature   : String
  birthday    : Date
  online      : { type: Number, default: 0 }
  vision      : { type: Number, default: 1 }
  hearing     : { type: Number, default: 1 }
  location    :
    longitude   : {type: Number}
    latitude    : {type: Number}

UserSchema.index({location : "2d"})

User = mongoose.model('User', UserSchema)
exports = module.exports = User

# user's connection channel
User::socket = null

# add a user, store it in DB & memory
User.add = (name) ->
  user = new User()
  user.name =  name
  user.online = 1
  user.save()
  return user

# update user location, except name
User::updateLocation = (lat, long) ->
  @location.latitude = lat
  @location.longitude = long
  this.save()


