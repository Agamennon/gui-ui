/**
 * wrapper para jquery ui tabs
 * uso  use a diretiva guiTab e forneca um objeto de configuracao no padrao jquery ui tabs
 * uso dentro da diretiva uso igual ao padrao jquery ui tabs
 *
 * objeto de configuracao deve ser configurado com um valor extra ou para vertical=true ou horizontal=true
 * lembrando que para vertical css extra tem que ser adicionado:
 *
 .ui-tabs-vertical .ui-tabs-nav-vert {
    padding: .2em .1em .2em .2em;
    float: left;
}

 .ui-tabs-vertical .ui-tabs-nav-vert li {
    clear: left;
    width: 100%;
    border-bottom-width: 1px !important;
    border-right-width: 0 !important;
    margin: 0 -1px .2em 0;
}

 .ui-tabs-vertical .ui-tabs-nav-vert li a {
    display:block;
    padding: .5em 1em;
}

 .ui-tabs-vertical .ui-tabs-nav-vert li.ui-tabs-active {
    padding-bottom: 0;
    padding-right: .1em;
    border-right-width: 1px;
    border-right-width: 1px;
}

 .ui-tabs-vertical .ui-tabs-panel {
    padding: 1em;

}
  ISTO E APENAS PARA REMOVER A BORDA (NO CASO HORIZONTAL) opcional
 .ui-widget-content .ui-tabs-horizontal {
    border: none;

}
 */
angular.module('gui.directives').directive('guiTabs', [
    'gui.config', function(uiConfig) {

        var defaultOptions;
        defaultOptions = {
            fx: { height: 'toggle', duration: 'fast' }
        };

        return {


            priority:0,
            restrict:'EA',
            transclude:true,
            replace:true,

            scope:{'config':'='},

            template:'<div id="tabs">'+
                 '<div  ng-transclude></div>'+
                 '</div>',

            link: function(scope, element, attrs){

              //  var opts = scope.$eval(attrs.options);
                //var opts = scope.options


                var config = angular.extend({}, defaultOptions, scope.config);
                //  var opts = angular.extend({}, defaultOptions, scope.options);

                // scope.consulta = scope.options.consulta;

                scope.tabs = element.tabs(config);


                if (config.vertical){

                    scope.tabs.addClass( "ui-tabs-vertical ui-helper-clearfix");
                    $(".ui-tabs-vertical .ui-tabs-nav").removeClass("ui-tabs-nav").addClass("ui-tabs-nav-vert");

                    //  scope.tabs.addClass( "ui-tabs-vertical ui-helper-clearfix" );
                    //  $("#tabs li").removeClass( "ui-corner-top ui-tabs-nav").addClass( "ui-corner-left" );

                }

                if (config.horizontal){

                    //  scope.tabs.removeClass( "ui-tabs-vertical" );
                    scope.tabs.addClass( "ui-tabs-horizontal" );

                    // scope.tabs.addClass( "ui-tabs-horizontal");
                    $("#tabs li").addClass( "ui-corner-top").removeClass( "ui-corner-left" );
                }

            }
        };
    }
]);