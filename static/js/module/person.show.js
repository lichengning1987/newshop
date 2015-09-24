var person = {};

person.init = function(){
	this.showInfo();
}

person.showInfo = function(){
	$('.integral-info').find('.integral-detail').click(function(){
		window.location.href="person.php?act=rankRule";
		return false;
	});
}

$(document).ready(function(){
	person.init();
});