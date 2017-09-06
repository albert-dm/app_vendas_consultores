//'use strict';

angular.module('ambaya')
.controller('HistoricoConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $scope.acertos = {};
    $scope.vendidoAno = 0;
    hoje = new Date();
    consultoresService.historico($scope.usuario._id).then(                
        function(res){
            $scope.acertos = res.data;
            for(i=0; i< $scope.acertos.length; i++){
                dia = new Date($scope.acertos[i].createdAt);
                if(hoje.getFullYear() === dia.getFullYear())
                    $scope.vendidoAno+=$scope.acertos[i].valor;
            }
        },
        function(res){
             Materialize.toast("Falha ao carregar histórico!", 5000, 'notificacaoRuim');
        }
    );
}]);