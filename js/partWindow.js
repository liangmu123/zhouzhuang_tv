var data = [{
		"name": '走进党建 <img style="width:28px;vertical-align:middle;margin-top:5px;" src="img/play.png" />',
		"tpe": "null",
		"id": "101"
	},
	{
		"name": "党组织活动",
		"tpe": "0",
		"id": "102"
	},
	{
		"name": "志愿者活动",
		"tpe": "1",
		"id": "103"
	}
];

//获取机顶盒或浏览器信息
var env = evm.getStbBrowser();
var typedrive = env.browser;

var leftindex = EVM.cookie.getValue('leftindex');

var rightindex = EVM.cookie.getValue('rightindex');

var elem;
var tpe;
var size = 5;
var page = 1;
var strings;
var flag = true;

function setstate() {
	var loop = setInterval(function() {
		if(flag) {
			video_sec = mp.getMediaDuration(); //获取视频总秒数的方法
			content = mp.getCurrentPlayTime(); //统计用的总秒数,获取视频当前秒数的方法
			if(parseInt(content) == parseInt(video_sec) - 2) {
				mp.playByTime(1, 1, 0); //中间是你想要跳转的时间
			}
		} else {

		}

	}, 1000)

}
var outtime = function() {
	settimeout(function() {
		leftindex = $('.focusselect')[0].getAttribute('leftselect');
		if (leftindex==0) {
			MP.resume(); //继续播放
		} else{
			MP.pause(); //暂停
		}
	},500)
}

function getdata(strings) {
	if(tpe == "null") {
		var strs = '';
		//		strs += '<div class="rightDiv"></div>' ;
		$('#rightMeun').html(strs)
		$('#page').hide()
		$('#rightMeun').removeClass('pinkbg')
	} else {
		$.ajax({
			type: 'get',
			url: api + activityList + "?is_team=0&tpe=" + tpe + "&pagesize=" + size + "&page=" + page,
			dataType: "jsonp",
			jsonp: "callback",
			success: function(res) {
				console.info(res)
				item = res.data.items
				var strs = '';
				for(var i = 0; i < item.length; i++) {

					strs += '<div class="rightDiv" data-id=' + item[i].id + '>';
					strs += '<div style="float:left" class="titles">' + item[i].title + '</div>';
					strs += '<div style="float:right" class="addtime">' + item[i].format_start_time.substring(0, 10) + '</div>';
					//				strs += '<img style="display:none;" width="200px" height="120px" src='+item[i].images+'></div>' ;
					strs += '</div>';
				}

				$('#rightMeun').html(strs)
				$('#now_page').html(page);
				$('#total_page').html(res.data.totalpage);
				$('#page').show()
				$('#rightMeun').addClass('pinkbg');
				setTimeout(function() {
					if(index == 0) {
						MP.resume(); //继续播放
						flag == true;
					} else {
						MP.pause(); //暂停
						flag == false;
					}
				}, 200)

				if(strings == '666') {
					logins.toggleFocus();
				} else {
					if(rightindex) {

						cmsIndex.handle('logins')
						indexx = parseInt(rightindex);
						console.log(rightindex)
						EVM.cookie.setValue('rightindex', '');
						rightindex = '';
						logins.toggleFocus();
					}
				}

			},
			error: function() {
				alert('系统错误');
			}
		});
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
				str += "<div class='leftDiv'" + " tpe=" + data[i].tpe + " leftSelect=" + i + " data-id=" + data[i].id + " >";
				str += data[i].name
				str += "</div>"
			}
			$('#leftMeun').html(str);
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
		listName = 'leftDiv',
		length = data.length, //框内元素数量
		//      containerId = 'right',
		checkCookie = true; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'indexs';

	mod.modNum = cmsIndex.moduleGuid();

	mod.clearCss = function() {
		var me = mod;
		elem = $('.leftDiv');
		for(i = 0; i < length; i++) {
			elem[i].className = listName;
		}
		elem[index].className = elem[index].className + ' focusselect';
		return me;
	}

	mod.toggleFocus = function() {
		var me = mod;
		elem = $('.leftDiv');
		for(i = 0; i < length; i++) {
			elem[i].className = listName;
		}
		if(leftindex) {
			index = parseInt(leftindex);
			console.log(leftindex)
			EVM.cookie.setValue('leftindex', '');
			leftindex = '';
		}

		if(index >= 0) {

			elem[index].className = elem[index].className + ' focus';

		}

		tpe = $('.focus')[0].getAttribute('tpe');
		if(rightindex) {
			me.clearCss();

			page = EVM.cookie.getValue('now_page')
		}
		getdata(66);

		return me;
	};

	//赋值

	mod.moveH = function(directive) {
		var me = mod;
		if(directive == "backwards") { //左
			console.log('leftleft')
			mod.toggleFocus();

		} else if(directive == 'forwards') { //右
			console.log('rightright')
			me.clearCss()
			indexx = 0;
			cmsIndex.handle('logins');
			logins.toggleFocus()

		}

		return me;
	};
	mod.moveU = function(directive) {
		var me = mod;

		if(directive == "up") { //上
			if(index > 0) {
				index--
			}

		} else if(directive == "down") { //下
			if(index < data.length - 1) {
				index++
			}
		}
		me.toggleFocus();
		return me;
	};
	mod.action = function(directive) {
		var me = mod;
		switch(directive) {
			case 'back':
				clearInterval(loop);
				EVM.cookie.setValue('leftindex', '');
				EVM.cookie.setValue('rightindex', '');
				EVM.cookie.setValue('now_page', '');
				window.history.go(-1);
				break;
			case 'enter':
				if(tpe == "null") {
					MP.resume(); //继续播放
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
 * 0.right侧区
 */

cmsIndex.modules[cmsIndex.moduleGuid(cmsIndex.addModule())] = {
	modName: 'logins',
	modNum: cmsIndex.moduleGuid(),
	map: {
		indexs: 0,
	}
};

var logins = cmsIndex.modules[cmsIndex.moduleGuid()].module = (function() {
	var mod = {},
		listName = 'rightDiv'
	checkCookie = true; //配置是否定位焦点到二级栏目，默认否

	mod.modName = 'logins';

	mod.modNum = cmsIndex.moduleGuid();

	mod.clearCss = function() {
		var me = mod;
		elem = $('.rightDiv');
		var lengths = elem.length; //框内元素数量
		for(i = 0; i < lengths; i++) {
			elem[i].className = listName;
		}
		$('#rightMeun').removeClass('focusvideo')
		return me;
	};
	mod.toggleFocus = function() {
		var me = mod;
		elem = $('.rightDiv');
		var lengths = elem.length;
		for(i = 0; i < lengths; i++) {
			elem[i].className = listName;
		}
		if(indexx >= 0) {
			if(tpe == 'null') {
				$('#rightMeun').addClass('focusvideo')
			} else {
				elem[indexx].className = elem[indexx].className + ' focus';
			}

		}

		return me;
	};

	//赋值

	mod.moveH = function(directive) {
		var me = mod;
		t_page = document.getElementById('total_page').innerText
		if(directive == "backwards") { //左
			console.log('leftleft');
			if(page == 1) {
				indexx = 0;
				me.clearCss()
				cmsIndex.handle('indexs');
				indexs.toggleFocus()
			} else {
				page--;
				indexx = 0;
				getdata(666)
			}

		} else if(directive == 'forwards') { //右
			console.log('rightright')
			if(parseInt(page) < parseInt(t_page)) {
				page++;
				indexx = 0;
				getdata(666)

			}

		}

		return me;
	};
	mod.moveU = function(directive) {
		var me = mod;

		var lengths = $('.rightDiv').length;
		if(directive == "up") { //上
			if(indexx > 0) {
				indexx--
			}
		} else if(directive == "down") { //下
			if(indexx < lengths - 1) {
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
				clearInterval(loop);
				window.history.go(-1);

				break;
			case 'enter':
				if(tpe == "null") {
					window.location.href = "partvideo.html";
				} else {
					leftindex = $('.focusselect')[0].getAttribute('leftselect');
					EVM.cookie.setValue('leftindex', leftindex);
					EVM.cookie.setValue('rightindex', indexx);
					EVM.cookie.setValue('now_page', page);
					var id = $('.focus')[0].getAttribute('data-id');
					//window.location.href = 'chuang-xq.html?id=' + id;
					window.location.href = 'chuang-detail.html?id=' + id;
					break;
				}

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