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
      if (device.D !== 11) return;

      App.deviceCounts[device.DA] = App.deviceCounts[device.DA] || 0;
      ++App.deviceCounts[device.DA];
      // console.log(App.sensors[device.DA]);
      App.animatePIR(App.sensors[device.DA]);
    });

    setInterval(function() {
      console.log(App.deviceCounts);
      App.deviceCounts = {};
    },60000);

  },

  animatePIR: function(id) {
    var pir = $('#'+id);
    console.log(pir);
    pir.addClass('animated flash');
    setTimeout(function(){
      pir.removeClass('animate flash');
    },1300);
  }

};
