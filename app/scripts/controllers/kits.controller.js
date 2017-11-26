//'use strict';

angular.module('ambaya')
.controller('KitsController',[ 
    '$scope', 
    'supervisoresService', 
    'consultoresService', 
    function(
        $scope, 
        supervisoresService,
        consultoresService
    ){
    $scope.carregaDados();
    $scope.consultores = [];
    $scope.selectedSupervisor = "";
    $scope.selectedConsultor = "";
    $scope.estoqueTemp = $scope.usuario.estoque;
    $scope.kit = {
        pecas: [],
        consultora: "",
        valor: ""
    }
    $scope.pecas = $scope.processaPecas($scope.kit.pecas);
    $scope.acao = "Novo";
    $scope.kits = [
        {consultora: "Consultora", createdAt: "10/10/2017"},
        {consultora: "Consultora 2", createdAt: "10/10/2017"},
        {consultora: "Consultora 3", createdAt: "10/10/2017"},
        {consultora: "Consultora 4", createdAt: "10/10/2017"},
        {consultora: "Consultora 5", createdAt: "10/10/2017"},
        {consultora: "Consultora 6", createdAt: "10/10/2017"}
    ];

    $scope.addPeca= function(event, cod){
        var pre = '';
        var indice = '';
        var form = angular.element(event.target);
        var preco = form.find('.preco')[0].value;
        var quantidade = form.find('.quantidade')[0].value;
        if(preco.length==1) pre = "00"
        else if (preco.length==2) pre = "0";
        var codigo = cod+pre+preco;
        for(var i=0; i<quantidade; i++)
            
            $scope.kit.pecas.push(codigo);
        $scope.pecas = $scope.processaPecas($scope.kit.pecas);
        var preco = form.find('.preco')[0].value = "";
        var quantidade = form.find('.quantidade')[0].value = "";
    };

    $scope.excluir = function(cod){
        console.log(cod);
    }

    supervisoresService.todos().then(
        function(response){
            $scope.supervisores = response.data;
        },
        function(response){
            Materialize.toast("Falha ao carregar supervisores", 5000, 'notificacaoRuim');
        }
    );

    $scope.carregaConsultores = function(){
        consultoresService.porSupervisor($scope.selectedSupervisor).then(
            function(response){
                $scope.consultores = response.data;
            },
            function(response){
                Materialize.toast("Falha ao carregar consultores", 5000, 'notificacaoRuim');
            }
        );
    }

}]);