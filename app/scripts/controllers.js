//'use strict';

angular.module('ambaya')
	
		//Implementação Ambaya
		.controller('BaseController',['userService', 'loginService', '$scope', '$state', '$localStorage', function(userService, loginService, $scope, $state, $localStorage){
			$(".button-collapse").sideNav({
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                draggable: true // Choose whether you can drag to open on touch screens
            });
            $scope.usuario = {username: "", password: ""};
            var rotas = {
                    "Consultor": [
                        {nome:"Início", icone:"home"},
                        {nome:"Estoque", icone:"business_center"},
                        {nome:"Histórico", icone:"history"},
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
                        {nome:"Etiquetas", icone:"local_offer"},
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
                        Materialize.toast("Login inválido", 5000, 'notificacaoRuim');
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

            $scope.carregaDados = function() {
                userService.carregaUm($scope.usuario._id).then(
                    function(response) {
                        $scope.usuario = response.data;
                        $scope.rotas= rotas[$scope.usuario.tipo];
                        $scope.tipo = $scope.usuario.tipo;
                    },
                    function(response) {
                        Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
                        $scope.sair();
                    }
                );
            }
            
            $scope.logado = loginService.check();
            if ($scope.logado) {
                console.log("logado");
                $scope.usuario = loginService.getUser();
                $scope.carregaDados();
            }else{
                $scope.tipo = "Login";
                //é necessário notificacaoRuimirecionar para o início aqui.
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
                console.log(estoque);
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
                    "personalizadas": [],
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
                        "escapularios": 0,
                        "personalizadas": 0
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
                var personalizadas = 0;

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
                        case "PZ":
                            tipo = "personalizadas";
                            personalizadas++;
                            break;
                    }
                    existe = false;
                    for(n = 0; n<pecas[tipo].length; n++){
                        if(pecas[tipo][n].val == valor){
                            pecas[tipo][n].tot++;
                            existe = true;
                        }
                    }

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
                        "escapularios": escapularios,
                        "personalizadas": personalizadas
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
                for(i=0; i<pecas.personalizadas.length; i++){
                    peca = "PZxxxx"+pecas.escapularios[i].val;
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
            $scope.irPara = function(pagina){
                $state.go(pagina);
            }
            $scope.opcoesPecas = [{'val':"AN", 'label':'Anéis'},
								{'val':"BG", 'label':'Brinco Grande'},
								{'val':"BP", 'label':'Brinco Pequeno'},
								{'val':"CF", 'label':'Cordão Feminino'},
								{'val':"CM", 'label':'Cordão Masculino'},
								{'val':"PN", 'label':'Pingente'},
								{'val':"PF", 'label':'Pulseira Feminina'},
								{'val':"PM", 'label':'Pulseira Masculina'},
								{'val':"TZ", 'label':'Tornozeleira'},
								{'val':"ES", 'label':'Escapulário'},
								{'val':"PZ", 'label':'Personalizada'}];
                
		}])
        //Controladoria
        .controller('ControladoriaInicioController',[ '$scope', 'controladoriaService', function($scope, controladoriaService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});
            controladoriaService.consultores().then(
                    function(response) {
                        $scope.consultores=response.data;
                    },
                    function(response) {
                        Materialize.toast("Falha ao carregar Consultores", 5000, 'notificacaoRuim');
                    }
            );
            controladoriaService.supervisores().then(
                    function(response) {
                        $scope.supervisores=response.data;
                    },
                    function(response) {
                       Materialize.toast("Falha ao carregar Supervisores", 5000, 'notificacaoRuim');
                    }
            );
		}])
        .controller('ConsultoresControladoriaController',[ '$scope', 'consultoresService', function($scope, consultoresService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});
            consultoresService.todos().then(
                    function(response) {
                        $scope.consultores = response.data;
                        $scope.total = $scope.consultores.length; 
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar Consultores", 5000, 'notificacaoRuim');
                    }
            );
		}])
        .controller('SupervisoresController',[ '$scope', 'supervisoresService', 'userService', function($scope, supervisoresService, userService){
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

            carregaSupervisores = function(){
                supervisoresService.todos().then(
                    function(response) {
                        $scope.supervisores = response.data;
                        $scope.total = $scope.supervisores.length; 
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar supervisores!", 5000, 'notificacaoRuim');
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
                        Materialize.toast("Supervisor adicionado com sucesso!", 5000, 'notificacaoBoa');
                        carregaSupervisores();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                    }
                );
                
            };
		}])
        .controller('SupervisorController',[ '$scope', 'supervisoresService', 'userService', 'consultoresService', '$stateParams', function($scope, supervisoresService, userService, consultoresService, $stateParams){
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

            var id =  $stateParams.supervisorId;
            userService.carregaUm(id).then(
                    function(response) {
                        $scope.supervisor = response.data;
                        $scope.pecas = $scope.processaPecas($scope.supervisor.estoque);
                    },
                    function(response) {
                        Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
                    }
            );
            var carregaConsultores = function(){
                consultoresService.porSupervisor(id).then(
                    function(response) {
                        $scope.consultores = response.data;
                    },
                    function(response) {
                        Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
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
                "proxAcerto": Date.now()+45*24*60*60*1000,
                "tipoTaxa":"Primeiro pagamento", 
                "taxa": 350
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
                            "proxAcerto": Date.now()+45*24*60*60*1000,
                            "tipoTaxa":"Primeiro pagamento", 
                            "taxa": 350
                        };
                        carregaConsultores();
                        Materialize.toast("Consultor adicionado com sucesso!", 5000, 'notificacaoBoa');
                    },
                    function(response) {
                        Materialize.toast("response.err.message", 5000, 'notificacaoRuim');
                    }
                );                
            };         
           $scope.excluir = function(){
                userService.deletaUm($scope.supervisor._id).then(
                    function(response) {
                        Materialize.toast("Excluido com sucesso!", 5000, 'notificacaoBoa');
                        window.history.back();
                    },
                    function(response) {
                        Materialize.toast("Falha ao excluir", 5000, 'notificacaoRuim');
                    }
                );                
           }
		}])
        .controller('ConsultorController',[ '$scope', '$state', 'userService', 'consultoresService', 'estoqueService', '$stateParams', 'acertosService', function($scope, $state, userService, consultoresService, estoqueService, $stateParams, acertosService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});            
            
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 150, // Creates a dropdown of 15 years to control year
                closeOnSelect: true
            });
            var info;
            var id =  $stateParams.consultorId;
            var tipoTemp;
            var taxaTemp;
            var parcelaTemp;

            userService.carregaUm(id).then(
                    function(response) {
                        $scope.consultor = response.data;
                        $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                        $scope.vendidas = $scope.processaPecas($scope.consultor.vendido);
                        $scope.devido = $scope.consultor.totalVendido - $scope.consultor.totalVendido*$scope.consultor.porcentagem/100 + $scope.consultor.pendente;

                         //configuração de taxa
                        if($scope.consultor.tipoTaxa === "Porcentagem"){
                            $scope.parcelaTaxa = 0.1*$scope.consultor.totalVendido;
                        }else{
                            $scope.parcelaTaxa = 350;
                        }
                        if($scope.consultor.taxa <=0)
                            $scope.parcelaTaxa = 0;
                        if($scope.consultor.taxa < $scope.parcelaTaxa)
                            $scope.parcelaTaxa = $scope.consultor.taxa;
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar dados!", 5000, 'notificacaoRuim');
                    }
            );

            $('.modal').modal();
            $scope.del = function(){
                $('#excluir').modal('open');
            }
            $scope.atualizaTaxa = function(){
                consultoresService.tipoTaxa($scope.consultor).then(
                    function(res){
                         Materialize.toast("Tipo selecionado!", 5000, 'notificacaoBoa');
                    },
                    function(res){
                        $scope.consultor.tipoTaxa = tipoTemp;
                        $scope.consultor.taxa = taxaTemp;
                        $scope.parcelaTaxa = parcelaTemp;
                        Materialize.toast("Falha ao slecionar!", 5000, 'notificacaoRuim');
                    }
                );
            }
            $scope.mudaTaxa = function(){
                tipoTemp = $scope.consultor.tipoTaxa;
                taxaTemp = $scope.consultor.taxa;
                parcelaTemp = $scope.parcelaTaxa;
                if($scope.consultor.tipoTaxa === "À vista"){
                    $('#avista').modal('open');
                }else if($scope.consultor.tipoTaxa === "Porcentagem"){
                    $scope.consultor.taxa = 370;
                    $scope.parcelaTaxa = 0.1*$scope.consultor.totalVendido;
                    $scope.atualizaTaxa();
                }else{
                    $scope.consultor.taxa = 350;
                    $scope.parcelaTaxa = 350;
                    $scope.atualizaTaxa();
                }
            }
            $scope.confirmaPagamento = function(){
                $scope.consultor.taxa = 0;
                $scope.parcelaTaxa = 0;
                $scope.consultor.tipoTaxa = "Á vista";
                $scope.atualizaTaxa();
            }
            $scope.excluir = function(){
                userService.deletaUm($scope.consultor._id).then(
                    function(response) {
                        Materialize.toast("Excluído com sucesso", 5000, 'notificacaoBoa');
                        window.history.back();
                    },
                    function(response) {
                        Materialize.toast("Falha ao excluir", 5000, 'notificacaoRuim');
                    }
                );                
            };
            $scope.aprovar = function(){
                 consultoresService.aprovar(id).then(
                    function(response) {
                        $scope.consultor.status = "Aprovado";
                    },
                    function(response) {
                        Materialize.toast("Falha ao atualizar", 5000, 'notificacaoRuim');
                    }
                );
            };
            $scope.desaprovar = function(){
                 consultoresService.desaprovar(id).then(
                    function(response) {
                        $scope.consultor.status = "Inativo";
                    },
                    function(response) {
                        Materialize.toast("Falha ao atualizar", 5000, 'notificacaoRuim');
                    }
                );
            };



            ////Alocaçao das peças
            $('#enviar').modal();

            $scope.modalEncomenda = function(){
               var aux;
                //$('select').material_select();
                $scope.codigo = "AN";
                $scope.estoqueTemp = [];
                $scope.pecasEnviadas = [];
                $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);    
                $scope.pecasEnviadas = $scope.pecasEnviadas.concat($scope.consultor.estoque);    
                console.log($scope.usuario.estoque);            
                $('#enviar').modal('open');
            }
            $scope.enviar = function(){
               estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
                   function(response){
                       estoqueService.atualizaEstoque($scope.consultor._id, $scope.pecasEnviadas).then(
                           function(response){
                               $scope.consultor.estoque = $scope.pecasEnviadas
                                $scope.pecas = $scope.processaPecas($scope.consultor.estoque);
                               Materialize.toast("Peças Alocadas", 5000, 'notificacaoBoa');
                           },
                           function(response){
                               Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                   }
                       )
                   },
                   function(response){
                       Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
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
            };/*
            $('#item').on('change', function(){
                var cod = $(this).val();
                $scope.codigo = cod;
            });
            $scope.$watch($scope.codigo, function(newVal, oldVal){
                console.log(newVal);
            }, true);*/

            //Realização de acerto
            $('#acerto').modal();
            $scope.modalAcerto = function(){
                $('#acerto').modal('open');
            };
            $scope.acerto = function(){
                $scope.consultor.taxa = $scope.consultor.taxa - $scope.parcelaTaxa;
                if($scope.consultor.taxa <1) $scope.consultor.taxa = 0;
                var info = {
                            "userNome": $scope.consultor.nome,
                            "userId": $scope.consultor._id,
                            "tipo": "Consultor",
                            "valor": $scope.devido,
                            "pecas": $scope.consultor.vendido,
                            "taxa": $scope.consultor.parcelaTaxa
                        }
                $scope.consultor.vendido = [];
                console.log(info);
                consultoresService.acerto($scope.consultor).then(
                    function(response){
                        acertosService.acerto(info).then(
                            function(response){
                                acertosService.atualizaHistorico(info.pecas).then(
                                    function(){
                                        $scope.vendidas = $scope.processaPecas($scope.consultor.vendido);
                                        $scope.usuario.totalVendido += $scope.consultor.totalVendido;
                                        $scope.consultor.totalVendido = 0;
                                        $scope.devido = 0;
                                        $('#acerto').modal('close');
                                        consultoresService.venda($scope.usuario).then(
                                            function(res){
                                                Materialize.toast('Acerto realizado com sucesso!', 5000, 'notificacaoBoa');
                                            }
                                        );
                                    },
                                    function(){
                                        Materialize.toast('Falha ao salvar historico!', 5000, 'notificacaoRuim');
                                    }
                                )
                            },
                            function(response){
                                Materialize.toast('Falha ao adicionar acerto!', 5000, 'notificacaoRuim');
                            }
                        );
                    },
                    function(response){
                        Materialize.toast('Falha ao atualizar consultor!', 5000, 'notificacaoRuim');
                    }
                )
            };

            //Edição de consultor
            $scope.modalProxAcerto = function(){
                $('#editar').modal('open');
            };
            $scope.novoProxAcerto = function(){
             consultoresService.atualizaProxAcerto($scope.consultor, $scope.formEdit.proxAcerto.$viewValue).then(
                    function(response) {
                        $('#editar').modal('close');
                        $state.transitionTo($state.current, $stateParams, { 
                            reload: true, inherit: false, notify: true
                        });
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar dados!", 5000, 'notificacaoRuim');
                    }
            );
            }
        
		}])
        .controller('EncomendasControladoriaController',[ '$scope', 'encomendasService', 'consultoresService', function($scope, encomendasService, consultoresService){
           $scope.carregaDados();
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
                        Materialize.toas("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
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
                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                    }
                )
            } 
            $scope.cancelar = function(id){
                encomendasService.atualizarStatus(id, "Cancelada").then(
                    function(response) {
                        carregaEncomendas();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                    }
                )
            }        
        }])
        //Supervisor
        .controller('SupervisorInicioController',[ '$scope', 'supervisoresService', 'consultoresService', function($scope, supervisoresService, consultoresService){
            $scope.carregaDados();
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
                         Materialize.toast("Falha ao carregar consultores", 5000, 'notificacaoRuim');
                    }
                );
           }
           carregaConsultores();
            
		}])
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


            

		}])
        .controller('EstoqueSupervisorController',[ '$scope', 'userService', 'estoqueService', function($scope, userService, estoqueService){
           $scope.carregaDados();
           $('.tooltipped').tooltip({delay: 50});
           $scope.geral = {};
           $scope.pecas = $scope.processaPecas($scope.usuario.estoque);


           //devolução de peças
            $('#enviar').modal();
            userService.estoqueId().then(
                function(response){
                    $scope.estoqueId = response.data;
                },
                function(){
                    Materialize.toast("Falha ao carregar dados, recarregue a página e tente novamente.", 5000, 'notificacaoRuim');
                }
            )
            $scope.modalEncomenda = function(){
               var aux;
                $scope.codigo = "AN";
                $scope.estoqueTemp = [];
                $scope.pecasEnviadas = [];
                $scope.estoqueTemp = $scope.estoqueTemp.concat($scope.usuario.estoque);        
                $('#enviar').modal('open');
            }
            $scope.enviar = function(){
               estoqueService.atualizaEstoque($scope.usuario._id, $scope.estoqueTemp).then(
                   function(response){
                       estoqueService.entradaEstoque($scope.estoqueId, $scope.pecasEnviadas).then(
                           function(response){
                               Materialize.toast("Peças Devolvidas", 5000, 'notificacaoBoa');
                           },
                           function(response){
                               Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                   }
                       )
                   },
                   function(response){
                       Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
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

        }])
        .controller('EncomendasSupervisorController',[ '$scope', 'encomendasService', 'consultoresService', function($scope, encomendasService, consultoresService){
           $scope.carregaDados();
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
                        Materialize.toas("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
                    }
                );
           }
           carregaEncomendas();
           consultoresService.porSupervisor($scope.usuario._id).then(
                function(response) {
                    $scope.consultores = response.data;
                },
                function(response) {
                        Materialize.toast("Falha ao carregar consultores", 5000, 'notificacaoRuim');
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
                        Materialize.toast("Encomenda adicionada com sucesso!", 5000, 'notificacaoBoa');
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
                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                    }
                );                
            };
            $scope.cancelar = function(id){
                encomendasService.atualizarStatus(id, "Cancelada").then(
                    function(response) {
                        carregaEncomendas();
                    },
                    function(response) {
                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                    }
                )
            }        
        }])
        //Consultor
        .controller('ConsultorInicioController',[ '$scope', 'consultoresService', 'userService', function($scope, consultoresService, userService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});
            $('select').material_select();
            $scope.adicionando = [];
            userService.carregaUm($scope.usuario.supervisor).then(
                    function(response) {
                        $scope.supervisor = response.data;
                    },
                    function(response) {
                            Materialize.toast("Falha ao carregar dados do supervisor!", 5000, 'notificacaoRuim');
                    }
            );
            $scope.brinde = {};
            $scope.troca = {};
            carregaBrinde = function(){
                consultoresService.meuBrinde($scope.usuario._id).then(
                    function(res){
                        $scope.brinde = res.data[0];
                    }
                )
            }
            carregaBrinde();
            $('.modal').modal();
            $scope.modalVenda = function(){
                console.log("venda");
                $('#venda').modal('open');
                $('#codigo').focus();
            }
            $scope.modalBrinde = function(){
                $('#brinde').modal('open');
            }
            $scope.modalTroca = function(){
                $('#troca').modal('open');
            }
            Quagga.CameraAccess.enumerateVideoDevices()
            .then(function(devices) {
                console.log(devices);
            });
            
            $scope.entrada = function(){
                $scope.adicionando.push($scope.codigo.toUpperCase());
                $scope.codigo = "";
            }
            $scope.pegaBrinde = function(){
                var estoqueTemp = [];
                var estoqueTemp = estoqueTemp.concat($scope.usuario.estoque);
                var encontrado = false;
                var cod = $scope.codigoBrinde.toUpperCase();
                var encontrado = false;
                var precoAdd = $scope.extraiPreco(cod);
                var codAdd = $scope.extraiCod(cod);
                for (var j=0; j<$scope.usuario.estoque.length; j++){
                    if(precoAdd=== $scope.extraiPreco($scope.usuario.estoque[j]) && codAdd === $scope.extraiCod($scope.usuario.estoque[j])){
                        $scope.deletaElemento($scope.usuario.estoque, j);
                        encontrado = true;
                        break;
                    }
                }
                if (encontrado == false){
                    Materialize.toast(cod+" não encontrado!", 10000, 'notificacaoRuim');
                    $scope.usuario.estoque = estoqueTemp;
                }else{
                    consultoresService.atualizaEstoque($scope.usuario).then(
                        function(res){
                            consultoresService.pegaBrinde($scope.brinde, cod).then(
                                function(res){
                                    $scope.codigo = "";
                                    $('#brinde').modal('close');
                                    Materialize.toast("Brinde registrado com sucesso!", 5000, 'notificacaoBoa');
                                    carregaBrinde();
                                },
                                function(res){
                                    Materialize.toast("Falha ao pegar o brinde!", 5000, 'notificacaoRuim');
                                }
                            );
                        },
                        function(res){
                            $scope.usuario.estoque = estoqueTemp;
                            Materialize.toast("Falha ao atualizar estoque!", 5000, 'notificacaoRuim');
                        }
                    );                    
                }
            }
            $scope.trocaPeca = function(){
                $scope.troca.consultorId = $scope.usuario._id;
                $scope.troca.consultorNome = $scope.usuario.nome;
                var estoqueTemp = [];
                var estoqueTemp = estoqueTemp.concat($scope.usuario.estoque);
                var encontrado = false;
                var cod = $scope.troca.pecaNova.toUpperCase();
                var codDefeito = $scope.troca.pecaDefeito.toUpperCase();
                var encontrado = false;
                var precoAdd = $scope.extraiPreco(cod);
                var codAdd = $scope.extraiCod(cod);
                for (var j=0; j<$scope.usuario.estoque.length; j++){
                    if(precoAdd=== $scope.extraiPreco($scope.usuario.estoque[j]) && codAdd === $scope.extraiCod($scope.usuario.estoque[j])){
                        $scope.deletaElemento($scope.usuario.estoque, j);
                        encontrado = true;
                        break;
                    }
                }
                if (encontrado == false){
                    Materialize.toast(cod+" não encontrado!", 10000, 'notificacaoRuim');
                    $scope.usuario.estoque = estoqueTemp;
                }else{
                    $scope.troca.saldo = $scope.extraiPreco(cod) - $scope.extraiPreco(codDefeito);
                    $scope.troca.defeito = $('#defeito').val();
                    consultoresService.atualizaEstoque($scope.usuario).then(
                        function(res){
                            consultoresService.troca($scope.troca).then(
                                function(res){
                                    $scope.troca = {};
                                    $('#troca').modal('close');
                                    Materialize.toast("Troca registrada com sucesso!", 5000, 'notificacaoBoa');
                                },
                                function(res){
                                    Materialize.toast("Falha ao registrar troca!", 5000, 'notificacaoRuim');
                                }
                            );
                        },
                        function(res){
                            $scope.usuario.estoque = estoqueTemp;
                            Materialize.toast("Falha ao atualizar estoque!", 5000, 'notificacaoRuim');
                        }
                    );                    
                }
            }
            $scope.pedeMaleta = function(){
                consultoresService.pedeMaleta($scope.brinde).then(
                    function(res){
                        $scope.codigo = "";
                        $('#brinde').modal('close');
                        Materialize.toast("Maleta solicitada com sucesso!", 5000, 'notificacaoBoa');
                        carregaBrinde();
                    },
                    function(res){
                        Materialize.toast("Falha ao solicitar maleta!", 5000, 'notificacaoRuim');
                    }
                );
            }
            $scope.entradaCamera = function(){
                $('#venda').modal('close');
                $('#modalCamera').modal('open');
                Quagga.init({
                        inputStream : {
                            name : "Barras",
                            type : "LiveStream",
                            target: document.querySelector('#camera')    // Or '#yourElement' (optional)
                        },
                        decoder : {
                            readers : ["code_128_reader"]
                        },
                        locator: {
                            patchSize: "small",
                            halfSample: false
                        },
                        locate: true
                    }, 
                    function(err) {
                        if (err) {
                            console.log(err);
                            return
                        }
                        console.log("Initialization finished. Ready to start");
                        Quagga.start();
                });
                Quagga.onDetected(function(data){
                    Quagga.stop();
                    data.codeResult.code = data.codeResult.code.replace(/\s+/g, '');
                    $('#codigo').val(data.codeResult.code);
                    $scope.codigo = data.codeResult.code;
                    $('#modalCamera').modal('close');
                    $('#venda').modal('open');
                    $('#codigo').focus();
                });
            }
            $scope.fechaCamera = function(){
                Quagga.stop();
                $('#modalCamera').modal('close');
                $('#venda').modal('open');
            }
			$scope.vender = function(){
                var estoqueTemp = [];
                var estoqueTemp = estoqueTemp.concat($scope.usuario.estoque);
                var vendidoTemp = [];
                var vendidoTemp = vendidoTemp.concat($scope.usuario.vendido);
                var totalVendidoTemp = 0;
                var totalVendidoTemp = totalVendidoTemp+$scope.usuario.totalVendido;
                var encontrado = false;
                var vendaok = true;
                for(var i=0; i <$scope.adicionando.length; i++){
                    encontrado = false;
                    var precoAdd = $scope.extraiPreco($scope.adicionando[i]);
                    var codAdd = $scope.extraiCod($scope.adicionando[i]);
                    for (var j=0; j<$scope.usuario.estoque.length; j++){
                        if(precoAdd=== $scope.extraiPreco($scope.usuario.estoque[j]) && codAdd === $scope.extraiCod($scope.usuario.estoque[j])){
                            $scope.usuario.vendido.push($scope.usuario.estoque[j])
                            $scope.deletaElemento($scope.usuario.estoque, j);
                            $scope.usuario.totalVendido += Number(precoAdd);
                            console.log($scope.usuario.vendido);
                            encontrado = true;
                            //Atualiza totalVendido, vendido e estoque e adicionar 
                            //'adicionando' ao historico de vendas -> na venda ou no acerto?
                            break;
                        }
                    }
                    if (encontrado == false){
                        Materialize.toast($scope.adicionando[i]+" não encontrado!", 10000, 'notificacaoRuim');
                        vendaok = false;
                    }
                }
                if (vendaok == true){
                    consultoresService.venda($scope.usuario).then(
                        function(response){
                            Materialize.toast("Venda Efetivada", 5000, 'notificacaoBoa');
                            if(totalVendidoTemp < 1000 && $scope.usuario.totalVendido >= 1000){
                                consultoresService.novoBrinde($scope.usuario, "mil").then(
                                    function(res){
                                        carregaBrinde();
                                    },
                                    function(res){
                                        console.log("Falah ao adicionar brinde dos mil reais");
                                    }
                                );
                            }
                            if(totalVendidoTemp < 1500 && $scope.usuario.totalVendido >= 1500){
                                consultoresService.minhaMaleta($scope.usuario._id).then(
                                    function(res){
                                        if(res.data.length===0){
                                            consultoresService.novoBrinde($scope.usuario, "maleta").then(
                                                function(res){
                                                    carregaBrinde();
                                                },
                                                function(res){
                                                    console.log("Falah ao adicionar brinde de maleta");
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        },
                        function(response){
                            $scope.usuario.estoque = estoqueTemp;
                            $scope.usuario.vendido = vendidoTemp;
                            $scope.usuario.totalVendido = totalVendidoTemp;
                            Materialize.toast("Falha ao realizar venda!", 5000, 'notificacaoRuim');
                        }
                    );
                    $('#venda').modal('close');
                    $scope.adicionando = [];
                }
                else{
                    $scope.usuario.estoque = estoqueTemp;
                    $scope.usuario.vendido = vendidoTemp;
                    $scope.usuario.totalVendido = totalVendidoTemp;
                    Materialize.toast("Falha ao realizar venda!", 5000, 'notificacaoRuim');
                }
            };
		}])
        .controller('EstoqueConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
           $scope.carregaDados();
           $('.tooltipped').tooltip({delay: 50});
           $scope.geral = {};
           $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
           $scope.vendidas = $scope.processaPecas($scope.usuario.vendido);
        }])
        .controller('HistoricoConsultorController',[ '$scope', 'consultoresService', function($scope, consultoresService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});
            $scope.acertos = {};
            $scope.vendidoAno = 0;
            hoje = new Date();
            consultoresService.historico($scope.usuario._id).then(                
                function(res){
                    $scope.acertos = res.data;
                    for(i=0; i< $scope.acertos.length; i++){
                        dia = new Date($scope.acertos[i].createdAt);
                        if(hoje.getFullYear() === dia.getFullYear())
                            $scope.vendidoAno+=$scope.acertos[i].valor;
                    }
                },
                function(res){
                     Materialize.toast("Falha ao carregar histórico!", 5000, 'notificacaoRuim');
                }
            );
        }])
        //Estoque
        .controller('EstoqueInicioController',[ '$scope', 'estoqueService', 'encomendasService', function($scope, estoqueService, encomendasService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});
            $('#entrada').modal();
            $('select').material_select();
            $scope.adicionando = [];
            $scope.encomendas = 0;
            $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
            encomendasService.totalAprovado().then(
                function(response){
                    $scope.encomendas = response.data;
                },
                function(response){
                    Materialize.toast("Falha ao carregar dados", 5000, 'notificacaoRuim');
                }
            );
            $scope.codigo = "";
            $scope.abrir = function(){
                $('#entrada').modal('open');
                $('#codigo').focus();
            }
            $scope.entrada = function(){
                var cod = $scope.extraiCod($scope.codigo.toUpperCase());
                var cods = ['AN', 'BP', 'BG', 'CF', 'CM', 'PN', 'PF', 'PM', 'TZ', 'ES', 'PZ'];
                if (cods.indexOf(cod) != -1){
                    $scope.adicionando.push($scope.codigo.toUpperCase());
                } else Materialize.toast("Código Inválido", 5000, 'notificacaoRuim');
                $scope.codigo = ""
            }
            $scope.concluir = function(){
                //deve existir possibilidade de cancelar última adição
                var estoque = $scope.usuario.estoque.concat($scope.adicionando);
                estoqueService.atualizaEstoque($scope.usuario._id, estoque).then(
                    function(response){
                        estoqueService.atualizaHistorico($scope.adicionando);
                        $scope.usuario.estoque = estoque;
                        $scope.pecas = $scope.processaPecas($scope.usuario.estoque);
                        $scope.adicionando = [];
                        $('#entrada').modal('close');
                    },
                    function(response){
                        Materialize.toast("Falha ao acessar o servidor", 5000, 'notificacaoRuim');
                    }
                )
            }
		}])
        .controller('EncomendasEstoqueController',[ '$scope', 'encomendasService', 'consultoresService', 'userService', 'estoqueService', function($scope, encomendasService, consultoresService, userService, estoqueService){
           $scope.carregaDados();
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
                        Materialize.toast("Falha ao cerregar dados!", 5000, 'notificacaoRuim');
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
                    case "Tornozeleira":
                        $scope.codigo = ['TZ'];
                        break;
					case "Escapulário":
                        $scope.codigo = ['ES'];
                        break;
					case "Personalizada":
                        $scope.codigo = ['PZ'];
                        break;
					case "Reposição padrão":
                        $scope.codigo = ['AN', 'BP', 'BG', 'CF', 'CM', 'PN', 'PF', 'PM', 'ES', 'TZ', 'PZ'];
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
                               encomendasService.atualizarStatus($scope.encomendaAtual._id, "Enviada", $scope.pecasEnviadas).then(
                                    function(response) {
                                        Materialize.toast("Enviada!", 5000, 'notificacaoBoa');
                                        carregaEncomendas();
                                    },
                                    function(response) {
                                        Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                                    }
                                )
                           },
                           function(response){
                               Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
                   }
                       )
                   },
                   function(response){
                       Materialize.toast(response.err.message, 5000, 'notificacaoRuim');
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
        .controller('EtiquetasController',[ '$scope', 'encomendasService', 'consultoresService', 'userService', 'estoqueService', function($scope, encomendasService, consultoresService, userService, estoqueService){
            $scope.carregaDados();
            $('.tooltipped').tooltip({delay: 50});
            $('#entrada').modal();
            $('select').material_select();
            $scope.adicionando = [];
            $scope.entradas = [];
            
            $scope.codigo = "";
            $scope.limpar = function(){
                $scope.adicionando = [];
                $scope.entradas = [];
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
                for(j = 0; j<entrada.quantidade; j++)
                        $scope.entradas.push(entrada.codigo);
            }
            $scope.excluir = function(index){
                codigo = $scope.adicionando[index].codigo;
                quantidade = $scope.adicionando[index].quantidade;
                for(i = 0; i<quantidade; i++){
                    pos = $scope.entradas.indexOf(codigo);
                    $scope.entradas.splice(index, 1);
                }
                $scope.deletaElemento($scope.adicionando, index);
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
;
	