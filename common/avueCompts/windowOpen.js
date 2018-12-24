// 窗口拦截方案
// 请求的时间过长的话，则会弹出窗口拦截， 而且不同浏览器可能表现不同， 不稳定性不可取
/* eslint-disable no-unused-vars */
function formOpen () {
  var form = document.createElement('form')
  form.action = 'www.baidu.com?id=1'
  form.target = '_blank'
  form.method = 'POST'
  document.body.appendChild(form)
  form.submit()
}

function testAlink (ele) {
  let testp = new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(false)
    }, 30)
  })
  testp.then(function (data) {
    formOpen()
  })
}