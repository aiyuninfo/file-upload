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
            // templateUrl:'template/file-upload.html',
            template : '<div><div class="row"><div class="col-xs-12"><table class="table table-condensed table-hover table-responsive table-striped"><tr><th>文件名</th><th>路径</th><th>操作</th></tr><tr ng-repeat="file in formImages"><td class="col-xs-3">{{file.fileName}}</td><td class="col-xs-5">{{file.url}}</td><td class="text-center col-xs-4"><div class="btn-group-xs"><button class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span><span>移除</span></button><button class="btn btn-info"><span class="glyphicon glyphicon-search"></span><span>查看</span></button></div></td></tr><tr ng-repeat="file in queues"><td class="col-xs-3">{{file.fileName}}</td><td class="col-xs-5">{{file.url}}</td><td class="text-center col-xs-4"><div class="btn-group-xs"><button class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span><span>移除</span></button><button class="btn btn-info"><span class="glyphicon glyphicon-search"></span><span>查看</span></button></div></td></tr></table></div></div><div class="row"><div class="col-lg-3"><h3>选择文件</h3><div ng-show="uploader.isHTML5"><div nv-file-drop="" uploader="uploader" options="uploader" ng-disabled="uploader.queue.length >= imgCount"><div nv-file-over="" uploader="uploader" over-class="another-file-over-class" class="well my-drop-zone">                        拖拽文件至此处可快速上传</div></div></div><br/><input type="file" nv-file-select="" uploader="uploader" ng-disabled="uploader.queue.length >= imgCount" style="width: 72px;"/></div><div class="col-lg-9"><h3>文件数量</h3><p>共: {{ uploader.queue.length }}个文件</p><table class="table"><thead><tr><th>名称</th><th ng-show="uploader.isHTML5" class="hidden-sm hidden-xs">大小</th><th class="hidden-sm hidden-xs">状态</th><th>操作</th></tr></thead><tbody><tr ng-repeat="item in uploader.queue"><td><strong>{{ item.file.name }}</strong></td><td ng-show="uploader.isHTML5" nowrap class="hidden-sm hidden-xs">{{ item.file.size/1024/1024|number:2 }} MB</td><td class="text-center" class="hidden-sm  hidden-xs"><span ng-show="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span><span ng-show="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span><span ng-show="item.isError"><i class="glyphicon glyphicon-remove"></i></span></td><td nowrap><div class="btn-group"><button type="button" class="btn btn-success btn-xs" ng-click="item.upload()"                                    ng-disabled="item.isReady || item.isUploading || item.isSuccess"><span class="glyphicon glyphicon-upload"></span><span class="hidden-sm  hidden-xs">上传</span></button><button type="button" class="btn btn-warning btn-xs" ng-click="item.cancel()"                                    ng-disabled="!item.isUploading"><span class="glyphicon glyphicon-ban-circle"></span><span class="hidden-sm  hidden-xs">取消</span></button><button type="button" class="btn btn-danger btn-xs" ng-click="item.remove();getSuccessFiles();"><span class="glyphicon glyphicon-trash"></span><span class="hidden-sm  hidden-xs">移除</span></button></div></td></tr></tbody></table><div><div>                    上传进度:<div class="progress" style=""><div class="progress-bar" role="progressbar" style="width:{{uploader.progress}}% "></div></div></div><div class="btn-group"><button type="button" class="btn btn-success btn-s" ng-click="uploader.uploadAll()"                            ng-disabled="!uploader.getNotUploadedItems().length"><span class="glyphicon glyphicon-upload"></span> 上传全部</button><button type="button" class="btn btn-warning btn-s" ng-click="uploader.cancelAll()"                            ng-disabled="!uploader.isUploading"><span class="glyphicon glyphicon-ban-circle"></span> 取消全部</button><button type="button" class="btn btn-danger btn-s" ng-click="uploader.clearQueue()"                            ng-disabled="!uploader.queue.length"><span class="glyphicon glyphicon-trash"></span> 移除全部</button><button class="btn btn-primary" ng-click="callBackFunc()"><span class="glyphicon glyphicon-ok-circle"></span>                        确 &nbsp;&nbsp;定</button></div></div></div></div></div>',
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
        $scope.formImages = [];  //已经存在的文件列表
        $scope.queues = [];  //本次上传的文件列表
        if($scope.ngModel){
            if($scope.ngModel instanceof Array){
                $scope.formImages = $scope.ngModel;
            }else if($scope.ngModel instanceof Object){
                $scope.formImages.push($scope.ngModel);
            }else if(typeof $scope.ngModel == "string"){
                var file = {
                    fileName : $scope.ngModel.substring($scope.ngModel.lastIndexOf("/") + 1,$scope.ngModel.lastIndexOf(".")),
                    url : $scope.ngModel
                };
                $scope.formImages.push(file);
            }
        }
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
                if(response instanceof Array){
                    fileItem.desc = response.length > 0 ? response[0] : {};
                }else{
                    fileItem.desc = response;
                }
                $scope.getSuccessFiles();
            }
        };

        $scope.callBackFunc = function () {
            $scope.callBack();
        };

        $scope.getSuccessFiles = function () {
            var queues = $scope.uploader.queue;
            $scope.queues = [];
            queues.forEach(function (val) {
                if(val.desc){
                    $scope.queues.push(val.desc);
                }
            });
        }
    }
})();
