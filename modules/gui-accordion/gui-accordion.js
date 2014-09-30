
//http://jqueryui.com/demos/accordion/
/**
 * cria um accordion gui-accordion que encapsula tabs gui-accordion-tabs
 * um objeto config deve ser passado para o <gui-accordion config="objetoconfig" ...   objetoconfig deve constar no $scope
 * objeto config deve conformar con jquery ui accordion api (options)
 * config.set(number)  um wrapper para a mudar a aba do accrodion  number é baseado em 0 (primeira tab)
 * gui-accordion-tab tem um attributo chamado loading que quando true (deve ser uma variavel em $scope) que cria um spinner de loading
 * setar a variavel para false remove o spinner
 *
 * o config tambem recebe um membro accordion com o objeto criado
 *
 */

/**
 * CSS em uso
 *
 *
 .loadingAccordion {
    background: url('/resources/stylesheets/images/ajax-loader.gif') no-repeat  center;
 }
 */

angular.module('gui.directives').directive('guiAccordion', [
    'gui.config', function(uiConfig) {

        var defaultConfig;

        defaultConfig = {
            header: "h3.accordionTitle",
            'autoHeight': false,
            'collapsible': true,
            active:0,
            heightStyle: "content"};

        return {

            priority:0,
            restrict:'EA',
            transclude:true,
            replace:true,
            scope:{'config':'='

            },
          /*  controller: function ($scope, $element){
                         this.accordion = $scope.accordion;
            },*/
            template:'<div class="accordion" id="gui-accordion" ng-transclude></div>',

            link: function(scope, element, attrs, controller){

                scope.accordion = {};
                var opts, updateModel, usersOnSelectHandler;
                opts = angular.extend({}, defaultConfig, scope.config);



                scope.config.set = function(index){
                    scope.accordion.accordion("option","active",index);

                };



                    scope.accordion = element.accordion(opts);



                scope.config.accordion =  scope.accordion;
                //scope.config.accordion =  scope.accordion.accordion( "widget" );


            }
        };
    }
]);

angular.module('gui.directives').directive('guiAccordionTab', [
    'gui.config','$parse','$interpolate', function(uiConfig, $parse,$interpolate) {
        return {
         /*   require: '^guiAccordion',*/
            priority:1,
            restrict:'EA',
            replace:true,
            transclude:true,
            scope:{ title:'@',
                loading:'='   //remoteData: '&',  //<div>remote-data="isUnchanged(amount,another)<div>"  from directive =  scope.merda = scope.remoteData({amount:22, another:44});
            },
            template:'<div><h3 class="accordionTitle"><a href="#">{{title}}</a></h3>' +
                '<div ng-transclude></div></div>',

            link: function(scope, elm, attrs, accordionCtrl){



                if (attrs.hasOwnProperty('loading')) {


                    //elemento que vai conter a animacao spinner (é o primeiro filho de elm)
                    scope.titleElement =  elm.children(':first').addClass('loadingAccordion');

                    scope.$watch('loading', function(value){

                        if (!value){
                            scope.titleElement.removeClass('loadingAccordion');
                        } else {
                            scope.titleElement.addClass('loadingAccordion');
                        }

                    });

                }


            }

        };
    }
]);
