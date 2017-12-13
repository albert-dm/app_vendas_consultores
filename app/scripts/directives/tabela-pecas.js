angular.module('ambaya')
.directive('tabelaPecas', ['pecasService', function(pecasService){
    return{
        restrict: 'E',
        scope:{
            vetorPecas: '=pecas'
        },
        template:'<div class="row">'+
                    '<div class="col m5 s12">'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Anéis ({{pecas.totais.aneis}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.aneis | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Brincos P ({{pecas.totais.brincosP}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.brincosP | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Brincos G ({{pecas.totais.brincosG}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.brincosG | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Cordões Fem. ({{pecas.totais.cordoesF}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.cordoesF | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Cordões Masc. ({{pecas.totais.cordoesM}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.cordoesM | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="col m5 s12 offset-m1">'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Pingentes ({{pecas.totais.pingentes}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.pingentes | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Pulseiras Fem. ({{pecas.totais.pulseirasF}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.pulseirasF | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Pulseiras Masc. ({{pecas.totais.pulseirasM}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.pulseirasM | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Tornozeleiras ({{pecas.totais.tornozeleiras}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.tornozeleiras | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Escapulários ({{pecas.totais.escapularios}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.escapularios | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                        '<ul class="collection with-header">'+
                            '<li class="collection-header"><b>Personalizadas ({{pecas.totais.personalizadas}})</b></li>'+
                            '<li class="collection-item" ng-repeat="peca in pecas.personalizadas | orderBy:\'-val\'"><span class="badge">{{peca.tot}}</span><div>{{peca.val | currency: \'R$\'}}</div></li>'+
                        '</ul>'+
                    '</div>'+
                '</div>',
        link: function(scope){
            scope.pecas = pecasService.processaPecas(scope.vetorPecas);
            console.log(scope.vetorPecas);
            scope.$watch('vetorPecas', function(newValue, oldValue) {
                if (newValue)
                    scope.pecas = pecasService.processaPecas(newValue);
            }, true);
        }
    }
}]);