

function point_in_line(m, p_from, p_to, memory) {
    var disp_lat = p_to.lat - p_from.lat;
    var disp_lng = p_to.lng - p_from.lng;

    if (!memory) {
      // Option to avoid to create new objects at each call
      memory = {lat: 0, lng: 0};
    }

    var dist_m = calculateHaversineDistance(p_from, p_to);

    memory.lat = p_from.lat;
    memory.lng = p_to.lng;
    var dist_x_m = calculateHaversineDistance(p_from, memory);

    memory.lat = p_to.lat;
    memory.lng = p_from.lng;
    var dist_y_m = calculateHaversineDistance(p_from, memory);

    var x = p_from.lng;
    var y = p_from.lat;

    if (dist_x_m != 0.0) {
      var x_ratio = disp_lng / dist_x_m;
      var x_m = m * dist_x_m / dist_m;
      x += x_m * x_ratio;
    }

    if (dist_y_m != 0.0) {
      var y_ratio = disp_lat / dist_y_m;
      var y_m = m * dist_y_m / dist_m;
      y += y_m * y_ratio;
    }

    return [y, x];
}


function orthogonal_projection(A, B, E, memory) {
    if (!memory) memory = {};
    if (!memory.x) memory.x = [0, 0];
    if (!memory.u) memory.u = [0, 0];
    if (!memory.v) memory.v = [0, 0];
    if (!memory.n) memory.n = [0, 0];
    if (!memory.x_minus_u) memory.x_minus_u = [0, 0];

    memory.x[0] = E.lng;
    memory.x[1] = E.lat;

    memory.u[0] = A.lng;
    memory.u[1] = A.lat;

    memory.v[0] = B.lng;
    memory.v[1] = B.lat;

    memory.n[0] = memory.v[0] - memory.u[0];
    memory.n[1] = memory.v[1] - memory.u[1];

    var norm_n = Math.sqrt(memory.n[0]*memory.n[0] + memory.n[1]*memory.n[1]);
    memory.n[0] /= norm_n;
    memory.n[1] /= norm_n;

    memory.x_minus_u[0] = memory.x[0] - memory.u[0];
    memory.x_minus_u[1] = memory.x[1] - memory.u[1];

    var dot = memory.x_minus_u[0] * memory.n[0] + memory.x_minus_u[1] * memory.n[1];
    memory.n[0] *= dot;
    memory.n[1] *= dot;

    memory.n[0] += memory.u[0];
    memory.n[1] += memory.u[1];

    return [memory.n[1], memory.n[0]];
}

function nearest_point(A, B, E, memory) {
    if (!memory) memory = {};
    if (!memory.AB) memory.AB = [0, 0];
    if (!memory.BE) memory.BE = [0, 0];
    if (!memory.AE) memory.AE = [0, 0];

    if (A.lat == B.lat && A.lng == B.lng) {
      return [A.lat, A.lng];
    }

    memory.AB[0] = B.lng - A.lng;
    memory.AB[1] = B.lat - A.lat;

    memory.BE[0] = E.lng - B.lng;
    memory.BE[1] = E.lat - B.lat;

    memory.AE[0] = E.lng - A.lng;
    memory.AE[1] = E.lat - A.lat;

    var AB_BE = memory.AB[0] * memory.BE[0] + memory.AB[1] * memory.BE[1];
    var AB_AE = memory.AB[0] * memory.AE[0] + memory.AB[1] * memory.AE[1];

    if (AB_BE > 0) {
      return [B.lat, B.lng];
    }

    if (AB_AE < 0) {
      return [A.lat, A.lng];
    }

    return orthogonal_projection(A, B, E);
}


var TO_RAD = Math.PI / 180;
var RADIUS = 6378137; // meters

function toRad (value) {
    return value * TO_RAD;
}

function calculateHaversineDistance (start, end) {
    var lon1 = start.lng;
    var lat1 = start.lat;
    var lon2 = end.lng;
    var lat2 = end.lat;

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * RADIUS;

    // Por compatibilidade com versao anterior do geolib, estamos arrendonado o resultado (metros)
    return distance;
}
