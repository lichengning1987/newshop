

var card = {};

card.init = function(){
	
	this.initProgess();		

    $(".qrcode-img-wrap").height($(window).height()-$(".footer").height())
}

card.progess = function(consumeArr,couponArr,funsArr){
	var count = consumeArr.length - 1;
	var span = parseFloat(1/count);
	
	$(".progress-bar").each(function(i){
		var spend = parseFloat(funsSpend[i]);
		var rankArr = card.getRank(spend);
		var per = ((spend - rankArr[3])/(rankArr[2] - rankArr[3]))*span + rankArr[0]*span;
		if(per > 1){
			per = 1;
		}
		var percent = per * 100 + '%';
		if(rankArr[1] == 0){
			$(this).closest('.box').find('.list-btm').html('您已经获得了所有优惠卷');
		}else{
			$(this).closest('.box').find('.arial').html(rankArr[1]);
		}
		
		$(this).animate({"width": percent}, 1000);
	});
}

card.initProgess = function(){
	card.progess(consumeSpan,couponSpan,funsSpend);
}

card.getRank = function(spend){
	var i = 0;
	spend = parseFloat(spend);
	for(o in consumeSpan){
		if(parseFloat(spend) > consumeSpan[o]){
			i ++; 
		}
	}
	var max = consumeSpan[i];
	var min = (i>0)?consumeSpan[i-1]:0;
	var rest = (max - spend)>0?(max-spend).toFixed(0):0;
	i = (i - 1)>0?i-1:0;
	return [i,rest,max,min];
}

$(document).ready(function(){
	card.init();
});