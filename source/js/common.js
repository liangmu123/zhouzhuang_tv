// JavaScript Document
function getById(id){
	return document.getElementById(id);
}
function getByName(name) {
	return document.getElementsByName(name);
}
function lt10(_n){
	_n=parseInt(_n,10);
	return (_n<10)?'0'+_n:''+_n;
}
function timeInit() {
    var YMD = getById('YMD'),
    HM = getById('HM'),
	week = getById("week"),
    date  = new Date(),
    weeks = ['日','一','二','三','四','五','六'],
    y     = date.getFullYear(),
    m     = date.getMonth()+1,
    d     = date.getDate(),
    h     = lt10(date.getHours()),
    minu  = lt10(date.getMinutes()),
    w     = weeks[date.getDay()],
    sec   = lt10(date.getSeconds()); 
    YMD.innerHTML = y+'年'+lt10(m)+'月'+lt10(d)+'日';
    HM.innerHTML = h + ":" + minu;
	week.innerHTML = "星期" + w;
}
function initKeydown(e){
		var _e = initEvent(e||window.event);
		//alert(_e.code);
		switch(_e.code){
			case "KEY_SELECT": 
				enterFocus();
				break;
			case "KEY_EXIT":
				if(location.href.indexOf('ego/index.html') == -1) {
					var router = parseInt(getCookie("router")),
            url = "";
        switch (router) {
            case 0:
                url = "ego/index.html";
                break;
            case 1:
                if(location.href.indexOf("tcg_shopFirst.php?router=1") == -1){
                	
                	if(location.href.indexOf("tcg_goods_cat.php?cat_id=")  != -1){
                    history.go(-1);
                	}else{
                    url = "tcg_shopFirst.php?router=1";
                	}
                }else{
                  url = "yigao_localPurchase.php";
                }          
                break;
            case 2:                
                if(location.href.indexOf("tcg_shopFirst.php?router=2") == -1){
                	url = "tcg_shopFirst.php?router=2";
                }else{
                  url = "yigao_localPurchase.php";
                } 
                break;
            case 3:
                if(location.href.indexOf("tcg_shopFirst.php?router=3") == -1){
                	url = "tcg_shopFirst.php?router=3";
                }else{
                  url = "yigao_localPurchase.php";
                }                 
                break;
            case 4:
                if(location.href.indexOf("tcg_shopFirst.php?router=4") == -1){
                	url = "tcg_shopFirst.php?router=4";
                }else{
                  url = "yigao_localPurchase.php";
                }                
                break;
        }
          location.href = url;
				} else {
					location.href = 'http://172.20.224.23/epg/show.do';
				}				
				break;
			case "KEY_BACK": 
				focusBack();
				break;
			case "KEY_LEFT": 
				focusLeft();
				break;
			case "KEY_RIGHT": 
				focusRight();
				break;
			case "KEY_DOWN": 
				focusDown();
				break;
			case "KEY_UP": 
				focusUp();
				break;
			case "KEY_NUMERIC":
				focusNumeric(_e.args.value);
				break;
			case "KEY_PAGE_UP":
				focusPageUp1();
				break;
			case "KEY_PAGE_DOWN":
				focusPageDown1();
				break;
			case "KEY_PAUSE":
				focusPause();
				break;
	}
}

function initEvent(__event){
	var keycode = __event.which||__event.keyCode||__event.charCode;
	//alert("keycode: "+keycode);
	var code = "";
	var args = {};

	if(keycode < 58 && keycode > 47){//数字键
		args = {value: (keycode - 48), type: false};
		code = "KEY_NUMERIC";
	} else {
		var args = {modifiers: 0, value: keycode, type: false, p2: 0};
		switch(keycode){
		case 1://向上
		case 38:
		case 65362:	
		case 372://上页
		case 25:
		case 28:
			code = "KEY_UP";
			break;
		case 2://向下
		case 40:
		case 65364:	
		case 373://下页
		case 26:
		case 31:
			code = "KEY_DOWN";
			break;
		case 120://上页
		case 109://电脑键盘上页
			code = "KEY_PAGE_UP";
			break;
		case 121://下页
		case 111://电脑键盘下页
			code = "KEY_PAGE_DOWN";
			break;
		case 3://向左
		case 37:
		case 65361:
		case 29:
			code = "KEY_LEFT";
			break;
		case 4://向右
		case 39://
		case 65363:
		case 30:
			code = "KEY_RIGHT";
			break;
		case 13://选择
		case 65293:
		case 273:
			code = "KEY_SELECT";
			break;
		case 250://空白键（last channel）
			code = "KEY_LAST_CHANNEL";
			break;
		case 339:
		case 27:
		case 114:
			code = "KEY_EXIT";//退出键
			break;				
		case 340://返回
		case 65367:
		case 8:
		case 83:
		case 640:
		case 834://绿键
		case 1834:
		case 122:
			//alert("keycode: "+keycode);
			code = "KEY_BACK";//后退键
			break;
		/*case 834://绿键
		case 1834:
			code = "KEY_GREEN";
			break;*/
		case 512:
		case 197:
			code = "KEY_HOMEPAGE";					
			break;
		case 513://菜单
		case 4097:
		case 113:
			code = "KEY_MENU";					
			break;
		case 561://输入法
			code = "KEY_IME";
			break;
		case 595://音量+
			code="KEY_VOLUME_UP";
			args.type = true;
			break;
		case 596://音量-
			code="KEY_VOLUME_DOWN";
			args.type = true;
			break;
		case 597://静音
			code = "KEY_MUTE";
			args.type = true;
			break;
		case 832://红键
		case 1832:
			code = "KEY_RED";
			break;
		case 833://黄键
		case 1833:
			code = "KEY_YELLOW";
			break;
		case 835://蓝键
		case 1835:
			code = "KEY_BLUE";
			break;
		case 515://帮助键
			code = "KEY_HELP";
			break;
		case 112:
			code = "KEY_INFO";//信息键
			break;
		case 96:
			code = "KEY_F1";//指南键
			break;
		case 97:
			code = "KEY_F2";//股票键
			break;
		case 98:
			code = "KEY_F3";//邮件键
			break;
		case 99:
			code = "KEY_F4";//游戏键
			break;
		case 1046:
		case 90:
			code = "KEY_TV";//电视/广播
			break;
		case 3864:
			code = "KEY_PAUSE";//电视/广播
			break;
		}
	}
	return {code: code, args: args};
}
function show(id, height){//iPanel 2.0
	getById(id).style.height = height + 'px';
	getById(id).style.display = 'block';
}
function hide(id){//iPanel 2.0
	getById(id).style.display = 'none';
	getById(id).style.height = 0 + 'px';
}

var timerTime=10000, timerID=-1, imgTime = 6000, imgID = -1;
	
//footer 菜单导航url
var index_url = "yigao_localPurchase.php"; //首页
var cart_url = "tcg_flow.php?step=cart" //购物车
var account_url = "tcg_account_log.php?act=list"; //我的账户
var order_url = "yigao_allOrder1.php"; //我的订单
var winning_url = "tcg_prize_all.php"; //中奖公告
var help_center_url = "yigao_onlineService.php"; //帮助中心
//遥控器数字键，num值：1，2，3，4，5，6
function menu_nav_url(num) {
    var url = "";
    switch (num) {
    case 1:
        url = index_url;
        break;
    case 2:
        url = cart_url;
        break;
    case 3:
        url = account_url;
        break;
    case 4:
        url = order_url;
        break;
    case 5:
        url = winning_url;
        break;
    case 6:
        url = help_center_url;
        break;
    }
    location.href = url;
}
//ajax
var xhr;
function json2obj(_str) { //json to obj
    var _obj = eval('(' + _str + ')');
    return _obj;
}
var creatHttpRequest = function() {
    return (window.ActiveXObject) ? new window.ActiveXObject("microsoft.xmlhttp") : new window.XMLHttpRequest();
};

function get(url, async, callback) {
    xhr = creatHttpRequest();
    xhr.open("GET", url, async);
    xhr.setRequestHeader("Content-Type", "text/html;charset=utf-8");
    xhr.onreadystatechange = callback;
    xhr.send(null);
}

function post(url, async, data, callback) {
    xhr = creatHttpRequest();
    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = callback;
    xhr.send(data);
}

function setCookie(name,value,expiredays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie = name + "=" +escape(value) +
	((expiredays == null ? "" : ";expries"+exdate.toGMTString()));

}

function getCookie(name){
  if(document.cookie.length > 0){
  	start = document.cookie.indexOf(name + "=");
  	if(start != -1){
  		start = start + name.length + 1;
  		end = document.cookie.indexOf(";",start);
  		if(end == -1) end = document.cookie.length;
  		return unescape(document.cookie.substring(start,end));
  	}
  }
  return "";
}

var tip_msg = false;

/*提示框操作*/

window.$ = function(id){
	return document.getElementById(id) || id;
}

function tip_msg_show(msg,timeout){
    var tip = $("tip"),
    m = $("msg");
    m.innerHTML = msg; 
    if(timeout != undefined){
        setTimeout(tip_msg_hide, timeout);
    }
    tip.style.display = "block";
    tip_msg = true;
}

function tip_msg_hide(){
    var tip = $("tip");
    tip.style.display = "none";
    tip_msg = false;
}