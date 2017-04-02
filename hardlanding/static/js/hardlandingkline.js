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
        {
            text: '机场海拔与跑道长',
            left: 'right',
            top: 'bottom'
        },
    ],
    color: ['#00a3ba', '#eac736', '#ff4e5d', '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae'],
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
        extraCssText: 'width: 170px',
    },
    // backgroundColor: '#696969',
    grid: [
        {left: "33%", top: "10%", height: '50%', right: '25%',
            tooltip: {
                trigger: 'axis',
                // formatter: '{b}:<br />{c}'
            },
        },
        {left: "33%", top: "68%", height: '20%', right: '25%',
            tooltip: {
                trigger: 'axis',
                // formatter: '{b}:<br />{c}'
            },
        }
    ],
        // {left: "33%", top: "65%", height: '25%', right: '25%'}
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
    legend: [
        {
            // data:['海拔', alldata.dataD.name, alldata.dataW.name, 
            // alldata.dataM.name, alldata.dataQ.name, alldata.data100.name,
            // alldata.data500.name, alldata.data1000.name],
            data:['每天重着陆频率', '每天环境熵', '每天逆转率',
                '每周重着陆频率', '每周环境熵', '每周逆转率'],
            left: '35%',
            top: '5%',
            // selected: {
            //     'seasonally': false, 
            //     'monthly': false,
            //     'MA_100': false,
            //     'MA_1000': false
            // }
            selected: {
                '每天重着陆频率': false, 
                '每天环境熵': false,
                '每天逆转率': false
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
        center: [120, 35],
        zoom: 1.5,
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
            xAxisIndex: [0, 1],
            realtime: true,
            start: 65,
            end: 85
        },
        {
            show: true,
            xAxisIndex: [0, 1],
            realtime: true,
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
            max: 1.0
        },
        {
            gridIndex: 0, 
            name: '每天航段数',
            nameLocation: 'start',
            type: 'value',
            max: 300,
            inverse: true
        },
        {
            gridIndex: 1, 
            // min: 0.75,
            // max: 2.8,
            name: '环境熵',
            type: 'value',
        },
        {
            gridIndex: 1, 
            // min: 0.04,
            // max: 0.16,
            name: '逆转率',
            type: 'value',
        },
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
        // {
        //     id: 'monthly',
        //     name: alldata.dataM.name,
        //     type:'line',
        //     xAxisIndex:0,
        //     yAxisIndex:0,
        //     animation: false,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     data: alldata.dataM.means
        // },
        // {
        //     id: 'seasonally',
        //     name: alldata.dataQ.name,
        //     type:'line',
        //     xAxisIndex:0,
        //     yAxisIndex:0,
        //     animation: false,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     data: alldata.dataQ.means
        // },
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
        // {
        //     id: 'ma100',
        //     name:alldata.data100.name,
        //     type:'line',
        //     xAxisIndex:0,
        //     yAxisIndex:0,
        //     animation: false,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     data: alldata.data100.means
        // },
        // {
        //     id: 'ma500',
        //     name: alldata.data500.name,
        //     type:'line',
        //     xAxisIndex:0,
        //     yAxisIndex:0,
        //     animation: false,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     data: alldata.data500.means
        // },
        // {
        //     id: 'ma1000',
        //     name: alldata.data1000.name,
        //     type:'line',
        //     xAxisIndex:0,
        //     yAxisIndex:0,
        //     animation: false,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     data: alldata.data1000.means
        // },
        {
            name: '转化率',
            id: 'pyramid_vrtg',
            type: 'funnel',
            width: '14%',
            height: '40%',
            left: '80%',
            top: '4%',
            sort: 'ascending',
            tooltip: {
                trigger: 'item',
                formatter: '{b}:<br />{c}'
            },
            data: alldata.pyramid_vrtg.data
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
        },
        {
            name:'海拔',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '20%'],
            center: ['87%', '75%'],
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
            radius: ['25%', '35%'],
            center: ['87%', '75%'],
            tooltip: {trigger: 'item'},
            data:alldata.length.counts
        },
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

function update_kline(requestJson) {
    $.getJSON(urlkline, requestJson, function (res) {
        myChart.setOption({
            title : {text: res.title},
            series: [
                {id: 'counts', data: res.counts},
                {id: 'daily', data: res.dataD.means},
                {id: 'daily_entropy', data: res.entropyD.means},
                {id: 'daily_crossrate', data: res.crossrateD.means},
                {id: 'weekly', data: res.dataW.means},
                {id: 'weekly_entropy', data: res.entropyW.means},
                {id: 'weekly_crossrate', data: res.crossrateW.means},
                                
                // {id: 'monthly', data: res.dataM.means},
                // {id: 'seasonally', data: res.dataQ.means},
                // {id: 'ma100', data: res.data100.means},
                // {id: 'ma500', data: res.data500.means},
                // {id: 'ma1000', data: res.data1000.means},
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

myChart.on('click', function (params) {
    // alert(params.seriesName);
    // alert(params.dataIndex);
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
});

// myChart.on('legendselectchanged', function (params) {
//     // 获取点击图例的选中状态
//     var isSelected = params.selected[params.name];
//     // 在控制台中打印
//     console.log((isSelected ? '选中了' : '取消选中了') + '图例' + params.name);
//     // 打印所有图例的状态
//     // console.log(params.selected);
// });