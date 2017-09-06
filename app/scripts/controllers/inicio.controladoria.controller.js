//'use strict';

angular.module('ambaya')
.controller('ControladoriaInicioController',[ '$scope', 'controladoriaService', function($scope, controladoriaService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    controladoriaService.consultores().then(
            function(response) {
                $scope.consultores=response.data;
            },
            function(response) {
                Materialize.toast("Falha ao carregar Consultores", 5000, 'notificacaoRuim');
            }
    );
    controladoriaService.supervisores().then(
            function(response) {
                $scope.supervisores=response.data;
            },
            function(response) {
               Materialize.toast("Falha ao carregar Supervisores", 5000, 'notificacaoRuim');
            }
    );
}]);