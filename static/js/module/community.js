


var community = {};
var images = {
    localId: [],
    serverId: []
};

community.init = function(){
    this.mask = $(".dialog-mask-black");
    this.maskwhite = $(".dialog-mask-white");
    this.dataid=0;
	this.initfun();
    this.dialogClose();
}

community.initfun = function(){
    var owidth= 0,self=this;
    /*显示和隐藏赞，评论，分享*/
    $(document).on("tap",".commentbtn",function(e){
        e.preventDefault();
        owidth=$(e.currentTarget).closest(".box").find(".Toolbar").width();
        if(owidth == 0){
            $(e.currentTarget).closest(".box").find(".Toolbar").show().stop().animate({
                "width":"195px"
            },300,function(){

            });
        }else{
            $(e.currentTarget).closest(".box").find(".Toolbar").show().stop().animate({
                "width":"0px"
            },300,function(){
                $(e.currentTarget).closest(".box").find(".Toolbar").hide()
            })
        }
    })

   /*点击其他区域隐藏赞，评论，分享条*/
   $(document).on("tap tapmove",".comentList li",function(e){
        if(!$(e.target).hasClass("commentbtn")){
            $(".Toolbar").hide().width(0);
        }
        console.log($(e.target))
       if($(e.target).hasClass("conversation")){
           window.location.href="talk-detail.html"
       }

    })



    //评论框
    community.operateCommunity();

    //弹出框
    this.dialogShow($(".dialog-conversation"), $(".ReleaseBtn"));
    this.dialogShowcoms($(".dialog-comments"), ".comments-f");
    this.dialogShows($(".dialog-chooseImg"), $(".scBtn"));
    this.dialogShows($(".dialog-chooseImg"), $(".scBtn-small"));
    this.choseImg();

    //点赞操作
    $(document).on("tap",".likes-f",function(e){
        var num=$(e.currentTarget).closest(".comBox").find(".num").text();
         num++;
         $(e.currentTarget).closest(".comBox").find(".num").text(num);

    })

    /*滚动在底部进行加载*/
    $(window).scroll(function(){
        self.mouseScroll();
    })

    //点击评论发送按钮
    $(".releasefs").on("tap",function(){
        var comhtml='<p>\
                             <span class="commentName">\
                                 <em>无名</em>： \
                             </span> \
                             <span class="commentInfo"> \
                                  '+$(".commentText").val()+'\
                                </span> \
                     </p>';
        //显示评论
        $(".commentBox").each(function(index,item){
            if($(item).attr("dataid") == self.dataid){
                $(item).show();
                $(item).find(".contentBox").prepend(comhtml);
            }
        })

        $(".dialog-mask-white").trigger("click");
        self.operateArrow();
    })


    /*点击加号发布按钮*/
    $(".releasefb").on("tap",function(e){

        var odemos=' <li class="clearfix">\
                            <img class="comheadimg" src="../img/community/gdf.png" alt=""/>\
                             <div class="comBox">\
                                 <p class="name">\
                                     Leo\
                                 </p>\
                                 <p class="conversation"> \
                                  '+$(".releaseText").val() +'\
                                 </p>\
                                <div class="shareBox">\
                                 <a href="javascript:;"><img src="../img/community/dd.png" alt=""></a>\
                                </div>\
                                <div class="box row lineheight-20">\
                        <span class="time col-50"> \
                              3分钟前\
                        </span>\
                        <div class="col-50 text-right">\
                            <b class="commentbtn"> \
                            </b>\
                        </div>\
                        <div class="Toolbar"> \
                            <a class="likes-f" href="javascript:;"> \
                                <i class="iconTool iconTool-likes"></i>\
                                    赞\
                            </a> \
                            <a class="comments-f " href="javascript:;" dataid="444"> \
                                <i class="iconTool iconTool-comment"></i>\
                            评论\
                            </a>\
                            <a class="shares-f " href="javascript:;"> \
                                <i class="iconTool iconTool-share"></i>\
                            分享\
                            </a> \
                        </div>\
                    </div> \
                                <div class="commentBox" style="display:none;" dataid="444"> \
                        <i class="triangle-up"></i> \
                        <div class="like"> \
                            <i class="icon icon-like"></i> \
                            <span class="num"> \
                            0\
                            </span> \
                        </div>\
                        <div class="content"> \
                            <div class="contentBox"> \
                            </div>\
                        </div>\
                        <div class="foot arrow ">\
                            <i class="icon-arrow">\
                            </i> \
                        </div>\
                    </div>\
                             </div>\
                         </li>';
        $(".comentList").prepend(odemos);

        $(".dialog-mask-black").trigger("click");
        $(".dialog-mask-white").trigger("click");
        $(window).scrollTop(0);

    })


    /*预览图片*/
    /*$(document).on("tap",".shareBox",function(e){
        var arrs=[];
        $(e.currentTarget).find("a").each(function(index,item){
             var img=$(item).find("img").attr("src");
            arrs.push(img)
        })
        wx.previewImage({
            current: $(e.target).attr("src"),
            urls: arrs
        });
    })*/



}

/*当鼠标滚动到最后元素的时候*/
community.mouseScroll = function(){
    var fold = $(window).height() + $(window).scrollTop(),self=this;

    if(fold >= $("body").height()){
        setTimeout(function(){
            self.createimg();
        },0);

        function photoMove(callback){
            setTimeout(function(){
                $(".loading").remove();
                callback();
            },2000);
        }
        function callback(){
            /*ajax动态加载数据*/
            var odemos=' <li class="clearfix">\
                            <img class="comheadimg" src="../img/community/gdf.png" alt=""/>\
                             <div class="comBox">\
                                 <p class="name">\
                                     Leo\
                                 </p>\
                                 <p class="conversation"> \
                                  '+$(".releaseText").val() +'\
                                 </p>\
                                <div class="shareBox">\
                                 <a href="javascript:;"><img src="../img/community/dd.png" alt=""></a>\
                                </div>\
                                <div class="box row lineheight-20">\
                        <span class="time col-50"> \
                              3分钟前\
                        </span>\
                        <div class="col-50 text-right">\
                            <b class="commentbtn"> \
                            </b>\
                        </div>\
                        <div class="Toolbar"> \
                            <a class="likes-f" href="javascript:;"> \
                                <i class="iconTool iconTool-likes"></i>\
                                    赞\
                            </a> \
                            <a class="comments-f " href="javascript:;" dataid="444"> \
                                <i class="iconTool iconTool-comment"></i>\
                            评论\
                            </a>\
                            <a class="shares-f " href="javascript:;"> \
                                <i class="iconTool iconTool-share"></i>\
                            分享\
                            </a> \
                        </div>\
                    </div> \
                                <div class="commentBox" style="display:none;" dataid="444"> \
                        <i class="triangle-up"></i> \
                        <div class="like"> \
                            <i class="icon icon-like"></i> \
                            <span class="num"> \
                            0\
                            </span> \
                        </div>\
                        <div class="content"> \
                            <div class="contentBox"> \
                            </div>\
                        </div>\
                        <div class="foot arrow ">\
                            <i class="icon-arrow">\
                            </i> \
                        </div>\
                    </div>\
                             </div>\
                         </li>';
            $(".comentList").append(odemos);


        }
        photoMove(function(){
            callback();
        })


    }

}

/*创建加载中图片*/
community.createimg = function(){
    var oimg=$('<li class="loading"><i class="icon-load"></i><span>正在加载中...</span></li>');
    if(!$(".comentList li").hasClass('loading')){
        $(".comentList").append(oimg);
    }
}

//评论箭头的显示与隐藏
community.operateArrow = function(){
    $(".commentBox").each(function(index,item){
        var oconts=$(item).find(".contentBox"),
            contheight=oconts.height(),
            omaxheight=$(item).find(".content").css("maxHeight");
        if((contheight-parseInt(omaxheight)) < 0){
            $(item).find(".foot").hide();
        }else{
            $(item).find(".foot").show();
        }
    });

}

//评论框
community.operateCommunity = function(){
    this.operateArrow();
    var otop = 125,ofs = true;
    $(document).on("tap",".icon-arrow",function(e){
        e.preventDefault();
        var oconts=$(e.currentTarget).closest(".commentBox").find(".contentBox"),
            contheight=oconts.height(),
            omaxheight=$(e.currentTarget).closest(".commentBox").find(".content").css("maxHeight");

        if(ofs){
            if(contheight>parseInt(omaxheight)){
                if(contheight-parseInt(omaxheight)>125){
                    otop+=125;
                }else{
                    otop+=(contheight-parseInt(omaxheight));
                }
                oconts.parent().animate({
                    "maxHeight":otop+"px"
                })

            }
        }

    }) ;

}

//点击图片显示上传图片弹窗
community.dialogShows = function(arg1, arg2){
    var $dialog = arg1;
    var h = $dialog.height();
    arg2.on('tap', function(e){
        e.preventDefault();
        $dialog.css('bottom', -h);
        community.mask.show();
        $dialog.show().animate({'bottom': 0}, 600, function(){});
    });
}

//点击评论按钮显示弹窗
community.dialogShowcoms = function(arg1, arg2){
    var $dialog = arg1;
    var h = $dialog.height(),self=this;
    $(document).on('tap',arg2, function(e){
        self.dataid=$(e.currentTarget).attr("dataid");
        e.preventDefault();
        $dialog.css('bottom', -h);
        community.maskwhite.show();
        $dialog.show().animate({'bottom': 0}, 300, function(){});
        $(".commentText").focus().val("");

    });
}

//点击加号发布信息显示弹窗
community.dialogShow = function(arg1, arg2){
    var $dialog = arg1;
    var h = $dialog.height();

    arg2.on('click', function(e){
        e.preventDefault();
        $dialog.css('bottom', -h);
        community.maskwhite.show();
        $dialog.show().animate({'bottom': 0}, 300, function(){});
        $(".releaseText").focus().val("");
        $(window).scrollTop(0);

    });

}

//弹窗关闭
community.dialogClose = function(){
    var visible,self=this;
    $(".dialog-mask-black").on('click', function(){
        visible = $(".dialog-chooseImg:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
            visible.hide();
            community.mask.hide();
        });
    });

    $(".dialog-mask-white").on('click', function(){
        visible = $(".dialog:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
            visible.hide();
            community.maskwhite.hide();
        });

    });

    $(".cancelBtn").on('click', function(){
        visible = $(".dialog-chooseImg:visible");
        visible.animate({'bottom': -visible.height()}, 300, function(){
            visible.hide();
            community.mask.hide();
        });
    });



}

community.choseImg = function(){
    var self=this;
    $(".scBtn").on("tap",function(e){
        e.preventDefault();
        $(".releaseText").blur();
        $(".imgBox").show();
    })

}


$(document).ready(function(){

        community.init();


});