

var order = {};

order.init = function(){

//    $(document).delegate(".deletebtn","click",function(e){
//        e.preventDefault();
//        $.confirm("确认删除吗?",function(flag){
//            if(flag){
//                alert("删除");
//            }else{
//
//            }
//        })
//        /*$.alert("身份水电费");*/
//
//
//    })
	this.button();
}

order.button = function(){
	$('.operatebtn').click(function(e){
		e.preventDefault();
		var action = $(this).data('action');
		var url = $(this).data('url');
		if(action == 'jump'){
			window.location.href=url;
			return false;
		}else if(action = 'post'){
			// 目前post只有这么一个
			if($(this).hasClass('hideOrderBtn')){
				var orderId = $(this).parent().data('id');
				$.confirm("确认删除吗？",function(flag){
					if(flag){
						$.ajax({
							url:url,
							type:'post',
							data:{'order_id':orderId},
							dataType:'json',
							success:function(result){
								if(result.status == 1){
									window.location.href="order.php?act=list";
								}else{
									alert('删除失败');
								}
							}
						});
					}
				});
			}
			if($(this).hasClass('cancelRefundBtn')){
				var param = url.split('||');
				$.confirm("确认取消吗？",function(flag){
					if(flag){
						$.ajax({
							url:param[0],
							type:'post',
							data:{'chargeback_id':param[1]},
							dataType:'json',
							success:function(result){
								if(result.status == 1){
									window.location.href="order.php?act=list&type=refund";
								}else{
									alert('删除失败');
								}
							}
						});
					}
				});
			}
			if($(this).hasClass('confirmBtn')){
				var param = url.split('||');
				$.confirm("确认收货吗？",function(flag){
					if(flag){
						$.ajax({
							url:param[0],
							type:'post',
							data:{'order_id':param[1]},
							dataType:'json',
							success:function(result){
								if(result.status == 1){
									window.location.href="order.php?act=list&type=evaluate";
								}else{
									alert('删除失败');
								}
							}
						});
					}
				});
			}
		}
		
	});
}

$(document).ready(function(){
    order.init();
});