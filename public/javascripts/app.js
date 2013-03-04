var count = 0;
var chartData = {};
var rawData = {};
var now = moment(Number);
var dbyg = {};
var START_DATE = new Date('Sat Mar 02 2013 12:00:00 GMT-0800 (PST)');
var END_DATE = new Date();
var App = {
  screenshotData:{},

  titleNum : 0,
  launchTweets : 0,
  launchhackTweets : 0,
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

  idmap : {
    "8BA093F06383AF4C_0_0_9004" : "#TotalServers",
    "8BA093F06383AF4C_80_0_9004" : "#80",
    "8BA093F06383AF4C_3000_0_9004" : "#3000",
    "8BA093F06383AF4C_4000_0_9004" : "#4000",
    "8BA093F06383AF4C_4567_0_9004" : "#4567",
    "8BA093F06383AF4C_5000_0_9004" : "#5000",
    "8BA093F06383AF4C_8000_0_9004" : "#8000",
    "8BA093F06383AF4C_8080_0_9004" : "#8080",
    "4EA563074116A30C_0_0_9005" : "#TotalWifi",
    "4EA563074116A30C_apple_0_9005" : "#apple",
    "4EA563074116A30C_lg_0_9005" : "#lg",
    "4EA563074116A30C_motorola_0_9005" : "#motorola",
    "4EA563074116A30C_samsung_0_9005" : "#samsung",
    "4EA563074116A30C_asustek_0_9005" : "#asustek",
    "4EA563074116A30C_other_0_9005" : "#other",
    "4EA563074116A30C_htc_0_9005" : "#htc",
    "4EA563074116A30C_intel_0_9005" : "#intel",
    "4312BB000564_0101_0_30"    : "#UpHumidity",
    "2712BB000643_0101_0_30"    : "#DownHumidity",
    "4312BB000564_0101_0_31"    : "#UpTemp",
    "2712BB000643_0101_0_31"    : "#DownTemp",
    "8BA093F06383AF4C_launch_0_9006" : "#launchTweets",
    "8BA093F06383AF4C_launchhack_0_9006" : "#launchhackTweets"
  },

  init: function() {
    var pusher = new Pusher(App.user.pusherKey);
    var channel = pusher.subscribe(App.user.pusherChannel);
  
    channel.bind('data', function(device) {
      if (device.D == 11) {
        App.animate(App.sensors[device.DA],'flash');
      } else {
        App.animate('heart','pulse');
        if (device.D == 9006) {
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(device.DA));
        } else {
            // console.log(App.idmap[device.GUID]);
            $(App.idmap[device.GUID]).text(device.DA);
        }
      }
    });

    ninja.User.GetDevices(function(response){
      _.each(response.devices, function(d){
        var last = d.Options.rawData.last_data.DA;
        var guid = d.GUID();
        dbyg[guid] = d;
        // console.log(App.idmap[guid], last);
        var fname = App.idmap[guid];
        $(fname).text(last);

        if(d.Options.rawData.has_time_series) {
          d.GetHistoricalData({from:1362232800000, to:now, interval: "15min",fn: "mean"}, function(data){
            chartData[fname] = new google.visualization.DataTable();
            chartData[fname].addColumn('datetime', 'Time');
            chartData[fname].addColumn('number', 'yAxisLabel');

              _.each(data,function(d) {
                if (!rawData[d.t]) rawData[d.t] = {};
                rawData[d.t][fname] = d.v;

                var x = new Date(d.t);
                // if (conversionFn) d.v = conversionFn(d.v);
                var y = Math.round(d.v*100)/100;
                chartData[fname].addRow([x,y]);
              });

            // rawData[fname] = data;
          })
        }

        if(guid == "8BA093F06383AF4C_launch_0_9006") {
          d.GetHistoricalData({interval: "1h",fn: "count"}, function(data) {
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(data[data.length-1].v));          
            App.launchTweets = data[data.length-1].v;
            console.log('launch = '+App.launchTweets)
          });
        }
        if(guid == "8BA093F06383AF4C_launchhack_0_9006") {
          d.GetHistoricalData({interval: "1h",fn: "count"}, function(data) {
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(data[data.length-1].v));          
            App.launchhackTweets = data[data.length-1].v;
            console.log('launchhack = '+App.launchhackTweets)
          });
        }

      });
    });

    setInterval(function() {
      App.animate('titlePrefix'+App.titleNum,'bounceOutDown');
      var oldPrefix = $('#titlePrefix'+App.titleNum);
      setTimeout(function() {
        oldPrefix.addClass('hidden');
      },240);
      App.titleNum = (App.titleNum == 7) ? 0 : App.titleNum + 1;
      setTimeout(function() {
        $('#titlePrefix'+App.titleNum).removeClass('hidden')
        App.animate('titlePrefix'+App.titleNum,'bounceInDown')
      },240);
    },5000);

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
        App.screenshotData = data;
        var images = App.utils.findClosestImagesToDate(data,START_DATE);
        App.populateImageCanvas(images);
        $('#date').text(moment(START_DATE).fromNow())
     })
  },
  populateImageCanvas: function(images) {
    var lis = '';
    Object.keys(images).forEach(function(ip) {

      var id = App.utils.sanitize(ip);

      lis += '<li><img id="s_'+id+'" data-time="'+images[ip]+'" class="screenshot-image" src="/screenshots/'+ip+'/'+images[ip]+'/thumbnail"></li>';
    });
    $('.js-screenshot-list').html(lis);
  },
  repopulateImageCanvas: function(images) {

    Object.keys(images).forEach(function(ip) {

      var id = App.utils.sanitize(ip);

      lis += '<li><img id="s_'+id+'" data-time="'+images[ip]+'" class="screenshot-image" src="/screenshots/'+ip+'/'+images[ip]+'/thumbnail"></li>';
    });

    // $('')

  },
  updateScreenshots: function(value) {
    var time = (END_DATE.getTime()-START_DATE.getTime())*(value/100) + START_DATE.getTime();
    var images = App.utils.findClosestImagesToDate(App.screenshotData,time);
    App.populateImageCanvas(images);
    $('#date').text(moment(time).fromNow())

  }

};
