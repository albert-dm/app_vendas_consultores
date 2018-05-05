//'use strict';

angular.module('ambaya')
.controller('ConsultorInicioController',[ '$scope', 'consultoresService', 'userService', 'encomendasService', function($scope, consultoresService, userService, encomendasService){
    $scope.carregaDados();
    $scope.novoEmail = "";
    $scope.novo = {
        email: ""
    }
    $('.tooltipped').tooltip({delay: 50});
    //$('select').material_select();
     //configuração de taxa
    var atualizaTaxa = function(){
        $scope.devido = $scope.usuario.totalVendido - $scope.usuario.totalVendido*$scope.usuario.porcentagem/100;
        if($scope.usuario.tipoTaxa === "Porcentagem"){
            $scope.parcelaTaxa = 0.1*$scope.usuario.totalVendido;
        }else{
            $scope.parcelaTaxa = 350;
        }
        if($scope.usuario.taxa <=0)
            $scope.parcelaTaxa = 0;
        if($scope.usuario.taxa < $scope.parcelaTaxa)
            $scope.parcelaTaxa = $scope.usuario.taxa;
    }

    atualizaTaxa();

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
    $scope.brinde = {};
    $scope.troca = {};
    carregaBrinde = function(){
        consultoresService.meuBrinde($scope.usuario._id).then(
            function(res){
                $scope.brinde = res.data[0];
                //verificar aqui o total de brindes do dia das mães pra dar mais um
                //var brindesMaes = $scope.brinde.filter()
            }
        )
    }
    carregaBrinde();
    $('.modal').modal();
    $scope.modalVenda = function(){
        console.log("venda");
        $('#venda').modal('open');
        $('#codigo').focus();
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
                    consultoresService.pegaBrinde($scope.brinde, cod).then(
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
        consultoresService.pedeMaleta($scope.brinde).then(
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
            consultoresService.venda($scope.usuario, $scope.adicionando, $scope.usuario._id).then(
                function(response){
                    if(valorVenda>100){
                        var quantidade = Math.floor(valorVenda/100);
                        Materialize.toast("Venda acima de 100,00!("+valorVenda+")", 5000, 'notificacaoBoa');                        
                        for(var i=0; i<quantidade; i++){
                            $scope.novoBrinde('maes', valorVenda);
                        }
                    }
                    if(Math.floor($scope.usuario.totalVendido/1000) - Math.floor(totalVendidoTemp/1000) > 0){
                        consultoresService.novoBrinde($scope.usuario, "mil").then(
                            function(res){
                                carregaBrinde();
                            },
                            function(res){
                                console.log("Falha ao adicionar brinde dos mil reais");
                            }
                        );
                    }
                    if(totalVendidoTemp < 1500 && $scope.usuario.totalVendido >= 1500){
                        consultoresService.minhaMaleta($scope.usuario._id).then(
                            function(res){
                                if(res.data.length===0){
                                    consultoresService.novoBrinde($scope.usuario, "maleta").then(
                                        function(res){
                                            carregaBrinde();
                                        },
                                        function(res){
                                            console.log("Falah ao adicionar brinde de maleta");
                                        }
                                    );
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
    $scope.novoBrinde = function(campanha, valorVenda){
        consultoresService.novoBrinde($scope.usuario, campanha, valorVenda).then(
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