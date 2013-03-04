var mainChart = false;
var chartOptions = {
    chartArea : { width:500,left:25,height:300},
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
    legend: {width: 300},
    curveType: 'function',
    series: []
};

var drawDefault = function() {
    mainChart = new google.visualization.LineChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', 'Web Servers');
    mainData.addColumn('number', 'Wifi Clients');

    _.each(rawData,function(v,t) {
        var a = new Date(t);
        var b = (v['#TotalServers'] ? v['#TotalServers'] : null);
        var c = (v['#TotalWifi'] ? v['#TotalWifi'] : null);
        
        mainData.addRow([a,b,c]);
    });

    var options = chartOptions;
    options['curveType']= "function";
    mainChart.draw(mainData, options);
}

var drawTemp = function() {
    mainChart = new google.visualization.LineChart(document.getElementById('mainChart'));

    mainData = new google.visualization.DataTable();
    mainData.addColumn('datetime', 'Time');
    mainData.addColumn('number', 'Upstairs');
    mainData.addColumn('number', 'Downstairs');

    _.each(rawData,function(v,t) {
        var a = new Date(t);
        var b = (v['#UpTemp'] ? Math.round(v['#UpTemp']*100)/100 : null);
        var c = (v['#DownTemp'] ? Math.round(v['#DownTemp']*100)/100 : null);
        
        mainData.addRow([a,b,c]);
    });

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

    _.each(rawData,function(v,t) {
        var a = new Date(t);
        var b = (v['#80'] ? v['#80'] : null);
        var c = (v['#3000'] ? v['#3000'] : null);
        var d = (v['#4000'] ? v['#4000'] : null);
        var e = (v['#4567'] ? v['#4567'] : null);
        var f = (v['#8080'] ? v['#8080'] : null);
        
        mainData.addRow([a,b,c,d,e,f]);
    });

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}

var drawStackedWifi = function() {
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
            var b = (v['#apple'] ? v['#apple'] : null);
            var c = (v['#lg'] ? v['#lg'] : null);
            var d = (v['#motorola'] ? v['#motorola'] : null);
            var e = (v['#samsung'] ? v['#samsung'] : null);
            var f = (v['#asustek'] ? v['#asustek'] : null);
            var g = (v['#htc'] ? v['#htc'] : null);
            var h = (v['#intel'] ? v['#intel'] : null);
            var i = (v['#other'] ? v['#other'] : null);
        }

        mainData.addRow([a,b,c,d,e,f,g,h,i]);
    });

    var options = chartOptions;
    options['isStacked']= true;
    mainChart.draw(mainData, options);
}

