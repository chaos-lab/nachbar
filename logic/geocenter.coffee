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

geocenter.getNearbys = (latitude, longtitude, vision, callback) ->
  query = new Query
  query.select('name', 'location')
  #query.where('gps').wherein.center({center: [5, 25], radius: 5})
  .where('checkin').near(latitude, longtitude).maxDistance(vision)
  .run (err, docs) ->
    if docs
      return docs
    else
      return {}
    
 
