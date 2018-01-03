angular.module('ambaya')
.directive('tabelaTotaisPecas', ['pecasService', function(pecasService){
    return{
        restrict: 'E',
        scope:{
            vetorPecas: '=pecas'
        },
        template:'<table>'+
                    '<thead>'+
                        '<tr>'+
                            '<th>AN</th>'+
                            '<th>BP</th>'+
                            '<th>BG</th>'+
                            '<th>CF</th>'+
                            '<th>CM</th>'+
                            '<th>PN</th>'+
                            '<th>PF</th>'+
                            '<th>PM</th>'+
                            '<th>TZ</th>'+
                            '<th>ES</th>'+
                            '<th>PZ</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr>'+
                        '<td>{{totais.aneis}}</td>'+
                        '<td>{{totais.brincosP}}</td>'+
                        '<td>{{totais.brincosG}}</td>'+
                        '<td>{{totais.cordoesF}}</td>'+
                        '<td>{{totais.cordoesM}}</td>'+
                        '<td>{{totais.pingentes}}</td>'+
                        '<td>{{totais.pulseirasF}}</td>'+
                        '<td>{{totais.pulseirasM}}</td>'+
                        '<td>{{totais.tornozeleiras}}</td>'+
                        '<td>{{totais.escapularios}}</td>'+
                        '<td>{{totais.personalizadas}}</td>'+
                   ' </tr>'+
                    '</tbody>'+
                '</table>',
        link: function(scope){
            scope.totais = pecasService.processaPecas(scope.vetorPecas).totais;
            scope.$watch('vetorPecas', function(newValue, oldValue) {
                if (newValue)
                    scope.totais = pecasService.processaPecas(newValue).totais;
            }, true);
        }
    };
}]);