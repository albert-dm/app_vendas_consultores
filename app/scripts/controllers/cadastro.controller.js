//'use strict';

angular.module('ambaya')
.controller('CadastroController',[ '$scope', 'userService', function($scope, userService){
    $scope.carregaDados();
    //mascaras para formulario
    $('.cep').mask('00000-000');
    $('.cpf').mask('000.000.000-00', {reverse: true});

    var telefoneFuncao = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
        telOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(telefoneFuncao.apply({}, arguments), options);
            }
    };

    $('.telefone').mask(telefoneFuncao, telOptions);
    //fim das mascaras

    //ui config
    $('.tooltipped').tooltip({delay: 50});
    $('select').material_select();
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 150, // Creates a dropdown of 15 years to control year
        closeOnSelect: true,
        today: 'Hoje',
        clear: 'Limpar'
    });
    //fim ui config

    userService.carregaUm(id).then(
            function(response) {
                $scope.supervisor = response.data;
                $scope.pecas = $scope.processaPecas($scope.supervisor.estoque);
            },
            function(response) {
                Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
            }
    );

    $scope.form = {
        "nome":"",
        "sobrenome":"",
        "tipo":"Consultor",
        "supervisor": '',
        "porcentagem": 30,
        "estoque": [],
        "vendido": [],
        "totalVendido": 0,
        "proxAcerto": Date.now()+45*24*60*60*1000,
        "tipoTaxa":"Primeiro pagamento", 
        "taxa": 350
    };

    $scope.novo = function(){
        //TODO escolher o id do supervisor de acordo com a cidade
        console.log($scope.form);
        $scope.form.username = $scope.form.cpf.replace(".", "").replace(".", "").replace("-", "");
        $scope.form.password = $scope.form.username;
        userService.novo($scope.form).then(
            function(response) {
                //console.log(response);
                $('#adicionar').modal('close');
                $scope.form = {
                    "nome":"",
                    "sobrenome":"",
                    "tipo":"Consultor",
                    "supervisor": '',
                    "porcentagem": 30,
                    "estoque": [],
                    "vendido": [],
                    "totalVendido": 0,
                    "proxAcerto": Date.now()+45*24*60*60*1000,
                    "tipoTaxa":"Primeiro pagamento", 
                    "taxa": 350
                };
                carregaConsultores();
                Materialize.toast("Cadastro realizado com sucesso!", 5000, 'notificacaoBoa');
            },
            function(response) {
                Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
            }
        );                
    };         
}]);