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
        vm.files = [];
        vm.getAllFiles = function (fileList) {
            console.log(vm.files);
        }
    }
})();