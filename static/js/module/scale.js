var scale = {};

scale.init = function(){
	this.scaleCount = count;
	this.firstSpecId = firstSpecId;
	this.initSpec(targetScale); 
	this.autoSpec(getSpecId);
	this.choose();
}

//动态创建规格

scale.initSpec = function(obj){ 
	obj.empty();
	var html = "";
	var i = 1; 
	for (var key in specObjJson.specMatch){
		var standardHtml = scale.createStandardHtml(i,key,specObjJson.specMatch[key]);
    	html += standardHtml;
    	i += 1;
	}
	obj.html(html);
}

scale.createStandardHtml = function(id,key,value){
	var valueHtml = "";
	for (var i = 0; i < value.length; i++){
		valueHtml += '<td data-scale="'+value[i]+'">'+value[i]+'</td>';
	}
	var html = 
		'<label data-id="'+id+'" data-key="'+key+'">'+
			'<p>'+key+'</p>'+
			'<table class="table1" cellspacing="4" cellpadding="4">'+
				'<tr>'+
					valueHtml +
				'</tr>'+
			'</table>'+
		'</label>';
	return html;
}

// 规格判断逻辑

scale.autoSpec = function(specId){
	if(scale.scaleCount == 1){
		scale.tryInitSpec();
	}else{
		if(parseInt(specId) === 0){
	    	scale.autoSetSpec();
	    } else {
	        scale.setSpec(specId);
	    }
	}
	
    return false;
}


scale.tryInitSpec = function(){
	if(scale.scaleCount == 1){
		$('#spec_id').val(scale.firstSpecId);
	}
}

scale.choose = function(){
	targetScale.find('td').on('click',function(){
		if(!$(this).hasClass('disables')){
			var labelObj = $(this).closest('label');
			var id = labelObj.data('id');
			scale.clearLeft($(this),id);
			scale.disableLeft(id);
			scale.trySetSpecValue();
		}
	});
}

//默认设置第一个规格选中
scale.autoSetSpec = function(){
	var objs = targetScale.find('label');
	for(var i=0; i< objs.length; i++){
    	var id = parseInt($(objs[i]).data('id'));
    	if(id == 1){
    		$(objs[i]).find('td:first').addClass('on');
    		scale.clearLeft($(objs[i]).find('td:first'),id);
    		scale.disableLeft(id);
    		scale.trySetSpecValue();
    	}
    }
}

//根据spec_id 设置规格
scale.setSpec = function(specId){
	var specObj = specObjJson;
	if(specObj.specRMatch[specId] == undefined){
		autoSetSpec();
		return false;
	}
	var specValueArr = specObj.specRMatch[specId];
	var objs = targetScale.find('label');
    for(var i=0; i< objs.length; i++){
    	var sizeObjs = $(objs[i]).find('td');
    	var id = parseInt(i + 1);
    	for(var j=0; j< sizeObjs.length; j++){
        	if($(sizeObjs[j]).data('scale') == specValueArr[i]){
        		$(sizeObjs[j]).addClass('on');
        		scale.clearLeft($(sizeObjs[j]),id);
        		scale.disableLeft(id);
        		scale.trySetSpecValue();
        	}
    	}
    }
}

//检测剩余的有哪些按钮是不能用的
scale.disableLeft = function(sId){
	if(sId >= 3){
		return false;
	}
	var matchValue = scale.getSpecValue();
	switch(matchValue.length){
	case 1:
    	break;
	case 2:
		scale._disableLeft2(matchValue,sId)
    	break;
	case 3:
		scale._disableLeft3(matchValue,sId);
    	break;
	}
}

scale._disableLeft2 = function(matchValue,sId){
	var specObj = specObjJson;
	var objs = targetScale.find('label');
	var staticValue1 = matchValue[0][1];
	var staticValue2 = matchValue[1][1];
	var staticArr2 = new Array();
	for(var o in specObj.specArr){
    	var flag = true;
    	if(staticValue1 != "" && !(specObj.specArr[o].indexOf(staticValue1) == 0)){
        	flag = false;
    	}
    	if(staticValue2 != "" && !(specObj.specArr[o].indexOf(staticValue2) == 1)){
        	flag = false;
    	}
    	if(flag){
        	if(staticValue2 == ""){
        		staticArr2.push(specObj.specArr[o][1]);
        	}
    	}
	}
	if(staticArr2.length > 0){
		staticArr2 = $.unique(staticArr2);
		diff2 = scale.filterDuplicate(staticArr2,specObj.specNomal[1]);
		scale.disableStandard(2,diff2);
	}
}

scale._disableLeft3 = function(matchValue,sId){
	var specObj = specObjJson;
	var objs = targetScale.find('label');
	var staticValue1 = matchValue[0][1];
	var staticValue2 = matchValue[1][1];
	var staticValue3 = matchValue[2][1];
	var staticArr2 = new Array();
	var staticArr3 = new Array();
	for(var o in specObj.specArr){
    	var flag = true;
    	if(staticValue1 != "" && !(specObj.specArr[o].indexOf(staticValue1) == 0)){
        	flag = false;
    	}
    	if(staticValue2 != "" && !(specObj.specArr[o].indexOf(staticValue2) == 1)){
        	flag = false;
    	}
    	if(staticValue3 != "" && !(specObj.specArr[o].indexOf(staticValue3) == 2)){
        	flag = false;
    	}
    	if(flag){
        	if(staticValue2 == ""){
        		staticArr2.push(specObj.specArr[o][1]);
        	}
        	if(staticValue3 == ""){
            	staticArr3.push(specObj.specArr[o][2]);
        	}
    	}
	}
	if(staticArr2.length > 0){
		staticArr2 = $.unique(staticArr2);
		diff2 = scale.filterDuplicate(staticArr2,specObj.specNomal[1]);
		scale.disableStandard(2,diff2);
	}
	if(staticArr3.length > 0){
		staticArr3 = $.unique(staticArr3);
    	diff3 = scale.filterDuplicate(staticArr3,specObj.specNomal[2]);
    	scale.disableStandard(3,diff3);
	}
}

scale.disableStandard = function(sId,diff){
	var objs = targetScale.find('label');
	for(var i=0; i< objs.length; i++){
    	var id = parseInt($(objs[i]).data('id'));
    	if(id == sId){
        	for(var o in diff){
            	if(diff[o] != undefined){
            		var sizeObjs = $(objs[i]).find('td');
                	for(var j = 0 ; j < sizeObjs.length; j ++){
                    	var sizeValue = $(sizeObjs[j]).data('scale');
                    	if(diff[o] == sizeValue){
                    		$(sizeObjs[j]).addClass('disables');
                    	}
                	} 
            	}
        	}
    	}
    }
}

// 尝试设置spec_id
scale.trySetSpecValue = function (){
        $('#spec_id').val(0);
        var matchValue = scale.getSpecValue();
        var specObj = specObjJson;
        var staticValue1 = "";
        var staticValue2 = "";
        var staticValue3 = "";
        var specItem;
        switch(matchValue.length){
        case 1:
        	staticValue1 = matchValue[0][1];
        	if(staticValue1 != ""){
        		specItem = specObj.specValue[staticValue1];
        		if(specItem == undefined){
            		alert('规格出错');
            		window.location.href="index.php";
        		}
        	}
            break;
        case 2:
        	staticValue1 = matchValue[0][1];
        	staticValue2 = matchValue[1][1];
        	if(staticValue1 != "" && staticValue2 != ""){
        		specItem = specObj.specValue[staticValue1][staticValue2];
        		if(specItem == undefined){
            		alert('规格出错');
            		window.location.href="index.php";
        		}
        	}
            break;
        case 3:
        	staticValue1 = matchValue[0][1];
        	staticValue2 = matchValue[1][1];
        	staticValue3 = matchValue[2][1];
        	if(staticValue1 != "" && staticValue2 != "" && staticValue3 != ""){
        		specItem = specObj.specValue[staticValue1][staticValue2][staticValue3];
        		if(specItem == undefined){
            		alert('规格出错');
            		window.location.href="index.php";
        		}
        	}
            break;
        }
        // 做赋值操作
        if(specItem != undefined){
    		$('#spec_id').val(specItem.spec_id);
    		$('.scale-title').find('.scalePrice').html('￥'+specItem.price);
    		if(specItem.image_url != ""){
    			var picUrl = rootPicUrl + specItem.image_url;
    			$('.scale-title').find('.scalePic').attr('src',picUrl);
    		}else{
    			$('.scale-title').find('.scalePic').attr('src',basePicUrl);
    		}
    		detail.scale();
		}else {
			$('.scale-title').find('.scalePrice').html('￥'+basePrice+'起');
			$('.scale-title').find('.scalePic').attr('src',basePicUrl);
			detail.scale();
		}
    }

// 清除在选中下一级的选中状态
scale.clearLeft = function(obj,sId){
	obj.closest('label').find('td').removeClass('on');
	obj.addClass('on');
	
	if(sId >= 3){
		return false;
	}
	var objs = targetScale.find('label');
    for(var i=0; i< objs.length; i++){
    	var id = parseInt($(objs[i]).data('id'));
    	if(id > sId){
    		$(objs[i]).find('td').removeClass('on');
    		$(objs[i]).find('td').removeClass('disables');
    	}
    }
    return false;
}

//得到目前的值
scale.getSpecValue = function(){
    var matchValue = new Array();
    var objs = targetScale.find('label');
    for(var i=0; i< objs.length; i++){
    	var id = parseInt($(objs[i]).data('id'));
    	var findValue = ($(objs[i]).find('tr').find('.on').data('scale'))?
    			$(objs[i]).find('tr').find('.on').data('scale'):'';
		matchValue[i] = new Array();
        matchValue[i].push(id,findValue);
    }
    return matchValue;
}

//得出两个数组不一样的地方
scale.filterDuplicate = function(arr1, arr2) {
	diff = [];
	joined = arr1.concat(arr2);
	for( i = 0; i <= joined.length; i++ ) {
	  	current = joined[i];
	  	if( joined.indexOf(current) == joined.lastIndexOf(current) ) {
	   		diff.push(current);
	  	}
	}
	return diff;
}

$(document).ready(function(){
	scale.init();
});