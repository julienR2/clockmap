import $ from 'jquery';

function snapshot (opts){
  return $.ajax({
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/staticmap",
    data: opts
  });
}

function coordinates (opts){
  return $.ajax({
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    data: opts
  });
}

function locationTime (opts){
  return $.ajax({
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/timezone/json",
    data: opts
  });
}


module.exports = {
  snapshot: snapshot,
  coordinates: coordinates,
  locationTime: locationTime
};
