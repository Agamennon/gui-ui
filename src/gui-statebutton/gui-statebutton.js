/**
 *  uso:
 *  <state-button  label="Salva" label-working='Salvando' action="salva(done)" enabled="true" > salva </state-button>
 *  a funcao salva em action deve chamar a funcao done() quando terminar qualquer trabalho assim re-habilitando o botao
 *  label-done , pode ser usado como label final
 */
angular.module('gui.directives').directive('stateButton', [
    'gui.config', function(uiConfig, $parse) {

        return {
            priority:0,
            restrict:'EA',
            transclude:true,
            replace:true,
            scope:{
                label:'@',
                labelWorking:'@',
                labelDone:'@',
                action:'&',         //<div>remote-data="isUnchanged(amount,another)<div>"  from directive =  scope.merda = scope.remoteData({amount:22, another:44});
                enabled:'='
            },

            template: '<button  ng-disabled="!enabledFromDirective || !enableFromUser">{{label}} </button>',

            link: function(scope, element, attrs, controller){

                var doneCallback;

                scope.enabledFromDirective = true;
                scope.enableFromUser = true;

                // olha a variavel enabled e desabilita o botao
                scope.$watch('enabled', function(){
                    if (typeof scope.enabled !== "undefined")
                        scope.enableFromUser = scope.enabled
                });

                //quando o usuario da funcao chama done() o botao volta ao estado inicial
                doneCallback = function(){


                    scope.label = scope.labelDone || scope.labelInicial;
                    scope.enabledFromDirective = true;
                 /*   scope.$parent.safeApply(function(){
                        scope.label = scope.labelDone || scope.labelInicial;
                        scope.enabledFromDirective = true;

                    });*/

                };

                element.bind('click', function() {
                    //  scope.$apply(attrs['function ']); (funciona sem o scopo privado)
                    scope.$apply(function() {
                        scope.labelInicial = scope.label;
                        scope.label = scope.labelWorking;
                        scope.enabledFromDirective = false;
                        scope.action({done:doneCallback});

                    });


                    /* chama a funcao bindada ao botao com o parametro doneCallback que quando chamada da funcao do usuario
                    re-habilita o botao  (nao tem parametros) */
                 //   scope.action({done:doneCallback});
                });

            }
        };
    }
]);




