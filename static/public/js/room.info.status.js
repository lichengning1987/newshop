(function(jQuery){
	
	/*引入jquery*/
	var $ = jQuery;

	var CreateDiary = function(options){
		this.container = options.container;
		this.data = options.data;
		this.hotel = this.data.hotel; //旅馆名称
		this.type = this.data.type; //床型
		this.info = this.data.info; //每种床型的信息
		this.firstMonthArr = []; //存储第一个月需要填充数据，包括程序模拟数据
		this.secondMonthArr = []; //存储第二个月需要填充的数据，包括程序模拟数据
		this.firstMonth = 0; //第一个月是哪个月
		this.secondMonth = 0; //第二个月是哪个月
		this.firstMonthTr = 0; //第一个月有几行
		this.secondMonthTr = 0; //第二个月有几行
		this.renderTable();
		return this;
	};

	CreateDiary.prototype = {
		  constructor : CreateDiary
		 /*根据2014-1-1变成毫秒*/
		, getFullDate : function(date){
			if(typeof date == 'string'){
				date = date.replace(/-/g,"/");
				return new Date(date);
			}			
		}
		/*根据2014-1-1获取月份*/
		, getDiaryMonth : function(date){
			var dateObj = this.getFullDate(date);
			return dateObj.getMonth()+1;
		}
		/*根据2014-1-1获取日期*/
		, getDiaryDate : function(date){
			var dateObj = this.getFullDate(date);
			return dateObj.getDate();
		}
		/*根据2014-1-1获取2014年1月*/
		, getMonthInfo : function(date){
			var thisDate = this.getFullDate(date);
			return thisDate.getFullYear() + '\u5e74' + (this.getDiaryMonth(date)) + '\u6708';
		}
		/**
		 * 根据2014-1-1获取下一天2014-1-2，并返回下一天自定义数据
		 * 返回{date:2014-1-2,content:{}}
		 */
		, getNextDate : function(date){
			var today = this.getFullDate(date);
			var tomorrow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);				
			return {
					'date' : tomorrow.getFullYear()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getDate(),
					'content' : {}//标记没有数据
				};
		}
		/*判断是否是空对象*/
		, isEmptyObject : function(obj){
		    for(var n in obj){
		    	return false
		    } 
		    return true; 
		} 
		/**
		 * 根据对象{'full':1} || {} || ''填充单元格
		 * 三种情况
		 * 1、正常满员非满员填充并填充日期
		 * 2、只填充日期
		 * 3、什么都不填充
		 */
		, renderTd : function(obj){
			var self = this;
			var full;
			var fullClass = '';
			var fullStatus = '';//\u672a\u8bbe\u7f6e
			var quanty;
			var tdHtml = '';
			if(typeof obj == "object"){	
				var tdContent = obj.content;		
				if(this.isEmptyObject(tdContent)){
					tdHtml = '<td>' +
								'<div class="diary-content">'+
                					'<span class="diary-date">' + self.getDiaryDate(obj.date) + '</span>' +
                			  	'</div>'+
                			  '</td>';
					
                } else {

                	full = parseInt(tdContent.full);
                	quanty = tdContent.quanty;
                	if (full == 1) {
                		fullClass = 'full-house';
                		fullStatus = '\u6ee1\u623f';
                	} else if (full == 0) {
                		fullClass = 'no-full-house';
                		fullStatus = '\u975e\u6ee1\u623f';
                	}
					tdHtml += '<td class="' + fullClass + '">' +
								'<div class="diary-content">'+
									'<span class="diary-date">' + self.getDiaryDate(obj.date) + '</span>' +
		                            '<p>' + fullStatus + '</p>' +
		                            '<p>' + quanty + '</p>' +
	                            '</div>'+
	                          '</td>';
                }
            } else {
            	tdHtml += '<td></td>';
            }
            
            return tdHtml;
		}
		/**
		 * 填充每一行
		 * trlen : 行数
		 * trInfo : 第一个单元格填进去的信息
		 * tdArr ： 待填充的单元格信息
		 */
		, renderTr : function(trLen , trInfo , tdArr){
			var self = this;
			var count = 0;
			var trHtml = '';
				for(var i=0 ; i<trLen ; i++){
					if(i == 0){
						trHtml += '<tr>' + '<td class="diary-month" rowspan="' + trLen + '">' +  trInfo + '</td>';
						for(var j=0 ; j<7 ; j++){
							trHtml += this.renderTd(tdArr[count]);
							count ++ ;
							continue;
						}
					} else {
						trHtml += '<tr>';
						for(var j=0 ; j<7 ; j++){
							trHtml += this.renderTd(tdArr[count]);
							count ++ ;
							continue;
						}
					}
					trHtml += '</tr>';
				}
			return trHtml;
		}
		/**
		 * 原始数据整合成日历
		 * 分开两个月
		 * 各自补齐第一个月第二个月
		 */
		, sortDiary : function(){
			var self = this,
				infos = this.info,
				infosLength = infos.length;
			/*判断日历有几个月*/
			this.firstMonth = this.getDiaryMonth(infos[0].date);
			this.secondMonth = this.getDiaryMonth(infos[infosLength-1].date);
			(this.firstMonth == this.secondMonth) && (this.secondMonth = 0);

			/*原始数据分月*/
			$.each(infos,function(i,n){
				var thisMonth = self.getDiaryMonth(n.date);
					n.month = thisMonth;
					if(thisMonth == self.firstMonth){
						self.firstMonthArr.push(n);
					} else if(self.secondMonth && thisMonth == self.secondMonth){
						self.secondMonthArr.push(n);
					}
			});

			/*判断每个月日历有几行*/
			this.firstMonthTr = Math.ceil(self.firstMonthArr.length/7);
			this.secondMonth && (this.secondMonthTr = Math.ceil(self.secondMonthArr.length/7));
			
			/*补齐第一个月*/
			var emptyFirst = 7 - self.firstMonthArr.length % 7;
			if(this.secondMonth){
				for(var i=0 ; i < emptyFirst ; i++){
					this.firstMonthArr.push('');
				}
			} else {
				var today = this.firstMonthArr[self.firstMonthArr.length-1].date;
				var tomorrow;
				for(var i=0 ; i < emptyFirst ; i++){
					tomorrow = self.getNextDate(today);
					today = tomorrow.date;
					if ( this.getDiaryMonth(tomorrow.date) != this.firstMonth){
						this.firstMonthArr.push('');
					} else {
						this.firstMonthArr.push(tomorrow);
					}					
				}
			}

			/*补齐第二个月*/
			if(this.secondMonth){
				var today = this.secondMonthArr[self.secondMonthArr.length-1].date;

				var tomorrow;
				var emptySecond = 7 - self.secondMonthArr.length % 7;
				for(var i=0 ; i < emptySecond ; i++){
					tomorrow = self.getNextDate(today);
					today = tomorrow.date;
					if ( this.getDiaryMonth(tomorrow.date) != this.secondMonth){
						this.secondMonthArr.push('');
					} else {
						this.secondMonthArr.push(tomorrow);
					}					
				}
			} else {
				return;
			}
		}
		, renderTable : function(){
			var self = this;
			this.sortDiary();
			var thisInFoLen = this.info.length;
			var firstMonthInfo = this.getMonthInfo(this.info[0].date);
			var secondMonthInfo = this.getMonthInfo(this.info[thisInFoLen-1].date);
			var firstTrHtml = this.renderTr(this.firstMonthTr,firstMonthInfo,this.firstMonthArr);
			this.secondMonthArr && (firstTrHtml += this.renderTr(this.secondMonthTr,secondMonthInfo,this.secondMonthArr));
			var tableTr = '<div class="diary-box">' +
							'<table class="diary-table">' +
							'<caption class="diary-caption">' + this.type + '</caption>' +
							firstTrHtml +
							'</table>' +
							'</div>';
			self.container.append(tableTr);
		}
	}	

	/*全局暴露*/
	window.CreateDiary = CreateDiary;
})($||jQuery);