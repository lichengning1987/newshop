

var detail = {};

detail.init = function(){
    this.purchaseQuantity = purchaseQuantity;
    this.nowDate = nowDate;
    this.disableCart();
	var selected;
    var self=this;
    this.scaleCount = count;
    this.page = staticPage;
    this.specAction = specAction;
    this.advice = advice;
    
    
	this.slide();
	this.addMin();
	this.collect();
	this.cart();
	this.buy();
    this.changeimg();
    this.timeDateDown();
    this.obool=true; //滚动到最后没数据时的判断值
    /*滚动在底部进行加载*/
    $(window).scroll(function(){
        self.mouseScroll();
    })
    var omask='<div class="dialog-mask" id="dialog-mask"></div>'
    $("body").append(omask)
}

detail.disableCart = function(){

    if(parseInt(this.purchaseQuantity) == 1){
        $(".td1").addClass("disable");
        $(".td2").addClass("disable");
        $(".td3").addClass("disable");
    }

}
detail.changeimg = function(){

    var oimgproportion=369/274;
    $(".wrap .image").each(function(index,item){
        var owidth=$(item).width();
        var oheight=$(item).width()/oimgproportion;
        $(item).css({
            width:owidth+"px",
            height:oheight+"px"
        })
        $(".slider #position").css("top",$(item).width()/oimgproportion-20+"px")
    })

}


detail.slide = function(){
	var slider =
		Swipe(document.getElementById('slider'), {
			auto: 3000,
			continuous: true,
			disableScroll: true,  
			callback: function(pos) {
				var i = bullets.length;
				while (i--) {
					bullets[i].className = ' ';
				}
				bullets[pos].className = 'on';

			}
		});
	var bullets = document.getElementById('position').getElementsByTagName('li');
}

detail.addMin=function(){
	//增加删除商品数目
    if($(".td1").hasClass("disable")){
        return false;
    }
	$(".td1").click(function(){
		nums=Number($(this).next().html());
		if(nums>1){
			nums-=1;
			$(this).next().html(nums);
			detail.scale();
		}
		if(detail.purchaseQuantity > 0 && detail.purchaseQuantity <= nums + 1){
			$('.td3').removeClass('disable');
		}
	});
	$(".td3").click(function(){
		if(detail.purchaseQuantity > 0){
			nums=Number($(this).prev().html());
			if(detail.purchaseQuantity <= nums){
				$('.td3').addClass('disable');
				alert('该产品有购买数量的限制，一次只能购买'+detail.purchaseQuantity+'个');
			}else{
				nums+=1;
			}
		} else {
			nums=Number($(this).prev().html());
			nums+=1;
		}
		$(this).prev().html(nums);
		detail.scale();
	});
}

detail.collect=function(){
	$("#slider").delegate(".uncollect","click",function(){
		var goodsId = $(this).data('id');
		obj = $(this);
		$.ajax({
            url:colAddUrl,
            type:'post',
            data:{'goods_id':goodsId},
            dataType:'json',
            success:function(result){
                if(result.status == 1){
                	obj.html("已收藏");
                	obj.addClass("collect").removeClass("uncollect");
                }else{
                    alert('收藏失败，请稍后再试');
                }
            }
        });
		

	});
	$("#slider").delegate(".collect","click",function(){
		var goodsId = $(this).data('id');
		obj = $(this);
		$.ajax({
            url:colDelUrl,
            type:'post',
            data:{'goods_id':goodsId},
            dataType:'json',
            success:function(result){
                if(result.status == 1){
                	obj.html("收藏 ");
            		obj.addClass("uncollect").removeClass("collect");
                }else{
                    alert('取消收藏失败，请稍后再试');
                }
            }
        });
		
	});

	$(".table1 td").click(function(){
		if(!$(this).hasClass("disables")){
			if($(this).hasClass("on")){
				$(this).removeClass("on");
			}else{
				$(this).addClass("on");
				$(this).siblings().each(function(){
					$(this).removeClass("on");
				});
			}
			detail.scale();
		}		
	});

	$(".details-title").click(function(){
		$(".details").show();
		$(".comment").hide();
		$(".bottom-bar").animate({left:0},600);
		$(this).css({"color":"#eb891c"});
		$(this).siblings().css({"color":"#858585"});
	});
	$(".comment-title").click(function(){
		$(".comment").show();
		$(".details").hide();
		$(".bottom-bar").animate({left:"50%"},600);
		$(this).css({"color":"#eb891c"});
		$(this).siblings().css({"color":"#858585"});
	});

	//选择规格
	$(".scale-select").click(function(){
		$(".scale").show();
		$(".scale .goods-ok").hide();
		$(".add-goods").show();
		$(".select-scale").addClass("on");
		detail.scale();
		return false;
	});
	$(".scale .goods-ok").click(function(){		
		detail.scale();
		$(".scale").hide();		
	});

	$(".scale-title span").click(function(){
		$(".scale").hide();
        $("#dialog-mask").hide();
	});
}
//填写规格
detail.scale=function(){
	selected='';
	$(".scale label tr").each(function(i){
		$(this).find("td").each(function(j){
			if($(this).hasClass("on")){
				selected += '"'+ $(this).html() + '" ';
			}
		});
	});
	selected = selected+'"x'+parseInt($('.table3').find('.td2').text())+'"';
	$(".select-scale").html(selected);
	$(".your-select").html(selected);
	/*if(detail.scaleCount == 1){
		selected = selected+'"x'+parseInt($('.table3').find('.td2').text())+'"';
		$(".select-scale").html(selected);
		$(".your-select").html(selected);
	}else{
		$(".select-scale").html(selected);
		$(".your-select").html(selected+'"x'+parseInt($('.table3').find('.td2').text())+'"');
	}*/
};
//购物车相关
detail.cart = function(){

    /*购物车数字是否显示*/
    var carnums=$(".cart-nums");
    if(carnums.text()>0){
        carnums.removeClass("hide");
    }
    if(carnums.text()>=10){
        carnums.addClass("bignums");
    }else{
        carnums.removeClass("bignums");
    }

    /*直接点击购物车 点击加入购物车*/
	$('.bill .cart-add').click(function(){
		if(detail.specAction.specAction != undefined && detail.specAction.specAction == 'disableCart'){
			alert(detail.specAction.comment);
			return false;
		}
		$(".scale").show();
		$(".scale .goods-ok").show();
		$(".add-goods").hide();
		$(".select-scale").addClass("on");
		$("#dialog-mask").show();
		$(".scale .goods-ok").off().click(function(){
			detail.addCart($(this));
            $("#dialog-mask").hide();
			return false;
			
		});
		return false;
	});
	
	$('.bill .notBegin-add').click(function(){
		if(detail.specAction.specAction != undefined && detail.specAction.specAction == 'disableCart'){
			alert(detail.specAction.comment);
			return false;
		}
		$(".scale").show();
		$(".scale .goods-ok").show();
		$(".add-goods").hide();
		$(".select-scale").addClass("on");
		$("#dialog-mask").show();
		$(".scale .goods-ok").off().click(function(){
			detail.addCart($(this));
            $("#dialog-mask").hide();
			return false;
			
		});
		return false;
	});
	
	
	/*直接点击购物车 点击加入购物车*/


	//点击规格后加购物车
	$(".goods-add").click(function(){
		if(detail.specAction.specAction != undefined && detail.specAction.specAction == 'disableCart'){
			alert(detail.specAction.comment);
			return false;
		}
		detail.addCart($(this));
		return false;
	});
	//点击规格后加购物车
}

// 添加到购物车函数
detail.addCart = function(obj){
	var cartNum = parseInt($('.table3').find('.td2').text());
	var goodsId = $('.table3').data('id');
	var that=obj;
	var specId = $('#spec_id').val();
	if(specId == 0){
		alert('未选择规格');
		return false;
	}
	
	$.ajax({
        url:postUrl,
        async:false,
        type:'post',
        data:{'goods_id':goodsId,'spec_id':specId, 'num':cartNum},
        dataType:'json',
        success:function(result){
     	   if(!result.status){
     		   alert('添加失败');
     	   }else{
	        	// 添加到购物车
       			detail.scale();
       			$(".scale").hide();	
//       			that.shoping({
//       	            cnum:cartNum
//       	        });
       			detail.getCartNum(that);
     	   }
        }
	});
}

// 得到购物车数量
detail.getCartNum = function(obj){
	$.ajax({
        url:getCartNumUrl,
        async:false,
        type:'post',
        data:{},
        dataType:'json',
        success:function(result){
     	   if(result.status){
     		  obj.shoping({
     	         cnum:result.num.count
     	      });
     	   }
        }
	});
}


// 立即购买相关
detail.buy = function(){
	/* 直接点击购买*/
	$('.add-cart .buy').click(function(){		
		$(".scale").show();
		$(".scale .goods-ok").show();
		$(".add-goods").hide();
		$(".select-scale").addClass("on");	
		$("#dialog-mask").show();

		$(".scale .goods-ok").off().click(function(){		
//			detail.scale();
//			$(".scale").hide();	
			return detail.directBuy();
		});
		return false;
	});
	
	

	//点击规格后购买
	$(".goods-buy").click(function(){
//		detail.scale();
//		$(".scale").hide();	
		return detail.directBuy();
	});
}

detail.directBuy = function(){
	var cartNum = parseInt($('.table3').find('.td2').text());
	var goodsId = $('.table3').data('id');
	
	var specId = $('#spec_id').val();
	var limitPurchase = $("#limitPurchase").val();
	if(parseInt(specId) == 0){
		alert('未选择规格');
		return false;
	}
	// 如果有设置了限时抢购 则判断在待支付订单中是有想相同产品
	if(limitPurchase == 1){
		detail.getLimitGoodsOrder(goodsId, specId, cartNum);
		return false;
	}
	var immUrl = "checkout.php?type=IMM_BUY&goods_id="+goodsId+"&spec_id="+specId+"&spec_act=save&amount="+cartNum;
	window.location.href=immUrl;
	return false;
}

detail.getLimitGoodsOrder = function(goodsId, specId, cartNum){
	$.ajax({
		'url':getLimitGoodsOrder,
		'data':{'goods_id':goodsId,'spec_id':specId},
		'type':'post',
		'dataType':'json',
		success:function(result){
			if(!result.status){
				var immUrl = "checkout.php?type=IMM_BUY&goods_id="+goodsId+"&spec_id="+specId+"&spec_act=save&amount="+cartNum;
				window.location.href=immUrl;
			}else{
				var addExtrUrl = "checkout.php?act=addExtr&group_id=" + result.data.group_id;
				window.location.href=addExtrUrl;
			}
			return false;
		}
	});
}


/*创建加载中图片*/
detail.createimg = function(){
    var oimg=$('<div class="loading text-center"><i class="icon-load"></i><span>正在加载中...</span></div>');
    if(!$(".loading").hasClass('loading')){
        $(".j-comments").append(oimg);
    }
}

/*当鼠标滚动到最后元素的时候*/
detail.mouseScroll = function(){
    var fold = $(window).height() + $(window).scrollTop(),self=this;
    if(this.obool){
         if(fold >= $("body").height()){
        setTimeout(function(){
            self.createimg();
        },0);

        function photoMove(callback){
            setTimeout(function(){
                $(".loading").remove();
                callback();
            },2000);
        }
        function callback(){
            /*ajax动态加载数据*/
        	var goodsId = $('.table3').data('id');
        	$.ajax({
        		'url':getMoreCommentsUrl,
        		'data':{'page':detail.page,'goods_id':goodsId},
        		'type':'post',
        		'dataType':'json',
        		success:function(result){
        			if(result.status == 1){
        				var el = $(".commentList");
        				for(o in result.data){
        					var obj = result.data[o];
        					var distanceHtml = "";
        					if(obj.distance != undefined){
        						distanceHtml = '<span class="h3 dark">'+obj.distance+'公里</span>';
        					}
        					var odemos=' <div class="box comment borderbt">\
        		                <div class="title  row">\
        		                <div class="col-50">\
        		                    <div class="row no-gutter"> \
        		                        <div class="col-33"><img src="'+obj.avatar+'"></div> \
        		                            <div class="col-66 name">  \
        		                                <h2 class="h1 cyan">'+obj.app_name+'</h2> \
        		                                <p class="h4 dark">'+obj.comment_time+'</p>   \
        		                            </div>  \
        		                        </div> \
        		                    </div> \
        		                    <div class="col-50 text-right info"> \
        		                        '+distanceHtml+'\
        		                    </div> \
        		                </div> \
        		                <div class="talkInfo row"> \
        		                <div class="col-20"></div> \
        		                <p class="col-80 text_indent">\
        		                '+obj.comment_time+' \
        		            </p> \
        		            </div> \
        		            </div>';
        					el.append(odemos);
        				}
        				this.page ++ ;
//        				alert('hello');
        			}else{
//        				alert('没有新的东西了');
        				return false;
        			}
        		}
        	});

            //无数据加载时判断条件
            if($(".box.comment.borderbt").length>=10){
                self.obool=false;
                $(".j-comments").addClass("pdnone");
            }

        }
        photoMove(function(){
            callback();
        })


    }
    }
}

/*倒计时*/
detail.timeDateDown = function(){
	if(detail.advice != 'countDown'){
		return ;
	}
      var nowdate = detail.nowDate;
	  var now=new Date(nowdate);
      var objs=$(".time-wrap");

      objs.each(function(index,item){
          var id = $(item).data('id');
		  var startTime = new Date($(item).data('start'));
		  var endTime = new Date($(item).data('end'));
		  var state = $(item).data('state'),
              notBtn = $('.add-cart').find(".notBegin-add"),
              buyBtn = $('.add-cart').find(".buy"),
              cartBtn = $('.add-cart').find(".cart-add");

		  $(item).addClass(state);
          //抢购未开始
          if(state == 'notBegin'){
        	  notBtn.show();
			var option = {
				lastTime:startTime,
				now:new Date(nowdate)
			};
            $(item).activeCountDown(option,function(){

                setTimeout(function(){
                    notBtn.hide();
                    buyBtn.removeClass("hide");
                    cartBtn.removeClass("hide");
                    $(item).attr("data-state","begin");
                    $(item).removeClass("notBegin").addClass("begin");
                    $(item).removeClass("notBegin").addClass("begin");
                    var options = {
                                 lastTime:endTime,
                                 now:startTime
                     };
                    $(item).activeCountDown(options,function(){
                        setTimeout(function(){
                              $(item).data("state","end");
                              $(item).removeClass("notBegin").removeClass("begin").addClass("end");
                              //$(item).hide();
                              notBtn.hide();
                              buyBtn.hide();
                              cartBtn.hide();
                              $(".button-grey").show();
                              $('.time-wrap').hide();
                         },1000)
                   });
                },1000)
            });
	      }

          //抢购开始
          if(state == 'begin'){
             buyBtn.show();
             cartBtn.show();
             var option = {
				lastTime:endTime,
				now:new Date(nowdate)
			  };
              $(item).activeCountDown(option,function(){
                   setTimeout(function(){
                        $(item).data("state","end");
                        $(item).removeClass("begin").addClass("end");
                        //$(item).hide();
                        notBtn.hide();
                        buyBtn.hide();
                        cartBtn.hide();
                        $(".button-grey").show();
                        $('.time-wrap').hide();
                   },1000)
              })
          }

          //抢购结束
          if(state == 'end'){
             //$(item).hide();
             notBtn.hide();
             buyBtn.hide();
             cartBtn.hide();
             $(".button-grey").show();
          }
      })


}



$(document).ready(function(){
	detail.init();
});