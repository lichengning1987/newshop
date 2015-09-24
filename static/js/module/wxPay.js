/**
 * 
 */
var wxPay = {};

wxPay.init = function(payContent,backUrl,action){
	this.payContent = payContent;
	this.backUrl = backUrl;
	this.action = action;
}

wxPay.callpay = function()
{
	if (typeof WeixinJSBridge == "undefined"){
	    if( document.addEventListener ){
	        document.addEventListener('WeixinJSBridgeReady', wxPay.jsApiCall, false);
	    }else if (document.attachEvent){
	        document.attachEvent('WeixinJSBridgeReady', wxPay.jsApiCall); 
	        document.attachEvent('onWeixinJSBridgeReady', wxPay.jsApiCall);
	    }
	}else{
	    wxPay.jsApiCall();
	}
}

wxPay.jsApiCall = function(){
	WeixinJSBridge.invoke(
		'getBrandWCPayRequest',
		$.parseJSON(wxPay.payContent),
		function(res){
			WeixinJSBridge.log(res.err_msg);
			//alert(res.err_code+res.err_desc+res.err_msg);
			if(res.err_msg == "get_brand_wcpay_request:ok"){
				window.location.href = wxPay.backUrl+"&type=all";
				return false;
			} else if(res.err_msg = "get_brand_wcpay_request:cancel"){
				if(wxPay.action == 'jump'){
					alert("您中途取消支付,可在待支付订单中重新支付");
					window.location.href = wxPay.backUrl+"&type=unpay";
				}else{
					alert("您中途取消支付,可尝试重新支付");
				}
				return false;
			} else{
				if(wxPay.action == 'jump'){
					alert("支付出错,可在待支付订单中重新支付");
					window.location.href = wxPay.backUrl+"&type=unpay";
				}else{
					alert("支付出错,可尝试重新支付");
				}
				return false;
			}
		}
	);
}
