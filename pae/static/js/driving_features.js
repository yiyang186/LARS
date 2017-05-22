var alldata = JSON.parse($("#alldata").text());
var thisurl = $("#thisurl").text();
var counts = new Array();
var drv_chart; 
for (var i = 0; i < alldata.counts.length; i++){
    counts[alldata.counts[i][0]] = alldata.counts[i][1]
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
        {left: "40px", top: "12%", height: '50%', right: '50px'},
        {left: "40px", top: "70%", height: '20%', right: '50px'}
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
    drv_chart = myChart;
    drv_chart.setOption(option_crossrate, true);
}

function DrawCharts(ec) {
    Draw(ec);
}

var num_panel = 2;
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
                <form class="form-horizontal" role="form" name="form` + num_panel + `">
                    <div class="form-group">
                        <label class="checkbox-inline">
                        <select>
                            <option name="option` + num_panel + `envdrv" value="drv" selected>驾驶</option>
                            <option name="option` + num_panel + `envdrv"  value="env">环境</option>
                        </select>
                        </label>
                        <label class="checkbox-inline">
                        <select>
                            <option name="option` + num_panel + `xy" value="xy" selected>双向</option>
                            <option name="option` + num_panel + `xy"  value="x">侧向</option>
                            <option name="option` + num_panel + `xy"  value="y">纵向</option>
                        </select>
                        </label>
                        <label class="checkbox-inline">
                        <select>
                            <option name="option` + num_panel + `co" value="cross" selected>逆转率</option>
                            <option name="option` + num_panel + `co"  value="opt">操作率</option>
                        </select>
                        </label>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-1">
                            <label class="col-sm-1  control-label"><font size="1">高度</font></label>
                        </div>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" id="text` + num_panel + `low" placeholder="low/ft"">
                        </div>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" id="text` + num_panel + `high" placeholder="high/ft"">
                        </div>
                        <div class="col-sm-2">
                            <button type="button" class="btn btn-default" id="collapse` + num_panel + `submit" onclick="submit_query(this)">提交</button>
                        </div>
                        <div class="col-sm-2">
                            <button type="button" class="btn btn-warning" id="collapse` + num_panel + `modify" onclick="modify_panel(this)">修改</button>
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
    $('#addpanel').text('添加('+num_panel+')');
}

function delete_panel(btn){
    var i = $(btn).attr('id').slice(8,9);
    $('#panel' + i).remove();
    num_panel -= 1;
    $('#addpanel').text('添加('+num_panel+')');

    var index = parseInt(i);
    var mylegend = option_crossrate.legend;
    mylegend[0].data.splice(index, 1);
    var myseries = option_crossrate.series;
    myseries.splice(index, 1);
    drv_chart.setOption({
        legend: mylegend,
        series: myseries
    });
}

function modify_panel(btn){
    var i = $(btn).attr('id').slice(8,9);
    var requestJson = {
        "envdrv": $('option[name="option'+i+'envdrv"]:selected').val(), 
        "xy": $('option[name="option'+i+'xy"]:selected').val(), 
        "co": $('option[name="option'+i+'co"]:selected').val(), 
        "low": $('#text'+i+'low').val(),
        "high": $('#text'+i+'high').val()
    };
    $.getJSON(thisurl, requestJson, function(res){
        var serie = {
            name: res[0],
            type:'line',
            xAxisIndex:1,
            yAxisIndex: (requestJson.envdrv == 'env'? 1: 2),
            hoverAnimation: false,
            data: res[1]
        }
        var index = parseInt(i);
        var mylegend = option_crossrate.legend;
        mylegend[0].data.splice(index, 1, res[0]);
        var myseries = option_crossrate.series;
        myseries.splice(index, 1, serie);
        drv_chart.setOption({
            legend: mylegend,
            series: myseries
        });
    });
}

function submit_query(btn){
    var i = $(btn).attr('id').slice(8,9);
    var requestJson = {
        "envdrv": $('option[name="option'+i+'envdrv"]:selected').val(), 
        "xy": $('option[name="option'+i+'xy"]:selected').val(), 
        "co": $('option[name="option'+i+'co"]:selected').val(), 
        "low": $('#text'+i+'low').val(),
        "high": $('#text'+i+'high').val()
    };
    $.getJSON(thisurl, requestJson, function(res){
        var serie = {
            name: res[0],
            type:'line',
            xAxisIndex:1,
            yAxisIndex: (requestJson.envdrv == 'env'? 1: 2),
            hoverAnimation: false,
            data: res[1]
        }
        var mylegend = option_crossrate.legend;
        mylegend[0].data.push(res[0]);
        var myseries = option_crossrate.series;
        myseries.push(serie);
        drv_chart.setOption({
            legend: mylegend,
            series: myseries
        });
    });
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