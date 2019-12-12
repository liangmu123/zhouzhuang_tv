// Utility.keyConvert();
function getMessage() {
    // console.log('我换页了')
    str = '';
    right.toggleFocus();
}
var starState = false;
// var thisToken = 'fce8d707340b4de22159c57a3be3f577';
var leftData = [
    { "name": "党支部", "type": "1", "type_style": 'row' },
    { "name": "党员", "type": "2", "type_style": 'row' },
];


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
        if (leftData.length > 0) {
            left.paint();
            left.toggleFocus();
        }
        right.initialization();//初始化
        me.addListener();
        return me;
    };
    mod.run = function () {
        var me = mod;
        //默认moduleId = 0 导航栏
        //cookie得到焦点
        var nav = mod.module(moduleId);
        cmsIndex.handle('left');
//      right.paint();
        //控制器管理按键
        evm.on(document, (!env.stb ? 'keydown' : (env.stb == 'iPanel' ?
            'irkeypress' : 'keydown')), evm.controller, evm);
        me.paint();
        return me;
    };
    return mod;
})();
/*
 * 0.左边内容
 */
cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
    modName: 'left',
    modNum: cmsIndex.moduleGuid(),
    map: { right: 1 }
};

var left = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function () {
    var mod = {
        modName: 'left',
        modNum: cmsIndex.moduleGuid()
    },
        items = leftData,
        index = 0,
        length = leftData.length,
        containerId = 'left';

    //左侧内容生成
    mod.paint = function () {
        var me = mod;
        var str = '';
        for (var i = 0; i < items.length; i++) {
            var iname = items[i].name.length > 6 ? items[i].name.substr(0, 6) + '...' : items[i].name;
            str += '<div class="leftBtn" id=' + containerId + '-list-' + i + ' type_style=' + items[i].type_style + ' type=' + items[i].type + ' data-content=' + items[i].name + ">" + iname + '</div>';
        }
        evm.$('btnsBar').innerHTML = str;
        return me;
    };

    //动态操作
    mod.toggleFocus = function (number) {
        if (number != undefined) {
            index = number;
        }
        var me = mod;
        for (var i = length - 1; i >= 0; i--) {
            elem = evm.$(containerId + '-list-' + i);
            elem.className = "leftBtn";
        }
        elem = evm.$(containerId + '-list-' + index);
        elem.className = elem.className + ' btnActive';
        if(index==0){
        	$('#rightSkill').html('<img src="img/dangzuzhi.png"/>')
        }else{
        	$('#rightSkill').html('<img src="img/dangyuan.png"/>')
        }
        
        
        return me;
    }//动态操作
    mod.cleanCss = function (number) {
        
        var me = mod;
        for (var i = length - 1; i >= 0; i--) {
            elem = evm.$(containerId + '-list-' + i);
            elem.className = "leftBtn";
        }
        return me;
    }

    //左右切换
    mod.moveH = function (directive) {
        var me = mod
        
//      if (directive == "forwards") {
//      	me.cleanCss()
//          result = cmsIndex.handle('right');
//          result.toggleFocus(0);
//      }
        return me;
    };
    //上下切换
    mod.moveU = function (directive) {
        var me = mod;
        if (directive == "up") {
            index = index <= 0 ? length - 1 : --index;
//          thisType = thisType <= 1 ? thisType = 4 : --thisType;
//          getSkills(1, 8, 'first');
//          right.paint();
        }
        else {
            index = index >= length - 1 ? 0 : ++index;
//          thisType = thisType == 4 ? thisType = 0 : ++thisType;
//          getSkills(1, 8, 'first');
//          right.paint();
        }

        mod.toggleFocus();
        return me;
    };
    //电视操作
    mod.action = function (directive) {
        var me = mod;
        switch (directive) {
            case 'enter':
                //特殊处理: 判断栏目ID
                break;
            case 'back':
                //特殊处理: 判断栏目ID
                window.location.href = 'index.html';
                break;
        }
        return me;
    };
    //左侧拦截
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

/*
 * 1.右侧区
 */
cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
    modName: 'right',
    modNum: cmsIndex.moduleGuid(),
    map: { left: 0 }
};

var right = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function () {
    var mod = {},
        status = '1',//是否在外框上 0不在1在 
        likeState = false,//是否启用点赞功能 true有 false 无
        index = 0, //右侧选中地址位置
        length = 0, //右侧可选中总数实际数量 
        page_size = 8,//右侧列表总数
        now_page = 1, //当前页数
        total_page = 0,  //总页数
        rowHeight = 2,
        listName = 'skill';//右侧可选中模块列表className
    mod.modName = 'list';
    mod.modNum = cmsIndex.moduleGuid();
    //光标离开时候的状态
    mod.cleanCss = function () {
        var me = mod;
        if (length > 0) {
            var elem = evm.$('skillBar').getElementsByClassName('skill');
            for (i = 0; i < length; i++) {
                elem[i].className = 'skill';
            }
        }
        index = 0;
        return me;
    };
    //左侧内容生成
    mod.paint = function (number) {
        if (number != undefined) {
            index = number;
        }
        var me = mod;
        var str = '';
        length = evm.$('skillBar').getElementsByClassName('skill').length;
        now_page = parseInt(document.getElementById('now_page').innerHTML);
        total_page = parseInt(document.getElementById('total_page').innerHTML);
        page_size = 3;
        evm.$('rightSkill').style.display = 'block';
        for (var i = 0; i < skillData.length; i++) {
            str += '<div class="skill">';
            str += '<img src="' + skillData[i].head + '" class="skillHead">';
            str += '<img src="./img/videoIcon.png" class="videoIcon">';
            str += '<div class="skillTitle">' + skillData[i].name + '</div></div>';

        }
        evm.$('skillBar').innerHTML = str;
        return me;
    };
    mod.toggleFocus = function (number) {
        if (number != undefined) {
            index = number;
        }
        var me = mod;
        length = skillData.length;
        var elem = evm.$('skillBar').getElementsByClassName('skill');
        for (i = 0; i < length; i++) {
            elem[i].className = 'skill';
            if (elem[i].className == 'skill active') {
                elem[i].className = 'skill';
            }
        }
        if (index >= 0) {
            elem[index].className = elem[index].className + ' active';
        }
        return me;
    };

    //左右切换
    mod.moveH = function (directive) {
        var me = mod
        if (directive == "forwards") {//右\
            if (now_page != total_page) {
                index++;
            } else {
                if (index < length - 1) {
                    index++;
                }
            }
            if (index < length) {//我的技能
                mod.toggleFocus(index);
            }
            if (index > length - 1) {
                if (now_page < total_page) {
                    getSkills(++now_page, page_size, 'next'); //下一页
                }
            }
        } else {//左
            index--;
            if (index > -1) {//往右累加
                if (index >= 0) {
                    me.toggleFocus(index);
                }
            }
            // 翻页
            if (index == -1 && now_page > 1) { //非第一页且第一个位置
                if (index == -1) { index++ }
                getSkills(--now_page, page_size, 'previous'); //上一页
            }
            // 第一页第一个到左侧按钮
            if (now_page == 1 && index == -1) {
                me.cleanCss();
                result = cmsIndex.handle('left');
                result.toggleFocus();
            }
        }
        return me;
    };
    //上下切换
    mod.moveU = function (directive) {
        var me = mod;
        var lenghts = $('.skill').length
        if (directive == "down") {//下
            if(index>=0&&index<4){
                index=index+4;
                if (index>=lenghts) {
                	index=index-4;
                }
            }
        } else {//上
            if(index>=4&&index<8){
                index=index-4;
            }
        }
        right.toggleFocus(index)
        return me;
    };
    //电视操作
    mod.action = function (directive) {
        var me = mod;
        switch (directive) {
            case 'enter':
                //     var thisId= evm.$('rightListBar').children[index].getAttribute('data-id');
                // window.location.href = 'skillPoints.html?id='+thisId;
                //特殊处理: 判断栏目ID
                break;
            case 'back':
                //特殊处理: 判断栏目ID
                window.location.href = 'index.html';

                break;
        }
        return me;
    };
    //初始化赋值
    mod.initialization = function () {
//      length = evm.$('skillBar').getElementsByClassName('skill').length;
//      getSkills(1, 8, 'first');

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
                window.location.href = "index.html";
                break;
        }
        return isBlock;
    };

    return mod;
})();

cmsIndex.run();