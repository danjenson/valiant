// TODO(danj): rename rails variables to be consistent between JS/Rails
var ready = $(function () {

var markers = [];

var detectBrowser = function () {
  var uAgent = navigator.userAgent;
  var mapdiv = $('#map-canvas')[0];

  if (uAgent.indexOf('iPhone') != -1 || uAgent.indexOf('Android') != -1) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    // Default to css values
  }
};

var defaultCenter = { lat: 37.7577, lng: -122.4376 };  // SF
var defaultZoom = 12;
var generateMap = function () {
  var defaultStyles = [
    {
      "featureType": "water",
      "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
    },
    {
      "featureType": "landscape",
      "stylers": [{ "color": "#f2f2f2" }]
    },
    {
      "featureType": "road",
      "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
    },
    {
      "featureType": "road.highway",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#444" }]
    },
    {
      "featureType": "transit",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    }
  ];

  var mapOptions = { center: defaultCenter,
                     zoom: defaultZoom,
                     styles: defaultStyles,
                     disableDefaultUI: true };

  return new google.maps.Map($('#map-canvas')[0], mapOptions);
};

  // create callback for map 'idle' event
var refreshVideosInViewer = function () {
  var bounds = map.getBounds();

  var boundSW = bounds.getSouthWest();
  var latLow = boundSW.lat();
  var lngLow = boundSW.lng();

  var boundNE = bounds.getNorthEast();
  var latUp = boundNE.lat();
  var lngUp = boundNE.lng();

  var aws_s3_url = $('#aws_s3_url').val();
  var playVideo = function () {
    $('#video-canvas').toggle();
    console.log($(this).attr('url'));
    $('#video-player').attr({ src: $(this).attr('url') });
  };

  // TODO(danj): remove markers that aren't in viewing area
  // TODO(danj): change these to infoWindows
  var plotMarkers = function (videos) {
    for (var i = 0; i < videos.length; i++) {
      var hashTagObjs = videos[i]['hash_tags']
      var hashTags = [];
      for (var j = 0; j < hashTagObjs.length; j++) {
          hashTags.push(hashTagObjs['name']);
      }

      var marker = new google.maps.Marker({
        position: { lat: videos[i]['lat'], lng: videos[i]['lng'] },
        title: videos[i]['title'],
        url: aws_s3_url + '/' + videos[i]['s3_key'],
        tags: hashTags,
        map: map
      });
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', playVideo);
      google.maps.event.addListener(marker, 'click', function () {
          $('#close-overlay-btn').toggle();
        }
      );
    }
  };

  $.ajax({
    url: '/videos/geosearch',
    type: 'POST',
    dataType: 'json',
    data: { "coordinates": { "latLow": latLow, "latUp": latUp,
                             "lngLow": lngLow, "lngUp": lngUp } },
    success: function (videos) { plotMarkers(videos); }
  });
};

var geocoder = new google.maps.Geocoder();
var search = function () {
  var address = $('#search').val();
  geocoder.geocode( { 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(defaultZoom);
      } else {
        console.log('Error searching for location!');
      }
    }
  );
};

// var tagSearch = function () {
//   var tags = [];
//   for (var m = 0; m < markers.length; m++) {
//     for (var t = 0; t < m['tags'].length; t++) {
//       tags.push(m['tags'][t]);
//     }
//   }
//   console.log(tags);
// };

detectBrowser();
var map = generateMap();
google.maps.event.addListener(map, 'idle', refreshVideosInViewer);
$('#search').focus(function () { $(this).val(''); });
$('#search').keypress(function (e) { if (e.which == 13) { search(); } });
// $('#tag-search-btn').click(tagSearch);
}); // end ready

// Turbolinks support
$(document).ready(ready);
$(document).on('page:load', ready);
