

var totalpage = 0;
var urlId = getParam('id');
var urlType = getParam('type');
console.log(urlType);
var page = urlType== 'case' ? 0 : 1;

// console.log(getUrlType);
// 路径状态判断 rules-党章党规 trends-党建活动classes-先锋课堂information-信息发布
var url = urlType == 'case' ? 'cases/index' : 'article/index';
var titile = ''
function getMessage(page) {
    var params = {
        id: urlId
    }
    getDatas(url, params, function (err, res) {
        var detailData = res.data;
        //				alert(obj);
        console.log(detailData);
        var str = '';
        var imgs = detailData.photos ? detailData.photos : detailData.img
        totalpage = imgs.length;
        str += "</div>" + "<div class='detailTxt' id='detailTxt'><img class='myimg' src='" + web_url + imgs[page] + "' ></div>";
        $("#describe").html(str);
        right.toggleFocus();
    })

}




var MyMar;
var stuats = 0;
var start = 0;
var upDown = 'down';

// 详情自动翻滚
function timedCount() {
    var speed = 10;
    var thisContain = document.getElementById("describe");
    var thisIntro = document.getElementById("detailTxt");
    var thisTitle = document.getElementById("detailTitle");
    clearInterval(MyMar);
    //console.log(thisContain.offsetHeight, thisTitle.offsetHeight, thisContain.scrollTop, thisIntro.offsetHeight, thisIntro.scrollHeight, thisTitle.scrollHeight)
    function Marquee() {
        // console.log(thisContain.offsetHeight, thisContain.scrollTop, thisIntro.scrollHeight)
        if (upDown == 'down') {
            if ((thisIntro.scrollHeight + thisTitle.scrollHeight) - thisContain.scrollTop <= thisContain.offsetHeight - 50) {
                clearInterval(MyMar);
                //  console.log(thisContain.offsetHeight, thisTitle.offsetHeight, thisContain.scrollTop, thisIntro.offsetHeight, thisIntro.scrollHeight, thisTitle.scrollHeight)
            } else {
                thisContain.scrollTop++;
            }
        } else {
            //  console.log('111');
            thisContain.scrollTop--;
            // if ((thisIntro.scrollHeight + thisTitle.scrollHeight) - thisContain.scrollTop <= thisContain.offsetHeight) {
            //     clearInterval(MyMar);
            // } else {
            //     thisContain.scrollTop--
            // }
        }
    }

    MyMar = setInterval(Marquee, speed)

}




var mid = getParam('mid');

function gettitle() {
    $.ajax({
        type: 'get',
        url: api + "api/v2/category/bread?id=" + mid,
        dataType: "jsonp",
        //			使用jsonp的方式传输数据(能够方便跨域)
        jsonp: "callback",
        async: false,
        success: function (res) {
            var title = res.data.title;
            $("#titles").append(title)

        },
    });

}
gettitle();





//获取机顶盒或浏览器信息
var env = evm.getStbBrowser();
function setClass(element, className) {
    if (isNotNullObject(element)) {
        if (className != element.className)
            element.className = className;
    }
}
function isNotNullObject(object) {
    if ((null != object) && ("object" == typeof object))
        return true;
    else
        return false;
}
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
    // console.log(mod)
    //移除视图按键管理器
    mod.removeListener = function () {
        evm.controller.subscribe({
            type: 1,
            method: 'remove',
            callback: mod.grabEvent,
            context: mod
        });
    };
    // console.log(module)
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
        getMessage(page);
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
        //me.toggleFocus();
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
        left: 0
    }
};

var right = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function () {
    var mod = {},
        containerId = 'right',
        index = 0,
        listName = 'myimg',
        checkCookie = true; //配置是否定位焦点到二级栏目，默认否

    mod.modName = 'huodong';
    mod.modNum = cmsIndex.moduleGuid();
    mod.cleanCss = function () {
        var me = mod;
        if (length > 0) {
            var elem = evm.$('right').getElementsByClassName(listName);
            for (i = 0; i < length; i++) {
                elem[i].className = listName;
            }
        }
        index = 0;
        return me;
    }
    mod.toggleFocus = function (number) {
        if (number != undefined) {
            index = number;
        }
        var me = mod;
        var elem = evm.$('describe').getElementsByClassName(listName);
        elem[index].className = elem[index].className + ' active';
        // console.log(elem[index],'elem');
        // var picWidth =elem[index].offsetWidth;
        // var picHeight =elem[index].offsetHeight;
        // console.log(picWidth,'picWidth',picHeight,'picHeight');
        // elem[index].style.marginTop=-(parseInt(picHeight)/2)+'px';
        // elem[index].style.marginLeft=-(parseInt(picWidth)/2)+'px';
        return me;
    };

    //赋值
    mod.moveH = function (directive) {
        var me = mod;
        if (directive == "backwards") {//左
            if (page > 1) {
                page--;
            }
        } else if (directive == 'forwards') {//右
            if (page < totalpage - 1) {
                page++;
            }
        }
        getMessage(page);

        return me;
    };

    mod.moveU = function (directive) {
        var me = mod;
        if (directive == "up") {//上
            upDown = 'up';
        } else if (directive == "down") {//下
            upDown = 'down';
        }
        //timedCount();
        stuats = 1;
        start = 1;
        return me;
    };
    mod.action = function (directive) {
        var me = mod,
            result;
        switch (directive) {
            case 'back':
                history.go(-1);
                break;
            case 'enter':
                if (start == 1) {
                    console.log('暂停或继续', MyMar)
                    if (stuats == 1) {
                        clearInterval(MyMar);
                        stuats = 0;
                    } else {
                        timedCount()
                        stuats = 1;
                    }
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
                me.moveU('up');
                break;
            case keymap.Enrich.DOWN:
            case keymap.iPanel.DOWN:
            case keymap.DVN.DOWN:
                me.moveU('down');
                break;
            case keymap.Enrich.LEFT:
            case keymap.iPanel.LEFT:
            case keymap.DVN.LEFT:
                me.moveH('backwards');
                break;
            case keymap.Enrich.RIGHT:
            case keymap.iPanel.RIGHT:
            case keymap.DVN.RIGHT:
                me.moveH('forwards');
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
                window.location.href = "address.html";
                break;
        }
        return isBlock;
    };

    return mod;
})();

cmsIndex.run();