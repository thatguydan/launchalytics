var count = 0;

var App = {

  deviceCounts:{},

  init: function() {
    var pusher = new Pusher(App.user.pusherKey);
    var channel = pusher.subscribe(App.user.pusherChannel);
    channel.bind('data', function(device) {
      if (device.D !== 11) return;

      App.deviceCounts[device.DA] = App.deviceCounts[device.DA] || 0;
      ++App.deviceCounts[device.DA];
    });

    setInterval(function() {
      console.log(App.deviceCounts);
      App.deviceCounts = {};
    },60000);

  }

};
