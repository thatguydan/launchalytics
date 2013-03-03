var count = 0;

var App = {

  deviceCounts:{},
  sensors : {
    "010101010101010101010101" : "pir8",
    "000001010101010101010101" : "pir5",
    "010101010111010101010101" : "pir1",
    "010101010101010101011101" : "pir2",
    "010101010101010100010101" : "pir6",
    "000101010101010101010101" : "pir3",
    "010101010101000001010101" : "pir4",
    "010100000101010101010101" : "pir7",
    "000100010111010100110000" : "stripeButton"
  },

  init: function() {
    var pusher = new Pusher(App.user.pusherKey);
    var channel = pusher.subscribe(App.user.pusherChannel);
    channel.bind('data', function(device) {
      if (device.D == 11) {
        App.animate(App.sensors[device.DA],'flash');
      } else {
        App.animate('heart','pulse');
        switch(device.D) {
          case 9005:
            console.log("Device Count " + device.DA);
            $('#TotalWifi').text(device.DA);
            break;
          case 9004:
            console.log("Server Count on port ",device.G,device.DA);
            if (device.G === 0) $('#TotalServers').text(device.DA);
            break;
          case 9006:
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(device.DA));
          case 30:
            if (device.GUID == '4312BB000564_0101_0_31') $('#UpHumidity').text(device.DA);
            if (device.GUID == '2712BB000643_0101_0_31') $('#DownHumidity').text(device.DA);
            console.log(device.GUID);
          case 31:
            if (device.GUID == '4312BB000564_0101_0_31') $('#UpTemp').text(device.DA);
            if (device.GUID == '2712BB000643_0101_0_31') $('#DownTemp').text(device.DA);
            console.log(device.GUID);
          default:
            console.log('unhandled',device);
        }
      }
    });

    // setInterval(function() {
    //   console.log(App.deviceCounts);
    //   App.deviceCounts = {};
    // },60000);

  },

  animate: function(id,anim) {
    var el = $('#'+id);
    el.addClass('animated '+anim);
    setTimeout(function(){
      el.removeClass('animate '+anim);
    },1300);
  }

};
