

var pay = {};

pay.init = function(){
	
	this.calCoupon = calCoupon;
	this.calIntegral = calIntegral;
	//this.changeReal = changeReal;
	this.userIntegral = userIntegral;
	
	this.paySelectValue = paymentSelect;
	this.couponSelectValue = couponSelect;
	this.integralSelect = integralSelect;
    this.jfSelectValue = integralJson;

	this.scoreSelect();
	this.chooseCard();
	//this.choosePayStyle();
	this.autoCalculate();
	this.checkForm();
	this.choosepay();
	this.checkCouponPayment();
}


pay.choosepay = function(){
    $(".paylist").on("click","li",function(e){
        e.preventDefault();
        $(".paylist li").removeClass("select");
        $(e.currentTarget).addClass("select");
        if($(e.currentTarget).is('.zfb-item')){
	        $('#payment_id').val(2);
	      }else if($(e.currentTarget).is('.wx-item')){
	      	 $('#payment_id').val(50);
	      }else if($(e.currentTarget).is('.hd-item')){
	      	 $('#payment_id').val(100);
	      }
        pay.checkCouponPayment();
    });
    
    $(".paylist").find('li.select').length ? $(".paylist").find('li.select').click() : $(".paylist").find('li:first').click();

};

//选择优惠券
pay.chooseCard = function(){
	if(!$(".choose-card").hasClass('grey')){
		$(".choose-card").Select({
			content:pay.createCouponHtml('radio2',couponJson,pay.couponSelectValue),
			autoInit: true,
			callback: function(){
				/*$(".choose-card-text").text('-￥' + $(".radio2:checked").data('amount').toFixed(2));
				$('#use_id').val($('.radio2:checked').val());
				pay.calCoupon = $(".radio2:checked").data('amount');
				pay.changeIntegralStatus();
				pay.autoCalculate();*/
			}
		});
	}
	
	$(document).on("click",".padding1em",function(e){
		var $dialog=$(e.currentTarget).closest(".dialog"),
        $dialogMask=$(".dialog-mask"),
        $pad=$(e.currentTarget).find(".h2");

	    if(!$pad.hasClass("disabled")){
	        //判断是否点击优惠券弹出框
	        if($pad.data("amount") != undefined){
	        	$('#use_id').val($pad.data('value'));
	            pay.calCoupon = $pad.data("amount");
	            pay.changeIntegralStatus();
	            pay.autoCalculate();
	            pay.checkCouponPayment();
	            $dialog.stop().animate({'bottom': -$dialog.height()}, 300, function(){
	                $dialog.hide();
	                $dialogMask.hide();
	            });
	        }
	    }
	});
	
	// 不使用按钮响应
	$(document).on("click",'.unUseBtn',function(e){
		$("#use_id").val(0);
		pay.calCoupon = 0;
		pay.changeIntegralStatus();
		pay.autoCalculate();
	});
}

// 改变积分选择状态
pay.changeIntegralStatus = function(){
	var totalAmount = parseFloat($('#totalAmount').val()) - parseFloat(pay.calCoupon);
	var objs = $('.radio4');
	var count = 0;
	for(var i = 0; i<objs.length; i++){
		var discount = parseFloat($(objs[i]).data('discount'));
		var causeIntegral = parseFloat($(objs[i]).val());
		if(totalAmount >= discount && pay.userIntegral >= causeIntegral){
			$(objs[i]).attr('disabled',false);
			count ++;
		}else{
			$(objs[i]).attr('disabled',true);
		}
	}
	if(count == 0){
		//$('.choose-scoreBtn').addClass('grey');
	}else{
		//$('.choose-scoreBtn').removeClass('grey');
	}
}

//选择支付方式
pay.choosePayStyle = function(){
	$(".choose-pay-style").Select({
		content: pay.createSelectHtml('radio1',paymentJson,pay.paySelectValue),
		autoInit: true,
		callback: function(){
			$(".choose-pay-style-text").text($(".radio1:checked").siblings('label').find('span').html());
			$('#payment_id').val($(".radio1:checked").val());
		}
	});
}




pay.createSelectHtml = function(className,data,i){
	var pHtml = "";
	for(o in data){
		pHtml += '<p class="bb padding1em"><input class="'+className+'" type="radio" name="radio-style" value="'+data[o].value+'" '+((i == data[o].value)?'checked="checked"':'')+' /><label for="radio4"><span class="h2 gray">'+data[o].name+'</span></label></p>';
	}
	var html = '<div class="list">\
		'+pHtml+'\
	</div>';
	return html;
}

pay.createCouponHtml = function(className,data,i){
	var pHtml = "";
	for(o in data){
		pHtml += '<p class="bb padding1em"> <label ><span class="h2 gray '+className+'" data-amount="'+data[o].amount+'" data-value="'+data[o].value+'">'+data[o].name+'</span></label></p>';
//		pHtml += '<p class="bb padding1em"><input data-amount="'+data[o].amount+'" class="'+className+'" type="radio" name="radio-styleCoupon" value="'+data[o].value+'" '+((i == data[o].value)?'checked="checked"':'')+' /><label for="radio4"><span class="h2 gray">'+data[o].name+'</span></label></p>';
	}
	var html = '<div class="list">\
		'+pHtml+'\
	</div>';
	return html;
}

pay.createJfHtml = function(className,data,i,datatext){
	var pHtml = "";
	for(o in data){
		pHtml += '<p class="bb padding1em">\
			<input data-text="'+data[o].text+'"class="'+className+'" type="radio" name="radio-stylejf" value="'+data[o].value+'" '+((i == data[o].value)?'checked="checked"':'')+' '+((data[o].enable == false)?'disabled':'')+' data-discount="'+data[o].discount+'" />\
			<label for="radio4">\
			<span class="h2 gray">'+data[o].name+'积分</span>\
			</label>\
			</p>';
		if(i == data[o].value){
			datatext = data[o].text;
		}
	}

	var html = '<div class="list"><p class="text-center j-tips bb" style="line-height: 30px;font-size:16px;color:#949494;">'+datatext +'</p> \
		'+pHtml+'\
	</div>';
	return html;
}

//选择积分
pay.scoreSelect = function(){
	/*$(".choose-scoreBtn").Select({
		content:pay.createJfHtml('radio4', this.jfSelectValue,pay.integralSelect,this.jfSelectValue[0].text),
		autoInit: true,
		callback: function(){
		   var text = ($(".radio4:checked").length > 0)?$(".radio4:checked").val():0;
           if(parseFloat(text) > parseFloat(pay.userIntegral)){
                alert("您所选择的积分大于您当前所拥有的积分");
                $('.choose_score').val('');
                return false;
            }
            $(".choose-score").val(text);
            if(text == 0){
            	pay.calIntegral = 0;
            }else{
            	pay.calIntegral = parseFloat($(".radio4:checked").data('discount'));
            }
            $('.integralSpan').html(pay.calIntegral);
//                pay.calIntegral = (text*pay.changeReal).toFixed(2);
//                $('.integralSpan').html((text*pay.changeReal).toFixed(2));
            $("#integral").val(text);
            $('#integral_discount').val(pay.calIntegral);
            pay.autoCalculate();

		}
	})
	if(!$(".choose-scoreBtn").hasClass('grey')){
		$(document).on("click",".radio4",function(){
          $(".j-tips").html($(this).attr("data-text"));
		})
	}*/

     if($(".jf-btn").hasClass('disable')){
        $(".jf-btn").hide();
    }

	$(".jf-btn").on("click",function(){
		var listObj = $(this).closest('.list2');
		var enable = listObj.data('enable');
		var discount = listObj.data('discount');
		var value = listObj.data('value');
		// 是否可使用积分选项
		if(enable){
			if($(this).hasClass("select")){
				pay.calIntegral = 0;
				$("#integral").val(0);
				$('#integral_discount').val(pay.calIntegral);
				 //取消选中
	            $(this).removeClass("select");
				pay.autoCalculate();
	           
	        }else{
	        	pay.calIntegral = discount;
				$("#integral").val(value);
				$('#integral_discount').val(pay.calIntegral);
				//选中
	            $(this).addClass("select");
				pay.autoCalculate();
	            
	        }
		}
    });
	
	//积分规则介绍
    var oDemos="<div class='dialog-jfcontent animation fadeIn'><div class='pd'><h1>积分使用规则</h1><i class='j-closebtn'>X</i><ul><li><b>1.</b>啊呜目前支持固定金额的积分兑换，600积分兑换5元，1000积分兑换10元，1900积分兑换20元，4500积分兑换50元，8000积分兑换100元</li><li><b>2.</b>积分越多，使用时优惠力度越大，但不能高于订单总价</li></ul></div></div>"
    $("body").append(oDemos);
    $(".dialog-jfcontent").css("marginTop","-"+($('.dialog-jfcontent').height()+100)/2+"px");
    $(".dialog-jfcontent").hide();
   /* var odiamask="<div class='dialog-mask'></div>";
    $("body").append(odiamask);*/

    //积分规则介绍
    $(".j-jfinfo").on("click",function(){
        $(".dialog-jfcontent").show();
        $(".dialog-mask").show();
        $(".dialog-jfcontent").addClass("play");
    })

    $(".j-closebtn").on("click",function(){
         $(".dialog-jfcontent").hide();
        $(".dialog-mask").hide();
        $(".dialog-jfcontent").removeClass("play");
    });
    
     $('body').on("click",".dialog-mask",function(){
        $(".dialog-jfcontent").hide();
        $(".dialog-mask").hide();
        $(".dialog-jfcontent").removeClass("play");
    })
   /*  $('.dialog-mask').on("click",function(){

         alert("333")
        $(".dialog-jfcontent").hide();
        $(".dialog-mask").hide();
        $(".dialog-jfcontent").removeClass("play");
    })*/

	/*$('.choose-score').on("input propertychange",function(e){
		var ovalue=$(this).val();
		if(ovalue > pay.userIntegral){
			alert("您所 填写的积分大于您当前所拥有的积分");
			$('.choose_score').val('');
			return false;
		}
    	pay.calIntegral = (ovalue*pay.changeReal).toFixed(2);
        $('.integralSpan').html((ovalue*changeReal).toFixed(2));
        $("#integral").val(ovalue);
        
        pay.autoCalculate();
	});*/
}

pay.checkCouponPayment = function(){
	var useId = $('#use_id').val();
	var paymentId = $("#payment_id").val();
	var validNum = 0;
//	if(useId == "" || useId == 0){
//		return true;
//	}
	for(o in couponJson){
		if(!couponJson[o].needCheck){
			validNum ++;
		}else{
			var paymentArr = couponJson[o].payment.split(',');
			if($.inArray(paymentId,paymentArr) > -1){
				validNum ++;
			}
		}
		if(couponJson[o].value == useId && couponJson[o].needCheck == 1 && (useId != "" && useId > 0)){
			var paymentArr = couponJson[o].payment.split(',');
			// 如果该优惠卷不支持此支付方式
			if($.inArray(paymentId,paymentArr) == -1){
				$('#use_id').val(0);
				pay.calCoupon = 0;
				pay.changeIntegralStatus();
				pay.autoCalculate();
				alert('您选择的优惠券'+couponJson[o].content);
				// 调用自身会出一些小问题
				pay.checkCouponPayment();
				return false;
			}
		}
	}
	$('.validCoupn').html(validNum);
}

// 自动算金额
pay.autoCalculate = function(){
	var totalAmount = parseFloat($('#totalAmount').val()) - parseFloat(pay.calCoupon) - parseFloat(pay.calIntegral);
	if(totalAmount < 0){
		$('#integral').val(0);
		totalAmount += parseFloat(pay.calIntegral);
		pay.calIntegral = 0;
		$('.integralSpan').html(0);
		$('.choose-score').val('');
		$('#integral_discount').val(0);
		$('.list2').find('.jf-btn').removeClass('select');
		alert('使用积分数量超出订单金额');
		//return false;
	}
	if(parseFloat(totalAmount) < 0){
		totalAmount = 0; 
	}
	totalAmount = parseFloat(totalAmount);
	$('.couponSpan').html(parseFloat(pay.calCoupon).toFixed(2));
	$('.integralSpan').html(parseFloat(pay.calIntegral).toFixed(2));
	$(".orangebg").html("付款：<em>￥"+totalAmount.toFixed(2)+'</em>');
	return true;
}

pay.checkForm = function(){
	$('.submitBtn').click(function(e){
		e.preventDefault();
		$.ajax({
			url:submitUrl,
			type:'post',
			data:$('#addExtr').serialize(),
			dataType:'json',
			success:function(result){
				if(!result.status){
					alert(result.message);
					return false;
				}
				if(result.advice.action == 'jump'){
					window.location.href=result.advice.url;
					return false;
				}else if(result.advice.action == 'stayDoPay'){
					// 做微信支付
					pay.wxPay(result.group_id);
					return false;
				}else{
					alert('出错了');
					return false;
				}
			}
		});
		return false;
		//$('#addExtr').submit();
	});
}

pay.wxPay = function(groupId){
	$.ajax({
		url:getWxPayContentUrl,
		type:'post',
		data:{'group_id':groupId},
		dataType:'json',
		success:function(result){
			if(!result.status){
				alert(result.message);
				return false;
			}else{
				var wxPayContent = result.content;
				var backUrl = 'order.php?act=list';
				// 调用微信支付接口
				wxPay.init(wxPayContent,backUrl,'stay');
				wxPay.callpay();
			}
		}
	});
}

$(document).ready(function(){
	pay.init();
});