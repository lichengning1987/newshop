/**
 * @author merauy@gmail.com
 * @resource http://www.goodxyx.com/jquery/plugins/uploadreplace.html
 * @Copyright(c)2010~2014 
 * @version 1.0.0
 * @direction javascript异步上传文件插件
 * @comment 所谓的AJAX异步上传附件，以目前（2010-10-01）的知识来说不准确。
 *   JS没有提供ajax直接上传的接口，目前大部分的异步上传控件是FLASH来实现。
 *   再ajax出现之前，JS就可以实现异步上传文件功能了
 *   本代码清晰展示了JS异步上传的实现原理 
 *   该上传插件可以不依赖于jQuery，有了jQuery使得代码更少而已
 *   该插件仅用于学习与分享，希望能帮助大家。
 *  @ 2014-12-19 完善uploadBind功能，将selectedQuery元素当作一个可以异步上传文件的对象，更方便和灵活
 */
$.extend(czyx,{
	uploadReplace:function(selectedQuery, param){
		param = param||{};
		param.url = param.url||window.location.href||'';
		param.MAX_FILE_SIZE = !-[1,] && param.MAX_FILE_SIZE ;
		return $(selectedQuery).each(function(){
			var myparam = $.extend(true,{},czyx.uploadSettings,param);
			//绑定click只是让效果看上去更好，与上传功能无关
			var jThis = $(this).click(function(){
				$(this).parent().css({
							opacity:1,
							filter:'alpha(opacity=100)'	
						});	
			}) ;
			if(jThis.is('input[type="file"]')){
				var div = $('<div />')
					.insertBefore(jThis.css(myparam.uploadInputCss))
					.css(myparam.uploadReplaceCss)
					.attr('id', czyx.getNextTempId())
					.hover(function(){
						$(this).css({
							opacity:0.7,
							filter:'alpha(opacity=70)'	
						});	
					},function(){
						$(this).css({
							opacity:1,
							filter:'alpha(opacity=100)'	
						});	
					});
				
				//有一篇文章说，IE浏览器可以设置最大字节数，那么我就加上这句的
				//<input type="hidden" name="MAX_FILE_SIZE" value="30000" />
				//MAX_FILE_SIZE 隐藏字段（单位为字节）必须先于文件输入字段，其值为接收文件的最大尺寸。
				//这是对浏览器的一个建议，PHP 也会检查此项。
				//在浏览器端可以简单绕过此设置，因此不要指望用此特性来阻挡大文件。
				//实际上，PHP 设置中的上传文件最大值是不会失效的。
				//但是最好还是在表单中加上此项目，
				//因为它可以避免用户在花时间等待上传大文件之后才发现文件过大上传失败的麻烦。
				//详见：http://www.ugia.cn/?p=73
				if(myparam.MAX_FILE_SIZE){
					this.MAX_FILE_SIZE = myparam.MAX_FILE_SIZE ;
				}
				
				jThis.appendTo(div).change(function(){
					czyx._uploadRun.call(this, myparam)
					/*
					var tidDiv = $(this).parent().attr('id'),jForm;
					tidIframe  = czyx.getNextTempId(),
					tidForm    = czyx.getNextTempId();
					
					if(param.uploadBefore.call(this) === false){
						return false ;
					}
					if(!this.name){
						$(this).attr('name', 'czyxupload').data('addTempName', 1);
					}
					
					jForm = $('<form id="' + tidForm + '" action="' + param.url + '" '
						+ 'method="post" style="display:none;" '
						+ 'enctype="multipart/form-data"></form>'
					).appendTo('body');
					
					if(param.data){
						jForm.html(czyx.toFormString(param.data));
					}
					jForm.append(this).data('uploadEnd',param.uploadEnd);
					
					$('<iframe src="'
						+ (/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank')
						+ '" '
						+ 'id="' + tidIframe+'" '
						+ 'style="display:none;" '
						+ 'name="' + tidIframe+'" '
						+ 'onload="czyx._uploadEnd(this,\'' + tidDiv + '\',\'' + tidForm + '\');">'
						+ '</iframe>'
					).appendTo('body');
					*/
				});
			}	
		});
	},
	_uploadRun:function(param){
		var tidDiv = $(this).parent().attr('id'),jForm;
		tidIframe  = czyx.getNextTempId(),
		tidForm    = czyx.getNextTempId();
		
		if(param.uploadBefore.call(this) === false){
			return false ;
		}
		if(!this.name){
			$(this).attr('name', 'czyxupload').data('addTempName', 1);
		}
		
		jForm = $('<form id="' + tidForm + '" action="' + param.url + '" '
			+ 'method="post" style="display:none;" '
			+ 'enctype="multipart/form-data"></form>'
		).appendTo('body');
		
		if(param.data){
			jForm.html(czyx.toFormString(param.data));
		}
		jForm.append(this).data('uploadEnd',param.uploadEnd);
		
		$('<iframe src="'
			+ (/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank')
			+ '" '
			+ 'id="' + tidIframe+'" '
			+ 'style="display:none;" '
			+ 'name="' + tidIframe+'" '
			+ 'onload="czyx._uploadEnd(this,\'' + tidDiv + '\',\'' + tidForm + '\');">'
			+ '</iframe>'
		).appendTo('body');
	},
	uploadSettings:{
		uploadReplaceCss:{//上传控件默认样式
			width:80,
			height:20,
			overflow:'hidden',
			position:'relative',
			background:'url('+czyx.rootPath+'czyx/images/upload.png) center no-repeat'
		},
		uploadInputCss:{
			fontSize:72,
			cursor:'pointer',
			position:'absolute',
			right:0,
			//bottom:0,
			filter:'alpha(opacity=0)',
			opacity:0,
			outline:'none',
			hideFocus:'expression(this.hideFocus=true)'	
		},
		uploadEnd:$.noop,    //上传前的回调函数，如果返回 false将不执行上传
		uploadBefore:$.noop, //上传完毕后的回调函数，参数服务器端返回的字符串
		MAX_FILE_SIZE:null   //上传的文件最大字节数，暂不支持
	},
	_uploadEnd:function(iframeNode, divId, formId){
		var jForm = $('#'+formId);
		if(jForm.attr('target') != iframeNode.name){
			jForm.attr('target', iframeNode.name).submit();
		}else{
			var jFile = jForm.find('input:last');
			if(jFile.data('addTempName')){
				jFile.removeData('addTempName').removeAttr('name');
			}
			jForm.data('uploadEnd').call(
				jFile.appendTo('#'+divId).get(0),
				(iframeNode.contentWindow ? 
					iframeNode.contentWindow.document : 
						iframeNode.contentDocument ? 
						iframeNode.contentDocument : 
						iframeNode.document
				).body.innerHTML
				.split('&lt;').join('<')
				.split('&gt;').join('>')
				.split('&amp;').join('&')
			);
			jForm.removeData('uploadEnd').remove();
			$(iframeNode).remove();
		}
	},
	uploadBind:function(selectedQuery, param){
		param = param||{};
		param.url = param.url||window.location.href||'';
		param.MAX_FILE_SIZE = !-[1,] && param.MAX_FILE_SIZE ;
		return $(selectedQuery).each(function(){
			var myparam = $.extend(true,{},czyx.uploadSettings,param);
			var jThis = $(this);
			jThis.parent().css('position', 'relative');
			var jFile = $('<input type="file" />').appendTo($('<span id="' + czyx.getNextTempId() + '">').insertAfter(jThis).css({
				zIndex:999999,
				width: jThis.outerWidth(),
				height: jThis.outerHeight(),
				position:'absolute',
				top: jThis.position().top,
				left: jThis.position().left,
				padding:0,
				margin:0,
				overflow:'hidden'
			})).change(function(){
				czyx._uploadRun.call(this, myparam);
			}).css({
				cursor:'pointer',
				opacity:0,
				filter:'alpha(opacity=0)',
				border:'1px solid red',
				width: jThis.outerWidth(),
				height: jThis.outerHeight()
			});
			if(myparam.MAX_FILE_SIZE){
				jFile.get(0).MAX_FILE_SIZE = myparam.MAX_FILE_SIZE ;
			}
			
		});
	}
});