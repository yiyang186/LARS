var alldata = JSON.parse($("#alldata").text());
var thisurl = $("#thisurl").text();
var i = 0;
// var airporturl = document.getElementById("airporturl").textContent;

option_drv = {
    polar: {
        center: ['50%', '50%']
    },
    angleAxis: {
        type: 'value',
        startAngle: 0,
        clockwise: false,
        min: 0,
        max: 360
    },
    radiusAxis: {
        min: 0,
        max: 15
    },
    series: [{
        coordinateSystem: 'polar',
        name: 'drv0',
        type: 'line',
        showSymbol: false,
        data: [[0, 0], [0, 0]]
    }]
};

function DrawDrvPolar(ec, index) {
    var id = "drv_" + (index + 1)
    var dom = document.getElementById(id);
    var myChart = ec.init(dom);
    myChart.setOption(option_drv, true);
    myChart.setOption({
        series: [{
            data: alldata["crosses"][index]
        }]
    });
}

option_attention = {
    title: {
        text: alldata['title'],
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56'
            }
        }
    },
    legend: {
        data:['注意力', '逆转率', '操作率', '环境熵'],
        selected: {'操作率': false},
        right: '5%'
    },
    dataZoom: {
        show: false,
        start: 0,
        end: 100
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: [1,2,3,4,5,6,7,8,9,10,11]
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            name: '注意力',
            max: 1,
            min: 0.0,
            boundaryGap: [0, 0]
        },
        {
            type: 'value',
            scale: true,
            name: '标准化特征指标',
            max: 1.0,
            min: 0.0,
            boundaryGap: [0, 0]
        }
    ],
    series: [
        {
            name:'注意力',
            type:'bar',
            yAxisIndex: 0,
            data: alldata["attention"]
        },
        {
            name:'逆转率',
            type:'line',
            yAxisIndex: 1,
            data: alldata["crs_rate"]
        },
        {
            name:'操作率',
            type:'line',
            yAxisIndex: 1,
            data: alldata["opt_rate"]
        },
        {
            name:'环境熵',
            type:'line',
            yAxisIndex: 1,
            data: alldata["ent"]
        }
    ]
};

function DrawAttention(ec) {
    var dom = document.getElementById('attention');
    var myChart = ec.init(dom);
    myChart.setOption(option_attention, true);
    myChart.setOption({
        title: {text: alldata['title']},
        series: [
            {name:'注意力', data: alldata["attention"]},
            {name:'逆转率', data: alldata["crs_rate"]},
            {name:'操作率', data: alldata["opt_rate"]},
            {name:'环境熵', data: alldata["ent"]},
        ]
    });
}

$(function() {
    $("#slider-vertical").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 1280,
        value: 800,
        slide: function(event, ui) {
            $("#time").val(ui.value / 4);
            i = ui.value;
        }
    });
    $("#time").val($("#slider-vertical").slider("value"));
});

option = {
    polar: {
        center: ['50%', '50%']
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    angleAxis: {
        type: 'value',
        startAngle: 0,
        clockwise: false,
        min: 0,
        max: 360
    },
    radiusAxis: {
        min: 0,
        max: 15
    },
    series: [{
        coordinateSystem: 'polar',
        name: 'dot',
        type: 'scatter',
        showSymbol: false,
        symbolSize: 30,
        data: [[10, 30]]
    }],
    animationDuration: 2000
};

function DrawStickTrack(ec, id) {
    var dom = document.getElementById("stick_" + id);
    var myChart = ec.init(dom);
    myChart.setOption(option, true);
    // myChart.on('click', click_hundler);
    i = 800;//$("#slider-vertical").slider("value"));
    var dot = setInterval(function () {
        myChart.setOption({
            series: [{
                name:'dot',
                data: [alldata[id][i]]
            }]
        });
        i ++;
        $("#slider-vertical").slider('value', i);
        $("#time").val(i / 4);
        if(i > 1280) {
            i = 0;
        }
    }, 250);
}

function DrawCharts(ec) {
    DrawStickTrack(ec, "capt");
    DrawStickTrack(ec, "fo");
    DrawAttention(ec);
    
    for(var i = 0; i < 11; i++) {
        DrawDrvPolar(ec, i);
    }
}

$('#show').click(function(){
    $.getJSON(thisurl, {"filename": $("#select_file").val(), "json": "yes"}, function(res){
        alldata = res;
    });
    DrawAttention(echarts);
    
    for(var i = 0; i < 11; i++) {
        DrawDrvPolar(echarts, i);
    }
});

DrawCharts(echarts);