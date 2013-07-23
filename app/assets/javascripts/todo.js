var map;
var canvas;

var display_map = function (lat, long, zoom) {
  canvas = $('#map_canvas')[0];

  if (! canvas) {
    return;
  };

    var mapOptions = {
      center: new google.maps.LatLng(lat, long),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(canvas, mapOptions);
  };

  var add_marker = function (lat, long, title) {
    var latlng = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({position: latlng, map: map, title: title});
  };

$(document).ready(function () {
  

  display_map(-33.89336, 151.217167, 13);
});