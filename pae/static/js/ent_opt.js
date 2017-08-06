var alldata = JSON.parse(document.getElementById("alldata").textContent);
var hotdata = JSON.parse(document.getElementById("hotdata").textContent);
var hot_chart;

var option_scatter = {
    animation: false,
    title: {
        text: '全国航班的环境熵与逆转率',
        subtext: '菱形为该类样本的质量中心，坐标为该类所有样本的(环境熵的均值，逆转率均值)',  
    },
    grid: {top: "10%"},
    tooltip: {
        formatter: function (param) {
            return [
                '环境熵：' + param.value[0] + '<br/>',
                '逆转率：' + param.value[1] + '<br/>',
                '着陆垂直过载：' + param.value[2] + '<br/>',
                '机场: ' + param.value[3]+param.value[4] + '<br/>',
                '时间: ' + param.value[5] + '<br/>'
            ].join('');
        }
    },
    legend: {
        data: []
    },
    color: ['#e6d8be','#bac84d', '#eacf36', '#ffac66', '#e23352'],
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
            start: 20,
            end: 70
        },
        {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            left: '93%',
            start: 3,
            end: 30
        },
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 20,
            end: 70
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 3,
            end: 30
        }
    ],
    series: []
};

var series = option_scatter['series'];
var splits = alldata.splits;
var legend_data = [];
for(var i = 1; i < splits.length; i++){
    var name = splits[i-1] + '~' + splits[i];
    legend_data.push(name);

    var one_series = {
        name: name,
        type: 'scatter',
        itemStyle: {normal: {opacity: 0.8}},
        symbolSize: function (val) {return (val[2]-1) * 50;},
        data: alldata.data[i-1]
    };
    series.push(one_series);
}

for(var i = 1; i < splits.length; i++){
    var one_series = {
        name: legend_data[i-1],
        type: 'scatter',
        symbol: 'diamond',
        itemStyle: {normal: {borderColor: '#000', borderWidth: 5, opacity: 1}},
        symbolSize: function (val) {return (val[2]-1) * 50;},
        tooltip: {
            formatter: function (param) {
                return [
                    '所属区间：' + (param.value[2]+'').slice(0,3) + '<br/>',
                    '环境熵：' + param.value[0] + '<br/>',
                    '逆转率：' + param.value[1] + '<br/>',
                    '着陆垂直过载：' + param.value[2] + '<br/>',
                ].join('');
            }
        },
        data: [alldata.means[i-1]]
    };
    series.push(one_series);
}
option_scatter['series'] = series;
option_scatter['legend']['data'] = legend_data;


counts_matrix_count = hotdata.counts_matrix.map(function (item) {
    return [item[0], item[1], item[2] || '-'];
});

counts_matrix_vrtg = hotdata.counts_matrix.map(function (item) {
    if(item[2] == 0){
        var vrtg = '-';
    }else{
        var vrtg = (item[3] / item[2]).toFixed(2);
    }
    return [item[0], item[1], vrtg];
});

option_hot = {
    tooltip: {
        position: 'top',
        formatter: function(params){
            return (params.data[0]*0.25).toFixed(2)+', '
            +(params.data[1]*0.025).toFixed(3)+': '
            +params.data[2];
        }
    },
    animation: false,
    grid: {
        height: '80%',
        y: '10%'
    },
    xAxis: {
        type: 'category',
        data: hotdata.env_axis,
        splitArea: {
            show: true
        }
    },
    yAxis: {
        type: 'category',
        data: hotdata.drv_axis,
        splitArea: {
            show: true
        }
    },
    visualMap: {
        min: 0,
        max: 800,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%'
    },
    series: [{
        id: 'hot',
        type: 'heatmap',
        data: counts_matrix_count,
        label: {
            normal: {
                show: true
            }
        },
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};

function select_change(sel){
    var opt = $(sel).find("option:selected").val();
    console.log(opt);
    if(opt == 'vrtg'){
        hot_chart.setOption({
            visualMap: {
                min: 1.2,
                max: 1.6,
                precision: 1
            },
            series: [{
                id: 'hot',
                data: counts_matrix_vrtg,
            }]
        });
    }
    if(opt == 'count'){
        hot_chart.setOption({
            visualMap: {
                min: 0,
                max: 800,
                precision: 0
            },
            series: [{
                id: 'hot',
                data: counts_matrix_count,
            }]
        });
    }
}

function draw_scatter(ec) {
    var dom = document.getElementById("container_scatter");
    var myChart = ec.init(dom);
    myChart.setOption(option_scatter, true);
}

function draw_hot(ec) {
    var dom = document.getElementById("container_hot");
    hot_chart = ec.init(dom);
    hot_chart.setOption(option_hot, true);
}

function DrawCharts(ec) {
    draw_scatter(ec);
    draw_hot(ec);
}

DrawCharts(echarts);