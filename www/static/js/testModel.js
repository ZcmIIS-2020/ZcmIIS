layui.config({
    base: '../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'layer'], function () {
    let $ = layui.$;
    let layer = layui.layer;
    let container, controls, camera, scene, renderer, labelRenderer;  //容器，镜头，控制器，场景，渲染器，文字渲染器
    let clock = new THREE.Clock();
    let modeTag = 0; //模式标识，0为旋转模式，1为第一人称模式，默认为旋转模式

    let path = '../../model/slxq/slxq'; //神龙溪桥
    // let path = '../../model/rjwsd/rjwsd'; //荣家湾隧道
    // let path = '../../model/xswsd/xswsd'; //香树湾隧道

    // 默认显示
    $('#description').html('已切换至侧视图');
    if (WEBGL.isWebGLAvailable()) {
        initSideView();     //神龙溪桥
        // initVerticalView(); //荣家湾隧道
        // initVerticalView2();   //香树湾隧道
        animate();
    } else {
        layer.msg('当前浏览器不支持');
    }

    //侧视图
    $('#sideView').click(function () {
        modeTag = 0;
        if (WEBGL.isWebGLAvailable()) {
            $('#model').empty();
            clearScene(scene.children);
            THREE.Cache.clear();
            initSideView();
            animate();
            layer.msg('已切换至侧视图');
        } else {
            layer.msg('当前浏览器不支持');
        }
    });

    //俯视图
    $('#verticalView').click(function () {
        modeTag = 0;
        if (WEBGL.isWebGLAvailable()) {
            $('#model').empty();
            clearScene(scene.children);
            THREE.Cache.clear();
            initVerticalView();
            animate();
            layer.msg('已切换至俯视图');
        } else {
            layer.msg('当前浏览器不支持');
        }
    });

    //重置镜头
    $('#restore').click(function () {
        $('#model').empty();
        clearScene(scene.children);
        if (modeTag === 0) {
            initTrackball();
            animate();
        } else if (modeTag === 1) {
            initFirstPerson();
            animate();
        }
    });

    //初始化侧视图（神龙溪桥）
    function initSideView() {

        //镜头
        // camera = new THREE.PerspectiveCamera(45, 1100 / 550, 1000, 200000);  //创建一个透视相机，设置相机视角45度，最远能看200000，最近能看1000
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1000, 200000);
        camera.position.set(0, 0, 45000);  //设置相机位置
        camera.lookAt(50000,10000,10000);

        //控制器
        controls = new THREE.OrbitControls(camera);
        controls.rotateSpeed = 1;       //设置旋转速度
        controls.enableDamping = false;  // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableZoom = false;     //是否可以缩放
        controls.autoRotate = false;     //是否自动旋转
        controls.minDistance = 1000;     //设置相机距离原点的最近距离
        controls.maxDistance = 50000;   //设置相机距离原点的最远距离
        controls.enablePan = true;      //是否开启右键拖拽

        //场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeeeeee);  // 设置场景背景色
        // let axesHelper = new THREE.AxesHelper( 50000 );
        // scene.add( axesHelper );

        //灯光
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);  //创建一个环境灯光
        scene.add(ambientLight);
        let pointLight = new THREE.PointLight(0xffffff, 0.8); //创建一个点灯光
        camera.add(pointLight);  //给模型添加灯光
        scene.add(camera);  //把视角放入环境

        // 添加操作器
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

        // 加载模型
        let mtlLoader = new THREE.MTLLoader();  //mtl文件加载器
        mtlLoader.load(path + '.mtl', function (materials) {

            // materials.preload();

            let objLoader = new THREE.OBJLoader();  //obj文件加载器
            objLoader.setMaterials(materials);
            objLoader.load(path + '.obj', function (object) {

                object.scale.multiplyScalar(1);  // 缩放模型大小
                object.translateX(9000);//模型向X轴正方向移动

                // 遍历模型所有子部分
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {

                        console.log(child.name);

                        if (child.name.indexOf("Box019") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '1号梁' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-28000, 10000, 0);
                            child.add(label);
                        }

                        if (child.name.indexOf("Box018") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '2号梁' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-11000, 2000, 0);
                            child.add(label);
                        }

                        if (child.name.indexOf("Box006") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '3号梁' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(6000, 10000, 0);
                            child.add(label);
                        }

                        if (child.name.indexOf("2qiaodui05") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '左墩' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-28000, 0, 0);
                            child.add(label);
                        }

                        if (child.name.indexOf("3qiaodui05") == 0) {
                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '右墩' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(5000, 0, 0);
                            child.add(label);
                        }

                        if (child.name.indexOf("1qiaoduidz024") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '1号承台' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-40000, 5000, 0);
                            child.add(label);

                        }

                        if (child.name.indexOf("2qiaoduidz014") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '2号承台' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-16000, -5000, 0);
                            child.add(label);

                        }

                        if (child.name.indexOf("3qiaoduidz04") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '3号承台' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-6000, -5000, 0);
                            child.add(label);
                        }

                        if (child.name.indexOf("4qiaoduidz034") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '4号承台' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(18000, 5000, 0);
                            child.add(label);

                        }

                        if (child.name.indexOf("D1zhuzi005") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '1号桩基' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-37000, -2000, 0);
                            child.add(label);

                        }

                        if (child.name.indexOf("zhuzi036") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '2号桩基' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-25000, -12000, 0);
                            child.add(label);

                        }

                        if (child.name.indexOf("Dzhuzi036") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '3号桩基' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(3000, -12000, 0);
                            child.add(label);

                        }

                        if (child.name.indexOf("D4zhuzi005") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米';
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '4号桩基' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(14000, -2000, 0);
                            child.add(label);

                        }
                    }
                });

                scene.add(object);  //将模型加入到场景

            }, onProgress, onError);
        });

        //渲染器
        renderer = new THREE.WebGLRenderer({
                antialias: true, //开启反锯齿
            }
        );
        renderer.setClearColor(0xffffff, 0);                              // 设置颜色
        renderer.setPixelRatio(window.devicePixelRatio);                  // 设置分辨率
        // renderer.setSize(1100, 550);                                      // 设置渲染尺寸
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
        renderer.domElement.style.margin = '0 10%';
        $('#model').append(renderer.domElement);

        labelRenderer = new THREE.CSS2DRenderer();
        // labelRenderer.setSize(1100, 550);
        labelRenderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.margin = '0 10%';
        labelRenderer.domElement.style.top = '68px';
        $('#model').append(labelRenderer.domElement);


        window.addEventListener('resize', resize, false);    // 自适应监听
    }

    //初始化俯视图（荣家湾隧道）
    function initVerticalView() {

        //镜头
        camera = new THREE.PerspectiveCamera(45, 1100 / 550, 1000, 200000);  //创建一个透视相机，设置相机视角45度，最远能看200000，最近能看1000
        camera.position.set(0, 50000, 0);         //设置相机位置
        camera.up.set(1, 0, 0);

        //控制器
        controls = new THREE.OrbitControls(camera);
        controls.rotateSpeed = 0;       //设置旋转速度
        controls.enableDamping = false;  // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableZoom = false;     //是否可以缩放
        controls.autoRotate = false;     //是否自动旋转
        controls.minDistance = 1000;     //设置相机距离原点的最近距离
        controls.maxDistance = 100000;   //设置相机距离原点的最远距离
        controls.enablePan = true;      //是否开启右键拖拽

        //场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeeeeee);  // 设置场景背景色
        // let axesHelper = new THREE.AxesHelper( 50000 );
        // scene.add( axesHelper );

        //灯光
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);  //创建一个环境灯光
        scene.add(ambientLight);
        let pointLight = new THREE.PointLight(0xffffff, 0.8); //创建一个点灯光
        camera.add(pointLight);  //给模型添加灯光
        scene.add(camera);  //把视角放入环境

        // 添加操作器
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

        // 加载模型
        let mtlLoader = new THREE.MTLLoader();  //mtl文件加载器
        mtlLoader.load(path + '.mtl', function (materials) {

            // materials.preload();

            let objLoader = new THREE.OBJLoader();  //obj文件加载器
            objLoader.setMaterials(materials);
            objLoader.load(path + '.obj', function (object) {

                object.scale.multiplyScalar(1);  // 缩放模型大小
                object.scale.x = 1.5;            //模型在x轴方向放大二倍
                object.scale.z = 0.5;            //模型在z轴方向缩小二分之一
                object.translateZ(30000);        //模型向X轴正方向移动

                // 遍历模型所有子部分
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {

                        // 进口
                        if (child.name.indexOf("jinkou01") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道进口' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, -30000);

                            child.add(label);
                        }

                        // 2#横通道小里程
                        if (child.name.indexOf("2hxlc01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 17500);
                            child.add(line);

                            // 描述文字
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道2#横通道小里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(3000, 0, 30000);

                            child.add(label);
                        }

                        // 2#横通道大里程
                        if (child.name.indexOf("2hdlc01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 43500);
                            child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道2#横通道大里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, 70000);

                            child.add(label);
                        }

                        // 5#横通道小里程
                        if (child.name.indexOf("5hxlc01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 144500);
                            child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道5#横通道小里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(3000, 0, 150000);

                            child.add(label);
                        }

                        // 5#横通道大里程
                        if (child.name.indexOf("5hdlc01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 158500);
                            child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道5#横通道大里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, 200000);

                            child.add(label);
                        }

                        // 浅埋段小里程
                        if (child.name.indexOf("qmxlc01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 407500);
                            child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道浅埋段小里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, 430000);

                            child.add(label);
                        }

                        // 浅埋段大里程
                        if (child.name.indexOf("qmdlc01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 517500);
                            child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道浅埋段大里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(3000, 0, 522000);

                            child.add(label);
                        }

                        // 出口
                        if (child.name.indexOf("chukou01") == 0) {

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            // 分界线
                            let lineDiv = document.createElement('div');
                            lineDiv.style.backgroundColor = '#ff0000';
                            lineDiv.style.width = '1px';
                            lineDiv.style.height = '90px';
                            let line = new THREE.CSS2DObject(lineDiv);
                            line.position.set(-2000, 0, 527500);
                            child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '荣家湾隧道出口' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, 610000);

                            child.add(label);
                        }

                        if (child.name.indexOf("pingdao19") == 0) {

                            // child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '平导' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(-10000, 0, -30000);

                            child.add(label);
                        }
                    }
                });

                scene.add(object);  //将模型加入到场景

            }, onProgress, onError);
        });

        //渲染器
        renderer = new THREE.WebGLRenderer({
                antialias: true, //开启反锯齿
            }
        );
        renderer.setClearColor(0xffffff, 0);                              // 设置颜色
        renderer.setPixelRatio(window.devicePixelRatio);                  // 设置分辨率
        renderer.setSize(1100, 550);                                      // 设置渲染尺寸
        $('#model').append(renderer.domElement);

        labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setPixelRatio(window.devicePixelRatio);                  // 设置分辨率
        labelRenderer.setSize(1100, 550);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = 0;
        $('#model').append(labelRenderer.domElement);


        window.addEventListener('resize', resize, false);    // 自适应监听
    }

    //初始化俯视图（香树湾隧道）
    function initVerticalView2() {

        //镜头
        camera = new THREE.PerspectiveCamera(45, 1100 / 550, 10, 200000);  //创建一个透视相机，设置相机视角45度，最远能看200000，最近能看1000
        camera.position.set(0, 100000, 0);         //设置相机位置
        camera.up.set(1, 0, 0);

        //控制器
        controls = new THREE.OrbitControls(camera);
        controls.rotateSpeed = 0;       //设置旋转速度
        controls.enableDamping = false;  // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableZoom = true;     //是否可以缩放
        controls.autoRotate = false;     //是否自动旋转
        controls.minDistance = 10;     //设置相机距离原点的最近距离
        controls.maxDistance = 100000;   //设置相机距离原点的最远距离
        controls.enablePan = true;      //是否开启右键拖拽

        //场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeeeeee);  // 设置场景背景色
        let axesHelper = new THREE.AxesHelper( 200000 );
        scene.add( axesHelper );

        //灯光
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);  //创建一个环境灯光
        scene.add(ambientLight);
        let pointLight = new THREE.PointLight(0xffffff, 0.8); //创建一个点灯光
        camera.add(pointLight);  //给模型添加灯光
        scene.add(camera);  //把视角放入环境

        // 添加操作器
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

        // 加载模型
        let mtlLoader = new THREE.MTLLoader();  //mtl文件加载器
        mtlLoader.load(path + '.mtl', function (materials) {

            // materials.preload();

            let objLoader = new THREE.OBJLoader();  //obj文件加载器
            objLoader.setMaterials(materials);
            objLoader.load(path + '.obj', function (object) {

                object.scale.multiplyScalar(1);  // 缩放模型大小
                // object.scale.x = 100;            //模型在x轴方向放大二倍
                // object.scale.z = 100;            //模型在z轴方向缩小二分之一
                // object.translateZ(30000);        //模型向X轴正方向移动

                // object.material = new THREE.MeshBasicMaterial({ color: '#000000' });

                // 遍历模型所有子部分
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {

                        console.log(child.name);
                        child.material = new THREE.MeshBasicMaterial({ color: '#000000' });

                        // 进口
                        if (child.name.indexOf("jingkou09") == 0) {

                            object.scale.x = 10;            //模型在x轴方向放大二倍
                            object.scale.y = 10;
                            object.scale.z = 10;

                            child.material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '香树湾隧道进口' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, -30000);

                            child.add(label);
                        }

                        // 横洞正洞小里程
                        if (child.name.indexOf("zhengdongxlc00") == 0) {

                            child.material = new THREE.MeshBasicMaterial({color: '#ff0000'});

                            // 分界线
                            // let lineDiv = document.createElement('div');
                            // lineDiv.style.backgroundColor = '#ff0000';
                            // lineDiv.style.width = '1px';
                            // lineDiv.style.height = '90px';
                            // let line = new THREE.CSS2DObject(lineDiv);
                            // line.position.set(-2000, 0, 17500);
                            // child.add(line);

                            // 描述文字
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '香树湾隧道横洞正洞小里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(3000, 0, 30000);

                            child.add(label);
                        }

                        // 横洞正洞大里程
                        if (child.name.indexOf("zhengdongdlc00") == 0) {

                            child.material = new THREE.MeshBasicMaterial({color: '#ff0000'});

                            // 分界线
                            // let lineDiv = document.createElement('div');
                            // lineDiv.style.backgroundColor = '#ff0000';
                            // lineDiv.style.width = '1px';
                            // lineDiv.style.height = '90px';
                            // let line = new THREE.CSS2DObject(lineDiv);
                            // line.position.set(-2000, 0, 43500);
                            // child.add(line);

                            // 文字描述
                            let weekamount = '周完成20米'
                            let overplus = '剩余100米';
                            let plancompletedate = '贯通时间2020-04-08';

                            let lableDiv = document.createElement('div');
                            lableDiv.style.backgroundColor = '#ffffff';
                            lableDiv.style.border = '1px solid #000000';
                            lableDiv.style.padding = '2px';
                            lableDiv.style.lineHeight = '15px';
                            lableDiv.style.textAlign = 'left';
                            lableDiv.innerHTML =
                                '<div id="titleDiv" style="font-size: 15px; line-height: 20px"><strong>' + '香树湾隧道横洞正洞大里程' + '</strong></div>' +
                                '<div id="weekamountDiv" style="font-size: 10px">' + weekamount + '</div>' +
                                '<div id="overplusDiv" style="font-size: 10px">' + overplus + '</div>' +
                                '<div id="plancompletedateDiv" style="font-size: 10px">' + plancompletedate + '</div>';
                            let label = new THREE.CSS2DObject(lableDiv);
                            label.position.set(0, 0, 70000);

                            child.add(label);
                        }
                    }
                });

                scene.add(object);  //将模型加入到场景

            }, onProgress, onError);
        });

        //渲染器
        renderer = new THREE.WebGLRenderer({
                antialias: true, //开启反锯齿
            }
        );
        renderer.setClearColor(0xffffff, 0);                              // 设置颜色
        renderer.setPixelRatio(window.devicePixelRatio);                  // 设置分辨率
        renderer.setSize(1100, 550);                                      // 设置渲染尺寸
        $('#model').append(renderer.domElement);

        labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize(1100, 550);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = 0;
        $('#model').append(labelRenderer.domElement);

        window.addEventListener('resize', resize, {passive: false});    // 自适应监听
    }

    //进度通知
    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            var percent = document.getElementById("progress");
            percent.innerText = '已加载：' + Math.round(percentComplete, 2) + '%';
        }
    }

    //报错通知
    function onError(xhr) {
        layer.msg('模型加载失败');
    }

    // 监听窗口自适应
    function resize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

        // camera.aspect = 1100 / 550;
        // camera.updateProjectionMatrix();
        // renderer.setSize(1100, 550);
    }

    // 时刻渲染
    function animate() {
        let delta = clock.getDelta();
        controls.update(delta);
        // camera.lookAt( scene.position );
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    /* 从scene中删除模型并释放内存 */
    function clearScene(myObjects) {
        if (myObjects.length > 0) {
            for (let i = 0; i < myObjects.length; i++) {
                let currObj = myObjects[i];

                // 判断类型
                if (currObj instanceof THREE.Scene) {
                    let children = currObj.children;
                    for (let i = 0; i < children.length; i++) {
                        deleteGroup(children[i]);
                    }
                } else {
                    deleteGroup(currObj);
                }
                scene.remove(currObj);
            }
        }
    }

    // 删除group，释放内存
    function deleteGroup(group) {
        if (!group) return;
        // 删除掉所有的模型组内的mesh
        group.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                item.geometry.dispose(); // 删除几何体
                item.material.dispose(); // 删除材质
            }
        });
    }
});
