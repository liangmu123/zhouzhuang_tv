// JavaScript Document
var playerTime = (7 * 60 + 13) * 1000,
    playerID = -1;


var mediaUrl = 'http://172.16.179.16/mp4/909.m3u8';

function mediaInit() {
    var appName = window.navigator.appName;

    // if(appName.indexOf('iPanel') > -1) {
    //     alert(iPanel.System.revision);

    var mediaSource = "http://172.16.179.16/mp4/909.m3u8";
    try {
        mp = new MediaPlayer();
        //mp = var mp = iPanel.mainFrame.mp;
    } catch (e1) {
        alert("e1: " + e1);
    }
    try {





        // mp.initMediaPlayer(instanceId,playListFlag,videoDisplayMode, height,width,left,top,muteFlag,useNativeUIFlag,subtitleFlag,videoAlpha,cycleFlag,randomFlag,autoDelFlag);
        mp.initMediaPlayer(instanceId);
        mp.setSingleMedia(mediaSource);
        mp.setVideoDisplayArea(89, 110, 468, 322);
        //显示的位置
        mp.setVideoAlpha(100);
        // mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
        mp.setVideoDisplayMode(0);
        // mp.setVideoDisplayArea(left,top,width,height);
        mp.setNativeUIFlag(1);
        mp.setProgressBarUIFlag(1);
        mp.refreshVideoDisplay();

        mp.playFromStart();
    } catch (e2) {
        alert("e2: " + e2);
    }
    // }
}

var focus_i = 0;// 0,1,2,3,4,5,6,7,8,9,10,11
var focus_i_max = 11;//11
var focus_col_count = 3;	// 4 一行有多少项,即多少列
var focus_row_count = 4;	// 3 两行
function setFocus() {

    document.getElementById("items_focus").style.display = "none";
    var distance = (focus_i == 0 || focus_i == 3 || focus_i == 6 || focus_i == 9) ? 118 :
        ((focus_i == 1 || focus_i == 4 || focus_i == 7 || focus_i == 10) ? 119 : 116);
    document.getElementById("items_focus").style.left = (15 + distance * (focus_i % focus_col_count)) + "px";
    document.getElementById("items_focus").style.top = (0 + 100 * (parseInt(focus_i / focus_col_count))) + "px";
    document.getElementById("items_focus").style.display = "block";
    if (focus_i == 12) {
        document.getElementById("items_focus").style.display = "none";
        document.getElementById("items_focus").style.left = "-100px";
        document.getElementById("items_focus").style.top = "10px";
        document.getElementById("items_focus").style.display = "block";
    }
}

function enterFocus() {
    if (_is_complete) {
        if (_tip_msg) {
            document.getElementById('tip_msg').style.display = 'none';
            _tip_msg = false;
        } else {
            if (focus_i == 0) {
                window.location = "../yigao_localPurchase.php";
            }
            if (focus_i == 1) {
                window.location = "../a_house_ad.php";
            }
            if (focus_i == 2) {
                window.location = "../dt_wyfw.php";
            }
            if (focus_i == 3) {
                window.location = "";
            }
            if (focus_i == 4) {
                window.location = "";
            }
            if (focus_i == 5) {
                window.location = "";
            }
            if (focus_i == 6) {
                window.location = "";
            }
            if (focus_i == 7) {
                window.location = "";
            }
            if (focus_i == 8) {
                window.location = "";
            }
            if (focus_i == 9) {
                window.location = "";
            }
            if (focus_i == 10) {
                window.location = "";
            }
            if (focus_i == 11) {
                window.location = "";
            }
            if (focus_i == 12) {
                mediaPlayProcess();
            }
        }
    }
}

var isFullScreen = false, isPaused = false;

function mediaPlayProcess() {
    if (isFullScreen) {
        mp.setVideoAlpha(0);
        mp.setVideoDisplayMode(1);
        mp.setProgressBarUIFlag(1);
        mp.refreshVideoDisplay();
        isFullScreen = false;
    } else {
        mp.setVideoAlpha(100);
        mp.setVideoDisplayMode(0);
        mp.setProgressBarUIFlag(1);
        mp.refreshVideoDisplay();
        isFullScreen = true;
    }
}

function focusLeft() {
    if (_is_complete) {
        if (!_tip_msg) {
            if (focus_i == 0) {
                focus_i = 13;

            }


            if (focus_i > 0) {
                focus_i--;
            } else {
                focus_i = focus_i_max;
            }
            setFocus();
        }
    }
}

function focusRight() {
    if (_is_complete) {
        if (!_tip_msg) {
            if (focus_i < focus_i_max)
                focus_i++;
            else
                focus_i = 0;
            setFocus();
        }
    }
}

function focusDown() {
    if (_is_complete) {
        if (!_tip_msg) {
            if (focus_i == focus_i_max) {
                focus_i = 0;
            } else if (focus_i >= focus_col_count * (focus_row_count - 1)) {
                focus_i = focus_i + focus_col_count - focus_i_max;
            } else {
                focus_i = focus_i + focus_col_count;
            }
            setFocus();
        }
    }
}

function focusUp() {
    if (_is_complete) {
        if (!_tip_msg) {
            if (focus_i == 0) {
                focus_i = focus_i_max;
            } else if (focus_i < focus_col_count) {
                focus_i = focus_i - focus_col_count + focus_i_max; // + 1 - 1;
            } else {
                focus_i = focus_i - focus_col_count;
            }
            setFocus();
        }
    }
}

function focusPageUp1() {

    if (focus_i == 12) {
        mp.fastForward(8);
    }
}

function focusPageDown1() {
    if (focus_i == 12) {
        mp.fastRewind(-8);
    }
}

function focusPause() {
alert(mp.pause());
    mp.pause();
    if (focus_i == 12) {
        if (isPaused) {
            mp.resume();
            isPaused = false;
        } else {
            mp.pause();
            isPaused = true;
        }
    }
}

var _tip_msg = false,
    _is_complete = false,
    tip_show_i = 0,
    startTime,
    stopTime;

function globalInit() {
    startTime = new Date().getTime();

    var clientid = GetStbNo();
    alert('clientid=' + clientid);

    if (clientid == '' || clientid == null) {
        clientid = '99776615490104581';
    }


    _is_complete = true;
    var res = json2obj('');
    /*stopTime = new Date().getTime();
    alert((stopTime-startTime));*/
    if (res['reg'] == 0) {
        document.getElementById('tip_msg').style.display = 'block';
        document.getElementById('tip_content').innerHTML = '您的机顶盒尚未注册';
        _tip_msg = true;
    } else if (res['reg'] == 1) {

    }
    document.getElementById('telphone').innerHTML = res['tel'];
    document.getElementById("notice").innerHTML = "<marquee scrollamount=1 scrolldelay=4 >" + res['ad'] + "</marquee>";


}

window.onload = function () {

    globalInit();
    setFocus();
    timeInit();
    mediaInit();
    timerID = window.setInterval(timeInit, timerTime);
};
document.onkeydown = initKeydown;