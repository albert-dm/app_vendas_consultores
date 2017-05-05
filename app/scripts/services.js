'use strict';

angular.module('ambaya')
        .service('userService', function($http){
            this.novo = function(usuario){
                return $http.post("/users/register", usuario);
            };
            this.carregaUm = function(id){
                return $http.get("/users/"+id);
            };
            this.deletaUm = function(id){
                return $http.delete("/users/"+id);
            };
        })
        .service('loginService', function($localStorage, $http, $location) {    
                this.login = function (usuario) {
                    return $http.post("/login", usuario);                    
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
                return $http.post("/users/atualizar/",
                {
                    _id: id,
                    update: {estoque: estoque}
                }
                );
            };
            this.entradaEstoque = function(id, entrada){
                return $http.post("/users/entrada/",
                {
                    _id: id,
                    entrada: entrada
                }
                );
            };
            this.atualizaHistorico = function(entrada){
                return $http.post("/historico/entrada",
                {
                    entrada: entrada
                }
                );
            };
        })
        .service('controladoriaService', function($http) {
            this.consultores = function(){
                return $http.get("users/consultores/num");
            };
            this.supervisores = function(){
                return $http.get("users/supervisores/num");
            };
        })
        .service('consultoresService', function($http) {
            this.todos = function(){
                return $http.get("users/consultores/");
            };
            this.porSupervisor = function(id){
                return $http.get("users/consultores/"+id);
            };
            this.aprovar = function(id){
                return $http.post("/users/atualizar/",
                {
                    _id: id,
                    update: {status: 'Aprovado'}
                }
                );
            };
            this.desaprovar = function(id){
                return $http.post("/users/atualizar/",
                {
                    _id: id,
                    update: {status: 'Inativo'}
                }
                );
            }
            this.venda = function(usuario){
                return $http.post("/users/atualizar/",
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
                return $http.get("users/supervisores/");
            };
        })
        .service('encomendasService', function($http) {
            this.nova = function(encomenda){
                return $http.post("/encomendas/", encomenda);
            };
            this.todas = function(){
                return $http.get("/encomendas/");
            };
            this.supervisor = function(id){
                return $http.get("/encomendas/supervisor/"+id);
            };
            this.consultor = function(id){
                return $http.get("/encomendas/consultor/"+id);
            };
            this.excluir = function(id){
                return $http.delete("/encomendas/"+id);
            };
            this.atualizarStatus = function(id, status){
                return $http.post("/encomendas/atualizar/",
                {
                    _id: id,
                    update: {status: status}
                }
                );
            };
            this.totalAprovado = function(){
                return $http.post("/encomendas/total/",
                {
                    status: "Aprovada"
                }
                );
            };
        })
        .factory('tokenInterceptor',['$q', '$window', '$location', '$localStorage', function($q, $window, $location, $localStorage, $state) {

            var interceptor = {};

            interceptor.request = function(config) {
                // enviar o token na requisição
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    //console.log('Enviando token já obtido em cada requisição');
                    config.headers['x-access-token'] = $localStorage.token;
                }
                return config;
            },

            interceptor.response = function (response) {
                var token = response.headers('x-access-token');
                if (token != null) {
                    $localStorage.token = token;
                    //console.log('Token no session storage: ', token);
                } 
                return response;
            },

            interceptor.responseError = function(rejection) {

                if (rejection != null && rejection.status === 401) {
                    console.log('Removendo token da sessão')
                    delete $localStorage.token;
                    $localStorage.logado = false;                    
                    $window.location.reload();
                } 
                return $q.reject(rejection);
            }

        return interceptor;

    }])
;
