

var list = {};

list.init = function(){
	this.showbool=true;//标签栏bool值
	this.listNav();		
	this.changeimg();
    this.loadimg();
}

list.loadimg = function(){
  /* $("img.load").unveil(10, function() {
    });*/

}

list.listNav = function(){
	// 导航条的显隐v
	var $listNav = $(".list-nav");
	var h = $listNav.height();
	var $productList = $(".product-list");

    //标签栏是否显示
    if($(".list-nav").css("display") == "block"){
      // $(".head-list").css({'padding-top': listNavH});
	  //$(window).scrollTop(listNavH);
    }else{
       this.showbool = false;  //不显示bool值为false
    }
	var t1 = $(window).scrollTop();
	var t2 = 0;
	var time;
    if(this.showbool){
    	$(window).scroll(function(){
			t1 = $(this).scrollTop();
				if(t1 < t2){
					// $listNav.stop().animate({"height": h}, 300, function(){$listNav.show()});
					$listNav.slideDown(100);
				} else{
					if(t1 > 10){
						// $listNav.stop().animate({"height": 0},300, function(){$listNav.hide()});
						$listNav.slideUp(100);
					}
				}
				t2 = t1;
			
		});
    }

}

list.changeimg = function(){

    var oimgproportion=604/536;
    $(".product-list .col-50 img").each(function(index,item){
        // console.log(index)
        var owidth=$(item).width();
        var oheight=$(item).width()/oimgproportion;
        $(item).css({
            width:owidth+"px",
            height:oheight+"px"
        })
    })

}



$(document).ready(function(){
	list.init();
});