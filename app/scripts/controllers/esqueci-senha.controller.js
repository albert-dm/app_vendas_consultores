//'use strict';

angular.module('ambaya')
.controller('EsqueciSenhaController',[ '$scope', 'userService', function($scope, userService){
    $scope.form = {
        "login": "",
        "email": ""
    };

    $scope.recuperar = function(){
        userService.esqueciSenha($scope.form.login, $scope.form.email).then(
            function(response) {
                Materialize.toast("Verifique seu email para criar nova senha", 10000, 'notificacaoBoa');
                $scope.irPara('Início');
            },
            function(response) {
                Materialize.toast('Falha ao recuperar.', 5000, 'notificacaoRuim');
            }
        );                
    };         
}]);