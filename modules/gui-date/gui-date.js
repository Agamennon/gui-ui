/**
 * jquery ui date wrapper  http://jqueryui.com/datepicker/
 *  usa http://momentjs.com
 *  é guardado no banco apenas javascript date objects em texto : 2012-10-08T21:27:01.667Z qualquer data atribuida ao model deve ser nesse formato
 */
angular.module('gui.directives').directive('guiDate', [
    'gui.config','utils', function(uiConfig) {
        var defaultOptions;

        defaultOptions = {
            yearRange:"1900:2099",
            changeYear:true,
            changeMonth:true,
            selectOtherMonths:true,
            stepMonths:1

        };

        if (uiConfig.date != null) {
            angular.extend(defaultOptions, uiConfig.date);
        }
        return {

            require: '?ngModel',
            restrict: 'A',

            link: function(scope, element, attrs, controller) {
                var opts, updateModel;
                opts = angular.extend({}, defaultOptions);
                //seta uma mascara
                element.mask('99/99/9999');



                if (controller != null) {
                    /*o paremetro date vem do onSelect ou onClose sempre no formato DD-MM-YYYY
                     * cria uma data tipo moment e uma variavel java script data
                     * mData(tipo moment) é usada para se saber se é uma data valida
                     * caso verdadeiro seto o modelo para o objeto java script data
                     *
                     * */

                    updateModel = function(date) {
                        scope.$apply(function(){
                            var mDate = moment(date,"DD-MM-YYYY");
                            if (mDate){
                                var jsDate = mDate.toDate();

                                if (mDate.isValid()){
                                    controller.$setViewValue(jsDate);
                                    //   controller.$setValidity("invalid date",true);
                                }else{
                                    //  controller.msg = attrs.name+ " invalida";
                                    //  controller.$setViewValue(jsDate);
                                    controller.$setViewValue("");
                                    element.datepicker("setDate","");
                                    //  controller.$setValidity("invalid date",false);
                                }
                            }
                        });


                    };

                    opts.onSelect = function(date){
                        updateModel(date);
                    };

                    opts.onClose= function(date){
                        updateModel(date)
                    };

                    //toda vez que o modelo for setado fora render é executado
                    controller.$render = function() {

                        if (controller.hasOwnProperty('$viewValue')){
                            var value = controller.$viewValue;
                            if ((value === "") ||(value === undefined)){
                                element.datepicker("setDate","");
                                //    controller.$setValidity("invalid date",false);
                            }else{
                                var date = moment(value);
                                if (date.isValid()){
                                    element.datepicker("setDate",date.toDate());
                                    //           controller.$setValidity("invalid date",true);
                                }else{
                                    //         controller.msg = attrs.name+ " invalida";
                                    element.datepicker("setDate","");
                                    //         controller.$setValidity("invalid date",false);
                                }
                            }
                        }

                    };

                }

                // element.datepicker();
                element.datepicker(opts);

                if (attrs.guiDate == "hoje"){
                    var today = new Date();
                    element.datepicker("setDate", today);
                }


            }
        };
    }
]);