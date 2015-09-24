

var order = {};

order.init = function(){
	this.page = staticPage;
	this.orderType = type;
	this.picUrl = picUrl;
	this.active();
	this.all();
	this.unpay();
	this.unship();
	this.alship();
	this.evaluate();
	this.refund();
    this.myScroll="";
    this.myScrollfun();
}

order.active = function(){
	$(".order-head .tabs-line").width($(".tabs .swiper-slide").eq(0).width());
	
	$('.tabBox').find('.swiper-slide').removeClass('active');
	$('.tabBox').find('.'+type).addClass('active');
	$(".tabBox .tabs-line").css({
        "left":($(".tabs .swiper-slide").eq(0).width())*$('.tabBox').find('.'+type).index()+"px"
    });
}

// 所有订单
order.all = function(){
	$('.allSlide').on('click','.deletebtn',function(e){
		e.preventDefault();
		var orderId = $(this).parent().data('id');
		order.hideOrder(orderId,$(this));
	});
	$('.allSlide').on('click','.alshipBtn',function(e){
		e.preventDefault();
		var obj = $(this);
		var url = $(this).attr('href');
		var action = $(this).data('action');
		if(action == 'post'){
			var param = url.split('||');
			var orderId = param[1];
		}
		$.confirm("确认收货吗？",function(flag){
			if(flag){
				$.ajax({
					url:param[0],
					type:'post',
					data:{'order_id':param[1]},
					dataType:'json',
					success:function(result){
						if(result.status == 1){
							obj.closest('.orderList').slideUp(100);
//							window.location.reload();
						}else{
							alert(result.message);
						}
					}
				});
			}
		});
	});
	$('.allSlide').on('click','.commentBtn',function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var action = $(this).data('action');
		if(action == 'jump'){
			window.location.href=url;
		}
	});
	$('.allSlide').on('click','.showProcessBtn',function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var action = $(this).data('action');
		if(action == 'jump'){
			window.location.href=url;
		}
	});
	$('.allSlide').on('click','.showProcessBtn',function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var action = $(this).data('action');
		if(action == 'jump'){
			window.location.href=url;
		}
	});
	$('.allSlide').on('click','.cancelRefundBtn',function(e){
		e.preventDefault();
		var obj = $(this);
		var url = $(this).attr('href');
		var action = $(this).data('action');
		if(action == 'post'){
			var param = url.split('||');
			var orderId = param[1];
		}
		$.confirm("确认取消退款吗？",function(flag){
			if(flag){
				$.ajax({
					url:param[0],
					type:'post',
					data:{'order_id':param[1]},
					dataType:'json',
					success:function(result){
						if(result.status == 1){
							obj.closest('.orderList').slideUp(100);
//							window.location.reload();
						}else{
							alert(result.message);
						}
					}
				});
			}
		});
	});
}

// 待支付
order.unpay = function(){
    var self=this;
	$('.unpaySlide').on('click','.deletebtn',function(e){
		e.preventDefault();
		var groupId = $(this).data('id');
		var obj = $(this);

		$.confirm("确认删除吗？",function(flag){
			if(flag){
				$.ajax({
					url:delOrderGroupUrl,
					type:'post',
					data:{'group_id':groupId},
					dataType:'json',
					success:function(result){
						if(result.status == 1){
							obj.closest('.orderList').slideUp(100);
                            obj.closest('.orderList').remove();
                            self.myScroll.refresh();

						}else{
							alert('删除失败');
						}
					}
				});
			}
		});
		
	});
}

// 待发货
order.unship = function(){
	$('.unshipSlide').on('click','.deletebtn',function(e){
		e.preventDefault();
		var orderId = $(this).parent().data('id');
		order.hideOrder(orderId,$(this));
	});
}

// 待收货
order.alship = function(){

    var self = this;
	$('.alshipSlide').on('click','.deletebtn',function(e){
		e.preventDefault();
		var orderId = $(this).parent().data('id');
		order.hideOrder(orderId,$(this));
	});
	$('.alshipSlide').on('click','.alshipbtn',function(e){
		e.preventDefault();
		var orderId = $(this).parent().data('id');
		var obj = $(this);
		$.confirm("确认收货吗？",function(flag){
			if(flag){
				$.ajax({
					url:confirmOrderUrl,
					type:'post',
					data:{'order_id':orderId},
					dataType:'json',
					success:function(result){
						if(result.status == 1){
							obj.closest('.orderList').slideUp(100);
//							window.location.reload();
                            obj.closest('.orderList').remove();
                            self.myScroll.refresh();
						}else{
							alert(result.message);
						}
					}
				});
			}
		});
	});
}


// 待评价
order.evaluate = function(){
	$('.evaluateSlide').on('click','.deletebtn',function(e){
		e.preventDefault();
		var orderId = $(this).parent().data('id');
		order.hideOrder(orderId,$(this));
	});
	$('.evaluateSlide').on('click','.evaluatebtn',function(e){
		e.preventDefault();
		var orderId = $(this).parent().data('id');
		var goodsId = $(this).parent().data('goodsid');
		window.location.href="evaluate.php?act=comment&order_id="+orderId+"&good_id="+goodsId;
		return false;
	});
}

// 待退货
order.refund = function(){
	// 取消退单
	$('.refundSlide').on('click','.cancelBtn',function(e){
		e.preventDefault();
		var refundId = $(this).parent().data('refundid');
//		var obj = $(this);
		$.confirm("确认取消退单吗？",function(flag){
			if(flag){
				$.ajax({
					url:cancelRefundUrl,
					type:'post',
					data:{'chargeback_id':refundId},
					dataType:'json',
					success:function(result){
						if(result.status == 1){
							window.location.href="order.php?act=list&type=refund";
//							obj.closest('.orderList').slideUp(100);
						}else{
							alert('退单失败');
						}
					}
				});
			}
		});
	});
	// 查看流程
	$('.refundSlide').on('click','.viewBtn',function(e){
		e.preventDefault();
		var refundId = $(this).parent().data('refundid');
		var orderId = $(this).parent().data('id');
		window.location.href="service.php?act=service_process&order_id="+orderId;
		return false;
	});
	// 重新申请
	$('.refundSlide').on('click','.applyBtn',function(e){
		e.preventDefault();
		var refundId = $(this).parent().data('refundid');
		var orderId = $(this).parent().data('id');
		window.location.href="service.php?act=agreement&order_id="+orderId;
		return false;
	});
}

order.hideOrder = function(orderId,obj){
    var self=this;
	$.confirm("确认删除吗？",function(flag){
		if(flag){
			$.ajax({
				url:hideOrderUrl,
				type:'post',
				data:{'order_id':orderId},
				dataType:'json',
				success:function(result){
					if(result.status == 1){
						obj.closest('.orderList').slideUp(100);
                        obj.closest('.orderList').remove();
                        self.myScroll.refresh();
					}else{
						alert('删除失败');
					}
				}
			});
		}
	});
	
}

order.getMoreOrder = function(self,func){
	$.ajax({
         'url':getMoreOrderUrl,
         'data':{'page':order.page,'type':order.orderType},
         'type':'post',
         'dataType':'json',
         success:func
   });
}

order.createGroupLiHtml = function(nowGroup,buttonHtml){
	var orderHtmls = "";
	for(o in nowGroup.orders){
		var nowOrder = nowGroup.orders[o];
		var disableHtml = "";
		if(nowOrder.goods[0].is_change != undefined && nowOrder.goods[0].is_change > 0){
			disableHtml = '<span class="failstate"></span>';
		}
		orderHtmls += '<li>\
                <a href="order.php?act=detail&order_id='+nowOrder.order_id+'">\
                    <img src="'+order.picUrl + nowOrder.goods[0].goods_image+'" alt=""/>\
                    '+disableHtml+'\
                    <div class="orderlist-productinfo">\
                        <div class="orderlist-table">\
                            <div class="productBox">\
                                <p>\
                                '+nowOrder.goods[0].goods_name+'\
                                </p>\
                                <p class="meas">\
                                '+nowOrder.goods[0].specification+'\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="orderList-price fr">\
                        <div class="orderlist-table">\
                            <div class="productBox">\
                                <p class="price">\
                                    ￥ '+nowOrder.goods[0].price+'元\
                                </p>\
                                <p class="nums">\
                                    x <em>'+nowOrder.goods[0].quantity+'</em>\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                </a>\
            </li>';
	}
	var html = '<div class="orderList">\
        <div class="orderListBox clearfix">\
            <p class="orderList-status success fl">\
		待付款\
            </p>\
            <p  class="orderList-ordernum fr">\
		订单组号：'+nowGroup.group_id+'\
            </p>\
        </div>\
        <ul class="orderList-product">\
		'+orderHtmls+'\
        </ul>\
        <div class="orderList-totalprice clearfix">\
	        <span class="totalPrice fr">\
	            总价：<em>￥'+nowGroup.group_amount+'</em>\
	        </span>\
	        <span class="totalNum fr">\
	            共'+nowGroup.quantity+'件商品\
	        </span>\
        </div>\
	    '+buttonHtml+'\
	 </div>';
	return html;
}

order.createNomalLiHtml = function(nowOrder,buttonHtml,staticHeaderHtml){
	var disableHtml = "";
	if(staticHeaderHtml == undefined){
		if(nowOrder.types != undefined){
			staticHeaderHtml = nowOrder.types.zh;
		}else if(nowOrder.typeName != undefined){
			staticHeaderHtml = nowOrder.typeName.zh;
		}
	}
	if(nowOrder.disable != undefined){
		disableHtml = '<span class="failstate"></span>';
	}
	var html = '<div class="orderList">\
        <div class="orderListBox clearfix">\
            <p class="orderList-status success fl">\
                '+staticHeaderHtml+'\
            </p>\
            <p  class="orderList-ordernum fr">\
                订单号：'+nowOrder.order_sn+'\
            </p>\
        </div>\
        <ul class="orderList-product">\
            <li>\
                <a href="order.php?act=detail&order_id='+nowOrder.order_id+'">\
                    <img src="'+order.picUrl + ((nowOrder.image_url == undefined)?nowOrder.goods_image:nowOrder.image_url)+'" alt=""/>\
                    '+disableHtml+'\
                    <div class="orderlist-productinfo">\
                        <div class="orderlist-table">\
                            <div class="productBox">\
                                <p>\
                                '+nowOrder.goods_name+'\
                                </p>\
                                <p class="meas">\
                                '+nowOrder.specification+'\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="orderList-price fr">\
                        <div class="orderlist-table">\
                            <div class="productBox">\
                                <p class="price">\
                                    ￥ '+Math.round(nowOrder.goods_amount/nowOrder.quantity)+'元\
                                </p>\
                                <p class="nums">\
                                    x <em>'+nowOrder.quantity+'</em>\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                </a>\
            </li>\
        </ul>\
        <div class="orderList-totalprice clearfix">\
	        <span class="totalPrice fr">\
	            总价：<em>￥'+nowOrder.order_amount+'</em>\
	        </span>\
	        <span class="totalNum fr">\
	            共'+nowOrder.quantity+'件商品\
	        </span>\
        </div>\
	    '+buttonHtml+'\
	 </div>';
	return html;
}

order.createNomalButton = function(nowOrder){
	switch(order.orderType){
	case 'all':
		var menuHtml = "";
		for(o in nowOrder.menu){
			menuHtml += '<a class="operatebtn '+nowOrder.menu[o].class+'" href="'+nowOrder.menu[o].url+'" data-action="'+nowOrder.menu[o].action+'">\
				'+nowOrder.menu[o].name+'\
				</a>';
		}
		var buttonHtml = '<div class="orderList-btnBox clearfix" data-id="'+nowOrder.order_id+'">\
	    	'+menuHtml+'\
		</div>';
		break;
	case 'unpay':
		var payButtonHtml = "";
		if(parseInt(nowOrder.closed) != 1){
			payButtonHtml = '<a class="operatebtn" href="checkout.php?act=addExtr&group_id='+nowOrder.group_id+'">付款</a>';
		}
		var buttonHtml = '<div class="orderList-btnBox clearfix">\
			'+payButtonHtml+'\
            <a class="operatebtn deletebtn" data-id="'+nowOrder.group_id+'" href="#">\
                删除订单\
            </a>\
        </div>';
		break;
	case 'unship':
//		var buttonHtml = '<div class="orderList-btnBox clearfix" data-id="'+nowOrder.order_id+'">\
//	    	<a class="operatebtn deletebtn" href="">\
//	        	删除订单 \
//	    	</a>\
//		</div>';
		var buttonHtml = "";
		break;
	case 'alship':
//		var buttonHtml = '<div class="orderList-btnBox clearfix" data-id="'+nowOrder.order_id+'">\
//			<a class="operatebtn alshipbtn" href="">\
//        		确认收货\
//        	</a>\
//			<a class="operatebtn deletebtn" href="">\
//	        	删除订单 \
//	    	</a>\
//		</div>';
		var buttonHtml = '<div class="orderList-btnBox clearfix" data-id="'+nowOrder.order_id+'">\
			<a class="operatebtn alshipbtn" href="">\
	    		确认收货\
	    	</a>\
		</div>';
		break;
	case 'evaluate':
		var buttonHtml = '<div class="orderList-btnBox clearfix" data-id="'+nowOrder.order_id+'" data-goodsid="'+nowOrder.goods_id+'">\
			<a class="operatebtn evaluatebtn" href="">\
		评价\
	    	</a>\
		</div>';
		break;
	case 'refund':
		var buttonHtml = "";
		var actionHtmls = "";
		if(nowOrder.action){
			for(o in nowOrder.action){
				var nowAction = nowOrder.action[o];
				actionHtmls += '<a class="operatebtn '+nowAction.action+' href="">\
                    '+nowAction.name+'\
                </a>';
			}
			var buttonHtml = '<div class="orderList-btnBox clearfix" data-id="'+nowOrder.order_id+'" data-refundid="'+nowOrder.chargeback_id+'">\
				'+actionHtmls+'\
            </div>';
		}
		break;
	}
	
	return buttonHtml;
}

order.unpayPull = function(result,obj){
	var el, li, i;
	el = $("#orderwrapper .content-slide");
	if(result.status == 1){
		for(o in result.data.data){
			var nowGroup = result.data.data[o];
			var html = order.createGroupLiHtml(nowGroup,order.createNomalButton(nowGroup));
			el.append(html);
		}
		order.page ++;
	}else{
		alert('哦哦，没有了');
	}
	obj.myScroll.refresh();
}

order.nomarlPull = function(result,obj){
	var el, li, i;
	el = $("#orderwrapper .content-slide");
	if(result.status == 1){
		for(o in result.data.orders){
			var nowOrder = result.data.orders[o];
			var html = order.createNomalLiHtml(nowOrder,order.createNomalButton(nowOrder));
			el.append(html);
		}
		order.page ++;
	}else{
		alert('哦哦，没有了');
	}
	obj.myScroll.refresh();
}

order.dataPull = function(result,obj,staticHeader){
	var el, li, i;
	el = $("#orderwrapper .content-slide");
	if(result.status == 1){
		for(o in result.data.data){
			var nowOrder = result.data.data[o];
			var html = order.createNomalLiHtml(nowOrder,order.createNomalButton(nowOrder),staticHeader);
			el.append(html);
		}
		order.page ++;
	}else{
		alert('哦哦，没有了');
	}
	obj.myScroll.refresh();
}

order.pullUp = function(){
    var self=this;
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        switch(order.orderType){
        case "all":
        		order.getMoreOrder(self,function(ev){
        			order.nomarlPull(ev,self);
        		});
        		break;
        case 'unpay':
        		order.getMoreOrder(self,function(ev){
        			order.unpayPull(ev,self);
        		});
        		break;
        case 'unship':
	        	order.getMoreOrder(self,function(ev){
	    			order.nomarlPull(ev,self);
	    		});
        		break;
        case 'alship':
        		order.getMoreOrder(self,function(ev){
	    			order.nomarlPull(ev,self);
	    		});
        		break;
        case 'evaluate':
        		var staticHeader = "待评价";
        		order.getMoreOrder(self,function(ev){
	    			order.dataPull(ev,self,staticHeader);
	    		});
        		break;
        case 'refund':
	    		order.getMoreOrder(self,function(ev){
	    			order.dataPull(ev,self);
	    		});
	    		break;
        }
   		// Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!

}

order.myScrollfun=function(){
    var  pullUpEl = document.getElementById('pullUp');
    var  pullUpOffset = pullUpEl.offsetHeight;
    var self=this;
    this.myScroll = new iScroll('orderwrapper', {
        useTransition: true,
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '下拉刷新...';
            }
        },
        onScrollMove: function () {
            if(this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '下拉刷新...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '<div class="loading" style="text-align:center;"><i class="icon-load"></i><span>正在加载中...</span></div>';
                self.pullUp();	// Execute custom function (ajax call?)
            }
        }
    });

}

$(document).ready(function(){
    order.init();
});