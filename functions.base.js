/**
* Funções base
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7":"c","\u00e6":"ae","\u0153":"oe","\u00e1":"a","\u00e9":"e","\u00ed":"i","\u00f3":"o","\u00fa":"u","\u00e0":"a","\u00e8":"e","\u00ec":"i","\u00f2":"o","\u00f9":"u","\u00e4":"a","\u00eb":"e","\u00ef":"i","\u00f6":"o","\u00fc":"u","\u00ff":"y","\u00e2":"a","\u00ea":"e","\u00ee":"i","\u00f4":"o","\u00fb":"u","\u00e5":"a","\u00e3":"a","\u00f8":"o","\u00f5":"o",u:"u","\u00c1":"A","\u00c9":"E", "\u00cd":"I","\u00d3":"O","\u00da":"U","\u00ca":"E","\u00d4":"O","\u00dc":"U","\u00c3":"A","\u00d5":"O","\u00c0":"A","\u00c7":"C"};return this.replace(/[\u00e0-\u00fa]/ig,function(a){return"undefined"!=typeof b[a]?b[a]:a})});
Array.prototype.indexOf||(Array.prototype.indexOf=function(d,e){var a;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),b=c.length>>>0;if(0===b)return-1;a=+e||0;Infinity===Math.abs(a)&&(a=0);if(a>=b)return-1;for(a=Math.max(0<=a?a:b-Math.abs(a),0);a<b;){if(a in c&&c[a]===d)return a;a++}return-1});

try {
	var Common = {
		run: function() {},
		init: function() {
			if (!Common.logged()) 
				Common.loginModal();
			else
				Common.ordersChart();
		},
		ajaxStop: function() {},
		windowOnload: function() {},
		logged:function() {
			if ($.cookie('qdToken')) 
				return true;
			return false;
		},
		ordersChart: function() {
			$.ajax({
				url: "http://dashboardapi.quatrodigital.com.br/orders-day",
				dataType: "json"
			}).done(function(data) {
				var chartData = {
					labels: data.chartOrdersLabel,
					datasets: [
					{
						label: "Pedidos",
						fillColor: "rgba(1, 112, 0, 0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "#014200",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: data.chartOrdersValue
					},
					{
						label: "Rank",
						fillColor: "rgba(151,187,205,0.2)",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
						data: data.chartOrdersPosition
					}
					]
				};

				var canvas = document.getElementById("orders-chart");
				var myNewChart = new Chart(canvas.getContext("2d")).Line(chartData, {
					tooltipTemplate: "<%if (label){%><%=label%>: s<%}%>b<%= value %>s",
					legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
					responsive: true
				});

				$(canvas).addClass("loaded").before('Período: ' + data.startDate + ' até ' + data.endDate + '');
			});
		}, 
		loginModal: function() {
			var elemModal = $('.modal-qd-v1').clone().appendTo(document.body);
			elemModal.removeClass('modal-qd-v1'); 
			elemModal.find('.modal-title').text('Informe seu e-mail');
			elemModal.find('.modal-body').html('<form class="login"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label for="email">E-mail:</label> <input type="email" class="form-control" id="email" name="email" placeholder="E-mail" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-login">Login</button> </form>');
			elemModal.modal({backdrop: 'static', keyboard: false });
			elemModal.on('hidden.bs.modal', function () { elemModal.remove(); });

			elemModal.find('form.login').on('submit', function(e){
				e.preventDefault();

				$.ajax({
					type: 'POST',
					url : 'http://dashboardapi.quatrodigital.com.br/get-token',
					data: {
						email:elemModal.find('input#email').val()
					},
					beforeSend:function() {
						elemModal.find('.modal-body form .pull-right').remove();	
						elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-warning">Aguarde, estamos processando os dados</span> </div>');
					},
					success:function(data) {
						elemModal.find('.modal-body form .pull-right').remove();	
						if (data.success) {
							elemModal.modal('hide');
							Common.checkToken(data.qdToken);
						} else {
							elemModal.find('.modal-body form form').append('<div class="pull-right"> <span class="label label-danger">Não foi possivel efetuar o login </span> </div>');
						}
					},
					error: function(data){
						elemModal.find('.modal-body form .pull-right').remove();	
						elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-danger">Não foi possivel efetuar o login </span> </div>');
					}
				});
			}); 
		},
		checkToken: function(qdToken) { 
			var elemModal = $('.modal-qd-v1').clone().appendTo(document.body);
			elemModal.removeClass('modal-qd-v1');
			elemModal.find('.modal-title').text('Informe a chave de acesso');
			elemModal.find('.modal-body').html('<form class="checkToken"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label for="email">Chave de acesso com 4 dígitos:</label> <input type="tel" class="form-control" id="token" name="token" placeholder="Token" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-validate-token">validar</button> </form>');
			elemModal.modal({backdrop: 'static', keyboard: false });
			elemModal.on('hidden.bs.modal', function () { elemModal.remove(); });

			elemModal.find('form.checkToken').on('submit', function(e){
				e.preventDefault();
				$.ajax({
					type: 'GET',
					url : 'http://dashboardapi.quatrodigital.com.br/token-validate',
					data: {
						token: elemModal.find('input#token').val(),
						qdToken: qdToken
					},
					beforeSend:function() {
						elemModal.find('.modal-body form .pull-right').remove();	
						elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-warning">Aguarde, estamos processando os dados</span> </div>');
					},
					success:function(data) {
						elemModal.find('.modal-body form .pull-right').remove();	
						if (data.success) {
							if (!data.hasStores) {
								elemModal.modal('hide');
								Common.messageUserLogged(qdToken);
							}
							else 
								window.location.reload();
								$.cookie('qdToken', qdToken, { path: "/" });
								$.ajaxSetup({
				            		headers: { 'x-qd-token': qdToken },
				                });
						} else {
							$.removeCookie('qdToken');
							elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-danger">Não foi possivel validar o token </span> </div>');
						}
					},
					error: function(data){
						console.log(data);
						elemModal.find('.modal-body form .pull-right').remove();	
						elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-danger">Não foi possivel validar o token </span> </div>');
					}
				});
			});
		},
		messageUserLogged: function(qdToken) { 
			var elemModal = $('.modal-qd-v1').clone().appendTo(document.body);
			elemModal.removeClass('modal-qd-v1');
			elemModal.find('.modal-title').text('Parabens!');
			elemModal.find('.modal-body').html('Você está logado, mais ainda não possui um store, cadastre uma agora mesmo. <br /><br /><button type="button" class="btn btn-primary btn-validate-token">cadastrar</button>');
			elemModal.modal({backdrop: 'static', keyboard: false });
			elemModal.on('hidden.bs.modal', function () { elemModal.remove(); });

			elemModal.find('.btn-validate-token').on('click', function(){
				elemModal.modal('hide');
				Common.setStore(qdToken);
			}); 
		},
		setStore: function(qdToken) {
			var elemModal = $('.modal-qd-v1').clone().appendTo(document.body);
			elemModal.removeClass('modal-qd-v1');
			elemModal.find('.modal-title').text('Informe os dados da instituição');
			elemModal.find('.modal-body').html('<form class="cadastro"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label for="account">Account</label> <input type="text" class="form-control" id="account" name="account" placeholder="Account" value=""> </div> </div> <div class="col-xs-12"> <div class="form-group"> <label for="key">Key</label> <input type="text" class="form-control" id="key" name="key" placeholder="Key" value=""> </div> </div> <div class="col-xs-12"> <div class="form-group"> <label for="token">Token</label> <input type="text" class="form-control" id="token" name="token" placeholder="Token" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-login">cadastrar</button> </form>'); 
			elemModal.modal({backdrop: 'static', keyboard: false });
			elemModal.on('hidden.bs.modal', function () { elemModal.remove(); });

			elemModal.find('form.cadastro').on('submit', function(e){
				e.preventDefault();

				$.ajax({ 
					type: 'POST',
					url : 'http://dashboardapi.quatrodigital.com.br/set-store',
					data: {
						qdToken:qdToken,
						account:elemModal.find('input#account').val(),
						key:elemModal.find('input#key').val(),
						token:elemModal.find('input#token').val()
					},
					beforeSend:function() {
						elemModal.find('.modal-body form .pull-right').remove();	
						elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-warning">Aguarde, estamos processando os dados</span> </div>');
					},
					success:function(data) {
						console.log(data);
						elemModal.find('.modal-body form .pull-right').remove();	
						if (data.success) {
							elemModal.modal('hide');
							Common.messageSetStoreSaved(qdToken);
						} else {
							elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-danger">Não foi possivel validar o token </span> </div>');
						}
					},
					error: function(data){
						console.log( data );
						elemModal.find('.modal-body form .pull-right').remove();	
						elemModal.find('.modal-body form').append('<div class="pull-right"> <span class="label label-danger">Não foi possivel validar o token </span> </div>');
					}
				});
			});
		},
		messageSetStoreSaved: function(qdToken) { 
			var elemModal = $('.modal-qd-v1').clone().appendTo(document.body);
			elemModal.removeClass('modal-qd-v1');
			elemModal.find('.modal-title').text('Parabens!');
			elemModal.find('.modal-body').html('Você completou a faze de login e cadastro de stores , ver relatório . <br /><br /><button type="button" class="btn btn-primary btn-fim">fim</button>');
			elemModal.modal({backdrop: 'static', keyboard: false });
			elemModal.on('hidden.bs.modal', function () { elemModal.remove(); });
			$.cookie('qdToken', token, { path: "/" });
			$.ajaxSetup({
				headers: { 'x-qd-token': qdToken },
			});
			elemModal.find('.btn-fim').on('click', function(){
				window.location.reload();
			}); 
		},
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
catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && $("body").addClass('jsFullLoaded jsFullLoadedError') && console.error("Houve um erro ao iniciar os objetos. Detalhes: " + e.message)); }