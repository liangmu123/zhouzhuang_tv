//导航栏图标尺寸156*160,116*120

//获取机顶盒或浏览器信息
var env = evm.getStbBrowser();
var hasIndex = EVM.cookie.getValue('hdindex');

function setClass(element, className) {
	if(isNotNullObject(element)) {
		if(className != element.className)
			element.className = className;
	}
}

function isNotNullObject(object) {
	if((null != object) && ("object" == typeof object))
		return true;
	else
		return false;
}

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
 * 调试
 */
var assert = (function() {
	var isOpen = false;
	var elem = document.getElementById('debug');

	function fn(v, flag) {
		if(!isOpen) {
			return;
		}
		if(!flag) {
			elem.innerHTML = v;
		} else {
			elem.innerHTML = elem.innerHTML + '<br/>' + v;
		}
	};

	fn.open = function(b) {
		if(typeof b == 'undefined') {
			return;
		}
		try {
			isOpen = Boolean(b);
		} catch(E) {
			isOpen = b;
		}

	};

	fn.clean = function() {
		elem.innerHTML = "";
	};
	return fn;
})();

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

	//显示和隐藏界面
	mod.toggle = function() {
		var me = this
		var elem = evm.$('viewport');
		evm.css(elem, {
			display: (evm.getStyle(elem, 'display') == 'none' ? 'block' : 'none')
		});
		return me;
	};

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
		//调用所有模块的paint函数
        
		me.addListener();
		return me;
	};

	mod.run = function() {
		var me = mod;
		//默认moduleId = 0 导航栏
		var nav = mod.module(moduleId);
		navIndex.setItems(Data).paint();
		if(EVM.cookie.getValue('') != null) {
			me.handle('left');
			left.toggleFocus();
		} else {
			me.handle('up');
			navIndex.toggleFocus();
		}
		//控制器管理按键
		evm.on(document, (!env.stb ? 'keydown' : (env.stb == 'iPanel' ?
			'irkeypress' : 'keydown')), evm.controller, evm);

		me.paint();

		return me;
	};

	return mod;

})();

/*
 * 0.导航栏
 */
cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
	modName: 'navIndex',
	modNum: cmsIndex.moduleGuid(),
	map: {
		left: 0
	}
};

var navIndex = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function() {

	var mod = {},
		items,
		size = 0,
		isBuilt = false,
		index = 0,
		number = Data.length,
		containerId = 'nav';

	checkCookie = false; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'index';
	mod.modNum = cmsIndex.moduleGuid();
	//取得本地COOKIE 上次的焦点位
	var arr = document.cookie.match(new RegExp("(^| )" + 'h_index' + "=([^;]*)(;|$)"));
	if(arr != null) index = Number(unescape(arr[2]));
	index = 0;
	mod.setItems = function(data) {
		var me = mod;
		items = data;
		size = data.length;
		page = 0;
		totalPage = Math.ceil(size / number) - 1;
		return me;
	};

	mod.number = function(num) {
		if(typeof num == 'number') {
			index = num;
		}
		return index;
	};

	mod.paint = function() {
		var me = mod,
			str = '',
			i = 0,
			start = 0,
			elem = evm.$(containerId);
		for(var i = 0; i < items.length; i++) {

			str += '<div id=' + containerId + '-list-' + i + '><img width=270px style="margin-top:20px; margin-left:30px" src="' + items[i].img_url + '">';
			str += "<div style= 'text-align: center;color:black;font-size:28px'>" + items[i].name + "</div></div>"
		}
		evm.html(elem, str);

		return me;
	};

	mod.toggleFocus = function(flag) {

		var me = mod;
		if(flag == 0) {
			index = 0
		}
		for(var i = number - 1; i >= 0; i--) {
			elem = evm.$(containerId + '-list-' + i);
			//        elem.children[0].setAttribute('src',items[i].img_url);
			elem.style.borderStyle = ""
			elem.style.borderColor = ""
			elem.style.borderRadius = "5px"
		}
		
		if(hasIndex) {
			index = parseInt(hasIndex);
			console.log(hasIndex)
			EVM.cookie.setValue('hdindex', '');
			hasIndex = '';
		}
		
		elem = evm.$(containerId + '-list-' + index);
		//      elem.children[0].setAttribute('src',items[index].img_focus);

		
		if(index >= 0) {

			elem.style.borderStyle = "solid"
			elem.style.borderColor = "red"
			elem.style.borderWidth = "5px"
			elem.style.borderRadius = "5px"
		}
		//      elem.style.borderStyle="solid"
		//	    elem.style.borderColor="#FCE105"
		//	    elem.style.borderWidth="5px"
		//	    elem.style.borderRadius="5px"
		//      for 循环内就可以设置未选中的状态的属性  循环外设置选中的状态

		return me;
	};

	mod.cleanCss = function() {
		var me = mod;
		for(var i = number - 1; i >= 0; i--) {
			elem = evm.$(containerId + '-list-' + i);
			//        elem.children[0].setAttribute('src',items[i].img_url);
		}
		return me;
	}

	mod.moveH = function(directive) {

		var me = mod,
			len = number;

		if(directive == "forwards") {
			directive = 1;
		} else {
			directive = -1;
		}
		index = (index + directive);
		if(index > number - 1) {
			index = 0
		}
		if(index < 0) {
			index = number - 1
		}
		me.toggleFocus();

		return me;
	};
	mod.moveU = function(directive) {

		var me = mod,
			len = number;
		if(directive == "up") {
			if(index == 0) {
				index = 0
			} else if(index == 1) {
				index = 0
			} else if(index == 2) {
				index = 0
			} else if(index == 3) {
				index = number - 3
			}
		} else {
			directive = 1;
			index = (index + directive);
			if(index > number - 1) {
				index = 0
			} else if(index == 1) {
				index = number - 2
			} else if(index == 2) {
				index = number - 1
			} else if(index == 3) {
				index = number - 3
			}
		}

		me.toggleFocus();

		return me;
	};
	mod.action = function(directive) {

		var me = mod,
			result;
		switch(directive) {
			case 'back':
				deleteCookie();
				window.location.href = 'index.html';
				break;
			case 'enter':
				//特殊处理: 判断栏目ID
//				var url = items[index].url;
				EVM.cookie.setValue('hdindex', index);

				 /*if (index!=6) {
				   url+='?id='+id;
				 }else{
				   url+='?act=pingyi_list&id='+id;
				 }
				if(url) {
					var Days = 30;
					var exp = new Date();
					exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
					document.cookie = "h_index=" + escape(index) + ";expires=" + exp.toGMTString();
					EVM.cookie.deleteValue('home_index');
					
				}*/
				
				window.location.href = 'zdemo.html';
				break;
		}
		return me;
	};

	mod.grabEvent = function(key) {
		var me = mod;
		//拦截返回键,方法返回isBlock是1或0,默认0不拦截
		var isBlock = 0;
		switch(key) {
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
				break;
			case keymap.Inspur.EXIT:
			case keymap.iPanel.EXIT:
			case 0:

				break;
		}
		return isBlock;
	};

	return mod;
})();

cmsIndex.run();