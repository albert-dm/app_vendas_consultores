//'use strict';

angular.module('ambaya')
.controller('ConsultorController',[ 
    '$scope', 
    '$state', 
    'userService', 
    'consultoresService', 
    'estoqueService', 
    '$stateParams', 
    'acertosService', 
    'kitsService',
    function(
        $scope, 
        $state,
        userService,
        consultoresService, 
        estoqueService, 
        $stateParams, 
        acertosService,
        kitsService
    ){
    $scope.consultor = {
        estoque: [],
        vendido: []
    }
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});            
    
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 150, // Creates a dropdown of 15 years to control year
        closeOnSelect: true
    });
    var info;
    var id =  $stateParams.consultorId;
    var tipoTemp;
    var taxaTemp;
    var parcelaTemp;
    $scope.status = ['Entregue', 'Pendente'];
    $scope.kits = [];

    $scope.carregaConsultora = function(){
        userService.carregaUm(id).then(
            function(response) {
                $scope.consultor = response.data;
                $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                $scope.vendidas = $scope.processaPecas($scope.consultor.vendido);
                $scope.devido = $scope.consultor.totalVendido - $scope.consultor.totalVendido*$scope.consultor.porcentagem/100;// + $scope.consultor.pendente;

                 //configuração de taxa
                if($scope.consultor.tipoTaxa === "Porcentagem"){
                    $scope.parcelaTaxa = 0.1*$scope.consultor.totalVendido;
                }else{
                    $scope.parcelaTaxa = 350;
                }
                if($scope.consultor.taxa <=0)
                    $scope.parcelaTaxa = 0;
                if($scope.consultor.taxa < $scope.parcelaTaxa)
                    $scope.parcelaTaxa = $scope.consultor.taxa;
            },
            function(response) {
                    Materialize.toast("Falha ao carregar dados!", 5000, 'notificacaoRuim');
            }
        );
    }
    $scope.carregaConsultora();

    var carregaKits = function(){
        kitsService.consultor(id).then(
            function(response) {
                $scope.kits = response.data;
            },
            function(response) {
                    Materialize.toast("Falha ao carregar kits!", 5000, 'notificacaoRuim');
            }
        );
    }

    carregaKits();

    $scope.filtroStatus = function(kit) {
        return ($scope.status.indexOf(kit.status) !== -1);
    };

    $('.modal').modal();
    $scope.del = function(){
        $('#excluir').modal('open');
    }
    $scope.atualizaTaxa = function(){
        consultoresService.tipoTaxa($scope.consultor).then(
            function(res){
                 Materialize.toast("Tipo selecionado!", 5000, 'notificacaoBoa');
            },
            function(res){
                $scope.consultor.tipoTaxa = tipoTemp;
                $scope.consultor.taxa = taxaTemp;
                $scope.parcelaTaxa = parcelaTemp;
                Materialize.toast("Falha ao slecionar!", 5000, 'notificacaoRuim');
            }
        );
    }
    $scope.mudaTaxa = function(){
        tipoTemp = $scope.consultor.tipoTaxa;
        taxaTemp = $scope.consultor.taxa;
        parcelaTemp = $scope.parcelaTaxa;
        if($scope.consultor.tipoTaxa === "À vista"){
            $('#avista').modal('open');
        }else if($scope.consultor.tipoTaxa === "Porcentagem"){
            $scope.consultor.taxa = 370;
            $scope.parcelaTaxa = 0.1*$scope.consultor.totalVendido;
            $scope.atualizaTaxa();
        }else{
            $scope.consultor.taxa = 350;
            $scope.parcelaTaxa = 350;
            $scope.atualizaTaxa();
        }
    }
    $scope.confirmaPagamento = function(){
        $scope.consultor.taxa = 0;
        $scope.parcelaTaxa = 0;
        $scope.consultor.tipoTaxa = "Á vista";
        $scope.atualizaTaxa();
    }
    $scope.excluir = function(){
        userService.deletaUm($scope.consultor._id).then(
            function(response) {
                Materialize.toast("Excluído com sucesso", 5000, 'notificacaoBoa');
                window.history.back();
            },
            function(response) {
                Materialize.toast("Falha ao excluir", 5000, 'notificacaoRuim');
            }
        );                
    };
    $scope.aprovar = function(){
         consultoresService.aprovar(id).then(
            function(response) {
                $scope.consultor.status = "Aprovado";
            },
            function(response) {
                Materialize.toast("Falha ao atualizar", 5000, 'notificacaoRuim');
            }
        );
    };
    $scope.desaprovar = function(){
         consultoresService.desaprovar(id).then(
            function(response) {
                $scope.consultor.status = "Inativo";
            },
            function(response) {
                Materialize.toast("Falha ao atualizar", 5000, 'notificacaoRuim');
            }
        );
    };



    ////Alocaçao das peças
    $('#enviar').modal();

    $scope.modalEncomenda = function(){
       var aux;
        //$('select').material_select();
        $scope.codigo = "AN";
        $scope.estoqueTemp = [];
        $scope.pecasEnviadas = [];
        $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);    
        $scope.pecasEnviadas = $scope.pecasEnviadas.concat($scope.consultor.estoque);    
        console.log($scope.usuario.estoque);            
        $('#enviar').modal('open');
    }
    $scope.enviar = function(){
       estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
           function(response){
               estoqueService.atualizaEstoque($scope.consultor._id, $scope.pecasEnviadas).then(
                   function(response){
                       $scope.consultor.estoque = $scope.pecasEnviadas
                        $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                       Materialize.toast("Peças Alocadas", 5000, 'notificacaoBoa');
                   },
                   function(response){
                       Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
           }
               )
           },
           function(response){
               Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
           }
       )
        $scope.usuario.estoque = [];
        $scope.usuario.estoque = $scope.usuario.estoque.concat($scope.estoqueTemp);
        $('#enviar').modal('close');
    } 
    $scope.enviado = function(codigo){
        indice = $scope.estoqueTemp.indexOf(codigo);
        cod = $scope.estoqueTemp[indice];
        $scope.deletaElemento($scope.estoqueTemp, indice);
        $scope.pecasEnviadas.push(cod);
    }
    $scope.devolvido = function(codigo){
        indice = $scope.pecasEnviadas.indexOf(codigo);
        cod = $scope.pecasEnviadas[indice];
        $scope.deletaElemento($scope.pecasEnviadas, indice);
        $scope.estoqueTemp.push(cod);
    }
    $scope.porItem = function(item) {
        var cod = item.substr(0,2);
        return ($scope.codigo === cod);
    };/*
    $('#item').on('change', function(){
        var cod = $(this).val();
        $scope.codigo = cod;
    });
    $scope.$watch($scope.codigo, function(newVal, oldVal){
        console.log(newVal);
    }, true);*/

    //Realização de acerto
    $('#acerto').modal();
    $scope.modalAcerto = function(){
        $('#acerto').modal('open');
    };
    $scope.acerto = function(){
        $scope.consultor.taxa = $scope.consultor.taxa - $scope.parcelaTaxa;
        if($scope.consultor.taxa <1) $scope.consultor.taxa = 0;
        var info = {
                    "userNome": $scope.consultor.nome,
                    "userId": $scope.consultor._id,
                    "tipo": "Consultor",
                    "valor": $scope.devido,
                    "pecas": $scope.consultor.vendido,
                    "taxa": $scope.consultor.parcelaTaxa
                }
        $scope.consultor.vendido = [];
        console.log(info);
        consultoresService.acerto($scope.consultor).then(
            function(response){
                acertosService.acerto(info).then(
                    function(response){
                        acertosService.atualizaHistorico(info.pecas).then(
                            function(){
                                $scope.vendidas = $scope.processaPecas($scope.consultor.vendido);
                                $scope.usuario.totalVendido += $scope.consultor.totalVendido;
                                $scope.consultor.totalVendido = 0;
                                $scope.devido = 0;
                                $('#acerto').modal('close');
                                consultoresService.venda($scope.usuario).then(
                                    function(res){
                                        Materialize.toast('Acerto realizado com sucesso!', 5000, 'notificacaoBoa');
                                    }
                                );
                            },
                            function(){
                                Materialize.toast('Falha ao salvar historico!', 5000, 'notificacaoRuim');
                            }
                        )
                    },
                    function(response){
                        Materialize.toast('Falha ao adicionar acerto!', 5000, 'notificacaoRuim');
                    }
                );
            },
            function(response){
                Materialize.toast('Falha ao atualizar consultor!', 5000, 'notificacaoRuim');
            }
        )
    };

    //Edição de consultor
    $scope.modalProxAcerto = function(){
        $('#editar').modal('open');
    };
    $scope.novoProxAcerto = function(){
     consultoresService.atualizaProxAcerto($scope.consultor, $scope.formEdit.proxAcerto.$viewValue).then(
            function(response) {
                $('#editar').modal('close');
                $state.transitionTo($state.current, $stateParams, { 
                    reload: true, inherit: false, notify: true
                });
            },
            function(response) {
                    Materialize.toast("Falha ao carregar dados!", 5000, 'notificacaoRuim');
            }
    );
    }
    
    //histórico
    $scope.acertos = {};
    $scope.vendidoAno = 0;
    hoje = new Date();
    consultoresService.historico(id).then(                
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

    //kits
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
    };
    $scope.recolherPecas = function(){
        var kit = {
            status: "Pendente",
            supervisor: $scope.usuario._id,
            pecas: $scope.consultor.estoque
        }
        kitsService.novo(kit).then(
            function(response){
                estoqueService.atualizaEstoque($scope.consultor._id, []).then(
                    function (response){
                        Materialize.toast("Peças recolhidas", 5000, 'notificacaoBoa');
                        $scope.carregaDados();
                        $scope.carregaConsultora();
                    },
                    function(error){
                        Materialize.toast("Falha ao recolher peças", 5000, 'notificacaoRuim');
                    }
                );
                

            },
            function(error){
                Materialize.toast("Falha ao recolher peças", 5000, 'notificacaoRuim');
            }
        );
    }

    //recuperar senha
    $scope.recoverPassword = function(){
        userService.getRecoveryCode($scope.usuario._id).then(
            function(res){
                console.log(res);
            },
            function(error){
                console.log(error);
            }
        )
        
    }
    //estorno
    $('#estorno').modal();
    $scope.modalEstorno = function(){
        $('#estorno').modal('open');
    };

}]);