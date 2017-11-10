var alldata = JSON.parse($("#alldata").text());
var i = 0;
// var airporturl = document.getElementById("airporturl").textContent;

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
}

DrawCharts(echarts);