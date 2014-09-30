

angular.module('gui.directives').directive('tbind', function() {
    return {
        link: {
            pre: function(scope, element, attr, ctrl, transclude) {
                if (transclude) {
                    transclude(scope.$parent, function(clone) {
                        element.append(clone);
                    });
                }
            }
        }
    };
});


angular.module('gui.directives').directive('guiPopup',function(guiPopupService, $filter, utils) {


    return {
        restrict:'E',
        scope:{
            show:'=?',
            title:'@'
        },
        template:
        '<div class="ng-modal" ng-show="show">'+
         '<div class="ng-modal-overlay"></div>'+
         '<div class="ng-modal-dialog animate-show"  ng-show="show">'+
          '<div class="ng-modal-dialog-content">' +
           '<h2 class="ng-dialog-header">{{title}}</h2>'+
           '<div  class="ng-dialog-body-popup">' +
           '<div tbind></div>'+
            '</div>'+
           '</div>'+
          '</div>'+
         '</div>'+
        '</div>',
         transclude:true,


        link: function(scope,elm,ctrl,transclude) {

           scope.clickPopup = function(){
               scope.show = !scope.show;
               console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
           };
           scope.show = false;
        //    elm.find('modelContent').replaceWith(transclude());
        }
    };
});


angular.module('gui.directives').factory('guiPopupService', function (){

    var modalService = {};
    return modalService

})