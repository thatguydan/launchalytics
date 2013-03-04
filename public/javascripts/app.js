var count = 0;

var App = {

  titleNum : 0,
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
            if (device.G === '0') $('#TotalServers').text(device.DA);
            break;
          case 9006:
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(device.DA));
          case 30:
            if (device.GUID == '4312BB000564_0101_0_30') $('#UpHumidity').text(device.DA);
            if (device.GUID == '2712BB000643_0101_0_30') $('#DownHumidity').text(device.DA);
            console.log(device.GUID);
          case 31:
            if (device.GUID == '4312BB000564_0101_0_31') $('#UpTemp').text(device.DA);
            if (device.GUID == '2712BB000643_0101_0_31') $('#DownTemp').text(device.DA);
            console.log(device.GUID);
          case 999: case 1007: case 1005: case 1000:
            // ignore leds
            break;
          default:
            console.log('unhandled',device);
        }
      }
    });

    setInterval(function() {
      App.animate('titlePrefix'+App.titleNum,'bounceOutDown');
      var oldPrefix = $('#titlePrefix'+App.titleNum);
      setTimeout(function() {
        oldPrefix.addClass('hidden');
      },270);
      App.titleNum = (App.titleNum == 7) ? 0 : App.titleNum + 1;
      setTimeout(function() {
        $('#titlePrefix'+App.titleNum).removeClass('hidden')
        App.animate('titlePrefix'+App.titleNum,'bounceInDown')
      },270);
    },5000);

  },

  titleAnim: function(id,anim) {
    var el = $('#'+id);
    el.addClass('animated '+anim);
    setTimeout(function(){
      el.removeClass('animate '+anim);
    },1300);
  },

  animate: function(id,anim) {
    var el = $('#'+id);
    el.addClass('animated '+anim);
    setTimeout(function(){
      el.removeClass('animate '+anim);
    },1300);
  },

  fetchImages: function() {
    $.get('/screenshots.json')
     .done(function(data) {
        var images = App.utils.findClosestImagesToDate(data,new Date('Sun Mar 03 2013 17:42:22 GMT-0800 (PST)'));
        App.populateImageCanvas(images);
     })
  },
  populateImageCanvas: function(images) {
    console.log(images);
    var lis = '';
    Object.keys(images).forEach(function(ip) {
      lis += '<li><img width=150 src="/screenshots/'+ip+'/'+images[ip]+'"></li>';
    });
    $('.screenshot-container').html(lis);
  }

};