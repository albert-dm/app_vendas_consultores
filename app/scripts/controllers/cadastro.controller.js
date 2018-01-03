//'use strict';

angular.module('ambaya')
.controller('CadastroController',[ '$scope', 'apiService', function($scope, apiService){
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
    //$('select').material_select();
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 150, // Creates a dropdown of 15 years to control year
        closeOnSelect: true,
        today: 'Hoje',
        clear: 'Limpar'
    });
    //fim ui config

    $scope.form = {
        "nome":"",
        "sobrenome":"",
        "tipo":"Consultor",
        "supervisor": '',
        "nascimento": '',
        "porcentagem": 30,
        "estoque": [],
        "vendido": [],
        "totalVendido": 0,
        "proxAcerto": Date.now()+45*24*60*60*1000,
        "tipoTaxa":"Primeiro pagamento", 
        "taxa": 350
    };

    var supervisores = {
        "Daniella": "59fb54992e5869001254bda2",
        "Robert": "5903791873baad0011167dc0",
        "Jéssica": "5937495531ba710011e15346",
        "Vicente": "5936ff7e31ba710011e1533c",
        "Fernanda": "5a2ee9a2c4164f0014e5ea74"
    }

    $('#modal-video').modal();
    $('#modal-video').modal('open');

    $scope.cadastro = function(){
        //TODO escolher o id do supervisor de acordo com a cidade
        $scope.form.username = $scope.form.cpf.replace(".", "").replace(".", "").replace("-", "");
        if(['Ouro Preto', 'Mariana'].indexOf($scope.form.cidade)!=-1){
            $scope.form.supervisor = supervisores['Daniella'];
        } else if(['Barroso', 'Belo Horizonte', 'Betim', 'Contagem', 'Ibireté', 'Nova Lima', 'Ribeirão das Neves', 'Santa Cruz de Minas', 'São João del Rei'].indexOf($scope.form.cidade)!=-1){
            $scope.form.supervisor = supervisores['Robert'];            
        }else if(['Carandaí', 'Senhora dos Remédios'].indexOf($scope.form.cidade)!=-1){
            $scope.form.supervisor = supervisores['Jéssica'];
        }else if(['Barbacena'].indexOf($scope.form.cidade)!=-1){
            $scope.form.supervisor = supervisores['Vicente'];
        }else if(['Rio de Janeiro'].indexOf($scope.form.cidade)!=-1){
            $scope.form.supervisor = supervisores['Fernanda'];
        }
        console.log($scope.form);
        apiService.cadastro($scope.form).then(
            function(response) {
                //console.log(response);
                $('#adicionar').modal('close');
                $scope.form = {
                    "nome":"",
                    "sobrenome":"",
                    "tipo":"Consultor",
                    "supervisor": '',
                    "nascimento": '',
                    "porcentagem": 30,
                    "estoque": [],
                    "vendido": [],
                    "totalVendido": 0,
                    "proxAcerto": Date.now()+45*24*60*60*1000,
                    "tipoTaxa":"Primeiro pagamento", 
                    "taxa": 350
                };
                Materialize.toast("Cadastro realizado com sucesso! Use seu CPF para fazer o login.", 10000, 'notificacaoBoa');
                $scope.irPara('Início');
            },
            function(response) {
                Materialize.toast('Falha ao cadastrar!', 5000, 'notificacaoRuim');
            }
        );                
    };         
}]);