/**
 * Created by JetBrains PhpStorm.
 * User: cn
 * Date: 14-1-21
 * Time: 下午1:49
 * To change this template use File | Settings | File Templates.
 */


/*模拟提示框*/
(function($){
    $.extend({
        alert:function(html,callback){
            var dialog=new Dialog();
            dialog.build('alert',callback,html);
        },
        alerts:function(html,callback){
            var dialog=new Dialog();
            dialog.build('alerts',callback);
        },
        confirm:function(html,callback){
            var dialog=new Dialog();
            dialog.build('confirm',callback,html);
        },
        confirms:function(html,callback){
            var dialog=new Dialog();
            dialog.build('confirms',callback,html);
        },
        confirmss:function(html,callback){
            var dialog=new Dialog();
            dialog.build('confirmss',callback,html);
        }
    });
    var Dialog=function(){
        var render={
            template:' <div class="alertParent"><div class="alertContent"><div class="alertHtml">你的操作出现错误！</div></div></div>',
            templateConfirm: ' <div class="alertParent l_alertParent l_confirmParent" id="confirmPanel"><div class="alertContent"><div class="alertHtml">你的操作出现错误！</div> <div class="btnBar"><input type="button" value="取消" id="cancel" class="cancel"/><input type="button" value="确定" class="sure" id="sure"/></div></div></div>',
            overlay:'<div class="overlay"></div>',
            /**
             * 根据需要生成对话框
             * @param {Object} type
             * @param {Object} callback
             * @param {Object} html
             */
            renderDialog:function(type,callback,html){
                if(type=='alert'){
                    this.renderAlert(callback,html);
                }else if(type=='confirm'){
                    this.renderConfirm(callback,html);
                }else if(type=="confirms"){
                    this.renderConfirms(callback,html);
                }else if(type=='alerts'){
                    this.renderAlerts(callback,html);
                }else{
                    this.renderConfirmss(callback,html);
                }
            },
            /**
             * 生成alert
             * @param {Object} callback
             * @param {Object} html
             */
            renderAlert:function(callback,html){
                var temp=$(this.template).clone().hide();
                temp.find('div.alertHtml').html(html);
                $(document.body).append(temp);
                this.setPosition(temp);
                temp.fadeIn();
                this.bindEvents('alert',temp,callback);

            },
            /**
             * 生成confirm
             * @param {Object} callback
             * @param {Object} html
             */
            renderConfirm:function(callback,html){
                var temp=$(this.templateConfirm).clone().hide();
                 var overlay=$(this.overlay).clone();
                temp.find('div.alertHtml').html(html);
                $(document.body).append(temp);
                $(document.body).append(overlay);
                this.setPosition(temp);
                temp.fadeIn();
                this.bindEvents('confirm',temp,callback);
            },
            /**
             * 设定对话框的位置
             * @param {Object} el
             */
            setPosition:function(el){
                var width=el.width(),
                    height=el.height(),
                    pageSize=this.getPageSize();
                el.css({
                    top:(pageSize.h-height)/2,
                    left:(pageSize.w-width)/2
                });
            },
            /**
             * 绑定事件
             * @param {Object} type
             * @param {Object} el
             * @param {Object} callback
             */
            bindEvents:function(type,el,callback){

                if(type=="alert"){
                    if($.isFunction(callback)){
                        setTimeout(function(){
                            if( callback ) callback(true);
                            $('div.alertParent').remove();
                            $('div.overlay').remove();
                        },3000)
                    }else{
                        setTimeout(function(){
                            if( callback ) callback(true);
                            $('div.alertParent').remove();
                            $('div.overlay').remove();
                        },3000)
                    }
                }else if(type=="confirm"){
                    if($.isFunction(callback)){
                        $('#sure').click(function(){

                            if( callback ) callback(true);
                            $('div.alertParent').remove();
                            $('div.overlay').remove();
                        });
                    }else{
                        $('#sure').click(function(){
                            $('div.alertParent').remove();
                            $('div.overlay').remove();
                        });
                    }
                    $('#cancel').click(function(){
                        $('div.alertParent').remove();
                        $('div.overlay').remove();
                        if( callback ) callback(false);

                    });

                }
            },
            /**
             * 获取页面尺寸
             */
            getPageSize:function(){
                return {
                    w:$(window).width(),
                    h:$(window).height()
                }
            }
        }
        return {
            build:function(type,callback,html){
                render.renderDialog(type,callback,html);
            }
        }
    }
})($);
