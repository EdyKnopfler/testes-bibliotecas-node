const Memcached = require('memcached');
const mongojs = require('mongojs');
const LineByLineReader = require('line-by-line');
const fs = require('fs');

const TripFetcher = require('./trip_fetcher');

let agency_id, file;

if (process.argv.length >= 4) {
  agency_id = process.argv[2];
  file = process.argv[3];
}
else {
  console.log('Usage: index <agency_id> <file>');
  return;
}

let memcached = new Memcached('localhost:11211', {maxValue: 1048576*2});
let mongodb = mongojs('localhost:27017/omid_dump', ['trips']);
let trips = new TripFetcher(memcached, mongodb, agency_id);
let lr = new LineByLineReader(file);

lr.on('line', function (line) {
  lr.pause();
  let parts = line.split(',');
  trips.fetchTrip(parts[2], function(err, trip) {
    if (err) throw err;
    if (!trip) {
      console.log(parts[2] + ' not found');
    }
    else {
      console.log(parts[2] + ' ' + trip.headsign);
    }
    lr.resume();
  });
});