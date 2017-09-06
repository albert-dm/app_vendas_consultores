//'use strict';

angular.module('ambaya')
.controller('ConsultoresSupervisorController',[ '$scope', 'consultoresService', 'userService', function($scope, consultoresService, userService){
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
    carregaConsultores = function(){
        consultoresService.porSupervisor($scope.usuario._id).then(
             function(response) {
                 $scope.consultores = response.data;
                 var consultores = {
                     total:0,
                     totalVendido: 0,
                     valorVendido: 0,
                     totalPecas: 0
                 };
                 for (var i=0; i<$scope.consultores.length; i++){
                     consultores.totalVendido += $scope.consultores[i].vendido.length;
                     consultores.valorVendido += $scope.consultores[i].totalVendido;
                     consultores.totalPecas += $scope.consultores[i].estoque.length;
                 }
                 $scope.valorVendido = consultores.valorVendido;
                 $scope.totalVendido = consultores.totalVendido;
                 $scope.totalPecas = consultores.totalPecas + consultores.totalVendido; //considerando a soma entre pecas vendidas e guardadas por cada consultor
                 $scope.total = $scope.consultores.length;
             },
             function(response) {
                  Materialize.toast("Falha ao carregar consultores", 5000, 'notificacaoRuim');
             }
         );
    }
    carregaConsultores();

     $scope.form = {
         "nome":"",
         "sobrenome":"",
         "tipo":"Consultor",
         "supervisor": $scope.usuario._id,
         "porcentagem": 30,
         "estoque": [],
         "vendido": [],
         "totalVendido": 0,
         "proxAcerto": Date.now()+45*24*60*60*1000,
         "tipoTaxa":"Primeiro pagamento", 
         "taxa": 350
     };
     $('#adicionar').modal();
     $scope.add = function(){
         $('#adicionar').modal('open');
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
                     "supervisor": $scope.usuario._id,
                     "porcentagem": 30,
                     "estoque": [],
                     "vendido": [],
                     "totalVendido": 0,
                     "proxAcerto": Date.now()+45*24*60*60*1000,
                     "tipoTaxa":"Primeiro pagamento", 
                     "taxa": 350
                 };
                 Materialize.toast("Consultor adicionado com sucesso!", 5000, 'notificacaoBoa');
                 carregaConsultores();
             },
             function(response) {
                 Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
             }
         );                
     };   


     

 }]);