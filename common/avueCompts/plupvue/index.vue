<template>
  <div class="mod-plupvue-contianer" @click="operateFuc($event)">
    <!-- <span :id="initID" indexkey="last"> to upload</span> -->
    <!--
    <ul class="clearfix">
      <li class="item-file">
        <p class="wrapper-img">
          <img class="middle" src="//img.testUrl.com/public/154167784976758495420_1184_38.png">
          <span class="btm-opret">
            <em optstr="tosee">预览</em>
            <em optstr="todelet" indexkey="1">删除</em>
          </span>
        </p>
      </li>
    </ul>
    -->
    <ul class="clearfix">
      <li class="item-file" v-for="(file, index) in files" :key="file.id">
        
        <p class="wrapper-img">
          <template v-if="file.src">
             <img class="middle"
              :class="(file.longShape) ? 'height-main': 'width-main'" :src="file.src">
          </template>    
            <span class="btm-opret">
              <em v-if="file.extraBtnUp" :indexkey="index" :id="file.extraBtnUp" optstr="toups">上传</em>
              <em v-else optstr="tosee" :indexkey="index">预览</em>
              <em optstr="todelet" :indexkey="index">删除</em>
            </span>
          <template v-if="!file.src && !file.loadErr && !file.extraBtnUp">
            {{file.loadErr}}
            <loading-ele></loading-ele>
          </template>
          <span v-if="file.loadErr" class="err-span">
            <img src="//img.testUrl.com/public/154217337458560380570_40_40.png" alt="" >
            <br>
            <em v-if="file.extraBtnUp">上传失败</em>
            <em v-else>图片异常</em>
          </span>
        </p>
        <span class=ellipsis>{{file.name | subEllipsis}}</span>
      </li>
      <li class="item-file hover-ele" indexkey="last">
        <p class="wrapper-img up-wrapper" :id="initID">
          <!-- <span>to upload</span> -->
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
import myPlup from './myPlup.js'
import Vue from 'vue'
import loadingEle from '../loading.vue'
import {strEllipsis, subStrRight} from '../base.js'
function emptyObj (obj) {
  return JSON.stringify(obj) === '{}'
}

// 对于文件结构做映射
function transFile (files, keys) {
  let myfiles = []
  for (let i = 0, len = files.length; i < len; i++) {
    if (!emptyObj(keys)) {
      let file = {}
      Object.entries(keys)
      .map(([key, val]) => {
        if (val === 'tosave') {
          file[key] = files[i][key]
        } else {
          file[val] = files[i][key]
        }
        file.id = `file${i}`
        file.src = false
        file.isOrigin = true
      })
      myfiles.push(file)
    }
  }
  return myfiles
}

export default {
  props: {
    postUrl: {
      type: String,
      default: '//yug.testUrl.com/up/'
    },
    params: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fileCategory: {
      type: String,
      default: null
    },
    transKey: {
      type: Object,
      default: function () {
        return {}
      }
    },
    srcFiles: {
      type: Array,
      default: function () {
        return []
      }
    },
    max_file_size: {
      type: String,
      default: '4mb'
    },
    max_file_len: {
      type: String
    },
    subConfig: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      msg: 'plup',
      initID: myPlup.setId(),
      files: [],
      fileConstruct: null,
      btnEles: [],
      proBtns: [],
      testid: 'plupBtnsEle2',
      delets: []
      // params: {
      //   test: 'hhhs'
      // }
      // curBtnsNum: 0
    }
  },

  computed: {
  },

  filters: {
    subEllipsis (val) {
      if (!val) { return '' }
      if (val.replace(/[\u4e00-\u9fa5]/g, '**').length <= 16) {
        return val
      }
      let last = subStrRight(val, 5)
      return strEllipsis(val, 10) + last
    }
  },

  components: {
    'loading-ele': loadingEle
  },

  mounted () {
    // alert('sff')
    this.files = transFile(this.srcFiles, this.transKey)
    this.btnEles.push(this.initID)
    this.proBtns.push(this.initID)
    /* eslint-disable new-cap */
    let firstPlup = new myPlup({btnid: this.initID}, this)
    this.myfileConstruct = firstPlup
    firstPlup.init()
    // console.log(firstPlup)
  },

  methods: {
    operateFuc (e) {
      let target = e.target || e.srcElement
      let optstr = target.getAttribute('optstr')
      let self = this
      if (!optstr) {
        return
      }
      let index = target.getAttribute('indexkey')
      switch (optstr) {
        case 'tosee':
          // test the btn
          // this.addBtn()
          this.$emit('seeImgs', this.files, index)
          break
        case 'todelet':
          let file = this.files[index]
          if (file.isOrigin) {
            this.delets.push(file)
          }
          this.files.splice(index, 1)
          this.$nextTick(function () {
            self.myfileConstruct.setOption('browse_button', self.btnEles)
          })
          break
        case 'toups':
          // 记录当前上传文件位置，用于插入
          this.curBtnsNum = target.getAttribute('indexkey') || 'last'
          // console.log('to see the num ' + this.curBtnsNum)
          break
        default:
      }
    },

    addBtn () {
      this.myfileConstruct.setOption('browse_button', ['plupBtnsEle1', 'plupBtnsEle2'])
    },

    changeOptBtns () {
      this.myfileConstruct.setOption('browse_button', this.btnEles)
      // myfileConstruct.setOption('browse_button', ['plupBtnsEle1', 'plupBtnsEle2'])
    },
    getResult () {
      return {
        delets: this.delets || [],
        files: this.files
      }
    }
  },
  updated () {
    // let self = this
    // if (this.proBtns === this.btnEles) {
    //   return
    // }
    // this.changeOptBtns()
    // let newBtns = []
    // this.btnEles.forEach(btn => {
    //   newBtns.push(btn)
    // })
    // this.proBtns = newBtns
  },
  watch: {
    srcFiles (val, oldVal) {
      this.files = transFile(val, this.transKey)
      // console.log(files)
    },

    files (val, oldVal) {
      // to recordthe btns
      val.forEach(element => {
        // lazy imgs
        if (element.lazySrc) {
          let img = new Image()
          let imgsrc = element.lazySrc
          img.onload = () => {
            let longShape = img.width > img.height
            Vue.set(element, 'longShape', longShape)
            element.lazySrc = false
            element.src = imgsrc
          }
          img.onerror = () => {
            // Vue.set(element, 'loadErr', true)
            element.lazySrc = false
            element.src = imgsrc
          }
          img.src = imgsrc
        }
      })
    },

    btnEles (val, oldVal) {
      // myfileConstruct.setOption('browse_button', val)
      /* eslint-disable no-useless-call */
      // myfileConstruct.refresh()
      let self = this
      this.$nextTick(function () {
        self.myfileConstruct.setOption('browse_button', val)
      })
    }
  }
}
</script>
<style lang="stylus">
  .mod-plupvue-contianer {
    // 清除浮动
    .clearfix:after{
      content: ""; 
      display: block; 
      height: 0; 
      clear: both; 
      visibility: hidden;  
      }

    .clearfix {
      /* 触发 hasLayout */ 
      zoom: 1; 
    }
    .hover-ele{
      cursor pointer
    }
    .item-file{
      position relative
      width 100px 
      float left
      margin-right 24px
      margin-bottom 2px
      .ellipsis{
        position relative
        left -10px
        text-align center
        word-break keep-all
        display inline-block
        width 120px
      }
    }
    .wrapper-img{
      position relative
      width 100px
      height 100px
      border 1px  dashed #c5c5c5
      overflow hidden
      &.up-wrapper{
        background url('//img.testUrl.com/public/154217337030203307472_48_48.png') no-repeat
        background-size 24px
        background-position center center
      }
      &:hover .btm-opret{
        display block
      }
      .err-span{
        position absolute
        display block
        width 100%
        height 100%
        top 0px
        left 0px
        color #ff7300
        background #fbeaea
        text-align center
        img {
          margin-top 34px
          width 20px
        }
      }
    }
    .height-main{
      height 100%
      width auto
    }
    .width-main{
      width 100%
      height auto
    }
    img.middle{
      position absolute
      margin auto
      left 50%
      top 50%
      transform translate(-50%,-50%)
      -ms-transform translate(-50%,-50%)
      -webkit-transform translate(-50%,-50%)
    }
    .btm-opret{
      display none
      position absolute
      width 100%
      height 24px
      line-height 24px
      bottom 0px
      left 0px
      background #353535
      opacity 0.7
      color #fff
      z-index 7
      em{
        cursor pointer
        width 50%
        display inline-block
        text-align center 
      }
    }
  }
</style>

