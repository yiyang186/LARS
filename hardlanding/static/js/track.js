var alldata = JSON.parse(document.getElementById("alldata").textContent);

var option = {
    animation: false,
    title: {
        text: '全国航班的环境熵与逆转率质心轨迹',
    },
    grid: {top: "10%"},
    tooltip: {
        formatter: function (param) {
            return [
                '环境熵：' + param.value[0] + '<br/>',
                '逆转率：' + param.value[1] + '<br/>',
                '着陆垂直过载：' + param.value[2] + '<br/>',
                '样本量：' + param.value[3] + '<br/>'
            ].join('');
        }
    },
    xAxis: {
        type: 'value',
        name: '环境熵',
        nameGap: 3,
        min: 'dataMin',
        max: 'dataMax',
        splitLine: {
            show: true
        }
    },
    yAxis: {
        type: 'value',
        name: '逆转率',
        min: 'dataMin',
        max: 'dataMax',
        splitLine: {
            show: true
        }
    },
    dataZoom: [
        {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            left: '93%',
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 100
        }
    ],
    series: [{
        type: 'line',
        name: 'track',
        smooth: true,
        symbolSize: 10,
        data: alldata
    }]
};


function DrawCharts(ec) {
    Draw(ec);
}

function Draw(ec) {
    var dom = document.getElementById("container");
    var myChart = ec.init(dom);
    myChart.setOption(option, true);
}

DrawCharts(echarts);