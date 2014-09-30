
function MainCtrl ($scope){
    $scope.usuario  = {
        "nome": "Guilherme Gonçalves Guerchmann",
        "role": [
            "vendedor"
        ]
    };

    setTimeout(function(){
       $scope.$apply(function(){
           $scope.usuario.role.push('admin');

       });
    },2000);
}