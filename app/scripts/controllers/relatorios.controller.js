//'use strict';

angular.module('ambaya')
.controller('RelatoriosController',[ 
    '$scope',
    'acertosService',
    'dataService',
    'pecasService',
    'consultoresService',
    'supervisoresService',
    function(
        $scope, 
        acertosService,
        dataService,
        pecasService,
        consultoresService,
        supervisoresService
    ){
    $scope.pecasTotais = [];
    $scope.consultores = [];
    $scope.supervisores = [];    
    $scope.meses = [];
    $scope.acertos = [];

    $scope.filtroConsultores = [];
    $scope.filtroSupervisores = [];    
    $scope.filtroMeses = [];

    var carregaAcertos = function(){
        acertosService.todos().then(
            function(response){
                $scope.acertos = response.data;
                $scope.meses = $scope.acertos.reduce(function(res, acerto){
                    var date = new Date(acerto.createdAt).getMonth();
                    date  = dataService.nomeMes(date);
                    if(!res[date])
                        res[date] = [];
                    for(var i = 0; i<acerto.pecas.length; i++){
                        $scope.pecasTotais.push(acerto.pecas[i]);
                        res[date].push(acerto.pecas[i]);
                    }
                    return res;
                }, Object.create(null));
                /* for(data in $scope.meses){
                    valores.push({label:data, value:$scope.acertos[data]});
                } */

            },
            function(response){
                Materialize.toast("Falha ao carregar Acertos", 5000, 'notificacaoRuim');
            }
        );
    }

    var carregaSupervisores = function(){
        supervisoresService.todos().then(
            function(response) {
                $scope.supervisores = response.data;
            },
            function(response) {
                Materialize.toast("Falha ao carregar supervisores!", 5000, 'notificacaoRuim');
            }
        );
    }

    var carregaConsultores = function(){
        consultoresService.todos().then(
            function(response) {
                $scope.consultores = response.data;
            },
            function(response) {
                    Materialize.toast("Falha ao carregar Consultores", 5000, 'notificacaoRuim');
            }
        );
    }

    $('.collapsible').collapsible();
    carregaAcertos();
    carregaConsultores();
    carregaSupervisores();


}]);