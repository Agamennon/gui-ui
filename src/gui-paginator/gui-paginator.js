

//https://github.com/angular/angular.js/issues/7874

angular.module('gui.directives').directive('transX', function() {
    return {
        link: {
            pre: function(scope, element, attr, ctrl, transclude) {
                if (transclude) {
                    transclude(scope, function(clone) {
                        element.append(clone);
                    });
                }
            }
        }
    };
});


angular.module('gui.directives').directive('paginator',function() {

    return {
        restrict: 'E',


        scope:{
            data:'=',
            pageSize:'@',
            clickAction:'&'

        },
        transclude:true,
        template:

            '<div>'+
                '<div ng-repeat="item in data |startFrom:(currentPage)*pageSize|limitTo:pageSize">'+
                '<div class="gui-paginator-content" trans-x></div>' +
                '</div>'+

                '<div class="gui-paginator-controls" align="center">'+
                '<button ng-disabled="currentPage < 1" class="tiny round button" style="margin-right: 5px;" ng-click="currentPage=currentPage-1">'+
                'Anterior'+
                '</button>'+
                '{{currentPage+1}}/{{(data.length/pageSize)|arredondaCima}}'+
                '<button class="tiny round button" style="margin-left: 6px;" ng-disabled="currentPage+1 >= (data.length/pageSize)|arredondaCima" ng-click="currentPage=currentPage+1">'+
                'Proxima'+
                '</button>'+

                '</div>'+

                '</div>',




        compile: function compile(tElement, tAttrs, tTransclude) {

            return {
                pre: function preLink(scope, iElement, iAttrs, crtl, transclude) {
                   // scope.collection = [1, 2, 3, 4, 5];
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    //console.log(iElement[0]);
                }
            };
        },


        controller: function ($scope){
            $scope.data = [];
            $scope.currentPage = 0;
            $scope.$watch('data',function(){
              if ($scope.data.length > 0)
                $scope.currentPage = 0;
              else
                $scope.currentPage = -1;

            });

            $scope.actions = $scope.clickAction();
        }

    };
});


angular.module('gui.directives').directive('viewPaginator',function(guiModalService) {

    return {
        restrict: 'E',
        transclude:true,
        scope:{
            view:'=',
            pageSize:'@',
            clickAction:'&',
            refresh: '=?'


        },

        template:


        '<div style="margin-top: 20px;">'+
        '<div  align="center" style="margin-bottom: 15px;" ng-show="info.erro" ><a ng-click="refresh()">Clique para tentar novamente</a></div>'+
        '<div   ng-show="mostraSpinner()" style="height: 50px; width: 50%; margin: 0 auto;"  class="ui-loading"></div>'+
        '<div  ng-repeat="item in data">'+
        '<li  style="margin-left: 10px;">'+
        '<div class="gui-paginator-content" trans-x></div>'+
        '</li>'+
        '</div>'+
        '<div ng-show="mostraControles()" class="gui-paginator-controls" align="center">'+
        '<button ng-disabled="(info.paginaAtual == 1) || !info.ready" class="tiny round button"  ng-click="anterior()">'+
        '<span>Anterior</span>'+
        '</button>'+
        '<span style="margin: 0px 8px 0px 8px;">{{info.paginaAtual}}/{{info.numeroPaginas||1}}</span>'+
        '<button class="tiny round button"  ng-disabled="(info.numeroPaginas <= (info.paginaAtual||1))|| !info.ready"  ng-click="proxima()">'+
        '<span>Proxima</span>'+
        '</button>'+
        '</div>'+
        '</div>',



        controller: function ($scope,$route){



            $scope.data =[];

            $scope.mostraControles = function(){
              return $scope.info.ready && !$scope.info.erro
            };

            $scope.mostraSpinner = function(){
                return !$scope.info.ready && !$scope.info.erro
            };

            $scope.refresh = function(){
                console.log('REFRESHHHHH');
                 $route.reload();
            };

            $scope.$watch('view.getPagingInfo()',function(){
                $scope.info = $scope.view.getPagingInfo();
                if ($scope.info.erro){
                   // $route.reload();


                }
            },true);

            $scope.primeira = function(){
                console.log('primeira');
                $scope.data =[];
                $scope.view.get().then(function(data){
                    $scope.data = data;
                },function(erro){
                  //  $scope.primeira();

                  //  guiModalService.show('erro',erro);
                });
            };

            //executa primeira assim que o controlle lê
            $scope.primeira();


            $scope.proxima = function(){
                $scope.erroPrimeria = false;
                $scope.data =[];
                $scope.view.proxima().then(function(data){
                    $scope.data = data;
                },function(erro){
                 //   guiModalService.show('erro',erro);
                });
            };

            $scope.anterior = function(){
                $scope.erroPrimeria = false;
                $scope.data =[];
                $scope.view.anterior().then(function(data){
                    $scope.data = data;
                },function(erro){
                  //  guiModalService.show('erro',erro);
                });
            };

            $scope.actions = $scope.clickAction();


        }

    }
});



/*

angular.module('gui.directives').directive('viewPaginator',function() {

    return {
        restrict: 'E',
        transclude:true,
        scope:{

            view:'=',
            pageSize:'@',
            clickAction:'&'

        },

        template:

            '<div style="margin-top: 20px;">'+
                '<div  ng-show="!info.ready" style="height: 50px; width: 50%; margin: 0 auto;"  class="ui-loading"> </div>'+

                '<div ng-repeat="item in result">'+
                  '<li  style="margin-left: 10px;">'+
                    '<a ng-click="clickFunction(item)"><span ng-transclude></span></a>'+
                      '<hr>'+
                  '</li>'+
                '</div>'+

                '<div ng-show="info.ready" align="center">'+
                  '<button ng-disabled="info.paginaAtual == 1" class="small round button"  ng-click="anterior()">'+
                    '<span>Anterior</span>'+
                  '</button>'+
                  '<span style="margin: 0px 8px 0px 8px;">{{info.paginaAtual}}/{{info.numeroPaginas||1}}</span>'+
                  '<button class="small round button"  ng-disabled="info.numeroPaginas <= (info.paginaAtual||1)"  ng-click="proxima()">'+
                    '<span>Proxima</span>'+
                  '</button>'+
                '</div>'+
            '</div>',


        controller: function ($scope, $element){

            $scope.result =[];

            function exec(erro,data){


                $scope.info = $scope.view.getPagingInfo();
                if (!erro){
                        for (var x=0;x < data.rows.length;x++)
                            $scope.result.push(data.rows[x].value);
                }
                else{
                    console.log(erro);
                }
            }

            $scope.$watch('view.getPagingInfo()',function(){
                $scope.info = $scope.view.getPagingInfo();
            },true);

            //executa assim que o controlle lê
            $scope.view.get(function(erro,data){
                $scope.result = [];
                exec(erro,data);
            });

            $scope.proxima = function(){
                $scope.result = [];
                $scope.view.proxima(function(erro,data){
                    exec(erro,data)
                });
            };

            $scope.anterior = function(){
                $scope.result = [];
                $scope.view.anterior(function(erro,data){
                    exec(erro,data);
                });
            };

            $scope.clickFunction = function(item){
                $scope.clickAction({res:item});
            };

        }

    }
});*/

