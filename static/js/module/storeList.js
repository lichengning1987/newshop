

var storelist = {};

storelist.init = function(){
	
	this.listNav();		
	this.changeimg();
}

storelist.listNav = function(){

    //点击选择
    $(".storeList li").on("tap",function(e){
        e.preventDefault();
        if(!$('.complete').hasClass('hide')){
        	var oselect=$(e.currentTarget).find(".icon-select");
            console.log(oselect.css("display"));
            if(oselect.css("display") != "none"){
                if(oselect.hasClass("icon-selectright")){
                    oselect.removeClass("icon-selectright");
                }else{
                    oselect.addClass("icon-selectright");
                }
            }
        }else{
        	var goods_id = $(this).data('id');
        	window.location.href="goods.php?act=detail&goods_id="+goods_id;
        }
        return false;
    })

    /*点击编辑*/
    var obool=true;
    $(".edit").on("tap",function(e){
        e.preventDefault();
        if(obool){
            $(".icon-select").show();
            $(".complete").removeClass("hide");
            storelist.dialogShows($(".dialog-btn"));
            obool=false;
        }

    })

    /*点击完成*/
    $(".complete").on("tap",function(e){
        e.preventDefault();
        $(".icon-select").hide();
        visible = $(".dialog:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
              visible.hide();
        });
        obool=true;
        $(".complete").addClass("hide");

    })


    /*点击删除*/
    $(".deletebtn").on("tap",function(e){

        if(!$(".icon-select").hasClass("icon-selectright")){
            $.alert("您还没有选中，请选择要删除的产品");
            return false;
        }

        var goodsArr = new Array();
        var objs = new Array();
        var goodsIds = "";
        $.confirm("是否确定删除？",function(flag){
            if(flag){
                $(".icon-selectright").each(function(index,item){
                	var goodsId = $(this).data('id');
                	goodsArr.push(goodsId); 
                	objs.push($(item));
                });
                
                goodsIds = goodsArr.join(',');
                
                $.ajax({
        			async:false,
                    url:batchDelFavorite,
                    type:'post',
                    data:{'goods_ids':goodsIds},
                    dataType:'json',
                    success:function(result){
                    	if(result.status == 1){
                    		for(o in objs){
                    			objs[o].parent().remove();
                    		}
//                    		$(item).parent().remove();
                    	}else{
                    		alert('删除失败');
                    	}
                    }
                });
            }
        })

    })




}


storelist.dialogShows = function(arg1, arg2){
    var $dialog = arg1;
    var h = $dialog.height();
        $dialog.css('bottom', -h);
        $dialog.show().animate({'bottom': 0}, 600, function(){});

}

storelist.changeimg = function(){

    var oimgproportion=640/475;
    $(".product-list li img").each(function(index,item){
        var owidth=$(item).width();
        var oheight=$(item).width()/oimgproportion;
        $(item).css({
            width:owidth+"px",
            height:oheight+"px"
        })
    })

}



$(document).ready(function(){
    storelist.init();
});