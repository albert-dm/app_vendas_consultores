//'use strict';

angular.module('ambaya')
.controller('EncomendasControladoriaController',[ '$scope', 'encomendasService', 'consultoresService', function($scope, encomendasService, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $(document).ready(function(){
         $('ul.tabs').tabs();
     });
     $scope.status = ['Pendente'];
     $scope.filtroStatus = function(encomenda) {
         return ($scope.status.indexOf(encomenda.status) !== -1);
     };
    $scope.encomendas = {};
    carregaEncomendas = function(){
        encomendasService.todas().then(
             function(response){
                 $scope.encomendas = response.data;
             },
             function(response){
                 Materialize.toas("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
             }
         );
    }
    carregaEncomendas();
    $scope.aprovar = function(id){
         encomendasService.atualizarStatus(id, "Aprovada").then(
             function(response) {
                 carregaEncomendas();
             },
             function(response) {
                 Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
             }
         )
     } 
     $scope.cancelar = function(id){
         encomendasService.atualizarStatus(id, "Cancelada").then(
             function(response) {
                 carregaEncomendas();
             },
             function(response) {
                 Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
             }
         )
     }        
 }]);