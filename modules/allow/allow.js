'use strict';
/**
 * diretiva que habilita ou desabilita um componente baseado na autorizacao
 * incompleto......
 */
angular.module('gui.directives').directive('allow',function(cache) {
//haha    hihi
    return {
        link: function(scope, elm, attrs) {

            function auth(){

                    if (cache.usuario.role)
                    var auth = cache.usuario.role;

                    var arrayDeRoles = (scope.$eval(attrs.allow));
                    var allow = false;

                    for (var i = 0;i< arrayDeRoles.length; i++){
                        if ($.inArray(arrayDeRoles[i],auth) > -1){
                            allow = true;
                        }
                    }

                    if (cache.usuario.role)
                    if (cache.usuario.role.indexOf("admin") > -1){
                        allow = true;
                    }
                    //refactor para jquery show / hide  (porque ele guarda o estado enterior do elemento)
                    elm.css('display', allow ? '' : 'none');
            }


            scope.$watch('usuario',function(){
                if (cache.usuario)
                    auth();
            });
           if (cache.usuario)
              auth();





        }
    };
});





