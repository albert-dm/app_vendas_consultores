'use strict';

angular.module('ambaya', ['ui.router', 'ngStorage', 'angular-barcode', 'nvd3'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide){
    $httpProvider.interceptors.push('tokenInterceptor');
    $provide.decorator('$locale', ['$delegate', function ($delegate) {
        $delegate.NUMBER_FORMATS.DECIMAL_SEP = ',';
        $delegate.NUMBER_FORMATS.GROUP_SEP = '.';
        return $delegate;
    }]);    
    $urlRouterProvider.otherwise('inicio');
    var inicio = {
        name: 'Início',
        url: '/inicio', 
        views: {
            'Consultor':{
                templateUrl: 'views/consultor/inicio.html',
                controller: 'ConsultorInicioController'
            },
            'Supervisor':{
                templateUrl: 'views/supervisor/inicio.html',
                controller: 'SupervisorInicioController'
            },
            'Controladoria':{
                templateUrl: 'views/controladoria/inicio.html',
                controller: 'ControladoriaInicioController'
            },
            'Estoque':{
                templateUrl: 'views/estoque/inicio.html',
                controller: 'EstoqueInicioController'
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var consultores = {
        name: 'Consultores',
        url: '/consultores', 
        views: {
            'Supervisor':{
                templateUrl: 'views/supervisor/consultores.html',
                controller: "ConsultoresSupervisorController"
            },
            'Controladoria':{
                templateUrl: 'views/controladoria/consultores.html',
                controller: "ConsultoresControladoriaController"
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var consultor = {
        name: 'Consultor',
        url: '/consultor/{consultorId}', 
        views: {
            'Supervisor':{
                templateUrl: 'views/supervisor/consultor.html',
                controller: "ConsultorController"
            },
            'Controladoria':{
                templateUrl: 'views/controladoria/consultor.html',
                controller: "ConsultorController"
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var supervisores = {
        name: 'Supervisores',
        url: '/supervisores', 
        views: {
            'Controladoria':{
                templateUrl: 'views/controladoria/supervisores.html',
                controller: "SupervisoresController"
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var supervisor = {
        name: 'Supervisor',
        url: '/supervisor/{supervisorId}', 
        controller: '',
        views: {
            'Controladoria':{
                templateUrl: 'views/controladoria/supervisor.html',
                controller: "SupervisorController"
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var acertos = {
        name: 'Acertos',
        url: '/acertos', 
        controller: '',
        views: {
            'Supervisor':{
                templateUrl: 'views/supervisor/acertos.html'
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var estoque = {
        name: 'Estoque',
        url: '/estoque', 
        controller: '',
        views: {
            'Supervisor':{
                templateUrl: 'views/supervisor/estoque.html',
                controller: "EstoqueSupervisorController"
            },
            'Consultor':{
                templateUrl: 'views/consultor/estoque.html',
                controller: "EstoqueConsultorController"
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var etiquetas = {
        name: 'Etiquetas',
        url: '/etiquetas', 
        controller: '',
        views: {
            'Estoque':{
                templateUrl: 'views/estoque/etiquetas.html',
                controller: 'EtiquetasController'
            },
        },
    };
    var encomendas = {
        name: 'Encomendas',
        url: '/encomendas', 
        controller: '',
        views: {
            'Supervisor':{
                templateUrl: 'views/supervisor/encomendas.html',
                 controller: 'EncomendasSupervisorController'
            },
            'Estoque':{
                templateUrl: 'views/estoque/encomendas.html',
                controller: 'EncomendasEstoqueController'
            },
            'Controladoria':{
                templateUrl: 'views/controladoria/encomendas.html',
                controller: 'EncomendasControladoriaController'
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var relatorios = {
        name: 'Relatórios',
        url: '/relatorios', 
        controller: '',
        views: {
            'Controladoria':{
                templateUrl: 'views/controladoria/relatorios.html',
                controller: 'RelatoriosController'
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var historico = {
        name: 'Histórico',
        url: '/historico', 
        views: {
            'Consultor':{
                templateUrl: 'views/consultor/historico.html',
                controller: "HistoricoConsultorController"
            },
            'Login':{
                templateUrl: 'login.html'
            }
        },
    };
    var cadastro = {
        name: 'Cadastro',
        url: '/cadastro', 
        views: {
            'Login':{
                templateUrl: 'cadastro.html',
                controller: "CadastroController"
            }
        },
    };
    var esqueciSenha = {
        name: 'Esqueci',
        url: '/esqueci-senha', 
        views: {
            'Login':{
                templateUrl: 'esqueci-senha.html',
                controller: "EsqueciSenhaController"
            }
        },
    };
    var recuperarSenha = {
        name: 'Recuperar',
        url: '/recuperar-senha/{state}', 
        views: {
            'Login':{
                templateUrl: 'recuperar-senha.html',
                controller: "RecuperarSenhaController"
            }
        },
    };

    var kits = {
        name: 'Kits',
        url: '/kits', 
        views: {
            'Estoque':{
                templateUrl: 'views/estoque/kits.html',
                controller: "KitsController"
            },
            'Supervisor':{
                templateUrl: 'views/supervisor/kits.html',
                controller: "KitsController"
            }
        },
    };

    var indicacoes = {
        name: 'Indicações',
        url: '/indicacoes', 
        views: {
            'Consultor':{
                templateUrl: 'views/consultor/indicacoes.html',
                controller: "IndicacoesConsultorController"
            }
        },
    };
    $stateProvider.state(inicio);
    $stateProvider.state(consultores);
    $stateProvider.state(consultor);
    $stateProvider.state(supervisores);
    $stateProvider.state(supervisor);
    $stateProvider.state(acertos);
    $stateProvider.state(estoque);
    $stateProvider.state(etiquetas);
    $stateProvider.state(encomendas);
    $stateProvider.state(relatorios);
    $stateProvider.state(historico);
    $stateProvider.state(cadastro);
    $stateProvider.state(esqueciSenha);
    $stateProvider.state(recuperarSenha);
    $stateProvider.state(kits);
    $stateProvider.state(indicacoes);
})
;