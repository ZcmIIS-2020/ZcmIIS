function documentMenu(parent, ev) {
    ev.preventDefault();
    //ev.stopPropagation();
    //ev.stopImmediatePropagation();
    var x = ev.clientX;
    var y = ev.clientY;
    var menuData = [
        { id: 'addNewSensor', innerHTML: '添加新的传感器' },
    ];

    var div = document.createElement('div');
    div.className = 'menu';

    var ul = document.createElement('ul');
    div.appendChild(ul);

    for (var i = 0; i < menuData.length; i++) {
        var li = document.createElement('li');
        li.id = menuData[i].id;
        li.innerHTML = menuData[i].innerHTML;
        switch (li.id) {
            case 'addNewSensor':
                li.onclick = addNewSensor; //函数后面不能加()，因为会先执行一遍函数
                break;
        }

        ul.appendChild(li);


    }


    //优化菜单在靠近窗口右端的显示
    if (ev.clientX + 120 >= parent.documentElement.clientWidth) {
        x = parent.documentElement.clientWidth - 120
    }
    //优化菜单在靠近窗口下端的显示
    if (ev.clientY + 40 >= parent.documentElement.clientHeight) {
        y = parent.documentElement.clientHeight - 40
    }
    div.style.left = x;
    div.style.top = y;
    parent.body.appendChild(div);
}

function addNewSensor() {
    layui.use('layer', function() {
        var layer = layui.layer;
        layer.open({
            title: "添加传感器",
            type: 2,
            closeBtn: 1,
            area: ['500px', '450px'], //['500px', '350px']
            shade: 0.2,
            shadeClose: true,
            resize: false,
            btn: ['确定', '取消'],
            scrollbar: false,
            scrolling: 'no',
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            content: ['./edit_sensor.html', 'no'],
            yes: function(index, layero) {
                let loading = layer.load(1);
                body = layui.layer.getChildFrame('body', index);
                let sid = body.find("#name").val().trim();
                console.log(sid)
                let sip = body.find("#ip").val().trim();
                console.log(sip)
                let tnum = body.find("#channel").val().trim();
                console.log(tnum)
                let snum = body.find("#number").val().trim();
                console.log(snum)
                let stype = body.find("#type").val().trim();
                console.log(stype)
                let halert = body.find("#high_alert").val().trim();
                let lalert = body.find("#low_alert").val().trim();
                let parameter = body.find("#check_parameter").val().trim();
                let supplySensorName = body.find("#replace_sensor_id").val().trim();
                let monitorName = monitor_name;
                layer.close(loading);
                layer.close(index);

                //将传感器配置写进数据库
                var URL = "/ZcmDB|sensor_info|insert into sensors values('" + sid + "','" + sip + "','" +
                    tnum + "','" + snum + "','" + stype + "','" + halert + "','" + lalert + "','" +
                    parameter + "','" + supplySensorName + "','" + x + "','" + y + "', '" + monitorName + "');|";
                //var URL = "/ZcmDB|sensor_info|insert into sensors values('" + sid + "','" + sip + "','"
                //	+ tnum + "','" + snum + "','" + stype + "' ,'" + x + "','" + y + "');|";

                window.insertDB(URL);
                console.log(URL)

            },
            btn2: function(index, layero) {
                layer.close(index);
            },
            cancel: function(index, layero) {
                // if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
                layer.close(index)
                    // }
                return false;
            },
            end: function() {
                location.reload();
            }
        });
    });
}

function sensorMenu() {
    var menuData = [
        { id: '' }
    ]
}