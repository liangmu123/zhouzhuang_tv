function clock() {
	var time = document.getElementById("time");
	var date = new Date();
	var weeks = ['日', '一', '二', '三', '四', '五', '六'];
	var y = date.getFullYear(),
		m = date.getMonth() + 1,
		d = date.getDate(),
		h = adjust(date.getHours()),
		minu = adjust(date.getMinutes()),
		w = weeks[date.getDay()],
		sec = date.getSeconds();
	time.innerHTML = y + '年' + m + "月" +
		d + "日&nbsp;&nbsp;" + '星期' + w + '&nbsp;&nbsp;' + h + (sec % 2 === 0 ? ":" : "&nbsp;") + minu;

	function adjust(num) {
		return(num < 10) ? "0" + num : num;
	}
}
var date = new Date();
var year = date.getFullYear();

clock();



//取url参数
function getParam(paramName) {
	paramValue = "";
	isFound = false;
	if(this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
		arrSource = decodeURI(this.location.search).substring(1, this.location.search.length).split("&");
		i = 0;
		while(i < arrSource.length && !isFound) {
			if(arrSource[i].indexOf("=") > 0) {
				if(arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
					paramValue = arrSource[i].split("=")[1];
					isFound = true;
				}
			}
			i++;
		}
	}
	return paramValue;
}