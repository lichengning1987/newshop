

var order = {};

order.init = function(){
	this.page = staticPage;
	this.orderType = type;
	this.picUrl = picUrl;
	this.active();
	
	this.doAction();
//	this.all();
//	this.unpay();
//	this.unship();
//	this.alship();
//	this.evaluate();
//	this.refund();

    this.imgBox();
    this.loadorderDetail();
    this.odialog="<div class='dialog-order animation fadeRight'><div class='dialog-closefloor'></div><div class='dialog-content'></div> </div>";
    $('body').append(this.odialog);
    this.myScroll="";
    var self=this;
    setTimeout(function(){
       self.myScrollfun();
    },100)


}

// 处理按钮事件
order.doAction = function(){
	$('.groupList').on('click','.operatebtn',function(e){
		e.preventDefault();
		var action = $(this).data('action');
		var href = $(this).data('url');
		if(action == 'jump'){
			window.location.href = href;
			return false;
		}else if(action == 'post'){
			order.doPostThings($(this));
		} else if(action == 'open'){
			order.showOrderDetail($(this));
		}
	})
}

order.doPostThings = function(obj){
	var href = obj.data('url');
	var parseSegment = href.split("||");
	var data = {"group_id":parseSegment[1]};
	if(obj.hasClass("alshipConfirm") && confirm("确认收货吗？")){
		order.doPost(parseSegment[0],data,function(result){
			order.commonCallBack(result,obj);
		});
	}else if(obj.hasClass("unpayDel") && confirm("确认删除订单吗？")){
		order.doPost(parseSegment[0],data,function(result){
			order.reloadCallBack(result,obj);
		});
	}else if(obj.hasClass("cancelBtn") && confirm("确认取消退单吗？")){
		data = {"chargeback_id":parseSegment[1]};
		order.doPost(parseSegment[0],data,function(result){
			order.reloadCallBack(result,obj);
		});
	}else if(obj.hasClass("alRefundDel") && confirm("确认删除订单吗？")){ // 实际上是隐藏订单组
		order.doPost(parseSegment[0],data,function(result){
			order.reloadCallBack(result,obj);
		});
	}else if(obj.hasClass("delBtn") && confirm("确认删除吗?")){
		data = {"chargeback_id":parseSegment[1]};
		order.doPost(parseSegment[0],data,function(result){
			order.reloadCallBack(result,obj);
		});
	}
}

order.doPost = function(url,data,func){
	$.ajax({
		url:url,
		data:data,
		type:'post',
		dataType:'json',
		success:func
	});
}

order.showOrderDetail = function(obj){
	var groupId = obj.closest('.orderList').data('id');
	var href = "order.php?act=groupDetail&group_id="+groupId+"&r="+Math.random();
    $(".dialog-order").show().html("").load(href,function(){
        $(".dialog-order").removeClass("fadeHide").addClass("play").addClass("fadeRight");
         $(".orderDetail-wrap .orderList").css({
             "height":($(window).height()-$(".orderDetai-BtnWrap").height()-30)+"px",
             "overflow":"auto"
         })
        $(".dialog-mask").show();

    });
}

order.commonCallBack = function(result,obj){
    var self=this;
	if(!result.status){
		alert(result.message);
		return false;
	}else{
		// 刷新页面
		obj.closest('.orderList').slideUp(100,function(){
            obj.closest('.orderList').remove();
            self.myScroll.refresh();
        });
        return false;
	}


}

order.reloadCallBack = function(result,obj){
     var self=this;
	if(!result.status){
		alert(result.message);
		return false;
	}else{
		// 刷新页面
		window.location.reload();
        return false;
	}
}

order.active = function(){
	$(".order-head .tabs-line").width($(".tabs .swiper-slide").eq(0).width());
	$('.tabBox').find('.swiper-slide').removeClass('active');
	$('.tabBox').find('.'+type).addClass('active');
	$(".tabBox .tabs-line").css({
        "left":($(".tabs .swiper-slide").eq(0).width())*$('.tabBox').find('.'+type).index()+"px"
    });

}

order.loadorderDetail = function (){
    var self=this;
    $(document).on("click",'.j-loadetail',function(){
        var href=$(this).data("href")+"?r="+Math.random();
        $(".dialog-order").show().html("").load(href,function(){
            $(".dialog-order").removeClass("fadeHide").addClass("play").addClass("fadeRight");
             $(".orderDetail-wrap .orderList").css({
                 "height":($(window).height()-$(".orderDetai-BtnWrap").height()-30)+"px",
                 "overflow":"auto"
             })
            $(".dialog-mask").show();

        });

    })

    //去评价
    $('body').on("click",".btn-evalute",function(e){
         var oparent=$(e.currentTarget).closest(".orderList").find(".j-loadetail");
          oparent.trigger("click");
    })

    //收起操作
    $(document).on("tap",'.dialog-mask',function(){

        $(".dialog-order").removeClass("fadeRight").addClass("fadeHide");
        self.myScroll.refresh();
        setTimeout(function(){
         $('.dialog-mask').hide();
        },500)

    })

    $(document).on("tap",".j-maskhide",function(e){
        $(".dialog-order").removeClass("fadeRight").addClass("fadeHide");
         self.myScroll.refresh();
        setTimeout(function(){
         $('.dialog-mask').hide();
        },500)

         //$('.dialog-mask').trigger("click");
    })



}


order.imgBox= function (){
    var oelis='<span class="order-elips"><img src="'+staticUrl+'/img/order/elips.png"><em>更多</em></span>',ohas=true;

    $(".orderList-pdmore").each(function(index,item){
        var olinum=$(item).find(".order-imgBox").length,owidth=$(item).find(".order-imgBox").eq(0).width(),oheight=$(item).find(".order-imgBox").eq(0).height();
        var obili=65/58,oelipswid=$(item).find(".order-imgBox").eq(0).width(),oelipsheight= oelipswid/obili,oelipslen=$(item).find(".order-elips").length;

        if(oelipslen<=0){
            $(item).find(".order-imgBox").parent().append(oelis);
            $(".order-elips").width(oelipswid);
            $(".order-elips").height(oelipsheight);
            $(".order-elips").css({
                    "width": owidth+"px",
                    "height":oheight+"px"
            })
            if(olinum>=3){
               $(item).find(".order-imgBox").hide();
               for(var i=0;i<3;i++){
                 $(item).find(".order-imgBox").eq(i).show();
               }

            }
        }
    })
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
	var imagesHtmls = "";
	var disableHtmls = "";
	for(q in nowGroup.orderGoodsImage.pics){
		disableHtmls = "";
		if(nowGroup.orderGoodsImage.pics[q].disable){
			disableHtmls = '<i class="icon-failstate"></i>';
		}
		imagesHtmls += '<span class="order-imgBox"><img src="'+order.picUrl + nowGroup.orderGoodsImage.pics[q].img+'" alt=""/>'+disableHtmls+'</span>';
	}
	var html = '<div class="orderList" data-type="'+nowGroup.priority.type+'" data-id="'+nowGroup.group_id+'">\
    				<div class="orderListBox clearfix">\
				    <p class="orderList-status '+nowGroup.translate.pClass+' fl">\
				        <i class="ordericon '+nowGroup.translate.iClass+'"></i>'+nowGroup.translate.title+'\
				    </p>\
				    <p  class="orderList-ordernum fr">\
				         '+nowGroup.createtime+'\
				    </p>\
				</div>\
				 <ul class="orderList-pdmore orderList-product">\
				    <li>\
				        <a class="j-loadetail" href="javascript:void(0);" data-href="order.php?act=groupDetail&group_id='+nowGroup.group_id+'&tag=1">\
				            <!--多个产品-->\
				            '+imagesHtmls+'\
				            <!--多个产品end-->\
				        </a>\
				    </li>\
				</ul>\
				<div class="orderList-btnBox btborder clearfix">\
				    <span class="totalPrice fl">\
				     总价：<em class="orange-icon">￥'+nowGroup.group_amount+'</em>\
				     </span>\
				     '+buttonHtml+'\
				</div>\
			</div>';
	return html;
}

order.createNomalLiHtml = function(nowOrder,buttonHtml){
	var disableHtml = "";
	if(nowOrder.disable != undefined){
		disableHtml = '<span class="failstate"></span>';
	}
	var html = '<div class="orderList" data-type="orderRefund" data-id="'+nowOrder.orders[0].order_id+'">\
				        <div class="orderListBox clearfix">\
				    <p class="orderList-status '+nowOrder.translate.pClass+' fl">\
				        <i class="ordericon '+nowOrder.translate.iClass+'"></i>'+nowOrder.translate.title+'\
				    </p>\
				    <p  class="orderList-ordernum fr">\
				        '+nowOrder.orders[0].createtime+'\
				    </p>\
				</div>\
				<ul class="orderList-pdmore orderList-product">\
				    <li>\
				        <a class="j-loadetail" href="javascript:void(0);" data-href="order.php?act=orderDetail&order_id='+nowOrder.orders[0].order_id+'&tag=1">\
				            <!--多个产品-->\
				                <span class="order-imgBox"><img src="'+order.picUrl + nowOrder.orders[0].goods_image+'" alt=""/></span>\
				            <!--多个产品end-->\
				        </a>\
				    </li>\
				</ul>\
				<div class="orderList-btnBox btborder clearfix">\
				<span class="totalPrice fl">\
				总价：<em class="orange-icon">￥'+nowOrder.orders[0].order_amount+'</em>\
				</span>\
				    '+buttonHtml+'\
				</div>\
			</div>';
	return html;
}

order.createNomalButton = function(menus){
	var buttonHtml = "";
	for(o in menus){
		buttonHtml += '<a class="operatebtn btn-orange '+menus[o].class+'" data-action="'+menus[o].action+'" href="" data-url="'+menus[o].url+'">\
						'+menus[o].name+'\
                      </a>';
	}
	return buttonHtml;
}

order.groupPull = function(result,obj){
	var el, li, i;
	el = $("#orderwrapper .content-slide");
	if(result.status == 1){
		for(o in result.data.data){
			var nowGroup = result.data.data[o];
			var html = order.createGroupLiHtml(nowGroup,order.createNomalButton(nowGroup.Menu));
			el.append(html);
		}
		order.page ++;
	}else{
		alert('哦哦，没有了');
	}
	obj.myScroll.refresh();
    obj.imgBox();
}

order.orderPull = function(result,obj){
	var el, li, i;
	el = $("#orderwrapper .content-slide");
	if(result.status == 1){
		for(o in result.data.data){
			var nowOrder = result.data.groupData[o];
			var html = order.createNomalLiHtml(nowOrder,order.createNomalButton(nowOrder.Menu));
			el.append(html);
		}
		order.page ++;
	}else{
		alert('哦哦，没有了');
	}
	obj.myScroll.refresh();
    obj.imgBox();
}

order.pullUp = function(){
    var self=this;
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        switch(order.orderType){
        case "all":
        		order.getMoreOrder(self,function(ev){
        			order.groupPull(ev,self);

        		});
        		break;
        case 'unpay':
        		order.getMoreOrder(self,function(ev){
        			order.groupPull(ev,self);
        		});
        		break;
        case 'unship':
	        	order.getMoreOrder(self,function(ev){
	    			order.groupPull(ev,self);
	    		});
        		break;
        case 'alship':
        		order.getMoreOrder(self,function(ev){
	    			order.groupPull(ev,self);
	    		});
        		break;
        case 'evaluate':
        		var staticHeader = "待评价";
        		order.getMoreOrder(self,function(ev){
	    			order.groupPull(ev,self,staticHeader);
	    		});
        		break;
        case 'refund':
	    		order.getMoreOrder(self,function(ev){
	    			order.orderPull(ev,self);
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
            if(this.y>=0){
               self.myScroll.refresh();
            }

        }
    });

}

$(document).ready(function(){
    order.init();
});