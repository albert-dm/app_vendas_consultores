//'use strict';

angular.module('ambaya')
.controller('IndicacoesConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
    $scope.carregaDados();
    $scope.indicados = [];
    $scope.indicados = ['teste'];
   /*  consultoresService.indicados($scope.usuario._id).then(                
        function(res){
            $scope.indicados = res.data;
        },
        function(res){
             Materialize.toast("Falha ao carregar indicados!", 5000, 'notificacaoRuim');
        }
    ); */
}]);