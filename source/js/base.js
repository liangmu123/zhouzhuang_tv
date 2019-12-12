var DebugMode=0;
var currATIndex=0;
var mpeg_opened=false;
var clientTypeState='0';
var ReturnURL='';

var vod;
if(window.navigator.appName != "Netscape" 
	&& window.navigator.appName!="Microsoft Internet Explorer") {
	vod = new VODControl();
}

function mpeg_read(ioctl)
{
	if(window.navigator.appName=="Microsoft Internet Explorer") 
		return;
	var rev;
	if(mpeg_opened){
		if (ioctl == 'STBNo'){// 3.0HI3716M 
	     rev = vod.Get('STBNo');
	   }else {
	     rev = vod.Get(ioctl);
	   }
		return rev;
	}else{
		alert('[mpeg_read]Please open device first !');
	}
}


function mpeg_write(ioctl,value){
    if(window.navigator.appName=="Microsoft Internet Explorer") return;
 	var rev;
	if(mpeg_opened){
		rev = vod.SetUp(ioctl,value);
		return rev;
	}else{
		alert('[mpeg_write]Please open device first !');
	}
}

function mpeg_open(){
    if(window.navigator.appName=="Microsoft Internet Explorer") return;
	if(!mpeg_opened){
		vod.Install();	
		mpeg_opened=true;
	}
	return true;
}

function mpeg_close(){
    if(window.navigator.appName=="Microsoft Internet Explorer") return;
	if(!mpeg_opened){
		vod.GiveUp();
		mpeg_opened=false;
	}
	return true;
}

function GetStbNo(){
    if(window.navigator.appName == "Netscape" 
	    || window.navigator.appName == "Microsoft Internet Explorer"
	    || DebugMode == 1) {
		//return "02197415440070199";
		// return '01127411391027252';
		return '';
	}
	mpeg_open();
	var stbno = mpeg_read('STBNo');
	//alert('stbno='+stbno);
	return stbno;
}

function GetCurrATIndex()
{
	return currATIndex;
}

function getNameValueByUrl(nameValue,url)
{
	var LookAssetID = "";
		//alert('url='+url);
		if(null==url||url=='')return LookAssetID;
		var str = url.split("&");
		//alert('str='+str);
		var strlen = 0;
		if (str != null)strlen = str.length;
		for (var k = 0; k < strlen; k++) {
			
			if (str[k].indexOf(nameValue) != -1) {
				LookAssetID = str[k].split("=")[1];
				break;
			}
		}
		
		return LookAssetID;
}

function Exit()
{
        	
var enreach = new EnReach(); 
enreach.ExitBrowser();
}
function Exit1()
{
  mpeg_open();
  mpeg_write('JseBrowserQuit','en_US');
  mpeg_write('JseBrowserQuit','China');
  var enreach = new EnReach();
  enreach.ExitBrowser();
}
function Exit2()
{
   //var enreach = new EnReach();
   //enreach.ExitBrowser();
   mpeg_open();
   mpeg_write('JseBrowserQuit','en_US');
   mpeg_write('JseBrowserQuit','Foreign');
   var enreach = new EnReach();
   enreach.ExitBrowser();
}
function Exit3()
{
     //var enreach = new EnReach();
     //enreach.ExitBrowser();
     mpeg_open();
     mpeg_write('JseBrowserQuit','zh_CN');
     mpeg_write('JseBrowserQuit','China');
     var enreach = new EnReach();
     enreach.ExitBrowser();
}
function Exit4()
{
        //var enreach = new EnReach();
        //enreach.ExitBrowser();
        mpeg_open();
        mpeg_write('JseBrowserQuit','zh_CN');
        mpeg_write('JseBrowserQuit','Foreign');
        var enreach = new EnReach();
        enreach.ExitBrowser();

}


function goBack()
{
    //alert(ReturnURL);
	if(ReturnURL==""){
		this.location="show.do?action=show&authorized=authorized&pageID=300&groupID="+groupID;
	}else{		
		if(ReturnURL.indexOf("?")==-1) ReturnURL=ReturnURL+"?tag=back";
		//if(ReturnURL.indexOf("&stbno=")==-1) ReturnURL=ReturnURL+"&stbno="+GetStbNo();
		this.location=ReturnURL;
	}

}
function goUpLevelS()
{
   if(isUpLevelURL(UpLevelURL)==0){
   	  //alert("1"); 
	  this.location="show.do?action=show&authorized=authorized&pageID=1&groupID="+groupID;	
   }else if(UpLevelURL.indexOf("goBack()")!=-1){
	  //alert("2="+ReturnURL);
	  this.location=ReturnURL;
   }else{
   	  //alert("3="+UpLevelURL);
 	  this.location=UpLevelURL;
   }
}
function isUpLevelURL(upLevelURL){
  var secondUrl='31023,31025,31020,31024,20660,31121,32001,12313,11111,31026,20021,20020,31021,31022,20801,31821,30981,43374,43644,12073,43804,43822,43802,43661,31221'
  var str = secondUrl.split(",");
  var isBoolean=1;
  var strlen = 0;
  if (str != null)strlen = str.length;
  for (var k = 0; k < strlen; k++) {	
		if (upLevelURL.indexOf(str[k])!= -1) {
			isBoolean=0;
			break;
		}
  }
  return isBoolean;
}
function Getuserage()
{
	mpeg_open();
    var UserAge = mpeg_read('CableMPEGParentRating'); 
    mpeg_write('printf','CableMPEGParentRating='+UserAge+'\n');  
    return UserAge; 
}
function requestUrl(myUrl){
	   if (myUrl.indexOf("?")>=0){
	       myUrl = myUrl + "&";
	      }else{
	         myUrl = myUrl + "?";
	      }
	    myUrl = myUrl + "systime=" + (new Date()).getTime();
	    this.location =  myUrl;
}
function URLEncode(plaintext)
{
	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = "0123456789" +					// Numeric
					"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
					"abcdefghijklmnopqrstuvwxyz" +
					"-_.!~*'()";					// RFC2396 Mark characters
	var HEX = "0123456789ABCDEF";
	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
			    alert( "Unicode Character '" 
                        + ch 
                        + "' cannot be encoded using standard URL encoding.\n" +
				          "(URL encoding only supports 8-bit characters.)\n" +
						  "A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for
 
	return encoded;
}
function URLDecode(encoded)
{
   // Replace + with ' '
   // Replace %xx with equivalent character
   // Put [ERROR] in output if %xx is invalid.
   var HEXCHARS = "0123456789ABCDEFabcdef"; 
   var plaintext = "";
   var i = 0;
   while (i < encoded.length) {
       var ch = encoded.charAt(i);
	   if (ch == "+") {
	       plaintext += " ";
		   i++;
	   } else if (ch == "%") {
			if (i < (encoded.length-2) 
					&& HEXCHARS.indexOf(encoded.charAt(i+1)) != -1 
					&& HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 ) {
				plaintext += unescape( encoded.substr(i,3) );
				i += 3;
			} else {
				alert( 'Bad escape combination near ...' + encoded.substr(i) );
				plaintext += "%[ERROR]";
				i++;
			}
		} else {
		   plaintext += ch;
		   i++;
		}
	} // while
   return plaintext;
}
