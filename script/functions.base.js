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
				return "R$ " + qd_number_format(value / 1000, 2, ",", ".") + "k"; 
			
			return "R$ " + qd_number_format(value, 2, ",", "."); 
		},
		chartMonetaryFormatRoundedWithoutDecimal: function (value) {
			if(value > 1000) 
				return "R$ " + qd_number_format(Math.floor(value / 1000), 0, ",", ".") + "k"; 
			
			return "R$ " + qd_number_format(value, 2, ",", "."); 
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
					Common.ordersByDayChart();
					Common.ordersByMonthChart();
					Common.ordersValueByMonthChart();
					Common.ordersByMonthMarkXFulfillmentChart();
					Common.ordersByDayPaymentType();
					Common.ordersByMonthPaymentType();
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
		ordersByDayChart: function() {
			Common.ordersByDayRequest().done(function(datajson) {
				datajson.chartOrdersLabel.unshift('x');
				datajson.chartOrdersPosition.unshift('data1')
				datajson.chartOrdersValue.unshift('data2')
				datajson.gaTransactions.unshift('data3')

				var chartLines = c3.generate({
					bindto: '#orders-by-day',
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersPosition,
							datajson.chartOrdersValue,
							datajson.gaTransactions
						],
						names: {
							data1: 'Rank VTEX',
							data2: 'Pedido',
							data3: 'Pedidos GA',
						},
						types: {
							data1: 'area-spline',
							data2:'area-spline',
							data3: 'area-spline'
						},
						colors: {
							data1: Common._QD_color.vtex_ranks,
							data2: Common._QD_color.vtex_pedidos,
							data3: Common._QD_color.ga_pedidos
						},
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
		ordersByMonthChart: function() {
			Common.ordersByMonthRequest().done(function(datajson) {
				datajson.chartOrdersLabel.unshift('x');
				datajson.chartOrdersPosition.unshift('data1');
				datajson.chartOrdersValue.unshift('data2');
				datajson.gaTransactions.unshift('data3');
				datajson.chartOrdersValueInvoiced.unshift('data4');

				var chartCombination = c3.generate({
					bindto:'#orders-by-month',
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersPosition,
							datajson.chartOrdersValue,
							datajson.gaTransactions,
							datajson.chartOrdersValueInvoiced
						],
						names: {
							data1:'Rank VTEX',
							data2:'Pedidos',
							data3:'Pedidos GA',
							data4:'Pedidos Faturados'
						},
						type: 'bar',
						types: {
							data1: 'area-spline'
						},
						colors: {
							data1: Common._QD_color.vtex_ranks,
							data2: Common._QD_color.vtex_pedidos,
							data3: Common._QD_color.ga_pedidos,
							data4: Common._QD_color.vtex_pedidos_invoiced
						},
						labels:true
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
					grid: {
						x: {show: true },
						y: {show: true }
					}
				});
			});
		},
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
		ordersValueByMonthChart: function() {
			Common.ordersValueByMonthChartRequest().done(function(datajson) {
				datajson.chartOrdersLabel.unshift('x');
				datajson.chartOrdersValue.unshift('data1');
				datajson.gaTransactions.unshift('data2');
				datajson.chartInvoicedOrdersValue.unshift('data3');

				var chartLines = c3.generate({
					bindto: '#orders-value-by-month',
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersValue,
							datajson.gaTransactions,
							datajson.chartInvoicedOrdersValue
						],
						names: {
							data1:'Pedidos',
							data2:'Pedidos GA',
							data3:'Pedidos Faturados'
						},
						type: 'bar',
						colors: {
							data1:Common._QD_color.vtex_pedidos,
							data2:Common._QD_color.ga_pedidos,
							data3:Common._QD_color.vtex_pedidos_invoiced
						},
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
				        }, 
				        y: {
				        	tick: {
				                format: Tools.chartMonetaryFormatRoundedWithoutDecimal
				            }
				        }
				    },
				    tooltip: {
				    	format: {
				    		value: Tools.chartMonetaryFormat
						}
					}	
				});
			});
		},
		ordersValueByMonthChartRequest: function() {
			function padLeft(value, length) {
			    return (value.toString().length < length)? padLeft("0" + value, length): value;
			}

			var dateStartObject = new Date();
			dateStartObject.setDate(dateStartObject.getDate() - 365);
    		var dateStart = dateStartObject.getFullYear() + '-' + padLeft((dateStartObject.getMonth() + 1), 2) + '-' + padLeft(dateStartObject.getDate(), 2);

    		var dateEndObject = new Date();
    		var dateEnd = dateEndObject.getFullYear() + '-' + padLeft((dateEndObject.getMonth() + 1), 2) + '-' + padLeft(dateEndObject.getDate(), 2);

    		if(Common.ordersValueByMonthChartXHR)
    			return Common.ordersValueByMonthChartXHR;

			Common.ordersValueByMonthChartXHR = $.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders-value-by-month",
				dataType: "json",
				data: {
					store: Common._QD_query_string.store,
					dateStart: dateStart,
					dateEnd: dateEnd
				}
			});
			return Common.ordersValueByMonthChartXHR;
		},
		ordersByMonthMarkXFulfillmentChart: function() {
			Common.ordersValueByMonthChartRequest().done(function(datajson) {
				datajson.chartOrdersValueMarketplace.unshift('data1');
				datajson.chartOrdersValueFulfillment.unshift('data2');
				datajson.chartOrdersValue.unshift('data3');

				var chartLines = c3.generate({
					bindto: '#orders-by-month-mark-x-fulfillment',
					data: {
						x: 'x',
						columns: [
							datajson.chartOrdersLabel,
							datajson.chartOrdersValueMarketplace,
							datajson.chartOrdersValueFulfillment,
							datajson.chartOrdersValue
						],
						names: {
							data1:'Loja',
							data2:'Marketplace',
							data3:'Total'
						},
						type: 'bar',
						colors: {
							data1:Common._QD_color.vtex_orders_marktplace,
							data2:Common._QD_color.vtex_orders_fulfillment,
							data3:Common._QD_color.vtex_orders
						},
						labels: {
				            format: {
				                'Marketplace': Tools.chartMonetaryFormatRounded,
				                'Loja': Tools.chartMonetaryFormatRounded,
				                'Total': Tools.chartMonetaryFormatRounded,
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
				        }, 
				        y: {
				        	tick: {
				                format: Tools.chartMonetaryFormatRoundedWithoutDecimal
				            }
				        }
				    },
				    tooltip: {
				    	format: {
				    		value: Tools.chartMonetaryFormat
						}
					}	
				});

			});
		},
		ordersByDayPaymentType: function() {
			Common.ordersByDayRequest().done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersValuePaymentsType) {
					columns.push(new Array(i));
				} 
				
				for(var i in datajson.chartOrdersValueByPaymentType) {
					var index = 0;
					for(var j in datajson.chartOrdersValuePaymentsType) {
						var data = datajson.chartOrdersValueByPaymentType[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(0);	
						index++;
					} 
				}
				
				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: '#orders-by-day-payment-type',
					data: {
						x: 'x',
						columns:columns ,
						type: 'area-spline',
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
		ordersByMonthPaymentType: function() {
			Common.ordersByMonthRequest().done(function(datajson) {
				columns= [];
				for(var i in datajson.chartOrdersValuePaymentsType) {
					columns.push(new Array(i));
				} 
				
				for(var i in datajson.chartOrdersValueByPaymentType) {
					var index = 0;
					for(var j in datajson.chartOrdersValuePaymentsType) {
						var data = datajson.chartOrdersValueByPaymentType[i][j];
						if (data != undefined && data != null) 
							columns[index].push(data);	
						else
							columns[index].push(0);	
						index++;
					} 
				}
				
				columns.unshift(datajson.chartOrdersLabel);

				var chartLines = c3.generate({
					bindto: '#orders-by-month-payment-type',
					data: {
						x: 'x',
						columns:columns ,
						type: 'area-spline',
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