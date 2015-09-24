/*
 * 这里只用html5获取地址，其他事不干
 */
function getWebPosition(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition,showError);
	}else{
		showPosition();
	}
}

function showError(error){
	//$(".dialog-mask-load").hide();
	showPosition();
}

function showPosition(position){
	var lng,lat;
	var data = {'status':0};
	if(position != undefined){
		lng = position.coords.longitude;
		lat = position.coords.latitude;
		data = {'status':1,'position':[{'coords':[{'longitude':lng,'latitude':lat}]}]};
	}
	postMessage(data);
	return false;
	//getLocalGps(lng,lat);
}

/*function getLocalGps(lng,lat){
	var data = {};
	if(lng != undefined && lat !=undefined){
		data = {'lng':lng,'lat':lat,'type':'WGS'};
	}
	$.ajax({
		async:false,
		url:getLocalGpsUrl,
		type:'post',
		data:data,
		dataType:'json',
		success:function(result){
			if(result.status == 1){
                setTimeout(function(){
                    $(".dialog-mask-load").hide();
                    var method = result.method;
                    var adcode = result.regeocode.addressComponent.adcode;
                    setDistinctInfo(adcode);
                    checkArea(adcode);
                    var detailAddress = getDetailAddress(result.regeocode.addressComponent,result.regeocode.formatted_address);
                    $('#gpsAddress').val(result.regeocode.formatted_address);
                    $('#address').html(detailAddress);
                    $('#section').val(result.point.x+","+result.point.y);
                    if(method == 'IP'){
                        alert('获取不到您的地理位置，定位信息可能不准');
                    }
                },200)

			}else {
				$(".dialog-mask-load").hide();
				alert('定位失败');
			}
		}
	});
}*/

getWebPosition();