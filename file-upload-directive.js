/* globals $ */
(function() {
    'use strict';

    angular
        .module('aiyun.file.upload',['angularFileUpload'])
        .directive('fileUpload', fileUpload)
        .controller('fileUploadController',fileUploadController );

    fileUpload.$inject = ['FileUploader'];
    fileUploadController.$inject = ['$scope','FileUploader'];

    function fileUpload (FileUploader) {
        var directive = {
            replace: true,
            restrict: 'EA',
            templateUrl:'template/file-upload.html',
            scope: {
                uploadUrl: '@',  //图片上传的地址
                isSingle : '@',
                ngModel : "=",
                callBack : "&"
            },
            require: 'ngModel',
            controller: 'fileUploadController',
            link : function (scope,iElem,iAttr,ngmodel) {

            }
        };
        return directive;
    }

    function fileUploadController($scope,FileUploader){
        var uploadUrl = $scope.uploadUrl;
        $scope.imgCount = 100;
        if($scope.isSingle === "true"){
            $scope.imgCount = 1;
        }

        $scope.uploadUrl = uploadUrl;
        var uploader = $scope.uploader = new FileUploader({
            url: uploadUrl
        });


        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < $scope.imgCount;
            }
        });

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if(status == 200){  //上传成功
                fileItem.desc = response;
                $scope.showAll();
            }
        };

        $scope.callBackFunc = function () {
            $scope.callBack();
        };

        $scope.showAll = function () {
            var queues = $scope.uploader.queue;
            var fileList = [];
            queues.forEach(function (val) {
                if(val.desc){
                    fileList.push(val.desc);
                }
            });
            if($scope.isSingle === "true"){  //单文件
                $scope.ngModel = fileList.length > 0 ? fileList[0] : "";
            }else{
                $scope.ngModel = fileList;
            }
        }
    }
})();
