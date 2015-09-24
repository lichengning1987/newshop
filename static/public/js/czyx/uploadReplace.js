/**
 * @author merauy@gmail.com
 * @resource http://www.goodxyx.com/jquery/plugins/uploadreplace.html
 * @Copyright(c)2010~2014 
 * @version 1.0.0
 * @direction javascript�첽�ϴ��ļ����
 * @comment ��ν��AJAX�첽�ϴ���������Ŀǰ��2010-10-01����֪ʶ��˵��׼ȷ��
 *   JSû���ṩajaxֱ���ϴ��Ľӿڣ�Ŀǰ�󲿷ֵ��첽�ϴ��ؼ���FLASH��ʵ�֡�
 *   ��ajax����֮ǰ��JS�Ϳ���ʵ���첽�ϴ��ļ�������
 *   ����������չʾ��JS�첽�ϴ���ʵ��ԭ�� 
 *   ���ϴ�������Բ�������jQuery������jQueryʹ�ô�����ٶ���
 *   �ò��������ѧϰ�����ϣ���ܰ�����ҡ�
 *  @ 2014-12-19 ����uploadBind���ܣ���selectedQueryԪ�ص���һ�������첽�ϴ��ļ��Ķ��󣬸���������
 */
$.extend(czyx,{
	uploadReplace:function(selectedQuery, param){
		param = param||{};
		param.url = param.url||window.location.href||'';
		param.MAX_FILE_SIZE = !-[1,] && param.MAX_FILE_SIZE ;
		return $(selectedQuery).each(function(){
			var myparam = $.extend(true,{},czyx.uploadSettings,param);
			//��clickֻ����Ч������ȥ���ã����ϴ������޹�
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
				
				//��һƪ����˵��IE�����������������ֽ�������ô�Ҿͼ�������
				//<input type="hidden" name="MAX_FILE_SIZE" value="30000" />
				//MAX_FILE_SIZE �����ֶΣ���λΪ�ֽڣ����������ļ������ֶΣ���ֵΪ�����ļ������ߴ硣
				//���Ƕ��������һ�����飬PHP Ҳ������
				//��������˿��Լ��ƹ������ã���˲�Ҫָ���ô��������赲���ļ���
				//ʵ���ϣ�PHP �����е��ϴ��ļ����ֵ�ǲ���ʧЧ�ġ�
				//������û����ڱ��м��ϴ���Ŀ��
				//��Ϊ�����Ա����û��ڻ�ʱ��ȴ��ϴ����ļ�֮��ŷ����ļ������ϴ�ʧ�ܵ��鷳��
				//�����http://www.ugia.cn/?p=73
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
		uploadReplaceCss:{//�ϴ��ؼ�Ĭ����ʽ
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
		uploadEnd:$.noop,    //�ϴ�ǰ�Ļص�������������� false����ִ���ϴ�
		uploadBefore:$.noop, //�ϴ���Ϻ�Ļص������������������˷��ص��ַ���
		MAX_FILE_SIZE:null   //�ϴ����ļ�����ֽ������ݲ�֧��
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