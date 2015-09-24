

var talkDetail = {};

talkDetail.init = function(){

    this.mask = $(".dialog-mask");
    this.dataId=0;
    this.clsname="";
    this.maskwhite = $(".dialog-mask-white");
    this.dialogShowcoms($(".dialog-comments"), ".comments-f");
    this.dialogShowcoms($(".dialog-comments"), ".topedit");
    this.dialogClose();

}


//弹窗显示
talkDetail.dialogShowcoms = function(arg1, arg2){
    var $dialog = arg1;
    var h = $dialog.height();
    var self=this;

    $(document).delegate(arg2,'tap', function(e){
        self.dataId=$(e.currentTarget).attr("dataId");
        self.clsname=$(e.currentTarget).attr("class");
        e.preventDefault();
        $dialog.css('bottom', -h);
        talkDetail.maskwhite.show();
        $dialog.show().animate({'bottom': 0}, 300, function(){});
        $(".commentText").focus();

    });

}


//弹窗关闭
talkDetail.dialogClose = function(){

    var visible,self=this;
    $(".dialog-mask").on('click', function(){
        visible = $(".dialog:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
            visible.hide();
            talkDetail.mask.hide();
        });
    });

    $(".dialog-mask-white").on('click', function(){
        visible = $(".dialog:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
            visible.hide();
            talkDetail.maskwhite.hide();
        });
    });


    $(".Release").on("tap",function(){

        $(".talkInfo").each(function(index,item){

            if($(item).attr("dataId") == self.dataId){
                $(item).find("p").text($(".commentText").val());
            }
        });


        if($.trim(self.clsname) == "comments-f"){
           var otextval=$(".commentText").val(),omath=Math.random()*100;
           var odemo='<div class="box comment bblu">\
            <div class="title  row"> \
                <div class="col-50">\
                    <div class="row no-gutter"> \
                        <div class="col-33"><img src="../img/card/head.png"></div>  \
                            <div class="col-66 name"> \
                                <h2 class="h1 cyan">LeoLeo</h2> \
                                <p class="h4 dark">2015-02-22</p>\
                            </div> \
                        </div> \
                    </div>\
                    <div class="col-50 text-right info">\
                        <span class="h3 dark">3.0公里</span> \
                    </div>\
                </div> \
                <div class="talkInfo row" dataId="'+omath+'"> \
                    <div class="col-20"></div> \
                    <p class="col-80">\
                     '+ otextval +'\
                   </p>\
                </div>\
                <div class="topedit" dataId="'+omath+'">\
                    <i></i>\
                </div>\
            </div>';

         $(".talkcontent").append(odemo);



        }

        visible = $(".dialog:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
            visible.hide();
            $(".commentText").val("");
            talkDetail.maskwhite.hide();
        });

    })


}



$(document).ready(function(){
	talkDetail.init();
});