// Utility.keyConvert();
//function getMessage() {
//  console.log('我换页了')
//  str = '';
//  right.toggleFocus();
//}

var type = getParam('type');
function getMessage(page, size, pos) {
    console.log(page, size, pos)
    var params = {
//      id: type,
//      page: page,
//      pagesize: size
    };
    getDatas("party/partyMemberAdv", params, function (err, res) {
        if (err) {
            console.log(err)
            return;
        }
        console.log(res.data.items)


        var dataItems = res.data.items;
        var str = '';

        for (var i = 0; i < dataItems.length; i++) {
            str += '<div class="video_box fl" data-id= ' + dataItems[i].id + '>'
			str += '<div class="video_info">'
			str += '<img src='+dataItems[i].vivid_img+'></div>'
			str += '<div class="video_title">点赞数：'+dataItems[i].likes+'</div></div>'

        }
        if (dataItems.length > 0) {
            evm.$('page_show').style.display = "block";
            evm.$('now_page').innerHTML = page;
            evm.$('total_page').innerHTML = res.data.totalpage;
        }else{
            str = '<h1>暂无数据</h1>'
        }
        evm.$('right').innerHTML = str;
        var index = 0;
        right.initialization();
        right.toggleFocus(index);
    });
}


/* 走马灯 */
var MyMar;
function timedCount(index) {
    var speed = 40;
    clearInterval(MyMar);
    var thisContain = document.getElementsByClassName("videoNameBar")[index];
    var thisIntro = thisContain.getElementsByClassName("videoName")[0];
    thisIntro.style.left = 0;
    function Marquee() {
        var left = thisIntro.style.left;
        if (parseInt(thisContain.offsetWidth) < parseInt(thisIntro.offsetWidth)) {
            if (parseInt(left) > parseInt(-thisIntro.offsetWidth)) {
                thisIntro.style.left = (parseInt(left) - 1) + 'px';
            } else {
                thisIntro.style.left = '0px'
            }
        }
    }
    MyMar = setInterval(Marquee, speed);
}

//获取机顶盒或浏览器信息
var env = evm.getStbBrowser();
function cookie(k, v) {
    if (v != undefined && typeof v == 'string') {
        evm.cookie(k, v);
        return;
    }
    if (!!evm.cookie(k)) {
        return evm.cookie(k);
    }
}
/*
 * $cmsIndex首页视图模块
 * 依赖:
 */
var cmsIndex = (function () {
    var mod = {};

    //配置项
    var config = mod.config = {
        //开启cookie开关
        cookieSwitch: true,
        cookieKey: 'cmsIndex',
        //模拟数据配置
        mockData: {
            //URI查询标示符
            key: '[mdata]',
            //文件目录
            dir: '../source/mockData'
        },
        //调试输出开关
        debug: false
    };

    var localData = mod.localData = {
        indexSource: '[mdata]/index.js'
    };
    //接口数据缓存
    var jsonCache = {};
    //各模块焦点切换的配置
    var modules = mod.modules = [];
    //当前模块的索引值,被引用的模块
    moduleId = 0,
        module = null,
        moduleGuid = 0,
        moduleCount = -1;

    mod.addModule = function () {
        return moduleCount += 1;
    };
    //moduleGuid存取器
    mod.moduleGuid = function (id) {
        if (typeof id == 'number') moduleGuid = id;
        return moduleGuid;
    };
    if (config.cookieSwitch && config.cookieKey) {
        //read cookie
        var pageCookie = cookie(config.cookieKey);
        if (pageCookie) {
            pageCookie = pageCookie.split(',');
            if (pageCookie.length > 0) {
                var moduleCookie = mod.moduleCookie = pageCookie[0].split('.');
                if (pageCookie[1]) {
                    var viewportCookie = mod.viewportCookie = moduleCookie;
                    moduleCookie = mod.moduleCookie = pageCookie[1].split('.');
                }
                if (pageCookie[2]) {
                    var parentCookie = mod.parentCookie = pageCookie[2].split('.');
                }
            }
        }
        //清除cookie
        evm.cutCookie(config.cookieKey);
    }
    //添加视图按键管理器
    mod.addListener = function () {
        evm.controller.subscribe({
            type: 1,
            method: 'add',
            callback: mod.grabEvent,
            context: mod
        });
    };
    //移除视图按键管理器
    mod.removeListener = function () {
        evm.controller.subscribe({
            type: 1,
            method: 'remove',
            callback: mod.grabEvent,
            context: mod
        });
    };
    //视图按键管理
    mod.grabEvent = function (key) {
        var me = mod;
        //拦截返回键,方法返回isBlock是1或0,默认0不拦截
        var isBlock = 0;
        if (module && module.grabEvent) {
            isBlock = module.grabEvent(key) || 0;
        }
        return isBlock;
    };
    //模块存取器
    mod.module = function (mID) {
        if (modules[mID]) {
            module = modules[mID].module || null;
        }
        return module;
    };

    //切换当前模块
    mod.handle = function (directive) {
        var me = mod;
        if (modules[moduleId].map &&
            (typeof modules[moduleId].map[directive] == 'number')) {
            moduleId = modules[moduleId].map[directive];
            return me.module(moduleId);
        }
    };
    mod.paint = function () {
        var me = mod;
        page = EVM.cookie.getValue('now_page');
        if (page==""||page==undefined) {
        	page=1;
        }else{
        	
        }
        getMessage(page, 8, 'next');
        me.addListener();
        return me;
    };

    mod.run = function () {
        var me = mod;
        //默认moduleId = 0 导航栏
        //cookie得到焦点

        var nav = mod.module(moduleId);
        cmsIndex.handle('right');
        //控制器管理按键
        evm.on(document, (!env.stb ? 'keydown' : (env.stb == 'iPanel' ?
            'irkeypress' : 'keydown')), evm.controller, evm);

        me.paint();
        return me;
    };
    return mod;
})();

/*
 * 1.右侧区
 */

cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
    modName: 'right',
    modNum: cmsIndex.moduleGuid(),
    map: {
        login: 0
    }
};
var right = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function () {
    var mod = {},
        status = '1',//是否在外框上 0不在1在  
        likeState = false,//是否启用点赞功能 true有 false 无
        index = 0, //右侧选中地址位置
        listName = 'video_box', //块
        page_size = 10,//列表总数
        length = 0, //listName实际数量
        now_page = 0,//当前页数
        total_page = 0; //总页数    
    mod.modName = 'ModelList2';
    mod.modNum = cmsIndex.moduleGuid();
    mod.toggleFocus = function (number) {
        if (number != undefined) {
            index = number;
        }
        console.log(index)
        mod.initialization();
        var me = mod;
        var elem = evm.$('right').getElementsByClassName(listName);
        console.log(elem, "evm")
        for (i = 0; i < length; i++) {
            elem[i].className = listName;
        }

        if (index <= length - 1) {
            elem[index].className = elem[index].className + ' iactive';
        }

        return me;
    };
    //赋值
    // console.log(document.getElementById('now_page').innerHTML)
    mod.initialization = function () {
        now_page = parseInt(document.getElementById('now_page').innerHTML);
        total_page = parseInt(document.getElementById('total_page').innerHTML);
        length = evm.$('right').getElementsByClassName(listName).length;
    };
    mod.moveOp = function (directive) {
        var me = mod;
        var json = new listOperation({
            type: '2',
            page_size: page_size,
            key: directive,
            likeState: likeState,
            status: status,
            now_page: now_page,
            total_page: total_page,
            length: length,
            index: index,
            rowHeight: 2
        })
        var message = json.operation();
        console.log(json, "_______________")
        index = message.index;
        status = message.status;
        if (message.position != '') {
            getMessage(message.now_page, page_size, message.position);  //下一页
        }
        me.toggleFocus()
        return me;
    };
    mod.action = function (directive) {
        var me = mod;
        switch (directive) {
            case 'back':
                // window.location.href = 'exposure.html';
                EVM.cookie.setValue('now_page','');

                window.history.go(-1);
                break;
            case 'enter':
                   if (status == '1') {
                   		EVM.cookie.setValue('now_page',now_page);
                          
                   }
                break;
        }
        return me;
    };
    mod.grabEvent = function (key) {
        var me = mod;
        //拦截返回键,方法返回isBlock是1或0,默认0不拦截
        var isBlock = 0;
        switch (key) {
            case keymap.Enrich.UP:
            case keymap.iPanel.UP:
            case keymap.DVN.UP:
                me.moveOp('up');
                break;
            case keymap.Enrich.DOWN:
            case keymap.iPanel.DOWN:
            case keymap.DVN.DOWN:
                me.moveOp('down');
                break;
            case keymap.Enrich.LEFT:
            case keymap.iPanel.LEFT:
            case keymap.DVN.LEFT:
                me.moveOp('backwards');
                break;
            case keymap.Enrich.RIGHT:
            case keymap.iPanel.RIGHT:
            case keymap.DVN.RIGHT:
                me.moveOp('forwards');
                break;
            case keymap.Enrich.PAGE_UP:
            case keymap.iPanel.PAGE_UP:
            case keymap.DVN.PAGE_UP:
                me.moveOp('pageUp');
                break;
            case keymap.Enrich.PAGE_DOWN:
            case keymap.iPanel.PAGE_DOWN:
            case keymap.DVN.PAGE_DOWN:
                me.moveOp('pageDown');
                break;
            case keymap.SELECT:
            case keymap.SELECT2:
                me.action('enter');
                break;
            case keymap.Enrich.BACK:
            case keymap.iPanel.BACK:
            case keymap.DVN.BACK:
                me.action('back');
                break;
            case keymap.Inspur.EXIT:
            case keymap.iPanel.EXIT:
            case 0:
                window.location.href = "index.html";
                break;
        }
        return isBlock;
    };
    return mod;
})();

cmsIndex.run();