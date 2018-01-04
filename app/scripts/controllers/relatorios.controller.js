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
    $scope.acertosFiltrados = '';
    $scope.consultoresFiltrados = [];

    var carregaAcertos = function(){
        acertosService.todos().then(
            function(response){
                $scope.acertos = response.data;
                $scope.acertos = $scope.acertos.map(function(acerto){
                    var mes = new Date(acerto.createdAt).getMonth();
                    var ano = new Date(acerto.createdAt).getFullYear();
                    mes  = dataService.nomeMes(mes);
                    acerto.data = mes+'/'+ano;
                    if($scope.meses.indexOf(acerto.data)==-1){
                        $scope.meses.push(acerto.data);
                    }
                    return acerto;
                });
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

    $scope.toggleCheck = function(valor, vetor){
        if (vetor.indexOf(valor) === -1) {
            vetor.push(valor);
        } else {
            vetor.splice(vetor.indexOf(valor), 1);
        }
    }

    var processaAcertos = function(){
        var processados;
        var consultores = $scope.filtroConsultores.map(function(consultor){
            return consultor._id;
        });
        $scope.pecasTotais = [];
        processados = $scope.acertos.reduce(function(res, acerto){
            var consultorIdx = consultores.indexOf(acerto.userId);
            if($scope.filtroMeses.indexOf(acerto.data)!=-1 && consultorIdx!=-1){
                if(!res[acerto.userId])
                    res[acerto.userId] = {
                        pecas: [],
                        consultor: $scope.filtroConsultores[consultorIdx]
                    };
                for(var i = 0; i<acerto.pecas.length; i++){
                    $scope.pecasTotais.push(acerto.pecas[i]);
                    res[acerto.userId].pecas.push(acerto.pecas[i]);
                }
            }            
            return res;
        }, Object.create(null));
        return processados;
    }

    $scope.$watchCollection('filtroSupervisores',
        function(newValue, oldValue){
            if(!newValue) return;
            if(newValue==[]){
                $scope.consultoresFiltrados = [];
                $scope.filtroConsultores = [];
            }
            var supervisores = newValue.map(function(supervisor){
                return supervisor._id;
            });
            console.log(supervisores);
            $scope.consultoresFiltrados = [];
            for(var i=0; i<$scope.consultores.length; i++){
                if(supervisores.indexOf($scope.consultores[i].supervisor._id)!=-1)
                $scope.consultoresFiltrados.push($scope.consultores[i]);
            }
            for(var j=0; j<$scope.filtroConsultores.length; j++){
                if(supervisores.indexOf($scope.filtroConsultores[i].supervisor._id)==-1)
                delete $scope.filtroConsultores[i];
            }
        }            
    );

    $scope.filtra = function(){
        $scope.acertosFiltrados = processaAcertos();
    }

    $('.collapsible').collapsible();
    carregaAcertos();
    carregaConsultores();
    carregaSupervisores();


}]);