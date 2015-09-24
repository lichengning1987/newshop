

var global = {};

global.init = function(){
	
	this.backTop();
			
	
}

global.backTop = function(){

	if($("#backTop")){
		$("#backTop").off().on({
			'click':function(){
				//以1秒的间隔返回顶部
				$('body,html').animate({scrollTop:0},
					600);
			}
		});
		$(window).scroll(function(e) {
			//若滚动条离顶部大于100元素
			if($(window).scrollTop() > 10){
				$("#backTop").fadeIn(600);//以1秒的间隔渐显id=gotop的元素
			}else{
				$("#backTop").fadeOut(600);//以1秒的间隔渐隐id=gotop的元素
			}
		});
	}
}


$(document).ready(function(){
	global.init();
});