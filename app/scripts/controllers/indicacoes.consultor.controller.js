//'use strict';

angular.module('ambaya')
.controller('IndicacoesConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
    $scope.carregaDados();
    $scope.indicados = [];
    consultoresService.indicados($scope.usuario._id).then(                
        function(res){
            $scope.indicados = res.data;
            carregaAcertos(0);
        },
        function(res){
             Materialize.toast("Falha ao carregar indicados!", 5000, 'notificacaoRuim');
        }
    );

    carregaAcertos = function(i){
        if(i==$scope.indicados.length){
            return;
        }
        consultoresService.totalAcertos($scope.indicados[i]._id).then(                
            function(res){
                $scope.indicados[i].totalAcertos = res.data;
                carregaAcertos(i+1);
            },
            function(res){
                 Materialize.toast("Falha ao carregar acertos!", 5000, 'notificacaoRuim');
            }
        );
    }
}]);