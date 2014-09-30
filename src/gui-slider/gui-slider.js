
'use strict';

/**
 * jquery ui slider
 * (nao tem um private scope para usar ngmodel do caller)
 */
angular.module('gui.directives').directive('slider', [
    'gui.config', function(uiConfig) {

        var defaultOptions;
        defaultOptions = {};

        return {
            require: '?ngModel',
            priority:0,
            restrict:'EA',


            transclude:true,
            replace:true,

            template:'<div id="my-slider" style="margin-bottom: 10px;"   ng-transclude></div>',

            link: function(scope, element, attrs, ctrl){


                var opts;

                var optsAttrs = scope.$eval(attrs.options);

                opts = angular.extend({}, defaultOptions, optsAttrs);

                if (ctrl){  //se eu tenho um model controller  (foi colocado ng-model na diretiva)
                    opts.change =  function( event, ui ){

                        scope.$apply(ctrl.$setViewValue(ui.value));


                    };
                }


               element.slider(opts);
               // scope.slider = element.slider(opts).data("slider");

            }
        };
    }
]);
