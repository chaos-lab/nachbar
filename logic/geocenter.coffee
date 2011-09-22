module.exports = geocenter = {}

# (A, r(A)), (B, r(B))
#
# effective broadcast:
#   |AB| <= min { r(A), r(B) }
#
# noise
#   min { r(A), r(B) }  < |AB| <  max { r(A), r(B) }
#
#

geocenter.getNearbys = (latitude, longitude, callback) ->

  #nachbar.User.find { location : { $near : [latitude, longitude], $maxDistance : 1 }, online: 1 }, (err, docs) ->
  query = nachbar.User.find({})
  query.select('name', 'location')
  .where('online', 1)
  .where('location').near(latitude, longitude)#.maxDistance(1)
  .limit(50)
  .run (err, docs) ->
    docs = docs || {}
    callback(docs)

