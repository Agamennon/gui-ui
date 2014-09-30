

angular.module('gui.directives').directive('guiModal',function(guiModalService, $filter, utils) {


    return {
        restrict:'EA',
        scope:{
          show:'=?'
        },
        template:
            '<div class="ng-modal" ng-show="show">'+
                '<div class="ng-modal-overlay"></div>'+
                '<div class="ng-modal-dialog animate-show"  ng-show="show">'+
                    '<div  class="ng-modal-dialog-content">' +
                        '<h2 class="ng-dialog-header">{{header}}</h2>'+
                        '<div id="modelContent" ng-style="estiloBody" class="ng-dialog-body">' +
                           '{{body}}' +
                           '<div style="margin-left: 25px;" ng-if="erros">' +
                              '<ul>' +
                                 '<li ng-repeat="erro in erros">{{erro.msg}}</li>'+
                              '</ul>' +
                           '</div>'+
                        '</div>' +
                        '<div align="right" class="ng-dialog-buttons">' +
                           '<button ng-click="clickOk()" style="min-width: 79px;" class="tiny button">{{labelOk}}</button>' +
                           '<button ng-click="clickCancela()" ng-style="cancelaVisivel" style="margin: 0 0 0 10px; min-width: 79px;" class="tiny button">{{labelCancela}}</button>' +
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>',
        replace: true,


        link: function(scope) {
            scope.cancelaVisivel = {};

            function prep(header){
                scope.show = true;
                scope.header = header;
            }


            guiModalService.show = function(header,body){
               scope.body = (typeof body === 'string') ? body : $filter('json')(body);
                prep(header);
                scope.cancelaVisivel.display = 'none';
                scope.labelOk = 'Ok';
                scope.clickOk = function() {
                    scope.show = false;
                };

            };



            guiModalService.confirm = function(header,body,callback){
                scope.body = (typeof body === 'string') ? body : $filter('json')(body);
                scope.cancelaVisivel.display = 'inline-block';
                prep(header);
                scope.labelOk = 'Confirma';
                scope.labelCancela = 'Cancela';
                scope.clickOk = function() {
                    callback(true);
                    scope.show = false;
                };
                scope.clickCancela = function() {
                    callback(false);
                    scope.show = false;
                };

            };

            guiModalService.showFormErrors = function(header,form){
                scope.cancelaVisivel.display = 'none';
                scope.body ='';
                scope.labelOk = 'Ok';
                scope.erros = utils.agregaErrosDoFormulario(form);
                prep(header);
                scope.clickOk = function() {
                    scope.erros = '';
                    scope.show = false;
                };

            };
        }
    };
});


angular.module('gui.directives').factory('guiModalService', function (){

    var modalService = {};
    return modalService

});