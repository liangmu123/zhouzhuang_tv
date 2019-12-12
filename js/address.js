//var api = "http://zydj.cst-info.cn/api/v1/"; //测试地址
//var web_url = 'http://zydj.cst-info.cn/'; //图片地址


var api = "http://172.16.179.17/zydj/public/index.php/api/v1/"; //内网地址 ip
var web_url = 'http://172.16.179.16/zhouzhuang'; //图片地址


//var api = "http://122.194.12.38/index.php/api/v1/"; //公网地址



var login = "auth/login"; //登陆

var getsign = "commons/get_sign"; //获取登陆签名

var infoi = "passport/usertvinfo"; //个人信息

var numbs = "wechat/integralSort"; //积分排行

var noticelist = "article/noticeList"; //通知公告列表

var partyMember = "party/partyMemberAdv"; //党员列表

var partyDetails = "party/partyMemberAdvInfo"; //党员详情

var activityList = "activity/activityList"; //活动列表

var activity = "activity"; //活动详情

var meetingList = "meeting/meetingList"; //三会一课列表

var video = "meeting"; //三会一课视频详情

var articleList = "article/articleList"; //文章列表

var gerenxinxi = "passport/usertvinfo"; //个人信息

setTimeout(function() {
	var username = EVM.cookie.getValue('username');
	if(username) {
		$('#name').html(username)
	}
}, 500)