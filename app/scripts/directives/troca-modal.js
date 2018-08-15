angular.module('ambaya')
	.directive('trocaModal', ['pecasService', 'consultoresService', function (pecasService, consultoresService) {
		return {
			restrict: 'E',
			template: '<div id="troca" class="modal">' +
				'<div class="modal-content center-align">' +
				'<form ng-submit="trocaPeca()" id="trocaForm">' +
				'<div class="input-field col m8 s12 offset-m2">' +
				'<input placeholder="Peça com defeito" id="codigoDefeito" type="text" ng-model="troca.pecaDefeito" style="text-transform:uppercase"				 pattern="[A-Za-z]{2}[0-9]{3,6}" title="Código inválido" required>' +
				'<input placeholder="Peça nova" id="codigoNova" type="text" ng-model="troca.pecaNova" style="text-transform:uppercase" pattern="[A-Za-z]{2}[0-9]{3,6}" title="Código inválido" required>' +
				'</div>' +
				'<div class="input-field">' +
				'<select id="defeito" ng-model="troca.defeito" required>' +
				'<option value="" disabled selected>Qual é o defeito?</option>' +
				'<option value="Banho">Banho</option>' +
				'<option value="Bruto">Bruto</option>' +
				'</select>' +
				'</div>' +
				'<div class="input-field col m8 s12 offset-m2">' +
				'<input placeholder="Observações (opcional)" type="text" ng-model="troca.obs">' +
				'</div>' +

				'<div class="row" ng-show="saldo()">' +
				'<div class="col s12 m4 offset-m4">' +
				'<div class="card-panel yellow">' +
				'<span class="black-text">' +
				'Necessário pagamento de mais {{saldo() | currency:"R$"}}' +
				'</span>' +
				'</div>' +
				'</div>' +
				'</div>' +

				'<button type="submit" class="btn-floating btn-large waves-effect waves-light botaoAmarelo">' +
				'<i class="material-icons">import_export</i>' +
				'</button>' +
				'</form>' +
				'</div>' +
				'</div>',
			link: function(scope){
				scope.trocaPeca = function(){
					scope.troca.consultorId = scope.usuario._id;
					scope.troca.consultorNome = scope.usuario.nome;
					var estoqueTemp = [];
					var estoqueTemp = estoqueTemp.concat(scope.usuario.estoque);
					var encontrado = false;
					var cod = scope.troca.pecaNova.toUpperCase();
					var codDefeito = scope.troca.pecaDefeito.toUpperCase();
					var encontrado = false;
					var precoAdd = scope.extraiPreco(cod);
					var codAdd = scope.extraiCod(cod);
					scope.troca.saldo = scope.saldo()
					for (var j=0; j<scope.usuario.estoque.length; j++){
						if(precoAdd=== scope.extraiPreco(scope.usuario.estoque[j]) && codAdd === scope.extraiCod(scope.usuario.estoque[j])){
							scope.deletaElemento(scope.usuario.estoque, j);
							encontrado = true;
							break;
						}
					}
					if (encontrado == false){
						Materialize.toast(cod+" não encontrado!", 10000, 'notificacaoRuim');
						scope.usuario.estoque = estoqueTemp;
					}else{
						console.log(scope.troca);
						consultoresService.atualizaEstoque(scope.usuario).then(
							function(res){
								consultoresService.troca(scope.troca).then(
									function(res){
										if(scope.troca.saldo) scope.usuario.totalVendido = scope.usuario.totalVendido + scope.troca.saldo;
										scope.troca = {};
										$('#troca').modal('close');
										Materialize.toast("Troca registrada com sucesso!", 5000, 'notificacaoBoa');
									},
									function(res){
										Materialize.toast("Falha ao registrar troca!", 5000, 'notificacaoRuim');
									}
								);
							},
							function(res){
								scope.usuario.estoque = estoqueTemp;
								Materialize.toast("Falha ao atualizar estoque!", 5000, 'notificacaoRuim');
							}
						);                   
					}
				}
				scope.saldo = function(){
					if(!scope.troca.pecaNova || !scope.troca.pecaDefeito) return "";
					var saldo = scope.extraiPreco(scope.troca.pecaNova) - scope.extraiPreco(scope.troca.pecaDefeito);
					return saldo>0 ? saldo : 0;
				} 
			}
		}
	}
]);