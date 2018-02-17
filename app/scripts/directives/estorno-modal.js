angular.module('ambaya')
.directive('estornoModal', ['pecasService', 'consultoresService', function(pecasService, consultoresService){
    return{
        restrict: 'E',
        template:'<div id="estorno" class="modal">'+
                    '<div class="modal-content">'+
                        '<h4>Estorno de venda</h4>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Peças estornadas</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in estornoPecas | orderBy:\'-valor\'">'+
                                   ' <span class="badge">'+
                                        '<a class="clicavel textoVermelho" ng-click="excluirEstorno(peca)">'+
                                                '<i class="material-icons">highlight_off</i>'+
                                        '</a>'+
                                    '</span>'+
                                    '<div class="row"><span class="col s2">{{peca.quantidade}}</span><span class="col s3">{{peca.tipo.label}}</span><span class="col s2">{{peca.valor | currency: \'R$\'}}</span></div>'+
                            '</li>'+
                           ' <li class="collection-item">'+
                                '<form  ng-submit="addPecas($event)" class="addPeca row">'+
                                    '<select style="display:block" ng-model="pecaEstornoTipo" class="col m3 s12" ng-change="carregaConsultores()" ng-options="item as item.label for item in opcoes" required>'+
                                            '<option value="" disabled selected>Peça</option>'+
                                            /* '<option ng-repeat="opcao in opcoes" value="{{opcao.label}}">{{opcao.label}}</option>'+ */
                                    '</select>'+
                                    '<input ng-model="pecaEstornoValor" class="col m3 s12 preco" type="number" min=1 max=999 maxlength="10" name="preco" placeholder="Preço" required>'+
                                    '<input ng-model="pecaEstornoQuantidade" class="col m3 s12 quantidade" type="number" min=1 maxlength="10" name="quantidade" placeholder="Quantidade" required>'+
                                   ' <input type="submit" class="btn-floating btn waves-effect waves-light botaoAmarelo right" value="+"></input>'+
                                '</form>'+
                            '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<input class="waves-effect waves-green btn-flat" type="submit" form="formEstorno" ng-click="estorno()" value="Pronto!" ng-disabled="estornoPecas.length==0"/>'+
                        '<a class="modal-close waves-effect waves-red btn-flat" >Cancelar</a>'+
                    '</div>'+
                '</div>',
        link: function(scope){
            scope.estornoPecas = [];
            scope.opcoes = pecasService.opcoesPecas;
            scope.addPecas = function(e){
                e.preventDefault();
                scope.estornoPecas.push({tipo: scope.pecaEstornoTipo, valor:scope.pecaEstornoValor, quantidade:scope.pecaEstornoQuantidade});
            }
            scope.excluirEstorno = function(peca){
                var idx = scope.estornoPecas.indexOf(peca);
                console.log(idx);
                scope.estornoPecas.splice(idx, 1);
            }
            scope.estorno = function(){
                console.log(scope.estornoPecas);
                var consultorTemp = angular.copy(scope.consultor);
                var cod = "";
                var preco = "";
                var estornoLista = [];
                for(var i=0; i<scope.estornoPecas.length; i++){
                    cod = scope.estornoPecas[i].tipo.val;
                    preco = scope.estornoPecas[i].valor.toString();
                    if(preco.length == 2) preco = "0"+preco;
                    for(var j=0; j<scope.estornoPecas[i].quantidade; j++){
                        estornoLista.push(cod+preco);
                    }
                }
                console.log(scope.consultor);
                var encontrado = false;
                var estornoOk = true;
                for(i=0; i<estornoLista.length; i++){
                    encontrado = false;
                    var precoPeca = pecasService.extraiPreco(estornoLista[i]);
                    var codPeca = pecasService.extraiCod(estornoLista[i]);
                    for(j=0; j<scope.consultor.vendido.length; j++){
                        if(precoPeca=== pecasService.extraiPreco(scope.consultor.vendido[j]) && codPeca === pecasService.extraiCod(scope.consultor.vendido[j])){
                            scope.consultor.estoque.push(scope.consultor.vendido[j])
                            scope.consultor.vendido.splice(j, 1);
                            scope.consultor.totalVendido -= Number(precoPeca);
                            console.log(scope.consultor.vendido);
                            encontrado = true;
                            break;
                        }
                    }
                    if (encontrado == false){
                        Materialize.toast(estornoLista[i]+" não encontrado!", 10000, 'notificacaoRuim');
                        estornoOk = false;
                    }
                }
                if(estornoOk){
                    consultoresService.estorno(scope.consultor, scope.estornoLista, scope.consultor._id).then(
                        function(response){
                            Materialize.toast("Estorno realizado com sucesso!", 5000, 'notificacaoBoa');
                            scope.estornoPecas = [];
                            $('#estorno').modal('close');
                        },
                        function(err){
                            Materialize.toast("Falha ao realizar estorno!", 5000, 'notificacaoRuim');
                            scope.consultor = consultorTemp;
                        }
                    ); 
                } else {
                    Materialize.toast("Falha ao realizar estorno!", 5000, 'notificacaoRuim');
                    scope.consultor = consultorTemp;
                }

                /* */
            }
        }
    }
}]);