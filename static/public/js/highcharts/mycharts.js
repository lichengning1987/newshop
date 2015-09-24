function Charts()
{
	this.defaultOpts = {
		chart: { marginTop:20, spacingBottom:10 },
        title: { text: null },
        legend: { enabled: false, align:'center', verticalAlign:'top', y:-15, floating:true, borderWidth:0 }, //图表说明区
        
    	//数据项提示区
        tooltip: {
        	shared:true, crosshairs:true, borderRadius:2, borderWidth:2,
        	formatter: function(){
        		var s = '<b>' + this.x + '</b>';
        		var flag = false;
        		$.each(this.points, function(i, point){
        			if (typeof(point.point.compare_date) != 'undefined' && !flag){
        				s += '<br/><b>' + point.point.compare_date + '</b>';
        				flag = true;
        			}
        			s += '<br/><span style="color:' + point.series.color + '">' + point.series.name + '：</span>' + '<b>' + point.point.id + '</b>';
        		});
        		
        		return s;
        	}
        },
    	credits: { enabled:false },
    	
        //x轴
        xAxis: {
            tickWidth: 0,
            gridLineWidth: 0,
            gridLineDashStyle: 'LongDash',
            tickWidth:1,
            tickPosition: 'inside',
            tickmarkPlacement: 'on',
            labels: { align:'center', x:0, y:15, style:{color:'#777'} }
        },
        plotOptions: {
        	series:{marker: { lineWidth:2 }},
        	line: {
        		marker: {
        			enabled: true,
        			radius: 4,
        			states: {
        				hover: {
        					enabled: true
        				}
        			}
        		}
        	}
        }
    };
	
	//default options of pie
	this.defaultPieOpts = {
			chart: {
				plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
			title: { text: null },
	        tooltip: {
	            formatter: function() {
	                return '<span style="font-weight: bold; color: ' + this.point.color + '">' 
	                	   + this.point.name + '</span>: '+ this.percentage.toFixed(2) + '%';
	            }
	        },
	        plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            legend: {
            	labelFormatter: function() {
            		var len = this.name.length,
            		    step = 13,
            			num = parseInt(len/step);
            		if (num > 0) {
            			var str = '';
            			for (var k=0; k <= num; k++) {
            				if (k > 0) {
            					str += '<br />';
            				}
            				str += this.name.substr(k*step, step);
            			}
            			return str;
            		} else {
            			return this.name;
            		}
            	}
            },
	        credits: { enabled:false },
	        series: [{
	            type: 'pie',
	            name: null
	        }]
	};
	
	//default options of column
	this.defaultColumnOpts = {
			chart: { type: 'column' },
			title: { text: null },
			plotOptions: {
                column: { pointPadding: 0, borderWidth: 0 }
            },
            credits: { enabled:false },
            tooltip: {
            	shared: true,
            	useHTML: true,
            	formatter: function() {
            		var s = '<b>' + this.x + '</b>';
            		$.each(this.points, function(i, point) {
            			s += '<br/><span style="color:' + point.series.color + '">' + point.series.name + '：</span>' + 
            				 '<b> ' + Highcharts.numberFormat(point.point.y * 100, 2) + '%</b>';
            		});
            		
            		return s;
            	}
            },
            xAxis: {
            	labels: { align:'center', x:0, y:15, style:{color:'#777'} }
            },
            yAxis: {
                min: 0,
                title: { text: null },
                labels: {
                	style: { color: '#777' }
                }
            }
	};
	
	//default options for series/yAxis
    this.seriesDftOpts = {lineWidth:2, marker:{radius:4}};
	this.yAxisDftOpts = {
		min: 0,
    	minPadding: 1,
        labels: {align:'left', x:3, y:16, style:{color:'#777'}},
        title: {text:null},
        gridLineColor: '#DDD',
        gridLineDashStyle: 'LongDash',
        showFirstLabel: false
    };	
}

//format metrics by its data type
Charts.prototype.formatMetric = function(type)
{
	var formatMethod = function(){ return this.value; };
	switch (type) {
    	case 'int':
    		formatMethod = function(){
    			return Highcharts.numberFormat(this.value, 0, null, ',');
    		};
    		break;
    	case 'decimal':
    		formatMethod = function(){
        		return Highcharts.numberFormat(this.value, 2);
        	};
    		break;
    	case 'percent':
    		formatMethod = function(){
        		return Highcharts.numberFormat(this.value * 100, 2) + '%';
        	};
    		break;
    	case 'time':
    		formatMethod = function(){
        		return Highcharts.dateFormat('%H:%M:%S', Date.UTC(null, null, null, 0, 0, this.value));
        	};
    		break;
	}
	
	return formatMethod;
}

//Pie charts
Charts.prototype.drawPie = function(params, options)
{
	$this = this;
	//set default params
	var opts = {};
	for (i in $this.defaultPieOpts) {
		if (typeof(options[i]) != 'undefined') {
			opts[i] = $.extend({}, $this.defaultPieOpts[i], options[i]);
		} else {
			opts[i] = $this.defaultPieOpts[i];
		}
	}
	
	//opts = $.extend(this.defaultPieOpts, options);
	opts.series[0].data = params.data;
	chart = new Highcharts.Chart(opts);
}

//column charts
Charts.prototype.drawColumn = function(params, options)
{
	$this = this;
	$('#' + options.chart.renderTo).empty();
	
	//merge the default options and options use provided
	var opts = {};
	for (i in $this.defaultColumnOpts) {
    	if(typeof(options[i]) != 'undefined') {
    		opts[i] = $.extend({}, $this.defaultColumnOpts[i], options[i]);
    	} else {
    		opts[i] = $this.defaultColumnOpts[i];
    	}
	}
	
	//Load data asynchronously using jQuery On success
	jQuery.ajax({
		type: 'GET',
		url: '?m=ecmall.customer&c=statistical&a=ajaxuser',
		data: params,
    	dataType: 'json',
    	success: function(result, state, xhr) {
    		opts.xAxis.categories = result.categories;
    		opts.yAxis.labels.formatter = $this.formatMetric(result.dataType);
    		
    		//init
        	opts.series = [];
        	//fill data in options for each series
            for (i in result.data) {
            	var dt = result.data[i];
            	opts.series[i] = {};
            	
            	//merge with user options
            	if(typeof(options.series) != 'undefined') {
            		opts.series[i] = $.extend({}, options.series[i]);
            	}
            	
            	//series options
            	opts.series[i].name = dt['name'];
            	opts.series[i].data = dt['values'];
            }
    		
            chart = new Highcharts.Chart(opts);
    	}
	});
}

//gauge charts
Charts.prototype.drawGauge = function(options)
{
	var currentYxis = options.series[0].data[0];
	if (currentYxis < 1) {
		var maxYxis = 1;
		var warning = 0.2
	} else {
		var maxYxis = currentYxis + 5;
		var warning = 1;
	}
	
	$('#'+options.chart.renderTo).highcharts({
		chart: {
	        type: 'gauge',
	        plotBorderWidth: 0,
	        plotBackgroundColor: {
	        	linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	        	stops: [
	        		[0, '#ffffff']
	        	]
	        },
	        plotBackgroundImage: null,
	        height: 110
	    },
	    title: {
	        text: null
	    },
	    pane: {
	    	startAngle: -45,
	        endAngle: 45,
	        background: null,
	        center: ['50%', '145%'],
	        size: 200
	    },
	    // the value axis
	    yAxis: {
	        min: 0,
	        max: maxYxis,
	        
	        minorTickPosition: 'outside',
	        tickPosition: 'outside',
	        labels: {
	        	rotation: 'auto',
	        	distance: 20
	        },
	        plotBands: [{
	        	from: 0,
	        	to: warning,
	        	color: '#C02316',
	        	innerRadius: '100%',
	        	outerRadius: '105%'
	        }],
	        pane: 0,
	        title: {
	        	text: null
	        }
	    },
	    plotOptions: {
	    	gauge: {
	    		dataLabels: {
	    			enabled: true
	    		},
	    		dial: {
	    			radius: '100%'
	    		}
	    	}
	    },
	    credits: { enabled:false },
	    series: options.series
	});
}

//Line charts
Charts.prototype.drawLine = function(params, options)
{
	$this = this;
	$('#' + options.chart.renderTo).empty();
	$('#' + options.chart.renderTo).css('background', 'url("/img/loading-charts.gif") no-repeat center center');

	//merge the default options and options use provided
	var opts = {};
	for (i in $this.defaultOpts) {
    	if(typeof(options[i]) != 'undefined') {
    		opts[i] = $.extend({}, $this.defaultOpts[i], options[i]);
    	} else {
    		opts[i] = $this.defaultOpts[i];
    	}
	}
	
	//opts.chart.renderTo = target;
	if (params.metrics[1] == '-1' || params.metrics[1] == params.metrics[0]) {
		delete(params.metrics[1]);
	}
	
	//Load data asynchronously using jQuery On success
    jQuery.ajax({
    	type: 'GET',
    	url: '/report/ajax',
    	data: params,
    	dataType: 'json',
    	success: function(result, state, xhr) {
    		var base = 2;
    		if(params.isflag != undefined) {
    			var ispoint = 10;
    		} else {
    			var ispoint = 30;
    		}
    		
    		//返回不合法数据时
    		if (result.date == undefined || result.data == undefined) {
    			$('#' + options.chart.renderTo).css('background', 'none');
    			$('#' + options.chart.renderTo).html('<div class="juzhong notification attention"><p>所请求的时间范围内无数据或者返回的数据不合法！</p></div>');
    			return;
    		}
    		//end
    		
    		if(result.date.length >= ispoint){
    			opts.plotOptions.line.marker.enabled = false;
    		}
        	
        	opts.xAxis.categories = result.date;
        	opts.xAxis.labels.step = Math.floor(result.date.length/base);
        	
        	//init
        	opts.yAxis = opts.series = []; //y轴标尺
        	
        	//fill data in options for each series 
        	var j = result.data.length;
            for (i in result.data) {
            	var dt = result.data[i];
            	
            	//merge with user options
            	if(typeof(options.series) != 'undefined') {
            		opts.series[i] = $.extend({}, $this.seriesDftOpts, options.series[i]);
            	}
            	if(typeof(options.yAxis) != 'undefined') {
            		opts.yAxis[i] = $.extend({}, $this.yAxisDftOpts, options.yAxis[i]);
            	}
            	
            	//add callback function to format label of yAxis
            	opts.yAxis[i].labels.formatter = $this.formatMetric(dt['metricType']);
            	
            	//series options
            	opts.series[i].data = dt['values'];
            	opts.series[i].name = dt['metricName'];
            	if (params.graphType != undefined && params.graphType) {
            		opts.series[i].yAxis = 0;
            	} else {
            		opts.series[i].yAxis = i*1;
            	}
            	
            	//compare date range
            	if (typeof(dt['compare_values']) != 'undefined'){
            		var number = parseInt(j, 10) + parseInt(i, 10);
            		opts.series[number] = {};
            		if(typeof(options.yAxis) != 'undefined') {
                		opts.yAxis[number] = $.extend({}, $this.yAxisDftOpts, options.yAxis[number]);
                	}
            		opts.series[number].data = dt['compare_values'];
            		opts.series[number].name = dt['metricName'];
            		if (params.graphType != undefined && params.graphType) {
            			opts.series[number].yAxis = 0;
            		} else {
            			opts.series[number].yAxis = i*1;
            		}
            	}
            	//end
            }
            
            $('#' + options.chart.renderTo).css('background', 'none');
            chart = new Highcharts.Chart(opts);
    	},
    	error: function(msg){
    		if (msg.responseText != undefined && typeof(msg.responseText == 'string')){
    			if (msg.responseText.search('AJAXgraphflagONLY') != '-1') {
	    			$('#' + options.chart.renderTo).css('background', 'none');
	    			$('#' + options.chart.renderTo).html('<div class="juzhong notification attention"><p>所请求的页面已过期，请重新登录！</p></div>');
	    			return;
    			}
    		}
    	}
	});
};	