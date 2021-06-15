TripFetcher = function(memcached, mongo, agency_id) {
  this.memcached = memcached;
  this.mongo = mongo;
  this.agency_id = agency_id;
}

TripFetcher.prototype.fetchTrip = function(trip_id, callback) {
  let self = this;

  self.tryMemcached(trip_id, function(err, trip) {
    if (err) return callback(err);
    
    if (trip) {
      console.warn('Fetched from Memcached');
      return callback(null, trip);
    }
    else {
      self.getOnMongo(trip_id, function(err, trip) {
        if (err) return callback(err);
        if (!trip) return callback(null, null);

        self.putOnMemcached(trip_id, trip, function(err) {
          if (err) return callback(err);
          console.warn('Fetched from MongoDB');
          callback(null, trip);
        });
      });
    }
  });
}

TripFetcher.prototype.tryMemcached = function(trip_id, callback) {
  this.memcached.get(trip_id, function (err, trip) {
    if (err) return callback(err);
    
    if (!trip) {
      return callback(null, null);
    }

    callback(null, trip);
  });
}

TripFetcher.prototype.getOnMongo = function(trip_id, callback) {
  this.mongo.trips.findOne({agency_id: this.agency_id, trip_id: trip_id}, callback);
}

TripFetcher.prototype.putOnMemcached = function(trip_id, trip, callback) {
  this.memcached.set(trip_id, trip, 24*60*60, callback);
}

module.exports = TripFetcher;