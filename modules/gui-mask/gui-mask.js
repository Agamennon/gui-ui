

/**
 * Adaptacao para angular de http://digitalbush.com/projects/masked-input-plugin/
 * em especial versao com isValid https://raw.github.com/twarogowski/angular-contrib/master/js/lib/jquery.maskedinput-1.3.js
 * inspirado no post de  https://groups.google.com/forum/?fromgroups#!topic/angular/OnA1fohCQYU
 */
angular.module('gui.directives').directive('guiMask', [
    function() {
        return {

            require: 'ngModel',

            link: function(scope, element, attrs, controller) {

                var isValid = true;

                controller.$render = function() {
                    var value;
                    value = controller.$viewValue || '';
                    element.val(value);
                    $.mask.definitions['~'] = '([0-9] )?';
                    return element.mask( attrs.guiMask);
                };

                controller.updateModel = function(){
                    scope.$apply(function(){
                        isValid = element.data('mask-isvalid');
                        if (isValid)
                            controller.$setViewValue(element.mask());
                        else
                            controller.$setViewValue("");

                    });
                };

                element.bind('keyup', function() {
                    controller.updateModel();
                });

            }
        };
    }
]);