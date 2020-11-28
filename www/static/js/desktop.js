function firstChild(obj) {
    return obj.firstElementChild || obj.firstChild;
}

function lastChild(obj) {
    return obj.lastElementChild || obj.lastChild;
}

function prevNode(obj) {
    return obj.previousElementSibiling || previousSibling;
}

function nextNode(obj) {
    return obj.nextElementSibling || nextElementSibling;
}

function hasChild(obj) {
    var e = obj.getElementsByTagName('*');
    if (e.length) {
        return false;
    }
    return true;
}

function viewHeight() {
    return document.documentElement.clientHeight;
}

function viewWidth() {
    return document.documentElement.clientWidth;
}

function scrollY() {
    return document.body.scrollTop || document.documentElement.scrollTop;
}

function scrollX() {
    return document.body.scrollLeft || document.documentElement.scrollLeft;
}

function scrollH() {
    return document.body.scrollHeight;
}

function scrollW() {
    return document.body.scrollWidth;
}

//为了不污染jquery，注释他们自己写的$()方法
// function $(str, obj) {
//     var id = /^#[\w\d]+/;
//     var tag = /^<\w{1,}>$/;
//     if (id.test(str)) {
//         return (obj || document).getElementById(str.substring(1));
//     }
//     if (tag.test(str)) {
//         return (obj || document).getElementsByTagName(str.substring(1, (str.length - 1)));
//     }
// }

function browInfo() {
    var info = navigator.userAgent;
    if (info.indexOf('MSIE 8') != -1) {
        return 'IE8';
    } else if (info.indexOf('MSIE 7') != -1) {
        return 'IE7';
    } else if (info.indexOf('MSIE 6') != -1) {
        return 'IE6';
    } else {
        return 'OK';
    }
}

function getByClass(obj, sc) {
    var r = [];
    var e = obj.getElementsByTagName('*');
    for (var i = 0; i < e.length; i++) {
        var c = e[i].className.split(' ');
        for (var j = 0; j < c.length; j++) {
            if (c[j] == sc) {
                r.push(e[i]);
            }
        }
    }
    return r;
};

function addClass(obj, sc) {
    var c = obj.className.split(' ');
    for (var i = 0; i < c.length; i++) {
        if (c[i] == sc) {
            return;
        }
    }
    if (!obj.className) {
        obj.className = sc;
        return;
    }
    obj.className += ' ' + sc;
}

function removeClass(obj, sc) {
    if (obj.className) {
        var c = obj.className.split(' ');
        for (var i = 0; i < c.length; i++) {
            if (c[i] == sc) {
                c.splice(i, 1);
                obj.className = c.join(' ');
                return;
            }
        }
    }
}

function addEvent(obj, sEv, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + sEv, function() { fn.call(obj); });
        return;
    }
    obj.addEventListener(sEv, fn, false);
}

function delEvent(obj, sEv, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + sEv, fn);
        return;
    }
    obj.removeEventListener(sEv, fn, false);
}

function getAttribute(obj, attr) {
    if (attr == 'class' || attr == 'className') {
        return obj.getAttribute('class') || obj.getAttribute('className');
    }
    return obj.getAttribute(attr);
}

function setStyle(obj, attr) {
    for (var a in attr) {
        if (a == 'opacity') {
            obj.style[a] = attr[a];
            obj.style.filter = 'alpha(opacity:' + attr[a] * 100 + ')';
            return;
        }
        if (a == 'z-index') {
            obj.style.zIndex = attr[a];
            return;
        }
        obj.style[a] = attr[a];
    }
}

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    return getComputedStyle(obj, false)[attr];
}

function isCollision(obj1, obj2) {
    var L1 = obj1.offsetLeft;
    var R1 = obj1.offsetLeft + obj1.offsetWidth;
    var T1 = obj1.offsetLeft;
    var B1 = obj1.offsetLeft + obj1.offsetHeight;
    var L2 = obj2.offsetLeft;
    var R2 = obj2.offsetLeft + obj2.offsetWidth;
    var T2 = obj2.offsetLeft;
    var B2 = obj2.offsetLeft + obj2.offsetHeight;
    if (R1 < L2 || L1 > R2 || T1 > B2 || B1 < T2) {
        return false;
    } else {
        return true;
    }
}

function distance(obj1, obj2) {
    var a = obj1.offsetLeft - obj2.offsetLeft;
    var b = obj1.offsetTop - obj2.offsetTop;
    return Math.sqrt(a * a + b * b);
}

function drag(obj) {
    obj.onmousedown = function(ev) {
        var ev = ev || event;
        var X = ev.clientX - obj.offsetLeft;
        var Y = ev.clientY - obj.offsetTop;
        if (ev.setCapture) {
            ev.setCapture();
        }
        document.onmousemove = function(ev) {
            var ev = ev || event;
            var iL = ev.clientX - X;
            var iT = ev.clientY - Y;
            iL = iL < 0 ? 0 : iL > viewWidth() - obj.offsetWidth ? viewWidth() - obj.offsetWidth : iL;
            iT = iT < 0 ? 0 : iT > viewHeight() - obj.offsetHeight ? viewHeight() - obj.offsetHeight : iT;
            obj.style.top = iT + 'px';
            obj.style.left = iL + 'px';
        };
        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null;
            if (ev.releaseCapture) {
                ev.releaseCapture();
            }
        }
        return false;
    };
}

function fnMove(obj, json, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var flag = true;
        for (var attr in json) {
            var iCur = getStyle(obj, attr);
            if (attr == 'opacity') {
                iCur = Math.round(iCur * 100);
            } else {
                iCur = parseInt(iCur);
            }
            var iSpeed = (Number(json[attr]) - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (iCur != Number(json[attr])) {
                flag = false;
            }
            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
                obj.style.opacity = (iCur + iSpeed) / 100;
            } else {
                obj.style[attr] = (iCur + iSpeed) + 'px';
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            obj.timer = null;
            if (fn) {
                fn();
            }
        }
    }, 30);
}


/*----------------------------*****************----------------------------*/
/*----------------------------*--基础数据 config--*----------------------------*/
/*----------------------------*****************----------------------------*/
var zh_windowCount = 0,
    zh_winzIndex = 10000,
    zh_appzIndex = 1,
    zh_className = {
        thisWindow: 'newWindow',
        windowContainer: 'windowContainer',
        windowMenu: 'windowMenu',
        windowMenuactive: 'windowMenuactive',
        windowMenuContent: 'windowMenuContent',
        windowFrame: 'contentFrame',
        windowControl: 'windowControl',
        windowMinimize: 'windowMinimize',
        windowMaximize: 'windowMaximize',
        windowMax: 'windowMax',
        windowClose: 'windowClose',
        windowContent: 'windowContent',
        windowResize: 'windowResize',
        windowTopResize: 'windowTopResize',
        windowLeftResize: 'windowLeftResize',
        windowRightResize: 'windowRightResize',
        windowBottomResize: 'windowBottomResize',
        windowTlResize: 'windowTlResize',
        windowTrResize: 'windowTrResize',
        windowBrResize: 'windowBrResize',
        windowBlResize: 'windowBlResize',
        windowHomepage: 'windowHomepage',
        windowForward: 'windowForward',
        windowBackward: 'windowBackward',
        windowRefresh: 'windowRefresh',

        taskMenu: 'taskMenu',
        taskMenuWrap: 'taskMenuWrap',
        taskMenuCon: 'taskMenuCon',
        taskMax: 'taskMax',
        taskClose: 'taskClose',

        icon: 'app',
        minIcon: 'minIcon',
        iconImg: 'appImg',
        icontitle: 'appTitle',
        iconDelete: 'iconDelete',
        leftIcon: 'leftIcon',
        leftIconImg: 'leftIconImg',

        iconDesk: 'deskIcon',
        menu: 'menu',
        btm: 'btm',
        iconMenuRight: 'iconRight',
        iconMenuLeft: 'iconLeft',
        iconMenuCur: 'iconCur',

        deskMenuRight: 'deskRight',
        deskMenuLeft: 'deskLeft',
        typeChecked: 'typeChecked',

        top: 'top',
        desktopIndex: 'desktopIndex',
        activeNum: 'active',
    },
    zh_iconMenu = [
        { id: 'open', innerHTML: '打开应用' },
        [
            { id: 'move', innerHTML: '移动到' },
            { id: 'to1', innerHTML: '桌面1' },
            { id: 'to2', innerHTML: '桌面2' },
            { id: 'to3', innerHTML: '桌面3' },
            { id: 'to4', innerHTML: '桌面4' },
            { id: 'to5', innerHTML: '桌面5' },
            { id: 'to6', innerHTML: '桌面6' },
            { id: 'to7', innerHTML: '桌面7' },
            { id: 'to8', innerHTML: '桌面8' },
        ],
        { id: 'del', innerHTML: '删除应用' },
    ],
    zh_addIcon = [
        { id: 'open', innerHTML: '上传文件' },
        { id: 'del', innerHTML: '添加应用' },
        { id: 'del', innerHTML: '添加桌面联系人' },
        { id: 'del', innerHTML: '新建文件夹' },
    ],
    zh_deskMenu = [
        [
            { id: 'viewIcon', innerHTML: '查看' },
            { id: 'smIcon', innerHTML: '小图标' },
            { id: 'bigIcon', innerHTML: '大图标' },
            { id: 'hugIcon', innerHTML: '超大图标' },
        ],
        [
            { id: 'arrge', innerHTML: '排列方式' },
            { id: 'toRow', innerHTML: '横向' },
            { id: 'toCol', innerHTML: '纵向' },
            { id: 'toFree', innerHTML: '自由排列' },
        ],
        { id: 'renovate', innerHTML: '刷新' },
        { id: 'showdesk', innerHTML: '显示桌面' },
        { id: 'bgSet', innerHTML: '主题设置' },
        { id: 'fullScreen', innerHTML: '全屏显示' },
        { id: 'cancel', innerHTML: '注销' },

    ],
    /*----------------------------*****************----------------------------*/
    /*----------------------------*---App---Data--*----------------------------*/
    /*----------------------------*****************----------------------------*/
    zh_deskIcon = [
        [
<<<<<<< HEAD
            { id: 'monitor', src: './static/images/monitor.png', title: '实时监测', webSrc: 'monitor.html' },
=======
>>>>>>> ad421a088999ce5246399bec5f82c2d5953463d6
            { id: 'analysis', src: './static/images/analysis.png', title: '数据查询', webSrc: 'querydata.html' },
            { id: 'query', src: './static/images/query.png', title: '报警查询', webSrc: 'query.html' },
            { id: 'maintain', src: './static/images/maintain.png', title: '传感器配置', webSrc: 'maintain.html' },
            { id: 'setdatetime', src: './static/images/time.png', title: '系统校时', webSrc: 'setdatetime.html' }
        ],
    ];


function desk() {
    //因为之前注释掉了他们自己写的$()方法，所以此处$()实际上为jquery对象，将它转为dom对象，否则后面会出很多错误
    this.oWrap = $('#desktopwrap').get(0); //整个背景桌面
    this.oDesk = $('#desktop').get(0); //
    this.oTask = $('#taskIcon').get(0); //任务栏
    this.oBg = $('#bgWindow').get(0); //设置背景图片的界面
    this.oDeskContent = $('#desktopContent').get(0); //滑动桌面的界面

    this.aDeskCount = zh_deskIcon.length; //桌面个数
    this.iconMarRgt = 50;
    this.iconMarTop = 20;
    this.deskPdgTop = 50; //图标桌面上边距
    this.deskPdgLeft = 70; //图标桌面左边距
    this.minDis = 50; //碰撞时交换图标的最小距离
    this.className = zh_className;
    this.addIconCon = zh_addIcon;
    this.aDeskIconContent = zh_deskIcon; //桌面图标目录
    this.iconMenuContent = zh_iconMenu; //App右键菜单
    this.deskMenuContent = zh_deskMenu; //桌面右键菜单
    this.argMent = 'row'; //图标排列方式'row'：横向，'col'：纵向，其他值：自由排列
    this.aDesk = []; //存储桌面的数组
    this.iNowDesk = 1; //默认显示桌面1
    this.aCheckDesk = []; //底部桌面导航
    this.aDeskIcon = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]; //每个桌面的图标
    this.iconMenu = [];
    this.deskMenu = '';
    this.addIcon = [];
    this.deskMenuMain = [];
    this.deskMenuList1 = [];
    this.deskMenuList2 = [];
    this.iconMenuMain = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]; //APP右键菜单的内容
    this.iconMenuList = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
}
desk.prototype = {
    init: function() {
        var _this = this; //初始化

        this.createDesk();
        this.createApp();
        this.createTime();
        this.setSize();
        this.arrangeIcon(this.argMent);
        this.events();
    },
    createDesk: function() { //创建桌面
        var oFrag = document.createDocumentFragment();

        for (var i = 0; i < this.aDeskCount; i++) {
            var desk = document.createElement('div');

            desk.id = 'desk' + (i + 1);
            desk.className = this.className.iconDesk;
            desk.index = i;

            if (i < this.iNowDesk - 1) {
                desk.style.left = -viewWidth() + 'px';
            }
            if (i == this.iNowDesk - 1) {
                desk.style.left = 0 + 'px';
            }
            if (i > this.iNowDesk - 1) {
                desk.style.left = viewWidth() + 'px';
            }

            this.aDesk.push(desk);
            oFrag.appendChild(desk);
        }
        this.oDeskContent.appendChild(oFrag);
    },
    createApp: function() { //生成桌面图标
        for (var i = 0; i < this.aDeskIconContent.length; i++) {
            for (var j = 0; j < this.aDeskIconContent[i].length; j++) {
                var newIcon = new createIcon(this.oDesk, this.aDesk[i], this.oTask, this.aDeskIconContent[i][j]);
                newIcon.init();
                newIcon.icon.index = j;
                this.aDeskIcon[i].push(newIcon.icon);
            }
            this.aDeskIcon[i].index = i;
        }
    },

    createTime: function() { //生成任务栏时间
        var timer = document.getElementById("showTime");
        setInterval(function() {
            var time = new Date();
            var month = time.getMonth() + 1;
            var date = time.getDate();
            var hour = time.getHours();
            var minutes = time.getMinutes();
            if (month < 10)
                month = "0" + month;
            if (date < 10)
                date = "0" + date;
            if (hour < 10)
                hour = "0" + hour;
            if (minutes < 10)
                minutes = "0" + minutes;
            var t = hour + ":" + minutes + '<p>' + time.getFullYear() + "-" + month + "-" + date;
            timer.innerHTML = t;
        }, 1000);
    },
    events: function() { //事件
        var _this = this;
        var i = 0;

        window.onresize = function() {
            _this.setSize();
            _this.arrangeIcon(_this.argMent);
        };
        //document.onmousewheel = wheel;

        // if (document.addEventListener) {
        //     document.addEventListener('DOMMouseScroll', wheel, false);
        // }

        // function wheel(ev) {
        //     var ev = ev || event;

        //     var iNow = _this.iNowDesk;
        //     var flag = false;
        //     if (ev.wheelDelta) {
        //         flag = ev.wheelDelta > 0 ? false : true;
        //     }
        //     if (ev.detial) {
        //         flag = ev.detail < 0 ? true : false;
        //     }
        //     if (flag) {
        //         iNow++;
        //         if (iNow > _this.aDeskCount) {
        //             iNow = 1;
        //         }
        //         _this.iNowDesk = iNow;
        //         _this.checkDesk(iNow - 1);
        //     } else {
        //         iNow--;
        //         if (iNow < 1) {
        //             iNow = _this.aDeskCount;
        //         }
        //         _this.iNowDesk = iNow;
        //         _this.checkDesk(iNow - 1);
        //     }
        //     if (ev.preventDefault) {
        //         ev.preventDefault();
        //     }
        //     return false;
        // };
        document.oncontextmenu = function(ev) { //当用户在 <div> 元素 上右击鼠标时执行 JavaScript
            var ev = ev || event;
            var X = ev.clientX;
            var Y = ev.clientY;
            _this.deskContextmenu();

            if (_this.iconMenu[_this.iNowDesk - 1]) {
                _this.iconMenu[_this.iNowDesk - 1].style.display = 'none';
            }
            if (X >= viewWidth() - _this.deskMenu.offsetWidth) {
                X = viewWidth() - _this.deskMenu.offsetWidth;
                _this.deskMenuMain[0].className = _this.className.deskMenuLeft;
                _this.deskMenuMain[1].className = _this.className.deskMenuLeft;
            } else {
                if (X >= viewWidth() - _this.deskMenu.offsetWidth - 80) {
                    _this.deskMenuMain[0].className = _this.className.deskMenuLeft;
                    _this.deskMenuMain[1].className = _this.className.deskMenuLeft;
                } else {
                    _this.deskMenuMain[0].className = _this.className.deskMenuRight;
                    _this.deskMenuMain[1].className = _this.className.deskMenuRight;
                }
            }
            if (Y >= viewHeight() - _this.deskMenu.offsetHeight) {
                Y = viewHeight() - _this.deskMenu.offsetHeight;
            }
            _this.deskMenu.style.left = X + 'px';
            _this.deskMenu.style.top = Y + 'px';
            return false;
        };
        addEvent(document, 'click', function() {
            if (_this.deskMenu) {
                _this.deskMenu.style.display = 'none';
            }
            if (_this.addIcon[_this.iNowDesk - 1]) {
                _this.addIcon[_this.iNowDesk - 1].style.display = 'none';
            }
        })

        /*--------------------------顶部导航条-----------------------------*/
        // this.drag(this.oTop);

        // this.oTop.oncontextmenu = function(ev) {
        //     var ev = ev || event;
        //     ev.cancelBubble = true;
        //     return false;
        // };
        //this.checkDesk(this.iNowDesk - 1);
        //_this.aCheckDesk[this.iNowDesk - 1].className = this.className.activeNum;

        for (i = 0; i < this.aCheckDesk.length; i++) {
            this.aCheckDesk[i].index = i;
            this.aCheckDesk[i].onmousedown = function(ev) {
                var ev = ev || event;
                var This = this;
                var X = ev.clientX;
                var Y = ev.clientY;
                this.onmouseup = function(ev) {
                    var ev = ev || event;
                    if (ev.clientX == X && ev.clientY == Y) {
                        _this.checkDesk(This.index);
                    }
                };
                ev.cancelBubble = true;
                return false;
            }
        }

        /*--------------------------图标事件---------------------------------*/
        for (i = 0; i < this.aDeskIcon.length; i++) {
            for (var j = 0; j < this.aDeskIcon[i].length; j++) {

                this.addIconEvent(i, j);
            }
        }
    },

    addIconEvent: function(desktopIndex, objIndex) { //图标事件
        var _this = this;
        addEvent(this.aDeskIcon[desktopIndex][objIndex], 'mousedown', function() {
            _this.moveArrangeIcon(this, desktopIndex);
        })
        if (this.aDeskIcon[desktopIndex][objIndex].isOpen == 'no') {
            this.aDeskIcon[desktopIndex][objIndex].onclick = function(ev) {
                var ev = ev || event;
                _this.fnAddIcon();
                _this.addIcon[_this.iNowDesk - 1].style.left = ev.clientX + 'px';
                _this.addIcon[_this.iNowDesk - 1].style.top = ev.clientY + 'px';
                _this.addIcon[_this.iNowDesk - 1].style.zIndex = zh_winzIndex;
                if (_this.iconMenu[_this.iNowDesk - 1]) {
                    _this.iconMenu[_this.iNowDesk - 1].style.display = 'none';
                }
                if (_this.deskMenu) {
                    _this.deskMenu.style.display = 'none';
                }
                ev.cancelBubble = true;
                return false;
            }
        }
        this.aDeskIcon[desktopIndex][objIndex].oncontextmenu = function(ev) {
            var ev = ev || event;
            var iL = 0;
            if (this.isOpen == 'yes') {
                _this.iconContextmenu(this, desktopIndex);

                var moreLi = _this.iconMenu[desktopIndex].getElementsByTagName('li')[1];


                _this.iconMenu[desktopIndex].style.left = ev.clientX + 'px';
                _this.iconMenu[desktopIndex].style.top = ev.clientY + 'px';
                iL = viewWidth() - _this.iconMenu[desktopIndex].offsetWidth;

                if (ev.clientX >= iL) {
                    _this.iconMenu[desktopIndex].style.left = iL + 'px';
                    moreLi.className = _this.className.iconMenuLeft;
                } else {
                    if (ev.clientX >= iL - 130) {
                        moreLi.className = _this.className.iconMenuLeft;
                    } else {
                        moreLi.className = _this.className.iconMenuRight;
                    }

                }
            } else {
                if (_this.iconMenu[desktopIndex]) {
                    _this.iconMenu[desktopIndex].style.display = 'none';
                }
                if (_this.deskMenu) {
                    _this.deskMenu.style.display = 'none';
                }
            }
            if (_this.iconMenu[desktopIndex]) {
                _this.iconMenu[desktopIndex].style.zIndex = zh_winzIndex;
            }
            if (_this.addIcon[_this.iNowDesk - 1]) {
                _this.addIcon[_this.iNowDesk - 1].style.display = 'none';
            }
            ev.cancelBubble = true;
            return false;
        };
    },
    // checkDesk: function(num) { //选择桌面函数
    //     for (var i = 0; i < this.aDesk.length; i++) {
    //         this.aCheckDesk[i].className = '';
    //         if (i > num) {
    //             fnMove(this.aDesk[i], { left: viewWidth(), opacity: 0 });
    //         }
    //         if (i < num) {
    //             fnMove(this.aDesk[i], { left: -viewWidth(), opacity: 0 });
    //         }
    //     }
    //     this.iNowDesk = num + 1;
    //     fnMove(this.aDesk[num], { left: 0, opacity: 100 })
    //     this.aCheckDesk[num].className = this.className.activeNum;
    // },
    setSize: function() { //设置桌面大小
        this.oWrap.style.height = viewHeight() + 'px';
        this.oWrap.style.width = viewWidth() + 'px';
        this.oDesk.style.height = viewHeight() + 'px';
        this.oDesk.style.width = viewWidth() + 'px';
        this.oTask.style.bottom = 0 + 'px';
        // for (var i = 0; i < this.aDesk.length; i++) {
        //     this.aDesk[i].style.height = (viewHeight() - 140) + 'px';
        //     this.aDesk[i].style.width = (viewWidth() - 50) + 'px';
        // }
        this.aDesk[0].style.height = (viewHeight() - 40) + 'px';
        this.aDesk[0].style.width = (viewWidth() * 0.2) + 'px';
    },
    arrangeIcon: function(argMent) { //图标自动排列
        var oneWidth = (this.iconMarRgt + this.aDeskIcon[0][0].offsetWidth);
        var oneHeight = (this.iconMarTop + this.aDeskIcon[0][0].offsetHeight);
        for (var i = 0; i < this.aDesk.length; i++) {

            if (argMent == 'row') {
                var row = parseInt((this.aDesk[i].offsetHeight) / oneHeight);
                var col = Math.ceil(this.aDeskIcon[i].length / row);
                for (var j = 0; j < this.aDeskIcon[i].length; j++) {

                    fnMove(this.aDeskIcon[i][j], {
                        'top': ((j % row) * oneHeight + this.deskPdgTop),
                        'left': (parseInt(j / row) * oneWidth + this.deskPdgLeft),
                        'opacity': 100
                    });
                }
            } else if (argMent == 'col') {
                var col = parseInt((this.aDesk[i].offsetWidth) / oneWidth);
                var row = Math.ceil(this.aDeskIcon[i].length / col);
                for (var j = 0; j < this.aDeskIcon[i].length; j++) {
                    fnMove(this.aDeskIcon[i][j], {
                        'top': (parseInt(j / col) * oneHeight + this.deskPdgTop),
                        'left': ((j % col) * oneWidth + this.deskPdgLeft),
                        'opacity': 100
                    })
                }
            }
        }
    },
    moveArrangeIcon: function(obj, num) { //拖动交换位置
        var _this = this;
        var dis = 0;
        var isCol = false;

        obj.onmouseup = function() {
            for (var n = 0; n < _this.aDeskIcon[num].length; n++) {
                if (_this.aDeskIcon[num][n] != obj && _this.aDeskIcon[num][n].isOpen == 'yes') {
                    isCol = isCollision(obj, _this.aDeskIcon[num][n]);
                    dis = distance(obj, _this.aDeskIcon[num][n]);

                    if (isCol && dis <= obj.offsetWidth / 2) {
                        var index2 = _this.aDeskIcon[num][n].index;
                        var length = _this.aDeskIcon[num].length;

                        _this.aDeskIcon[num].splice(obj.index, 1);

                        _this.aDeskIcon[num].splice(index2, 0, obj);

                        for (var i = 0; i < _this.aDeskIcon[num].length; i++) {
                            _this.aDeskIcon[num][i].index = i;
                        }
                        break;
                    }
                }
            }
            _this.arrangeIcon(_this.argMent);
        }
        addEvent(document, 'mouseup', function() {

            _this.arrangeIcon(_this.argMent);
        })
    },
    contextMenu: function(parent, MenuContent, deskId, cur) { //创建右键菜单
        var oDiv = document.createElement('div');
        oDiv.className = this.className.menu;
        for (var i = 0; i < MenuContent.length; i++) {
            if (!oUl) {
                var oUl = document.createElement('ul');
            }
            var li = document.createElement('li');

            li.innerHTML = MenuContent[i].innerHTML;
            li.id = deskId + MenuContent[i].id;
            if (MenuContent[i].id == 'showdesk') {
                li.innerHTML = '<span>' + MenuContent[i].innerHTML + '</span>';
            }
            if (MenuContent == this.deskMenuContent) {
                this.deskMenuMain.push(li);
            }
            if (MenuContent == this.iconMenuContent) {
                this.iconMenuMain[cur].push(li);
            }
            this.contextList(li, MenuContent[i], deskId, cur);
            oUl.appendChild(li);
        }
        oDiv.appendChild(oUl);
        parent.appendChild(oDiv);
        return oDiv;
    },
    contextList: function(parent, MenuContent, deskId, cur) { //生成子菜单
        var _this = this;
        for (var i = 0; i < MenuContent.length; i++) {
            if (!parent.ul) {
                parent.ul = document.createElement('ul');
                parent.innerHTML = MenuContent[0].innerHTML;
                parent.id = deskId + MenuContent[0].id;
                i++;
            }
            if (MenuContent == this.iconMenuContent[1]) {
                parent.className = this.className.iconMenuRight;
            }

            var li = document.createElement('li');

            li.innerHTML = MenuContent[i].innerHTML;
            li.id = deskId + MenuContent[i].id;
            li.index = i - 1;

            if (MenuContent == this.deskMenuContent[0] || MenuContent == this.deskMenuContent[1]) {
                parent.className = this.className.deskMenuRight;
                if (MenuContent == this.deskMenuContent[0]) {
                    this.deskMenuList1.push(li);
                }
                if (MenuContent == this.deskMenuContent[1]) {
                    this.deskMenuList2.push(li);
                }
            }
            if (MenuContent == this.iconMenuContent[1]) {
                if (cur == i - 1) {
                    li.className = this.className.iconMenuCur;
                }
                this.iconMenuList[cur].push(li);
            }
            this.contextList(li, MenuContent[i], deskId);
            parent.ul.appendChild(li);
            parent.appendChild(parent.ul);
        }
    },
    iconContextmenu: function(obj, num) { //app右键菜单
        var _this = this;
        if (!_this.iconMenu[num]) {
            _this.iconMenu[num] = _this.contextMenu(_this.aDesk[num], _this.iconMenuContent, _this.aDesk[num].id, num);
        } else {
            _this.iconMenu[num].style.display = 'block';
        }
        if (_this.deskMenu) {
            _this.deskMenu.style.display = 'none';
        }
        _this.iconMenuMain[num][0].onclick = function(ev) {
            _this.openWindow(obj, num);

        }
        _this.iconMenuMain[num][2].onclick = function() {
            _this.delIcon(obj, num);
        }

        for (var i = 0; i < _this.iconMenuList[num].length; i++) {
            if (_this.iconMenuList[num][i].className != _this.className.iconMenuCur) {
                _this.iconMenuList[num][i].onclick = function(ev) {
                    _this.iconMenu[num].style.display = 'none';
                    _this.moveIcon(obj, _this.aDeskIcon[num], _this.aDeskIcon[this.index], _this.aDesk[num], _this.aDesk[this.index]);
                };
            }
        }
        _this.iconMenu[num].onclick = function() {
            var ev = ev || event;
            ev.cancelBubble = true;
        };
        document.onclick = function() {
            _this.iconMenu[num].style.display = 'none';
        };
    },
    fnAddIcon: function() {
        var _this = this;
        if (!this.addIcon[this.iNowDesk - 1]) {
            this.addIcon[this.iNowDesk - 1] = this.contextMenu(this.aDesk[this.iNowDesk - 1], this.addIconCon, this.aDesk[this.iNowDesk - 1].id);
        } else {
            this.addIcon[this.iNowDesk - 1].style.display = 'block';
        }
        this.addIcon[this.iNowDesk - 1].onclick = function() {
            this.style.display = 'none';
        };

    },
    openWindow: function(obj, desktopIndex) { //打开应用
        this.iconMenu[desktopIndex].style.display = 'none';
        var Window = $('#' + this.aDesk[desktopIndex].id + 'window' + obj.id);
        if (Window) {
            Window.style.left = obj.offsetLeft + 'px';
            Window.style.top = obj.offsetTop + 'px';
            return;
        }
        //new newWindow(this.oDesk,this.oTask,this.aDesk[desktopIndex].id+'window'+obj.id,obj.json).init();
    },
    moveIcon: function(obj, arr, toArr, curDesk, toDesk) { //移动到,交换数据
        var _this = this;
        var index1 = curDesk.index;
        var index2 = toDesk.index;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == obj) {
                arr.splice(i, 1);
            }
        }
        toArr.splice(toArr.length - 1, 0, obj);
        for (var i = 0; i < arr.length; i++) {
            arr[i].index = i;
            _this.addIconEvent(index1, i);
        }
        for (var i = 0; i < toArr.length; i++) {
            toArr[i].index = i;
            _this.addIconEvent(index2, i);
        }
        toDesk.appendChild(obj);
        _this.arrangeIcon(_this.argMent);
    },
    delIcon: function(obj, desktopIndex) { //删除应用
        var _this = this;

        fnMove(obj, { opacity: 0 }, function() {
            // console.log('fnMove');
            _this.aDesk[desktopIndex].removeChild(obj);
            _this.arrangeIcon(_this.argMent);
        })
        for (var i = 0; i < this.aDeskIcon[desktopIndex].length; i++) { //在数组中删除图标
            if (this.aDeskIcon[desktopIndex][i] == obj) {
                this.aDeskIcon[desktopIndex].splice(i, 1);
                if (this.aDeskIcon[desktopIndex].length == 0 && this.aDeskCount != 1) { //判断桌面是否还有图标
                    if (this.aDeskCount != 1 && this.aDeskCount != 2) {
                        this.decreaseDesk(desktopIndex);
                        var removeIndex = document.getElementById('desktopIndex');
                        removeIndex.removeChild(removeIndex.lastChild); //删除导航栏最后一个圆点
                        if ((desktopIndex + 1) == this.aDeskCount) {
                            this.checkDesk(this.aDeskCount - 2)
                        } else {
                            this.checkDesk(desktopIndex);
                        }
                    } else if (this.aDeskCount == 2) {
                        this.decreaseDesk(desktopIndex);
                        var removeIndex = document.getElementById('desktopIndex');
                        removeIndex.style.display = 'none';
                        this.checkDesk(0);
                    }
                    this.aDeskCount--;
                } else {}
            }
        }
        for (var i = 0; i < this.aDeskIcon[desktopIndex].length; i++) { //桌面图标索引重新赋值
            this.aDeskIcon[desktopIndex][i].index = i;
        }
        this.iconMenu[desktopIndex].style.display = 'none';
    },
    decreaseDesk: function(index) { //把后面桌面的图标前移
        if (index != (this.aDeskCount - 1)) {
            for (var i = index; i < this.aDeskCount - 1; i++) {
                var curDesk = document.getElementById('desk' + (i + 2));
                while (curDesk.hasChildNodes()) {
                    this.moveIcon(curDesk.firstChild, this.aDeskIcon[i + 1], this.aDeskIcon[i], this.aDesk[i + 1], this.aDesk[i]);
                }
            }
        } else {
            return;
        }
    },
    deskContextmenu: function() { //桌面右键菜单
        var _this = this;
        if (!this.deskMenu) {
            this.deskMenu = this.contextMenu(this.oDesk, this.deskMenuContent, this.oDesk.id, 1);
            this.deskMenuList1[1].className = this.className.typeChecked;
            this.deskMenuList2[0].className = this.className.typeChecked;
        } else {
            this.deskMenu.style.display = 'block';
        }
        if (_this.addIcon[_this.iNowDesk - 1]) {
            _this.addIcon[_this.iNowDesk - 1].style.display = 'none';
        }
        this.deskMenu.onclick = function(ev) {
            var ev = ev || event;
            ev.cancelBubble = true;
        };
        this.deskMenu.style.zIndex = zh_winzIndex;
        this.deskMenuList1[0].onclick = function() {
            _this.iconType(0, _this.className.minIcon, 60);
        };
        this.deskMenuList1[1].onclick = function() {
            _this.iconType(1, _this.className.icon, 100);
        };
        this.deskMenuList1[2].onclick = function() {
            _this.iconType(2, _this.className.icon, 200);
        };

        this.deskMenuList2[0].onclick = function() {
            _this.argType(0, 'row');
        };
        this.deskMenuList2[1].onclick = function() {
            _this.argType(1, 'col');
        };
        this.deskMenuList2[2].onclick = function() {
            _this.argType(2, ' ');
        };
        this.deskMenuMain[2].onclick = function() {
            _this.reLoad();
        };
        this.deskMenuMain[3].onclick = function() {
            _this.showDesk();
        };
        this.deskMenuMain[4].onclick = function() {
            _this.setBg()
        };
        this.deskMenuMain[5].onclick = function() {
            _this.fullScreen();
        }
        this.deskMenuMain[6].onclick = function() {
            _this.deskMenu.style.display = 'none';
        }
    },
    iconType: function(num, typeClass, size) { //查看
        for (var i = 0; i < this.deskMenuList1.length; i++) {
            this.deskMenuList1[i].className = '';
        }
        this.deskMenuList1[num].className = this.className.typeChecked;
        this.deskMenu.style.display = 'none';
        for (var i = 0; i < this.aDesk.length; i++) {
            for (var j = 0; j < this.aDeskIcon[i].length; j++) {
                this.aDeskIcon[i][j].className = typeClass;
                this.aDeskIcon[i][j].style.height = size + 'px';
                this.aDeskIcon[i][j].style.width = size + 'px';
                this.arrangeIcon(this.argMent);
            }
        }
    },
    argType: function(num, type) { //排列方式
        for (var i = 0; i < this.deskMenuList2.length; i++) {
            this.deskMenuList2[i].className = '';
        }
        this.deskMenuList2[num].className = this.className.typeChecked;
        this.deskMenu.style.display = 'none';
        this.argMent = type;
        this.arrangeIcon(this.argMent);
    },
    showDesk: function() { //显示桌面
        var aWindow = getByClass(this.oDesk, this.className.thisWindow);
        var aTask = getByClass(this.oTask, this.className.taskMenu);
        for (var i = 0; i < aWindow.length; i++) {
            aWindow[i].style.display = 'none';
            fnMove(aWindow[i], { opacity: 0 })
        }
        for (var i = 0; i < aTask.length; i++) {
            fnMove(aTask[i], { width: 90, opacity: 100 });
            aTask[i].style.display = 'block';
        }
        $('#bgWindow').style.display = 'none';
        this.deskMenu.style.display = 'none';
    },
    reLoad: function() { //刷新
        for (var i = 0; i < this.aDeskIcon[this.iNowDesk - 1].length; i++) {
            this.aDeskIcon[this.iNowDesk - 1][i].style.opacity = 0;
            fnMove(this.aDeskIcon[this.iNowDesk - 1][i], { opacity: 100 });
            this.arrangeIcon(this.argMent);
        }
        this.deskMenu.style.display = 'none';
    },
    setBg: function() { //主题设置
        setBg(this.oBg);
        this.deskMenu.style.display = 'none';
    },
    fullScreen: function() { //全屏显示
        var docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        this.deskMenu.style.display = 'none';
    }
};

/*------------------------------------------------APP---------------------------------------*/

function createIcon(winParent, appParent, oTask, json) { //APP
    this.winParent = winParent;
    this.appParent = appParent;
    this.oTask = oTask;
    this.json = json;
    this.iconId = json.id;
    this.imgSrc = json.src;
    this.title = json.title;
    this.isOpen = json.isOpen || 'yes';
    this.iconClass = json.className || zh_className;
    this.isClick = false;
    this.iconPos = json.pos || 'desk';
    this.isDel = json.isDel || true;
    this.zIndex = 0;
}
createIcon.prototype = { //初始化
    init: function() {
        var _this = this;
        this.create();
        this.setAppzIndex();
        this.drag(_this.icon);
    },
    create: function() { //创建app
        this.icon = document.createElement('div');
        this.iconImg = document.createElement('div');
        this.img = document.createElement('img');
        this.icontitle = document.createElement('a');
        this.icoDelete = document.createElement('div');

        this.iconImg.title = this.title;
        this.img.src = this.imgSrc;
        this.icontitle.innerHTML = this.title;

        this.icon.json = this.json;
        this.icon.isOpen = this.isOpen;
        this.icon.id = this.appParent.id + this.iconId;
        this.icon.setAttribute('isClick', this.isClick)
        this.icon.className = this.iconClass.icon;
        this.iconImg.className = this.iconClass.iconImg;
        this.icontitle.className = this.iconClass.icontitle;
        this.icoDelete.className = this.iconClass.iconDelete;
        if (this.iconPos == 'left') {
            this.icon.className = this.iconClass.leftIcon;
            this.iconImg.className = this.iconClass.leftIconImg;
        }

        this.iconImg.appendChild(this.img);
        this.icon.appendChild(this.iconImg);
        if (this.iconPos == 'desk') {
            this.icon.appendChild(this.icontitle);
        }
        this.icon.appendChild(this.icoDelete);
        this.appParent.appendChild(this.icon);
    },
    setAppzIndex: function() { //改变app层级
        setStyle(this.icon, { 'z-index': zh_appzIndex++ });
        this.zIndex = zh_appzIndex;
    },
    drag: function(obj) { //APP拖拽;
        var _this = this;
        obj.onmousedown = function(ev) {
            var oDate1 = new Date();
            var time1 = oDate1.getTime();
            _this.setAppzIndex();
            var ev = ev || event;
            var X = ev.clientX;
            var Y = ev.clientY;
            var disX = X - parseInt(getStyle(_this.icon, 'left'));
            var disY = Y - parseInt(getStyle(_this.icon, 'top'));
            if (obj.setCapture) {
                obj.setCapture();
            }
            document.onmousemove = function(ev) {
                var ev = ev || event;
                var iT = ev.clientY - disY;
                var iL = ev.clientX - disX;
                if (iT <= 0) {
                    iT = 0;
                };
                if (iT >= (viewHeight() - obj.offsetHeight)) {
                    iT = (viewHeight() - obj.offsetHeight);
                }
                if (iL <= 0) {
                    iL = 0;
                };
                if (iL >= (viewWidth() - obj.offsetWidth)) {
                    iL = (viewWidth() - obj.offsetWidth);
                }
                if (_this.iconPos == 'desk' && obj.isOpen == 'yes') {
                    _this.icon.style.left = iL + 'px';
                    _this.icon.style.top = iT + 'px';
                }
            }
            document.onmouseup = function(ev) {
                var ev = ev || event;
                if (ev.clientX == X && ev.clientY == Y) {
                    if (!$('#' + _this.appParent.id + 'window' + _this.iconId)) { /*一个app只允许打开一个窗口*/
                        obj.setAttribute('isClick', false);
                    }
                    if (obj.getAttribute('isClick') == 'false' && obj.isOpen == 'yes') {
                        obj.setAttribute('isClick', true);
                        obj.onclick = function() {
                            new newWindow(_this.winParent, _this.oTask, _this.appParent.id + 'window' + _this.iconId, _this.json).init();
                        };
                    } else {
                        if (obj.isOpen == 'yes') {
                            obj.onclick = null;
                        }

                    }
                } else {
                    if (_this.isOpen == 'yes') {
                        obj.onclick = null;
                    }
                }
                if (obj.releaseCapture) {
                    obj.releaseCapture();
                }
                document.onmouseup = document.onmousemove = null;
            }
            ev.cancelBubble = true;
            return false;
        }
    }
};

function newDialog() {
    var jn = new Object();
    jn["id"] = "icon1";
    jn["src"] = "CREG5/images/CSDN.jpg";
    jn["title"] = "My Tesy";
    jn["webSrc"] = "https://www.csdn.net/";
    alert(JSON.stringify(jn));
    new newWindow($('#desktop'), $('#taskIcon'), 'desk1windowicon1', jn).init();
};

/*---------------------------------------------window--------------------------------------*/

function newWindow(oParent, oTask, id, json) {
    this.oParent = oParent;
    this.oTask = oTask;
    this.windowId = id;
    this.windowClass = json.className || zh_className;
    this.timer1 = null; //关闭时等待动画效果完成
    this.timer2 = null; //检测是否为当前窗口
    this.isMax = json.isMax || 'mid'; //窗口状态其值为min,mid,max;
    this.zIndex = 0;
    this.iLeft = json.iLeft || 300;
    this.iTop = json.iTop = (json.iTop <= 20 ? 20 : json.iTop) || 51; //窗口top值
    this.iWidth = json.iWidth || 950;
    this.iHeight = json.iHeight || 560;
    this.webSrc = json.webSrc;
    this.title = json.title;
    this.minWidth = json.minWidth || 250;
    this.minHeight = json.minHeight || 50;
};
newWindow.prototype = {
    init: function() { //初始化窗口;
        var _this = this;
        this.createWindow();
        this.createTask();
        this.show();
        this.currentWindow();
        this.events();
        this.timer2 = setInterval(function() {
            _this.checkCurWindow();
        }, 30);
    },
    createWindow: function() { //创建窗口;
        zh_windowCount += 50;
        this.thisWindow = document.createElement('div');
        this.windowContainer = document.createElement('div');
        this.windowMenu = document.createElement('div');
        this.windowMenuContent = document.createElement('div');
        this.windowControl = document.createElement('div');
        this.windowMinimize = document.createElement('div');
        this.windowMaximize = document.createElement('div');
        this.windowClose = document.createElement('div');
        this.windowContent = document.createElement('div');
        this.windowFrame = document.createElement('iframe');
        this.contentMask = document.createElement('div');
        this.windowHomepage = document.createElement('div'); //主页
        this.windowForward = document.createElement('div'); //前进
        this.windowBackward = document.createElement('div'); //后退
        this.windowRefresh = document.createElement('div'); //刷新

        this.windowMenuContent.innerHTML = this.title;

        this.windowFrame.src = this.webSrc;

        this.thisWindow.innerHTML =
            '<div class=' + this.windowClass.windowTopResize + '></div>' +
            '<div class=' + this.windowClass.windowLeftResize + '></div>' +
            '<div class=' + this.windowClass.windowRightResize + '></div>' +
            '<div class=' + this.windowClass.windowBottomResize + '></div>' +
            '<div class=' + this.windowClass.windowTlResize + '></div>' +
            '<div class=' + this.windowClass.windowTrResize + '></div>' +
            '<div class=' + this.windowClass.windowBrResize + '></div>' +
            '<div class=' + this.windowClass.windowBlResize + '></div>';

        this.thisWindow.id = this.windowId;
        this.windowFrame.id = this.windowId + 'iframe';

        this.thisWindow.className = this.windowClass.thisWindow;
        this.windowContainer.className = this.windowClass.windowContainer;
        this.windowMenu.className = this.windowClass.windowMenu;
        this.windowMenuContent.className = this.windowClass.windowMenuContent;
        this.windowControl.className = this.windowClass.windowControl;
        this.windowMinimize.className = this.windowClass.windowMinimize;
        this.windowMaximize.className = this.windowClass.windowMaximize;
        this.windowClose.className = this.windowClass.windowClose;
        this.windowHomepage.className = this.windowClass.windowHomepage;
        this.windowForward.className = this.windowClass.windowForward;
        this.windowBackward.className = this.windowClass.windowBackward;
        this.windowRefresh.className = this.windowClass.windowRefresh;
        this.windowContent.className = this.windowClass.windowContent;
        this.windowFrame.className = this.windowClass.windowFrame;
        this.contentMask.className = this.windowClass.contentMask;

        this.windowControl.appendChild(this.windowRefresh);
        this.windowControl.appendChild(this.windowBackward);
        this.windowControl.appendChild(this.windowForward);
        this.windowControl.appendChild(this.windowHomepage);
        this.windowControl.appendChild(this.windowMinimize);
        this.windowControl.appendChild(this.windowMaximize);
        this.windowControl.appendChild(this.windowClose);
        this.windowMenu.appendChild(this.windowMenuContent);
        this.windowMenu.appendChild(this.windowControl);
        this.windowContainer.appendChild(this.windowMenu);
        this.windowContent.appendChild(this.contentMask);
        this.windowContent.appendChild(this.windowFrame);
        this.windowContainer.appendChild(this.windowContent);
        this.thisWindow.appendChild(this.windowContainer);

        this.oParent.appendChild(this.thisWindow);
    },
    events: function() { //事件
        var _this = this;

        this.drag(this.windowMenu);

        this.thisWindow.onmousewheel = function(ev) {
            var ev = ev || event;
            ev.cancelBubble = true;
            return false;
        };

        if (this.thisWindow.addEventListener) {
            this.thisWindow.addEventListener('DOMMouseScroll',
                function(ev) {
                    var ev = ev || event;
                    if (ev.preventDefalut) {
                        ev.preventDefalut();
                    }
                    return false;
                }, false);
        }
        this.resizeWindow();

        /**************************标题栏事件*************************/

        addEvent(this.windowMinimize, 'click', function() { //最小化按钮
            _this.minimize();
        });
        addEvent(this.windowMaximize, 'click', function() { //放大缩小按钮
            if (_this.isMax == 'mid') {
                _this.maximize();
            } else if (_this.isMax == 'max') {
                _this.narrow();
            }
            //_this.setWindowzIndex();
        });
        addEvent(this.windowClose, 'click', function() { //关闭按钮
            _this.closeWindow();
        });
        addEvent(this.windowHomepage, 'click', function() { //首页按钮
            _this.toHomepage();
        });
        addEvent(this.windowForward, 'click', function() { //前进按钮
            _this.forwardWindow();
        });
        addEvent(this.windowBackward, 'click', function() { //后退按钮
            _this.backwardWindow();
        });
        addEvent(this.windowRefresh, 'click', function() { //刷新按钮
            // alert('Refresh click!');
            _this.refreshWindow();
            // document.getElementById(this.windowId).contentWindow.location.reload(true);
        });
        addEvent(this.windowMenu, 'dblclick', function() { //双击
            if (_this.isMax == 'mid') {
                _this.maximize();
            } else if (_this.isMax == 'max') {
                _this.narrow();
            }
            //_this.setWindowzIndex();
        });
        /**************************任务栏事件*************************/

        addEvent(this.taskMenuMax, 'click', function() { //放大缩小按钮
            if (_this.isMax == 'mid') {
                _this.narrow();
            } else if (_this.isMax == 'max') {
                _this.maximize();
            }
            fnMove(_this.taskMenu, { 'opacity': 0, 'width': 0 });
            _this.setWindowzIndex();
            _this.currentWindow();
            _this.timer2 = setInterval(function() {
                _this.checkCurWindow();
            }, 30)
        });
        addEvent(this.taskMenuClose, 'click', function() { //关闭按钮
            _this.closeWindow();
        });
        addEvent(this.taskMenu, 'mouseover', function() {
            fnMove(_this.taskMenuWrap, { 'top': -40 });
        });
        addEvent(this.taskMenu, 'mouseout', function() {
            fnMove(_this.taskMenuWrap, { 'top': 5 });
        });


        /**************************窗口层级*************************/
        this.windowMenu.oncontextmenu = function(ev) {
            var ev = ev || event;
            ev.cancelBubble = true;
            return false;
        };
        addEvent(this.windowMenu, 'mousedown', function() {
            _this.setWindowzIndex();
            _this.clearMask();
            _this.currentWindow();
            _this.timer2 = setInterval(function() {
                _this.checkCurWindow();
            }, 30)
        });
        addEvent(this.contentMask, 'mousedown', function() {
            _this.setWindowzIndex();
            _this.clearMask();
            _this.currentWindow();
            _this.timer2 = setInterval(function() {
                _this.checkCurWindow();
            }, 30)
        });
        addEvent(this.windowFrame, 'mouseover', function() {
            if (_this.zIndex != zh_winzIndex) {
                _this.addMask();
            } else {
                _this.clearMask();
            }
        });
    },
    createTask: function() { //创建任务栏图标;
        this.taskMenu = document.createElement('div');
        this.taskMenuWrap = document.createElement('div');
        this.taskMenuCon = document.createElement('div');
        this.taskMenuMax = document.createElement('div');
        this.taskMenuClose = document.createElement('div');
        this.taskMenuHomePage = document.createElement('div');

        this.taskMenuCon.innerHTML = this.title;

        this.taskMenu.className = this.windowClass.taskMenu;
        this.taskMenuWrap.className = this.windowClass.taskMenuWrap;
        this.taskMenuCon.className = this.windowClass.taskMenuCon;
        this.taskMenuMax.className = this.windowClass.taskMax;
        this.taskMenuClose.className = this.windowClass.taskClose;
        this.taskMenuHomePage.className = this.windowClass.taskMenuHomePage;

        this.taskMenuWrap.appendChild(this.taskMenuCon);
        this.taskMenuWrap.appendChild(this.taskMenuMax);
        this.taskMenuWrap.appendChild(this.taskMenuClose);
        this.taskMenuWrap.appendChild(this.taskMenuHomePage);
        this.taskMenu.appendChild(this.taskMenuWrap);
        if (this.oTask) {
            this.oTask.appendChild(this.taskMenu);
        }
    },
    show: function() { //显示窗口
        var left = parseInt(this.iLeft) + (zh_windowCount - 50) % 150;
        var top = parseInt(this.iTop) + (zh_windowCount - 50) % 150;
        fnMove(this.thisWindow, { 'opacity': 100 });
        setStyle(this.thisWindow, { 'left': left + 'px', 'top': top + 'px', 'width': this.iWidth + 'px', 'height': this.iHeight + 'px' });
        this.iLeft = left;
        this.iTop = top;
        this.setWindowzIndex();
    },
    setWindowzIndex: function() { //改变window层级
        setStyle(this.thisWindow, { 'z-index': zh_winzIndex++ });
        this.zIndex = zh_winzIndex;

    },
    currentWindow: function() { //窗口设置为激活窗口
        addClass(this.windowMenu, this.windowClass.windowMenuactive);
        this.windowFrame.focus();
    },
    cancelCurWindow: function() { //取消窗口激活
        removeClass(this.windowMenu, this.windowClass.windowMenuactive);
    },
    checkCurWindow: function() { //检测是否为当前窗口
        if (this.zIndex != zh_winzIndex) {
            this.cancelCurWindow();
            clearInterval(this.timer2);
        }
    },
    addMask: function() { //增加content遮罩
        setStyle(this.contentMask, { 'display': 'block' });
    },
    clearMask: function() { //清除content遮罩
        setStyle(this.contentMask, { 'display': 'none' });
    },
    minimize: function() { //窗口最小化;
        var _this = this;
        if (this.isMax == 'mid') {
            this.iHeight = this.thisWindow.offsetHeight;
            this.iLeft = this.thisWindow.offsetLeft;
            this.iTop = this.thisWindow.offsetTop;
            this.iWidth = this.thisWindow.offsetWidth;
        }
        fnMove(_this.taskMenu, { 'opacity': 100, 'width': 100 });
        fnMove(_this.thisWindow, { 'opacity': 0, 'height': 0, 'top': viewHeight() });
        this.isMax = this.isMax;
        _this.taskMenu.style.display = 'block';
        setTimeout(function() {
            _this.thisWindow.style.display = 'none';
        }, 500)

    },
    maximize: function() { //窗口最大化;
        var _this = this;
        if (this.isMax == 'mid') {
            this.iHeight = this.thisWindow.offsetHeight;

            this.iLeft = this.thisWindow.offsetLeft;
            this.iTop = this.thisWindow.offsetTop;
            this.iWidth = this.thisWindow.offsetWidth;
        }
        fnMove(_this.thisWindow, { 'opacity': 100, 'height': viewHeight() - 31, 'width': viewWidth(), 'left': 0, 'top': 31 });
        this.isMax = 'max';
        this.windowMaximize.className = this.windowClass.windowMax;
        _this.thisWindow.style.display = 'block';
    },
    narrow: function() { //缩放窗口;
        var _this = this;
        fnMove(_this.thisWindow, { 'opacity': 100, 'top': this.iTop, 'left': this.iLeft, 'height': this.iHeight, 'width': this.iWidth });
        this.isMax = 'mid';
        this.windowMaximize.className = this.windowClass.windowMaximize;
        _this.thisWindow.style.display = 'block';
        setTimeout(function() {
            _this.taskMenu.style.display = 'none';
        }, 500);
    },
    closeWindow: function() { //关闭窗口;
        var _this = this;
        zh_windowCount -= 50;
        fnMove(_this.taskMenu, { 'opacity': 0, 'width': 0 });
        fnMove(_this.thisWindow, { 'opacity': 0, 'height': 0 });
        this.timer1 = setTimeout(function() {
            _this.oParent.removeChild(_this.thisWindow);
            _this.oTask.removeChild(_this.taskMenu);
        }, 500);
        setTimeout(function() {
            _this.taskMenu.style.display = 'none';
        }, 500);
    },
    refreshWindow: function() { //刷新窗口
        var _this = this;
        iframeId = _this.windowId + 'iframe';
        document.getElementById(iframeId).contentWindow.location.reload(true);
        // console.log('123');
    },
    toHomepage: function() { //返回首页
        var _this = this;
        iframeId = _this.windowId + 'iframe';
        document.getElementById(iframeId).src = _this.windowFrame.src;
    },
    forwardWindow: function() { //页面前进
        var _this = this;
        iframeId = _this.windowId + 'iframe';
        document.getElementById(iframeId).contentWindow.history.go(1);
    },
    backwardWindow: function() { //页面后退
        var _this = this;
        iframeId = _this.windowId + 'iframe';
        document.getElementById(iframeId).contentWindow.history.go(-1);
    },
    resizeWindow: function() { //改变窗口大小
        var _this = this;
        this.thisWindow.onmousedown = function(ev) {
            if (_this.isMax != 'max') {
                _this.addMask();
                var ev = ev || event;
                var oPos = '',
                    iX = ev.clientX,
                    iY = ev.clientY + 31,
                    iLeft = _this.thisWindow.offsetLeft,
                    iTop = _this.thisWindow.offsetTop,
                    iWidth = _this.thisWindow.offsetWidth,
                    iHeight = _this.thisWindow.offsetHeight,
                    iRight = iLeft + iWidth,
                    iBottom = iTop + iHeight + 31;

                /*-------------以下判断为获得鼠标在窗口中的位置---------------*/
                /*-------------l:左，r:右，t:上，b:下---------------*/

                if (iX >= iLeft - 5 && iX <= iLeft + 5) {
                    oPos = 'l';
                }
                if (iX >= iRight - 5 && iX <= iRight + 5) {
                    oPos = 'r';
                }
                if (iY >= iTop - 5 && iY <= iTop + 5) {
                    oPos = 't';
                }
                if (iY >= iBottom - 5 && iY <= iBottom + 5) {
                    oPos = 'b';
                }
                if ((iX >= iLeft - 8 && iX <= iLeft + 8) && (iY >= iTop - 8 && iY <= iTop + 8)) {
                    oPos = 'tl';
                }
                if ((iX >= iRight - 8 && iX <= iRight + 8) && (iY >= iTop - 8 && iY <= iTop + 8)) {
                    oPos = 'tr';
                }
                if ((iX >= iLeft - 8 && iX <= iLeft + 8) && (iY >= iBottom - 8 && iY <= iBottom + 8)) {
                    oPos = 'bl';
                }
                if ((iX >= iRight - 8 && iX <= iRight + 8) && (iY >= iBottom - 8 && iY <= iBottom + 8)) {
                    oPos = 'br';
                }

                document.onmousemove = function(ev) {
                    var ev = ev || event,
                        iW = iX - ev.clientX,
                        iH = iY - ev.clientY - 31,
                        left = iLeft,
                        top = iTop,
                        width = iWidth,
                        height = iHeight;

                    /*-------以下所有判断，全为限制窗口活动范围.-------*/

                    switch (oPos) {
                        case 'l':
                            left = (iLeft - iW);
                            width = (iWidth + iW);
                            if (left <= 0) {
                                left = 0;
                                width = iLeft + iWidth;
                            }
                            if (width <= _this.minWidth) {
                                width = _this.minWidth;
                                left = iLeft + iWidth - _this.minWidth;
                            }
                            break;
                        case 't':
                            top = (iTop - iH);
                            height = (iHeight + iH);
                            if (top <= 31) {
                                top = 31;
                                height = iHeight + iTop - top;
                            }
                            if (height <= _this.minHeight) {
                                height = _this.minHeight;
                                top = iTop + iHeight - _this.minHeight;
                            }
                            break;
                        case 'b':
                            height = (iHeight - iH);
                            if (height <= _this.minHeight) {
                                height = _this.minHeight;
                            }
                            break;
                        case 'r':
                            width = (iWidth - iW);
                            if (width <= _this.minWidth) {
                                width = _this.minWidth;
                            }
                            break;
                        case 'tl':
                            left = (iLeft - iW);
                            width = (iWidth + iW);
                            top = (iTop - iH)
                            height = (iHeight + iH);
                            if (left <= 0) {
                                left = 0;
                                width = iLeft + iWidth;
                            }
                            if (top <= 31) {
                                top = 31;
                                height = iHeight + iTop - top;
                            }
                            if (width <= _this.minWidth) {
                                width = _this.minWidth;
                                left = iLeft + iWidth - _this.minWidth;
                            }
                            if (height <= _this.minHeight) {
                                height = _this.minHeight;
                                top = iTop + iHeight - _this.minHeight;
                            }
                            break;
                        case 'tr':
                            top = (iTop - iH)
                            height = (iHeight + iH);
                            width = (iWidth - iW);
                            if (top <= 31) {
                                top = 31;
                                height = iHeight + iTop - top;
                            }
                            if (height <= _this.minHeight) {
                                height = _this.minHeight;
                                top = iTop + iHeight - _this.minHeight;
                            }
                            if (width <= _this.minWidth) {
                                width = _this.minWidth;
                            }
                            break;
                        case 'bl':
                            left = (iLeft - iW);
                            width = (iWidth + iW);
                            height = (iHeight - iH);
                            if (left <= 0) {
                                left = 0;
                                width = iLeft + iWidth;
                            }
                            if (width <= _this.minWidth) {
                                width = _this.minWidth;
                                left = iLeft + iWidth - _this.minWidth;
                            }
                            if (height <= _this.minHeight) {
                                height = _this.minHeight;
                            }
                            break;
                        case 'br':
                            height = (iHeight - iH);
                            width = (iWidth - iW);
                            if (height <= _this.minHeight) {
                                height = _this.minHeight;
                            }
                            if (width <= _this.minWidth) {
                                width = _this.minWidth;
                            }
                            break;
                    }
                    if (width >= viewWidth()) {
                        width = viewWidth();
                    }
                    if (height >= viewHeight() - 31) {
                        height = viewHeight() - 31;
                    }
                    _this.thisWindow.style.left = left + 'px';
                    _this.thisWindow.style.top = top + 'px';
                    _this.thisWindow.style.width = width + 'px';
                    _this.thisWindow.style.height = height + 'px';
                    _this.iHeight = _this.thisWindow.offsetHeight;
                    _this.iLeft = _this.thisWindow.offsetLeft;
                    _this.iTop = _this.thisWindow.offsetTop;
                    _this.iWidth = _this.thisWindow.offsetWidth;
                };
                document.onmouseup = function() {
                    document.onmousemove = document.onmouseup = null;
                    _this.clearMask();
                };
            };
            return false;
        }
    },
    drag: function(obj) { //窗口拖拽;
        var _this = this;
        obj.onmousedown = function(ev) {
            var ev = ev || event;
            var flag = false;
            var disX = ev.clientX - parseInt(getStyle(_this.thisWindow, 'left'));
            var disY = ev.clientY - parseInt(getStyle(_this.thisWindow, 'top'));
            if (obj.setCapture) {
                obj.setCapture();
            }
            document.onmousemove = function(ev) {

                _this.addMask();
                var ev = ev || event;
                var iT = ev.clientY - disY;
                var iL = ev.clientX - disX;
                if (iT <= 31) {
                    iT = 31;
                };
                if (iT >= (viewHeight() + 31 - obj.offsetHeight)) {
                    iT = (viewHeight() + 31 - obj.offsetHeight);
                }
                if (_this.isMax == 'max' && flag == false) {
                    iT = 31;
                    iL = 0;
                }
                _this.thisWindow.style.left = iL + 'px';
                _this.thisWindow.style.top = iT + 'px';
                _this.iHeight = _this.thisWindow.offsetHeight;
                _this.iLeft = _this.thisWindow.offsetLeft;
            }
            document.onmouseup = function() {
                document.onmouseup = document.onmousemove = null;
                _this.clearMask();
                if (obj.releaseCapture) {
                    obj.releaseCapture();
                }
            }
            ev.cancelBubble = true;
            return false;
        }
    }
}

function setBg(oBg) {
    var oMenu = $('#bgWindowMenu');
    var oClose = $('#bgclose');
    var bgImg1 = $('#deskbg1');
    var aImg = $('<img>', oBg);
    var iNow = 0;

    fnDrag(oMenu, oBg);
    if (getStyle(oBg, 'display') == 'none') {
        oBg.style.display = 'block';
        oBg.style.left = '300px';
        oBg.style.top = '150px';
        oBg.style.zIndex = zh_winzIndex++;
    } else {
        oBg.style.display = 'none';
    }
    oClose.onclick = function(ev) {
        var ev = ev || event;
        oBg.style.display = 'none';
        ev.cancelBubble = true;
        return false;
    };
    for (var i = 0; i < aImg.length; i++) {
        aImg[i].onclick = function() {
            bgImg1.src = this.getAttribute('src');
        };
    }
}

function fnDrag(obj1, obj2) {
    obj1.onmousedown = function(ev) {
        var ev = ev || event;
        var disX = ev.clientX - obj2.offsetLeft;
        var disY = ev.clientY - obj2.offsetTop;
        if (obj1.setCapture) {
            obj1.setCapture();
        }
        obj2.style.zIndex = zh_winzIndex++;
        document.onmousemove = function(ev) {
            var ev = ev || event;
            var iL = ev.clientX - disX;
            var iT = ev.clientY - disY;
            if (iT < 30) {
                iT = 30;
            }
            if (iT > (viewHeight())) {
                iT = viewHeight();
            }
            obj2.style.left = iL + 'px';
            obj2.style.top = iT + 'px';
            document.onmouseup = function() {
                document.onmousemove = document.onmouseup = null;
                if (obj1.releaseCapture) {
                    obj1.releaseCapture();
                }
            }
        };
        ev.cancelBubble = true;
        return false;
    };
}

function isSreen() {
    addEvent(window, 'change', clear);
    addEvent(window, 'resize', clear);
    addEvent(document, 'keydown', clear);
    addEvent(document, 'mousedown', clear);
    addEvent(document, 'mousemove', clear);
    addEvent(document, 'mousewheel', clear);
    document.addEventListener('DOMMouseScroll', clear, false);
    return false;
}

window.onload = function() {
    if (browInfo() == 'IE8' || browInfo() == 'IE7' || browInfo() == 'IE6') {
        alert('本桌面不支持' + browInfo());
        return;
    }
    //$('#bgid').src = 'desktop/images/background.jpg';
    new desk().init();
<<<<<<< HEAD
    $("#desk1").hide();
=======
>>>>>>> ad421a088999ce5246399bec5f82c2d5953463d6
};