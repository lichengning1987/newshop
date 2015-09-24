

var index = {};

index.init = function(){
	
	this.nowDate = nowDate;
	this.slide();
	this.showDeadLine();
	this.jump();
    this.loadimg();
}

index.loadimg = function(){

   $("img.load").unveil(10, function() {
      $(this).load(function() {
          /*var that=this;
          $(this).addClass("loads");
          var transiton="opacity 600ms ease-in";
          setTimeout(function(){
             $(that).css({
             "opacity":1,
              "-webkit-transition":transiton,
               "transition":transiton
            })
          },10)*/
           $("#slider").height($("img.swipeImage").height());
           $(".swipe-wrap").height($("img.swipeImage").height());
      });
    });
}

index.slide = function(){

   var slider =
		Swipe(document.getElementById('slider'), {
			auto: 3000,
			continuous: false,
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

index.jump = function(){
	$('#slider .swipeImage').click(function(e){
		e.preventDefault();
		var url = $(this).parent().data('url');
		window.location.href = url;
	});
	
	$('.product .list1').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
		var url = jumpGoodsDetail+'&goods_id='+id;
		window.location.href=url;
	});
	
	$('.product .list2').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
		var url = jumpGoodsDetail+'&goods_id='+id;
		window.location.href=url;
	});
	
	$('.product .col').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
		var url = jumpGoodsDetail+'&goods_id='+id;
		window.location.href=url;
	});
}

index.showDeadLine = function(){
	 var mdate = new Date();
	  //var nowdate = mdate.getFullYear() + '/' + (mdate.getMonth()+1) + '/' + mdate.getDate() +' '+mdate.getHours()+':'+mdate.getMinutes()+':'+mdate.getSeconds();
	  var nowdate = index.nowDate;
	  var now=new Date(nowdate);

	  var objs = $('.buyTime');

      objs.each(function(index,item){
          var id = $(item).data('id');
		  var startTime = new Date($(item).data('start'));
		  var endTime = new Date($(item).data('end'));
		  var state = $(item).data('state');
		  
		  $('.goods-'+id).find('.time-wrap').addClass(state);
	      $('.goods-'+id).find('.info').addClass(state);
          //抢购未开始
          if(state == 'notBegin'){
			var option = {
				lastTime:startTime,
				now:new Date(nowdate)
			};
            $('.goods-'+id).find('.time-wrap').activeCountDown(option,function(){
                  setTimeout(function(){
                      $('.goods-'+id).find(".buyTime").attr("data-state","begin");
                      $('.goods-'+id).find(".info").removeClass("notBegin").addClass("begin");
                      $('.goods-'+id).find(".info").html("距离抢购结束：");
                      $('.goods-'+id).find(".time-wrap").removeClass("notBegin").addClass("begin");
                      var options = {
                             lastTime:endTime,
                             now:startTime
                      };
                      $('.goods-'+id).find('.time-wrap').activeCountDown(options,function(){
                          setTimeout(function(){
                             $('.goods-'+id).find(".buyTime").data("state","end");
                             $('.goods-'+id).find(".info").removeClass("notBegin").removeClass("begin").addClass("end");
                             $('.goods-'+id).find(".info").html("限时抢购：");
                             $('.goods-'+id).find(".time-wrap").removeClass("notBegin").removeClass("begin").addClass("end");
                             $('.goods-'+id).find(".notime").removeClass("hide");
                          },1000)
                      });
                  },1000)
            });
	      }

          //抢购开始
          if(state == 'begin'){
              var option = {
				lastTime:endTime,
				now:new Date(nowdate)
			  };
              $('.goods-'+id).find(".info").html("距离抢购结束：");
              $('.goods-'+id).find('.time-wrap').activeCountDown(option,function(){
                   setTimeout(function(){
                        $('.goods-'+id).find(".buyTime").data("state","end");
                        $('.goods-'+id).find(".info").removeClass("begin").addClass("end");
                        $('.goods-'+id).find(".info").html("限时抢购：");
                        $('.goods-'+id).find(".time-wrap").removeClass("begin").addClass("end");
                        $('.goods-'+id).find(".notime").removeClass("hide");
                   },1000)
              })

          }

          //抢购结束
          if(state == 'end'){
			 
                $('.goods-'+id).find(".info").html("限时抢购：");
                $('.goods-'+id).find(".notime").removeClass("hide");
          }

      })
}


$(document).ready(function(){
	index.init();
});