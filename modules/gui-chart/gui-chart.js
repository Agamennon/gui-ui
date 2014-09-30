//http://www.highcharts.com/demo/column-basic
angular.module('gui.directives').directive('guiChart',function() {


    var defaultOptions;
    defaultOptions = {
        chart:{
            renderTo: 'chartcontainer',
            defaultSeriesType: 'column'

        },
        title:{
            text: 'Pedidos por periodo'
        },
        /*subtitle:{
            text: 'Totais mensal do periodo'
        },
*/
        credits: {
            enabled: false
        },

        xAxis: {
            categories: [

            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total (R$)'
            }
        },
        legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            x: 50,
            y: 0,
            floating: true,
            shadow: false
        },
        tooltip: {
            formatter: function() {
                return ''+
                    this.x +': '+ this.y +' R$';
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Totais mensal',
            data: []
        }]
    };


    return {

        priority:0,
        restrict:'E',
        transclude:true,
        replace:true,
        scope:{
            chart:'=',
            options:'='
        },

        template: '<div ng-show=canshow id="chartcontainer" >'+'</div>',

        link: function(scope, elm, attrs) {

            var chartObject = {};

            chartObject = angular.extend({}, defaultOptions, scope.options);

            if (scope.chart === undefined){
                scope.chart = {};
            }


            scope.chart.newChart = function(cat,data){
                scope.canshow = false;

                chartObject.xAxis.categories = cat;

                chartObject.series =  [{
                    name: 'Total mensal',
                    data: data
                }];


                if (data.length > 0)
                    scope.canshow = true;

                scope.chart.chartInstance = new Highcharts.Chart(chartObject);
            };

            //   var chart = new Highcharts.Chart(chartObject);

        }
    };
});
