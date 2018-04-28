//'use strict';

angular.module('ambaya')
.controller('ConsultoresControladoriaController',[ '$scope', 'consultoresService', function($scope, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $scope.status=['Pendente', 'Aprovado', 'Inativo'];
    $(document).ready(function(){
        $('ul.tabs').tabs();
    });
    $scope.filtroStatus = function(encomenda) {
        return ($scope.status.indexOf(encomenda.status) !== -1);
    };
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