入口引入方式
```
    <zoom-img ref="photoAlbum" ismask="yes"></zoom-img>
```
调用方式
```
    this.$refs.photoAlbum.handleZoom(files, index)
```
通过filse[index].src获取大图的url
