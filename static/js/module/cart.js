var cart = {};

var weight,nums,pay,pays,goodsNum,rawp,singlePrice,save,saves;
cart.init = function(){
    this.nowDate = nowDate;
	this.eve();
	this.submit();
}

cart.checkLimit = function(that){
	var purchaseQuantity = that.data('purchasequantity');
	if(that.find(".order-edit").hasClass("on")){
		var nums = that.find(".td2").html();
		// 只在做加法的时候检测 这是先默认加个1
		nums ++;
	}else{
		var nums = that.find('.nums').html();
	}
	
	if(purchaseQuantity > 0){
		if(parseInt(nums) > purchaseQuantity){
	        that.find(".tipshopnum").html('该产品限制了购买数量，一次只能购买'+purchaseQuantity+'个').show();
			return false;
		}
	}
	
	var goodsId = that.data('goodsid');
	var purchaseTimes = that.data('purchasetimes');
	if(purchaseTimes > 0){
		var nowPurchaseTimes = cart.getPurchaseTimes(goodsId);
		if(purchaseTimes <= nowPurchaseTimes){
			that.find(".tipshopnum").html('该产品限制了购买次数，只能购买'+purchaseTimes+'次').show();
			return false;
		}
	}
	return true;
	//return true;
}

cart.eve=function(){
     $("ul li").each(function(index,item){
        var oinfo = $(item).find(".info"); //是否有抢购产品
        var state = $(item).data("state");
        var undo = $(item).find(".undo");
        var nowdate = cart.nowDate;
	    var now=new Date(nowdate);
        var objs=$(item).find(".time-wrap");
        if(state != undefined && state != ""){

             objs.each(function(index,item){
                  var startTime = new Date($(item).data('start'));
		          var endTime = new Date($(item).data('end'));
                  var state = $(item).data('state');

                 //未开始的产品
                 if(state == "notBegin"){
                     if(oinfo.length > 0){
                        oinfo.siblings(".undo").addClass("nodo");
                     }
                     var option = {
				         lastTime:startTime,
				         now:new Date(nowdate)
			         };
                     $(item).activeCountDown(option,function(){
                         setTimeout(function(){
                             oinfo.hide();
                             undo.removeClass("nodo");
                             undo.show();
                             $(item).attr("data-state","begin");
                             $(item).closest("li").attr("data-state","begin");
                             $(item).removeClass("notBegin").removeClass("end").addClass("begin");
                             $(item).closest("li").find(".pic-goods").removeClass("notBegin").removeClass("end").addClass("begin");
                             $(item).closest("li").find(".timeinfo").html("距结束：")
                             if($(".alldo-icon").hasClass("do")){
                               $(".alldo-icon").trigger("tap");
                             }
                             var options = {
                                     lastTime:endTime,
                                     now:startTime
                             };
                             $(item).activeCountDown(options,function(){
                                setTimeout(function(){
                                      $(item).attr("data-state","end");
                                      $(item).closest("li").attr("data-state","end");
                                      $(item).removeClass("notBegin").removeClass("begin").removeClass("notBegin").addClass("end");
                                      $(item).closest("li").find(".pic-goods").removeClass("begin").removeClass("notBegin").addClass("end");
                                      $(item).closest("li").find(".time-wrap").css("visibility","hidden");
                                      $(item).closest("li").find(".info").html("已结束").show();
                                      $(item).closest("li").find(".undo").hide();
                                      $(item).closest("li").append("<span class='failcart'></span>");
                                      if($(".alldo-icon").hasClass("do")){
                                         $(".alldo-icon").trigger("tap");
                                      }

                                 },1000)
                             });
                         },1000)

                      });

                 }

                 //开始抢购
                 if(state == 'begin'){
                             oinfo.hide();
                             undo.removeClass("nodo");
                             undo.show();
                             $(item).attr("data-state","begin");
                             $(item).closest("li").attr("data-state","begin");
                             $(item).removeClass("notBegin").removeClass("end").addClass("begin");
                             $(item).closest("li").find(".pic-goods").removeClass("notBegin").removeClass("end").addClass("begin");
                             $(item).closest("li").find(".timeinfo").html("距结束：")
                             if($(".alldo-icon").hasClass("do")){
                               $(".alldo-icon").trigger("tap");
                             }
                             var options = {
                                     lastTime:endTime,
                                     now:new Date(nowdate)
                             };
                             $(item).activeCountDown(options,function(){
                                setTimeout(function(){
                                      $(item).attr("data-state","end");
                                      $(item).closest("li").attr("data-state","end");
                                      $(item).removeClass("notBegin").removeClass("begin").addClass("end");
                                      $(item).closest("li").find(".pic-goods").removeClass("begin").removeClass("notBegin").addClass("end");
                                      $(item).closest("li").find(".time-wrap").css("visibility","hidden");
                                      $(item).closest("li").find(".info").html("已结束").show();
                                      $(item).closest("li").find(".undo").hide();
                                      $(item).closest("li").append("<span class='failcart'></span>");
                                      if($(".alldo-icon").hasClass("do")){
                                         $(".alldo-icon").trigger("tap");
                                      }

                                 },1000)
                             });

                 }


                 //已结束
                 if(state == 'end'){
                      $(item).attr("data-state","end");
                      $(item).closest("li").attr("data-state","end");
                      $(item).removeClass("notBegin").removeClass("begin").addClass("end");
                      $(item).closest("li").find(".pic-goods").removeClass("notBegin").removeClass("begin").addClass("end");
                      $(item).closest("li").find(".time-wrap").css("visibility","hidden");
                      $(item).closest("li").find(".info").html("已结束").show();
                      $(item).closest("li").find(".undo").hide();
                 }


             })
        }
    })


	//点击编辑
	$('body').on('tap',".order-edit",function(){
		var that=$(this);
		rawp=that.siblings(".label-info").find(".single-price").html();
		/*if($(this).parent().find(".failstate").length >= 1){
            return false;
        }*/
		cart.showEdit(that);
	});

	//选中当前商品
	$(".undo").tap(function(){
		var that=$(this);

		if(!$(this).hasClass('nodo')){

            //结束
            if(that.closest("li").attr("data-state") == "end"){
               return false;
            }
			//是否有失效标签
	        if(that.closest("li").find(".failstate").length<=0){
	            if(that.hasClass("do")){
					that.closest("li").removeClass("select");
					that.removeClass("do");
					cart.isAllDo();
				}else{
					if(!cart.checkLimit(that.closest('li'))){
						return false;
					}
					that.closest("li").addClass("select");
					that.addClass("do");
			    }
			    cart.payBill();
	        }



		}
		return true;

	});

    $(".pic-goods").tap(function(e){
        e.preventDefault();
        if(!$(this).parent().find(".undo").hasClass("nodo")){
           $(this).parent().find(".undo").trigger("tap");
        }

    })
    $(".label-info").tap(function(){
        if(!$(this).parent().find(".undo").hasClass("nodo")){
           $(this).parent().find(".undo").trigger("tap");
        }
    })


	//删除购物车某项
	$(".cart").on("tap",".nodo",function(){
		var obj = $(this);
		var rec_id = obj.closest('li').data('recid');
		var flag = false;
		$.ajax({
			async:false,
            url:delCartUrl,
            type:'post',
            data:{'rec_id':rec_id},
            dataType:'json',
            success:function(result){
            	if(result.status == 1){
            		obj.closest('li').find(".tipshopnum").hide();
            		flag = true;
            	}else{
            		alert('删除失败');
            	}
            }
        });
		if(flag){
			obj.parent().slideUp(100,function(){
               obj.closest("li").remove();
            });
    		cart.payBill();
    		cart.setDefaultNum();
		}
	});	
	//选中规格
	$(".info-edit select").change(function(){
		var obj = $(this);
		var liObj = $(this).closest('li');
		var recId = liObj.data('recid');
		var specId = obj.find("option:selected").val();
		
		$.ajax({
			url:updateCartUrl,
			type:'post',
			data:{'rec_id':recId,'spec_id':specId},
			dataType:'json',
			success:function(result){
				if(result.status == 1){
					// 设置select
					var specId = obj.find("option:selected").val();
					weight=obj.find("option:selected").text();
					/*obj.parent().siblings(".undo").addClass("do");*/
					/* /假设变换规格后后台给的价格是200/ */
					singlePrice = obj.find('option:selected').data('price');
					obj.closest('li').attr('data-price',singlePrice);
					obj.closest('li').attr('data-specid',specId);
					if(result.delRecids != undefined){
						window.location.reload();
					}
					//obj.closest('li').addClass('select');
					cart.payBill();
				}else{
					alert('出错了');
				}
			}
		});	
	});
	//增加删除商品数目
	$(".td1").tap(function(){
		var obj = $(this);
		var liObj = $(this).closest('li');
		var recId = liObj.data('recid');
		var specId = liObj.find('select').find("option:selected").val();
		var purchaseQuantity = liObj.data('purchasequantity');
		nums=Number($(this).next().html());
		
		if(nums > 1){
			if(purchaseQuantity > 0){
				var goodsId = liObj.data('goodsid');
				var purchaseTimes = liObj.data('purchasetimes');
				var nowPurchaseTimes = cart.getPurchaseTimes(goodsId);
				if(parseInt(nums-1) <= purchaseQuantity && nowPurchaseTimes < purchaseTimes){
					liObj.find(".tipshopnum").hide();
				}
			}
			cart.changeNum(recId,-1,specId,function(result){
				if(result.status){
					nums-=1;
					obj.next().html(nums);
					obj.closest('li').find('.nums').html(nums);
					/*obj.closest('li').addClass('select');
					obj.closest(".info-edit").siblings(".undo").addClass("do");*/
					cart.payBill();
					cart.setDefaultNum();
				}
			});
		}
		
//		if(nums>1){
//			nums-=1;
//			$(this).next().html(nums);
//			$(this).closest('li').addClass('select');
//			$(this).closest(".info-edit").siblings(".undo").addClass("do");
//			cart.payBill();
//		}
	});
	$(".td3").tap(function(){
		var obj = $(this);
		var liObj = $(this).closest('li');
		var recId = liObj.data('recid');
		var specId = liObj.find('select').find("option:selected").val();
		var nums=Number($(this).prev().html());


		if(!cart.checkLimit(liObj)){
			return false;
		}
		cart.changeNum(recId,1,specId,function(result){
			if(result.status){
				nums+=1;
				obj.prev().html(nums);
				obj.closest('li').find('.nums').html(nums);
				/*obj.closest('li').addClass('select');
				obj.closest(".info-edit").siblings(".undo").addClass("do");*/
				cart.payBill();
				cart.setDefaultNum();
			}
		});
		
	});
	//全选操作
	$(".alldo").tap(function(){
		var that=$(this);
		if(that.find(".alldo-icon").hasClass("do")){

			that.find(".alldo-icon").removeClass("do");
			$("li").each(function(){
				$(this).removeClass("select");
				$(this).find(".undo").removeClass("do");
			});
		}else{
			that.find(".alldo-icon").addClass("do");
			var msg = "";
			var flag = true;
			$("li").each(function(index,item){
				if(!cart.checkLimit($(this))){
					flag = false;
				}
			});
			
			if(flag){
				$("li").each(function(index,item){
					$(this).addClass("select");
					$(this).find(".undo").addClass("do");
	                if($(item).find(".failstate").length >=1 || $(item).attr("data-state") == "end" || $(item).attr("data-state") == "notBegin"){
	                    $(item).removeClass("select");
					    $(item).find(".undo").removeClass("do");
	                }

				});
			}
		}
		cart.payBill();
	});
}

cart.setDefaultNum = function(){
	$.ajax({
		url:getCartNum,
		type:'post',
		data:{},
		dataType:'json',
		success:function(result){
			if(result.num.count == null){
				$('.footer .navcartnum').removeClass('cart-nums');
				$('.footer .navcartnum').html(result.num.count);
			}else{
				$('.footer .navcartnum').addClass('cart-nums');
				$('.footer .navcartnum').html(result.num.count);
			}
			
		}
	})
}
	
cart.changeNum = function(recid,num,specId,func){
	$.ajax({
        url:updateCartUrl,
        async:false,
        type:'post',
        data:{'rec_id':recid, 'num':num, 'spec_id':specId},
        dataType:'json',
        success:func
    });
}

cart.showEdit=function(that){


    var olis = that.closest("li").find(".info");
    var odo =  that.closest("li").find(".undo");
    var ostate = that.closest("li").attr("data-state");

    //未开始抢购产品
     if(olis.hasClass("notBegin")){
           olis.hide();
           odo.show();
     }

	if(that.hasClass("off")){
		var goodsId = that.data('id');
		$.ajax({
			url:getSpecUrl,
			type:'post',
			data:{'goods_id':goodsId},
			dataType:'json',
			success:function(result){
				if(result.status == 1){
					// 用that.closest('li').data('specid')有缓存现象
					var spec_id = that.closest('li').attr('data-specid');
                    var selectNum = that.parent().find('.info-edit');
					// 设置select
					selectObj = that.parent().find('.info-edit').find('select');
					selectObj.empty();
					
					var html = "";
					var selectHtml = "";
					for(var o in result.data){
						selectHtml = (parseInt(result.data[o].spec_id) == parseInt(spec_id))?"selected='selected'":"";
						html = "<option value='"+result.data[o].spec_id+"' data-price='"+result.data[o].price+"'" + selectHtml+">"+result.data[o].unionSpec+"</option>";
						selectObj.append(html);
					}
					if(result.data[o].spec_1 == '' ){
						selectObj.hide();
                        selectNum.addClass("mt26");
					}
//					that.parent().addClass("select");
					that.siblings(".label-info").hide();
					that.siblings(".info-edit").show();
					that.addClass("on").removeClass("off");


                    that.siblings(".undo").show();
                    that.siblings(".info").hide();
                    that.siblings(".undo").addClass("nodo");

					if(singlePrice){
						that.siblings(".label-info").find(".single-price").html(singlePrice);
					}
					that.html("完成");
					cart.payBill();
				}else{
					alert('出错了');
				}
			}
		});		
	}else if(that.hasClass("on")){
//		that.parent().removeClass('select');

		that.siblings(".info-edit").hide();
		that.siblings(".label-info").show();
		that.addClass("off").removeClass("on");



        if(ostate == "notBegin" || ostate == "end"){
            that.siblings(".undo").hide();
            that.siblings(".info").show();
        }else{
            that.siblings(".undo").removeClass("nodo");
        }

		if(weight){
			that.siblings().find(".goods-weight").html(weight);
		}
		if(nums){
			that.siblings().find(".nums").html(nums);
		}			
		if(singlePrice){
			that.siblings(".label-info").find(".single-price").html(singlePrice);
		}					
		that.html("编辑");
		cart.payBill();
	}





}

//全选删除一个 全选状态消失
cart.isAllDo=function(){
		$("li").each(function(){
			if($(this).hasClass("select")){

			}else{
				$(".alldo").removeClass("do");
			}
		});
	}	
//计算总价 增加省钱计算
cart.payBill=function(){
		pays=0;
		goodsNum=0;
		saves=0;
		save=0;
		var checked = 0;
        var opts = $(".failstate").length-$("li[data-state='end']").length;

		$("li").each(function(){
			if($(this).hasClass("select")){
				checked ++ ;
				var price = $(this).attr('data-price');
				//var price = $(this).data('price');
				var tagPrice = $(this).data('tagprice');
				goodsNum+=1;
				if($(this).find(".order-edit").hasClass("on")){
					if(singlePrice){					
						pay = singlePrice * Number($(this).find(".td2").html());
						//goodsNum += Number($(this).find(".td2").html());
						save = parseFloat(tagPrice - singlePrice)*Number($(this).find(".td2").html());
					}else{
						pay = rawp * Number($(this).find(".td2").html());
						//goodsNum += Number($(this).find(".td2").html());
						save = parseFloat(tagPrice - price)*Number($(this).find(".td2").html());
					}
				}else if($(this).find(".order-edit").hasClass("off")){
					//goodsNum += Number($(this).find(".nums").html());
					pay=Number($(this).find(".single-price").html()) * Number($(this).find(".nums").html());
					save = parseFloat(tagPrice - price) * Number($(this).find(".nums").html());
				}
				// 避免出现负数
				if(save < 0){
					save = 0;
				}
				pays += pay;
				saves += save;
			}
            //判断可选的数量
            if($(this).attr("data-state") == "end" && $(this).find(".failstate").length >0){
                opts = $(".failstate").length;
            }else if($(this).attr("data-state") == "end" && $(this).find(".failcart").length >0){
                opts = $(".failstate").length+$(".failcart").length;
            }
		});
		// 如果检测到选中数量为全选数量 则全选打勾

		if(checked == ($("li").length-opts-$("li[data-state='notBegin']").length)){
			$('.alldo').find(".alldo-icon").addClass('do');
		}else{
			$('.alldo').find(".alldo-icon").removeClass('do');
		}

        if($("li").length == $(".failstate").length){
           $('.alldo').removeClass('do');
         }

		$(".do-bill").find("span").find("em").html(pays.toFixed(2));
		$(".do-bill").find("button").find("em").html(goodsNum);
		$('.save').find('.showSave').html(saves.toFixed(2));
	}
// 购物车提交
cart.submit=function(){
	$('.submitBtn').click(function(){
		var rec_ids = "";
		$("li").each(function(){
			if($(this).hasClass('select')){
				rec_ids += $(this).data('recid') + ",";
			}
		});
		if(rec_ids.length < 2){
			alert('请选择商品');
			return ;
		}
		rec_ids = rec_ids.substr(0,rec_ids.length-1);
		window.location.href="checkout.php?spec_act=save&type=CART_REC&rec_ids="+rec_ids;
	});
}

cart.getPurchaseTimes = function(goodsId){
	var purchaseTimes = 0;
	$.ajax({
		async:false,
        url:getPurchaseTimesUrl,
        type:'post',
        data:{'goods_id':goodsId},
        dataType:'json',
        success:function(result){
        	if(result.status == 1){
        		purchaseTimes = result.data;
        	}else{
//        		alert('无数据');
        	}
        }
    });
	return purchaseTimes;
}

$(document).ready(function(){
	cart.init();
});