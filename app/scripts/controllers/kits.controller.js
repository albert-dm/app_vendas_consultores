//'use strict';

angular.module('ambaya')
.controller('KitsController',[ 
    '$scope',
    '$location',
    '$anchorScroll',
    'estoqueService', 
    'supervisoresService', 
    'consultoresService',
    'kitsService',
    function(
        $scope, 
        $location,
        $anchorScroll,
        estoqueService,
        supervisoresService,
        consultoresService,
        kitsService
    ){
    $scope.carregaDados();
    $scope.consultores = [];
    $scope.selectedSupervisor = "";
    $scope.selectedConsultor = "";
    $scope.consultora = "";
    $scope.estoqueTemp = angular.copy($scope.usuario.estoque);
    kitVazio = {
        pecas: [],
        consultora: "",
        valor: 0
    }
    $scope.kitAtual = angular.copy(kitVazio);
    $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas);
    $scope.acao = "Novo";

    $scope.addPeca= function(event, cod){
        var transferindo = [];
        var pre = '';
        var indice = '';
        var form = angular.element(event.target);
        var preco = form.find('.preco')[0].value;
        var quantidade = form.find('.quantidade')[0].value;
        if(preco.length==1){
            pre = "00";
        }
        else if (preco.length==2) pre = "0";
        var codigo = cod+pre+preco;
        for (var j=0; j<$scope.estoqueTemp.length; j++){
            if(pre+preco == $scope.extraiPreco($scope.estoqueTemp[j]) && cod == $scope.extraiCod($scope.estoqueTemp[j])){
                transferindo.push($scope.estoqueTemp[j]);
            }
        }
        if(quantidade<=transferindo.length){
            for(var i=0; i<quantidade; i++){
                $scope.kitAtual.pecas.push(codigo);
                $scope.estoqueTemp.splice($scope.estoqueTemp.indexOf(transferindo[i]), 1);

            }
            $scope.kitAtual.valor = $scope.kitAtual.valor + quantidade*preco;
            $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas);
        }
        else{
            Materialize.toast("Não há peças suficientes!</br>Apenas "+ transferindo.length+" encontrada(s).", 5000, 'notificacaoRuim');
        }
        //preco = "";
        quantidade = "";
    };

    $scope.excluir = function(peca, cod){
        var transferindo = [];
        for (var j=0; j<$scope.estoqueTemp.length; j++){
            if(peca.val == $scope.extraiPreco($scope.estoqueTemp[j]) && cod == $scope.extraiCod($scope.estoqueTemp[j])){
                transferindo.push($scope.estoqueTemp[j]);
            }
        }
        for(var i=0; i<peca.tot; i++){
            $scope.estoqueTemp.push(cod+peca.val);
            $scope.kitAtual.pecas.splice($scope.kitAtual.pecas.indexOf(transferindo[i]), 1);
            $scope.kitAtual.valor = $scope.kitAtual.valor - peca.tot*peca.val;

        }
        $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas);
    }

    $scope.concluir = function(){
        if($scope.acao == "Novo"){
            novoKit();
        }else if($scope.acao == "Atualizar"){
            salvaKit();
        }
    }

    var novoKit = function(){
        kitsService.novo($scope.kitAtual).then(
            function(response){
                estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
                    function (response){
                        Materialize.toast("Kit adicionado!", 5000, 'notificacaoBoa');
                        $scope.usuario.estoque = $scope.estoqueTemp;
                        $scope.carregaKits();
                        $scope.kitAtual = angular.copy(kitVazio);
                        $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas); 
                        $location.hash('kitList');
                        $anchorScroll();  
                    },
                    function(error){
                        Materialize.toast(error.data, 5000, 'notificacaoRuim');
                    }
                );
                

            },
            function(error){
                Materialize.toast(error.data, 5000, 'notificacaoRuim');
            }
        );
    }

    $scope.fecharEdicao = function(){
        $scope.acao = "Novo";
        $scope.kitAtual = angular.copy(kitVazio);
        $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas); 
    }


    $scope.editar = function(kit){
        $scope.acao = "Atualizar";
        var kitAtualizando = angular.copy(kit);
        kitAtualizando.consultora = kitAtualizando.consultora._id;
        $scope.consultora = kit.consultora.nome;
        $scope.kitAtual = kitAtualizando;
        $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas);  
        $location.hash('formKit');
        $anchorScroll();      
    }

    var salvaKit = function(){
        kitsService.atualizaPecas($scope.kitAtual._id, $scope.kitAtual.pecas).then(
            function(response){
                estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
                    function (response){
                        Materialize.toast("Kit atualizado!", 5000, 'notificacaoBoa');
                        $scope.usuario.estoque = $scope.estoqueTemp;
                        $scope.carregaKits();
                        $scope.acao = "Novo";
                        $scope.kitAtual = angular.copy(kitVazio);
                        $scope.pecas = $scope.processaPecas($scope.kitAtual.pecas); 
                        $location.hash('kitList');
                        $anchorScroll();  
                    },
                    function(error){
                        Materialize.toast(error.data, 5000, 'notificacaoRuim');
                    }
                );
                

            },
            function(error){
                Materialize.toast(error.data, 5000, 'notificacaoRuim');
            }
        );
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

    $scope.carregaKits = function(){
        kitsService.todos().then(
            function(response){
                $scope.kits = response.data;

            },
            function(error){
                Materialize.toast(error, 5000, 'notificacaoRuim');
            }
        );
    }

    $('#tabelaPecas').modal();
    $scope.kitSelecionado = {
        pecas:[]
    }
    $scope.enviaKit = function(kit){
        kitsService.atualizaStatus(kit._id, 'Entregue').then(                
            function(res){
                estoqueService.entradaEstoque(id, kit.pecas).then(
                    function(res){
                        carregaKits();
                        $scope.carregaConsultora();
                    }, function(res){
                        Materialize.toast("Falha ao realizar entrega!", 5000, 'notificacaoRuim');
                    }
                );
            },
            function(res){
                 Materialize.toast("Falha ao realizar entrega!", 5000, 'notificacaoRuim');
            }
        );
    };
    $scope.mostraTabelaPecas = function(kit){
        $scope.kitSelecionado = kit;
        $('#tabelaPecas').modal('open');
    }

    $scope.carregaKits();

}]);