//'use strict';

angular.module('ambaya')
.controller('EncomendasSupervisorController',[ '$scope', 'encomendasService', 'consultoresService', function($scope, encomendasService, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $scope.form = {
         "item":"",
         "quantidade":"",
         "donoNome":$scope.usuario.nome,
         "donoId": $scope.usuario._id
     };
     $(document).ready(function(){
         $('ul.tabs').tabs();
     });
     $scope.status = ['Aprovada', 'Enviada', 'Pendente', 'Cancelada'];
     $scope.filtroStatus = function(encomenda) {
         return ($scope.status.indexOf(encomenda.status) !== -1);
     };
    $scope.encomendas = {};
    carregaEncomendas = function(){
        console.log("carregando");
        encomendasService.supervisor($scope.usuario._id).then(
             function(response){
                 $scope.encomendas = response.data;
             },
             function(response){
                 Materialize.toas("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
             }
         );
    }
    carregaEncomendas();
    consultoresService.porSupervisor($scope.usuario._id).then(
         function(response) {
             $scope.consultores = response.data;
         },
         function(response) {
                 Materialize.toast("Falha ao carregar consultores", 5000, 'notificacaoRuim');
         }
     );
     
     $('#adicionar').modal();
     $scope.add = function(){
         $('select').material_select();
         $('#adicionar').modal('open');
     }
     $scope.novo = function(){
         encomendasService.nova($scope.form).then(
             function(response) {
                 Materialize.toast("Encomenda adicionada com sucesso!", 5000, 'notificacaoBoa');
                 $('#adicionar').modal('close');
                 $scope.form = {
                     "item":"",
                     "quantidade":"",
                     "donoNome":$scope.usuario.nome,
                     "donoId": $scope.usuario._id
                 };
                 carregaEncomendas();
             },
             function(response) {
                 Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
             }
         );                
     };
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