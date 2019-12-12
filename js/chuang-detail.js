// Utility.keyConvert();

var urlId = getParam('id');
var hasBig = true;
var IntroIndex = EVM.cookie.getValue('detailImg');

if (IntroIndex == 1) {

    IntroIndex = 0;

} else {
    IntroIndex = 1;
}

var url = '';
var titile = '';

var mid = getParam('mid');


var detailData = [
    {
        title: '张家港新时代文明实践所揭牌',
        content: '张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌张家港新时代文明实践所揭牌',
        img: 'images/banner1.png'
    }
]

function getMessage() {
    var str = "";
    var params = {
        id: urlId
    }
    getDatas('activity', params, function (err, res) {
        var detailData = res.data;
        console.log(res, 'res')
        console.log(detailData, 'detailData')
        var arry = '';
        str += "<div class='detailTitle' id='detailTitle'>" + detailData.title + "</div>";
        str += "<div class='detailCont' id='detailCont'><div class='detailTxt' id='detailTxt'><div class='detailMess activeImg' id='detailMess'></div>";
        str += detailData.brief + "</div></div>";
        if(detailData.images !=""){
        	str += "<div class='picBar'><img class='imgs' id='imgs' src='"+ web_url + detailData.images + "' style='float:left;margin-right:15px;width:280px;max-height:400px;'><div class='picIntro'>选择请按确认键放大查看更多图集</div></div>";
        }else{
        	str += "<div class='picBar'><img class='imgs' id='imgs' src='images/none.jpg' style='float:left;margin-right:15px;width:280px;max-height:400px;'><div class='picIntro'>选择请按确认键放大查看更多图集</div></div>";
        }
        
        $("#describe").html(str);
           if (detailData.photos==null||detailData.photos.length <= 1) {
               hasBig = false;
           } else if (detailData.photos.length > 1) {
               hasBig = true;
           }
    })
    // console.log(detailData,'detailData')
    // str += "<div class='detailTitle' id='detailTitle'>" + detailData[0].title + "</div>";
    // str += "<div class='detailCont' id='detailCont'><div class='detailTxt' id='detailTxt'><div class='detailMess activeImg' id='detailMess'></div>";
    // str += detailData[0].content + "</div></div>";
    // str += "<div class='picBar'><img class='imgs' id='imgs' src='" + detailData[0].img + "' style='float:left;margin-right:15px;width:280px;max-height:204px;'><div class='picIntro'>选择请按确认键放大查看更多图集</div></div>";
    // $("#describe").html(str);
}

var MyMar;
var stuats = 0;
var start = 0;
var upDown = 'down';

// 详情自动翻滚
function timedCount() {
    var speed = 20;
    var thisContain = document.getElementById("detailCont");
    var thisIntro = document.getElementById("detailTxt");
    // var thisTitle = document.getElementById("detailTitle");
    clearInterval(MyMar);
    ////console.log(thisContain.offsetHeight, thisTitle.offsetHeight, thisContain.scrollTop, thisIntro.offsetHeight, thisIntro.scrollHeight, thisTitle.scrollHeight)
    function Marquee() {
        // //console.log(thisContain.offsetHeight, thisContain.scrollTop, thisIntro.scrollHeight)
        // 	if (upDown == 'down') {
        // 		if ((thisIntro.scrollHeight) - thisContain.scrollTop <=thisIntro.offsetHeight-thisContain.offsetHeight-10) {
        // 			clearInterval(MyMar);
        // 		} else {
        // 			thisContain.scrollTop++
        // 		}
        // 	} else {
        // 		// if ((thisIntro.scrollHeight + thisTitle.scrollHeight) - thisContain.scrollTop <= thisContain.offsetHeight) {
        // 		if(thisContain.scrollTop==0){	
        // 			clearInterval(MyMar);
        // 		} else {
        // 		    thisContain.scrollTop--
        // 		}
        // 	}
        // 	 console.log('内容高度',thisIntro.scrollHeight,'内容高度',thisContain.scrollTop,'容器顶部', thisContain.offsetHeight,'容器高度',thisIntro.offsetHeight)
        // }
        if (upDown == 'down') {
            if (thisIntro.scrollHeight - thisContain.scrollTop <= thisContain.offsetHeight) {
                clearInterval(MyMar);
            } else {
                thisContain.scrollTop++
            }
        } else {
            if (thisContain.scrollTop == 0) {
                clearInterval(MyMar);
            } else {
                thisContain.scrollTop--
            }
        }
        // console.log('内容高度',thisIntro.scrollHeight,'内容高度',thisContain.scrollTop,'容器顶部', thisContain.offsetHeight,'容器高度',thisIntro.offsetHeight)
    }

    MyMar = setInterval(Marquee, speed)

}

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
    // //console.log(mod)
    //移除视图按键管理器
    mod.removeListener = function () {
        evm.controller.subscribe({
            type: 1,
            method: 'remove',
            callback: mod.grabEvent,
            context: mod
        });
    };
    // //console.log(module)
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
        getMessage();
        me.addListener();
        return me;
    };

    mod.run = function () {
        var me = mod;
        //默认moduleId = 0 导航栏
        //cookie得到焦点

        var nav = mod.module(moduleId);
        if (IntroIndex == 0) {
            cmsIndex.handle('left');
            me.paint();
            left.toggleFocus();

        } else {
            cmsIndex.handle('right');
            me.paint();
            right.toggleFocus();
        }
        //控制器管理按键
        evm.on(document, (!env.stb ? 'keydown' : (env.stb == 'iPanel' ?
            'irkeypress' : 'keydown')), evm.controller, evm);

        

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
        left: 1
    }
};

var right = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function () {
    var mod = {},
        containerId = 'right',
        listName = 'hh',
        index = 0,
        checkCookie = true; //配置是否定位焦点到二级栏目，默认否

    mod.modName = 'huodong';
    mod.modNum = cmsIndex.moduleGuid();



    mod.cleanCss = function () {
        var me = mod;
        var elem = evm.$('bodyContain').getElementsByClassName(listName);
        for (i = 0; i < length + 1; i++) {
            elem[index].className = listName;
        }

        index = 0;
        return me;
    }

    mod.toggleFocus = function (number) {
        if (number != undefined) {
            index = parseInt(number);
        }
        var me = mod;
        var elem = evm.$('bodyContain').getElementsByClassName(listName);
        //console.log(elem);
        ////console.log(index);
        elem[0].className = elem[0].className + ' active';
        return me;
    };
    //赋值
    mod.moveH = function (directive) {
        var me = mod;
        if (directive == "backwards") { //左
            me.cleanCss();
            cmsIndex.handle('left');
            left.toggleFocus();
        }
        return me;
    };

    mod.moveU = function (directive) {
        var me = mod;
        if (directive == "up") { //上
            upDown = 'up';
        } else if (directive == "down") { //下
            upDown = 'down';
        }
        timedCount();
        stuats = 1;
        start = 1;
        return me;
    };
    mod.action = function (directive) {
        var me = mod,
            result;
        switch (directive) {
            case 'back':
                EVM.cookie.setValue('detailImg', 0);
                history.go(-1);
                break;
            case 'enter':
                if (start == 1) {
                    //console.log('暂停或继续', MyMar)
                    if (stuats == 1) {
                        clearInterval(MyMar);
                        stuats = 0;
                    } else {
                        clearInterval(MyMar);
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

/*
 * 1.右侧区
 */

cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
    modName: 'left',
    modNum: cmsIndex.moduleGuid(),
    map: {
        right: 0
    }
};

var left = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function () {
    var mod = {},
        containerId = 'left',
        index = 0,
        listName = 'imgs',
        checkCookie = true; //配置是否定位焦点到二级栏目，默认否

    mod.modName = 'huodong';
    mod.modNum = cmsIndex.moduleGuid();
    mod.cleanCss = function () {
        var me = mod;
        var elem = evm.$('bodyContain').getElementsByClassName(listName);
        for (i = 0; i < length + 1; i++) {
            elem[index].className = listName;
        }

        index = 0;
        return me;
    }
    mod.toggleFocus = function (number) {
        if (number != undefined) {
            index = parseInt(number);
        }
        var me = mod;
        setTimeout(function () {

            var elem = evm.$('bodyContain').getElementsByClassName(listName);
            //console.log(elem);
            ////console.log(index);
            elem[index].className = elem[index].className + ' active';

        }, 400)

        return me;
    };

    //赋值
    mod.moveH = function (directive) {
        var me = mod;
        if (directive == "backwards") { //左

        } else if (directive == 'forwards') { //右
            me.cleanCss();
            cmsIndex.handle("right");
            right.toggleFocus();
        }
        return me;
    };

    mod.moveU = function (directive) {
        var me = mod;
        if (directive == "up") { //上
        } else if (directive == "down") { //下
        }
        //timedCount();
        //      stuats = 1;
        //      start = 1;
        return me;
    };

    mod.action = function (directive) {
        var me = mod,
            result;
        switch (directive) {
            case 'back':
                EVM.cookie.setValue('detailImg', 0);
                history.go(-1);
                break;
            case 'enter':
                if (hasBig) {
                    EVM.cookie.setValue('detailImg', 1);
                    window.location.href = "imgfullscreen.html?id=" + urlId;
                } else {
                	prompt("暂无详情");
                	
                    
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