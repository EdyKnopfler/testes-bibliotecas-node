if (process.argv.length < 4) {
  console.log('Uso: node index.js <arq.kml> <arq.geojson>');
  return
}

const xmldom = require('xmldom');
const togeojson = require('togeojson');
const fs = require('fs');

const DOMParser = xmldom.DOMParser;

let kml = new DOMParser().parseFromString(fs.readFileSync(process.argv[2], 'utf8'));
let converted = togeojson.kml(kml);

fs.writeFileSync(process.argv[3], JSON.stringify(converted, null, 2));
