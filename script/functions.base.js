/**
* Funções base
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7": "c","\u00e6": "ae","\u0153": "oe","\u00e1": "a","\u00e9": "e","\u00ed": "i","\u00f3": "o","\u00fa": "u","\u00e0": "a","\u00e8": "e","\u00ec": "i","\u00f2": "o","\u00f9": "u","\u00e4": "a","\u00eb": "e","\u00ef": "i","\u00f6": "o","\u00fc": "u","\u00ff": "y","\u00e2": "a","\u00ea": "e","\u00ee": "i","\u00f4": "o","\u00fb": "u","\u00e5": "a","\u00e3": "a","\u00f8": "o","\u00f5": "o",u: "u","\u00c1": "A","\u00c9": "E", "\u00cd": "I","\u00d3": "O","\u00da": "U","\u00ca": "E","\u00d4": "O","\u00dc": "U","\u00c3": "A","\u00d5": "O","\u00c0": "A","\u00c7": "C"};return this.replace(/[\u00e0-\u00fa]/ig,function(a){return"undefined"!=typeof b[a]?b[a]: a})});
Array.prototype.indexOf||(Array.prototype.indexOf=function(d,e){var a;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),b=c.length>>>0;if(0===b)return-1;a=+e||0;Infinity===Math.abs(a)&&(a=0);if(a>=b)return-1;for(a=Math.max(0<=a?a: b-Math.abs(a),0);a<b;){if(a in c&&c[a]===d)return a;a++}return-1});
function qd_number_format(b,c,d,e){b=(b+"").replace(/[^0-9+\-Ee.]/g,"");b=isFinite(+b)?+b:0;c=isFinite(+c)?Math.abs(c):0;e="undefined"===typeof e?",":e;d="undefined"===typeof d?".":d;var a="",a=function(a,b){var c=Math.pow(10,b);return""+(Math.round(a*c)/c).toFixed(b)},a=(c?a(b,c):""+Math.round(b)).split(".");3<a[0].length&&(a[0]=a[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,e));(a[1]||"").length<c&&(a[1]=a[1]||"",a[1]+=Array(c-a[1].length+1).join("0"));return a.join(d)};

try {
	var Tools = {
		chartMonetaryFormat: function (value) { 
			return "R$ " + qd_number_format(value, 2, ",", "."); 
		},
		chartMonetaryFormatRounded: function (value) {
			if(value > 1000) 
				return qd_number_format(value / 1000, 2, ",", ".") + "k"; 
			
			return qd_number_format(value, 2, ",", "."); 
		},
		chartMonetaryFormatRoundedWithoutDecimal: function (value) {
			if(value > 1000) 
				return qd_number_format(Math.floor(value / 1000), 0, ",", ".") + "k"; 
			
			return qd_number_format(value, 2, ",", "."); 
		},
		chartPercentFormat:function(value,name,i) {
			if (value) 
        		return value +'%';
        	else
        		return null;
        }
	};

	var Common = {
		run: function() {
			Common._QD_restful_url = "http://dashboardapi.quatrodigital.com.br";
			Common._QD_restful_report_url = "http://dashboardapi.quatrodigital.com.br";

			Common.queryString();
			Common.checkAuthentication();
			Common.loading();

			Common._QD_color = { 
				vtex_ranks : '#F44336',
				vtex_orders : '#673AB7',
				vtex_orders_marktplace : '#03A9F4',
				vtex_orders_fulfillment : '#4CAF50',
				vtex_orders_invoiced : '#FFEB3B',
				ga_orders : '#795548'
			} 
		},
		init: function() {

			if (!Common.logged())
				Common.loginModal();
			else {
				if(Common._QD_query_string.google_client_token)
					return Common.googleAnalyticsSaveToken();

				Common.selectStore();
				Common.qdLinkAddLoja();

				if(Common._QD_query_string.store){
					Common.qdLinkSettings();
					
					// Quantidade de pedidos por dia
					Common.ordersQttChart(true);

					// Quantidade de pedidos por mês
					Common.ordersQttChart(false);

					// Valor dos pedidos por dia
					Common.ordersValueChart(true); 

					// Valor dos pedidos por mês
					Common.ordersValueChart(false); 

					// Quantidade de pedidos por dia por forma de pagamento
					Common.ordersQttPaymentTypeChart(true);

					// Quantidade de pedidos por mês por forma de pagamento
					Common.ordersQttPaymentTypeChart(false);
					
					// Quantidade de pedidos por dia por promoção
					Common.ordersQttRateBenefitsChart(true);

					// Quantidade de pedidos por mês por promoção
					Common.ordersQttRateBenefitsChart(false);

					// Quantidade de pedidos faturados por dia por promoção
					Common.ordersInvoicedQttRateBenefitsChart(true);

					// Quantidade de pedidos faturados por mês por promoção
					Common.ordersInvoicedQttRateBenefitsChart(false);
					
					// Quantidade de pedidos por dia por UTM
					Common.ordersQttUtmSourceChart(true);

					// Quantidade de pedidos por mês por UTM
					Common.ordersQttUtmSourceChart(false);
					
					// Quantidade de pedidos faturados por dia por UTM
					Common.ordersInvoicedQttUtmSourceChart(true);

					// Quantidade de pedidos faturados por mês por UTM
					Common.ordersInvoicedQttUtmSourceChart(false);

					// Quantidade de pedidos faturados por dia
					Common.ordersInvoicedQttChart(true);

					// Quantidade de pedidos faturados por mês
					Common.ordersInvoicedQttChart(false);

					// Valor dos pedidos faturados por dia
					Common.ordersInvoicedValueChart(true);

					// Valor dos pedidos faturados por mês
					Common.ordersInvoicedValueChart(false);

					// Quantidade de pedidos faturados por dia por forma de pagamento
					Common.ordersInvoicedPaymentTypeChart(true);
					
					// Quantidade de pedidos faturados por mês por forma de pagamento
					Common.ordersInvoicedPaymentTypeChart(false);

					// Quantidade de pedidos completos X incompletos por dia
					Common.ordersIncompleteQttChart(true);

					// Quantidade de pedidos completos X incompletos por mês
					Common.ordersIncompleteQttChart(false);

					// Conversão GA x OMS x Faturado OMS por dia
					Common.conversionChart(true);

					// Conversão GA x OMS x Faturado OMS por mês
					Common.conversionChart(false);
					
					// Consolidado ano geral
					Common.consolidated();

					// Consolidado mês atual
					Common.consolidatedByMonth();

					// Consolidado ano atual
					Common.consolidatedByYear();
				}
			}
		}, 
		ajaxStop: function() {},
		windowOnload: function() {},
		loading: function() {
			$(document).ajaxStart(function() {
				$('.qd-loading').show();
			});
			$(document).ajaxStop(function() {
				$('.qd-loading').hide();
			});
		},
		qdLinkSettings: function() {
			$('.qd-link-settings').click(function() {
				var modal = Common.preparingModal({
					title: 'Configurações',
					closeButton: true,
					body: '<div class="row"><div class="col-xs-12"><h5><strong>Google Analytics</strong></h5><p><img src="img/ajax-loader.gif" /></p></div></div>'
				});

				Common.getGaConnectionInfo(modal);

				return false;
			});
		},
		getGaConnectionInfo: function(modal) {
			$.ajax({
				headers: Common._QD_ajax_headers,
				type: 'POST',
				url: Common._QD_restful_url + '/pvt/analytics/connected',
				data: {
					store: Common._QD_query_string.store
				},
				dataType:'json',
				success: function(data) {
					$(document.body).removeClass('qd-ga-loading');
					if (data.success) {
						if (data.profileIdConfigured)
							modal.find('p').html('Você esta conectado como: <span class="qd-ga-status bg-info"> ' + data.accountName + ' &raquo; ' + data.propertyName + ' (' + data.propertyId + ') &raquo; ' + data.profileName + ' </span>');
						$('<button class="qd-link-to-ga btn btn-primary" style="display: block;">Vincular o GA com ' + Common._QD_query_string.store + '</button>')
							.appendTo( data.profileIdConfigured ? modal.find('p') : modal.find('p').empty()).click(function(){
								$(document.body).addClass('qd-ga-loading');
								Common.googleAnalyticsLoadProfiles(modal);
							});
							
					}
					else {
						$('<button class="qd-connect-to-ga btn btn-primary">Conectar com Google Analytics</button>').appendTo(modal.find('p').empty()).click(function(){
							Common.googleAnalyticsLogin(modal);
						});
					}						

					modal.on('hide.bs.modal',function(){
						window.location.reload();
					});
					
				}
			});
		},
		googleAnalyticsLogin: function(modal) {
			$(document.body).addClass('qd-ga-loading');
			$.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_url + '/pvt/analytics/login',
				success: function(data) {				
					var win = window.open(data.link, "qd_login_ga", "width=600, height=480, resizable=0, scrollbars=0, status=0, toolbar=0");
					var timer = setInterval(function() {
						if(win && win.closed) { 
							clearInterval(timer);
							if (win.google_client_token && win.google_client_token.indexOf('false') < 0)
								Common.googleAnalyticsConf(win.google_client_token , modal);
							else 
								Common.getGaConnectionInfo(modal); 
						}
					}, 200);
				}
			});
		},
		googleAnalyticsLoadProfiles: function(modal) {
			$.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_url + '/pvt/analytics/profiles',
				success: function(data) {
					$(document.body).removeClass('qd-ga-loading');
					var html = '<ol>';
					var account;
					var property;
					var profile;

					for(var i in data.accounts) {
						account = data.accounts[i];
						html += '<li>';
						html += '<span><strong>Conta: </strong>' + account.name + '</span>';
						html += '<ol type="I">';

						for(var j in account.properties) {
							property = account.properties[j];
							html += '<li>';
							html += '<span><strong>Propriedade: </strong>' + property.name + '</span>';
							html += '<ol type="a">';

							for(var k in property.profiles) {
								profile = property.profiles[k];
								html += '<li>';
								html += '<span><strong>Visualização: </strong><a class="profile_id" href="' + profile.id + '">' + profile.name + '</a></span>';
								html += '</li>';
							}

							html += '</ol>';
							html += '</li>';
						}

						html += '</ol>';
						html += '</li>';
					}

					html += '</ol>';
					html = $(html);

					html.appendTo(modal.find('p').empty());

					html.find('a').on('click', function(){
						$(document.body).addClass('qd-ga-loading');
						$.ajax({
							type: 'POST',
							headers: Common._QD_ajax_headers,
							url: Common._QD_restful_url + '/pvt/analytics/set-profiles',
							data: {
								google_client_profile_id: $(this).attr('href'),
								store_account:Common._QD_query_string.store
							},
							success: function(data) {
								if (data.success) {
									window.location.reload();
								} else 
									Common.getGaConnectionInfo();
							}
						});
						return false;
					});
				},
				error: function(data){
				
				}
			});
		},
		googleAnalyticsConf: function(google_client_token , modal) {
			$.ajax({
				type: 'POST',
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_url + '/pvt/analytics/set-google-client-token',
				data: { google_client_token: google_client_token },
				success: function() {
					Common.getGaConnectionInfo(modal); 
				}
			});
		}, 
		googleAnalyticsSaveToken: function() {
			if (Common._QD_query_string.google_client_token === "false") {
				var modal = Common.preparingModal({
					doNotClose: true,
					title: 'Parabens!',
					body: 'Lamento, não é possivel efetuar login no analytics, você não autorizou o aplicativo. <br /><br /><button type="button" class="btn btn-primary qd-btn-ok">OK</button>'
				});

				modal.find('.qd-btn-ok').on('click', function(){
					modal.modal('hide');
					window.close();
					return false;
				});
				window.google_client_token = false;
			}
			else {
				window.google_client_token = Common._QD_query_string.google_client_token;
				var modal = Common.preparingModal({
					doNotClose: true,
					title: 'Parabens!',
					body: 'Você está logado no google analytics. <br /><br /><button type="button" class="btn btn-primary qd-btn-ok">OK</button>'
				});

				modal.find('.qd-btn-ok').on('click', function(){
					if (window.close) {
						modal.modal('hide');
						window.close();
						return false;
					}
				});
			}
		},
		checkAuthentication: function() {
			$(document).ajaxComplete(function(event, XMLHttpRequest, ajaxOptions) {
				if(XMLHttpRequest.status != 401)
					return;

				Common.sessionExpirated();
			});
		},
		queryString: function() {
			var items = (document.location.search || "").replace("?", "").split("&");
			var query = {};
			var item;

			for(var i in items){
				item = items[i].split("=");
				query[item[0]] = item[1] || "";
			}

			Common._QD_query_string = query;
		},
		logged: function() {
			var token = $.cookie('qdToken');
			if (!token)
				return false;

			Common._QD_qd_auth = token;
			Common._QD_ajax_headers = {'x-qd-auth': token };
			return true;
		},
		// Request por dia
		ordersByDayRequest: function() {
			function padLeft(value, length) {
			    return (value.toString().length < length)? padLeft("0" + value, length): value;
			}

			var dateStartObject = new Date();
			dateStartObject.setDate(dateStartObject.getDate() - 30);
    		var dateStart = dateStartObject.getFullYear() + '-' + padLeft((dateStartObject.getMonth() + 1), 2) + '-' + padLeft(dateStartObject.getDate(), 2);

    		var dateEndObject = new Date();
    		var dateEnd = dateEndObject.getFullYear() + '-' + padLeft((dateEndObject.getMonth() + 1), 2) + '-' + padLeft(dateEndObject.getDate(), 2);

    		if(Common.ordersByDayRequestXHR)
    			return Common.ordersByDayRequestXHR;

			Common.ordersByDayRequestXHR = $.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders-by-day",
				dataType: "json",
				data: {
					store: Common._QD_query_string.store,
					dateStart: dateStart,
					dateEnd: dateEnd
				}
			});
			return Common.ordersByDayRequestXHR;
		},
		// Request por mês
		ordersByMonthRequest: function() {
			function padLeft(value, length) {
			    return (value.toString().length < length)? padLeft("0" + value, length): value;
			}

			var dateStartObject = new Date();
			dateStartObject.setDate(dateStartObject.getDate() - 365);
    		var dateStart = dateStartObject.getFullYear() + '-' + padLeft((dateStartObject.getMonth() + 1), 2) + '-' + padLeft(dateStartObject.getDate(), 2);

    		var dateEndObject = new Date();
    		var dateEnd = dateEndObject.getFullYear() + '-' + padLeft((dateEndObject.getMonth() + 1), 2) + '-' + padLeft(dateEndObject.getDate(), 2);

    		if(Common.ordersByMonthRequestjqXHR)
    			return Common.ordersByMonthRequestjqXHR;

			Common.ordersByMonthRequestjqXHR = $.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders-by-month",
				dataType: "json",
				data: {
					store: Common._QD_query_string.store,
					dateStart: dateStart,
					dateEnd: dateEnd
				}
			});
			return Common.ordersByMonthRequestjqXHR;
		},
		ordersQttChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {			
				datajson.chartOrdersLabel.unshift('x');
				datajson.chartOrdersQtt.unshift('data1');
				datajson.chartOrdersQttFulfillment.unshift('data2');
				datajson.chartOrdersQttMarketplace.unshift('data3');
				datajson.gaOrdersQtt.unshift('data4');
				datajson.chartOrdersPosition.unshift('data5');

				var chartLines = c3.generate({
					bindto: (day ? '#orders-qtt-by-day' : '#orders-qtt-by-month'),
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersQtt,
							datajson.chartOrdersQttFulfillment,
							datajson.chartOrdersQttMarketplace,
							datajson.gaOrdersQtt,
							datajson.chartOrdersPosition
						],
						names: {
							data1: 'Todos os Pedidos',
							data2: 'Pedidos Marketplace',
							data3: 'Pedidos Loja',
							data4: 'Pedidos GA',
							data5: 'Rank',
						},
						type: 'area',
						labels: true
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: {
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }
				    }
				});

			});
		},
		ordersValueChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				datajson.chartOrdersValue.unshift('data1');
				datajson.chartOrdersValueFulfillment.unshift('data2');
				datajson.chartOrdersValueMarketplace.unshift('data3');
				datajson.gaOrdersValue.unshift('data4');

				var chartLines = c3.generate({
					bindto: (day ? '#orders-value-by-day' : '#orders-value-by-month'),
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersValue,
							datajson.chartOrdersValueFulfillment,
							datajson.chartOrdersValueMarketplace,
							datajson.gaOrdersValue
						],
						names: {
							data1: 'Todos os Pedidos',
							data2: 'Pedidos Marketplace',
							data3: 'Pedidos Loja',
							data4: 'Pedidos GA',
						},
						type: 'area',
						labels: {
				            format: {
				                data1: Tools.chartMonetaryFormatRounded,
				                data2: Tools.chartMonetaryFormatRounded,
				                data3: Tools.chartMonetaryFormatRounded,
				                data4: Tools.chartMonetaryFormatRounded
				            }
				        }
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: {
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }
				    }
				});

			});
		},
		ordersQttPaymentTypeChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersPaymentNames) {
					columns.push(new Array(i));
				} 
				columns.push(new Array('Marketplace'));
				
				var index = 0;
				for(var i in datajson.chartOrdersQttPaymentNames) {
					index = 0;
					for(var j in datajson.chartOrdersPaymentNames) {
						var data = datajson.chartOrdersQttPaymentNames[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(null);	
						index++;
					} 
				}

				var localChartOrdersQttFulfillment = new Array();
				for(var i in datajson.chartOrdersQttFulfillment) {
					if (!isNaN(parseInt(datajson.chartOrdersQttFulfillment[i]))) 
						localChartOrdersQttFulfillment.push(datajson.chartOrdersQttFulfillment[i]);
				}

				for(var j in localChartOrdersQttFulfillment) {
					columns[index].push( localChartOrdersQttFulfillment[j]);
				}
				
				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: (day ? '#orders-qtt-by-day-payment-type' : '#orders-qtt-by-month-payment-type'),
					data: {
						x: 'x',
						columns:columns ,
						type: 'area',
						labels: false
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: { 
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }, 
				        y: {
				        	tick: {
				                
				            }
				        }
				    },
				    tooltip: {
				    	
					}	
				});

			});
		},
		ordersQttRateBenefitsChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersRateAndBenefits) {
					columns.push(new Array(i));
				} 
				
				var index = 0;
				for(var i in datajson.chartOrdersQttRateAndBenefits) {
					index = 0;
					for(var j in datajson.chartOrdersRateAndBenefits) {
						var data = datajson.chartOrdersQttRateAndBenefits[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(null);	
						index++;
					} 
				}

				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: (day ? '#orders-by-day-rate-benefits' : '#orders-by-month-rate-benefits'),
					data: {
						x: 'x',
						columns:columns ,
						type: 'area',
						labels: false
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: { 
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }, 
				        y: {
				        	tick: {
				                
				            }
				        }
				    },
				    tooltip: {
				    	
					}	
				});

			});
		},
		ordersInvoicedQttRateBenefitsChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersInvoicedRateAndBenefits) {
					columns.push(new Array(i));
				} 
				
				var index = 0;
				for(var i in datajson.chartOrdersQttInvoicedRateAndBenefits) {
					index = 0;
					for(var j in datajson.chartOrdersInvoicedRateAndBenefits) {
						var data = datajson.chartOrdersQttInvoicedRateAndBenefits[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(null);	
						index++;
					} 
				}

				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: (day ? '#orders-invoiced-by-day-rate-benefits' : '#orders-invoiced-by-month-rate-benefits'),
					data: {
						x: 'x',
						columns:columns ,
						type: 'area',
						labels: false
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: { 
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }, 
				        y: {
				        	tick: {
				                
				            }
				        }
				    },
				    tooltip: {
				    	
					}	
				});

			});
		},
		ordersQttUtmSourceChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersUtmSource) {
					columns.push(new Array(i));
				} 
				
				var index = 0;
				for(var i in datajson.chartOrdersQttUtmSource) {
					index = 0;
					for(var j in datajson.chartOrdersUtmSource) {
						var data = datajson.chartOrdersQttUtmSource[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(null);	
						index++;
					} 
				}

				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: (day ? '#orders-by-day-utm-source' : '#orders-by-month-utm-source'),
					data: {
						x: 'x',
						columns:columns ,
						type: 'area',
						labels: false
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: { 
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }, 
				        y: {
				        	tick: {
				                
				            }
				        }
				    },
				    tooltip: {
				    	
					}	
				});

			});
		},
		ordersInvoicedQttUtmSourceChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersInvoicedUtmSource) {
					columns.push(new Array(i));
				} 
				
				var index = 0;
				for(var i in datajson.chartOrdersQttInvoicedUtmSource) {
					index = 0;
					for(var j in datajson.chartOrdersInvoicedUtmSource) {
						var data = datajson.chartOrdersQttInvoicedUtmSource[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(null);	
						index++;
					} 
				}

				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: (day ? '#orders-invoiced-by-day-utm-source' : '#orders-invoiced-by-month-utm-source'),
					data: {
						x: 'x',
						columns:columns ,
						type: 'area',
						labels: false
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: { 
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }, 
				        y: {
				        	tick: {
				                
				            }
				        }
				    },
				    tooltip: {
				    	
					}	
				});

			});
		},
		ordersInvoicedQttChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				datajson.chartOrdersInvoicedQtt.unshift('data1');
				datajson.chartOrdersInvoicedQttFulfillment.unshift('data2');
				datajson.chartOrdersInvoicedQttMarketplace.unshift('data3');

				var chartLines = c3.generate({
					bindto: (day ? '#orders-invoiced-qtt-by-day' : '#orders-invoiced-qtt-by-month'),
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersInvoicedQtt,
							datajson.chartOrdersInvoicedQttFulfillment,
							datajson.chartOrdersInvoicedQttMarketplace,
						],
						names: {
							data1: 'Todos os Pedidos',
							data2: 'Pedidos Marketplace',
							data3: 'Pedidos Loja',
							data4: 'Pedidos GA',
							data5: 'Rank',
						},
						type: 'area',
						labels: true
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: {
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }
				    }
				});

			});
		},
		ordersInvoicedValueChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				datajson.chartOrdersInvoicedValue.unshift('data1');
				datajson.chartOrdersInvoicedValueFulfillment.unshift('data2');
				datajson.chartOrdersInvoicedValueMarketplace.unshift('data3');

				var chartLines = c3.generate({
					bindto: (day ? '#orders-invoiced-value-by-day' : '#orders-invoiced-value-by-month'),
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersInvoicedValue,
							datajson.chartOrdersInvoicedValueFulfillment,
							datajson.chartOrdersInvoicedValueMarketplace,
						],
						names: {
							data1: 'Todos os Pedidos',
							data2: 'Pedidos Marketplace',
							data3: 'Pedidos Loja',
							data4: 'Pedidos GA',
						},
						type: 'area',
						labels: {
				            format: {
				                data1: Tools.chartMonetaryFormatRounded,
				                data2: Tools.chartMonetaryFormatRounded,
				                data3: Tools.chartMonetaryFormatRounded
				            }
				        }
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: {
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }
				    }
				});

			});
		},
		ordersInvoicedPaymentTypeChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersInvoicedPaymentNames) {
					columns.push(new Array(i));
				} 
				columns.push(new Array('Marketplace'));
				
				var index = 0;
				for(var i in datajson.chartOrdersQttInvoicedPaymentNames) {
					index = 0;
					for(var j in datajson.chartOrdersInvoicedPaymentNames) {
						var data = datajson.chartOrdersQttInvoicedPaymentNames[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(null);	
						index++;
					} 
				}


				var localChartOrdersQttFulfillment = new Array();
				for(var i in datajson.chartOrdersQttFulfillment) {
					if (!isNaN(parseInt(datajson.chartOrdersQttFulfillment[i]))) 
						localChartOrdersQttFulfillment.push(datajson.chartOrdersQttFulfillment[i]);
				}

				for(var j in localChartOrdersQttFulfillment) {
					columns[index].push( localChartOrdersQttFulfillment[j]);
				}
				
				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: (day ? '#orders-invoiced-by-day-payment-type' : '#orders-invoiced-by-month-payment-type'),
					data: {
						x: 'x',
						columns:columns ,
						type: 'area',
						labels: false
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: { 
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }, 
				        y: {
				        	tick: {
				                
				            }
				        }
				    },
				    tooltip: {
				    	
					}	
				});

			});
		},
		ordersIncompleteQttChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {
				datajson.chartOrdersIncompleteQtt.unshift('data2');

				var chartLines = c3.generate({
					bindto: (day ? '#orders-incomplete-by-day' : '#orders-incomplete-by-month'), 
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersQtt,
							datajson.chartOrdersIncompleteQtt
						],
						names: {
							data1: 'Todos os Pedidos',
							data2: 'Pedidos Incompletos',
						},
						type: 'area',
						labels: true
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: {
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }
				    }
				});

			});
		},
		conversionChart: function(day) {
			(day ? Common.ordersByDayRequest() : Common.ordersByMonthRequest()).done(function(datajson) {			
			
				var localChartOrdersQtt = new Array();
				for(var i in datajson.chartOrdersQtt) {
					if (!isNaN(parseInt(datajson.chartOrdersQtt[i]))) 
						localChartOrdersQtt.push(datajson.chartOrdersQtt[i]);
				}

				var localChartOrdersInvoicedQtt = new Array();
				for(var i in datajson.chartOrdersInvoicedQtt) {
					if (!isNaN(parseInt(datajson.chartOrdersInvoicedQtt[i]))) 
						localChartOrdersInvoicedQtt.push(datajson.chartOrdersInvoicedQtt[i]);
				}
			

				var oms = new Array();
				var omsInvoiced = new Array();
				var ga = new Array();
				for(var i in datajson.gaSessions) {
					if (datajson.gaSessions[i] > 0) {
						oms.push(   ((localChartOrdersQtt[i] / datajson.gaSessions[i]) * 100).toFixed(2)   );
						omsInvoiced.push(   ((localChartOrdersInvoicedQtt[i] / datajson.gaSessions[i]) * 100).toFixed(2)   );
						ga.push(   ((datajson.gaTransactions[i] / datajson.gaSessions[i]) * 100).toFixed(2)   );
					}
					else {
						oms.push(null);
						omsInvoiced.push(null);
						ga.push(null);
					}
				}

				oms.unshift('data1');
				omsInvoiced.unshift('data2');
				ga.unshift('data3');

				var chartLines = c3.generate({
					bindto: (day ? '#conversion-by-day' : '#conversion-by-month'),
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							oms,
							omsInvoiced,
							ga
						],
						names: {
							data1: 'Conversão Loja',
							data2: 'Conversão Faturados',
							data3: 'Conversão GA'
						},
						type: 'area',
						labels: {
				            format: {
				                data1:Tools.chartPercentFormat,
				                data2:Tools.chartPercentFormat,
				                data3:Tools.chartPercentFormat
				            }
				        }
					},
					grid: {
						x: {show: true },
						y: {show: true }
					},
					axis: {
				        x: {
				            type: 'categorized',
				            tick: {
				                rotate: 90,
				                multiline: false
				            },
				        }
				    },
				    tooltip: {
				        format: {
				            title: function (d) { return 'Conversão ' + d; },
				            value: function (value, ratio, id, i) {
				            	if (id === 'data1') 
				            		return value + '% - Pedidos: ' + datajson.chartOrdersQtt[i+1] + ', Sessões: ' + datajson.gaSessions[i];

				            	if (id === 'data2') 
				            		return value + '% - Pedidos: ' + datajson.chartOrdersInvoicedQtt[i+1] + ', Sessões: ' + datajson.gaSessions[i];

				            	if (id === 'data3') 
				            		return value + '% - Pedidos: ' + datajson.gaTransactions[i] + ', Sessões: ' + datajson.gaSessions[i];

				                return value;
				            }
				        }
				    }
				});
			});
		},
		consolidated: function() {
			$.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders",
				dataType: "json",
				data: {
					store: Common._QD_query_string.store
				},
				success:function(datajson) {
					$('#qtt-orders-current-all').text(datajson.chartOrdersAllQtt[datajson.chartOrdersAllQtt.length-1]);
					$('#qtt-orders-item-current-all').text(datajson.chartOrdersAllQttItems[datajson.chartOrdersAllQttItems.length-1]);
					$('#value-orders-current-all').text(Tools.chartMonetaryFormat(datajson.chartOrdersAllValue[datajson.chartOrdersAllValue.length-1]));
					$('#value-orders-invoiced-current-all').text(Tools.chartMonetaryFormat(datajson.chartOrdersAllInvoicedValue[datajson.chartOrdersAllInvoicedValue.length-1]));
					$('#value-orders-pending-by-all').text(Tools.chartMonetaryFormat(datajson.chartOrdersAllPendingValue[datajson.chartOrdersAllPendingValue.length-1]));

					if (!datajson.gaSessions[0])
						$('#percent-conversion-by-all').text('...');
					else
						$('#percent-conversion-by-all').text(((datajson.chartOrdersAllQtt[0] / datajson.gaSessions[0]) * 100).toFixed(2) +'%');

					$('#qtt-orders-pending-by-all').text(datajson.chartOrdersAllPendingQtt);
					$('#qtt-orders-canceled-by-all').text(datajson.chartOrdersAllCanceledQtt);
				}
			});
		},
		consolidatedByMonth: function() {
			function padLeft(value, length) {
			    return (value.toString().length < length)? padLeft("0" + value, length): value;
			}

			var dateStartObject = new Date();
    		var dateStart = dateStartObject.getFullYear() + '-' + padLeft((dateStartObject.getMonth() + 1), 2) + '-01';

    		var dateEndObject = new Date();
    		var dateEnd = dateEndObject.getFullYear() + '-' + padLeft((dateEndObject.getMonth() + 1), 2) + '-' + padLeft(dateEndObject.getDate(), 2);

			$.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders-by-month",
				dataType: "json",
				data: {
					store: Common._QD_query_string.store,
					dateStart: dateStart,
					dateEnd: dateEnd
				},
				success:function(datajson) {
					$('#qtt-orders-current-month').text(datajson.chartOrdersQtt[datajson.chartOrdersQtt.length-1]);
					$('#qtt-orders-item-current-month').text(datajson.chartOrdersQttItems[datajson.chartOrdersQttItems.length-1]);
					$('#value-orders-current-month').text(Tools.chartMonetaryFormat(datajson.chartOrdersValue[datajson.chartOrdersValue.length-1]));
					$('#value-orders-invoiced-current-month').text(Tools.chartMonetaryFormat(datajson.chartOrdersInvoicedValue[datajson.chartOrdersInvoicedValue.length-1]));
					$('#value-orders-pending-by-month').text(Tools.chartMonetaryFormat(datajson.chartOrdersPendingValue[datajson.chartOrdersPendingValue.length-1]));
					
					if (!datajson.gaSessions[0])
						$('#percent-conversion-by-month').text('...');
					else
						$('#percent-conversion-by-month').text(((datajson.chartOrdersQtt[0] / datajson.gaSessions[0]) * 100).toFixed(2) +'%');

					$('#qtt-orders-pending-by-month').text(datajson.chartOrdersPendingQtt);
					$('#qtt-orders-canceled-by-month').text(datajson.chartOrdersCanceledQtt);
				}
			});
		},
		consolidatedByYear: function() {
			function padLeft(value, length) {
			    return (value.toString().length < length)? padLeft("0" + value, length): value;
			}

			var dateStartObject = new Date();
			dateStartObject.setDate(dateStartObject.getDate() - 30);
    		var dateStart = dateStartObject.getFullYear() + '-' + padLeft((dateStartObject.getMonth() + 1), 2) + '-01';

    		var dateEndObject = new Date();
    		var dateEnd = dateEndObject.getFullYear() + '-' + padLeft((dateEndObject.getMonth() + 1), 2) + '-' + padLeft(dateEndObject.getDate(), 2);

			$.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders-by-year",
				dataType: "json",
				data: {
					store: Common._QD_query_string.store,
					dateStart: dateStart,
					dateEnd: dateEnd
				},
				success:function(datajson) {
					$('#qtt-orders-current-year').text(datajson.chartOrdersQtt[datajson.chartOrdersQtt.length-1]);
					$('#qtt-orders-item-current-year').text(datajson.chartOrdersQttItems[datajson.chartOrdersQttItems.length-1]);
					$('#value-orders-current-year').text(Tools.chartMonetaryFormat(datajson.chartOrdersValue[datajson.chartOrdersValue.length-1]));
					$('#value-orders-invoiced-current-year').text(Tools.chartMonetaryFormat(datajson.chartOrdersInvoicedValue[datajson.chartOrdersInvoicedValue.length-1]));
					$('#value-orders-pending-by-year').text(Tools.chartMonetaryFormat(datajson.chartOrdersPendingValue[datajson.chartOrdersPendingValue.length-1]));
					
					if (!datajson.gaSessions[0])
						$('#percent-conversion-by-year').text('...');
					else
						$('#percent-conversion-by-year').text(((datajson.chartOrdersQtt[0] / datajson.gaSessions[0]) * 100).toFixed(2) +'%');
					$('#qtt-orders-pending-by-year').text(datajson.chartOrdersPendingQtt);
					$('#qtt-orders-canceled-by-year').text(datajson.chartOrdersCanceledQtt);
				}
			});
		},
		loginModal: function() {
			var form = $('<form class="login"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label for="email">E-mail: </label> <input type="email" class="form-control" id="email" name="email" placeholder="E-mail" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-login">Login</button> </form>');
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Informe seu e-mail',
				body: form
			});

			form.on('submit', function(e) {
				e.preventDefault();

				form.find(".request-message").remove();
				form.append('<div class="pull-right request-message"> <span class="label label-warning">Aguarde, estamos processando os dados ...</span> </div>');

				$.ajax({
					type: 'POST',
					url: Common._QD_restful_url + '/get-token',
					data: {email: form.find('input#email').val() },
					success: function(data) {
						Common._QD_ajax_headers = {'x-qd-auth': data.xQdAuth };
						Common._QD_qd_auth = data.xQdAuth;

						if (data.success) {
							modal.modal('hide');
							Common.checkToken();
						} else
							form.find(".request-message").html('<span class="label label-danger">Não foi possivel efetuar o login</span>');
					},
					error: function(data){
						form.find(".request-message").html('<span class="label label-danger">Não foi possivel efetuar o login </span>');
					}
				});
			});
		},
		checkToken: function() {
			var form  = $('<form class="checkToken"> <div class="row"> <div class="col-xs-12"> <p>Nós te mandamos uma chave de 6 dígitos no seu e-mail, é ela que você deve informar agora!</p><div class="form-group"> <label for="email">Chave de acesso com 6 dígitos: </label> <input type="tel" class="form-control" id="token" name="token" placeholder="Token" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-validate-token">Validar</button> </form>');
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Informe a chave de acesso',
				body: form
			});

			form.on('submit', function(e){
				e.preventDefault();

				form.find(".request-message").remove();
				form.append('<div class="pull-right request-message"> <span class="label label-warning">Aguarde, estamos processando os dados ...</span> </div>');
				$.ajax({
					headers: Common._QD_ajax_headers,
					url: Common._QD_restful_url + '/pvt/token-validate',
					data: {token: form.find('input#token').val()},
					success: function(data) {
						if (data.success) {
							$.cookie('qdToken', Common._QD_qd_auth, { expires: 60 * 60 * 23,  path: "/" });

							if (!data.hasStores) {
								modal.modal('hide');
								Common.messageUserLogged();
							}
							else
								window.location.reload();
						}
						else
							form.find(".request-message").html('<span class="label label-danger">Não foi possivel validar o token</span>');
					},
					error: function(data){
						form.find(".request-message").html('<span class="label label-danger">Não foi possivel validar o token</span>');
					}
				});
			});
		},
		sessionExpirated: function() {
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Usuário desconectado',
				body: '<div class="text-center"><p class="bg-danger text-danger">Infelizmente você não esta logado.</p><video width="259" height="224" autoplay loop><source src="https://media.giphy.com/media/YqWBUAQAKbraw/giphy.mp4" type="video/mp4"></source></video><br /><a href="" class="btn btn-primary">Fazer login</a></div>'
			});

			$.removeCookie("qdToken");
		},
		messageUserLogged: function() {
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Parabens!',
				body: 'Você está logado, mais ainda não possui uma loja, cadastre uma agora mesmo. <br /><br /><button type="button" class="btn btn-primary btn-validate-token">Cadastrar</button>'
			});

			modal.find('.btn-validate-token').on('click', function(){
				modal.modal('hide');
				Common.setStore(false);
			});
		},
		setStore: function(withClose) {
			var form  = $('<form class="cadastro"> <div class="row"> <div class="col-xs-12"> <p>Para preencher essas informações acesse o License Manager e copie os dados da sua conta na aba "Contas".</p> <div class="form-group"> <label for="account">Account</label> <input type="text" class="form-control" id="account" name="account" placeholder="Account" value=""> </div> </div> <div class="col-xs-12"> <div class="form-group"> <label for="key">Key</label> <input type="text" class="form-control" id="key" name="key" placeholder="Key" value=""> </div> </div> <div class="col-xs-12"> <div class="form-group"> <label for="token">Token</label> <input type="text" class="form-control" id="token" name="token" placeholder="Token" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-login">Cadastrar</button> </form>');
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Informe os dados da instituição',
				body: form,
				closeButton: withClose? true: false
			});

			form.on('submit', function(e){
				e.preventDefault();

				form.find(".request-message").remove();
				form.append('<div class="pull-right request-message"> <span class="label label-warning">Aguarde, estamos processando os dados ...</span> </div>');

				$.ajax({
					headers: Common._QD_ajax_headers,
					type: 'POST',
					url: Common._QD_restful_url + '/pvt/set-store',
					data: {
						account: form.find('input#account').val(),
						key: form.find('input#key').val(),
						token: form.find('input#token').val()
					},
					success: function(data) {
						form.find('.modal-body form .pull-right').remove();
						if (data.success) {
							modal.modal('hide');
							Common.messageSetStoreSaved();
						}
						else
							form.find(".request-message").html('<span class="label label-danger">Não foi possivel cadastrar store</span>');
					},
					error: function(data){
						form.find(".request-message").html('<span class="label label-danger">Não foi possivel cadastrar store</span>');
					}
				});
			});
		},
		messageSetStoreSaved: function() {
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Parabens!',
				body: 'Loja cadastrada com sucesso. <br /><br /><button type="button" class="btn btn-primary btn-fim">Fim</button>'
			});

			modal.find('.btn-fim').on('click', function(){
				window.location.reload();
			});
		},
		qdLinkAddLoja: function() {
			$('.qd-link-add-loja').on('click', function(){
				Common.setStore(true);
				return false;
			});
		},
		selectStore: function() {
			var ulLojas = $('ul.dropdown-menu.store');
			$.ajax({
				headers: Common._QD_ajax_headers,
				type: 'GET',
				url: Common._QD_restful_url + '/pvt/get-stores',
				success: function(data) {
					for (var i in data.stores)
						ulLojas.append('<li><a href="?store='+data.stores[i].account+'">'+data.stores[i].account+'</a></li>');

					Common._QD_stores = data.stores;
					if(!Common._QD_query_string.store)
						window.location.search = 'store=' + data.stores[0].account;

					$('.btn-default.dropdown-toggle.store').html(Common._QD_query_string.store + ' <span class="caret"></span>');
				}
			});
		},
		preparingModal: function(opts) {
			var defaults = {
				doNotClose: false,
				closeButton: false
			};
			var options = $.extend(defaults, opts);

			var elemModal = $('.modal-qd-v1').clone().appendTo(document.body);
			elemModal.removeClass('modal-qd-v1');
			elemModal.find('.modal-title').text(options.title);
			elemModal.find('.modal-body').html(options.body);

			if (options.closeButton)
				elemModal.find('.modal-title').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');

			if(options.doNotClose)
				elemModal.modal({backdrop: 'static', keyboard: false });
			else
				elemModal.modal();

			elemModal.on('hidden.bs.modal', function () { elemModal.remove(); });

			return elemModal;
		}
	}
}
catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && console.error("Houve um erro nos objetos. Detalhes: " + e.message)); }

try {
	(function() {
		var body, ajaxStop, windowLoad;

		windowLoad = function() {
			Common.windowOnload();
		};

		ajaxStop = function() {
			Common.ajaxStop();
		};

		$(function() {
			body = $(document.body);
			Common.init();

			$(document).ajaxStop(ajaxStop);
			$(window).load(windowLoad);
			body.addClass('jsFullLoaded');
		});

		Common.run();
	})();
}
catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && $(document.body).addClass('jsFullLoaded jsFullLoadedError') && console.error("Houve um erro ao iniciar os objetos. Detalhes: " + e.message)); }