//模块信息
var data = [{
		name: "党建之窗",
		id: 1,
		url: "partWindow.html",
		img_url: "img/index/1.png",
	},
	{
		name: "三会一课",
		id: 1,
		url: "threeSessions.html",
		img_url: "img/index/2.png",
	},
	{
		name: "党员活动",
		id: 1,
		url: "activity.html",
		img_url: "img/index/3.png",
	},
	{
		name: "党员风采",
		id: 1,
		url: "fengcai.html",
		img_url: "img/index/4.png",
	},
	{
		name: "争先创优",
		id: 1,
		url: "zhengxian.html",
		img_url: "img/index/5.png",
	},
	{
		name: "通知公告",
		id: 1,
		url: "tongzhi.html",
		img_url: "img/index/6.png",
	},
	{
		name: "会议直播",
		id: 1,
		url: "huodong.html",
		img_url: "img/index/nav_huiyizhibo_n.png",
	},
	{
		name: "视频会议",
		id: 1,
		url: "Demo.html",
		img_url: "img/index/nav_shipinhuiyi_n.png",
	},
	{
		name: "中间视频",
		id: 1,
		url: "indexvideo.html",
		img_url: "",
	},
	{
		name: "广告",
		id: 1,
		url: "",
		img_url: "img/index/advertisement.png",
	}

];

//获取机顶盒或浏览器信息
var env = evm.getStbBrowser();
var typedrive = env.browser;

var hasIndex = EVM.cookie.getValue('sjzd');

var elem;

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
		if(data.length > 0) {
			str = '';
			for(var i = 0; i < data.length; i++) {
				str += "<div class='model' >";
				if(data[i].img_url != "") {
					if(i == 6 || i == 7) {
						str += " <img class='content-img left' src=" + data[i].img_url + ">";
					} else {
						str += " <img class='content-img' src=" + data[i].img_url + ">";
					}

				} else {
					str += " <div class='content-img' " + "></div>";
				}
				str += "</div>"
			}
			$('#nav').html(str);
		}
		me.addListener();
		return me;
	};

	mod.run = function() {
		var me = mod;
		//默认moduleId = 0 导航栏
		//cookie得到焦点
		me.paint();
		var nav = mod.module(moduleId);
		cmsIndex.handle('indexs');
		indexs.toggleFocus()

		//控制器管理按键
		evm.on(document, (!env.stb ? 'keydown' : (env.stb == 'iPanel' ?
			'irkeypress' : 'keydown')), evm.controller, evm);

		return me;
	};

	return mod;

})();

/*
 * 0.index侧区
 */

cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
	modName: 'indexs',
	modNum: cmsIndex.moduleGuid(),
	map: {
		logins: 1,
	}
};

var indexs = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function() {
	var mod = {},
		index = 0, //右侧选中地址位置
		listName = 'content-img',
		length = 9, //框内元素数量
		//      containerId = 'right',
		checkCookie = true; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'indexs';

	mod.modNum = cmsIndex.moduleGuid();

	mod.celarCss = function() {
		var me = mod;
		elem = $('.content-img');
		for(i = 0; i < length; i++) {
			elem[i].className = listName;
		}
		return me;
	}

	mod.toggleFocus = function() {
		var me = mod;
		elem = $('.content-img');
		for(i = 0; i < length; i++) {
			elem[i].className = listName;
		}

		if(hasIndex) {
			index = parseInt(hasIndex);
			console.log(hasIndex)
			EVM.cookie.setValue('sjzd', '');
			hasIndex = '';
		}
		if(index >= 0) {

			elem[index].className = elem[index].className + ' active';

		}
		return me;
	};

	//赋值

	mod.moveH = function(directive) {
		var me = mod;
		if(directive == "backwards") { //左
			console.log('leftleft')
			if(index <= 0 || index == 7 || index == 6) {

			} else if(index == 8) {
				index = 6
			} else {
				index--
			}

		} else if(directive == 'forwards') { //右
			console.log('rightright')
			if(index >= 8 || index == 5) {

			} else if(index == 6) {
				index = 8
			} else {
				index++
			}
		}
		mod.toggleFocus();
		return me;
	};
	mod.moveU = function(directive) {
		var me = mod;

		if(directive == "up") { //上
			if(index == 6 || index == 8) {
				index = 0
				me.toggleFocus();
			} else if(index == 7) {
				index--
				me.toggleFocus();
			} else {
				me.celarCss();
				cmsIndex.handle('logins')
				logins.toggleFocus()

			}
		} else if(directive == "down") { //下
			if(index == 0) {
				index = 6;
			} else if(index == 7 || index == 8) {

			} else if(index == 6) {
				index++
			} else {
				index = 8
			}
			me.toggleFocus();
		}

		return me;
	};
	mod.action = function(directive) {
		var me = mod;
		switch(directive) {
			case 'back':
				EVM.cookie.setValue('sjzd', '');
				window.history.go(-1);

				break;
			case 'enter':
				mp.stop();
				mp.close();
				mp.unbindID();
				EVM.cookie.setValue('sjzd', index);
				if(data[index].url != "") {
					if(index == 7) {
						var str='{"id":"20","name":"startAPP","value":"com.aibugu.video.chat_tv_wx","param":""}';
						Android.JSONCall(str);
					}else{
						window.location.href = data[index].url;
					}		
					
				}
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
				me.action('back');
				break;
			case keymap.Inspur.EXIT:
			case keymap.iPanel.EXIT:
			case 0:
				//				window.location.href = "index.html";
				break;
		}
		return isBlock;
	};

	return mod;
})();

/*
 * 0.index侧区
 */

cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
	modName: 'logins',
	modNum: cmsIndex.moduleGuid(),
	map: {
		indexs: 0,
		bottones: 2
	}
};

var logins = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function() {
	var mod = {},
		length = 0, //框内元素数量
		//      containerId = 'right',
		checkCookie = true; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'logins';

	mod.modNum = cmsIndex.moduleGuid();

	mod.clearCss = function() {
		var me = mod;

		elem = $('.name')[0];

		elem.className = 'name';

		return me;
	};
	mod.toggleFocus = function() {
		var me = mod;

		elem = $('.name')[0];

		elem.className = elem.className + ' active';

		return me;
	};

	//赋值

	mod.moveH = function(directive) {
		var me = mod;
		if(directive == "backwards") { //左
			console.log('leftleft');

		} else if(directive == 'forwards') { //右
			console.log('rightright')

		}
		mod.toggleFocus();
		return me;
	};
	mod.moveU = function(directive) {
		var me = mod;

		if(directive == "up") { //上

		} else if(directive == "down") { //下
			me.clearCss()
			cmsIndex.handle('indexs');
			indexs.toggleFocus();
		}

		return me;
	};
	mod.action = function(directive) {
		var me = mod;
		switch(directive) {
			case 'back':

				window.history.go(-1);

				break;
			case 'enter':
				$("input").val("");
				$('#login').show()
				cmsIndex.handle('bottones');
				bottones.toggleFocus()
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
				me.action('back');
				break;
			case keymap.Inspur.EXIT:
			case keymap.iPanel.EXIT:
			case 0:
				//				window.location.href = "index.html";
				break;
		}
		return isBlock;
	};

	return mod;
})();

/*
 * 2.bottones
 */

cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
	modName: 'bottones',
	modNum: cmsIndex.moduleGuid(),
	map: {
		logins: 1
	}
};

var bottones = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function() {
	var mod = {},
		length = 4, //框内元素数量
		indexx = 0, //框内元素数量
		listName = 'select',
		//      containerId = 'right',
		checkCookie = true; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'bottones';

	mod.modNum = cmsIndex.moduleGuid();

	mod.clearCss = function() {
		var me = mod;

		for(i = 0; i < length; i++) {
			elem[i].className = listName;
		}

		return me;
	};
	mod.toggleFocus = function() {
		var me = mod;
		elem = $('.select');
		for(i = 0; i < length; i++) {
			elem[i].className = listName;
		}
		elem[indexx].className = elem[indexx].className + ' active';
		if(indexx == 0) {
			$('input')[0].focus()
		} else if(indexx == 1) {
			$('input')[1].focus()
		} else {
			$('input').blur();
			$('.select')[2].focus()
		}

		return me;
	};
	//赋值

	mod.moveH = function(directive) {
		var me = mod;
		if(directive == "backwards") { //左
			console.log('leftleft');
			if(indexx = 3) {
				indexx = 2
			}

		} else if(directive == 'forwards') { //右
			console.log('rightright')
			if(indexx == 2) {
				indexx = 3
			}

		}
		mod.toggleFocus();
		return me;
	};
	mod.moveU = function(directive) {
		var me = mod;

		if(directive == "up") { //上
			if(indexx <= 0) {

			} else {
				indexx--
			}
		} else if(directive == "down") { //下
			if(indexx >= 3) {

			} else {
				indexx++
			}
		}
		me.toggleFocus()
		return me;
	};
	mod.action = function(directive) {
		var me = mod;
		switch(directive) {
			case 'back':
				$('input').blur();
				$('#login').hide();

				cmsIndex.handle('logins');
				logins.toggleFocus()

				break;
			case 'enter':

				//				$('#enters').focus()
				if(indexx == 2) {
					var user = $('input')[0].value;
					var pwd = $('input')[1].value;

					$.ajax({
						type: 'get',
						url: api + login + "?username=" + user + "&&password=" + pwd,
						dataType: "jsonp",
						jsonp: "callback",
						async: false,
						cache: false,
						success: function(data) {
							codenum = data.code;
							if(codenum == 0) {
								alert("登陆成功");
								setval();

							} else {
								$('#alerts').show()
								$('#alerts').html('提示：密码有误')
							}
						},
						error: function() {
							alert('系统错误');
						}
					});

					function setval() {
						$.ajax({
							type: 'get',
							url: api + gerenxinxi,
							dataType: "jsonp",
							jsonp: "callback",
							async: false,
							cache: false,
							success: function(data) {
								console.info('个人信息：',data);
								var d = data.data.party_member;
								EVM.cookie.setValue('username', d.name);
								EVM.cookie.setValue('jifen', data.data.scores);
								EVM.cookie.setValue('id', data.data.id);
								$('#name').html(d.name);
								$('#alerts').show();
								$('#alerts').html('提示：登陆成功')
								setTimeout(
									function(){
										$('#login').hide();
										$('#alerts').hide()
										cmsIndex.handle('logins');
										logins.toggleFocus()
									},2000
								)
								
							},
							error: function() {
								alert('系统错误');
							}
						});
					}

				} else if(indexx == 3) {
					indexx = 0;
					$('#login').hide();
					$('#alerts').hide()
					cmsIndex.handle('logins');
					logins.toggleFocus()
				}

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
				me.action('back');
				break;
			case keymap.Inspur.EXIT:
			case keymap.iPanel.EXIT:
			case 0:
				//				window.location.href = "index.html";
				break;
		}
		return isBlock;
	};

	return mod;
})();

cmsIndex.run();