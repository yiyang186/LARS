var dom = document.getElementById("kline");
var myChart = echarts.init(dom);
var dates = JSON.parse(document.getElementById("dates").textContent);
var counts = JSON.parse(document.getElementById("counts").textContent);
var datad = JSON.parse(document.getElementById("datad").textContent);
var dataw = JSON.parse(document.getElementById("dataw").textContent);
var datam = JSON.parse(document.getElementById("datam").textContent);
var dataq = JSON.parse(document.getElementById("dataq").textContent);
var geodata = JSON.parse(document.getElementById("geodata").textContent);
var urlkline = document.getElementById("klineurl").textContent;

option = {
    title : {
        text: '每k次着陆重着陆发生频率',
        subtext: '滑动平均值',
        x: 'center',
        align: 'right'
    },
    // backgroundColor: '#696969',
    grid: [
        {left: "55%", top: "10%", height: '55%', width: '40%'},
        {left: "55%", top: "75%", height: '10%', width: '40%'}
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
        max: 15000,
        seriesIndex: 0,
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
        data:['海拔', datad.name, dataw.name, datam.name, dataq.name],
        x: 'left'
    },
    geo: {
        map: 'china',
        left: '10',
        right: '55%',
        center: [110, 35],
        zoom: 0.8,
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
            show: true,
            realtime: true,
            xAxisIndex: [0, 1],
            start: 65,
            end: 85
        },
        {
            type: 'inside',
            realtime: true,
            xAxisIndex: [0, 1],
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
            data : dates
        },
        {
            type : 'category',
            gridIndex: 1,
            boundaryGap : false,
            axisLine: {onZero: false},
            data : dates
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
            symbolSize: 10,
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
            data: geodata
        },
        {
            id: 'daily',
            name:datad.name,
            type:'line',
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: datad.means
        },
        {
            id: 'weekly',
            name:dataw.name,
            type:'line',
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: dataw.means
        },
        {
            id: 'monthly',
            name:datam.name,
            type:'line',
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: datam.means
        },
        {
            id: 'seasonally',
            name:dataq.name,
            type:'line',
            yAxisIndex:0,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: dataq.means
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
            data: counts
        },
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
                {id: 'daily', data: res.data_D.means},
                {id: 'weekly', data: res.data_W.means},
                {id: 'monthly', data: res.data_M.means},
                {id: 'seasonally', data: res.data_Q.means}
            ]
        });
    });
}

myChart.on('click', function (params) {
    if(params.seriesType == 'scatter'){
        show_kline(params);
    }
});
