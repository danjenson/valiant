var ready = $(function () {
  var resetOverlay = function () {
    $('#video-player')[0].pause();

    var visibleElts = $('.map-overlay').filter(':visible');
    if (visibleElts.length > 0) {
      for (var i = 0; i < visibleElts.length; i++){
        visibleElts.toggle();  // Turn off all active overlay elements
      }
    }
    if ($('#close-overlay-btn').is(':visible')) {
        $('#close-overlay-btn').toggle();
    }
  };

  $('.map-overlay-trigger').click(resetOverlay);
  $('#upload-btn').click(function () { $('#upload-form').toggle(); $('#close-overlay-btn').toggle(); });
  $('#tag-search-btn').click(function () { $('#tag-search').toggle(); $('#close-overlay-btn').toggle(); });
  $('#close-overlay-btn').click(resetOverlay);
  $('body').keyup(function (e) { if (e.which == 27) { resetOverlay(); } });
});

// Turbolinks support
$(document).ready(ready);
$(document).on('page:load', ready);
