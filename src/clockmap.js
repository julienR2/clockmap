import requests from  './requests.js'
import $ from 'jquery'

// Get the snapshot from coordinate
// http://maps.googleapis.com/maps/api/staticmap?center=48.857409,2.337601&zoom=13&format=png&sensor=false&size=640x480&maptype=roadmap&style=feature:road.highway|visibility:simplified&style=feature:road.arterial|visibility:on

// get the time from coordinate
// https://maps.googleapis.com/maps/api/timezone/json?location=LOCATION&timestamp=NOW

var defaults = {
  name: "",
  container: ".clockmap",
  location: "New York",
  coordinates: null,
  size: 100
}

function onCoordinatesOk(response) {
  if (response.results[0]){
    this.state.coordinates = response.results[0].geometry.location;

    this.getSnapshot();

    this.getLocationTime()
      .done(onLocationTimeOk.bind(this));
  } else {
    this.startClock();
  }

}

function onLocationTimeOk(response) {
  var offset = response.dstOffset + response.rawOffset,
      d = new Date(),
      utc =  d.getTime() + (d.getTimezoneOffset() * 60000);

  this.state.startTime = new Date(utc + (1000*offset));

  this.startClock();
}

/**
 * @name ClockMap
 * @class ClockMap
 * @constructor
 */
var ClockMap = function(props) {
  this.state = {
    name: props.name || defaults.name,
    container: props.container || defaults.container,
    location: props.location || defaults.location,
    startTime: new Date(),
    size: props.size || defaults.size,
    coordinates: props.coordinates || defaults.coordinates
  }

  this.init();
}
window['ClockMap'] = ClockMap;

/**
 * Display the class name
 * @return {String}
 */
ClockMap.prototype.toString = function() {
  return '[object ClockMap]';
};

/**
 * Initialize the clock
 * @return {}
 */
ClockMap.prototype.init = function() {
  this.templateSetUp();

  if (!this.state.coordinates || !this.state.coordinates.lat || !this.state.coordinates.lng ) {
    this.getCoordinates().done(onCoordinatesOk.bind(this));
  } else {
    this.getLocationTime().done(onLocationTimeOk.bind(this));
    this.getSnapshot();
  }
};

/**
 * Get coordinate
 * @return {Object}
 */
ClockMap.prototype.getCoordinates = function() {
  var params = {
    address: this.state.location
  }

  if (!params.address) {
    return "No valid location or coordinates";
  }

  return requests.coordinates(params);
};

/**
 * Get location time
 * @return {Request}
 */
ClockMap.prototype.getLocationTime = function() {
  var params = {
    location: this.state.coordinates.lat + ',' + this.state.coordinates.lng,
    timestamp: (this.state.startTime.getTime() / 1000)
  }

  return requests.locationTime(params);
};

/**
 * Get snapshot of the location
 * @return {Request}
 */
ClockMap.prototype.getSnapshot = function() {
  var size = this.state.size + 30,
      params = {
        center: this.state.coordinates.lat + ',' + this.state.coordinates.lng,
        size: size + 'x' + size,
        zoom: 12,
        maptype: 'roadmap',
        style: 'feature:road.highway|visibility:simplified',
        style: 'feature:road.arterial|visibility:on',
        format: 'png',
        sensor: false
      };

    this.$clockMap.css('background', 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0.5) 100%), url(http://maps.googleapis.com/maps/api/staticmap?' + $.param(params) + ') no-repeat center center');
};

/**
 * Get snapshot of the location
 * @return {Request}
 */
ClockMap.prototype.startClock = function() {
  var seconds = this.state.startTime.getSeconds(),
      minutes = this.state.startTime.getMinutes(),
      hours = this.state.startTime.getHours();

  this.$hours.css('transform', 'rotateZ(' + ((hours * 30) + (minutes / 2)) + 'deg)');
  this.$minutes.css('transform', 'rotateZ(' + (minutes * 6) + 'deg)');
  this.$seconds.css('transform', 'rotateZ(' + (seconds * 6) + 'deg)');
};

/**
 * Set up the html for the clock
 * @return {Request}
 */
ClockMap.prototype.templateSetUp = function() {
  var container = this.state.container;

  if ($(container).length === 0) {
    $('body').append('<div class="' + container.substring(1) + '"></div>');
  }

  $(container).addClass('clockmap');
  $(container).html(
    '<div class="clockmap-wrapper">' +
      '<div class="simple"></div>' +
      '<div class="hours-container">' +
        '<div class="hours"></div>' +
      '</div>' +
      '<div class="minutes-container">' +
        '<div class="minutes"></div>' +
      '</div>' +
      '<div class="seconds-container">' +
        '<div class="seconds"></div>' +
      '</div>' +
    '</div>' +
    '<div class="numeric"></div>'
  )

  this.$clockMap = $(container);
  this.$hours = $(container + ' .hours');
  this.$minutes = $(container + ' .minutes');
  this.$seconds = $(container + ' .seconds');

  this.$clockMap.width(this.state.size);
  this.$clockMap.height(this.state.size);
};
