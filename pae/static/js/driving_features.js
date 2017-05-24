var alldata = JSON.parse($("#alldata").text());
var thisurl = $("#thisurl").text();
var progressurl = $("#progressurl").text();
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

var num_panel = 4;
function addpanel() {
    title = '第'+ num_panel + '个panel';
    var panel = `           
    <div class="panel panel-info" id="panel` + num_panel + `">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse` + num_panel + `">` + title + `</a>
            </h4>
        </div>
        <div id="collapse` + num_panel + `" class="panel-collapse collapse in">
            <div class="panel-body">
                <form class="form-horizontal" role="form" name="form` + num_panel + `">
                    <div class="form-group">
                        <label class="checkbox-inline">
                        <select onchange="obj_change(this)">
                            <option name="option` + num_panel + `obj" value="drv" selected>驾驶</option>
                            <option name="option` + num_panel + `obj"  value="env">环境</option>
                        </select>
                        <select id="select` + num_panel + `ftr">
                            <option name="option` + num_panel + `ftr" value="cross" selected>逆转率</option>
                            <option name="option` + num_panel + `ftr"  value="opt">操作率</option>
                            <option name="option` + num_panel + `ftr"  value="etp" hidden='hidden'>环境熵</option>
                        </select>
                        <select id="select` + num_panel + `cbt">
                            <option name="option` + num_panel + `cbt" value="x+y" selected>俯仰+滚转</option>
                            <option name="option` + num_panel + `cbt"  value="x">滚转</option>
                            <option name="option` + num_panel + `cbt"  value="y">俯仰</option>
                        </select>
                        <label><font size="1">采样频率</font></label>
                        <input type="text" style="width:50px;" id="text` + num_panel + `span_num" value="1">
                        <select id="text` + num_panel + `span">
                            <option name="option` + num_panel + `span" value="W">周</option>
                            <option name="option` + num_panel + `span" value="M">月</option>
                            <option name="option` + num_panel + `span" value="SM">半月</option>
                            <option name="option` + num_panel + `span" value="D">日历日</option>
                            <option name="option` + num_panel + `span" value="B">工作日</option>
                        </select>
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-inline">
                            <label><font size="1">高度</font></label>
                            <input type="text" style="width:50px;" id="text` + num_panel + `low" value="0">
                            <label><font size="1">英尺~</font></label>
                            <input type="text" style="width:50px;" id="text` + num_panel + `high" value="100">
                            <label><font size="1">英尺  </font></label>
                            <button type="button" class="btn btn-default" id="collapse` + num_panel + `submit" onclick="submit_query(this)">提交</button>
                            <label id="label` + num_panel + `" hidden='hidden'><font size="1">加载中...</font></label>
                        </label>
                    </div>
                    <div id="progressdiv` + num_panel + `" class="progress progress-striped active">
                        <div id="progress` + num_panel + `" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
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

function obj_change(sel){
    var selected = $(sel).children('option:selected');
    var i = selected.attr('name').slice(6,7);
    if(selected.val() == 'env'){
        $('option[name="option'+i+'ftr"][value="cross"]').hide();
        $('option[name="option'+i+'ftr"][value="opt"]').hide();
        $('option[name="option'+i+'ftr"][value="etp"]').show();
        $('option[name="option'+i+'cbt"][value="x+y"]').text("侧向+纵向");
        $('option[name="option'+i+'cbt"][value="x"]').text("侧向");
        $('option[name="option'+i+'cbt"][value="y"]').text("纵向");
    } else if(selected.val() == 'drv'){
        $('option[name="option'+i+'ftr"][value="cross"]').show();
        $('option[name="option'+i+'ftr"][value="opt"]').show();
        $('option[name="option'+i+'ftr"][value="etp"]').hide();
        $('option[name="option'+i+'cbt"][value="x+y"]').text("俯仰+滚转");
        $('option[name="option'+i+'cbt"][value="x"]').text("滚转");
        $('option[name="option'+i+'cbt"][value="y"]').text("俯仰");
    }
}

function deletepanel(){
    if(num_panel < 6) return;
    num_panel -= 1;
    $('#panel'+num_panel).remove();
    $('#addpanel').text('添加('+num_panel+')');
    option_crossrate.legend[0].data.splice(num_panel, 1);
    option_crossrate.series.splice(num_panel+1, 1);
    drv_chart.setOption(option_crossrate, true);
}

function submit_query(btn){
    var i = $(btn).attr('id').slice(8,9);
    $('#label'+i).show();
    var requestJson = {
        "obj": $('option[name="option'+i+'obj"]:selected').val(), 
        "ftr": $('option[name="option'+i+'ftr"]:selected').val(),
        "cbt": $('option[name="option'+i+'cbt"]:selected').val(), 
        "span": $('#text'+i+'span_num').val() + $('option[name="option'+i+'span"]:selected').val(),
        "low": $('#text'+i+'low').val(),
        "high": $('#text'+i+'high').val()
    };
    var sitv = setInterval(function(){get_progress(i);}, 5000);
    myrequestjson(requestJson, i, sitv);
}

function get_progress(i) {
    $.getJSON(progressurl, function(res){
        $('#progress'+i).width(res + '%');
    });
}

function myrequestjson(requestJson, i, sitv) {
    $.getJSON(thisurl, requestJson, function(res){
        var serie = {
            name: res[0],
            type:'line',
            xAxisIndex:1,
            yAxisIndex: (requestJson.obj == 'env'? 1: 2),
            hoverAnimation: false,
            data: res[1]
        }
        option_crossrate.legend[0].data.push(res[0]);
        option_crossrate.series.push(serie);
        drv_chart.setOption(option_crossrate, true);
        $('#label'+i).hide();
        clearInterval(sitv);
        $('#progressdiv'+i).attr("class", "progress progress-bar-success");
    });
}
// $(function () { $('#collapseOne').collapse('show')});
// $(function () { $('#collapseTwo').collapse('hide')});
// $(function () { $('#collapseThree').collapse('hide')});
// $(function () { $('#collapseFour').collapse('hide')});


$('#addpanel').click(function(){addpanel()});
$('#deletepanel').click(function(){deletepanel()});

$(function(){ 
    addpanel();
    addpanel();
    addpanel();
});
DrawCharts(echarts);