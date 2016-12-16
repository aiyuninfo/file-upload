# file-upload
angular js 多文件上传组件<br>
#bower
```
bower install aiyun-file-upload --save
```
```HTML
<div class="container">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-primary">
            <div class="panel-heading">
                文件上传
            </div>

            <div class="panel-body">
                <file-upload upload-url="{{vm.url}}" call-back="vm.getAllFiles()" ng-model="vm.files" is-single="{{vm.isSingle}}"></file-upload>
            </div>

        </div>
    </div>
</div>
```
