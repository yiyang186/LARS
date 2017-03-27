var dom = document.getElementById("kline");
var myChart = echarts.init(dom);
var dates = JSON.parse(document.getElementById("dates").textContent);
var counts = JSON.parse(document.getElementById("counts").textContent);
var datad = JSON.parse(document.getElementById("datad").textContent);
var dataw = JSON.parse(document.getElementById("dataw").textContent);
var datam = JSON.parse(document.getElementById("datam").textContent);
var dataq = JSON.parse(document.getElementById("dataq").textContent);
var urlkline = document.getElementById("klineurl").textContent;

option = {
    title : {
        text: '每k次着陆重着陆发生频率',
        subtext: '滑动平均值',
        x: 'center',
        align: 'right'
    },
    grid: [
        {left: "2%", top: "15%", height: '50%', width: '48%'},
        {left: "2%", top: "75%", height: '10%', width: '48%'}
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
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        }
    },
    legend: {
        data:[datad.name, dataw.name, datam.name, dataq.name],
        x: 'left'
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
