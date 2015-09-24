

var scratchCard = {};

scratchCard.init = function(){
	this.countWindowHeight();
	this.canvasInit();
}

scratchCard.countWindowHeight = function(){
	$(".scratch-card").height($(window).height()).width($(window).width());
}

scratchCard.canvasInit = function(){
	$(window).load(function(){
		$("#draw-image").eraser({
			completeRatio: .6,
			completeFunction: function(){
				$("#draw-image").eraser('clear');
			}
		});
	});
}

$(document).ready(function(){
	scratchCard.init();
});
