//'use strict';

angular.module('ambaya')
.controller('ConsultorController',[ 
    '$scope', 
    '$state', 
    'userService', 
    'consultoresService', 
    'supervisoresService', 
    'estoqueService', 
    '$stateParams', 
    'acertosService', 
    'kitsService',
    function(
        $scope, 
        $state,
        userService,
        consultoresService, 
        supervisoresService, 
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
    var parcelaTemp;
    $scope.status = ['Entregue', 'Pendente'];
    $scope.kits = [];

    $scope.carregaConsultora = function(){
        userService.carregaUm(id).then(
            function(response) {
                $scope.consultor = response.data;
                $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                $scope.vendidas = $scope.processaPecas($scope.consultor.vendido);
                console.log($scope.consultor);
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
    
    $scope.aprovar = function(){
        if($scope.indicador){
            consultoresService.indicadoPor(id, $scope.indicador).then(
                function(response) {
                    Materialize.toast("Indicação atualizada!", 5000, 'notificacaoBoa');
                },
                function(response) {
                    Materialize.toast("Falha ao atualizar indicação", 5000, 'notificacaoRuim');
                }
            );
        }
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

    $scope.excluir =  $scope.desaprovar;



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
        var info = {
                    "userNome": $scope.consultor.nome,
                    "userId": $scope.consultor._id,
                    "tipo": "Consultor",
                    "valor": $scope.consultor.totalVendido,
                    "pecas": $scope.consultor.vendido,
                    "pago": $scope.valores.devido
                }
        $scope.consultor.vendido = [];
        //console.log(info);
        if($scope.consultor.indicador && $scope.acertos.length < 3){
            consultoresService.incrementaDesconto($scope.consultor.indicador, 0.05*$scope.consultor.totalVendido).then(
                function(){
                            Materialize.toast('Prêmio por indicação computado!', 5000, 'notificacaoBoa');
                },
                function(){
                    Materialize.toast('Falha ao computar prêmio por indicação', 5000, 'notificacaoRuim');
                }
            );
        }
        
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
    $scope.vendidoHistorico = 0;
    hoje = new Date();
    consultoresService.historico(id).then(                
        function(res){
            $scope.acertos = res.data;
            for(i=0; i< $scope.acertos.length; i++){
                $scope.vendidoHistorico += Number($scope.acertos[i].valor);
                dia = new Date($scope.acertos[i].createdAt);
                if(hoje.getFullYear() === dia.getFullYear())
                    $scope.vendidoAno+=$scope.acertos[i].valor;
            }
            $scope.valores = $scope.calculaValores($scope.vendidoHistorico, $scope.consultor.totalVendido, $scope.consultor.desconto);
            if($scope.vendidoHistorico + $scope.consultor.totalVendido < 2000){
                $scope.nivelConsultor = "Bronze";
                $scope.porcentagem = '20%';
    
            }else if($scope.vendidoHistorico + $scope.consultor.totalVendido< 4000){
                $scope.nivelConsultor = "Prata";
                $scope.porcentagem = '25%';
            }
            else{
                $scope.nivelConsultor = "Ouro";
                $scope.porcentagem = '30%';
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

    //estorno
    $('#estorno').modal();
    $scope.modalEstorno = function(){
        $('#estorno').modal('open');
    };

    //indicacao
    $('#indicacao').modal();
    $scope.indicacao = function(){
        $('#indicacao').modal('open');
    };

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

    //Edição de consultora
    $('#editar').modal();
    $scope.modalEditar = function(){
        $scope.selectedSupervisor = $scope.consultor.supervisor;
        $('#editar').modal('open');
    };

    $scope.salvar = function(){
        consultoresService.trocaSupervisor($scope.consultor._id, $scope.selectedSupervisor).then(
            function(){
                Materialize.toast("Supervisor atualizado!", 5000, 'notificacaoBoa');
            },
            function(){
                Materialize.toast("Falha ao atualizar supervisor", 5000, 'notificacaoRuim');
            }
        );
    }

}]);