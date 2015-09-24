/**
 * Created with JetBrains WebStorm.
 * User: cn
 * Date: 15-3-3
 * Time: 下午2:28
 * To change this template use File | Settings | File Templates.
 */
/*详情页购物车动画*/
(function($){
    $.extend($.fn,{
        shoping:function(options){
            var self=this,
                $shop=$('.icon-cart').eq(1),
                $num=$('.cart-nums').eq(1);
            $src=$('.swipe-wrap').eq(0).find(".image").attr("mark");
            var S={
                init:function(){
                    this.addShoping()
                },
                addShoping:function(){
                    var x =$(window).width()/2,
                        y =$(window).height()/2,
                        X = $shop.offset().left+$shop.width()/8+5,
                        Y=$(window).height()-40+$(document).scrollTop(),
                        dis=true;
                    if(dis){
                        if ($('#floatOrder').length <= 0) {
                            $('body').append('<div id="floatOrder" style="display:block;"><img src=""  width="50" height="50" class="floatIMG" /></div>')
                        };
                        var $obj=$('#floatOrder');
                        $(".floatIMG").attr("src",$src);
                        $('body').css('position',"relative");
                        $obj.css('position',"absolute");
                        $obj.css('z-index',"99");
                        if(!$obj.is(':animated')){
                            $obj.css({'left': x,'top': y}).animate({'left': X,'top': Y},600,'swing',function() {
                                $obj.fadeOut(300,function(){
                                    $obj.remove();
                                    var num=Number($num.text());
                                    $num.removeClass("hide");
                                    if(options.cnum>=10){
                                        $num.addClass("bignums");
                                    }else{
                                        $num.removeClass("bignums");
                                    }
                                    console.log(options);
                                    $num.text(options.cnum);
//                                    $num.text(num+options.cnum);

                                });
                            })
                            $(".floatIMG").animate({width:'20px',height:'20px'},500)
                        };

                    };
                }
            };
            S.init();
        }
    });
})($);