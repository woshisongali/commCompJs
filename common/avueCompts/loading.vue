<template>
  <div class="loading-container">
    <span class="loading"></span>
  </div>
</template>
<style lang="stylus" scoped>
.loading-container{
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(53, 53, 53, 0.4);
  .loading{
    position: absolute;
    width: 16px;
    height: 16px;
    left: 50%;
    top: 50%;
    margin-left: -8px;
    margin-top: -8px;
    background: url('https://img.testUrl.com/public/150814564144232851380_32_32.png');
    background-size: 16px;
    animation:loading 0.6s linear infinite;
    -webkit-animation:loading 0.6s linear infinite; /* Safari 和 Chrome */       
  }         
}
@keyframes loading{
  0%{
    transform: rotate(0deg)
    -webkit-transform: rotate(0deg)
  }
  100%{
    transform: rotate(360deg)
    -webkit-transform: rotate(360deg)
  }
}
</style>
