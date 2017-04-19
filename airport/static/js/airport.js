var dom = document.getElementById("map");
var myChart = echarts.init(dom);
var alldata = JSON.parse(document.getElementById("alldata").textContent);
var airporturl = document.getElementById("airporturl").textContent;

option = {
    baseOption: {
        timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 1000,
            data: alldata.world.months,
            playInterval: 2000,
            label: {
                formatter : function(s) {
                    if(s==0){
                        return '2016年';
                    }else{
                        return '2016年'+s+'月';
                    }
                }
            }
        },
        backgroundColor: '#696969',
        title: [
            {
                text: alldata.maptitle,
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            {
                id: 'oneAirport',
                right: '20%',
                top: '43%',
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                }
            }
        ],
        tooltip: {
            trigger: 'item',
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
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data:['vrtg'],
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            type: 'piecewise',
            pieces: [
                {min: 1.6},
                {min: 1.5, max: 1.6},
                {min: 1.4, max: 1.5},
                {min: 1.3, max: 1.4},
                {max: 1.3}  
            ],
            seriesIndex: [0, 2],
            calculable: true,
            dimension: 2,
            precision:2,
            inRange: {
                color: ['#00a3ba', '#eac736', '#ff4e5d']
            },
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: 'world',
            left: '10',
            right: '35%',
            center: [110, 25],
            zoom: 3,
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
        grid: [
            {right: "20%", top: "5%", height: '30%', width: '20%'},
            {right: "20%", top: "50%", height: '30%', width: '20%'}
        ],
        xAxis: [
            {
                gridIndex: 0,
                type: 'value',
                scale: true,
                position: 'top',
                min: 1.2,
                max: 1.8,
                boundaryGap: false,
                splitLine: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                axisLabel: {margin: 2, textStyle: {color: '#fff'}}
            },
            {
                gridIndex: 1,
                type: 'value',
                id: 'littleScatterX',
                min: 0,
                max: 4,
                nameTextStyle: {color: '#fff'}, 
                splitLine: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                axisLabel: {show:false, margin: 20, textStyle: {color: '#fff'}}
            }
        ],
        yAxis: [
            {
                gridIndex: 0,
                type: 'category',
                name: 'TOP 10',
                nameGap: 16,
                inverse: true,
                axisLine: {show: true, lineStyle: {color: '#fff'}},
                axisTick: {show: true, alignWithLabel:true, lineStyle: {color: '#fff'}},
                axisLabel: {interval: 0, textStyle: {color: '#fff'}},
                data: []
            },
            {
                gridIndex: 1,
                type: 'value',
                id: 'littleScatterY',
                min: 0,
                max: 0.4,
                nameTextStyle: {color: '#fff'}, 
                splitLine: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                axisLabel: {show: false, margin: 20, textStyle: {color: '#fff'}}
            }
        ],
        series: [
            {
                name: 'vrtg',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbolSize: function(value) {
                    return (value[2]-1) * 30;
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
                tooltip: {
                    formatter: function (param) {
                        // param = param[0];
                        return [
                            '机场: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            '经度: ' + param.value[0] + '<br/>',
                            '纬度: ' + param.value[1] + '<br/>',
                            '最重垂直过载: ' + param.value[2] + '<br/>'
                        ].join('');
                    }
                },
                data: []
            },
            {
                name: 'bar',
                zlevel: 1,
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                symbol: 'none',
                tooltip: {
                    formatter: function (param) {
                        return [
                            '机场: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            '最重垂直过载: ' + param.value + '<br/>'
                        ].join('');
                    }                    
                },
                itemStyle: {
                    normal: {
                        color: '#ddb926'
                    }
                },
                data: []
            },
            {
                id: 'oneAirport',
                type: 'scatter',
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: function(value) {
                    return (value[2]-1) * 30;
                },
                tooltip: {
                    formatter: function (param) {
                        return [
                            '环境熵: ' + param.value[0] + '<br/>',
                            '逆转率: ' + param.value[1] + '<br/>',
                            '垂直过载: ' + param.value[2] + '<br/>'
                        ].join('');
                    }                    
                },
                data: [],
            }
        ]
    },
    options: alldata.world.options,
    animation: false
};

function show_scatter(params) {
    var airport = params.name.match(/[A-Z]+/) + ''; //params.name.match(/[A-Z]+/)得到的不是字符串，需要转成字符串
    var requestJson = {'airport': airport, 'month': params.seriesName};
    $.getJSON(airporturl, requestJson, function (res) {
        myChart.setOption({
            title: {
                id: 'oneAirport',
                text: res.title
            },
            xAxis:[{
                id: 'littleScatterX',
                name: "环境熵",
                axisLabel: {show: true}
            }],
            yAxis:[{
                id: 'littleScatterY',
                name: "逆转率",
                axisLabel: {show: true}
            }],
            series: [{
                id: 'oneAirport',
                name: params.name,
                data: res.data
            }]
        });
    });
}

myChart.on('click', function (params) {
    var re = /^\d+$/;
    if(params.name == 'China'){
        myChart.setOption({
            baseOption: {geo: {
                map: 'china',
                center: [110, 35],
                zoom: 0.8,
            }},
            options: alldata.china.options
        });
    }
    if(re.test(params.seriesName)) {
        show_scatter(params);
    }
    
});

myChart.on('dblclick', function (params) {
    myChart.setOption({
        baseOption: {geo: {
            map: 'world',
            center: [110, 25],
            zoom: 3,
        }},
        options: alldata.world.options
    });
});

myChart.on('geoselectchanged', function(params){
    alert(params.selected[params.name]);
});


if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

