var coupon={};

coupon.init=function () {
	//this.base();
	this.action();
    var owidth=$(window).width()-130;
    $(".middle").width(owidth)
}

coupon.base=function(){
	$(".coupon-delete").tap(function(){
		$(this).parent().parent().slideUp(100);
	});
}

coupon.action = function(){
	// 删除操作
	$('.coupon').find('.coupon-delete').click(function(){
		var obj = $(this).closest('.coupon-list');
		var id = obj.data('id');
		if(confirm("确定删除吗？")){
        	$.ajax({
				url:deleteUrl,
				data:{'coupon_id':id},
				type:'post',
				dataType:'json',
				success:function(result){
					if(result.status == 1){
						obj.slideUp(100);
                	}else{
                   		$.alert(result.message);
                	}
				}
			});
		}
	});
}

$(document).ready(function(){
	coupon.init();
});