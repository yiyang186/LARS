var dom = document.getElementById("kline");
var myChart = echarts.init(dom);
var alldata = JSON.parse(document.getElementById("alldata").textContent);
var urlkline = document.getElementById("klineurl").textContent;

option = {
    title : {
        text: '每k次着陆重着陆发生频率',
        x: 'center',
        align: 'right'
    },
    // backgroundColor: '#696969',
    grid: [
        {left: "45%", top: "10%", height: '45%', right: '5%'},
        {left: "45%", top: "65%", height: '25%', right: '5%'}
    ],
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
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
    legend: {
        data:['海拔', alldata.dataD.name, alldata.dataW.name, 
        alldata.dataM.name, alldata.dataQ.name, alldata.data100.name,
        alldata.data500.name, alldata.data1000.name],
        x: 'left'
    },
    geo: {
        map: 'china',
        left: '10',
        right: '55%',
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
            xAxisIndex: [1, 0],
            start: 65,
            end: 85
        },
        {
            show: true,
            realtime: true,
            xAxisIndex: [1, 0],
            start: 65,
            end: 85
        }
    ],
    xAxis : [
        {
            type : 'category',
            gridIndex: 0,
            boundaryGap : false,
            axisLine: {onZero: false},
            data : alldata.dates
        },
        {
            type : 'category',
            gridIndex: 1,
            boundaryGap : false,
            axisLine: {onZero: false},
            data : alldata.dates
        }
    ],
    yAxis: [
        {
            gridIndex: 0,
            name: '重着陆频率',
            type: 'value',
        },
        {
            gridIndex: 1,
            name: '每天航段数',
            type: 'value',
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
            xAxisIndex:1,
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
        }
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

function show_kline(params) {
    var requestJson = {"city": params.name};
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
});
