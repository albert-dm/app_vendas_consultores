angular.module('ambaya')
.service('pecasService', [function(){
    var pecasService = this;
    pecasService.processaPecas = function(estoque){
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
            tipo = pecasService.extraiCod(estoque[i]);
            //mes = peca.splice(2,2);
            //ano = peca.splice(4,2);
            valor = pecasService.extraiPreco(estoque[i]);
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

    pecasService.voltaPecas = function(pecas){
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
    pecasService.extraiPreco = function(codigo){
        if(codigo.length == 5) return codigo.substr(2,3);
        else return "0"+codigo.substr(6,2);
    } 
    pecasService.extraiCod = function(codigo){
        return codigo.substr(0,2);
    } 
    pecasService.irPara = function(pagina){
        $state.go(pagina);
    }
    pecasService.opcoesPecas = [{'val':"AN", 'label':'Anéis'},
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
}])