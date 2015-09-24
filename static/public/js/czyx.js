(function(window, undefined){
	var czyx = {
		_tid:0,
		getNextTempId:function(){
			var id="czyx"+(++czyx._tid);
			return $('#'+id).length ? czyx.getNextTempId() : id
		},
		toFormString:	function(obj,baseName){
			if(baseName === undefined){
				baseName = '' ;	
			}
			var r = [] ;
			var getInputName = function(n, bn){
				return bn ? bn+'['+ n +']' : n ;
			};
			var getInputValue = function(v){
				switch(typeof v){
					case 'boolean':
						return v ? 'true' : 'false' ;
					case 'number':
						return v ;
					case 'function' :
						return getInputValue(v());
					case 'string':
						return czyx.quote(v);
					default:
						return 'null' ;
				}
			};
			for(var i in obj){
				if(typeof obj[i] == 'object' && obj[i]){
					r[r.length] = czyx.toFormString(obj[i], getInputName(i, baseName)) ;
				}else{
					r[r.length] = '<input type="hidden" name="' 
						+ getInputName(i, baseName) 
						+ '" value="' + getInputValue(obj[i]) 
						+ '" />' ;
				}
			}
			return r.join('');
		},
		goToUrl:function(url, data, type, target){
			data = data || {} ;
			if(typeof type != 'undefined' && type.toUpperCase() == 'POST'){
				if(target){
					$('<form method="post" target="'+target+'">'
						+ czyx.toFormString(data)
						+ '</form>'
					).attr('action', url)
					.appendTo('body').submit().remove();
				}else{
					$('<form method="post">'
						+ czyx.toFormString(data)
						+ '</form>'
					).attr('action', url)
					.appendTo('body').submit();		
				}
			}else{
				if(target){
					$('<form method="post" target="'+target+'">'
						+ czyx.toFormString(data) 
						+ '</form>'
					).attr('action', url)
					.appendTo('body')
					.submit()
					.remove();
				}else{
					if(url.indexOf('?') == -1){
						url += '?' ;
					}else{
						var lastChar = url.charAt(url.length-1) ;
						if(lastChar != '?' && lastChar != '&'){
							url += '&' ;
						}
					}
					url += $.param(data);
					window.location.href = url;
				}
			}
		},
		getWebSocket:function(url){
			var socket = window.WebSocket || window.MozWebSocket || this.WebSocket ;
			if(!socket){
				this.loadPlugin('WebSocket');
				return ;
			}
			return new socket(url);
		},
		loadPlugin:function(name, callback){
			$.getScript(this.rootPath + 'czyx/' + name + '.js', callback);
			return this ;
		},
		quote:function(html, type){
			switch(type){
				case 'url':
					return ;
				default:
					return html.split('&').join('&amp;')
						.split("<").join("&lt;")
						.split(">").join("&gt;")
						.split(" ").join("&nbsp;")
						.split("'").join("&#039;")
						.split('"').join("&quot;");
			}
			
		},
		error:function(msg, e){
			if(this.debug){
				$('<div></div>').appendTo('body').html(msg);
			}
		},
		isIe6:function(){
			return !-[1,] && /MSIE 6\.0/.test(navigator.userAgent);
		},
		reload:function(){
			window.location.href = window.location.href.replace(/&\_=[0-9]+/,'') + '&_=' + (+new Date);
		}
	};
	
	//czyx.rootPath 仅用于本系统的框架，不具备通用性。
	var tmp = document.getElementsByTagName('script');
	czyx.rootPath = tmp[tmp.length-1].src.split('public/js')[0] + 'public/js/' ;	
	tmp = null ;
	window.czyx = czyx ;
})(window);

//IE下img有几个附加的属性，如：fileCreatedDate、fileModifiedDate、fileSize、fileUpdatedDate、filters

