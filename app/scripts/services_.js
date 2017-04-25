'use strict';

angular.module('ambaya')
        .service('userService', function($http){
            this.novo = function(usuario){
                return $http.post("https://ambaya.herokuapp.com/users/register", usuario);
            };
            this.carregaUm = function(id){
                return $http.get("https://ambaya.herokuapp.com/users/"+id);
            };
            this.deletaUm = function(id){
                return $http.delete("https://ambaya.herokuapp.com/users/"+id);
            };
        })
        .service('loginService', function($localStorage, $http, $location) {    
                this.login = function (usuario) {
                    return $http.post("https://ambaya.herokuapp.com/users/login", usuario);                    
                };
                this.check = function(){                    
                    return $localStorage.logado;             
                };
                this.getUser = function(){
                    if ($localStorage.logado)
                    return $localStorage.usuario;   
                    else return false;   
                };
                this.logout = function(){
                    $localStorage.logado = false;
                    return;
                };
        })
        .service('estoqueService', function($http) {
            this.atualizaEstoque = function(id, estoque){
                return $http.post("https://ambaya.herokuapp.com/users/atualizar/",
                {
                    _id: id,
                    update: {estoque: estoque}
                }
                );
            };
            this.entradaEstoque = function(id, entrada){
                return $http.post("https://ambaya.herokuapp.com/users/entrada/",
                {
                    _id: id,
                    entrada: entrada
                }
                );
            };
            this.atualizaHistorico = function(entrada){
                return $http.post("https://ambaya.herokuapp.com/historico/entrada",
                {
                    entrada: entrada
                }
                );
            };
        })
        .service('controladoriaService', function($http) {
            this.consultores = function(){
                return $http.get("https://ambaya.herokuapp.com/users/consultores/num");
            };
            this.supervisores = function(){
                return $http.get("https://ambaya.herokuapp.com/users/supervisores/num");
            };
        })
        .service('consultoresService', function($http) {
            this.todos = function(){
                return $http.get("https://ambaya.herokuapp.com/users/consultores/");
            };
            this.porSupervisor = function(id){
                return $http.get("https://ambaya.herokuapp.com/users/consultores/"+id);
            };
            this.aprovar = function(id){
                return $http.post("https://ambaya.herokuapp.com/users/atualizar/",
                {
                    _id: id,
                    update: {status: 'Aprovado'}
                }
                );
            };
            this.desaprovar = function(id){
                return $http.post("https://ambaya.herokuapp.com/users/atualizar/",
                {
                    _id: id,
                    update: {status: 'Inativo'}
                }
                );
            }
            this.venda = function(usuario){
                return $http.post("https://ambaya.herokuapp.com/users/atualizar/",
                {
                    _id: usuario._id,
                    update: {
                        estoque: usuario.estoque,
                        vendido: usuario.vendido,
                        totalVendido: usuario.totalVendido,
                    }
                }
                );
            };
        })
        .service('supervisoresService', function($http) {
            this.todos = function(){
                return $http.get("https://ambaya.herokuapp.com/users/supervisores/");
            };
        })
        .service('encomendasService', function($http) {
            this.nova = function(encomenda){
                return $http.post("https://ambaya.herokuapp.com/encomendas/", encomenda);
            };
            this.todas = function(){
                return $http.get("https://ambaya.herokuapp.com/encomendas/");
            };
            this.supervisor = function(id){
                return $http.get("https://ambaya.herokuapp.com/encomendas/supervisor/"+id);
            };
            this.consultor = function(id){
                return $http.get("https://ambaya.herokuapp.com/encomendas/consultor/"+id);
            };
            this.excluir = function(id){
                return $http.delete("https://ambaya.herokuapp.com/encomendas/"+id);
            };
            this.atualizarStatus = function(id, status){
                return $http.post("https://ambaya.herokuapp.com/encomendas/atualizar/",
                {
                    _id: id,
                    update: {status: status}
                }
                );
            };
            this.totalAprovado = function(){
                return $http.post("https://ambaya.herokuapp.com/encomendas/total/",
                {
                    status: "Aprovada"
                }
                );
            };
        })
;