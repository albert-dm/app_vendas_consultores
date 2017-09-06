//'use strict';

angular.module('ambaya')
.controller('EncomendasEstoqueController',[ '$scope', 'encomendasService', 'consultoresService', 'userService', 'estoqueService', function($scope, encomendasService, consultoresService, userService, estoqueService){
    $scope.carregaDados();
    $(document).ready(function(){
         $('ul.tabs').tabs();
         $('.collapsible').collapsible();
     });
     $('#enviar').modal();
     $scope.status = ['Aprovada'];
     $scope.codigo = ['BG'];
     $scope.estoqueTemp = [];
     $scope.filtroStatus = function(encomenda) {
         return ($scope.status.indexOf(encomenda.status) !== -1);
     };
     $scope.porItem = function(item) {
         var cod = item.substr(0,2);
         return ($scope.codigo.indexOf(cod) !== -1);
     };
    $scope.encomendas = {};
    carregaEncomendas = function(){
        encomendasService.todas().then(
             function(response){
                 $scope.encomendas = response.data;
                 $('.tooltipped').tooltip({delay: 50});
             },
             function(response){
                 Materialize.toast("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
             }
         );
    }
    carregaEncomendas();
    $scope.modalEncomenda = function(encomenda){
        var aux;
        switch(encomenda.item){
             case "Anel":
                 $scope.codigo = ['AN'];
                 break;
             case "Brinco Pequeno":
                 $scope.codigo = ['BP'];
                 break;
             case "Brinco Grande":
                 $scope.codigo = ['BG'];
                 break;
             case "Cordão Feminino":
                 $scope.codigo = ['CF'];
                 break;
             case "Cordão Masculino":
                 $scope.codigo = ['CM'];
                 break;
             case "Pingente":
                 $scope.codigo = ['PN'];
                 break;
             case "Pulseira Feminina":
                 $scope.codigo = ['PF'];
                 break;
             case "Pulseira Masculina":
                 $scope.codigo = ['PM'];
                 break;
             case "Tornozeleira":
                 $scope.codigo = ['TZ'];
                 break;
             case "Escapulário":
                 $scope.codigo = ['ES'];
                 break;
             case "Personalizada":
                 $scope.codigo = ['PZ'];
                 break;
             case "Reposição padrão":
                 $scope.codigo = ['AN', 'BP', 'BG', 'CF', 'CM', 'PN', 'PF', 'PM', 'ES', 'TZ', 'PZ'];
                 break;
        }
         
         $scope.encomendaAtual = encomenda;
         $scope.estoqueTemp = [];
         $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);    
         console.log($scope.usuario.estoque);            
         $scope.pecasEnviadas = [];
         $('#enviar').modal('open');
     }
    $scope.enviar = function(){
        estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
            function(response){
                estoqueService.entradaEstoque($scope.encomendaAtual.donoId, $scope.pecasEnviadas).then(
                    function(response){
                        encomendasService.atualizarStatus($scope.encomendaAtual._id, "Enviada", $scope.pecasEnviadas).then(
                             function(response) {
                                 Materialize.toast("Enviada!", 5000, 'notificacaoBoa');
                                 carregaEncomendas();
                             },
                             function(response) {
                                 Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                             }
                         )
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
     
        
 }]);