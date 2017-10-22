//'use strict';

angular.module('ambaya')
.controller('EncomendasConsultorController',[ '$scope', 'encomendasService', function($scope, encomendasService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $(document).ready(function(){
         $('ul.tabs').tabs();
     });
     $scope.status = ['Aprovada', 'Enviada'];
     $scope.filtroStatus = function(encomenda) {
         return ($scope.status.indexOf(encomenda.status) !== -1 && encomenda.item=='Personalizada');
     };
    $scope.encomendas = [];
    carregaEncomendas = function(){
        encomendasService.consultor($scope.usuario._id).then(
             function(response){
                 $scope.encomendas = response.data;
             },
             function(response){
                 Materialize.toas("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
             }
         );
    }
    carregaEncomendas();    
 }]);