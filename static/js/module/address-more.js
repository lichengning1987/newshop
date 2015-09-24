

var addressm = {};

addressm.init = function(){
	this.chooseAddress = chooseAddress;
	this.op();
	this.edit();
}


addressm.op = function(){
	$(".addressSelect").click(function(){
		addressm.setDefault($(this));
		if(addressm.chooseAddress){
			addressm.getNext($(this));
		}
		return false;
	});
}

addressm.edit =function(){
	$('.editBtn').click(function(e){
		e.preventDefault();
		var addrId = $(this).closest('li').data('id');
		window.location.href="address.php?act=alter&addr_id="+addrId;
		return false;
	});
}

addressm.setDefault = function(obj){
	var addrId = obj.data('id');
	$.ajax({
        url:defaultUrl,
        type:'post',
        async:false,
        data:{'addr_id':addrId},
        dataType:'json',
        success:function(result){
            if(result.status == 1){
                // 设置默认成功
                $('.addressSelect').find('span').removeClass('on');
                obj.find('span').addClass('on');
            }else{
                alert('设置失败，请稍后再试');
            }
        }
    });
}

addressm.getNext = function(obj){
	var addrId = obj.data('id');
    $.ajax({
        url:getNextUrl,
        type:'post',
        async:false,
        data:{'addr_id':addrId,'type':'ADDR'},
        dataType:'json',
        success:function(result){
            if(result.status == 1){
                window.location.href=result.advice.url;
            }else{
                alert(result.msg);
            }
        }
    });
}

$(document).ready(function(){
	addressm.init();
});