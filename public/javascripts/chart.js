google.load("visualization", "1", {packages:["corechart"]});
        google.setOnLoadCallback(drawChart);
        function drawChart() {
        var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2004',  1000,      400],
        ['2005',  1170,      460],
        ['2006',  660,       1120],
        ['2007',  1030,      540]
        ]);
        var options = {
            chart: {
                renderTo: 'chart_dev',
                height: 130
            },
            xAxis: {
                categories: null,
                type: 'datetime',
                labels: { enabled: true }
            },
            yAxis: {
                title: {text: null},
                labels: { enabled: true },
                allowDecimals: true
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                data: [],
                type: "line"
            }],
            // title: {
            //     text: null
            // },
            credits: { enabled: false }
        };
        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        }
