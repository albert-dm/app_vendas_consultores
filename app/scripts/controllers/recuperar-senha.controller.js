//'use strict';

angular.module('ambaya')
.controller('RecuperarSenhaController',[ '$scope', 'userService', '$stateParams', function($scope, userService, $stateParams){
    $scope.form = {
        "senha": "",
        "confirmacao": ""
    };

    $scope.cadastro = function(){
        if($scope.form.senha != $scope.form.confirmacao){
            Materialize.toast('Senha diferente da confirmação!', 5000, 'notificacaoRuim');
            return;
        }
        userService.novaSenha($stateParams.state, $scope.form.senha).then(
            function(response) {
                Materialize.toast("Senha atualizada", 10000, 'notificacaoBoa');
                $scope.irPara('Início');
            },
            function(response) {
                Materialize.toast('Falha ao cadastrar.', 5000, 'notificacaoRuim');
            }
        );                
    };         
}]);