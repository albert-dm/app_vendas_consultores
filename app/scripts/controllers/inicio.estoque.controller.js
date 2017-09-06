//'use strict';

angular.module('ambaya')
.controller('EstoqueInicioController',[ '$scope', 'estoqueService', 'encomendasService', function($scope, estoqueService, encomendasService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $('#entrada').modal();
    $('select').material_select();
    $scope.adicionando = [];
    $scope.encomendas = 0;
    $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
    encomendasService.totalAprovado().then(
        function(response){
            $scope.encomendas = response.data;
        },
        function(response){
            Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
        }
    );
    $scope.codigo = "";
    $scope.abrir = function(){
        $('#entrada').modal('open');
        $('#codigo').focus();
    }
    $scope.entrada = function(){
        var cod = $scope.extraiCod($scope.codigo.toUpperCase());
        var cods = ['AN', 'BP', 'BG', 'CF', 'CM', 'PN', 'PF', 'PM', 'TZ', 'ES', 'PZ'];
        if (cods.indexOf(cod) != -1){
            $scope.adicionando.push($scope.codigo.toUpperCase());
        } else Materialize.toast("Código Inválido", 5000, 'notificacaoRuim');
        $scope.codigo = ""
    }
    $scope.concluir = function(){
        //deve existir possibilidade de cancelar última adição
        var estoque = $scope.usuario.estoque.concat($scope.adicionando);
        estoqueService.atualizaEstoque($scope.usuario._id, estoque).then(
            function(response){
                estoqueService.atualizaHistorico($scope.adicionando);
                $scope.usuario.estoque = estoque;
                $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
                $scope.adicionando = [];
                $('#entrada').modal('close');
            },
            function(response){
                Materialize.toast("Falha ao acessar o servidor", 5000, 'notificacaoRuim');
            }
        )
    }
}]);