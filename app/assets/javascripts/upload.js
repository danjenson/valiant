// wrapping in function for turbolinks compatibilty
var ready = function () {
  $(function () {
    $('#file_upload').fileupload({
      forceIframeTransport: true,
      autoUpload: true,
      add: function (event, data) {
        $.ajax({
          url: '/videos/presign',
          type: 'POST',
          dataType: 'json',
          data: { video: { filename: data.files[0].name } },
          async: false,
          success: function (retdata) {
            // For S3
            $('#file_upload').find('input[name=key]').val(retdata.key);
            $('#file_upload').find('input[name=policy]').val(retdata.policy);
            $('#file_upload').find('input[name=signature]').val(retdata.signature);

            // For video#create
            $('#video_s3_key').val(retdata.key);
          }
        });

        data.submit();
      },
      send: function (e, data) {
        $('#loading').show();
      },
      fail: function (e, data) {
        // TODO (danj): Route this to delete to delete record
        console.log('Failed!');
        console.log(data);
      },
      done: function (event, data) {
        $('#loading').hide();
        console.log('Success!');
      }
    });
  });
};

// Turbolinks support
$(document).ready(ready);
$(document).on('page:load', ready);
