<template>
  <transition name="ease">
  <div v-show="showZoom" :class="['s-zoom-container', (ismask) == 'yes' ? 'mask' :'']" ref="zoom">
      <div class="img-wraper subbox">
        <img :src="zoomSrc" alt="查看大图">
      </div>
    <!--用来引入type值-->
    <span style="display: none;"></span>
    <div class="zoom-btns" @click="operaFuc($event)">
      <span class="prev" v-if="curIndex > 0" optstr="prev"></span>
      <span class="next" v-if="groupImgs && curIndex < (groupImgs.length - 1)" optstr="next"></span>
    </div>
    <span class="close" @click="closeZoom"></span>
  </div>
  </transition>
</template>
<style lang="stylus">
  .ease-enter-active,
  .ease-leave-active{
    animation-duration .3s
  }
  .ease-enter-active .subbox{
    animation easeIn
    animation-duration .3s
    animation-fill-mode both
  }
  .ease-leave-active .subbox{
    animation easeOut
    animation-duration .3s
    animation-fill-mode both
  }
  @keyframes easeIn {
    0% {
      opacity 0
      transform scale(0.9)
    }
    100% {
      opacity 1
      transform scale(1)
    }
  }
  @keyframes easeOut {
    0% {
      opacity 1
      transform scale(1)
    }
    100% {
      opacity 0
      transform scale(0.9)
    }
  }
</style>
<script type="text/babel">
  import './zoomImg.styl'
  import getWindSize from '../getWindSize.js'
  import {seeSize} from '../base.js'
  
  export default{
    props: {
      imgSrc: {
        type: String,
        default: ''
      },
      ismask: {
        type: String,
        default: 'yes'
      }
    },
    data () {
      return {
        msg: 'hello vue',
        zoomSrc: '', // 当前图片
        groupImgs: [], // 图片列表
        showZoom: false,
        imgele: null, // 图片的父层包围元素
        imgtype: '', // 表示是长图还是宽图
        MAXWIDTH: 800,
        curIndex: 0
      }
    },
    components: {
    },
    mounted () {
      var _this = this
      window.addEventListener('resize', () => {
        _this.setAlign()
      })
      this.staticRatio = 'width'
    },
    updated () {
      // this.type()
    },
    computed: {
    },
    methods: {
      handleZoom (files, index) {
        if (!this.showZoom) {
          this.showZoom = true
        }
        this.groupImgs = files
        this.zoomSrc = files[index].src
        this.curIndex = index
//        this.sizeImg()
        // this.zoomSrc = this.imgSrc
//        this.showZoom = true
        this.getimgEle()
        this.setAlign()
      },
      operaFuc (e) {
        let target = e.target || e.srcElment
        let optstr = target.getAttribute('optstr')
        if (!optstr) {
          return
        }
        switch (optstr) {
          case 'prev':
            this.prev()
            break
          case 'next':
            this.next()
            break
          default:
        }
      },
      prev () {
        this.curIndex--
        let self = this
        this.$nextTick(function () {
          if (self.curIndex < 0) {
            self.curIndex = 0
          }
          self.zoomSrc = self.groupImgs[self.curIndex].src
        })
      },
      next () {
        this.curIndex++
        let self = this
        this.$nextTick(function () {
          if (self.curIndex > (self.groupImgs.length - 1)) {
            self.curIndex = self.groupImgs.length - 1
          }
          self.zoomSrc = self.groupImgs[self.curIndex].src
        })
      },
      getimgEle () {
        var zoom = this.$el
        if (!zoom) return
        var wraper = zoom.querySelector('.img-wraper')
        var img = wraper.querySelector('img')
        this.imgele = img
      },
      sizeImg () {
        var zoom = this.$el
        if (!zoom) return
        var wraper = zoom.querySelector('.img-wraper')
        var img = wraper.querySelector('img')
        let winsize = getWindSize()
        let curHgt = (winsize.height - 40)
        if (this.staticRatio === 'height') {
          let curWidth = this.imgRatio * curHgt
          if (curWidth > this.MAXWIDTH) {
            this.staticRatio = 'width'
          }
        }
        // console.log('get the img' + img)
        if (this.staticRatio === 'width') {
          wraper.style.width = '800px'
          wraper.style.height = 'auto'
          img.style.width = '100%'
          img.style.height = 'auto'
        } else {
          wraper.style.width = 'auto'
          wraper.style.height = curHgt + 'px'
          img.style.width = 'auto'
          img.style.height = '100%'
        }
        wraper.style.visibility = 'visible'
        let wraperHgt = seeSize(wraper, 'height')
        wraperHgt = parseInt(wraperHgt) || 0
        let wraperTop = (winsize.height - wraperHgt) / 2
        wraper.style.top = '0px'
        wraper.style.top = wraperTop + 'px'
      },
      closeZoom () {
        this.showZoom = false
        let self = this
        setTimeout(function () {
          self.zoomSrc = false
        }, 300)
      },
      show () {
        this.showZoom = true
      },
      setAlign () {
        if (this.showZoom) {
          let winsize = getWindSize()
          // 宽默认设为1800
          let clientRatio = this.MAXWIDTH / (winsize.height - 40)
          if (this.imgele) {
            let imgRatio = this.imgele.style.width / this.imgele.style.height
            // let strval = null
            if (imgRatio > clientRatio) {
              this.staticRatio = 'width'
            } else {
              this.staticRatio = 'height'
            }
            // this.imgele.style.maxHeight = (parseInt(height) - 110) + 'px'
            this.sizeImg()
          }
        }
      },
      getWindowHeight () {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        return h + 'px'
      }
    },
    watch: {
      zoomSrc (val, oldVal) {
        let img = new Image()
        // let strval = 'height'
        let self = this
        let winsize = getWindSize()
        // 宽默认设为1800
        let clientRatio = this.MAXWIDTH / (winsize.height - 40)
        img.onload = function () {
          let imgRatio = img.width / img.height
          if (imgRatio > clientRatio) {
            self.staticRatio = 'width'
          } else {
            self.staticRatio = 'height'
          }
          self.imgRatio = imgRatio
          self.sizeImg()
        }
        img.src = this.zoomSrc
        var wraper = this.$el.querySelector('.img-wraper')
        wraper.style.visibility = 'hidden'
      }
    }
  }
</script>
