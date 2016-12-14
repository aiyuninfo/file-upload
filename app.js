/**
 * Created by zhaoy on 2016/12/13.
 */


(function () {
    'use strict';

    angular.module("app",['aiyun.file.upload'])
        .run(run);

    run.$inject = [];

    function run() {

    }

    angular.module("app").controller("appController",AppController);
    AppController.$inject = ["$scope"];
    function AppController($scope) {
        var vm = this;
        vm.isSingle = false;
        vm.url = 'http://localhost:8080/web/fileUpload';
        vm.files = [{
            fileName : '1',
            path : 'web/a.jpg'
        },{
            fileName : '2',
            path : 'web/b.jpg'
        },{
            fileName : '3',
            path : 'web/c.jpg'
        }];
        vm.getAllFiles = function (fileList) {
            alert("call back")
        }
    }
})();