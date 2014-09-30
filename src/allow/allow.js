'use strict';
/**
 * diretiva que habilita ou desabilita um componente baseado na autorizacao
 * incompleto......
 */


angular.module('gui.directives').directive('allow',function() {


    return {

        scope:{
            user:'='
        },
        link: function(scope, elm, attrs) {

            if (scope.user === undefined){
               throw new Error("diretiva allow sem attributo user valido");
            }
            try{
                var arrayDeRoles = (scope.$eval(attrs.allow));
            }
            catch (err){
               // throw new MyException('Something was wrong!');
                throw new Error("Nao foi possivel avaliar corretamente o atributo allow na diretiva allow");
            }

            if( Object.prototype.toString.call( arrayDeRoles ) !== '[object Array]' ) {
                throw "diretiva allow com atributo  mal formado dever ser Array ['item','item2']";
            }

            function auth(){

                if (scope.user.role)
                    var auth = scope.user.role;

                var arrayDeRoles = scope.$eval(attrs.allow);
                var allow = false;

                for (var i = 0;i< arrayDeRoles.length; i++){
                    if ($.inArray(arrayDeRoles[i],auth) > -1){
                        allow = true;
                    }
                }

                if (scope.user.role)
                    if (scope.user.role.indexOf("admin") > -1){
                        allow = true;
                    }
                //refactor para jquery show / hide  (porque ele guarda o estado enterior do elemento)
                elm.css('display', allow ? '' : 'none');
            }


            scope.$watch('user',function(){

                if (scope.user)
                    auth();
            },true);
       /*     if (scope.user)
                auth();*/

        }
    };
});





