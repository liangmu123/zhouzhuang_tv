//取url参数
function getParam(paramName) {
    paramValue = "";
    isFound = false;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = decodeURI(this.location.search).substring(1, this.location.search.length).split("&");
        i = 0;
        while (i < arrSource.length && !isFound) {
            if (arrSource[i].indexOf("=") > 0) {
                if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
}

//列表操作   
function listOperation(json) {
    this.structure = json.structure; // 结构 回退的位置
    this.type = json.type; //  类型 1 是多行单列 2 是多行多列
    this.key = json.key; //  操作键位 backwards左 forwards右 up上 down下 pageUph上一页 pageDown下一页
    this.likeState = json.likeState; // 是否开启点赞功能
    this.status = json.status; // 框位置 1在外框0在点赞框
    this.now_page = parseInt(json.now_page); //当前页数
    this.total_page = parseInt(json.total_page);//总页数
    this.page_size = parseInt(json.page_size);//列表总数
    this.length = json.length; //实际列表数量 
    this.index = parseInt(json.index) ;//坐标位置
    this.rowHeight = json.rowHeight; //多列模块行数
}

listOperation.prototype.operation = function () {
    var position = ''; //下一页or下一页
    var direction = ''; //退出模块的方向
    if (this.type == 1) { //多行单列
        switch (this.key) {
            case 'backwards': //左
                if (this.likeState && this.status == '0') { //开启点赞且状态为选中点赞框
                    this.status = '1'
                } else {
                    if (this.now_page > 1) { //当前页数不是第一页
                        this.now_page--; //上一页
                        position = 'previous';
                    } else if (this.structure !== undefined && this.structure !== null) {
                        direction = this.structure;
                    }
                }
                break;
            case 'forwards': //右
                this.status = this.status == '1' && this.likeState ? '0' : '1';
                if (this.status == '1' && this.now_page != this.total_page) {  //不是最后一页
                    this.now_page++; //下一页
                    position = 'next';
                }
                break;
            case 'up': //上
                if (this.status == '1') {
                    if (this.index == 0 && this.now_page > 1) { //在最上面的位置且不是第一页
                        this.now_page--; //上一页
                        position = 'previous';
                    } else if (this.index > 0) {
                        this.index--;
                    }
                }
                break;
            case 'down': //下
                if (this.status == '1' && ++this.index >= this.length && this.now_page != this.total_page) { //不是在最后一页
                    this.now_page++; //下一页
                    position = 'next';
                }
                if (this.index >= this.length) {
                    this.index = this.length - 1;
                }

                break;
            case 'pageUp': //上一页
                if (this.now_page > 1) {
                    this.now_page--; //上一页
                    position = 'previous';
                }
                break;
            case 'pageDown': //下一页
                if (this.now_page != this.total_page) {
                    this.now_page++; //下一页
                    position = 'next';
                }
                break;
        }
    } else {
        var munden = this.page_size / this.rowHeight;
        // console.log(munden)
        switch (this.key) {
            case 'backwards': //左
                if (this.status == '1') { //开启点赞且状态为选中点赞框
                    if (this.structure !== undefined && this.structure !== null && this.now_page == 1 && this.index == 0) {
                        direction = this.structure;
                    } else if (this.now_page > 1 && this.index == 0) { //非第一页且第一个位置
                        this.now_page--; //上一页
                        position = 'previous';
                    } else if (this.index > 0) {
                        this.index--;
                    }
                }
                break;
            case 'forwards': //右
                if (this.status == '1' && ++this.index >= this.length && this.now_page != this.total_page) {//当在最一个位置且并不是最后一页的时候 
                    this.now_page++; //下一页
                    position = 'next';
                } else if (this.now_page == this.total_page && this.index == this.length) {
                    this.index--;
                }
                break;
            case 'up': //上
                if (this.likeState && this.status == '0') {
                    this.status = '1'
                } else {
                    if (this.index >= 0 && this.index < munden && this.now_page > 1) { //当前页数不是第一页且是最上面的一行
                        this.now_page--; //上一页
                        position = 'previous';
                    } else if (this.index >= munden) {
                        this.index -= munden;
                    }
                }
                break;
            case 'down': //下
                this.status = this.status == '1' && this.likeState ? '0' : '1';
                if (this.status == '1') {
                    if (this.index >= this.page_size - munden && this.now_page != this.total_page) { //当位置在最下面一行且并不是最后一页
                        this.now_page++; //下一页
                        position = 'next';
                    } else if (this.index < this.page_size - this.index) {
                        this.index += munden;
                    }
                    if (this.index >= this.length) {
                        this.index = this.length - 1;
                    }
                }
                break;
            case 'pageUp': //上一页
                if (this.now_page > 1) {
                    this.now_page--; //上一页
                    position = 'previous';
                }
                break;
            case 'pageDown': //下一页
                if (this.now_page != this.total_page) {
                    this.now_page++; //下一页
                    position = 'next';
                }
                break;
        }
    }

    var backJson = {
        direction: direction,
        index: this.index,
        status: this.status,
        now_page: this.now_page,
        position: position
    }
    return backJson;
}

//ajax 封装
function getDatas(url, params, callback) {
    console.log(api + url)
    $.ajax({
        type: 'get',
        dataType: "jsonp",
        data: params,
        jsonp: "callback",
        url: api + url,
        success: function (data) {
            callback(null, data)
        },
        error: function (xhr, textStatus, errorThrown) {
            callback(errorThrown)
        }
    });
}


function tishi(){
	str = '<div class="tishi" style="font-size: 30px;z-index: 1111;text-align: '+
	'center;width: 180px;height: 50px;position: absolute;background: white;padding: 50px;border-radius: 20px;top: 280px;left: 500px;color: black;">'+
	'点赞成功</div>';
	$("body").append(str);
	setTimeout(function(){
		$('.tishi').hide()
	},2000);
};

function prompt(title) {
    str = '<div class="tishi" style="font-size: 30px;z-index: 1111;text-align: ' +
        'center;width: 180px;height: 50px;position: absolute;background: white;padding: 50px;border-radius: 20px;top: 280px;left: 500px;color: black;">' + title +
        '</div>';
    $("body").append(str);
    setTimeout(function () {
        $('.tishi').hide()
    }, 2000);
};