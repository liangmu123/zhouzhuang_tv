/*|
|*| JavaScript library of building and styling the STB page.
|*| Platform:  STB browser 
|*| Version: 3.0
|*| Revision: 12.Feb.2014
|*| Etcetera: global interface named 'EVM'.
|*/

(function( window ){

	var window = window,
		  Evm = function( selector, root ){
			if( typeof selector !== 'string' ){ return; };
				return new Evm.uber.init( selector.replace(/^\s*|\s$/g,''), root );
		};
	Evm.browserPrefix = (function(){
		var N = navigator.appName, ua = navigator.userAgent, tem;
		var M = ua.match(/(chrome|safari|firefox|msie|opera)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem = ua.match(/version\/([\.\d]+)/i))!= null) M[2] = tem[1];
		M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
		M = M[0];
		if( M == "Chrome" ){ return "webkit"; }
		if( M == "Firefox" ){ return "moz"; }
		if( M == "Safari" ){ return "webkit"; }
		if( M == "MSIE" ){ return "ms"; }
		if( M == "Opera" ){ return "o"; }
	})();
	Evm.uber = Evm.prototype = {
		constructor : Evm,
        selector : null,
		init : function( selector, root ){
			if( !selector ){
				return false;
			}else{
				var dom;
				switch ( selector.charAt(0) ){
                    // ID selector: the hash symbol represents an ID. Locate the element with an ID.
                    case '#' :
                        selector = selector.substr(1);
                        dom = Evm.$( selector );
                        this.selector = dom;	
                        break;
					// type selector: is the name of an HTML element.
					default :
                        dom = Evm.tag( selector, root || document );
                        break;
				}
				this[0] = dom;
				return this;
			}
		},
        items : function( index ){
            if( this.selector !== null ){ return this; }
            if( this[0].length > 0 ){
                if( this[0][index] ){
                    this.selector = this[0][index];
                }else{
                    this.selector = this[0][0];
                }
            }
            return this;
        }
	};
	Evm.uber.init.prototype = Evm.uber;
	Evm.extend = Evm.uber.extend = function (parent, child){
		var i;
		child = child || this;
		for(i in parent){
			child[i] = parent[i];
		}
		return this;
	};
	Evm.uber.extend( {
		removeClass : function ( value ){
            if( this.selector === null || typeof value === 'undefined' ){
                return this;
            }else{
               if( this.selector.length > 0 ){
					var i = this.selector.length;
					for( ; this.selector[ --i ]; ){
						Evm.removeClass( this.selector[i], value );
					}      
               }else{
                    Evm.removeClass( this.selector, value );
               }
            }
            return this;
        }
		
	}, Evm.uber );
	Evm.extend( {
        removeClass : function ( value ){
            if( this.selector === null || typeof value === 'undefined' ){
                return this;
            }else{
               if( this.selector.length > 0 ){
					var i = this.selector.length;
					for( ; this.selector[--i]; ){
						Evm.removeClass( this.selector[i], value );
					}      
               }else{
                    Evm.removeClass( this.selector, value );
               }
            }
            return this;
        },
        addClass : function ( value ){
            if( this.selector === null || typeof value === 'undefined' ){
                return this;
            }else{
                var oValue;
                if( this.selector.length > 0 ){
                    var i = this.selector.length;
                    for( ; this.selector[--i]; ){
                       Evm.addClass( this.selector[i], value );
                    }
                }else{
                    Evm.addClass( this.selector, value );
                }
            }
            return this;
        },
        setStyle: function( css ){
			if( typeof css === 'undefined' ){
				return this;
			}
			 if( this.selector.length > 0 ){
				 // Do not recommand that  u styling elements like this.
				var i = this.selector.length;
				for(; this.selector[--i];){
                    Evm.setStyle ( this.selector[i], css );
                }
			 }else{
				 Evm.setStyle( this.selector, css );
			 }
            return this;
        },
		html : function( out ){
			if( typeof out === 'undefined'){ return this; }
			Evm.html( this.selector, out );
			return this;
		},
		text : function( out ){
			if( typeof out === 'undefined'){ return this; }
			Evm.text( this.selector, out );
			return this;
		}
    }, Evm.uber);
	
	
	Evm.guid = function( pre ){
        return ( pre || 'EVMJS_' ) + 
            +  ( Math.random() + '' ).slice( -8 );
	};
	
	Evm.extend( {
		$ : function( id ){
			if( document.getElementById && document.getElementById(id) ) {
				return document.getElementById( id );
			} else if ( document.all && document.all( id ) ) {
				return document.all( id );
			} 
			return false;
		},
		tag : function( type, root ){
			root = root || document;
			if( root.getElementsByTagName ){ return root.getElementsByTagName( type ); } 
			return false;
		},
		hasClass : function ( elem, className ){  
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');	
			return elem.className.match(reg);
		},
		addClass : function ( elem, value ){
			if( !elem.className ){
				elem.className=value;
			}else{
				var oValue = elem.className;
				oValue += ' ';
				oValue += value;
				elem.className = oValue;
			}
			return this;
		},
		removeClass : function ( elem, className ){
			className = className.replace(/^\s*|\s*$/g,'');
			if ( Evm.hasClass( elem, className ) ){
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				elem.className = elem.className.replace(reg, ' ');
			}
			return this;
		},
		getStyle : function ( elem, prop ){
			if( elem.style[prop] ){
				return elem.style[prop];	
			}else if( elem.currentStyle ){  //IE method
				return elem.currentStyle[prop];
			}else if( document.defaultView && document.defaultView.getComputedStyle ){  //W3C method
				prop = prop.replace(/([A-Z])/g,"-$1");
				prop = prop.toLowerCase();
				var s = document.defaultView.getComputedStyle( elem ,null );
				return s && s.getPropertyValue( prop );
			}else{	
				return null;	
			}
		},
		setStyle : function( elem, css ){
			for( var prop in css ){ elem.style[ prop ] = css[prop]; }
			return this;
		},
		html : function( elem, out ){
			if( elem ){
				elem.innerHTML = out;
				return elem;
			}
			return false;
		},
		text : function( elem, out ){
			if( elem ){
				out = elem.innerText + " " + out;
				elem.innerText = out;
				return elem;
			}
			return false;
		},
		createQueryUrl : function ( url, name, value ){
			url += ( url.indexOf("?") == -1 ? "?" : "&" );
			url += encodeURIComponent( name ) + "=" + encodeURIComponent( value );
			return url;
		},
		ajaxEvt : [],
		ajax : function( _json ){
			
			/*
			 *  _json格式 
			 *  { url: "", query :{"name":"value"}, type:"POST", data:"", ret:null } 
			 */
			var xhr_id = Evm.ajaxEvt.length , 
					isFinished = false,
					xhr = null, 
					i, 
					url, 
					data = null;
			try {
			  xhr = new XMLHttpRequest();
			} catch ( trymicrosoft ) {
			  try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			  } catch ( othermicrosoft ) {
				try {
				  xhr = new ActiveXObject("Microsoft.XMLHTTP");
				} catch ( failed ) {
				  xhr = null;
				}
			  }
			}
			
			if( xhr ){
				xhr.id = xhr_id;
				xhr.isFinished = isFinished;
				Evm.ajaxEvt.push(  xhr );
			}else{
				alert( " error initizlizing XMLHttpRequest " );
				return;
			}
			if( xhr ){
				// 拼接查询接口地址和参数
				if( _json.url ){
					url = _json.url;
					if( _json.query ){
						for(  i in _json.query ){
							url = this.createQueryUrl( url, i, _json.query[i] );
						}
					}
				}
				
				//xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
				//xhr.setRequestHeader( 'Accept', 'text/javascript, text/html, application/xml, text/xml, */*' );
				//xhr.setRequestHeader("x-json","One");
				xhr.open( _json.type || "GET", url, true );
				
				if ( _json.data ){
					
					// 如果有表单序列化数据
					data  = _json.data;
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				}
				
				xhr.onreadystatechange = function(){
					if( xhr.readyState === 4 ){
						if( xhr.status === 403 ){	
							alert( " access denied" );
						}else if( xhr.status === 404 ){	
							alert( "request URL does not exist" );
						}else if( (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 ){
							xhr.isFinished = true;
							if( _json.ret ){
								_json.ret( Evm.httpData( xhr ), xhr_id, isFinished );
							}
							//ajaxTrigger( Evm.httpData( xhr ) );
						}else{
							alert( "error: status code is " + xhr.status );
						}
					}
				};
				xhr.send( data );
			}
			//return this;
			return { 
							"xhrID" : xhr_id
						};
        },
		httpData : function( r, type ){
			var json = r.getResponseHeader('x-json');
			if ( json ) { return eval("(" + json + ")"); }
			//var contentType = r.getResponseHeader( "Content-Type" );
			//if (contentType.indexOf("xml") !== -1 ) {return r.responseXML; }
			//if (contentType.indexOf("json") !== -1 ) {return eval("(" + r.responseText + ")"); }
			//if (contentType.indexOf("text/html") !== -1 ) {return eval("(" + r.responseText + ")"); }
			//if (contentType.indexOf("javascript") !== -1 ) {eval(r.responseText); }
			return r.responseText;
		},
		ajaxTrigger : function(){	
			//building
		},
		getUrlParam: function( S ){
			S = S || window.location.search;//search 属性是一个可读可写的字符串，可设置或返回当前 URL 的查询部分（问号 ? 之后的部分）。
			if( !S ) return null;
			var o = {}, s = S.substr(1).split('&');
			for( var i=0; i<s.length; i++ ){
				var it = s[i].split('=');
				o[it[0]] = it[1];
			}
			return o;
		},
		getHash : function( reg, separate ){
			if( window.location.hash ){
				var url = window.location.hash.substr(1), hashArray = url.split( separate || '&' ), i = 0, len = 0;
				if( reg ){
					var pat = new RegExp(reg);	
					for( i = 0, len = hashArray.length; hashArray[ i ]; i += 1){
						if( hashArray[ i ].match(pat) ){ 	return  hashArray[ i ]; }
					}
					return null;
				}
				return hashArray;
			}
			return null;
		},
		cookie:{
			setValue: function( K, V ){
				var Days = 30;
				var exp  = new Date();
				exp.setTime( exp.getTime() + Days*24*60*60*1000 );
				document.cookie = K + "=" + escape( V ) + ";expires=" + exp.toGMTString();
			},
			getValue: function( K ){
				var arr = document.cookie.match( new RegExp("(^| )" + K + "=([^;]*)(;|$)" ));
				if( arr != null ) return unescape( arr[2]) ;
				return null;
			},
			deleteValue: function( K ){
				var exp = new Date();
				exp.setTime( exp.getTime() - 1 );
				var cval = this.getValue( K );
				if( cval != null ) document.cookie= K + "=" + cval + ";expires=" + exp.toGMTString();
			}
		},
		U : {
			UILanguage: "chi"
		},
		date: {
			format: function(d, formatter) {
				if(!formatter || formatter === ""){
					formatter = "yyyy-MM-dd";
				}
				var weekdays = {
					"chi": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
					"eng": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
				},
					year = d.getFullYear().toString(),
					month = (d.getMonth() + 1).toString(),
					date = d.getDate().toString(),
					day = d.getDay(),
					hour = d.getHours().toString(),
					minute = d.getMinutes().toString(),
					second = d.getSeconds().toString();
	
				var yearMarker = formatter.replace(/[^y|Y]/g,'');
				if(yearMarker.length == 2) {
					year = year.substring(2,4);
				} else if (yearMarker.length == 0) {
					year = "";
				}
				var monthMarker = formatter.replace(/[^M]/g,'');
				if(monthMarker.length > 1) {
					if(month.length == 1) {
						month = "0" + month;
					}
				} else if (monthMarker.length == 0) {
					month = "";
				}
	
				var dateMarker = formatter.replace(/[^d]/g,'');
				if(dateMarker.length > 1) {
					if(date.length == 1) {
						date = "0" + date;
					}
				} else if (dateMarker.length == 0) {
					date = "";
				}
	
				var hourMarker = formatter.replace(/[^h]/g, '');
				if(hourMarker.length > 1) {
					if(hour.length == 1) {
						hour = "0" + hour;
					}
				} else if (hourMarker.length == 0) {
					hour = "";
				}
	
				var minuteMarker = formatter.replace(/[^m]/g, '');
				if(minuteMarker.length > 1) {
					if(minute.length == 1) {
						minute = "0" + minute;
					}
				} else if (minuteMarker.length == 0) {
					minute = "";
				}
	
				var secondMarker = formatter.replace(/[^s]/g, '');
				if(secondMarker.length > 1) {
					if(second.length == 1) {
						second = "0" + second;
					}
				} else if (secondMarker.length == 0) {
					second = "";
				}
				
				var dayMarker = formatter.replace(/[^w]/g, '');
				var lang = Evm.U.UILanguage;
				var result = formatter.replace(yearMarker,year).replace(monthMarker,month).replace(dateMarker,date).replace(hourMarker,hour).replace(minuteMarker,minute).replace(secondMarker,second); 
				if (dayMarker.length != 0) {
					result = result.replace(dayMarker,weekdays[lang][day]);
				}
				return result;
			}
		}
	}, Evm);
    if( typeof window === 'object' ){ window.EVM = Evm; }
})(window);

