//'use strict';

angular.module('ambaya')
.controller('EstoqueSupervisorController',[ '$scope', 'userService', 'estoqueService', function($scope, userService, estoqueService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $scope.geral = {};
    $scope.pecas = $scope.processaPecas($scope.usuario.estoque);


    //devolução de peças
     $('#enviar').modal();
     userService.estoqueId().then(
         function(response){
             $scope.estoqueId = response.data;
         },
         function(){
             Materialize.toast("Falha ao carregar dados, recarregue a página e tente novamente.", 5000, 'notificacaoRuim');
         }
     )
     $scope.modalEncomenda = function(){
        var aux;
         $scope.codigo = "AN";
         $scope.estoqueTemp = [];
         $scope.pecasEnviadas = [];
         $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);        
         $('#enviar').modal('open');
     }
     $scope.enviar = function(){
        estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
            function(response){
                estoqueService.entradaEstoque($scope.estoqueId, $scope.pecasEnviadas).then(
                    function(response){
                        Materialize.toast("Peças Devolvidas", 5000, 'notificacaoBoa');
                    },
                    function(response){
                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
            }
                )
            },
            function(response){
                Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
            }
        )
         $scope.usuario.estoque = [];
         $scope.usuario.estoque = $scope.usuario.estoque.concat($scope.estoqueTemp);
         $('#enviar').modal('close');
     } 
     $scope.enviado = function(codigo){
         indice = $scope.estoqueTemp.indexOf(codigo);
         cod = $scope.estoqueTemp[indice];
         $scope.deletaElemento($scope.estoqueTemp, indice);
         $scope.pecasEnviadas.push(cod);
     }
     $scope.devolvido = function(codigo){
         indice = $scope.pecasEnviadas.indexOf(codigo);
         cod = $scope.pecasEnviadas[indice];
         $scope.deletaElemento($scope.pecasEnviadas, indice);
         $scope.estoqueTemp.push(cod);
     }
     $scope.porItem = function(item) {
         var cod = item.substr(0,2);
         return ($scope.codigo === cod);
     };

 }]);