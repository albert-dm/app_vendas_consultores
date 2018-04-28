
angular.module('ambaya')
    .service('kitsService', function ($http) {
        this.novo = function (kit) {
            return $http.post("/kits/", kit);
        };
        this.todos = function () {
            return $http.get("/kits/");
        };
        this.consultor = function (id) {
            return $http.get("/kits/porConsultora/" + id);
        };
        this.excluir = function (id) {
            return $http.delete("/kits/" + id);
        };
        this.atualizaStatus = function (id, status) {
            return $http.post("/kits/atualizar/",
                {
                    _id: id,
                    update: { status: status }
                }
            );
        };
        this.atualizaPecas = function (id, pecas) {
            return $http.post("/kits/atualizar/",
                {
                    _id: id,
                    update: { pecas: pecas }
                }
            );
        };
        this.atualizaKit = function (kit) {
            var id = kit._id;
            delete kit._id;
            return $http.post("/kits/atualizar/",
                {
                    _id: id,
                    update: kit
                }
            );
        };
    })