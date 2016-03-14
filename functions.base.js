/**
* Funções base
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7": "c","\u00e6": "ae","\u0153": "oe","\u00e1": "a","\u00e9": "e","\u00ed": "i","\u00f3": "o","\u00fa": "u","\u00e0": "a","\u00e8": "e","\u00ec": "i","\u00f2": "o","\u00f9": "u","\u00e4": "a","\u00eb": "e","\u00ef": "i","\u00f6": "o","\u00fc": "u","\u00ff": "y","\u00e2": "a","\u00ea": "e","\u00ee": "i","\u00f4": "o","\u00fb": "u","\u00e5": "a","\u00e3": "a","\u00f8": "o","\u00f5": "o",u: "u","\u00c1": "A","\u00c9": "E", "\u00cd": "I","\u00d3": "O","\u00da": "U","\u00ca": "E","\u00d4": "O","\u00dc": "U","\u00c3": "A","\u00d5": "O","\u00c0": "A","\u00c7": "C"};return this.replace(/[\u00e0-\u00fa]/ig,function(a){return"undefined"!=typeof b[a]?b[a]: a})});
Array.prototype.indexOf||(Array.prototype.indexOf=function(d,e){var a;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),b=c.length>>>0;if(0===b)return-1;a=+e||0;Infinity===Math.abs(a)&&(a=0);if(a>=b)return-1;for(a=Math.max(0<=a?a: b-Math.abs(a),0);a<b;){if(a in c&&c[a]===d)return a;a++}return-1});

try {
	var Common = {
		run: function() {
			Common._QD_restful_url = "http://dashboardapi.quatrodigital.com.br";
			Common._QD_restful_report_url = "http://dashboardapi.quatrodigital.com.br";

			Common.queryString();
			Common.checkAuthentication();
			
		},
		init: function() {
			if (!Common.logged())
				Common.loginModal();
			else {
				Common.analytics();
				Common.selectStore();
				Common.qdLinkAddLoja();

				if(Common._QD_query_string.store)
					Common.ordersChart();
			}
		},
		ajaxStop: function() {},
		windowOnload: function() {},
		analytics: function() {
			$.ajax({
				type: 'GET',
				headers: Common._QD_ajax_headers,
				url : Common._QD_restful_url + '/pvt/analytics/login', 
				data:Common._QD_ajax_headers,
				success: function(data) {
					if (!data.success) 
						window.open(data.link, "login", "width=600, height=480, resizable=0, scrollbars=0, status=0, toolbar=0");
				},
				error: function(data){
					
				}
			});
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
		ordersChart: function() {
			$.ajax({
				headers: Common._QD_ajax_headers,
				url: Common._QD_restful_report_url + "/pvt/report/orders-day",
				dataType: "json",
				data: {store: Common._QD_query_string.store}
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
					multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
					legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color: <%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
					responsive: true
				});

				$(canvas).addClass("loaded").before('<b>Loja:</b> ' + data.store + '<Br /><b>Período:</b> ' + data.startDate + ' até ' + data.endDate);
			});
		},
		loginModal: function() {
			var form = $('<form class="login"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label for="email">E-mail: </label> <input type="email" class="form-control" id="email" name="email" placeholder="E-mail" value=""> </div> </div> </div> <button type="submit" class="btn btn-primary btn-login">Login</button> </form>');
			var modal = Common.preparingModal({
				doNotClose: true,
				title: 'Informe seu e-mail',
				body: form
			});

			form.on('submit', function(e){
				e.preventDefault();

				form.find(".request-message").remove();
				form.append('<div class="pull-right request-message"> <span class="label label-warning">Aguarde, estamos processando os dados ...</span> </div>');

				$.ajax({
					type: 'POST',
					url : Common._QD_restful_url + '/get-token',
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
					url : Common._QD_restful_url + '/pvt/set-store',
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
				url : Common._QD_restful_url + '/pvt/get-stores',
				success: function(data) {
					for (var i in data.stores)
						ulLojas.append('<li><a href="?store='+data.stores[i].account+'">'+data.stores[i].account+'</a></li>');

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
catch (e) {(typeof console !== "undefined" && typeof console.error === "function" && $("body").addClass('jsFullLoaded jsFullLoadedError') && console.error("Houve um erro ao iniciar os objetos. Detalhes: " + e.message)); }