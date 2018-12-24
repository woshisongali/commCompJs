/* global plupload  */
import Vue from 'vue'

function emptyObj (obj) {
  return JSON.stringify(obj) === '{}'
}
class myPlup {
  constructor (opt, ctxt) {
    // 用于记录当前上传的文件 原因当处理异常数据时，此后的文件不能在方法中被找到
    this.stepFiles = []
    return this.createPlup(opt, ctxt)
  }

  addmyFile (ctxt, files) {
    let newfiles = files.map((file, index) => {
      let curele = {}
      curele.id = file.id
      curele.name = file.name
      curele.size = file.size
      return curele
    })
    let startNum = ctxt.curBtnsNum || 'last'
    let prefiles = ctxt.files
    if (startNum === 'last') {
      prefiles = prefiles.concat(newfiles)
    } else {
      prefiles.splice(startNum, newfiles.length, ...newfiles)
    }
    ctxt.curBtnsNum = 'last'
    ctxt.files = prefiles
  }

  getFile (files, id) {
    for (let i = 0, len = files.length; i < len; i++) {
      if (files[i].id === id) {
        return files[i]
      }
    }
    return false
  }

  setmyFile (ctxt, id, data) {
    let file = this.getFile(ctxt.files, id)
    // file.src = data.imgUrl
    // let img = new Image()
    // img.onload = function () {
    //   let longShape = img.width > img.height
    //   vue.set(file, 'src', data.imgUrl)
    //   vue.set(file, 'longShape', longShape)
    // }
    // img.src = data.imgUrl
    let transkey = ctxt.transKey
    if (!emptyObj(transkey)) {
      Object.entries(transkey)
      .map(([key, val]) => {
        if (val === 'tosave') {
          Vue.set(file, key, data[key])
        } else {
          Vue.set(file, val, data[key])
        }
      })
    } else {
      Vue.set(file, 'lazySrc', data.imgUrl)
    }
    Vue.set(file, 'src', '')
  }

  operaErrFile (ctxt, id) {
    let newbtns = []
    newbtns.push(ctxt.initID)
    ctxt.files.forEach(file => {
      if (file.extraBtnUp) {
        newbtns.push(file.extraBtnUp)
      }
    })
    let myfile = this.getFile(ctxt.files, id)
    let idName = myPlup.setId()
    newbtns.push(idName)
    // let self = this
    Vue.set(myfile, 'extraBtnUp', idName)
    Vue.set(myfile, 'loadErr', true)
    // ctxt.btnEles.push(idName)
    ctxt.btnEles = newbtns
    // up.setOption('browse_button', ctxt.btnEles)
    // up.setOption('browse_button', 'plupBtnsEle1', 'plupBtnsEle2')
  }

  createPlup (opt, ctxt) {
    let self = this
    let params = ctxt.params || {}
    if (ctxt.fileCategory) {
      params.fileCategory = ctxt.fileCategory
    }
    let uploader = new plupload.Uploader({
      browse_button: opt.btnid,
      // url: '//static.testUrl.com:3000/up/v2',
      url: ctxt.postUrl,
      filters: {
        max_file_size: ctxt.max_file_size,
        // max_file_size: '40kb',
  // Specify what files to browse for
        mime_types: [
          {
            title: 'Image files',
            extensions: ctxt.subConfig.extensions || 'jpg,gif,png'
          }
        ]
      },
      multipart_params: params,
      headers: {
        'x-csrf-token': ctxt.params._csrf || null
      },
      runtimes: 'html5,flash,silverlight,html4',
      flash_swf_url: ctxt.subConfig.silverlight_xap_url || '../plupload_2.3/Moxie.swf',
      silverlight_xap_url: ctxt.subConfig.silverlight_xap_url || '../plupload_2.3/Moxie.xap',
      init: {
        FilesAdded (up, files) {
          // console.log('to up the files')
          let maxlen = ctxt.max_file_len || false
          if (maxlen) {
            if ((ctxt.files.length + files.length) > parseInt(maxlen)) {
              ctxt.$emit('cbErr', 'filesmore', ctxt.max_file_len)
              files.forEach(ele => {
                up.removeFile(ele)
              })
              return
            }
          }
          self.addmyFile(ctxt, files)
          up.start()
          self.stepFiles = files
        },
        FileUploaded (up, file, resp) {
          let data = JSON.parse(resp.response)
          self.setmyFile(ctxt, file.id, data.data)
        },
        StateChanged (up) {
        },
        UploadComplete (up, files) {
          // console.log('has complete')
          // uploader.setOption('browse_button', ctxt.btnEles)
        },
        // failed to upload
        Error (up, args) {
          // console.log('failed to upload')
          let errfile = args.file
          let code = args.code
          if (code === -600) {
            ctxt.$emit('cbErr', 'imgbig', ctxt.max_file_len)
            self.stepFiles = []
            up.removeFile(errfile)
            return
          }
          if (code === -601) {
            ctxt.$emit('cbErr', 'imgtype', ctxt.max_file_len)
            self.stepFiles = []
            up.removeFile(errfile)
            return
          }
          self.operaErrFile(ctxt, errfile.id)
          self.stepFiles.forEach((file) => {
            /* eslint-disable eqeqeq */
            if (file.status != plupload.DONE) {
              self.operaErrFile(ctxt, file.id)
            }
          })
          self.stepFiles = []
        }
      }
    })
    return uploader
  }
}
myPlup.uuid = 1
myPlup.getUUId = () => {
  return myPlup.uuid++
}
myPlup.setId = () => {
  return 'plupBtnsEle' + myPlup.getUUId()
}

export default myPlup
