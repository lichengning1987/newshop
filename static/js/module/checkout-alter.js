

var checkout = {};

var addressType = 'address';
var addressBackUrl = 'checkout.php';
var checkAddressUrl = 'order.php?act=checkAddress';
var checkGoodsIds = '6,4';
var paymentJson = [{"value":2,"name":"\u652f\u4ed8\u5b9d\u652f\u4ed8"},{"value":100,"name":"\u8d27\u5230\u4ed8\u6b3e"}];
var couponJson = [{"value":0,"name":"\u4e0d\u4f7f\u7528","amount":0}];
var integralJson = [{"name":94,"value":94,"discount":"4.70","text":"94\u79ef\u5206\u62b5\u6263\u4e3a4.70\u5143","enable":true},{"name":1000,"value":1000,"discount":10,"text":"1000\u79ef\u5206\u62b5\u6263\u4e3a10\u5143","enable":false},{"name":1900,"value":1900,"discount":20,"text":"1900\u79ef\u5206\u62b5\u6263\u4e3a20\u5143","enable":false},{"name":4500,"value":4500,"discount":50,"text":"4500\u79ef\u5206\u62b5\u6263\u4e3a50\u5143","enable":false},{"name":8000,"value":8000,"discount":100,"text":"8000\u79ef\u5206\u62b5\u6263\u4e3a100\u5143","enable":false}];
var changeReal = '0.01';
var userIntegral = '94';
var paymentSelect = '2';
var couponSelect = '0';
var integralSelect = '0.00';
var calCoupon = '0';
var calIntegral = '0.00';


checkout.init = function(){


    this.calCoupon = calCoupon;
	this.calIntegral = calIntegral;
	//this.changeReal = changeReal;
	this.userIntegral = userIntegral;

	this.paySelectValue = paymentSelect;
	this.couponSelectValue = couponSelect;
	this.integralSelect = integralSelect;
    this.jfSelectValue = integralJson;


	this.address();	
	this.submit();
    this.chooseCard();
    this.scoreSelect();
    this.choosePayStyle();
    this.choosepay(); //选择支付方式
}

checkout.choosepay = function(){
    $(".paylist").on("click","li",function(e){
        e.preventDefault();
        $(".paylist li").removeClass("select");
        $(e.currentTarget).addClass("select");
    })

}

checkout.address = function(){
	$(".chooseAddress").click(function(){
        var backUrl = addressBackUrl;
        var goodsId = $('#goodsId').val();
        var addrId = $('#addrId').val();
        var stageId = $('#stageId').val();
        var phone = $('#phone').val();
        var consignee = $('#consignee').val();
        var remark = encodeURIComponent($("#remark").val());
        var url = "address.php?act=chooseAddress&spec_act=save&sec_act=chooseAddress&addressType="+addressType;
        url += "&goodsId="+goodsId+"&addrId="+addrId+"&stageId="+stageId+"&phone="+phone+"&consignee="+consignee+"&remark="+remark+"&back_url="+backUrl;
        window.location.href=url
        return false;
    });
}
checkout.submit = function(){
	$('.submitBtn').click(function(e){
		e.preventDefault();
		var flag = checkout.checkAddress();
		if(flag){
			$('#confirmOrder').submit();
		}
		return false;
	});
}
checkout.checkAddress = function(){
//	return true;
	var goodsIds = checkGoodsIds;
	var addrId = $('#addrId').val();
	var flag = false;
	$.ajax({
		url:checkAddressUrl,
		async:false,
		type:'post',
		data:{'goods_ids':goodsIds,'addr_id':addrId},
		dataType:'json',
		success:function(result){
			if(result.status == 1){
				flag = true;
			}else{
				alert("该地址不在此次购买配送范围之内");
			}
		}
	});
	return flag;
}


//选择优惠券
checkout.chooseCard = function(){
	if(!$(".choose-card").hasClass('grey')){
		$(".choose-card").Select({
			content:checkout.createCouponHtml('radio2',couponJson,checkout.couponSelectValue),
			autoInit: true,
			callback: function(){
                /*点击不使用*/
				/*$(".choose-card-text").text('-￥' + $(".radio2:checked").data('amount').toFixed(2));
				$('#use_id').val($('.radio2:checked').val());
				checkout.calCoupon = $(".radio2:checked").data('amount');
				checkout.changeIntegralStatus();
				checkout.autoCalculate();*/
                checkout.calCoupon = 0;
                checkout.changeIntegralStatus();
				checkout.autoCalculate();
			}
		});

        //选择优惠券
        $(document).on("click",".padding1em",function(e){
            var $dialog=$(e.currentTarget).closest(".dialog"),
                $dialogMask=$(".dialog-mask"),
                $pad=$(e.currentTarget).find(".h2");

            if(!$pad.hasClass("disabled")){
                //判断是否点击优惠券弹出框
                if($pad.data("amount") != undefined){
                    checkout.calCoupon = $pad.data("amount");
				    checkout.changeIntegralStatus();
				    checkout.autoCalculate();
                    $dialog.stop().animate({'bottom': -$dialog.height()}, 300, function(){
                        $dialog.hide();
                        $dialogMask.hide();
                    });
                }
            }
		})

	}
}

checkout.createCouponHtml = function(className,data,i){
	var pHtml = "";
	for(o in data){
		pHtml += '<p class="bb padding1em"> <label ><span class="h2 gray '+className+'" data-amount="'+data[o].amount+'">'+data[o].name+'</span></label></p>';
	}
	var html = '<div class="list">\
		'+pHtml+'\
	</div>';
	return html;
}


// 改变积分选择状态
checkout.changeIntegralStatus = function(){
	var totalAmount = parseFloat($('#totalAmount').val()) - parseFloat(checkout.calCoupon);
	var objs = $('.radio4');
	var count = 0;

	for(var i = 0; i<objs.length; i++){
		var discount = parseFloat($(objs[i]).data('discount'));
		var causeIntegral = parseFloat($(objs[i]).data("value"));
        console.log(totalAmount,discount,checkout.userIntegral,causeIntegral);
		if(totalAmount >= discount && checkout.userIntegral >= causeIntegral){
            $(objs[i]).removeClass("disabled");
			count ++;
		}else{
            $(objs[i]).removeClass("disabled").addClass("disabled");
		}
	}
	if(count == 0){
		//$('.choose-scoreBtn').addClass('grey');
	}else{
		//$('.choose-scoreBtn').removeClass('grey');
	}
}


//选择积分
checkout.scoreSelect = function(){
    $(".jf-btn").on("tap",function(){
        if($(this).hasClass("select")){
            //取消选中
            $(this).removeClass("select")
        }else{
            //选中
            $(this).addClass("select")
        }

    })

    //积分规则介绍
    var oDemos="<div class='dialog-jfcontent animation fadeIn'><i class='j-closebtn'>X</i><ul><li>①积分与现金的兑换比例为100:1</li><li>②啊呜目前支持固定金额的积分兑换，600积分兑换5元，1000积分兑换10元，1900积分兑换20元，4500积分兑换50元，8000积分兑换100元</li></ul></div>"
    $("body").append(oDemos);
    $(".dialog-jfcontent").css("marginTop","-"+($('.dialog-jfcontent').height()+100)/2+"px");
    $(".dialog-jfcontent").hide();
    //积分规则介绍
    $(".j-jfinfo").on("tap",function(){
        $(".dialog-jfcontent").show();
        $(".dialog-jfcontent").addClass("play");
    })

    $(".j-closebtn").on("tap",function(){
         $(".dialog-jfcontent").hide();
        $(".dialog-jfcontent").removeClass("play");
    })

}





checkout.createJfHtml = function(className,data,i,datatext){
	var pHtml = "";
	for(o in data){
		pHtml += '<p class="padding1em">\
			<label>\
			<span data-name="'+ data[o].name +'" data-text="'+data[o].text+'"  data-value="'+data[o].value+'" '+((data[o].enable == false)?'class="h2 disabled '+className+'"':'class="h2 '+className+'"')+' data-discount="'+data[o].discount+'">'+data[o].text+'</span>\
			</label>\
			</p>';
		if(i == data[o].value){
			datatext = data[o].text;
		}
	}
	var html = '<div class="list bb">\
		'+pHtml+'\
	</div>';
	return html;
}



// 自动算金额
checkout.autoCalculate = function(){
	var totalAmount = parseFloat($('#totalAmount').val()) - parseFloat(checkout.calCoupon) - parseFloat(checkout.calIntegral);
	if(totalAmount < 0){
		$('#integral').val(0);
		totalAmount += parseFloat(checkout.calIntegral);
		checkout.calIntegral = 0;
		$('.integralSpan').html(0);
		$('.choose-score').val('');
		$('#integral_discount').val(0);
		alert('使用积分数量超出订单金额');
		//return false;
	}
	if(parseFloat(totalAmount) < 0){
		totalAmount = 0;
	}
	totalAmount = parseFloat(totalAmount);
	$('.couponSpan').html(parseFloat(checkout.calCoupon).toFixed(2));
	$('.integralSpan').html(parseFloat(checkout.calIntegral).toFixed(2));
	$(".orange").html("￥"+totalAmount.toFixed(2));
	return true;
}



//选择支付方式
checkout.choosePayStyle = function(){
	$(".choose-pay-style").Select({
		content: checkout.createSelectHtml('radio1',paymentJson,checkout.paySelectValue),
		autoInit: true,
		callback: function(){
			$(".choosepay em").text($(".radio1:checked").siblings('label').find('span').html());
			$('#payment_id').val($(".radio1:checked").val());
		}
	});


}

checkout.createSelectHtml = function(className,data,i){
	var pHtml = "";
	for(o in data){
		pHtml += '<p class="bb padding1em"><input class="'+className+'" type="radio" name="radio-style" value="'+data[o].value+'" '+((i == data[o].value)?'checked="checked"':'')+' /><label for="radio4"><span class="h2 gray">'+data[o].name+'</span></label></p>';
	}
	var html = '<div class="list">\
		'+pHtml+'\
	</div>';
	return html;
}



$(document).ready(function(){
	checkout.init();
});