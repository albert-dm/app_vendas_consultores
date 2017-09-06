//'use strict';

angular.module('ambaya')
.controller('EstoqueConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
    $scope.carregaDados();
    $('.tooltipped').tooltip({delay: 50});
    $scope.geral = {};
    $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
    $scope.vendidas = $scope.processaPecas($scope.usuario.vendido);
 }]);