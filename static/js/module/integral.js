

var integral = {};

integral.init = function(){
	this.page = staticPage;
    this.myScroll="";
    this.myScrollfun();
}

integral.pullUp = function(){
    var self=this;
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
    	$.ajax({
    		'url':getMoreIntegral,
    		'data':{'page':integral.page},
    		'type':'post',
    		'dataType':'json',
    		success:function(result){
    			if(result.status == 1){
    				if(parseInt(result.content.count) > 0){
    					for(o in result.content.data){
        					var obj = result.content.data[o];
        					var el = $(".bought-list");
        					var html = '<li> \
        	                     <p>'+obj.translate.sign+'\
        	                        <span>'+(obj.translate.flag*obj.integral)+'</span>\
        	                     </p> \
        	                     <p class="bought">'+obj.translate.zh+'\
        	                         <span>'+obj.translate.formatDate+'</span> \
        	                      </p>\
        	                    </li>';
        					el.append(html);
        				}
        				integral.page ++;
    				}else{
    					alert('哦哦，没有了');
    				}
    				self.myScroll.refresh();
//    				alert('hello');
    			}else{
    				alert(result.message);
    				return false;
    			}
    		}
    	});
        /*var el, li, i;
//        el = $(".bought-list");
        var ohtml='<li> \
                     <p>消费\
                        <span>+120</span>\
                     </p> \
                     <p class="bought">新疆阿苏克苹果13131313\
                         <span>2014-11-20</span> \
                      </p>\
                    </li>';
        el.append(ohtml);
        self.myScroll.refresh();*/		// Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!

}

integral.myScrollfun=function(){
    var  pullUpEl = document.getElementById('pullUp');
    var  pullUpOffset = pullUpEl.offsetHeight;
    var self=this;
    this.myScroll = new iScroll('wrapper', {
        useTransition: true,
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '下拉加载更多...';
            }
        },
        onScrollMove: function () {
            if(this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '下拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
           if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '<div class="loading" style="text-align:center;"><i class="icon-load"></i><span>正在加载中...</span></div>';
                self.pullUp();	// Execute custom function (ajax call?)
            }
        }
    });

}



$(document).ready(function(){
    integral.init();
});