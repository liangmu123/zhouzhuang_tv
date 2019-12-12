// Utility.keyConvert();
//模块信息

//获取机顶盒或浏览器信息
var env = evm.getStbBrowser();
var typedrive = env.browser;
var id = getParam('id');

function getMessage() {
	var str = "";
	var params = {
		id: id,
	};
	getDatas("party/partyMemberAdvInfo", params, function(err, res) {
		if(err) {
			//console.log(err)
			return;
		}
		//console.log(res.data)
		var dataItems = res.data;
		var str = '';
		//console.log(dataItems)	
		str += '<div class="con"><div class="title">' + dataItems.name + '</div>'
		str += '<div class="photo"><img id="print" width="168" height="202" src='+ web_url + dataItems.vivid_img + ' /></div>'
		str += '<div class="info"><div class="sex">民族：'+dataItems.nation + '</div>'
		str += '<div class="age">学历：'+dataItems.education + '</div><div class="minzu">组织：'+dataItems.group_name + '</div>'
		str += '<div class="phone">电话：'+dataItems.moblie + '</div><div class="addtime">加入时间：'+dataItems.join_time + '</div>'
		str += '<div class="zhengtime">转正时间：'+dataItems.turn_time + '</div></div>'
		str += '<div id="" style="clear: both;"></div>'
		str += '<div class="jianjie">&nbsp;&nbsp;事迹介绍：<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+dataItems.brief + '</div></div>'
		
		evm.$('main').innerHTML = str;
	})
}

var hasIndex = EVM.cookie.getValue('indexIndex');
index = 0; //右侧选中地址位置
var elem;

function cookie(k, v) {
	if(v != undefined && typeof v == 'string') {
		evm.cookie(k, v);
		return;
	}
	if(!!evm.cookie(k)) {
		return evm.cookie(k);
	}
}
/*
 * $cmsIndex首页视图模块
 * 依赖:
 */
var cmsIndex = (function() {
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

	mod.addModule = function() {
		return moduleCount += 1;
	};

	//moduleGuid存取器
	mod.moduleGuid = function(id) {
		if(typeof id == 'number') moduleGuid = id;
		return moduleGuid;
	};

	if(config.cookieSwitch && config.cookieKey) {
		//read cookie
		var pageCookie = cookie(config.cookieKey);
		if(pageCookie) {
			pageCookie = pageCookie.split(',');

			if(pageCookie.length > 0) {
				var moduleCookie = mod.moduleCookie = pageCookie[0].split('.');

				if(pageCookie[1]) {
					var viewportCookie = mod.viewportCookie = moduleCookie;
					moduleCookie = mod.moduleCookie = pageCookie[1].split('.');

				}
				if(pageCookie[2]) {
					var parentCookie = mod.parentCookie = pageCookie[2].split('.');
				}
			}
		}

		//清除cookie
		evm.cutCookie(config.cookieKey);
	}
	//添加视图按键管理器
	mod.addListener = function() {
		evm.controller.subscribe({
			type: 1,
			method: 'add',
			callback: mod.grabEvent,
			context: mod
		});
	};
	// console.log(mod)
	//移除视图按键管理器
	mod.removeListener = function() {
		evm.controller.subscribe({
			type: 1,
			method: 'remove',
			callback: mod.grabEvent,
			context: mod
		});
	};
	// console.log(module)
	//视图按键管理

	mod.grabEvent = function(key) {
		var me = mod;
		//拦截返回键,方法返回isBlock是1或0,默认0不拦截
		var isBlock = 0;

		if(module && module.grabEvent) {
			isBlock = module.grabEvent(key) || 0;
		}

		return isBlock;
	};
	//模块存取器
	mod.module = function(mID) {
		if(modules[mID]) {
			module = modules[mID].module || null;
		}

		return module;
	};

	//切换当前模块
	mod.handle = function(directive) {
		var me = mod;
		if(modules[moduleId].map &&
			(typeof modules[moduleId].map[directive] == 'number')) {

			moduleId = modules[moduleId].map[directive];

			return me.module(moduleId);
		}
	};
	mod.paint = function() {
		var me = mod;
		/*if(data.length > 0) {
			str = '';
			for(var i = 0; i < data.length; i++) {
				str += "<div class='model' >";
				if (data[i].img_url!="") {
					str += " <img src=" + data[i].img_url + ">";
				}
				str += "</div>"
			}
			evm.$('list').innerHTML = str;
		}*/
		me.addListener();
		return me;
	};

	mod.run = function() {
		var me = mod;
		//默认moduleId = 0 导航栏
		//cookie得到焦点
		me.paint();
		var nav = mod.module(moduleId);
		cmsIndex.handle('index');
		index.toggleFocus()

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
	modName: 'index',
	modNum: cmsIndex.moduleGuid(),
	map: {

	}
};

var index = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function() {
	var mod = {},

		listName = 'con',
		length = 1, //框内元素数量
		//      containerId = 'right',
		checkCookie = true; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'index';

	mod.modNum = cmsIndex.moduleGuid();

	mod.clearCss = function() {
		var me = mod;
		elem = evm.$('main');

		return me;
	};

	mod.toggleFocus = function() {
		var me = mod;
		elem = evm.$('main');

//		if(hasIndex) {
//			index = parseInt(hasIndex);
//			console.log(hasIndex)
//			EVM.cookie.setValue('indexIndex', '');
//			hasIndex = '';
//		}
//		if(index >= 0) {
//
//			elem[index].className = elem[index].className + ' active';
//
//		}
		getMessage();
		return me;
	};

	//赋值

	mod.action = function(directive) {
		var me = mod;
		switch(directive) {
			case 'back':
				EVM.cookie.setValue('indexIndex', '');
				var backs = getParam('backs');				
					window.history.go(-1);
	
				break;
			case 'enter':
				EVM.cookie.setValue('indexIndex', index);
				EVM.cookie.deleteValue('datasIndex');

				break;

		}
		return me;
	};
	mod.grabEvent = function(key) {
		var me = mod;
		//拦截返回键,方法返回isBlock是1或0,默认0不拦截
		var isBlock = 0;
		switch(key) {

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