var App = {

  init: function() {
    var pusher = new Pusher(App.user.pusherKey);
    var channel = pusher.subscribe(App.user.pusherChannel);
    channel.bind('data', function(device) {
      if (device.D !== 11) return;
      console.log(device);
    });
  }

};
