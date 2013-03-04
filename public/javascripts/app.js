(function() {

var mainData;
var mainChart;
var count = 0;
var chartData = {};
var sortedDates = [];
var rawData = {};
var rawKeys = [];
var rawTweetData = {};
var sortedTweetData = [];
var now = moment(Number);
var dbyg = {};
var START_DATE = new Date('Sat Mar 02 2013 12:00:00 GMT-0800 (PST)');
var END_DATE = new Date();
App = {
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
    var config = {
      "radius": 60,
      "element": "hall",
      "visible": true,
      "opacity": 60,
      "gradient": { 0.3: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.9: "yellow", 1.0: "rgb(255,0,0)" }
    };
    var heatmap = h337.create(config);

    channel.bind('data', function(device) {
      if (device.D == 11) {
        App.animate(App.sensors[device.DA],'flash');
        var coords = {
          "010101010111010101010101" : {x: 515, y: 268}, // 1
          "010101010101010101011101" : {x: 702, y: 267}, // 2
          "000101010101010101010101" : {x: 629, y: 254}, // 3
          "010101010101000001010101" : {x: 579, y: 268}, // 4
          "000001010101010101010101" : {x: 369, y: 268}, // 5
          "010101010101010100010101" : {x: 431, y: 264}, // 6
          "010100000101010101010101" : {x: 782, y: 267}, // 7
          "010101010101010101010101" : {x: 881, y: 301}, // 8
        };
        var coord = coords[device.DA];
        heatmap.store.addDataPoint(coord.x, coord.y, 1);
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
              _.each(data,function(d) {
                if (!rawData[d.t]) rawData[d.t] = {};
                rawData[d.t][fname] = d.v;
              });
          })
        }

        if(guid == "8BA093F06383AF4C_launch_0_9006") {
          d.GetHistoricalData({interval: "1h",fn:"count"}, function(data) {
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(data[data.length-1].v));
            App.launchTweets = data[data.length-1].v;
            _.each(data,function(d) {
              if (!rawTweetData[d.t]) rawTweetData[d.t] = {};
              rawTweetData[d.t]['launch'] = d.v;
            });
            sortedTweetData = Object.keys(rawTweetData).sort();
          });
        }
        if(guid == "8BA093F06383AF4C_launchhack_0_9006") {
          d.GetHistoricalData({interval: "1h",fn:"count"}, function(data) {
            $('#TotalTweets').text(parseInt($('#TotalTweets').text())+parseInt(data[data.length-1].v));
            App.launchhackTweets = data[data.length-1].v;
            _.each(data,function(d) {
              if (!rawTweetData[d.t]) rawTweetData[d.t] = {};
              rawTweetData[d.t]['launchhack'] = d.v;
            });
            sortedTweetData = Object.keys(rawTweetData).sort();
          });
        }
        setTimeout(function(){
          sortedDates = Object.keys(rawData).sort();
          App.drawDefault();
        },2500);



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

  initHome: function() {
    App.fetchHomeThumbnails();
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

      lis += '<li><img data-host="'+ip+'" data-time="'+images[ip]+'" class="screenshot-image" src="/screenshots/'+ip+'/'+images[ip]+'/thumbnail"></li>';
    });
    $('.js-screenshot-list').html(lis);
  },
  repopulateImageCanvas: function(images) {

    Object.keys(images).forEach(function(ip) {

      var id = App.utils.sanitize(ip);

      lis += '<li><img data-host="'+ip+'" data-time="'+images[ip]+'" class="screenshot-image" src="/screenshots/'+ip+'/'+images[ip]+'/thumbnail"></li>';
    });

  },
  updateScreenshots: function(value) {
    var time = (END_DATE.getTime()-START_DATE.getTime())*(value/100) + START_DATE.getTime();
    var images = App.utils.findClosestImagesToDate(App.screenshotData,new Date(time));
    App.populateImageCanvas(images);
    $('#date').text(moment(time).fromNow())

  },
  updateModalScreenshots: function(host,value) {
    var time = (END_DATE.getTime()-START_DATE.getTime())*(value/100) + START_DATE.getTime();
    var images = App.utils.findClosestImagesToDate(App.screenshotData,new Date(time));
    var url = App.utils.getLargeImageUrl(host,images[host]);
    $('.js-modal-screenshot').attr('src',url);
    $('#date').text(moment(time).fromNow())
  },

  fetchHomeThumbnails: function() {
    $.get('/screenshots.json')
     .done(function(data) {
        var images = App.utils.findClosestImagesToDate(data,new Date());

        setInterval(function() {
          App.populateHomeThumbnails(images);
        },10000);

        App.populateHomeThumbnails(images);
     })
  },

  populateHomeThumbnails: function(images) {
    // var goodHosts = [
    //   '10.100.12.249:3000',
    //   '10.100.15.251:3000',
    //   '10.100.14.237:3000',
    //   '10.100.20.254:3000',
    //   '10.100.25.232:3000'
    // ]

    var lis = '';

    var keys = Object.keys(images);
    App.utils.randomize(keys);


    keys.splice(0,19).forEach(function(ip) {

      var id = App.utils.sanitize(ip);

      lis += '<li><img data-host="'+ip+'" data-time="'+images[ip]+'" class="screenshot-home-thumbnail" src="/screenshots/'+ip+'/'+images[ip]+'/thumbnail"></li>';
    });

    $('.js-home-thumbnails').html(lis);

  }

};

var mainChart = false;
var chartOptions = {
    chartArea : { width:600,left:25,height:300},
    vAxis : {
        baselineColor : '#ccc',
        gridlines : { color: '#eee', count: 5 },
        textStyle : { color : "#777"}
    },
    hAxis : {
        baselineColor : 'white',
        gridlines : { color: 'white' },
        format : "HH:mm",
        viewWindowMode : "maximized",
        textStyle : { color : "#777"}
    },
    height: 340,
    width: 650,
    legend: {width: 300, position: 'in'},
    interpolateNulls: true,
    curveType: 'function',
    series: []
};

App.drawDefault = function() {
    mainChart = new google.visualization.AreaChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', 'Web Servers');
    mainData.addColumn('number', 'Wifi Clients');

    for (i=0;i<sortedDates.length;i++) {
        var t = sortedDates[i];
        var v = rawData[t];
        var a = new Date(t);
        if (v['#TotalServers']) var b =  v['#TotalServers'];
        if (v['#TotalWifi']) var c = v['#TotalWifi'];
        if (b || c)
            mainData.addRow([a,b,c]);
    };
    var options = chartOptions;
    // options['curveType']= "function";
    mainChart.draw(mainData, options);
}

App.drawTemp = function() {
    mainChart = new google.visualization.LineChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', 'Upstairs');
    mainData.addColumn('number', 'Downstairs');

    for (i=0;i<sortedDates.length;i++) {
        var t = sortedDates[i];
        var v = rawData[t];
        var a = new Date(t);
        if (v['#UpTemp']) var b =  Math.round(v['#UpTemp']*100)/100;
        if (v['#DownTemp']) var c =  Math.round(v['#DownTemp']*100)/100;
        if (b || c)
            mainData.addRow([a,b,c]);
    };

    var options = chartOptions;
    options['curveType']= "function";
    mainChart.draw(mainData, options);
}

App.drawServers = function() {
    mainChart = new google.visualization.AreaChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', 'Apache');
    mainData.addColumn('number', 'Rails/Node');
    mainData.addColumn('number', '4000');
    mainData.addColumn('number', 'Sinatra');
    mainData.addColumn('number', '8080');

    for (i=0;i<sortedDates.length;i++) {
        var t = sortedDates[i];
        var v = rawData[t];
        var a = new Date(t);
        var b = (v['#80']) ? v['#80'] : null;
        var c = (v['#3000']) ? v['#3000'] : null;
        var d = (v['#4000']) ? v['#4000'] : null;
        var e = (v['#4567']) ? v['#4567'] : null;
        var f = (v['#8080']) ? v['#8080'] : null;
        if (b || c || d || e || f )
            mainData.addRow([a,b,c,d,e,f]);
    };

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}

App.drawWifi = function() {
    mainChart = new google.visualization.AreaChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', 'Apple');
    mainData.addColumn('number', 'LG');
    mainData.addColumn('number', 'Motorola');
    mainData.addColumn('number', 'Samsung');
    mainData.addColumn('number', 'Asus');
    mainData.addColumn('number', 'HTC');
    mainData.addColumn('number', 'Intel');
    mainData.addColumn('number', 'Other');

    var CLEAN_DATE = new Date('Sat Mar 03 2013 18:15:00 GMT-0800 (PST)');

    var keys = Object.keys(rawData);

    for (var i=0;i<sortedDates.length;i++) {

      var t = sortedDates[i];
      var v = rawData[t];
      var a = new Date(t);
      if (a < CLEAN_DATE) continue;
      if (!v.hasOwnProperty('#apple')) continue;

      var r = [
        a,
        v['#apple'] || null,
        v['#lg'] || null,
        v['#motorola'] || null,
        v['#samsung'] || null,
        v['#asustek'] || null,
        v['#htc'] || null,
        v['#intel'] || null,
        v['#other'] || null
      ];

      mainData.addRow(r);
    };

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}
App.drawTweets = function() {
    mainChart = new google.visualization.AreaChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', '#LAUNCH');
    mainData.addColumn('number', '#LAUNCHHACK');


   for (var i=0;i<sortedTweetData.length;i++) {

      var t = sortedTweetData[i];
      var v = rawTweetData[t];
      var a = new Date(t);
      if (v.hasOwnProperty('#launch') || v.hasOwnProperty('#launchhack')) continue;

      var a = new Date(t);
      mainData.addRow([
        a,
        v['launch'] || 0,
        v['launchhack'] || 0
      ]);
    };

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}

})()
