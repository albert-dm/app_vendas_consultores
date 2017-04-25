//'use strict';

angular.module('ambaya')
	
		//Implementação Ambaya
		.controller('BaseController',['loginService', '$scope', '$state', '$localStorage', function(loginService, $scope, $state, $localStorage){
			$(".button-collapse").sideNav({
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                draggable: true // Choose whether you can drag to open on touch screens
            });
            $scope.usuario = {username: "", password: ""};
            var rotas = {
                    "Consultor": [
                        {nome:"Início", icone:"home"},
                        {nome:"Estoque", icone:"business_center"},
                    ],
                    "Supervisor": [
                        {nome:"Início", icone:"home"},
                        {nome:"Consultores", icone:"people"},
                        {nome:"Estoque", icone:"business_center"},
                        {nome:"Encomendas", icone:"loop"},
                        //{nome:"Acertos", icone:"done_all"},
                    ],
                    "Controladoria": [
                        {nome:"Início", icone:"home"},
                        {nome:"Consultores", icone:"people"},
                        {nome:"Supervisores", icone:"people"},
                        {nome:"Encomendas", icone:"loop"},
                        //{nome:"Relatórios", icone:"assignment"}
                    ],
                    "Estoque": [
                        {nome:"Início", icone:"home"},
                        {nome:"Encomendas", icone:"loop"},
                    ]
            };
            $scope.login = function(){
                loginService.login($scope.usuario).then(
                    function(response) {
                        //console.log(response);
                        $localStorage.usuario = response.data.user;
                        $localStorage.token = response.data.token;
                        $localStorage.logado = true;
                        $scope.usuario = response.data.user;
                        $scope.rotas= rotas[$scope.usuario.tipo];
                        $scope.tipo = $scope.usuario.tipo;
                        $scope.logado = true;
                        $state.reload();
                    },
                    function(response) {
                        Materialize.toast("Login inválido", 3000);
                    }
                );
                // $scope.logado = loginService.check();
                // if($scope.logado){
                //     $scope.usuario = loginService.getUser();;
                //     $state.go("Início");
                //     $scope.rotas= rotas[$scope.usuario.tipo];
                //     $scope.tipo = $scope.usuario.tipo;
                //     $scope.logado = true;
                // } else {
                //     UIkit.notify({
                //         message : "Login Inválido!",
                //         status  : "danger",
                //         timeout : 5000,
                //         pos     : 'bottom-center'
                //     });
                // }
            };
            $scope.sair = function(){
                loginService.logout();
                $scope.logado = false;
                $scope.tipo = "Login";
                if($state.is('Início'))
                    $state.reload();
                else
                    $state.go('Início');
                
            };
            
            $scope.logado = loginService.check();
            if ($scope.logado) {
                $scope.usuario = loginService.getUser();
                $scope.rotas= rotas[$scope.usuario.tipo];
                $scope.tipo = $scope.usuario.tipo;
            }else{
                $scope.tipo = "Login";
                //é necessário redirecionar para o início aqui.
            }           
            $scope.$state = $state;

            //funcoes globais
            $scope.faltamDias = function(diaFuturo) {
                diaFuturo = new Date(diaFuturo);
                return Math.floor((diaFuturo - Date.now())/(24*60*60*1000));
            }; 
            $scope.deletaElemento = function(vetor, index){
                vetor.splice(index, 1);
            }
            $scope.processaPecas = function(estoque){
                var pecas = {
                    "aneis":[],
                    "brincosP": [],
                    "brincosG": [],
                    "cordoesF": [],
                    "cordoesM": [],
                    "pingentes": [],
                    "pulseirasF": [],
                    "pulseirasM": [],
                    "tornozeleiras": [],
                    "escapularios": [],
                    "totais":{
                        "aneis":0,
                        "brincosP": 0,
                        "brincosG": 0,
                        "cordoesF": 0,
                        "cordoesM": 0,
                        "pingentes": 0,
                        "pulseirasF": 0,
                        "pulseirasM": 0,
                        "tornozeleiras": 0,
                        "escapularios": 0
                    }
                }
                var aneis = 0;
                var brincosP = 0;
                var brincosG = 0;
                var cordoesF = 0;
                var cordoesM = 0;
                var pingentes = 0;
                var pulseirasF = 0;
                var pulseirasM = 0;
                var tornozeleiras = 0;
                var escapularios = 0;

                for(i=0; i<estoque.length; i++){
                    tipo = estoque[i].substr(0,2);
                    //mes = peca.splice(2,2);
                    //ano = peca.splice(4,2);
                    valor = estoque[i].substr(6,2);
                    switch(tipo){
                        case "AN":
                            tipo = "aneis";
                            aneis++;
                            break;
                        case "BP":
                            tipo = "brincosP";
                            brincosP++;
                            break;
                        case "BG":
                            tipo = "brincosG";
                            brincosG++;
                            break;
                        case "CF":
                            tipo = "cordoesF";
                            cordoesF++;
                            break;
                        case "CM":
                            tipo = "cordoesM";
                            cordoesM++
                            break;
                        case "PN":
                            tipo = "pingentes";
                            pingentes++;
                            break;
                        case "PF":
                            tipo = "pulseirasF";
                            pulseirasF++;
                            break;
                        case "PM":
                            tipo = "pulseirasM";
                            pulseirasM++;
                            break;
                        case "TZ":
                            tipo = "tornozeleiras";
                            tornozeleiras++
                            break;
                        case "ES":
                            tipo = "escapularios";
                            escapularios++;
                            break;
                    }
                    if(pecas[tipo].length!=0){
                        $.grep(pecas[tipo], function(e){                         
                            if(e.val==valor){
                                    e.tot++;
                                    existe=true;
                                } else{
                                    existe=false;
                                }
                            });
                    } else
                        existe = false;

                    if(!existe){
                        pecas[tipo].push({"val": valor, "tot": 1});
                    }                        
                }
                pecas['totais']={
                        "aneis":aneis,
                        "brincosP": brincosP,
                        "brincosG": brincosG,
                        "cordoesF": cordoesF,
                        "cordoesM": cordoesM,
                        "pingentes": pingentes,
                        "pulseirasF": pulseirasF,
                        "pulseirasM": pulseirasM,
                        "tornozeleiras": tornozeleiras,
                        "escapularios": escapularios
                    };
                return pecas;
            };
            $scope.voltaPecas = function(pecas){
                var estoque = [];
                for(i=0; i<pecas.aneis.length; i++){
                    peca = "ANxxxx"+pecas.aneis[i].val;
                    for(j=0; j<pecas.aneis[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.brincosP.length; i++){
                    peca = "BPxxxx"+pecas.brincosP[i].val;
                    for(j=0; j<pecas.brincosP[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.brincosG.length; i++){
                    peca = "BGxxxx"+pecas.brincosG[i].val;
                    for(j=0; j<pecas.brincosG[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.cordoesF.length; i++){
                    peca = "CFxxxx"+pecas.cordoesF[i].val;
                    for(j=0; j<pecas.cordoesF[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.cordoesM.length; i++){
                    peca = "CMxxxx"+pecas.cordoesM[i].val;
                    for(j=0; j<pecas.cordoesM[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.pingentes.length; i++){
                    peca = "PNxxxx"+pecas.pingentes[i].val;
                    for(j=0; j<pecas.pingentes[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.pulseirasF.length; i++){
                    peca = "PFxxxx"+pecas.pulseirasF[i].val;
                    for(j=0; j<pecas.pulseirasF[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.pulseirasM.length; i++){
                    peca = "PMxxxx"+pecas.pulseirasM[i].val;
                    for(j=0; j<pecas.pulseirasM[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.tornozeleiras.length; i++){
                    peca = "TZxxxx"+pecas.tornozeleiras[i].val;
                    for(j=0; j<pecas.tornozeleiras[i].tot; j++)
                        estoque.push(peca);
                }
                for(i=0; i<pecas.escapularios.length; i++){
                    peca = "ESxxxx"+pecas.escapularios[i].val;
                    for(j=0; j<pecas.escapularios[i].tot; j++)
                        estoque.push(peca);
                }
                return estoque;
            }
            $scope.extraiPreco = function(codigo){
                return codigo.substr(6,2);
            } 
            $scope.extraiCod = function(codigo){
                return codigo.substr(0,2);
            } 
                
		}])
        //Controladoria
        .controller('ControladoriaInicioController',[ '$scope', 'controladoriaService', function($scope, controladoriaService){
            $('.tooltipped').tooltip({delay: 50});
            controladoriaService.consultores().then(
                    function(response) {
                        $scope.consultores=response.data;
                    },
                    function(response) {
                            /*UIkit.notify({
                            message : "Falha ao carregar consultores!",
                            status  : "danger",
                            timeout : 5000,
                            pos     : 'bottom-center'
                        });*/
                    }
            );
            controladoriaService.supervisores().then(
                    function(response) {
                        $scope.supervisores=response.data;
                    },
                    function(response) {
                            /*UIkit.notify({
                            message : "Falha ao carregar consultores!",
                            status  : "danger",
                            timeout : 5000,
                            pos     : 'bottom-center'
                        });*/
                    }
            );
		}])
        .controller('ConsultoresControladoriaController',[ '$scope', 'consultoresService', function($scope, consultoresService){
            $('.tooltipped').tooltip({delay: 50});
            consultoresService.todos().then(
                    function(response) {
                        $scope.consultores = response.data;
                        $scope.total = $scope.consultores.length; 
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar Consultores", 5000);
                    }
            );
		}])
        .controller('SupervisoresController',[ '$scope', 'supervisoresService', 'userService', function($scope, supervisoresService, userService){
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
                selectYears: 150 // Creates a dropdown of 15 years to control year
            });
            //fim ui config

            carregaSupervisores = function(){
                supervisoresService.todos().then(
                    function(response) {
                        $scope.supervisores = response.data;
                        $scope.total = $scope.supervisores.length; 
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar supervisores!", 5000);
                    }
                );
            };
            carregaSupervisores();

            //formulario de adição
            $scope.form = {
                "nome":"",
                "sobrenome":"",
                "tipo":"Supervisor",
                "status": "Aprovado",
                "porcentagem": 10,
                "estoque": [],
                "vendido":[],
                "investidor": false,
                "totalVendido": 0,
                "proxAcerto": Date.now()+45*24*60*60*1000
            };
            $('#adicionar').modal();
            $scope.add = function(){
                $('#adicionar').modal('open');
            }
            $scope.novo = function(){
                var acerto = Date.now()+45*24*60*60*1000;
                $scope.form.username = $scope.form.nome.toLowerCase() +"."+ $scope.form.sobrenome.toLowerCase().replace(" ", ".");
                $scope.form.password = $scope.form.username;
                userService.novo($scope.form).then(
                    function(response) {
                        //console.log(response);
                        $('#adicionar').modal('close');
                        $scope.form = {
                            "nome":"",
                            "sobrenome":"",
                            "tipo":"Supervisor",
                            "status": "Aprovado",
                            "porcentagem": 10,
                            "estoque": [],
                            "vendido":[],
                            "investidor": false,
                            "totalVendido": 0,
                            "proxAcerto": Date.now()+45*24*60*60*1000
                        };
                        Materialize.toast("Supervisor adicionado com sucesso!", 5000);
                        carregaSupervisores();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000);
                    }
                );
                
            };
		}])
        .controller('SupervisorController',[ '$scope', 'supervisoresService', 'userService', 'consultoresService', '$stateParams', function($scope, supervisoresService, userService, consultoresService, $stateParams){
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
                selectYears: 150 // Creates a dropdown of 15 years to control year
            });
            //fim ui config

            var id =  $stateParams.supervisorId;
            userService.carregaUm(id).then(
                    function(response) {
                        $scope.supervisor = response.data;
                        $scope.pecas = $scope.processaPecas($scope.supervisor.estoque);
                    },
                    function(response) {
                        Materialize.toast("Falha ao carregar dados", 5000);
                    }
            );
            var carregaConsultores = function(){
                consultoresService.porSupervisor(id).then(
                    function(response) {
                        $scope.consultores = response.data;
                    },
                    function(response) {
                        Materialize.toast("Falha ao carregar dados", 5000);
                    }
                );
            };
            carregaConsultores();   

            $scope.form = {
                "nome":"",
                "sobrenome":"",
                "tipo":"Consultor",
                "status": "Aprovado",
                "supervisor": id,
                "porcentagem": 30,
                "estoque": [],
                "vendido": [],
                "totalVendido": 0,
                "proxAcerto": Date.now()+45*24*60*60*1000
            };
            $('#adicionar').modal();
            $('#excluir').modal();
            $scope.add = function(){
                $('#adicionar').modal('open');
            }
            $scope.del = function(){
                $('#excluir').modal('open');
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
                            "status": "Aprovado",
                            "supervisor": id,
                            "porcentagem": 30,
                            "estoque": [],
                            "vendido": [],
                            "totalVendido": 0,
                            "proxAcerto": Date.now()+45*24*60*60*1000
                        };
                        carregaConsultores();
                        Materialize.toast("Consultor adicionado com sucesso!", 5000);
                    },
                    function(response) {
                        Materialize.toast("response.err.message", 5000);
                    }
                );                
            };         
           $scope.excluir = function(){
                userService.deletaUm($scope.supervisor._id).then(
                    function(response) {
                        Materialize.toast("Excluido com sucesso!", 5000);
                        window.history.back();
                    },
                    function(response) {
                        Materialize.toast("Falha ao excluir", 5000);
                    }
                );                
           }
		}])
        .controller('ConsultorController',[ '$scope', 'userService', 'consultoresService', 'estoqueService', '$stateParams', function($scope, userService, consultoresService, estoqueService, $stateParams){
            $('.tooltipped').tooltip({delay: 50});            
            $('select').material_select();
            var id =  $stateParams.consultorId;

            userService.carregaUm(id).then(
                    function(response) {
                        $scope.consultor = response.data;
                        $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                        $scope.vendidas = $scope.processaPecas($scope.consultor.vendido);
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar dados!", 3000);
                    }
            );

            $('#excluir').modal();
            $scope.del = function(){
                $('#excluir').modal('open');
            }

            $scope.excluir = function(){
                userService.deletaUm($scope.consultor._id).then(
                    function(response) {
                        Materialize.toast("Excluído com sucesso", 5000);
                        window.history.back();
                    },
                    function(response) {
                        Materialize.toast("Falha ao excluir", 5000);
                    }
                );                
            };
            $scope.aprovar = function(){
                 consultoresService.aprovar(id).then(
                    function(response) {
                        $scope.consultor.status = "Aprovado";
                    },
                    function(response) {
                        Materialize.toast("Falha ao atualizar", 5000);
                    }
                );
            };
            $scope.desaprovar = function(){
                 consultoresService.desaprovar(id).then(
                    function(response) {
                        $scope.consultor.status = "Inativo";
                    },
                    function(response) {
                        Materialize.toast("Falha ao atualizar", 5000);
                    }
                );
            };



            ////Alocaçao das peças
            $scope.codigo = "AN";
            $('#enviar').modal();

            $scope.modalEncomenda = function(){
               var aux;
                  
                $scope.estoqueTemp = [];
                $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);    
                console.log($scope.usuario.estoque);            
                $scope.pecasEnviadas = [];
                $('#enviar').modal('open');
            }
            $scope.enviar = function(){
               estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
                   function(response){
                       estoqueService.entradaEstoque($scope.consultor._id, $scope.pecasEnviadas).then(
                           function(response){
                               $scope.consultor.estoque = $scope.consultor.estoque.concat($scope.pecasEnviadas);
                                $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                               Materialize.toast("Peças Alocadas", 5000);
                           },
                           function(response){
                               Materialize.toast(response.err.message, 5000);
                   }
                       )
                   },
                   function(response){
                       Materialize.toast(response.err.message, 5000);
                   }
               )
                $scope.usuario.estoque = [];
                $scope.usuario.estoque = $scope.usuario.estoque.concat($scope.estoqueTemp);
                $('#enviar').modal('close');
            } 
            $scope.enviado = function(codigo){
                indice = $scope.estoqueTemp.indexOf(codigo);
                cod = $scope.estoqueTemp[indice];
                $scope.deletaElemento($scope.estoqueTemp, indice);
                $scope.pecasEnviadas.push(cod);
            }
            $scope.devolvido = function(codigo){
                indice = $scope.pecasEnviadas.indexOf(codigo);
                cod = $scope.pecasEnviadas[indice];
                $scope.deletaElemento($scope.pecasEnviadas, indice);
                $scope.estoqueTemp.push(cod);
            }
            $scope.porItem = function(item) {
                var cod = item.substr(0,2);
                return ($scope.codigo === cod);
            };
            $('#item').on('change', function(){
                $scope.codigo = $(this).val();
            })
		}])
        .controller('EncomendasControladoriaController',[ '$scope', 'encomendasService', 'consultoresService', function($scope, encomendasService, consultoresService){
           $('.tooltipped').tooltip({delay: 50});
           $(document).ready(function(){
                $('ul.tabs').tabs();
            });
            $scope.status = ['Pendente'];
            $scope.filtroStatus = function(encomenda) {
                return ($scope.status.indexOf(encomenda.status) !== -1);
            };
           $scope.encomendas = {};
           carregaEncomendas = function(){
               encomendasService.todas().then(
                    function(response){
                        $scope.encomendas = response.data;
                    },
                    function(response){
                        Materialize.toas("Falha ao cerregar dados!", 5000);
                    }
                );
           }
           carregaEncomendas();
           $scope.aprovar = function(id){
                encomendasService.atualizarStatus(id, "Aprovada").then(
                    function(response) {
                        carregaEncomendas();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000);
                    }
                )
            } 
            $scope.cancelar = function(id){
                encomendasService.atualizarStatus(id, "Cancelada").then(
                    function(response) {
                        carregaEncomendas();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000);
                    }
                )
            }        
        }])
        //Supervisor
        .controller('SupervisorInicioController',[ '$scope', 'supervisoresService', 'consultoresService', function($scope, supervisoresService, consultoresService){
            $('.tooltipped').tooltip({delay: 50});
            $scope.consultores = {};
            carregaConsultores = function(){
               consultoresService.porSupervisor($scope.usuario._id).then(
                    function(response) {
                        $scope.consultores = response.data;
                        var consultores = {
                            total:0,
                            totalVendido: 0,
                            valorVendido: 0,
                            totalPecas: 0,
                            totalGanho: 0
                        };
                        for (var i=0; i<$scope.consultores.length; i++){
                            consultores.totalVendido += $scope.consultores[i].vendido.length;
                            consultores.valorVendido += $scope.consultores[i].totalVendido;
                            consultores.totalGanho += $scope.consultores[i].totalVendido*$scope.consultores[i].porcentagem/100;
                            consultores.totalPecas += $scope.consultores[i].estoque.length;
                            consultores.total++;
                        }
                        $scope.consultores = consultores;
                    },
                    function(response) {
                         Materialize.toast("Falha ao carregar consultores", 5000);
                    }
                );
           }
           carregaConsultores();
            
		}])
        .controller('ConsultoresSupervisorController',[ '$scope', 'consultoresService', 'userService', function($scope, consultoresService, userService){
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
                selectYears: 150 // Creates a dropdown of 15 years to control year
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
                        $scope.totalPecas = consultores.totalPecas + consultores.totalVendido; //considerando a soma entre pecas vendidas e guardadas por cada consultor
                        $scope.total = $scope.consultores.length;
                    },
                    function(response) {
                         Materialize.toast("Falha ao carregar consultores", 5000);
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
                "proxAcerto": Date.now()+45*24*60*60*1000
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
                            "proxAcerto": Date.now()+45*24*60*60*1000
                        };
                        Materialize.toast("Consultor adicionado com sucesso!", 5000);
                        carregaConsultores();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000);
                    }
                );                
            };   


            

		}])
        .controller('EstoqueSupervisorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
           $('.tooltipped').tooltip({delay: 50});
           $scope.geral = {};
           $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
        }])
        .controller('EncomendasSupervisorController',[ '$scope', 'encomendasService', 'consultoresService', function($scope, encomendasService, consultoresService){
           $('.tooltipped').tooltip({delay: 50});
           $scope.form = {
                "item":"",
                "quantidade":"",
                "donoNome":$scope.usuario.nome,
                "donoId": $scope.usuario._id
            };
            $(document).ready(function(){
                $('ul.tabs').tabs();
            });
            $scope.status = ['Aprovada', 'Enviada', 'Pendente', 'Cancelada'];
            $scope.filtroStatus = function(encomenda) {
                return ($scope.status.indexOf(encomenda.status) !== -1);
            };
           $scope.encomendas = {};
           carregaEncomendas = function(){
               console.log("carregando");
               encomendasService.supervisor($scope.usuario._id).then(
                    function(response){
                        $scope.encomendas = response.data;
                    },
                    function(response){
                        Materialize.toas("Falha ao cerregar dados!", 5000);
                    }
                );
           }
           carregaEncomendas();
           consultoresService.porSupervisor($scope.usuario._id).then(
                function(response) {
                    $scope.consultores = response.data;
                },
                function(response) {
                        Materialize.toast("Falha ao carregar consultores", 5000);
                }
            );
            
            $('#adicionar').modal();
            $scope.add = function(){
                $('select').material_select();
                $('#adicionar').modal('open');
            }
            $scope.novo = function(){
                encomendasService.nova($scope.form).then(
                    function(response) {
                        Materialize.toast("Encomenda adicionada com sucesso!", 5000);
                        $('#adicionar').modal('close');
                        $scope.form = {
                            "item":"",
                            "quantidade":"",
                            "donoNome":$scope.usuario.nome,
                            "donoId": $scope.usuario._id
                        };
                        carregaEncomendas();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000);
                    }
                );                
            };
            $scope.cancelar = function(id){
                encomendasService.atualizarStatus(id, "Cancelada").then(
                    function(response) {
                        carregaEncomendas();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000);
                    }
                )
            }        
        }])
        //Consultor
        .controller('ConsultorInicioController',[ '$scope', 'consultoresService', 'userService', function($scope, consultoresService, userService){
            $('.tooltipped').tooltip({delay: 50});
            $scope.adicionando = [];
            userService.carregaUm($scope.usuario.supervisor).then(
                    function(response) {
                        $scope.supervisor = response.data;
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar dados do supervisor!", 3000, 'white');
                    }
            );
            $('#venda').modal();
            $scope.modalVenda = function(){
                $('#venda').modal('open');
                $('#codigo').focus();
            }
            $scope.entrada = function(){
                $scope.adicionando.push($scope.codigo.toUpperCase());
                $scope.codigo = ""
            }
			$scope.vender = function(){
                var estoqueTemp = $scope.usuario.estoque;
                var vendidoTemp = $scope.usuario.vendido;
                var totalVendidoTemp = $scope.usuario.totalVendido;
                for(var i=0; i <$scope.adicionando.length; i++){
                    var precoAdd = $scope.extraiPreco($scope.adicionando[i]);
                    var codAdd = $scope.extraiCod($scope.adicionando[i]);
                    for (var j=0; j<$scope.usuario.estoque.length; j++){
                        if(precoAdd=== $scope.extraiPreco($scope.usuario.estoque[j]) && codAdd === $scope.extraiCod($scope.usuario.estoque[j])){
                            //Materialize.toast($scope.adicionando[i], 5000);
                            $scope.usuario.vendido.push($scope.usuario.estoque[j])
                            $scope.deletaElemento($scope.usuario.estoque, j);
                            $scope.usuario.totalVendido += Number(precoAdd);
                            console.log($scope.usuario.vendido);
                            //Atualiza totalVendido, vendido e estoque e adicionar 
                            //'adicionando' ao historico de vendas -> na venda ou no acerto?
                            break;
                        }
                    }
                }
                alert("Cehegue");
                consultoresService.venda($scope.usuario).then(
                    function(response){
                        Materialize.toast("Venda Efetivada", 5000);
                    },
                    function(response){
                        $scope.usuario.estoque = estoqueTemp;
                        $scope.usuario.vendido = vendidoTemp;
                        $scope.usuario.totalVendido = totalVendidoTemp;
                        Materialize.toast("Falha ao realizar venda!", 5000);
                    }
                );
                $('#venda').modal('close');
                $scope.adicionando = [];
            };
		}])
        .controller('EstoqueConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
           $('.tooltipped').tooltip({delay: 50});
           $scope.geral = {};
           $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
           $scope.vendidas = $scope.processaPecas($scope.usuario.vendido);
        }])
        //Estoque
        .controller('EstoqueInicioController',[ '$scope', 'estoqueService', 'encomendasService', function($scope, estoqueService, encomendasService){
            $('.tooltipped').tooltip({delay: 50});
            $('#entrada').modal();
            $('select').material_select();
            $scope.adicionando = [];
            $scope.encomendas = {};
            $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
            encomendasService.totalAprovado().then(
                function(response){
                    $scope.encomendas = response.data;
                },
                function(response){
                    Materialize.toast("Falha ao carregar dados", 5000);
                }
            );
            $scope.codigo = "";
            $scope.abrir = function(){
                $('#entrada').modal('open');
                $('#codigo').focus();
            }
            $scope.entrada = function(){
                var item = $('#item').find(":selected").text();
                var preco = $('#preco').val();
                var quantidade = $('#quantidade').val();
                var codigo = $('#item').find(":selected").val();
                var hoje = new Date();
                var mes = hoje.getMonth()+1;
                var ano = hoje.getFullYear();
                ano  = ano%100;
                if(mes<10) {
                    mes='0'+mes;
                } 
                codigo = codigo+mes+ano+preco;
                var entrada = {
                    "item": item,
                    "preco": preco,
                    "quantidade": quantidade,
                    "codigo": codigo
                };
                $scope.adicionando.push(entrada);
            }
            $scope.concluir = function(){
                //deve existir possibilidade de cancelar última adição
                var adicionando = [];
                for(i = 0; i< $scope.adicionando.length; i++){
                    for(j = 0; j<$scope.adicionando[i].quantidade; j++)
                        adicionando.push($scope.adicionando[i].codigo);
                }
                console.log(adicionando);
                $scope.adicionando = adicionando;
                var estoque = $scope.usuario.estoque.concat(adicionando);
                estoqueService.atualizaEstoque($scope.usuario._id, estoque).then(
                    function(response){
                        estoqueService.atualizaHistorico(adicionando);
                        $scope.usuario.estoque = estoque;
                        $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
                        $scope.imprimir();
                        $scope.adicionando = [];
                        $('#entrada').modal('close');
                    },
                    function(response){
                        Materialize.toast("Falha ao acessar o servidor", 5000);
                    }
                )
            }
            $scope.imprimir = function(){
                var divToPrint=document.getElementById('impressao');

                var newWin=window.open('','Print-Window');

                newWin.document.open();

                newWin.document.write('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="/styles/barras.css" rel="stylesheet"></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

                newWin.document.close();

                //setTimeout(function(){newWin.close();},10);
            }
            $scope.bc = {
                format: 'CODE128',
                lineColor: '#000000',
                width: 1,
                height: 25,
                displayValue: true,
                fontOptions: '',
                font: 'monospace',
                textAlign: 'center',
                textPosition: 'bottom',
                textMargin: 1,
                fontSize: 10,
                background: '#ffffff',
                margin: 0,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                valid: function (valid) {
                }
            }
		}])
        .controller('EncomendasEstoqueController',[ '$scope', 'encomendasService', 'consultoresService', 'userService', 'estoqueService', function($scope, encomendasService, consultoresService, userService, estoqueService){
           $(document).ready(function(){
                $('ul.tabs').tabs();
                $('.collapsible').collapsible();
            });
            $('#enviar').modal();
            $scope.status = ['Aprovada'];
            $scope.codigo = ['BG'];
            $scope.estoqueTemp = [];
            $scope.filtroStatus = function(encomenda) {
                return ($scope.status.indexOf(encomenda.status) !== -1);
            };
            $scope.porItem = function(item) {
                var cod = item.substr(0,2);
                return ($scope.codigo.indexOf(cod) !== -1);
            };
           $scope.encomendas = {};
           carregaEncomendas = function(){
               encomendasService.todas().then(
                    function(response){
                        $scope.encomendas = response.data;
                        $('.tooltipped').tooltip({delay: 50});
                    },
                    function(response){
                        Materialize.toast("Falha ao cerregar dados!", 5000);
                    }
                );
           }
           carregaEncomendas();
           $scope.modalEncomenda = function(encomenda){
               var aux;
               switch(encomenda.item){
                    case "Anel":
                        $scope.codigo = ['AN'];
                        break;
					case "Brinco Pequeno":
                        $scope.codigo = ['BP'];
                        break;
					case "Brinco Grande":
                        $scope.codigo = ['BG'];
                        break;
					case "Cordão Feminino":
                        $scope.codigo = ['CF'];
                        break;
					case "Cordão Masculino":
                        $scope.codigo = ['CM'];
                        break;
					case "Pingente":
                        $scope.codigo = ['PN'];
                        break;
					case "Pulseira Feminina":
                        $scope.codigo = ['PF'];
                        break;
					case "Pulseira Masculina":
                        $scope.codigo = ['PM'];
                        break;
					case "Escapulário":
                        $scope.codigo = ['ES'];
                        break;
					case "Personalizado":
                        $scope.codigo = [''];
                        break;
					case "Reposição padrão":
                        $scope.codigo = ['AN', 'BP', 'BG', 'CF', 'CM', 'PN', 'PF', 'PM', 'ES'];
                        break;
               }
                
                $scope.encomendaAtual = encomenda;
                $scope.estoqueTemp = [];
                $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);    
                console.log($scope.usuario.estoque);            
                $scope.pecasEnviadas = [];
                $('#enviar').modal('open');
            }
           $scope.enviar = function(){
               estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
                   function(response){
                       estoqueService.entradaEstoque($scope.encomendaAtual.donoId, $scope.pecasEnviadas).then(
                           function(response){
                               encomendasService.atualizarStatus($scope.encomendaAtual._id, "Enviada").then(
                                    function(response) {
                                        Materialize.toast("Enviada!", 5000);
                                        carregaEncomendas();
                                    },
                                    function(response) {
                                        Materialize.toast(response.err.message, 5000);
                                    }
                                )
                           },
                           function(response){
                               Materialize.toast(response.err.message, 5000);
                   }
                       )
                   },
                   function(response){
                       Materialize.toast(response.err.message, 5000);
                   }
               )
                $scope.usuario.estoque = [];
                $scope.usuario.estoque = $scope.usuario.estoque.concat($scope.estoqueTemp);
                $('#enviar').modal('close');
            } 
            $scope.enviado = function(codigo){
                indice = $scope.estoqueTemp.indexOf(codigo);
                cod = $scope.estoqueTemp[indice];
                $scope.deletaElemento($scope.estoqueTemp, indice);
                $scope.pecasEnviadas.push(cod);
            }
            $scope.devolvido = function(codigo){
                indice = $scope.pecasEnviadas.indexOf(codigo);
                cod = $scope.pecasEnviadas[indice];
                $scope.deletaElemento($scope.pecasEnviadas, indice);
                $scope.estoqueTemp.push(cod);
            }
            
               
        }])
;
	