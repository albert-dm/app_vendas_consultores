//'use strict';

angular.module('ambaya')
.controller('SupervisorController',[ '$scope', 'supervisoresService', 'userService', 'consultoresService', '$stateParams', function($scope, supervisoresService, userService, consultoresService, $stateParams){
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

    var id =  $stateParams.supervisorId;
    userService.carregaUm(id).then(
            function(response) {
                $scope.supervisor = response.data;
                $scope.pecas = $scope.processaPecas($scope.supervisor.estoque);
            },
            function(response) {
                Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
            }
    );
    var carregaConsultores = function(){
        consultoresService.porSupervisor(id).then(
            function(response) {
                $scope.consultores = response.data;
            },
            function(response) {
                Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
            }
        );
    };
    carregaConsultores();   

    $scope.form = {
        "nome":"",
        "sobrenome":"",
        "tipo":"Consultor",
        "status": "Aprovado",
        "supervisor": id,
        "porcentagem": 30,
        "estoque": [],
        "vendido": [],
        "totalVendido": 0,
        "proxAcerto": Date.now()+45*24*60*60*1000,
        "tipoTaxa":"Primeiro pagamento", 
        "taxa": 350
    };
    $('#adicionar').modal();
    $('#excluir').modal();
    $scope.add = function(){
        $('#adicionar').modal('open');
    }
    $scope.del = function(){
        $('#excluir').modal('open');
    }
    $scope.novo = function(){
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
                    "status": "Aprovado",
                    "supervisor": id,
                    "porcentagem": 30,
                    "estoque": [],
                    "vendido": [],
                    "totalVendido": 0,
                    "proxAcerto": Date.now()+45*24*60*60*1000,
                    "tipoTaxa":"Primeiro pagamento", 
                    "taxa": 350
                };
                carregaConsultores();
                Materialize.toast("Consultor adicionado com sucesso!", 5000, 'notificacaoBoa');
            },
            function(response) {
                Materialize.toast("response.err.message", 5000, 'notificacaoRuim');
            }
        );                
    };         
   $scope.excluir = function(){
        userService.deletaUm($scope.supervisor._id).then(
            function(response) {
                Materialize.toast("Excluido com sucesso!", 5000, 'notificacaoBoa');
                window.history.back();
            },
            function(response) {
                Materialize.toast("Falha ao excluir", 5000, 'notificacaoRuim');
            }
        );                
   }
}]);