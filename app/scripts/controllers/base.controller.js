//'use strict';

angular.module('ambaya')
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
                {nome:"Kits", icone:"work"},
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
    if ($scope.logado==true) {
        console.log("logado");
        $scope.usuario = loginService.getUser();
        $scope.carregaDados();
    }else{
        $scope.tipo = "Login";
        $scope.sair();
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
            tipo = $scope.extraiCod(estoque[i]);
            //mes = peca.splice(2,2);
            //ano = peca.splice(4,2);
            valor = $scope.extraiPreco(estoque[i]);
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
            peca = "AN"+pecas.aneis[i].val;
            for(j=0; j<pecas.aneis[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.brincosP.length; i++){
            peca = "BP"+pecas.brincosP[i].val;
            for(j=0; j<pecas.brincosP[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.brincosG.length; i++){
            peca = "BG"+pecas.brincosG[i].val;
            for(j=0; j<pecas.brincosG[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.cordoesF.length; i++){
            peca = "CF"+pecas.cordoesF[i].val;
            for(j=0; j<pecas.cordoesF[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.cordoesM.length; i++){
            peca = "CM"+pecas.cordoesM[i].val;
            for(j=0; j<pecas.cordoesM[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.pingentes.length; i++){
            peca = "PN"+pecas.pingentes[i].val;
            for(j=0; j<pecas.pingentes[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.pulseirasF.length; i++){
            peca = "PF"+pecas.pulseirasF[i].val;
            for(j=0; j<pecas.pulseirasF[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.pulseirasM.length; i++){
            peca = "PM"+pecas.pulseirasM[i].val;
            for(j=0; j<pecas.pulseirasM[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.tornozeleiras.length; i++){
            peca = "TZ"+pecas.tornozeleiras[i].val;
            for(j=0; j<pecas.tornozeleiras[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.escapularios.length; i++){
            peca = "ES"+pecas.escapularios[i].val;
            for(j=0; j<pecas.escapularios[i].tot; j++)
                estoque.push(peca);
        }
        for(i=0; i<pecas.personalizadas.length; i++){
            peca = "PZ"+pecas.escapularios[i].val;
            for(j=0; j<pecas.escapularios[i].tot; j++)
                estoque.push(peca);
        }
        return estoque;
    }
    $scope.extraiPreco = function(codigo){
        if(codigo.length == 5) return codigo.substr(2,3);
        else return "0"+codigo.substr(6,2);
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
                        {'val':"PZ", 'label':'Personalizada'}
    ];
        
}]);