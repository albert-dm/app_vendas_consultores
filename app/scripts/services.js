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
            this.estoqueId = function(){
                return $http.get("/users/estoqueId");
            }
            this.getRecoveryCode = function(id){
                return $http.get("/login/new-state/"+id);
            }
            this.esqueciSenha = function(login, email){
                return $http.post("/login/esqueci-senha/",{
                    login: login,
                    email: email
                });
            }
            this.novaSenha = function(state, senha){
                return $http.post("/login/nova-senha/",
                {
                    state: state,
                    senha: senha
                });
            }
        })
        .service('loginService', function($localStorage, $http, $location) {    
                this.login = function (usuario) {
                    return $http.post("/login", usuario);                    
                };
                this.check = function(){                    
                    return $localStorage.logado;             
                };
                this.getUser = function(){
                    if ($localStorage.logado==true)
                    return $localStorage.usuario;   
                    else return false;   
                };
                this.logout = function(){
                    delete $localStorage.token;
                    delete $localStorage.usuario;
                    delete $localStorage.logado;
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
            this.entradasLog = function(entrada){
                return $http.get("/historico/pecalog");
            };
        })
        .service('controladoriaService', function($http) {
            this.consultores = function(){
                return $http.get("/users/consultores/num");
            };
            this.supervisores = function(){
                return $http.get("/users/supervisores/num");
            };
        })
        .service('supervisoresService', function($http) {
            this.todos = function(){
                return $http.get("/users/supervisores/");
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
            this.atualizarStatus = function(id, status, enviados){
                return $http.post("/encomendas/atualizar/",
                {
                    _id: id,
                    update: {status: status, enviados: enviados}
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
        .service('acertosService', function($http){
            this.acerto = function(info){
                return $http.post("/acertos/", info);
            }
            this.atualizaHistorico = function(vendas){
                return $http.post("/historico/vendas",
                {
                    vendas: vendas
                }
                );
            };
            this.todos = function(){
                return $http.get("/acertos/");
            }
        })
        .service('apiService', function($http){
            this.cadastro = function(usuario){
                return $http.post("/api/cadastro", usuario);
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

                if (rejection != null && (rejection.status === 401 || rejection.status === 403)) {
                    console.log('Removendo token da sessão')
                    delete $localStorage.token;
                    delete $localStorage.usuario;
                    $localStorage.logado = false;                    
                    //$window.location.reload();
                    if($state.is('Início'))
                        $state.reload();
                    else
                        $state.go('Início');
                } 
                return $q.reject(rejection);
            }

        return interceptor;

    }])
;
