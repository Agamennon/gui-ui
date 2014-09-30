
'use strict';

angular.module('gui.directives').directive('fooTable', [
    'gui.config', function() {

        return {
            restrict:'A',

            link: function (scope, element, attrs){


                var self = {};


                var options = {},
                    breakpoints = [],
                    table = {};

                table.headers = [];
                table.columns = [];
                table.rows = [];

                options.breakpoints = { // The different screen resolution breakpoints
                    phone: 480,
                    tablet: 800,
                    nobreak: 99999

                };

                options.parsers = {
                    'alpha':function(field){
                        var x = field.find(":last").html();
                        if (x === undefined){
                            return field.html();
                        }else
                            return x;

                    },
                    'date':function(field){
                        var x =  field.html();
                        x = x.split("/");
                        x = x[2]+x[1]+x[0];
                        return x;
                    }
                };

                options.sorters = {
                    'alpha':function(a,b){
                        if (a.value == b.value) return 0;
                        if (a.value < b.value) return -1;
                        return 1;
                    },
                    'date':function(a,b){

                        if (a.value == b.value) return 0;
                        if (a.value < b.value) return -1;
                        return 1;
                    }
                };

                options = angular.extend({},options,scope.$eval(attrs.options));


                // Create a nice friendly array to work with out of the breakpoints object.
                for(var name in options.breakpoints) {
                    breakpoints.push({ 'name': name, 'width': options.breakpoints[name] });
                }

                // Sort the breakpoints so the smallest is checked first
                breakpoints.sort(function(a, b) { return a['width'] - b['width']; });

                //intervalo que onde o width do elemento é checado


                self.interval = setInterval(
                    function(){
                        scope.$apply(
                            function(){
                                self.tableWidth = element.width();
                                updateBreakPoints();
                            });

                    },100
                );



                //limpo o intervalo quando o scopo é removido
                scope.$on('$destroy',function(){
                    clearInterval(self.interval);
                });

                /**
                 * dado um header itera sobre seus items (que sao celulas da tabla) representando a coluna desse header
                 *
                 * @param header
                 * header.items sao as celulas da coluna desse header ex: considerando um header na terceira coluna
                 * seus items serao serao todos os items apenas da terceira coluna de todas as linhas
                 */
                function removeColuna(header){
                    header.obj.hide();
                    header.visible = false;    //é usado no retornaColuna para saber se é necessario repor
                    var item,cellItem,innerContent,rowDetails;
                    for (var i in header.items){
                        item =  header.items[i]; //item representa uma celula da tabela (da coluna do header)
                        if (!item.hasClass('removed')){
                            /*
                             cellItem contem mais informacoes sobre a celula  {header,rowObj,obj,contents};
                             rowObj é a coluna dessa celula, header é o header dessa celula, obj é a celula, contents é obj.contents()
                             */
                            cellItem = item.data("cellItem");
                            //cria o innerContent que vai conter os dados dentro do row de detalhes
                            innerContent = $('<div></div>');
                            innerContent.append('<strong>'+header.text+' : '+'</strong>');
                            //cellItem.contents agora nao ficara mais na celula e sim dentro do nosso innerContent
                            innerContent.append(cellItem.contents);
                            /*
                             rowDetails contem mais informacoes sobre o row {items,detailRow}
                             items é uma array de objetos de celulas desse
                             detailRow é o tr de detalhes desse row (o row logo abaixo dele)
                             detailRow.content = é o ultimo div dentro do detailRow
                             */
                            rowDetails = cellItem.rowObj.data("rowDetails");
                            rowDetails.detailRow.content.prepend(innerContent);
                            /*
                             da update no cellItem com o objeto innerContent
                             que é o objeto do painel de detalhes que sera deletado quando o painel for retornado
                             (mais seu conteudo interno sera salvo de volta no row)
                             */

                            cellItem.innerContent = innerContent;
                            item.data("cellItem",cellItem);
                            //agora essa row tem a classe has-detail (usada para saber se tem ou nao tem um painel na row)
                            cellItem.rowObj.addClass("has-detail");
                            //sinaliza que a cell foi removida (evita re-remocao ver inicio dessa funcao)
                            item.addClass("removed");
                            //na verdade o conteudo da celula é removido .. mais nao o TD .. portanto devo esconder a celula
                            //para nao desenhar uma TD(vazio);
                            cellItem.obj.hide();
                        }
                    }
                }

                function retornaColuna(header){

                    if (header.visible === false){

                        header.obj.show();
                        header.visible = true;

                        var item;
                        for (var i in header.items){

                            item =  header.items[i];

                            if (item.hasClass('removed')){

                                var cellItem = item.data("cellItem");
                                var rowDetails = cellItem.rowObj.data("rowDetails");
                                if (cellItem.innerContent){
                                    //retorna o conteudo
                                    item.append(cellItem.contents);
                                    //agora sem o conteudo e com apenas a casca (<strong etc..)  remover....
                                    cellItem.innerContent.remove();
                                    item.removeClass("removed");
                                }
                            }


                            item.show();

                            if (rowDetails.detailRow.content[0].children.length === 0){
                                rowDetails.detailRow.obj.hide();
                                cellItem.rowObj.removeClass("has-detail");
                                cellItem.rowObj.removeClass('footable-detail-show');
                            }

                        }

                    }

                }


                function updateVisibleColumns(breakpoint){

                    var dataHide,header,found;

                    for (var i in table.headers){
                        header = table.headers[i];
                        //dataHide sao quais os break foram passados no artributo  tablet phone etc...
                        dataHide = table.headers[i].obj.attr("data-hide");

                        if (dataHide !== undefined){
                            dataHide = dataHide.split(" ");
                            found = false;
                            for (var j in dataHide){
                                var bkWidth = options.breakpoints[dataHide[j]];
                                if (bkWidth >= self.tableWidth){
                                    //quer dizer que em algum breakpoint é maior que a tabela
                                    //portanto esse header tem que ser removido
                                    found = true
                                }
                            }
                            if (found) {
                                removeColuna(header);

                            }
                            else{
                                retornaColuna(header);

                            }
                        }
                    }

                }



                function updateBreakPoints(){
                    if (element.is(":visible")){

                        //trigger updateOnBreakpointChange
                        for (var i in breakpoints){
                            if (self.tableWidth <= breakpoints[i].width){

                                if (table.breakpointName !== breakpoints[i].name){
                                    table.breakpointName = breakpoints[i].name;
                                    updateVisibleColumns(breakpoints[i]);
                                }
                                return
                            }

                        }
                        //nao tem um break definido .... entao noBreak
                        if (table.breakpointName !== 'nobreak'){
                            table.breakpointName = 'nobreak';
                            updateVisibleColumns({name:'nobreak'});
                        }
                    }
                }

                //evento especial para associar o remove dos paineis de detalhe
                jQuery.event.special.destroyed = {
                    remove: function(o) {
                        if (o.handler) {
                            o.handler.apply(this,arguments)
                        }
                    }
                };

                setTimeout(function(){
                    scope.$apply(function(){

                        table.body = element.find("tbody");

                        var headersRows =  element.find("th"),
                            headerObj,
                            headerItem;

                        for (var x=0 ; x < headersRows.length ; x++){
                            headerObj = $(headersRows[x]);
                            headerItem = {text:headerObj.html(), obj:headerObj, items:[], visible:true};
                            table.headers.push(headerItem);

                            if (headerObj.attr('sort') !== undefined){
                                headerItem.span = $('<span />').appendTo(headerObj);
                            }
                            headerObj.on("click",{headerItem:headerItem},headerClick);

                        }

                        function updateTable(){

                            table.rows = [];

                            for ( i in table.headers){
                                table.headers[i].items = []
                            }

                            var  rowObj,rowCells,cellObj,cellItem;
                            var rows =  element.find('tbody > tr').not('.footable-row-detail');

                            //para todas as linhas da tabela
                            for (var i=0 ; i < rows.length; i++){

                                rowObj = $(rows[i]);
                                //    rowObj.addClass(Math.floor(Math.random()*1001).toString());
                                rowDetails = rowObj.data("rowDetails");

                                //  if (!rowObj.hasClass('has-details')){
                                if (!rowDetails){
                                    var rowDetails = {items:[],detailRow:{}};
                                    var tr = $('<tr class="footable-row-detail"></tr>');
                                    var td = $('<td class="footable-cell-detail" colspan="100"></td>');
                                    var div = $('<div class="footable-row-detail-inner"></div>');

                                    tr.append(td);
                                    td.append(div);
                                    rowDetails.detailRow.obj = tr;
                                    rowDetails.detailRow.content = div;
                                    tr.hide();
                                    rowObj.after(tr);

                                    rowObj.bind('destroyed',{obj:tr}, function(event) {
                                        //remove o tr (paniel detalhes)
                                        event.data.obj.remove();
                                    });

                                    //  rowObj.data("rowDetails",rowDetails);
                                    //     rowObj.addClass('has-details');
                                    /// rowDetails.hasDetail = true;


                                    rowCells = rowObj.find('td').not('.footable-cell-detail');
                                    //para todas as celulas da linha
                                    for (var j=0; j<rowCells.length; j++){
                                        cellObj = $(rowCells[j]);


                                        cellItem =  {header:table.headers[j], rowObj:rowObj, obj:cellObj, contents:cellObj.contents()};
                                        cellObj.data("cellItem",cellItem);

                                        rowDetails.items.push(cellObj);

                                        if (table.headers.length > 0){
                                            //cara coluna tem seus items todos dessa linha para cada header
                                            //lembrando que a posicao j de cada item é a mesma do header
                                            table.headers[j].items.push(cellObj);
                                            //adiciona a classe expand (que vem do data class) para o elemento que vai conter o + -
                                            var dataClass = table.headers[j].obj.attr("data-class");
                                            if (dataClass !== undefined){
                                                cellObj.addClass(dataClass);
                                                //click do row
                                                rowObj.on('click',{rowObj:rowObj, cellObj:cellObj},function(event){

                                                    var rowDetails = event.data.rowObj.data("rowDetails");
                                                    var rowObj = event.data.rowObj;
                                                    //apenas togle o paniel se o painel tem alguma coisa (classe has-detail)
                                                    if (rowObj.hasClass("has-detail"))    {

                                                        if (rowObj.hasClass('footable-detail-show')){
                                                            rowDetails.detailRow.obj.hide();
                                                            rowObj.removeClass('footable-detail-show');
                                                        }else{
                                                            rowDetails.detailRow.obj.show();
                                                            rowObj.addClass('footable-detail-show'); //sinal negativo
                                                        }
                                                    }

                                                });
                                            }

                                        }
                                    }
                                    rowObj.data("rowDetails",rowDetails);


                                } else{


                                    /*
                                     isso é necessario por que quando o modelo muda novos TD sao colocados
                                     por diretivas como ng-repeat e nao necessariamente no final (os td dos paineis detalhe)
                                     nao ficaram mais como proximos de seus dados pois um novo TD pode ter aparecido no meio deles
                                     */
                                    rowDetails.detailRow.obj.detach();
                                    rowObj.after(rowDetails.detailRow.obj);

                                    for (j=0;j<rowDetails.items.length;j++){
                                        cellObj = rowDetails.items[j];
                                        if (table.headers.length > 0){
                                            cellItem = cellObj.data("cellItem");
                                            table.headers[j].items.push(cellObj);
                                        }
                                    }


                                }

                                table.rows.push(rowObj);
                            }

                        }

                        function removeIndicatorsFromOtherHeaders(headerItemToPreserve){
                            for (var x in table.headers){
                                var indicator;
                                var headerObj = table.headers[x].obj;
                                indicator =table.headers[x].span;
                                //  [0] necessario que estou comparando o componente html nao o jquery obj
                                if (headerObj[0] != headerItemToPreserve.obj[0]){
                                    if (indicator !== undefined){
                                        indicator.removeClass("sortable");
                                    }
                                }
                            }
                        }

                        function headerClick(event){

                            //parametro passado para headerClick (o objeto header clicado)
                            var headerItem = event.data.headerItem;

                            //se foi setado o atributo sort no header da tablela sortAtribute vai ser number string data... [sort="string"]
                            var sortAtributeValue = headerItem.obj.attr('sort') || 'ascending';
                            //span que contem a seta de direcao
                            var indicator = headerItem.span;
                            if ((sortAtributeValue !== undefined) && (indicator !== undefined)){
                                removeIndicatorsFromOtherHeaders(headerItem);
                                if (!indicator.hasClass('sortable')){
                                    indicator.addClass('sortable');
                                }

                                if (indicator.hasClass('sortable-asc')){
                                    indicator.removeClass('sortable-asc');
                                    indicator.addClass('sortable-desc');
                                    sort("descending",headerItem);
                                    return
                                }
                                if (indicator.hasClass('sortable-desc')){
                                    indicator.removeClass('sortable-desc');
                                    indicator.addClass('sortable-asc');
                                    sort("ascending",headerItem);
                                    return
                                }
                                //primeiro click
                                if (sortAtributeValue === "ascending"){
                                    indicator.addClass('sortable-asc');
                                    sort("ascending",headerItem);
                                    return
                                }

                                if (sortAtributeValue === "descending"){
                                    indicator.addClass('sortable-desc');
                                    sort("descending",headerItem);

                                }

                            }

                        }

                        function parseAllFields(headerItem){
                            table.columns = [];
                            for (var i in headerItem.items){
                                var cellObj = headerItem.items[i];

                                var sortType = headerItem.obj.attr('data-type');
                                var parseFunction = options.parsers[sortType] || options.parsers['alpha'];
                                var parsedValue = parseFunction(cellObj);
                                var cellItem = cellObj.data("cellItem");
                                // var rowItem =  headerItem.items[i].row;
                                table.columns.push({value:parsedValue,row:cellItem.rowObj});
                                // headerItem.items[i].parsedData = parsedValue;
                            }
                        }

                        function sort(direction, headerItem){
                            parseAllFields(headerItem);
                            var sortType =  headerItem.obj.attr('data-type');
                            var sortFunction = options.sorters[sortType] || options.sorters['alpha'];
                            table.columns.sort(sortFunction);

                            if (direction === 'descending'){
                                table.columns.reverse();
                            }

                            var rowDetails;

                            for (var i in table.columns){
                                rowDetails = table.columns[i].row.data('rowDetails');
                                table.columns[i].row.detach();
                                rowDetails.detailRow.obj.detach();
                                table.body.append(table.columns[i].row);
                                table.body.append(rowDetails.detailRow.obj);

                            }


                        }



                        scope.$watch(attrs.model,function(){

                            setTimeout(function(){
                                scope.$apply(function(){
                                    updateTable();
                                    table.breakpointName = "";
                                    updateBreakPoints();
                                    //se um campo ja foi usado para sort e um nova coluna foi inserida re-sort
                                    for (x in table.headers){
                                        var span = table.headers[x].span;
                                        if (span !== undefined){
                                            if (span.hasClass('sortable-asc')){
                                                //  span.removeClass('sortable-desc');
                                                sort('ascending',table.headers[x]);
                                            }
                                            if (span.hasClass('sortable-desc')){
                                                sort('descending',table.headers[x]);
                                            }
                                        }

                                    }
                                });


                            },0);


                        },true);



                    });
                },0);



            }
        }
    }
]);

/**
 ---- css usado ----

 .footable > thead > tr > th {
  position: relative;
  font-size: 14px;

}

 .footable {
  border-spacing: 0;
  width: 100%;
  border: solid #ccc 1px;
  -moz-border-radius: 6px;
  -webkit-border-radius: 6px;
  border-radius: 6px;
  font-family: 'Open Sans', 'trebuchet MS' , 'Lucida sans' , Arial;
  font-size: 14px;
  color: #444;
}

 .footable tr.has-detail > td.expand {
    background: url('img/plus.png') no-repeat 5px center;
    padding-left: 40px;
}

 .footable > tbody >  tr.footable-detail-show.has-detail > td.expand {
    background: url('img/minus.png') no-repeat 5px center;
}


 .footable > tbody > tr.has-detail:hover:not(.footable-row-detail) {
    cursor: pointer;
}

 .footable > tbody > tr.footable-row-detail {
  background: #eee;
}

 .footable > tbody > tr:hover:not(.footable-row-detail) {
  background: #f4f1e2;
}


 // .footable > tbody > tr:hover{
//    background: #fbf8e9;
//}


 .footable > tbody > tr > td, .footable > thead > tr > th {
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}


 .footable > thead > tr > th {
    background-color: #dce9f9;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf3fc), to(#dce9f9));
    background-image: -webkit-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: -moz-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: -ms-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: -o-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: linear-gradient(to bottom, #ebf3fc, #dce9f9);
    -webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
    -moz-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
    box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
    border-top: none;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
}

 .footable > thead > tr > th:first-child {
    -moz-border-radius: 6px 0 0 0;
    -webkit-border-radius: 6px 0 0 0;
    border-radius: 6px 0 0 0;
}

 .footable > thead > tr > th:last-child {
    -moz-border-radius: 0 6px 0 0;
    -webkit-border-radius: 0 6px 0 0;
    border-radius: 0 6px 0 0;
}

 .footable > thead > tr > th:only-child {
    -moz-border-radius: 6px 6px 0 0;
    -webkit-border-radius: 6px 6px 0 0;
    border-radius: 6px 6px 0 0;
}


 .footable > tbody > tr:last-child > td:first-child {
    -moz-border-radius: 0 0 0 6px;
    -webkit-border-radius: 0 0 0 6px;
    border-radius: 0 0 0 6px;
}

 .footable > tbody > tr:last-child > td:last-child {
    -moz-border-radius: 0 0 6px 0;
    -webkit-border-radius: 0 0 6px 0;
    border-radius: 0 0 6px 0;
}

 .footable > tbody img {
    vertical-align:middle;
}



 //footable Sortable bits



 .footable > thead > tr > th > span.footable-sort-indicator {
    width: 16px;
    height: 16px;
    display: block;
    float:right;
    background: url('img/sorting_sprite.png') no-repeat top left;
}

 .footable > thead > tr > th.footable-sortable:hover {
    cursor:pointer;
}

 .footable > thead > tr > th.footable-sortable > span {

}

 .footable > thead > tr > th.footable-sorted > span.footable-sort-indicator {
    background-position: 0 -16px;
}

 .footable > thead > tr > th.footable-sorted-desc > span.footable-sort-indicator {
    background-position: 0 -32px;
}



 table tbody tr:nth-child(4n - 1) { background: #f9f9f9; }
 //table tbody tr:nth-child(2n + 1):not(.footable-row-detail) { background: #f9f9f9; }


 .sortable  {
    width: 16px;
    height: 16px;
    display: block;
    float:right;
    background: url('img/sorting_sprite.png') no-repeat top left;
}
 .sortable-asc {
    background-position: 0 -16px;
}
 .sortable-desc {
    background-position: 0 -32px;
}

 .footable > tbody > tr > td{
    vertical-align: middle;
}

 .footable > thead > tr > th[sort]:hover {
    cursor:pointer;
}

 */
