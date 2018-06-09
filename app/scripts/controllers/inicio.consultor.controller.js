//'use strict';

angular.module('ambaya')
.controller('ConsultorInicioController',[ '$scope', 'consultoresService', 'userService', 'encomendasService', function($scope, consultoresService, userService, encomendasService){
    $scope.carregaDados();
    $scope.novoEmail = "";
    $scope.novo = {
        email: ""
    }
    $('.tooltipped').tooltip({delay: 50});

    $scope.adicionando = [];
    encomendasService.consultor($scope.usuario._id).then(
            function(response){
                $scope.encomendas = response.data;
            },
            function(response){
                Materialize.toas("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
            }
        );
    userService.carregaUm($scope.usuario.supervisor).then(
            function(response) {
                $scope.supervisor = response.data;
            },
            function(response) {
                    Materialize.toast("Falha ao carregar dados do supervisor!", 5000, 'notificacaoRuim');
            }
    );

    consultoresService.historico($scope.usuario._id).then(                
        function(res){
            $scope.acertos = res.data;
            $scope.vendidoHistorico = 0;
            for(i=0; i< $scope.acertos.length; i++){
                $scope.vendidoHistorico += $scope.acertos[i].valor;
            }
            refreshBar();
            $scope.valores = $scope.calculaValores($scope.vendidoHistorico, $scope.usuario.totalVendido);
        },
        function(res){
             Materialize.toast("Falha ao carregar histórico!", 5000, 'notificacaoRuim');
        }
    );

    carregaBrinde = function(){
        consultoresService.meuBrinde($scope.usuario._id).then(
            function(res){
                console.log(res);
                $scope.usuario.brindesEntregues = res.data.filter(function(brinde){
                    return brinde.status=="Entregue";
                });
                $scope.usuario.brindesPendentes = res.data.filter(function(brinde){
                    return brinde.status=="Pendente";
                });
                $scope.usuario.brindesMaes = res.data.filter(function(brinde){
                    return brinde.status=="Entregue" && brinde.campanha=="maes";
                });
                $scope.usuario.brindesNatal = res.data.filter(function(brinde){
                    return brinde.status=="Entregue" && brinde.campanha=="natal";
                });
                $scope.usuario.brindesMil = res.data.filter(function(brinde){
                    return brinde.status=="Entregue" && brinde.campanha=="mil";
                });
                console.log('entrou', $scope.usuario.brindesEntregues);
                //verificar aqui o total de brindes do dia das mães pra dar mais um
                //var brindesMaes = $scope.brinde.filter()
            }
        )
    }

    $scope.brinde = {};
    $scope.troca = {};
    carregaBrinde();
    $('.modal').modal();
    $scope.modalVenda = function(){
        console.log("venda");
        $('#venda').modal('open');
        $('#codigo').focus();
    }

    refreshBar = function(){
        if($scope.vendidoHistorico + $scope.usuario.totalVendido < 2000){
            $scope.maxAbsoluto = 2000;
            $scope.nivelConsultor = "Bronze";
            $scope.porcentagem = '20%';

        }else if($scope.vendidoHistorico + $scope.usuario.totalVendido< 4000){
            $scope.maxAbsoluto = 4000;
            $scope.nivelConsultor = "Prata";
            $scope.porcentagem = '25%';
        }
        else{
            $scope.maxAbsoluto = 0;
            $scope.nivelConsultor = "Ouro";
            $scope.porcentagem = '30%';
        }
        //$scope.maxRelativo = Math.floor(($scope.usuario.totalVendido)/1000)*5000;
        var anterior = 1000;
        var aux = 0;
        $scope.maxRelativo = 1000;
        while($scope.maxRelativo < $scope.usuario.totalVendido){
            aux = $scope.maxRelativo;
            $scope.maxRelativo = $scope.maxRelativo + anterior;
            anterior = aux;
        }
    }
    $scope.modalBrinde = function(tipo){
        $scope.tipoBrinde = tipo;
        $('#brinde').modal('open');
    }
    $scope.modalTroca = function(){
        $('#troca').modal('open');
    }
    Quagga.CameraAccess.enumerateVideoDevices()
    .then(function(devices) {
        console.log(devices);
    });
    
    $scope.entrada = function(){
        if($scope.extraiCod($scope.codigo.toUpperCase())!='PZ'){
            $scope.adicionando.push($scope.codigo.toUpperCase());
            $scope.codigo = "";
        } else{
            Materialize.toast("Use a seção de personalizados!", 10000, 'notificacaoRuim');
        }
        
    }
    $scope.pegaBrinde = function(){
        var estoqueTemp = [];
        var estoqueTemp = estoqueTemp.concat($scope.usuario.estoque);
        var encontrado = false;
        var cod = $scope.codigoBrinde.toUpperCase();
        var encontrado = false;
        var precoAdd = $scope.extraiPreco(cod);
        var codAdd = $scope.extraiCod(cod);
        for (var j=0; j<$scope.usuario.estoque.length; j++){
            if(precoAdd=== $scope.extraiPreco($scope.usuario.estoque[j]) && codAdd === $scope.extraiCod($scope.usuario.estoque[j])){
                $scope.deletaElemento($scope.usuario.estoque, j);
                encontrado = true;
                break;
            }
        }
        if (encontrado == false){
            Materialize.toast(cod+" não encontrado!", 10000, 'notificacaoRuim');
            $scope.usuario.estoque = estoqueTemp;
        }else{
            consultoresService.atualizaEstoque($scope.usuario).then(
                function(res){
                    consultoresService.pegaBrinde($scope.usuario.brindesPendentes[0], cod).then(
                        function(res){
                            $scope.codigo = "";
                            $('#brinde').modal('close');
                            Materialize.toast("Brinde registrado com sucesso!", 5000, 'notificacaoBoa');
                            carregaBrinde();
                        },
                        function(res){
                            Materialize.toast("Falha ao pegar o brinde!", 5000, 'notificacaoRuim');
                        }
                    );
                },
                function(res){
                    $scope.usuario.estoque = estoqueTemp;
                    Materialize.toast("Falha ao atualizar estoque!", 5000, 'notificacaoRuim');
                }
            );                    
        }
    }
    $scope.pedeMaleta = function(){
        consultoresService.pedeMaleta($scope.usuario.brindesPendentes[0]).then(
            function(res){
                $scope.codigo = "";
                $('#brinde').modal('close');
                Materialize.toast("Maleta solicitada com sucesso!", 5000, 'notificacaoBoa');
                carregaBrinde();
            },
            function(res){
                Materialize.toast("Falha ao solicitar maleta!", 5000, 'notificacaoRuim');
            }
        );
    }
    $scope.entradaCamera = function(){
        $('#venda').modal('close');
        $('#modalCamera').modal('open');
        Quagga.init({
                inputStream : {
                    name : "Barras",
                    type : "LiveStream",
                    target: document.querySelector('#camera')    // Or '#yourElement' (optional)
                },
                decoder : {
                    readers : ["code_128_reader"]
                },
                locator: {
                    patchSize: "small",
                    halfSample: false
                },
                locate: true
            }, 
            function(err) {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
        });
        Quagga.onDetected(function(data){
            Quagga.stop();
            data.codeResult.code = data.codeResult.code.replace(/\s+/g, '');
            $('#codigo').val(data.codeResult.code);
            $scope.codigo = data.codeResult.code;
            $('#modalCamera').modal('close');
            $('#venda').modal('open');
            $('#codigo').focus();
        });
    }
    $scope.fechaCamera = function(){
        Quagga.stop();
        $('#modalCamera').modal('close');
        $('#venda').modal('open');
    }
    $scope.vendaPersonalizado = function(encomenda){
        $scope.adicionando = encomenda.enviados;
        if($scope.vender()){
            encomenda.status = "Entregue";
            encomendasService.atualizarStatus(encomenda._id, "Entregue");
        };
    }
    $scope.filtroStatus = function(encomenda) {
        return (['Aprovada', 'Enviada', 'Pendente'].indexOf(encomenda.status) !== -1);
    };
    $scope.vender = function(){
        var estoqueTemp = [];
        var estoqueTemp = estoqueTemp.concat($scope.usuario.estoque);
        var vendidoTemp = [];
        var vendidoTemp = vendidoTemp.concat($scope.usuario.vendido);
        var totalVendidoTemp = 0;
        var totalVendidoTemp = totalVendidoTemp+$scope.usuario.totalVendido;
        var valorVenda = 0;
        var valorAbsoluto = 0;
        var encontrado = false;
        var vendaok = true;
        for(var i=0; i <$scope.adicionando.length; i++){
            encontrado = false;
            var precoAdd = $scope.extraiPreco($scope.adicionando[i]);
            var codAdd = $scope.extraiCod($scope.adicionando[i]);
            for (var j=0; j<$scope.usuario.estoque.length; j++){
                if(precoAdd=== $scope.extraiPreco($scope.usuario.estoque[j]) && codAdd === $scope.extraiCod($scope.usuario.estoque[j])){
                    $scope.usuario.vendido.push($scope.usuario.estoque[j])
                    $scope.deletaElemento($scope.usuario.estoque, j);
                    $scope.usuario.totalVendido += Number(precoAdd);
                    console.log($scope.usuario.vendido);
                    valorVenda = Number(valorVenda) + Number(precoAdd);
                    encontrado = true;
                    //Atualiza totalVendido, vendido e estoque e adicionar 
                    //'adicionando' ao historico de vendas -> na venda ou no acerto?
                    break;
                }
            }
            if (encontrado == false){
                Materialize.toast($scope.adicionando[i]+" não encontrado!", 10000, 'notificacaoRuim');
                vendaok = false;
            }
        }
        if (vendaok == true){
            if($scope.vendidoHistorico + totalVendidoTemp<2000){
                if($scope.usuario.totalVendido + $scope.vendidoHistorico>=4000){
                    $('#avancoNivel').modal('open');
                    //callModalNivel(ouro)
                } else if($scope.usuario.totalVendido + $scope.vendidoHistorico>=2000){
                    $('#avancoNivel').modal('open');
                    //callModalNivel(prata)
                }
            }else if($scope.vendidoHistorico + totalVendidoTemp < 4000){
                if($scope.usuario.totalVendido + $scope.vendidoHistorico>=4000){
                    $('#avancoNivel').modal('open');
                    //callModalNivel(ouro)
                }
            }
            valorAbsoluto =  $scope.usuario.totalVendido + $scope.vendidoHistorico;
            console.log(valorAbsoluto);
            consultoresService.venda($scope.usuario, $scope.adicionando, $scope.usuario._id).then(
                function(response){
                    /* if(valorVenda>=100){
                        var quantidade = Math.floor(valorVenda/100);
                        Materialize.toast("Venda acima de 100,00!("+valorVenda+")", 5000, 'notificacaoBoa');                    
                        for(var i=0; i<quantidade; i++){
                            $scope.novoBrinde('maes', valorVenda, valorAbsoluto);
                        }
                    } */
                    if(Math.floor($scope.usuario.totalVendido/1000) - Math.floor(totalVendidoTemp/1000) > 0){
                        $scope.novoBrinde('mil', valorVenda, valorAbsoluto);
                    }
                    if(totalVendidoTemp < 1500 && $scope.usuario.totalVendido >= 1500){
                        consultoresService.minhaMaleta($scope.usuario._id).then(
                            function(res){
                                if(res.data.length===0){
                                    $scope.novoBrinde('maleta', valorVenda, valorAbsoluto);
                                }
                            }
                        );
                    }
                },
                function(err){
                    $scope.usuario.estoque = estoqueTemp;
                    $scope.usuario.vendido = vendidoTemp;
                    $scope.usuario.totalVendido = totalVendidoTemp;
                    Materialize.toast("Falha ao realizar venda!", 5000, 'notificacaoRuim');
                    $('#venda').modal('close');
                    $scope.adicionando = [];
                    return false;
                }
            );
            refreshBar();
            $scope.valores = $scope.calculaValores($scope.vendidoHistorico, $scope.usuario.totalVendido);
            $('#venda').modal('close');
            $scope.adicionando = [];
            return true;
        }
        else{
            $scope.usuario.estoque = estoqueTemp;
            $scope.usuario.vendido = vendidoTemp;
            $scope.usuario.totalVendido = totalVendidoTemp;
            Materialize.toast("Falha ao realizar venda!", 5000, 'notificacaoRuim');
        }
    };
    $scope.cadastraEmail = function(){
        consultoresService.atualizaEmail($scope.usuario, $scope.novo.email).then(
            function(res){
                Materialize.toast("Email cadastrado com sucesso!", 5000, 'notificacaoBoa');
                $scope.usuario.email = $scope.novo.email;
            },
            function(erro){
                Materialize.toast("Falha ao cadastrar email.", 5000, 'notificacaoRuim');
            }
        );
    }
    $scope.novoBrinde = function(campanha, valorVenda, valorAbsoluto){
        consultoresService.novoBrinde($scope.usuario, campanha, valorVenda, valorAbsoluto).then(
            function(res){
                Materialize.toast("Novo brinde!", 5000, 'notificacaoBoa');
                carregaBrinde();
            },
            function(res){
                console.log("Falha ao adicionar brinde de maes");
            }
        );
    }
}]);