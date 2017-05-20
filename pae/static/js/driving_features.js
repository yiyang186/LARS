var alldata = JSON.parse(document.getElementById("alldata").textContent);
var counts = new Array();
for (var i = 0; i < alldata.counts.length; i++){
    counts[alldata.counts[i][0]] = alldata.counts[i][1]
}

var num_panel = 0;
function addpanel() {
    title = '第'+ num_panel + '个panel';
    var panel = `           
    <div class="panel panel-info" id="panel` + num_panel + `">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse` + num_panel + `">` + title + `</a>
            </h4>
        </div>
        <div id="collapse` + num_panel + `" class="panel-collapse collapse">
            <div class="panel-body">
                <form class="form-horizontal" role="form">
                    <div class="form-group">
                        <label class="checkbox-inline">
                            <input type="radio" id="collapse` + num_panel + `radio0" value="env" checked> 环境
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" id="collapse` + num_panel + `check0" value="wind_x">侧向风
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" id="collapse` + num_panel + `check1" value="wind_y">纵向风
                        </label>
                        <label class="checkbox-inline">
                            <input type="radio" id="collapse` + num_panel + `radio1"  value="drive">驾驶
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" id="collapse` + num_panel + `check3" value="roll">滚转
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" id="collapse` + num_panel + `check4" value="pitch">俯仰
                        </label>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-2">
                            <label class="col-sm-1  control-label"><font size="1">高度</font></label>
                        </div>
                        <div class="col-sm-2">
                            <input type="text" class="form-control" id="collapse` + num_panel + `low" placeholder="low/ft">
                        </div>
                        <div class="col-sm-2">
                            <input type="text" class="form-control" id="collapse` + num_panel + `high" placeholder="high/ft">
                        </div>
                        <div class="col-sm-offset-0 col-sm-2">
                            <button type="button" class="btn btn-success" id="collapse` + num_panel + `submit" onclick="submit_query(this)">提交</button>
                        </div>
                        <div class="col-sm-2">
                            <button type="button" class="btn btn-danger" id="collapse` + num_panel + `delete" onclick="delete_panel(this)">删除</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
    $('#accordion').append(panel);
    $(function(){$('#collapse' + num_panel).collapse('show')});
    num_panel += 1;
}

function delete_panel(btn){
    var i = $(btn).attr('id').slice(8,9);
    $('#panel' + i).remove();
    num_panel -= 1;
}

function submit_query(btn){
    var i = $(btn).attr('id').slice(8,9);
    var requestJson = {
        "envdri":params.seriesName + params.name.replace('\n', ''), 
        "airport_codes": '['+codes[params.name]+']', 
        "vrtg": vrtg
    };
}

option_crossrate = {
    title : [
        {
            text: '航班总体驾驶特征比较',
            left: 'center',
            top: 'top'
        }
    ],
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
        position: function (pos, params, el, elRect, size) {
            var obj = {top: 10};
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
        },
        extraCssText: 'width: 250px'
    },
    legend: [
        {
            data:['每天环境熵', '每天逆转率', '每周环境熵', '每周逆转率'],
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
            show: true,
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0, 1]
        },
        {
            type: 'inside',
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0, 1]
        }
    ],
    grid: [
        {left: "40px", top: "10%", height: '50%', right: '50px'},
        {left: "40px", top: "68%", height: '20%', right: '50px'}
    ],
    xAxis : [
        {
            gridIndex: 1, 
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: false},
            data : alldata.dates,
            axisPointer: {
                z: 100,
                label: {
                    formatter: function (params) {
                        var data = counts[params.value] == null? 0: counts[params.value];
                        return params.value + '\n' + data + '个航班';
                    }
                }
            }
        },
        {
            gridIndex: 0, 
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: false},
            data : alldata.dates,
            axisPointer: {
                z: 100
            }            
        }
    ],
    yAxis: [
        {
            gridIndex: 1, 
            name: '每天航段数',
            nameLocation: 'start',
            type: 'value',
            inverse: true
        },
        {
            gridIndex: 0, 
            name: '环境熵',
            type: 'value',
        },
        {
            gridIndex: 0, 
            name: '逆转率',
            type: 'value',
        },
    ],
    series: [
        {
            id: 'counts',
            name:'每天航段数',
            type:'bar',
            yAxisIndex:0,
            xAxisIndex:0,
            hoverAnimation: false,
            data: alldata.counts
        },
        {
            id: 'daily_entropy',
            name: alldata.entropyD.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:1,
            hoverAnimation: false,
            data: alldata.entropyD.means
        },
        {
            id: 'weekly_entropy',
            name: alldata.entropyW.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:1,
            hoverAnimation: false,
            data: alldata.entropyW.means
        },
        {
            id: 'daily_crossrate',
            name: alldata.crossrateD.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:2,
            hoverAnimation: false,
            data: alldata.crossrateD.means
        },
        {
            id: 'weekly_crossrate',
            name: alldata.crossrateW.name,
            type:'line',
            xAxisIndex:1,
            yAxisIndex:2,
            hoverAnimation: false,
            data: alldata.crossrateW.means
        }
    ]
};

function Draw(ec) {
    var dom = document.getElementById("container");
    var myChart = ec.init(dom);
    myChart.setOption(option_crossrate, true);
}

function DrawCharts(ec) {
    Draw(ec);
}

// $(function () { $('#collapseOne').collapse('show')});
// $(function () { $('#collapseTwo').collapse('hide')});
// $(function () { $('#collapseThree').collapse('hide')});
// $(function () { $('#collapseFour').collapse('hide')});


$('#addpanel').click(function(){addpanel()});

$(function(){ 
    addpanel();
    addpanel();
    addpanel();
});
DrawCharts(echarts);