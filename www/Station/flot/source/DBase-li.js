//格式化代码：ctrl+shift+i

// layui.config({
//     base: '../layuiadmin/' //静态资源所在路径
// }).extend({
//     index: 'lib/index' //主入口模块
// }).use('jquery','layer', function () {
// var layer=layui.layer;
// var $=layui.$;
window.Prase = function (t, flag) {
    var result = "";
    var k = -1;
    if (flag == 0) {
        k = t.str.indexOf("|");
        if (k >= 0) {
            result = t.str.substr(0, k);
            t.str = t.str.substr(k + 1);
        }
        else t.str = "";
    }
    else if (flag == 1) {
        k = t.str.indexOf("[");
        if (k >= 0) {
            t.str = t.str.substr(k + 1);
            k = t.str.indexOf("]");
            if (k >= 0) {
                result = t.str.substr(0, k);
                t.str = t.str.substr(k + 1);
            }
            else t.str = "";
        }
        else t.str = "";
    }
    return result;
}

//选择----以json类型数据，返回table中的数据
window.selectDB = function (URL, TableCols) {
    
    let Data = [];
    let ResData = {};
    
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,
        cache: false,
        timeout: 5000,
        //data: {},
        dataType: 'text',
        success: function (res) {
            //console.log(res);
            if (res == undefined) {

            }
            //layer.close(loading);
            ResData.code = 0;
            ResData.msg = 'success';
            
            let tablek = res.indexOf("Select");
            let tablerows = new Object();
            tablerows.str = res.substr(0, tablek);
            while (tablerows.str.indexOf("[") >= 0) {
                let row = Prase(tablerows, 1);
                let cols = row.split("|");
                let tableCols = TableCols;
                let data = {};
                for (let i = 0; i < cols.length - 1; i++) {
                    
                    data[tableCols[i]] = cols[i];
                }
                Data.push(data);

            }
            ResData.count = Data.length;
            ResData.data = Data;
        },
        complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                alert("超时");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
        // error: function (res) {
        //     // console.log(res);
        //     //layer.close(loading);
        //     //layer.msg(res);
        // }
    });
    return Data;

}

//更新
window.updateDB = function (URL) {
    let row;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,//ajax请求出数据之后，才执行之后的内容
        cache: false,
        dataType: 'text',//返回值是text类型
        success: function (res) {
            if (res.indexOf("[OK]") >= 0) {//如果更新成功，需要重新绑定table
                row = 1;//表示更新成功
                //layer.msg("更新成功！");
                //return 1;
            }
            else {
                row = 0;//表示更新失败
                //layer.msg("更新失败！");
                //return 0;
            }
        },
        error: function (res) {
            // console.log(res);
            row = -1;//-1表示请求失败
            //layer.msg(res);
        }
    });
    return row;
}
//更新2//不知道这样行不行
window.updateDB2 = function (tablename, obj) {
    $.ajax({
        url: '/ZcmDB|szjdgl|1|update ' + tablename + ' set "' + obj.field + '"="' + obj.value + '" where ID=1',
        type: 'GET',
        async: false,//ajax请求出数据之后，才执行之后的内容
        dataType: 'text',//返回值是text类型
        success: function (res) {
            if (res.indexOf("[OK]") >= 0) {//如果更新成功，需要重新绑定table
                layer.msg("更新成功！");
            }
            else {
                layer.msg("更新失败！");
            }
        }
    });
}
//删除
window.deleteDB = function (URL) {
    let row = 0;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,//ajax请求出数据之后，才执行之后的内容
        cache: false,
        dataType: 'text',//返回值是text类型
        success: function (res) {
            if (res.indexOf("[OK]") >= 0) {//如果更新成功，需要重新绑定table
                row = 1;//表示删除成功
                //layer.msg("删除成功！");
            }
            else {
                row = 0;//表示删除失败
                //layer.msg("删除失败！");
            }
        },
        error: function (res) {
            // console.log(res);
            row = -1;//-1表示请求失败
            //layer.msg(res);
        }
    });
    return row;
}

//添加
window.insertDB = function (URL) {

    let row = 0;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,//ajax请求出数据之后，才执行之后的内容
        cache: false,
        dataType: 'text',//返回值是text类型
        success: function (res) {

            if (res.indexOf("[OK]") >= 0) {//如果更新成功，需要重新绑定table
                row = 1;//插入成功
                //layer.msg("添加成功！");
            }
            else {
                row = 0;//插入失败
                //layer.msg("添加失败！");
            }
        },
        error: function (res) {
            // console.log(res);
            row = -1;//-1表示请求失败
        }
    });
    return row;
}

//判断数据库中是否已经存在记录
window.isrepeat = function (url) {
    var temp = "";
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        dataType: 'text',
        success: function (res) {
            let table = new Object();
            table.str = res;
            let rows = Prase(table, 1);
            if (rows == "") {
                temp = 0;
            }
            else {
                temp = 1;
            }

            /*let cols=new Array();
            cols=rows.split("|");*/

            //alert(cols.length-1);
            /*if(Prase(table,1)==""||Prase(table,1)==null){//如果没有数据，则返回0
                temp=0; 
            }
            else temp=1;//如果有数据则返回1*/
            //tempfzf=cols.length-1;
            //alert(tempfzf);
            //return tempfzf;
        }
    });
    return temp;
}

//url----更新时执行
window.mixurlDB = function (URL) {
    let row;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,//ajax请求出数据之后，才执行之后的内容
        cache: false,
        dataType: 'text',//返回值是text类型
        success: function (res) {
            if (res === "[OK]") {
                row = 1;
            }
            else {
                row = 0;
            }
        },
        error: function (res) {
            row = -1;//-1表示请求失败
        }
    });
    return row;
}
// });
window.Getday = function (year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
}