/**
 * esperimentos e diretivas incompletas
 */





angular.module('gui.directives').directive('displayItems',function($rootScope) {

    return {
        restrict: 'EA',
        scope:{model:'='},
        template:

            '<div>'+
                '<ul>'+
                ' <li  ng-repeat="item in model">'+
                '<span style="border: 1px solid #00008b;">{{item}}</span>'+
                '<button class="tiny alert radius button" ng-click="remove(item)">x</button>'+
                '</li>'+
                '</ul>'+
                '</div>',

        link: function(scope) {

            scope.remove = function(item){
                scope.model.splice(scope.model.indexOf(item),1);
            }

        }
    };
});




