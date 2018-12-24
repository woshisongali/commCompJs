引入参考
```
<plup-ele :postUrl=postUrl :transKey="transKey" :srcFiles="applyContract"
      max_file_size="4mb" :subConfig="config1"
      max_file_len="3" @cbErr="cbErr" @seeImgs="seeImgs"
      ref="applyContract" :params=params fileCategory="applyContract"></plup-ele>
```
初始可传入文件组srcFiles
初始化时传入的文件结构需进行转换
```
export const TRANSKEY = {
  displayName: 'name',
  ossKey: 'tosave',
  picUrl: 'lazySrc',  // 此属性在反转的时候取到的是 src的属性
  uploadFileId: 'tosave',
  c: 'tosave',
  fileSize: 'tosave'
}
```
其中 lazySrc是必须传入的； name为文件名称； 文件属性键值对应为 tosave时保存其键值及属性

通过调用getResult获取上传后的文件数组
```
getResult () {
      return {
        delets: this.delets || [],
        files: this.files
      }
    }
```

plupload在重置btns时有报错，对源代码进行了修改
```
引入
plupload.fullModify.min.js
```

moxie中修改代码
```
destroy: function() {
  self = _filename = null;
  if (!this.getRuntime()) {
    return
  }
  this.getRuntime().getShim().removeInstance(this.uid);
}
```

问题
1. extensions: 'jpg,gif,png,jpeg,bmp' 在进行该项配置时逗号后面不能带有空格，否则plupload的正则校验会识别空格
