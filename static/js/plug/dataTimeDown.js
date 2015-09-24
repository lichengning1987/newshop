(function($){
    $.fn.extend({
        activeCountDown:function(opt,callback){
            var lastTime=opt.lastTime,now=opt.now;
            var self=$(this);
            function Count(){

                var countTime=lastTime.getTime()-now.getTime();
                var d=(countTime)/1000;
                var lday=parseInt(Math.floor(d/3600)/24);
                var lHour=Math.floor(d/3600)%24+lday*24;
                d=d%3600;
                var lMin=parseInt(d/60);
                d=d%60;
                var lSecond=parseInt(d);
                 if(lday<=0){lday=0;}
                 if(lHour<=0){lHour=0;}
                if(lMin<=0){lMin=0;}
                if(lSecond<=0){lSecond=0;}
                if(lHour<10){lHour= "0" + lHour;}
                if(lMin<10){lMin= "0" + lMin;}
                if(lSecond<10){lSecond= "0" + lSecond;}

                self.find(".countHour").html(lHour);
                self.find(".countMin").html(lMin);
                self.find(".countSec").html(lSecond);
                now.setSeconds(now.getSeconds()+1);
                return countTime;
            }
            Count();
            var timer=setInterval(function(){
                if(Count()/1000<=0){
                    clearInterval(timer);
                    if(callback) callback();
                };
            },1000);
        }
    })
})(jQuery); 