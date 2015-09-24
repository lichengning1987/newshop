

var address = {};

address.init = function(){
	this.submitFlag = false;
	
    this.otopheight=$(".address .title").height()+10;
	this.allowDelivery = allowDelivery;
	this.baseUrl = baseUrl;
	this.addressType = addressType;
	this.initData();
    this.adinit();
    this.phoneInput();
    this.getAdvice();
    this.submit();
    this.delAddress();
}

address.adinit = function(){

   /*if($(".consignee input[name='consignee']").val() == ""){
         $(".consignee input[name='consignee']").focus();
    }*/
    var self=this;
    $("textarea#address").focus(function(){
       $(".address .title").animate({"marginTop":-self.otopheight+"px"},300);
       address.touchFun();
    });

}

address.touchFun = function(){

    var self=this;
    var startX=0,startY=0,swipSpanX=0,swipSpanY=0,omt=false;
      $(document).on("touchstart",function(e){
            //记录触摸开始位置
            startX = e.originalEvent.targetTouches[0].pageX;
            startY = e.originalEvent.targetTouches[0].pageY;
         });
       $(document).on("touchmove",function(e){
                  e.stopPropagation();
                  swipSpanX = e.originalEvent.targetTouches[0].pageX-startX;
                  swipSpanY = e.originalEvent.targetTouches[0].pageY-startY;
                  if($(window).scrollTop() <= 10){
                       if(swipSpanY>0){
                           e.preventDefault();
                           if($(".address .title").css("marginTop") != 0){
                              $(".address .title").stop().animate({"marginTop":"0px"},50)
                           }
                       }
                  }
       });
}

address.initData = function(){
	if(address.addressType == 'edit'){
		var phone = $('#phone').val();
		$('#phone').val(address.render(phone,'replace'));
	}
}

address.phoneInput = function(){
	$('#phone').bind('keyup',function(e){
	    e = window.event || e;
	    var oVal=$.trim($("#phone").val()),oLenth=oVal.length;
	    var code = e.keyCode || e.which;
	    if (code != 8) {
	        if($(this).val().length==3 || $(this).val().length==8){
	           $(this).val($(this).val()+'-');
	        }
	    }
	});
}

address.getAdvice = function(){
	// 智能提醒
	$("#address").on("input propertychange",function(e){
		e.preventDefault();
		var addressInfo = $("#address").val();
		if(addressInfo.length >= 2){
			 $.ajax({
	            url: getAdviceUrl,
	            data:{"address":addressInfo},
	            type:'post',
	            dataType:'json',
	            success:function(data){
	            	if(data.status){
	            		var ohtml="";
		                for(var i=0;i<data.tips.length;i++){
		                     ohtml +="<li data-adcode='"+data.tips[i].adcode+"'>"+data.tips[i].address+"</li>";
		                }
		                $(".ajaxList").html(ohtml);
		                $('.j-addressList').show();
	            	}else{
	            		$(".ajaxList").html('');
	            		$('.j-addressList').show();
	            	}
	            }
	        });
		} 
    });
	
	// 选择
	$('.ajaxList').on("click","li",function(e){
        var addressInfo=$.trim($(e.currentTarget).html());
        var adcode = $(e.currentTarget).data('adcode');
        if(address.checkArea(adcode)){
        	$("#area_id").val(adcode);
        	address.setSection(addressInfo,true);
        }

   });
}

address.setSection = function(addressInfo,extrAction,originalAddress){
	$.ajax({
    	url:getSearchUrl,
    	async:false,
    	data:{"address":addressInfo,"searchMore":true},
    	type:'post',
    	dataType:'json',
    	success:function(data){
    		if(data.status){
    			if(originalAddress == undefined){
    				$("#address").val(addressInfo);
    			}else{
    				$("#address").val(originalAddress);
    			}
    			
    			var loc = data.location.location;
    			var locs = loc.split(",");
    			var section = locs[1]+","+locs[0];
    			$('#section').val(section);
    			$('#gpsAddress').val(data.location.address);
    		}else{
    			$('#section').val('');
    		}
    		if(extrAction){
    			$(".j-addressList").hide();
    			$(".address .title").css({"marginTop":"0px"});
    		}
    		
    	}
    });
}

// 手机号码加减格式
address.render = function(tel,tag){
	var telReg = /^1[3|5|8]\d{9}$/;
    var telReplaceReg = /^1[3|5|8]\d{1}-\d{4}-\d{4}$/;
    var newTel = "";
	if(telReg.test(tel) && tag == 'replace'){
		newTel = tel[0] + tel[1] + tel[2] + '-' + tel[3] + tel[4] + tel[5] + tel[6] + '-' + tel[7] + tel[8] + tel[9] + tel[10];
	}else if(telReplaceReg.test(tel) && tag == 'restore'){
		newTel = tel.replace(/-/gm,'');
	}else {
		newTel = tel;
	}
    return newTel;
}

// 是否允许运送
address.checkArea = function(adcode){
	var flag = false;
	for(o in address.allowDelivery){
		if(parseInt(o) == parseInt(adcode)){
			flag = true;
		}
	}
	if(flag){
		$('.hint').hide();
		$('#allowDelivery').val(1);
	}else{
		alert('该地址不在配送范围之内');
		$('.hint').show();
		$('#allowDelivery').val(0);
	}
	return flag;
}

address.checkDelivery = function(){
	var flag = false;
	var section = $('#section').val();
	if(section == ""){
		alert('请填写你的详细地址，如亲亲家园三期紫阳坊3幢201室');
		$('.hint').show();
		return flag;
	}
	$.ajax({
		async:false,
		url:checkDeliveryUrl,
		type:'post',
		data:{'section':section},
		dataType:'json',
		success:function(result){
			if(result.status == 1){
				$("#area_id").val(result.adcode);
				$('.hint').hide();
				flag = true;
			}else{
				alert('该地址不在配送范围之内');
				$('.hint').show();
			}
		}
	});
	return flag;
}

address.submit = function(){
	$(".submitBtn").click(function(e){
		e.preventDefault();
		address.addressCheck(document.getElementById("addressFrom"));
		return false;
	});
}

address.addressCheck = function(form){
	if(address.submitFlag){
		return ;
	}
	address.submitFlag = true;
	var type = 1;
	var consignee = form.consignee.value;
    var phone_mob = form.phone_mob.value;
    phone_mob = address.render(phone_mob,'restore');
    var telreg = /^1[3|5|8]\d{9}$/;
    var zipcodeReg = /^d{6}$/;
     
    if(type == 1){
    	var isajax = arguments[1] ? arguments[1] : 0;
        var addressInfo = form.address.value;
    }
     
    if (consignee.length < 1) {
        alert('请输入收货人姓名');
        form.consignee.focus();
        address.submitFlag = false;
        return false
    }
    if (phone_mob.length < 1 || phone_mob.length > 12) {
        alert('请输入正确的手机号');
        form.phone_mob.focus();
        address.submitFlag = false;
        return false
    }
     if (!telreg.test(phone_mob)) {
        alert('请输入正确的手机号');
        form.phone_mob.focus();
        address.submitFlag = false;
        return false
	}
	if(type == 1){
		if (addressInfo.length < 1) {
            alert('请输入详细地址');
            form.address.focus();
            address.submitFlag = false;
            return false
        }
	}
	$('#phone').val(phone_mob);
	
	var handleAddressInfo = address.handleAddress(addressInfo);
	address.setSection(handleAddressInfo,false,addressInfo);
	
	if(!address.checkDelivery()){
		address.submitFlag = false;
		return false;
	}
	
	$.ajax({
		url:operateUrl,
		type:'post',
		data:$('#addressFrom').serialize(),
		dataType:'json',
		success:function(result){
			if(result.status == 1){
				address.setDefault(result.addr_id);
			}else{
				alert(result.message);
			}
		},
		error: function(data){
			alert(data);
		}
	});
}

// 给地址默认添加浙江省 杭州市
address.handleAddress = function(addressInfo){
	var header = "浙江省杭州市";
	//去除浙江杭州的前缀
	var reg = new RegExp("((浙江+(省)*)|(杭州+(市)*))","g");
	addressInfo = addressInfo.replace(reg,"");
	return header+addressInfo;
}

address.setDefault = function(addrId){
	$.ajax({
        url:defaultUrl,
        type:'post',
        data:{'addr_id':addrId},
        dataType:'json',
        success:function(result){
            if(result.status == 1){
            	address.getNext(addrId);
            }else{
            	address.submitFlag = false;
                alert('设置默认失败，请稍后再试');
            }
        },
		error: function(data){
			alert(data);
		}
    });
}

address.getNext = function(addrId){
	$.ajax({
        url:getNextUrl,
        type:'post',
        async:false,
        data:{'addr_id':addrId,'type':'ADDR'},
        dataType:'json',
        success:function(result){
        	address.submitFlag = false;
            if(result.status == 1){
                if(result.advice.action == 'jump'){
                	 window.location.href=result.advice.url;
                }else{
                	var url = address.baseUrl + 'address.php';
	        		window.location.href = url;
                }
            }else{
            	var url = address.baseUrl + 'address.php';
        		window.location.href = url;
            }
        }
    });
}

address.delAddress = function(){
	$('.deletes').click(function(e){
		e.preventDefault();
		var addr_id = $("#addr_id").val();
		if(confirm("确定删除该地址?")){
			$.ajax({
				url:delAddressUrl,
				type:'post',
				data:{'addr_id':addr_id},
				dataType:'json',
				success:function(result){
					if(result.status == 1){
						//alert('删除成功');
						var url = address.baseUrl + 'address.php';
						window.location.href = url;
					}else{
						alert("删除失败");
					}
				}
			});
		}
		return false;
	});
}

$(document).ready(function(){
	address.init();
});