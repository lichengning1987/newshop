(function(jQuery){

	/**
	 * 引入jquery库
	 */
	var $ = jQuery;

	/**
	 * 
	 * 
	 */
	var Select = function(obj, options){
		// console.log(obj)
		this.init(obj, options);
		
	};

	/**
	 * 初始化
	 */
	Select.prototype.init = function(obj, options){

		var self = this;
		if(options.autoInit == true){
			self.createWrap(obj, options);
		} else {
			obj.on('click', function(){
				self.createWrap(obj, options);
			});
		}

	}

	Select.prototype.createWrap = function(obj, options){
		var self = this;
		
		if(obj.hasClass("dialog-select")){
			self.showSelect(obj, options, s, 'clicked');
		} else {
			var time = new Date().getTime();
			var s = 	'<div class="dialog dialog-new" id="dialog-select-'+time+'">'+
							'<div class="box">';
				s += options.content;
				s += 	'<div class="pd8 clearfix">'+
							'<a href="javascript:void(0);" class="h1 pdlt10 unUseBtn fl">不使用</a>'+
                            '<a href="javascript:void(0);" class="h1 pdrt10 cancelBtn fr">取消</a>'+
						'</div>'+
					'</div>';

			//先判断遮罩层有没有
			if($("#dialog-mask").length == 0){
				$("body").append('<div class="dialog-mask" id="dialog-mask"></div>');
			}
			
			var mark = 'dialog-select-' + time;
			obj.addClass("dialog-select").attr("mark",mark);
			self.showSelect(obj, options, s);
		}
	}

	/*
	*弹窗显示
	*/
	Select.prototype.showSelect = function(obj, options, s, clicked){

		var self = this;
		
		var $dialog;
		var windowW = $(window).width();
		var windowH = $(window).height();

		if(clicked){
			var id = "#" + obj.attr("mark");
			$dialog = $(id);
		} else {
			$("body").append(s);
			if(options.autoInit == true){
				var id = "#" + obj.attr("mark");
				$dialog = $(id);
			} else {
				$dialog = $(".dialog-new");
			}
		}
		
		
		
		var h = $dialog.height();
		$dialog.css('bottom', -h);


		if(options.autoInit == true){
			var _this = obj;
			_this.on('click', function(){
				//如果有gray这个class  表示是要禁止弹窗的
				if($(this).hasClass("gray")){
					return;
				}
				console.log($dialog.attr("id"));
				console.log($dialog.length);
				$("#dialog-mask").css({'width': windowW, 'height': windowH, 'display': 'block'});
				$dialog.show().stop().animate({'bottom': 0}, 300, function(){}).removeClass("dialog-new");
				self.closeSelect(obj, options);
				self.cancelSelect();



			});
		} else {
			//如果有gray这个class  表示是要禁止弹窗的
			if(obj.hasClass("gray")){
				return;
			}
			$("#dialog-mask").css({'width': windowW, 'height': windowH, 'display': 'block'});
			$dialog.show().stop().animate({'bottom': 0}, 300, function(){}).removeClass("dialog-new");
			self.closeSelect(obj, options);
            self.cancelSelect();
		}
		
	}

	/*
	*弹窗关闭点击取消
	*/
    Select.prototype.cancelSelect = function(){

		var self = this;
		var $dialog = $(".dialog");
		var $dialogMask = $(".dialog-mask");

        $dialog.find(".cancelBtn").on('click', function(){
			$dialog.stop().animate({'bottom': -$dialog.height()}, 300, function(){
				$dialog.hide();
				$dialogMask.hide();
			});
		});

	}


	Select.prototype.closeSelect = function(obj, options){

		var self = this;
		var $dialog = $(".dialog");
		var $dialogMask = $(".dialog-mask");
		$dialog.find(".unUseBtn").off("click").on('click', function(){

			$dialog.stop().animate({'bottom': -$dialog.height()}, 300, function(){
				$dialog.hide();
				$dialogMask.hide();
			});
            self.callback(obj, options);
		});

		if(options.maskClose){
			$dialogMask.on('click', function(){
				$dialog.stop().animate({'bottom': -$dialog.height()}, 300, function(){
					$dialog.hide();
					$dialogMask.hide();
				});
			});
		}

	}

	$.SelectClose = function(){
		$(".dialog").hide();
		$(".dialog-mask").hide();
	}

	/*
	*点击确定按钮执行的回调
	*/
	Select.prototype.callback = function(obj, options){
		if(options.callback){
            options.callback();
		}
	}
	
	$.fn.Select = function(options){

		options = $.extend({},$.fn.Select.options, options);

		return this.each(function(){

			new Select($(this), options);

			// console.log(option);

		});
	};


	/*
	*默认参数
	*content:底部滑框的内容
	*callback：回调函数  用户点击确定按钮执行的方法
	*/
	$.fn.Select.options = {
		content: '<div class="box">111</div>',		//要显示的内容  为必须
		maskClose: true,							//点击后面的mask是否关闭弹窗
		autoInit: true,								//进入页面自动生成弹窗  但是隐藏在底部不显示  
		callback: function(){						//点击确定的回调函数

		}
	};

})($||jQuery);