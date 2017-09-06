//'use strict';

angular.module('ambaya')
.controller('SupervisorInicioController',[ '$scope', 'supervisoresService', 'consultoresService', function($scope, supervisoresService, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $scope.consultores = {};
    carregaConsultores = function(){
       consultoresService.porSupervisor($scope.usuario._id).then(
            function(response) {
                $scope.consultores = response.data;
                var consultores = {
                    total:0,
                    totalVendido: 0,
                    valorVendido: 0,
                    totalPecas: 0,
                    totalGanho: 0
                };
                for (var i=0; i<$scope.consultores.length; i++){
                    consultores.totalVendido += $scope.consultores[i].vendido.length;
                    consultores.valorVendido += $scope.consultores[i].totalVendido;
                    consultores.totalGanho += $scope.consultores[i].totalVendido*$scope.consultores[i].porcentagem/100;
                    consultores.totalPecas += $scope.consultores[i].estoque.length;
                    consultores.total++;
                }
                $scope.consultores = consultores;
            },
            function(response) {
                 Materialize.toast("Falha ao carregar consultores", 5000, 'notificacaoRuim');
            }
        );
   }
   carregaConsultores();
    
}]);