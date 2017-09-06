//'use strict';

angular.module('ambaya')
.controller('ConsultoresControladoriaController',[ '$scope', 'consultoresService', function($scope, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    consultoresService.todos().then(
            function(response) {
                $scope.consultores = response.data;
                $scope.total = $scope.consultores.length; 
            },
            function(response) {
                    Materialize.toast("Falha ao carregar Consultores", 5000, 'notificacaoRuim');
            }
    );
}]);