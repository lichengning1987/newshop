(function(jQuery){
	
	/*����jquery*/
	var $ = jQuery;

	var CreateDiary = function(options){
		this.container = options.container;
		this.data = options.data;
		this.hotel = this.data.hotel; //�ù�����
		this.type = this.data.type; //����
		this.info = this.data.info; //ÿ�ִ��͵���Ϣ
		this.firstMonthArr = []; //�洢��һ������Ҫ������ݣ���������ģ������
		this.secondMonthArr = []; //�洢�ڶ�������Ҫ�������ݣ���������ģ������
		this.firstMonth = 0; //��һ�������ĸ���
		this.secondMonth = 0; //�ڶ��������ĸ���
		this.firstMonthTr = 0; //��һ�����м���
		this.secondMonthTr = 0; //�ڶ������м���
		this.renderTable();
		return this;
	};

	CreateDiary.prototype = {
		  constructor : CreateDiary
		 /*����2014-1-1��ɺ���*/
		, getFullDate : function(date){
			if(typeof date == 'string'){
				date = date.replace(/-/g,"/");
				return new Date(date);
			}			
		}
		/*����2014-1-1��ȡ�·�*/
		, getDiaryMonth : function(date){
			var dateObj = this.getFullDate(date);
			return dateObj.getMonth()+1;
		}
		/*����2014-1-1��ȡ����*/
		, getDiaryDate : function(date){
			var dateObj = this.getFullDate(date);
			return dateObj.getDate();
		}
		/*����2014-1-1��ȡ2014��1��*/
		, getMonthInfo : function(date){
			var thisDate = this.getFullDate(date);
			return thisDate.getFullYear() + '\u5e74' + (this.getDiaryMonth(date)) + '\u6708';
		}
		/**
		 * ����2014-1-1��ȡ��һ��2014-1-2����������һ���Զ�������
		 * ����{date:2014-1-2,content:{}}
		 */
		, getNextDate : function(date){
			var today = this.getFullDate(date);
			var tomorrow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);				
			return {
					'date' : tomorrow.getFullYear()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getDate(),
					'content' : {}//���û������
				};
		}
		/*�ж��Ƿ��ǿն���*/
		, isEmptyObject : function(obj){
		    for(var n in obj){
		    	return false
		    } 
		    return true; 
		} 
		/**
		 * ���ݶ���{'full':1} || {} || ''��䵥Ԫ��
		 * �������
		 * 1��������Ա����Ա��䲢�������
		 * 2��ֻ�������
		 * 3��ʲô�������
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
		 * ���ÿһ��
		 * trlen : ����
		 * trInfo : ��һ����Ԫ�����ȥ����Ϣ
		 * tdArr �� �����ĵ�Ԫ����Ϣ
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
		 * ԭʼ�������ϳ�����
		 * �ֿ�������
		 * ���Բ����һ���µڶ�����
		 */
		, sortDiary : function(){
			var self = this,
				infos = this.info,
				infosLength = infos.length;
			/*�ж������м�����*/
			this.firstMonth = this.getDiaryMonth(infos[0].date);
			this.secondMonth = this.getDiaryMonth(infos[infosLength-1].date);
			(this.firstMonth == this.secondMonth) && (this.secondMonth = 0);

			/*ԭʼ���ݷ���*/
			$.each(infos,function(i,n){
				var thisMonth = self.getDiaryMonth(n.date);
					n.month = thisMonth;
					if(thisMonth == self.firstMonth){
						self.firstMonthArr.push(n);
					} else if(self.secondMonth && thisMonth == self.secondMonth){
						self.secondMonthArr.push(n);
					}
			});

			/*�ж�ÿ���������м���*/
			this.firstMonthTr = Math.ceil(self.firstMonthArr.length/7);
			this.secondMonth && (this.secondMonthTr = Math.ceil(self.secondMonthArr.length/7));
			
			/*�����һ����*/
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

			/*����ڶ�����*/
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

	/*ȫ�ֱ�¶*/
	window.CreateDiary = CreateDiary;
})($||jQuery);