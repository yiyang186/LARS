var dom = document.getElementById("kline");
var myChart = echarts.init(dom);
var alldata = JSON.parse(document.getElementById("alldata").textContent);
var urlkline = document.getElementById("klineurl").textContent;
var vrtg = '1.40';
option = {
    title : [
        {
            text: '着陆重(>'+vrtg+')着陆发生频率',
            x: 'center',
            align: 'right'
        },
        {
            text: '重着陆风险隐患',
            left: 'right',
            top: 'top'
        },
    ],
    // backgroundColor: '#696969',
    grid: {left: "33%", top: "10%", height: '70%', right: '25%'},
        // {left: "33%", top: "65%", height: '25%', right: '25%'}
    tooltip : {
        trigger: 'item',
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        }
    },
    visualMap: {
        min: 0,
        max: 10000,
        seriesIndex: 0,
        dimension: 2,
        calculable: true,
        precision: 0,
        inRange: {
            color: ['#00a3ba', '#eac736', '#ff4e5d']
        },
        textStyle: {
            color: '#000'
        }
    },
    legend: [
        {
            data:['海拔', alldata.dataD.name, alldata.dataW.name, 
            alldata.dataM.name, alldata.dataQ.name, alldata.data100.name,
            alldata.data500.name, alldata.data1000.name],
            left: '35%',
            top: '5%',
            selected: {
                'seasonally': false, 
                'monthly': false,
                'MA_100': false,
                'MA_1000': false
            }
        },
        {
            orient: 'vertical',
            right: '16%',
            data: alldata.pyramid_vrtg.legend
        }
    ],
    geo: {
        map: 'china',
        left: '1%',
        width: '35%',
        center: [110, 35],
        zoom: 0.9,
        roam: true,
        label: {
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            realtime: true,
            start: 65,
            end: 85
        },
        {
            show: true,
            realtime: true,
            start: 65,
            end: 85
        }
    ],
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: false},
            data : alldata.dates
        }
    ],
    yAxis: [
        {
            name: '重着陆频率',
            type: 'value',
            max: 1.1
        },
        {
            name: '每天航段数',
            nameLocation: 'start',
            type: 'value',
            max: 400,
            inverse: true
        }
    ],
    series: [
        {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: function(value) {
                return (value[3] - 5000) / 400;
            },
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: alldata.geo
        },
        {
            id: 'daily',
            name:alldata.dataD.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.dataD.means
        },
        {
            id: 'weekly',
            name:alldata.dataW.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.dataW.means
        },
        {
            id: 'monthly',
            name: alldata.dataM.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.dataM.means
        },
        {
            id: 'seasonally',
            name: alldata.dataQ.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.dataQ.means
        },
        {
            id: 'counts',
            name:'每天航段数',
            type:'bar',
            yAxisIndex:1,
            xAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.counts
        },
        {
            id: 'ma100',
            name:alldata.data100.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.data100.means
        },
        {
            id: 'ma500',
            name: alldata.data500.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.data500.means
        },
        {
            id: 'ma1000',
            name: alldata.data1000.name,
            type:'line',
            xAxisIndex:0,
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.data1000.means
        },
        {
            name: '转化率',
            id: 'pyramid_vrtg',
            type: 'funnel',
            width: '14%',
            height: '40%',
            left: '80%',
            top: '4%',
            sort: 'ascending',
            data: alldata.pyramid_vrtg.data
        },
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

function show_kline(params) {
    var requestJson = {"city": params.name, "vrtg": vrtg};
    $.getJSON(urlkline, requestJson, function (res) {
        myChart.setOption({
            title : {text: res.title},
            series: [
                {id: 'counts', data: res.counts},
                {id: 'daily', data: res.dataD.means},
                {id: 'weekly', data: res.dataW.means},
                {id: 'monthly', data: res.dataM.means},
                {id: 'seasonally', data: res.dataQ.means},
                {id: 'ma100', data: res.data100.means},
                {id: 'ma500', data: res.data500.means},
                {id: 'ma1000', data: res.data1000.means},
            ]
        });
    });
}

myChart.on('click', function (params) {
    if(params.seriesType == 'scatter'){
        show_kline(params);
    }
    if(params.seriesType == 'funnel'){
        vrtg = params.name.slice(1,5); // 这里的vrtg是全局变量，用于界定重着陆
        show_kline({"name": ''});
    }
});
