
//angular.module('gui.config', []).value('gui.config', {});
//angular.module('gui.filters', ['gui.config']);
//angular.module('gui.directives', ['gui.config']);
//angular.module('gui-ui', ['gui.filters', 'gui.directives', 'gui.config']);

//angular.module('gui.directives');
//angular.module('gui-ui', ['gui.directives']);

angular.module('gui.directives', []);
angular.module('gui.filters', []);
angular.module('utils', []);
angular.module('gui-ui', ['gui.directives','gui.filters','utils']);