var alldata = JSON.parse(document.getElementById("alldata").textContent);
var urlkline = document.getElementById("klineurl").textContent;
var vrtg = '1.40';
var kline_chart;
var mycolor = ['#00a3ba', '#eac736', '#ff4e5d', '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae'];

option_map = {
    title : [{
        text: '全国机场',
        x: 'center',
        align: 'top'
    }],
    color: mycolor,
    tooltip: {  
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
            color: '#000'
        },
        extraCssText: 'width: 170px',
    },
    visualMap: {
        type: "piecewise",
        pieces: [
            {min: 3000},
            {min: 300, max: 3000},
            {max: 300}  
        ],
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
    geo: {
        map: 'china',
        left: '0px',
        width: '100%',
        center: [117, 35],
        zoom: 2.0,
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
            tooltip: {
                trigger: 'item',
                formatter: function (param) {
                    // param = param[0];
                    return [
                        '机场: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                        '经度: ' + param.value[0] + '<br/>',
                        '纬度: ' + param.value[1] + '<br/>',
                        '海拔: ' + param.value[2] + 'ft<br/>',
                        '跑道长度： ' + param.value[3]+'ft'
                    ].join('');
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: alldata.airportinfo
        },
    ]
};


option_other = {
    title : [
        {
            text: '着陆重(>'+vrtg+')着陆发生频率',
            left: 'center',
            top: 'top'
        }
    ],
    color: mycolor,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
            color: '#000'
        },
        extraCssText: 'width: 250px',
    },
    grid: [
        {left: "40px", top: "10%", height: '50%', right: '50px',
            tooltip: {
                trigger: 'axis',
            },
        },
        {left: "40px", top: "68%", height: '20%', right: '50px',
            tooltip: {
                trigger: 'axis',
            },
        }
    ],
    legend: [
        {
            data:['每天重着陆频率', '每天环境熵', '每天逆转率', '每周重着陆频率', '每周环境熵', '每周逆转率'],
            left: 'center',
            top: '4%',
            selected: {
                '每天重着陆频率': false, 
                '每天环境熵': false,
                '每天逆转率': false
            }
        }
    ],
    axisPointer: {
        show: true,
        link: {xAxisIndex: 'all'}
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0, 1],
            realtime: true,
            start: 45,
            end: 95
        },
        {
            show: true,
            xAxisIndex: [0, 1],
            realtime: true,
            start: 45,
            end: 95
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
            gridIndex: 0, 
            name: '每天航段数',
            nameLocation: 'start',
            type: 'value',
            max: 500,
            inverse: true
        },
        {
            gridIndex: 1, 
            name: '环境熵',
            type: 'value',
        },
        {
            gridIndex: 1, 
            name: '逆转率',
            type: 'value',
        },
    ],
    series: [
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
            id: 'daily_entropy',
            name: alldata.entropyD.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:2,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.entropyD.means
        },
        {
            id: 'weekly_entropy',
            name: alldata.entropyW.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:2,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.entropyW.means
        },
        {
            id: 'daily_crossrate',
            name: alldata.crossrateD.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:3,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.crossrateD.means
        },
        {
            id: 'weekly_crossrate',
            name: alldata.crossrateW.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:3,
            animation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            data: alldata.crossrateW.means
        }
    ]
};

option_pyramid = {
    title : [{
        text: '重着陆风险隐患金字塔',
        left: 'center',
        top: 'top'
    }],
    color: mycolor,
    legend: [{
        orient: 'vertical',
        left: '0px',
        data: alldata.pyramid_vrtg.legend
    }],
    series: [{
        name: '转化率',
        id: 'pyramid_vrtg',
        type: 'funnel',
        width: '90%',
        height: '95%',
        left: '0%',
        top: '5%',
        sort: 'ascending',
        tooltip: {
            trigger: 'item',
            formatter: '{b}:<br />{c}'
        },
        data: alldata.pyramid_vrtg.data
    }]
};

option_pie = {
    title : [{
            text: '机场海拔与跑道长',
            left: 'center',
            top: 'bottom'
        }],
    color: mycolor,
    series: [
        {
            name:'海拔',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '40%'],
            center: ['50%', '45%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            tooltip: {trigger: 'item'},
            data:alldata.altitude.counts
        },
        {
            name:'跑道长',
            type:'pie',
            selectedMode: 'single',
            radius: ['50%', '80%'],
            center: ['50%', '45%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            tooltip: {trigger: 'item'},
            data:alldata.length.counts
        },
    ]
};

function update_kline(requestJson) {
    $.getJSON(urlkline, requestJson, function (res) {
        kline_chart.setOption({
            title : {text: res.title},
            series: [
                {id: 'counts', data: res.counts},
                {id: 'daily', data: res.dataD.means},
                {id: 'daily_entropy', data: res.entropyD.means},
                {id: 'daily_crossrate', data: res.crossrateD.means},
                {id: 'weekly', data: res.dataW.means},
                {id: 'weekly_entropy', data: res.entropyW.means},
                {id: 'weekly_crossrate', data: res.crossrateW.means},
            ]
        });
    });
}

function show_kline(params) {
    var airport = params.name.match(/[A-Z]+/)+'';
    var requestJson = {"airport": airport, "vrtg": vrtg};
    update_kline(requestJson);
}

function show_kline_by_pie(params) {
    if(params.seriesName == '海拔'){
        var codes = alldata.altitude.codes
    }else if(params.seriesName == '跑道长') {
        var codes = alldata.length.codes
    }
    var requestJson = {
        "title":params.seriesName + params.name.replace('\n', ''), 
        "airport_codes": '['+codes[params.name]+']', 
        "vrtg": vrtg
    };
    update_kline(requestJson);
}

function click_hundler(params) {
    if(params.seriesType == 'scatter'){
        show_kline(params);
    }
    if(params.seriesType == 'funnel'){
        vrtg = params.name.slice(1,5); // 这里的vrtg是全局变量，用于界定重着陆
        show_kline({"name": ''});
    }
    if(params.seriesType == 'pie'){
        show_kline_by_pie(params);
    }
}

function DrawKline(ec) {
    var dom = document.getElementById("kline");
    var myChart = ec.init(dom);
    kline_chart = myChart; // 只有给kline_chart赋值了，click_hundler才能用，所以这个函数必须在其他Draw函数之前
    myChart.setOption(option_other, true);
    myChart.on('click', click_hundler);
}

function DrawMap(ec) {
    var dom = document.getElementById("map");
    var myChart = ec.init(dom);
    myChart.setOption(option_map, true);
    myChart.on('click', click_hundler);
}

function DrawPyramid(ec) {
    var dom = document.getElementById("pyramid");
    var myChart = ec.init(dom);
    myChart.setOption(option_pyramid, true);
    myChart.on('click', click_hundler);
}

function DrawPie(ec) {
    var dom = document.getElementById("pie");
    var myChart = ec.init(dom);
    myChart.setOption(option_pie, true);
    myChart.on('click', click_hundler);
}

function DrawCharts(ec) {
    DrawMap(ec);
    DrawKline(ec);
    DrawPyramid(ec);
    DrawPie(ec);
}

DrawCharts(echarts);