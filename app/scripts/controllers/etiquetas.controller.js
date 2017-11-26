//'use strict';

angular.module('ambaya')
.controller('EtiquetasController',[ '$scope', 'encomendasService', 'consultoresService', 'userService', 'estoqueService', function($scope, encomendasService, consultoresService, userService, estoqueService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $('#entrada').modal();
    $('select').material_select();
    $scope.adicionando = [];
    $scope.entradas = [];
    
    $scope.codigo = "";
    $scope.limpar = function(){
        $scope.adicionando = [];
        $scope.entradas = [];
    }
    $scope.entrada = function(){
        var item = $('#item').find(":selected").text();
        var preco = $('#preco').val();
        var quantidade = $('#quantidade').val();
        var codigo = $('#item').find(":selected").val();
        if(preco.length==1) preço = "00"+preco;
        else if (preco.length==2) preco = "0"+preco;
        codigo = codigo/* +mes+ano */+preco;
        var entrada = {
            "item": item,
            "preco": preco,
            "quantidade": quantidade,
            "codigo": codigo
        };
        $scope.adicionando.push(entrada);
        for(j = 0; j<entrada.quantidade; j++)
                $scope.entradas.push(entrada.codigo);
    }
    $scope.excluir = function(index){
        codigo = $scope.adicionando[index].codigo;
        quantidade = $scope.adicionando[index].quantidade;
        for(i = 0; i<quantidade; i++){
            pos = $scope.entradas.indexOf(codigo);
            $scope.entradas.splice(index, 1);
        }
        $scope.deletaElemento($scope.adicionando, index);
    }
    $scope.bc = {
        format: 'CODE128',
        lineColor: '#000000',
        width: 1,
        height: 16,
        displayValue: true,
        fontOptions: '',
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 0,
        fontSize: 18,
        background: '#ffffff',
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        valid: function (valid) {
        }
    }

}]);