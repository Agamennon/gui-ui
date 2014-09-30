
/**
 * autoSugestao é um wrapper para angular do jquery ui autocomplete ver:
 * http://jqueryui.com/autocomplete/#combobox
 * http://www.learningjquery.com/2010/06/a-jquery-ui-combobox-under-the-hood/
 * http://amitgharat.wordpress.com/2013/06/08/the-hitchhikers-guide-to-the-directive/
 * https://github.com/jquery/jquery-ui/blob/master/demos/autocomplete/combobox.html  <-- ultima versão
 *
 * uso pode ser usado como diretiva ou atributo <auto-sugestao></auto-sugestao> ou <input auto-sugestao/>
 * attributos:
 *    [source] : é uma fonte de dados que deve existir no escopo pode ser um array de strings ou um array de objetos
 *    [tipo]   :  se o atributo tipo='combobox' transfoma o input em um combobox, a diretiva auto-sugestao-botao vai ser incluida em um template adequado
 *    display  : caso a fonte de dados seja uma array de objetos display serve para se declarar de qual atributo do objeto o valor input vai ser populado
 *               caso  bind-to nao estaja presente é por padrão que o valor bindado no modelo tambem seja o escolhido em display
 *    bindTo   : escolhe o atributo que o modelo vai se bindar, caso o atributo esteja presente mais vazio ex: bind-to="" ou bind-to o modelo sera bindado
 *               ao objeto inteiro, caso tenha um valor ex: bind-to="nome" o modelo sera bindado ao atributo nome do objeto
 *    config   : objeto de configuração que pode conter os seguintes atributos:
 *               dataSource :  alternativa ao source assincrona (source nao pode estar presente como atributo) deve ser declarado como uma função no seguite padrao:
 *                               cfg.dataSource = function(query,callback){
 *                                                   callback(promise);
 *                                                 };
 *                             query vai conter o que foi digitado no autosugest, callback espera uma promessa como argumento que vai resolver com os dados
 *                             a presença de um datasource automaticamente seta minLength para 3 (pode ser alterado usando o atributo minLength)
 *
 *               filter: caso seja necessário pode se passar um nome de um angular $filter para ser usado no lugar do padrão
 *               busca: caso seja necessário um objeto busca no padrão angular filter pode ser passado aqui
 *               renderItem : function(data){
 *                                return "<a>" + data.nome + "<br>" + data.cnpj + "</a>"
 *                             }
 *               altera como o autocomplete exibe os items , a funcao deve retornar um string de html que sera usado
 *               para exibir os resultados. o parametro data contem o objeto
 *
 * Animacao de loading, a classe ui-autocomplete-loading é inserida toda vez que o autocomplete executa uma busca (executa um dataSource)
 * nesta diretiva  a classe ui-autocomplete-loading esta sendo usada da seguinte forma, CSS:
 * input[type="text"].ui-autocomplete-loading {
 *   background:url('/resources/stylesheets/images/ajax-loader.gif')  no-repeat  right center #ffffff;
 *   background-position: 95% 50%;
 *  }
 *
 * faz autocomplete ter scroolbars
 * .ui-autocomplete {
 *   max-height: 600px;
 *   overflow-y: auto;
 *  // prevent horizontal scrollbar
 *   overflow-x: hidden;
 *   }
 *
 */

angular.module('gui.directives').directive('autoSugestao', function($filter,$log) {

    //templates do combobox ou apenas do input normal
    var getTemplate = function(filter) {
        switch (filter) {
            case 'combobox':
                return '<div class="row collapse">'+
                    '<div class="small-11 columns">'+
                    '<input style="width: calc(100% + 19px)"  type="text" />'+
                    '</div>'+
                    '<div class="small-1 columns">'+
                    '<a auto-sugestao-botao  style="width: 20px;" class="button postfix">&#9660</a>'+ //aqui esta a diretiva auto-sugstao-botao
                    '</div>'+
                    '</div>';
            default:
                return '<div><input type="text" /></div>';
        }
    };
    return {
        restrict: 'EA',
        require: 'ngModel',
        scope:{
            source:'=',
            tipo: '@?',
            config:'=?',
            display:'@?',
            bindTo:'@?',
            onSelect:'=',
            onChange:'=',
            minLength:'@?'

        },
        template: function(element,attr){
            return getTemplate(attr.tipo);
        },
        replace:true,
        controller: function($scope) {  //aqui é que esta exposto a api para outras diretivas usarem como exemplo auto-sugetao-botao
            var wasOpen = false;
            this.mouseDownHandler = function(){
                wasOpen = $scope.elm.autocomplete("widget").is(":visible");
            };
            this.open = function(){  //abre o combobox se estiver fechado e fecha o comobox se estiver aberto
                $scope.elm.focus();//elm aqui é o input quando ele recebe foco fecha a busca;
                if (wasOpen)
                    return;
                $scope.elm.autocomplete("search", "");   //isso abre o combobox pq "" é uma busca valida pelo filtro padão para tudo
            };
        },

        link: function($scope, elm, attrs,ngModel) {
            var input,
                cfg,
                autoCompleteCFG,
                oldRequest ='',
                currentData,
                min,
                attributes;
            input =  elm.find('input'); //pega o input interno que sera o alvo para o jquery autocomplete
            cfg = $scope.config;
            if (!cfg) cfg = {};

            attributes = $(elm).prop("attributes"); //copia os atributos para o input interno ja que os atributos estao no pai onde foi declarado
            $.each(attributes, function () { //loop over all attributes and copy them to the <input/>
                input.attr(this.name, this.value);
            });

            autoCompleteCFG = { //configuração basica do jquery autocomplete
                minLength:$scope.minLength || 0,
                delay:0,
                position : {
                    my: "left top",
                    at: "left bottom",
                    collision: "none"  //http://api.jqueryui.com/position/
                }
            };

            if (cfg.dataSource){
                autoCompleteCFG.minLength = $scope.minLength || 3;
            }


            /**
             * data que vem da fonte de dados (depois de filtrada), o jquery autocomplete espera que exista um atributo label e outro value
             * adiciono um atributo data aqui com o objeto completo é o resultado disso correra pelo autosugetao
             * ajustaResposta detecta se data é um array de objetos ou de strings
             */
            function ajustaResposta(data){
                var res = [],
                    x,
                    item;
                if (!data){
                    return res;
                }
                for (x=0;x<data.length;x++){
                    item = {};
                    item.data = data[x];
                    if (typeof data[x] === 'string'){

                        item.label = data[x];
                        item.value = data[x];
                    }else {
                        if (!$scope.display)
                            $log.error ('use atributo display="nomeChave" quando a fonte de dados for um array de objetos');
                        item.value = data[x][$scope.display];
                        item.label = data[x][$scope.display];
                    }
                    res.push(item);
                }
                return res;
            }

            ngModel.$render = function() { //quando o modelo é setado por fora isso decide o que colocar na parte visivel do input
                if (ngModel.$viewValue){
                    if (ngModel.$viewValue[$scope.display]){
                        input.val(ngModel.$viewValue[$scope.display]);
                    }else
                        input.val(ngModel.$viewValue || '');  //o proprio valor que foi setado por fora ou nada
                }else
                    input.val(ngModel.$viewValue || '');  //o proprio valor que foi setado por fora ou nada
            };

            input.on('blur keyup change', function() {
                if ($scope.bindTo === undefined)
                    $scope.$apply(function(){
                        ngModel.$setViewValue(input.val());
                    });
            });

            /**
             * bindo o modelo baseado em opcoes
             * bindo por padrao no valor passado pelo autocomplete, uso o display se ele exsite ou bindo pelo bind-to
             */
            function applyBinding(ui){
                $scope.$apply(function(){
                    if (!$scope.display){
                        input.val(ui.item.value);
                        ngModel.$setViewValue(ui.item.value);
                    }else{
                        input.val(ui.item.data[$scope.display]);
                        if ($scope.bindTo === undefined)
                            ngModel.$setViewValue(ui.item.data[$scope.display]);
                        else{
                            if ($scope.bindTo === "")
                                ngModel.$setViewValue(ui.item.data);
                            else
                                ngModel.$setViewValue(ui.item.data[$scope.bindTo]);
                        }
                    }
                });
            }

            /**
             * evento change do autocomplete (que aciona no blur do input)
             * tem o hook para o evento de atributo da api
             */
            autoCompleteCFG.change = function(event,ui){
                if ($scope.onChange !== undefined)
                    $scope.$apply(function(){
                        $scope.onChange(ui.item.data);
                    });
            };

            /**
             * evento select, bindo o modelo e previno que o autocomplete receba o valor
             * para permitir que eu possa por fora da diretiva (no evento onSelect por exemplor)
             * alterar o modelo se que ele seja sobrescrito assincronamente pelo autocomplete
             * tambem, tem um hook para o onSelect do usuario
             */
            autoCompleteCFG.select = function(event,ui){

                applyBinding(ui);
                input.val(ui.item.value);
              //  input.val('');
                if ($scope.onSelect !== undefined)
                    $scope.$apply(function(){
                        $scope.onSelect(ui.item.data,input);
                    });
                event.preventDefault(); //previne o input de receber o valor ??? nao funciona

            };

            function setResponse(data,term,response){
                if (cfg.filter){
                    response(ajustaResposta($filter(cfg.filter)(data,term)));

                }else{
                    if (cfg.busca)
                        term = {termo:request,busca:cfg.busca};
                    response(ajustaResposta($filter('busca')(data,term)));

                }
            }

            /**
             * uso o minLength tambem para fazer a busca apenas pelo intervalo do minLength
             * se as n primeiras letras não mudarão no query nao busco denovo e uso os dados
             * ja recebidos
             */
            function permiteRequest(term){
                min = autoCompleteCFG.minLength;
                if (term === ''){
                    return true;
                }
                return term.substr(0,min) !== oldRequest.substr(0,min)
              //  return true;
            }

            autoCompleteCFG.source =  function(request,response){
                if ($scope.source){
                    setResponse($scope.source,request.term,response);
                }
                else if (permiteRequest(request.term)){
                    oldRequest = request.term;
                    cfg.dataSource(request.term,function(dataPromise){
                        dataPromise.then(function(data){ //desdobra a promessa
                            currentData = data;
                            setResponse(data,request.term,response);
                        },function(erro){
                            response("");
                            throw('erro na promessa do datasource');
                        });
                    });
                }else
                    setResponse(currentData,request.term,response);
            };



            $scope.elm =  input.autocomplete(autoCompleteCFG);





            if (cfg.renderItem){
                input.data('ui-autocomplete')._renderItem = function ( ul, item ) {
                    var renderHtml = $( "<li></li>" ).data( "ui-autocomplete-item", item );
                    renderHtml.append($scope.config.renderItem(item.data));
                    renderHtml.appendTo( ul );
                    return renderHtml;
                };
            }
        }
    };
});

angular.module('gui.directives').directive('autoSugestaoBotao', function() {
    return {
        restrict: 'A',
        require: '^autoSugestao',//pega o controller auto-sugestao
        link: function(scope, elm, attrs, autoSugestao) {
            elm.bind('click', function() {
                autoSugestao.open();
            });
            elm.mousedown(function(){
                autoSugestao.mouseDownHandler();
            });
        }
    };
});



/*
 angular.module('gui.directives').directive('guiAutoComplete',
 function(dm,$filter,utils) {

 var defaultConfig;

 defaultConfig = {
 minLength:3,
 delay:0,
 position : {
 my: "left top",
 at: "left bottom",
 collision: "none"  //http://api.jqueryui.com/position/
 }
 };

 return {
 restrict:'A',
 require: '?ngModel',

 link: function(scope, elm, attrs,modelCtrl) {

 //  a classe .ui-autocomplete-loading eh adicionada automaticamente
 //.ui-autocomplete configura algums parametros de css iniciais

 var configObject = scope.$eval(attrs.guiAutoComplete);
 if (typeof configObject !== 'object' || typeof configObject === null){
 console.log('Diretiva gui-auto-complete não tem um objecto de configuracao');
 }

 // comba os objetos defaultConfig e configObject (configObject tmb sobrescreve qualquer valor duplicado em defaultObject)
 var config = angular.extend({}, defaultConfig, configObject);

 var oldTerm = "";
 if ( config.hasOwnProperty('dataSource') ) {

 var currentData;

 config.source = function(request,response){
 var term = utils.noAccent(request.term).toLowerCase();

 if (term.substr(0,config.minLength) !== oldTerm.substr(0,config.minLength)){
 config.dataSource(term,function(erro,data){
 if (!erro){
 oldTerm = term;
 currentData = data;
 response(data);
 } else{
 console.log(erro);
 response ("");
 }
 });
 }else{
 //se é um array contendo objetos essa filtragem secundaria tem que ser manual ja que gui-filter so filtra um simples array
 if (typeof currentData[0] ===  'object'){
 var filterResults = $filter('gui-filtra-busca-cliente')(currentData,term);
 response(filterResults);

 }else{
 if (typeof currentData[0] ===  'string'){
 response ($filter('gui-filter')(currentData,term));
 } else{
 //  console.log('objeto recebido do dataSource se perdeu ou esta mal formatado');
 response(); //
 }
 }
 }
 };
 }else {
 console.log('datasource esta faltando no objeto de configuracao do autocomplete');
 }

 //cria o autocomplete usando objeto de configuracao
 var autocomplete =  elm.autocomplete(config);

 elm.on( "autocompletechange", function( event, ui ){  //blur event
 if (config.hasOwnProperty('bindOptions')){
 if (config.bindOptions.hasOwnProperty('onBlur')){
 if(modelCtrl){
 scope.$apply(modelCtrl.$setViewValue(config.bindOptions.onBlur(elm,ui)));
 }else{
 elm.val(config.bindOptions.onBlur(elm,ui));
 }

 }
 }
 if ( config.hasOwnProperty('onBlur') ) {
 scope.$apply(config.onBlur(elm,ui));
 }
 } );

 elm.on( "autocompleteselect", function( event, ui ){
 if (config.hasOwnProperty('bindOptions')){
 if (modelCtrl){
 if (config.bindOptions.hasOwnProperty('onSelect')){
 scope.$apply(modelCtrl.$setViewValue(config.bindOptions.onSelect(elm,ui.item)));
 }
 else{ //default binding
 scope.$apply(modelCtrl.$setViewValue(ui.item.value));
 }
 }
 }
 if ( config.hasOwnProperty('onSelect') ) {
 scope.$apply(config.onSelect(elm,ui));
 }
 });

 //chama a funcao setStyle definida dentro do config passando o elemento a ser estilizado
 if (config.hasOwnProperty('setStyle')){
 var myelm = $('.ui-autocomplete');
 config.setStyle(myelm);
 }

 if ( config.hasOwnProperty('renderItem') ) {
 elm.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
 return $( "<li></li>" )
 .data( "ui-autocomplete-item", item )
 .append(config.renderItem(item))
 .appendTo( ul );
 };
 }

 }
 }
 }

 );*/

