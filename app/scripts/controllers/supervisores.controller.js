//'use strict';

angular.module('ambaya')
.controller('SupervisoresController',[ '$scope', 'supervisoresService', 'userService', function($scope, supervisoresService, userService){
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
        closeOnSelect: true
    });
    //fim ui config

    carregaSupervisores = function(){
        supervisoresService.todos().then(
            function(response) {
                $scope.supervisores = response.data;
                $scope.total = $scope.supervisores.length; 
            },
            function(response) {
                    Materialize.toast("Falha ao carregar supervisores!", 5000, 'notificacaoRuim');
            }
        );
    };
    carregaSupervisores();

    //formulario de adição
    $scope.form = {
        "nome":"",
        "sobrenome":"",
        "tipo":"Supervisor",
        "status": "Aprovado",
        "porcentagem": 10,
        "estoque": [],
        "vendido":[],
        "investidor": false,
        "totalVendido": 0,
        "proxAcerto": Date.now()+45*24*60*60*1000
    };
    $('#adicionar').modal();
    $scope.add = function(){
        $('#adicionar').modal('open');
    }
    $scope.novo = function(){
        var acerto = Date.now()+45*24*60*60*1000;
        $scope.form.username = $scope.form.nome.toLowerCase() +"."+ $scope.form.sobrenome.toLowerCase().replace(" ", ".");
        $scope.form.password = $scope.form.username;
        userService.novo($scope.form).then(
            function(response) {
                //console.log(response);
                $('#adicionar').modal('close');
                $scope.form = {
                    "nome":"",
                    "sobrenome":"",
                    "tipo":"Supervisor",
                    "status": "Aprovado",
                    "porcentagem": 10,
                    "estoque": [],
                    "vendido":[],
                    "investidor": false,
                    "totalVendido": 0,
                    "proxAcerto": Date.now()+45*24*60*60*1000
                };
                Materialize.toast("Supervisor adicionado com sucesso!", 5000, 'notificacaoBoa');
                carregaSupervisores();
            },
            function(response) {
                Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
            }
        );
        
    };
}])