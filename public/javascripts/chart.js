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

var drawDefault = function() {
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

var drawTemp = function() {
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

var drawServers = function() {
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

var drawWifi = function() {
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
    _.each(rawData,function(v,t) {
        var a = new Date(t);
        if (a > CLEAN_DATE) {
            var b = (v['#apple']) ? v['#apple'] : null;
            var c = (v['#lg']) ? v['#lg'] : null;
            var d = (v['#motorola']) ? v['#motorola'] : null;
            var e = (v['#samsung']) ? v['#samsung'] : null;
            var f = (v['#asustek']) ? v['#asustek'] : null;
            var g = (v['#htc']) ? v['#htc'] : null;
            var h = (v['#intel']) ? v['#intel'] : null;
            var i = (v['#other']) ? v['#other'] : null;
        }
        if (b || c || d || e || f || g || h || i)
            mainData.addRow([a,b,c,d,e,f,g,h,i]);
    });

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}
var drawTweets = function() {
    mainChart = new google.visualization.AreaChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', '#LAUNCH');
    mainData.addColumn('number', '#LAUNCHHACK');

    _.each(rawTweetData,function(v,t) {
        var a = new Date(t);
        var b = (v['launch']) ? v['launch'] : null;
        var c = (v['launchhack']) ? v['launchhack'] : null;
        if (b || c )
            mainData.addRow([a,b,c]);
    });

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}

