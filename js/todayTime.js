function clock() {
    var time  = document.getElementById("nowtime");
    var date  = new Date();
    var weeks = ['日','一','二','三','四','五','六'];
    var y     = date.getFullYear(),
        m     = date.getMonth()+1,
        d     = date.getDate(),
        h     = adjust(date.getHours()),
        minu  = adjust(date.getMinutes()),
        w     = weeks[date.getDay()],
        sec   = date.getSeconds();

    time.innerHTML = y + '年' + m + "月" +
        d + "日&nbsp;&nbsp;" + '星期' + w + '&nbsp;&nbsp;' + h + (sec%2===0?":":"&nbsp;") + minu;
    function adjust(num){
        return (num<10) ? "0" + num : num;
    }
    setTimeout(clock,1000);
}
var date  = new Date();
var year     = date.getFullYear();
if(year=='1970'){
    clock();
}else{
    clock();
}