angular.module('ambaya')
.service('consultoresService', function($http) {
    this.todos = function(){
        return $http.get("/users/consultores/");
    };
    this.porSupervisor = function(id){
        return $http.get("/users/consultores/"+id);
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
    this.venda = function(usuario, pecas, userId){
        return $http.post("/users/venda/",
        {
            _id: usuario._id,
            update: {
                estoque: usuario.estoque,
                vendido: usuario.vendido,
                totalVendido: usuario.totalVendido,
            }, 
            pecas: pecas,
            userId: userId
        }
        );
    };
    this.estorno = function(usuario, pecas, userId){
        return $http.post("/users/estorno/",
        {
            _id: usuario._id,
            update: {
                estoque: usuario.estoque,
                vendido: usuario.vendido,
                totalVendido: usuario.totalVendido,
            }, 
            pecas: pecas,
            userId: userId
        }
        );
    };
    this.acerto = function(usuario){
        return $http.post("/users/atualizar/",
        {
                _id: usuario._id,
                update: {
                    vendido: usuario.vendido,
                    taxa: usuario.taxa,
                    totalVendido: 0
                }
        }
        );
    }
    this.novoBrinde = function(usuario, campanha, valorVenda, valorAbsoluto){
        return $http.post("/brindes/",
        {
                consultorId: usuario._id,
                consultorNome: usuario.nome,
                campanha: campanha,
                valorVenda: valorVenda,
                valorAbsoluto: valorAbsoluto
        }
        );
    }
    this.meuBrinde = function(id){
        return $http.get("/brindes/usuario/"+id);
    }
    this.minhaMaleta = function(id){
        return $http.get("/brindes/maleta/"+id);
    }
    this.pegaBrinde = function(brinde, peca){
        return $http.post("/brindes/atualizar/",
        {
                _id: brinde._id,
                update: {
                    status: "Entregue",
                    peca: peca
                }
        }
        );
    }
    this.pedeMaleta = function(brinde){
        return $http.post("/brindes/atualizar/",
        {
                _id: brinde._id,
                update: {
                    status: "Solicitada"
                }
        }
        );
    }
    this.atualizaEstoque = function(usuario){
        return $http.post("/users/atualizar/",
        {
            _id: usuario._id,
            update: {
                estoque: usuario.estoque
            }
        }
        );
    };
    this.troca = function(troca){
        return $http.post("/trocas/", troca);
    };
    this.historico = function(id){
        return $http.get("/acertos/usuario/"+id);
    };
    this.tipoTaxa = function(usuario){
        return $http.post("/users/atualizar/",
        {
                _id: usuario._id,
                update: {
                    tipoTaxa: usuario.tipoTaxa,
                    taxa: usuario.taxa
                }
        }
        );
    }
    this.atualizaProxAcerto = function(usuario, data){
        return $http.post("/users/atualizar/",
        {
            _id: usuario._id,
            update: {
                proxAcerto: data
            }
        }
        );
    };
    this.atualizaEmail = function(usuario, email){
        return $http.post("/users/atualizar/",
        {
            _id: usuario._id,
            update: {
                email: email
            }
        }
        );
    };
    this.indicados = function(indicadorId){
        return $http.get("/users/consultores/indicados/"+indicadorId);
    }
})