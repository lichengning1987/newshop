/**
* �ر�������
*      ������jQuery, jQuery-Ui-dialog
* ʹ�ù���
* �����input[ectype="dialog"] ʱ���Զ����� jquery-ui-dialog
*       ������Ҫ���ԣ�
*         uri ����ĵ�ַ��Ҫ�󷵻ص�����ΪJSON {html:չʾ������}
*         dialog_title: ������ı��⣬Ĭ��button.value
*         dialog_width: ���ڵĿ�ȣ�Ĭ�� 'auto'
* ���ύ��.formDialog
*       ����POST��ʽ�ύ������JSON���ݰ��� html
*         ��� html = SUCCESS ��ˢ�½���
*         ���� �����Ŀ���չʾ html����
**/
var DialogManager = $('<DIV></DIV>').appendTo('body');
var gAjax = null ;


var gAjaxDialog = function(url,title,width,height){
	DialogManager.html('<div class="minBox" ><img src="public/images/loading.gif" /></div>').dialog({
		title:title,
		width:width||'auto',
		height:height||'auto',
		autoOpen:true	
	});
	gAjax = $.ajax({
		url:url,
		success:function(data){
			gAjax = null ;
			if(!data){
				DialogManager.html('\u52a0\u8f7d\u5931\u8d25');/*����ʧ��*/
				setTimeout(function(){DialogManager.dialog('close')}, 3000);
				return ;
			}
			if(data == 'SUCCESS' || data == 'success' || /^[\s\r\n\t]*<[\s\S]+>[\s\r\n\t]*$/.test(data)){
				data = {'html':data} ;
			}else{
				try{
					data = $.parseJSON(data);
				}catch(e){
					DialogManager.html('\u52a0\u8f7d\u5931\u8d25');/*����ʧ��*/
					setTimeout(function(){DialogManager.dialog('close')}, 3000);
					return ;
				}
			}
			if(data['html']){
				if(data['html'] == 'SUCCESS' || data['html'] == 'success'){
					window.location.reload();
				}else{
					DialogManager.html(data['html']);	
					DialogManager.dialog('close');
					DialogManager.dialog('open');
				}
				
			}else{
				DialogManager.html(data['message'] || '\u52a0\u8f7d\u5931\u8d25');/*����ʧ��*/
			}
		},
		error:function(){
			gAjax = null ;
			DialogManager.html('\u52a0\u8f7d\u5931\u8d25');/*����ʧ��*/
			setTimeout(function(){DialogManager.dialog('close')}, 3000);
		}
	});
};

DialogManager.dialog({
	autoOpen: false,
	width: 'auto'
});

$(document).on('click','input[ectype="dialog"],input.dialog',function(){
	gAjaxDialog($(this).attr('uri'), $(this).attr('dialog_title') || this.value, $(this).attr('dialog_width') || 'auto');
});

$(document).on('click','a.dialog',function(){
	gAjaxDialog($(this).attr('uri') || this.href, $(this).attr('dialog_title') || this.title || this.innerHTML, $(this).attr('dialog_width') || 'auto');
	return false ;
});



$(document).on('submit','.formDialog',function(){
	$.ajax({
		url:this.action,
		type:'POST',
		data:$(this).serialize(),
		success:function(data){
			if(!data){
				DialogManager.html('\u52a0\u8f7d\u5931\u8d25');/*����ʧ��*/
				setTimeout(function(){DialogManager.dialog('close')}, 3000);
				return ;
			}
			if(data == '1'){
				data = {"html":"success"} ;
			}else	if(data == 'SUCCESS' || data == 'success' || /^[\s\r\n\t]*<[\s\S]+>[\s\r\n\t]*$/.test(data)){
				data = {"html":data} ;
			}else{
				try{
					data = $.parseJSON(data);
				}catch(e){
					DialogManager.html('\u6570\u636e\u5f02\u5e38\uff0c\u8bf7\u7a0d\u8054\u7cfb\u7ba1\u7406\u5458');/**�����쳣��������ϵ����Ա*/
					return ;
				}
			}
			if(data['html']){
				if(data['html'] == 'SUCCESS' || data['html'] == 'success'){
					window.location.reload();	
				}else{
					DialogManager.html(data['html']);
					DialogManager.dialog('close');
					DialogManager.dialog('open');
				}
			}else{
				DialogManager.html(data['message'] || '\u52a0\u8f7d\u5931\u8d25');/*����ʧ��*/
			}
		},
		error:function(){
			DialogManager.html('\u670d\u52a1\u5668\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u5c1d\u8bd5');/**��������æ�����Ժ���**/
		}
	});
	DialogManager.html('<div><img src="public/images/loading.gif" /></div>');/**�����ύ��**/
	return false ;
});

$(document).on('click','.cancel_button',function(){
	 DialogManager.dialog('close');	
});