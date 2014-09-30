
/*  //google chrome date input binding shiv
tekna.directive('input', function () {
    return {
        require: '?ngModel',
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {
            if ( attrs.type="date" && ngModel ) {
                element.bind('change', function () {
                    scope.$apply(function() {
                        ngModel.$setViewValue(element.val());
                    });
                });
            }
        }
    };
});
*/



maladireta.directive('skeleton', function() {
    return {
        require: 'ngModel',

        compile: function(tElement, tAttrs, transclude){
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {

                },

                post: function(scope, elm, attrs, ctrl) {

                    ctrl.$render = function() {

                    };

                    ctrl.$parsers.push(function(viewValue) {
                        return viewValue;
                    });

                }
            };
        }
    }
});



/**
 * todo verificar se cpf e valido
 * valida cpf nao verifica se o numero e um valido ou nao
 * apena verifica o formato (alternativa para mascara)
 */
maladireta.directive('cpfValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var regex =/^\d{3}([,-.])?\d{3}([-.,])?\d{3}([-.,])?\d{2}$/;
            ctrl.$parsers.unshift(function(viewValue) {

                // Atributo obrigatório e vazio  (back space)
                if ((viewValue === undefined || viewValue === "") && attrs.required){
                    ctrl.$setValidity('cpfValidation', false);
                    ctrl.msg = attrs.name+ " obrigatório";
                    return undefined;
                }

                // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                if (viewValue === undefined || viewValue === ""){
                    ctrl.$setValidity('cpfValidation', true);
                    return undefined;
                }

                // Atributo com algum valor, verifica regex
                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('cpfValidation', true);

                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('cpfValidation', false);
                    ctrl.msg = 'formato do CPF inválido';
                    return undefined;
                }

            });


        }
    };
});

//todo verificar
maladireta.directive('cnpjValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            ctrl.label = "CNPJ";
            ctrl.$parsers.unshift(function(viewValue) {
                //00.000.000/0000-00
                var regex = /^\d{2}([.])?\d{3}([.])?\d{3}([\/])?\d{4}([-])?\d{2}$/;


                // Atributo obrigatório e vazio  (back space)
                if ((viewValue === undefined || viewValue === "") && attrs.required){
                    ctrl.$setValidity('cnpjValidation', false);
                    ctrl.msg = attrs.name+ " obrigatório";
                    return undefined;
                }

                // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                if (viewValue === undefined || viewValue === ""){
                    ctrl.$setValidity('cnpjValidation', true);
                    return undefined;
                }



                console.log(viewValue+' cnpjValidation regex');
                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('cnpjValidation', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('cnpjValidation', false);
                    ctrl.msg = 'formato do CNPJ inválido';
                    return undefined;
                }

            });
        }
    };
});

/**
 * valida email
 */
maladireta.directive('emailValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

            ctrl.$parsers.unshift(function(viewValue) {
                // Atributo obrigatório e vazio  (back space)
                if ((viewValue === undefined || viewValue === "") && attrs.required){
                    ctrl.$setValidity('emailValidation', false);
                    ctrl.msg = attrs.name+ " obrigatório";
                    return undefined;
                }

                // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                if (viewValue === undefined || viewValue === ""){
                    ctrl.$setValidity('emailValidation', true);
                    return undefined;
                }

                // Atributo com algum valor, verifica regex
                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('emailValidation', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('emailValidation', false);
                    ctrl.msg = 'Email inválido';
                    return undefined;
                }

            });
        }
    };
});

/**
 * valida e transforma nome para um formato agradavel (camel case)
 */
maladireta.directive('nomeValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {


            var regex =/^[A-Za-záêéíóúçãô\s]+$/i;
            ctrl.$parsers.unshift(function(viewValue) {


                // Atributo obrigatório e vazio  (back space)
                if ((viewValue === undefined || viewValue === "") && attrs.required){
                    ctrl.$setValidity('nomeValidation', false);
                    ctrl.msg = attrs.name+ " obrigatório";
                    return undefined;
                }

                // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                if (viewValue === undefined || viewValue === ""){
                    ctrl.$setValidity('nomeValidation', true);
                    return undefined;
                }

                if (viewValue.length < 6){
                    ctrl.$setValidity('nomeValidation', false);
                    ctrl.msg = attrs.name+' muito pequeno';
                    return undefined;
                }

                if (viewValue.length > 120){
                    ctrl.$setValidity('nomeValidation', false);
                    ctrl.msg = attrs.name+' muito longo';
                    return undefined;
                }

                // Atributo com algum valor semi valido, verifica regex
                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('nomeValidation', true);
                    // comeca a transformação do nome em camel case
                    var result = angular.lowercase(viewValue);
                    //remove espacos em branco o resultado e um array com palavras e espacos em branco
                    var temp,final = [];
                    temp =  result.split(" ");
                    //coloca no vetor apenas palavras lenght != 0  (nao espacos)
                    for (var i in temp){
                        if(temp[i].length !== 0){
                            final.push(temp[i]);
                        }
                    }
                    //coloca palavras com tamanho maior que 2 caixa alta e o resto caixa baixa "Nome do Paciente da Silva"
                    var nome = "";
                    for (var j in final){
                        var tmpNome = "";

                        if (final[j].length > 2)
                            tmpNome =  final[j].charAt(0).toUpperCase() + final[j].slice(1);  //upercase no primeiro caracter

                        if (final[j].length <= 2)  //nao coloca caixa alta  ( da de do .... "da Silva")
                            tmpNome = final[j];

                        if (j != final.length -1)  //ultima palavra nao adiciona espaco
                            nome = nome + tmpNome +' ';
                        else
                            nome = nome + tmpNome;
                    }

                    return nome;
                } else {

                    ctrl.$setValidity('nomeValidation', false);
                    ctrl.msg = attrs.name+' deve apenas ter letras';
                    return undefined;
                }

            });
        }
    };
});


maladireta.directive('crmValidation', function() {
    return {
        require: 'ngModel',

                link: function(scope, elm, attrs, ctrl) {

                   //regex liberal aceita espaco e caixa baixa ou alta
                   // var regex =/^[0-9]+([\s]?|[-]?)[A-Za-z][A-Za-z]$/i;

                    var regex =/^[0-9]+[-][A-Za-z][A-Za-z]$/i;

                    var estadoHash = {
                        'AC':true,
                        'AL':true,
                        'AP':true,
                        'AM':true,
                        'BA':true,
                        'CE':true,
                        'DF':true,
                        'GO':true,
                        'ES':true,
                        'MA':true,
                        'MT':true,
                        'MS':true,
                        'MG':true,
                        'PA':true,
                        'PB':true,
                        'PR':true,
                        'PE':true,
                        'PI':true,
                        'RJ':true,
                        'RN':true,
                        'RS':true,
                        'RO':true,
                        'RR':true,
                        'SP':true,
                        'SC':true,
                        'SE':true,
                        'TO':true
                    };


                    ctrl.$parsers.push(function(viewValue) {

                        // Atributo obrigatório e vazio  (back space)
                        if ((viewValue === undefined || viewValue === "") && attrs.required){
                            ctrl.$setValidity('crmValidation', false);
                            ctrl.msg = attrs.name+ " obrigatório";
                            return undefined;
                        }

                        // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                        if (viewValue === undefined || viewValue === ""){
                            ctrl.$setValidity('crmValidation', true);
                            return undefined;
                        }

                        if (estadoHash[(viewValue.slice(viewValue.length-2)).toUpperCase()] != true){
                            ctrl.$setValidity('crmValidation', false);
                            ctrl.msg = attrs.name+ " estado do crm nao existe";
                            return undefined;
                        }

                        // Atributo com algum valor, verifica regex
                        if (regex.test(viewValue)) {
                            // it is valid
                            ctrl.$setValidity('crmValidation', true);
                            //make last to chars uppercase
                            viewValue = viewValue.substring(0,viewValue.length-2) + (viewValue.slice(viewValue.length-2)).toUpperCase();
                            return viewValue;
                        } else {
                            // it is invalid, return undefined (no model update)
                            ctrl.$setValidity('crmValidation', false);
                            ctrl.msg =  attrs.name+' Deve obedecer 999999-PR';
                            return undefined;
                        }

                    });

                }
            };

});




/**
 * valida telefone (alternativa para mask ou enhancement)
 */
maladireta.directive('telValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            var regex = /^\d{2}([-])?\d{8}$/;

            ctrl.$parsers.unshift(function(viewValue) {

                // Atributo obrigatório e vazio  (back space)
                if ((viewValue === undefined || viewValue === "") && attrs.required){
                    ctrl.$setValidity('telValidation', false);
                    ctrl.msg = attrs.name+ " obrigatório";
                    return undefined;
                }

                // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                if (viewValue === undefined || viewValue === ""){
                    ctrl.$setValidity('telValidation', true);
                    return undefined;
                }

                // Atributo com algum valor, verifica regex
                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('telValidation', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('telValidation', false);
                    ctrl.msg =  attrs.name+' deve ter 10 numeros com codigo de área';
                    return undefined;
                }

            });
        }
    };
});

maladireta.directive('cepValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                var regex = /^\d{5}([-])?\d{3}$/;

//     var regex = /^\d{2}([.])?\d{3}([.])?\d{3}([\/])?\d{4}([-])?\d{2}$/;

                if (attrs.required === true &&  (viewValue === undefined || viewValue === "")){
                    ctrl.$setValidity('cepValidation', false);
                    ctrl.msg = 'Cep é'+' obrigatório';
                    return undefined;
                }


                if (viewValue === "" && attrs.required === undefined){
                    ctrl.$setValidity('cepValidation', true);
                    return undefined;
                }


                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('cepValidation', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('cepValidation', false);
                    ctrl.msg = 'Cep' +' deve ter 8 numeros';
                    return undefined;
                }

            });
        }
    };
});

maladireta.directive('moneyValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var regex =/^\d+([,.]\d{1,2})?$/;

            elm.bind('blur',function(){
                if (ctrl.$valid){
                    elm.val(ctrl.$modelValue);
                }
            });

            ctrl.$parsers.unshift(function(viewValue) {

                // Atributo obrigatório e vazio  (back space)
                if ((viewValue === undefined || viewValue === "") && attrs.required){
                    ctrl.$setValidity('moneyValidation', false);
                    ctrl.msg = attrs.name+ " obrigatório";
                    return undefined;
                }

                // Atributo vazio (não obrigatorio já que o primeiro caso teria sido chamado)
                if (viewValue === undefined || viewValue === ""){
                    ctrl.$setValidity('moneyValidation', true);
                    return undefined;
                }

                // Atributo com algum valor, verifica regex
                if (regex.test(viewValue)) {
                    // it is valid
                    ctrl.msg = 'formato do dinheiro VALIDO!';
                    ctrl.$setValidity('moneyValidation', true);
                    viewValue = viewValue.replace(",",".");
                   return  parseFloat(Math.round(viewValue * 100) / 100).toFixed(2);
                } else {

                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('moneyValidation', false);
                    ctrl.msg = 'formato do dinheiro inválido';
                    return undefined;
                }

            });


        }
    };
});

maladireta.directive('totalFormulaCalculator', function() {
    return {

        scope:{ formula:"=formula",
            totalPercentoVacina:"=totalPercentoVacina"

        },

        link: function(scope, elm, attrs, ctrl) {

            scope.totalPercentoVacina = 0;

            function calculaTotalPercentoFormulaVacina(){  //soma os pecentuais da vacina  deve ser 100%

                scope.totalPercentoVacina = 0;
                angular.forEach(scope.formula, function(value, key){
                    var x = Number(value.percento);
                    if (isNaN(x)){
                        x = 0;
                    }

                    scope.totalPercentoVacina += x;
                });


                if (scope.totalPercentoVacina == 100){

                    //  ctrl.$setValidity('totalFormulaValidation', true);
                    elm.removeClass('guiNot100');
                    elm.addClass('guiAt100');

                }
                else{
                    // ctrl.$setValidity('totalFormulaValidation', false);
                    elm.removeClass('guiAt100');
                    elm.addClass('guiNot100');
                }
            }


            scope.$watch('formula', function(){

                calculaTotalPercentoFormulaVacina()

            },true);

        }
    }
});

maladireta.directive('totalFormulaValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {


            scope.$watch('totalPercentoVacina', function(){
                if (scope.totalPercentoVacina == 100){

                    ctrl.$setValidity('totalFormulaValidation', true);


                }
                else{
                    ctrl.msg = attrs.name+' deve somar 100%';
                    ctrl.$setValidity('totalFormulaValidation', false);

                }


            });

        }
    }
});


maladireta.directive('vacinaEspecialValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {


            scope.$watch('itemPedido.formula', function(){

               if ( scope.itemPedido.formula)
                if (scope.itemPedido.formula.length < 1){

                    ctrl.msg ='deve existir ao menos um item na formula';
                    ctrl.$setValidity('vacinaEspecialValidation', false);


                }
                else{
                    ctrl.$setValidity('vacinaEspecialValidation', true);

                }


            },true);

        }
    }
});



maladireta.directive('punturaValidation', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            scope.$watch('itemPedido.elementos', function(){
                if (scope.itemPedido.elementos){
                    if (scope.itemPedido.elementos.length < 1){

                        ctrl.msg ='deve existir ao menos um elemento';
                        ctrl.$setValidity('punturaValidation', false);


                    }
                    else{
                        ctrl.$setValidity('punturaValidation', true);

                    }
                }

            },true);

        }
    }
});




