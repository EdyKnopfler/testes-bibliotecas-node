function create_map(div_id, lat, lon) {
  var map = L.map(div_id).setView([lat, lon], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZWRlcnNvbmNhc3NpbyIsImEiOiJja2kzYnN1dXMxdjJ5MnJrYm9jMm14eGRxIn0.fkWV-JDd4mAHmvomjyMp_w'
  }).addTo(map);

  return map;
}
