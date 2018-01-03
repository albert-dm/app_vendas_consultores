angular.module('ambaya')
.service('dataService', [function(){
    var dataService = this;
    var meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]
    dataService.nomeMes = function(num){
        return meses[num];
    }
}])