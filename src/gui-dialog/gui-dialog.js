/**
 * wraper para http://jqueryui.com/dialog/

 */

/**
 * guiDialogServiceHelper é o servico que opera na criacao e manipulacao dos dialogs jquery
 * tanto o servico guiDialogService quanto a diretiva guiDialog operam usando esse servico, que por sua vez
 * viabiliza praticamente todas as funcionalidades
 *
 * o servico comeca instanciando um defaultConfig esse objeto no padrao jquery ui dialog config é a configuracao base
 * onde todas as outras sobrescrevem, ela define um objeto close que se encarrega de removes qualquer item instanciado dentro
 * do dialogo como tambem destroi a caixa de dialogo
 *
 * my.createDialog(elm,config) é a funcao que cria a caixa de dialogo no elemento elm com as configuracoes config, ela tambem
 * inspeciona o config para a presenca de config.content que sera appendado como conteudo do dialogo  (pode ser um string html ou um objecto jquery)
 * no final body.show() deixa visivel o conteudo do dialogo que foi escondido na criacao da diretiva (ja que deve ser visivel apenas dentro da caixa de dialogo)
 *
 * my.show(elm,args,config)  elm é o elemento que sera usado para criar o dialog (com my.createDialog) args é a colecao de argumentos passada para
 * a funcao (ja que my.show) tem overloads no caso nenhum argumento em args (cria um dialog com o config padrao) um argumento tipo objeto
 * (cria um dialogo com o objeto de configuracao + o config , ou args = dois strings, cria um dialogo com titulo e conteudo
 *
 * my.confirm(elm,title,content,callback,cfg)  cria um dialogo no elm com as configuracoes cfg, com o titulo e o content,
 * fornece um callback (true e false para os botoes)
 *
 *
 */

'use strict';
angular.module('gui.directives').factory('guiDialogServiceHelper',function ($compile,$rootScope){
//medip.factory('guiDialogServiceHelper', function (utils){
    var my = {};

    my.defaultConfig = {
        autoOpen: false,
        modal:true,
        draggable:true,
        resizable:false,
        show:"fade",
        hide:"fade",
        stack:true,
        close:function(){
            //o objecto :content da configuracao foi appendado  , aqui ele tem que ser removido (ou permanecera na DOM)
            var content = ($( this ).dialog( "option", "content" ));
            if (content instanceof jQuery){
                content.remove();
            }

            $(this).dialog('destroy');
        },
        buttons:{
            "Ok": function() {
                $(this).dialog("close");
            }
        }
    };


    my.createDialog = function (elm,config){

        var body =  elm.children(":first");
        if (config.content){

            var content;
            if (config.content instanceof jQuery){
                content = config.content;
            }else{
                content = $("<div>"+config.content+"</div>");
            }
            config.content = content;

            body.append(content);

        }
        body.show();
        if (config.scope){
            var compiled = $compile(elm);
            compiled(config.scope);
            config.scope.safeApply();

        }else{
            $rootScope.safeApply();
        }



        config = angular.extend({},my.defaultConfig,config);
        elm.dialog(config);



    };


    my.show = function (elm,args,config){
        function paramError (){
            throw new Error ("Parametros da funcao show (gui-dialog) deve ser um objeto ou dois strings");
        }


        if (args.length === 1){
            if (args[0] != null && typeof  args[0] === 'object'){
                my.createDialog(elm,angular.extend({},config,args[0]));
            }else{
                if (args[0] != null && typeof  args[0] === 'string'){
                    my.createDialog(elm,angular.extend({},config,{title:args[0]}));
                }else{
                    paramError();
                }

            }
        }

        if (args.length === 2){
            if ((args[0] != null && typeof  args[0] === 'string')&& (args[1] != null && typeof  args[1] === 'string')){
                my.createDialog(elm,angular.extend({},config,{title:args[0],content:args[1]}));
            }else{
                paramError();
            }
        }

        if (args.length < 1){
            my.createDialog(elm,angular.extend({},config));
        }

        if (args.length > 2){
            paramError();
        }





     //   compiled();
        elm.dialog( "open" );


    };

    my.confirm = function(elm,title,content,callback,cfg){
        var config = {};
        config.content = "";
        config.title = title;
        config.content = content;

        config.buttons = {
            "Confirma": function() {
                elm.dialog("close");
                config.content = "";
                callback(true);
            },
            "Cancela": function(){
                elm.dialog("close");
                callback(false);
            }
        };
        config = angular.extend({},config,cfg);

        my.createDialog(elm,config);
        elm.dialog( "open" );
    };


    return my
});



/**
 * o guiDialogservice prove algums servicos:
 * show()  exibe uma caixa de dialogo configuravel
 *     aceita como parametros um objeto de configuracao no padrao do jquery ui dialog ou dois strings (titulo,conteudo) ex:
 *     show("erro","voce esqueceu concordar") ou guiDialogService.show({title:"erro",content:"voce esqueceu de concordar", width:800})
 *
 * confirm() exibe uma caixa de dialogo com botoes confirma e cancela, tambem contem um callback com o resultado da escolha
 *    aceita como parametros titulo, conteudo, callback, e objecto de configuracao jquery ui dialog (opcional) ex:
 *    confirm("Apagar registro","Voce tem certeza que quer apagar o registro?",
 *    function(res){
 *        if (res){
 *           apagar()
 *        }else
 *           naoApagar()
 *    }, {width:800} );
 *
 *    showFormErros(form, [accordion]) exibe uma caixa de dialog com todos os erros de um formulario form passado como parametro ex:
 *        showFormErros(formCliente) faz uso de utils.agregaErrosDoFormulario que devolve um um
 *        array de objetos {msg:"compo x obrigatorio",name:"x") depois constroi uma estrutura ul li  com os erros.msg
 *        caso um accordion seja passao ele tambem muda a aba do accordion para a aba com erro
 *
 *
 */

angular.module('gui.directives').factory('guiDialogService',function (utils,$rootScope,guiDialogServiceHelper){
//medip.factory('guiDialogService', function (utils,guiDialogServiceHelper){
    var dialogService = {};

    var elm = $("<div id='mainDialog' > <div id='mainDialogBody'></div> </div>");

    var mainBody = $("#mainBody");
    mainBody.append(elm);

    dialogService.show = function(){

        guiDialogServiceHelper.show(elm,arguments);
    };

    dialogService.confirm = function(title,content,callback,cfg){

        guiDialogServiceHelper.confirm(elm,title,content,callback,cfg);
    };

    dialogService.showFormErrors = function(title,form, accordion){
        var content = $("<ul style='margin: 0px 0px 0px 10px;'></ul>");
        var erros = utils.agregaErrosDoFormulario(form);


        console.log();
        for (var i in erros){
            content.append("<li>"+erros[i].msg+"</li>");
        }

        guiDialogServiceHelper.createDialog(elm,{title:title, content:content});
        elm.dialog( "open" );
        if (accordion){
            mudaAbaAccordion(erros,accordion);
        }


    };


    function mudaAbaAccordion (erros,accordion){

        // aba vai abrir para o primeiro campo que tiver na colecao erros
        //remove de nome caso seja um campo multi o seu numeral []
        if (erros[0])
        { var nome = erros[0].name;
        //    nome = removeNumberFromName(nome);

            //procura campos que tenham um atributo chamado name com o valor +nome+  o chapel quer dizer starts with
            //  nome = "[name|='"+nome+"']";
            nome = "[name^='"+nome+"']";

            var teste = $(nome);

            //verifica se o campo tem como parente com a ID pagina1
            if ($(nome).parents().is("#pagina1")){
                // console.log(accordion.accordion( "option", "active" ));
                if (accordion.accordion( "option", "active" )!==0)
                    accordion.accordion( "option", "active", 0 );

            }

            if ($(nome).parents().is("#pagina2")){
                if (accordion.accordion( "option", "active" )!==1)
                    accordion.accordion( "option", "active", 1 );
            }

            if ($(nome).parents().is("#pagina3")){
                if (accordion.accordion( "option", "active" )!==2)
                    accordion.accordion( "option", "active", 2 );
            }
        }

    }

    return dialogService
});



/**
 * a diretiva guiDialog prove algums servicos
 * show()  exibe uma caixa de dialogo configuravel
 *     aceita como parametros um objeto de configuracao no padrao do jquery ui dialog ou dois strings (titulo,conteudo) ex:
 *     show("erro","voce esqueceu concordar") ou guiDialogService.show({title:"erro",content:"voce esqueceu de concordar", width:800})
 *     show tambem deixara visivel qualquer conteudo inserido dentro do elemento guiDialog para mostrar apenas o que foi colocado dentro da diretiva
 *     use show() sem parametros
 *
 * confirm() exibe uma caixa de dialogo com botoes confirma e cancela, tambem contem um callback com o resultado da escolha
 *    aceita como parametros titulo, conteudo, callback, e objecto de configuracao jquery ui dialog (opcional) ex:
 *    confirm("Apagar registro","Voce tem certeza que quer apagar o registro?",
 *    function(res){
 *        if (res){
 *           apagar()
 *        }else
 *           naoApagar()
 *    }, {width:800} );
 *
 *
 *
 *
 */

angular.module('gui.directives').directive('guiDialog', function(guiDialogServiceHelper) {
//medip.directive('guiDialog', function(guiDialogServiceHelper) {

    return {
        restrict: 'EA',
        scope:{'config':'=',
               'dialog':'='
        },

        template:
            '<div id="mainDialogDiv"  style="overflow-y:auto; overflow-x: hidden; max-height: 800px;">' +
                '<div  ng-model="cu" class="body" ng-transclude></div>'+
                '</div>',
        replace: true,
        transclude: true,
        link: function postLink($scope, elm, attrs, modelCtrl) {

            if (typeof $scope.config !== 'object' || typeof $scope.config === null){
                 console.log('Diretiva gui-dialog não tem um objeto de configuracao');
            }



            //os elementos internos declarativos inseridos dentro da diretiva estao visiveis, mais devem ser visiveis apenas dentro do dialog
            $scope.body =  elm.children(":first");
            $scope.body.hide();


            $scope.dialog.show = function(){

                guiDialogServiceHelper.show(elm,arguments,$scope.config);
            };

            $scope.dialog.confirm = function(title,content,callback,config){

                guiDialogServiceHelper.confirm(elm,title,content,callback,config);
            };

        }
    }
});
