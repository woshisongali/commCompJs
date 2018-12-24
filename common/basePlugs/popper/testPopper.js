import Popper from './popper.js'
import '../assets/popper.css'

// compareDocumentPosition()  node.compareDocumentPosition( otherNode )  方法按照文档顺序，比较当前节点与指定节点的文档位置。
// 例如，返回 20 意味着在 p2 在 p1 内部
// contains document.documentElement.contains(document.body); 
//true compareDocumentPosition
function isContains (p1, p2) {
  if (p1.compareDocumentPosition) {
    return p1 === p2 || p1.compareDocumentPosition(p2) === 20
  }
  if (p1.contains) {
    return p1.contains(p2)
  }
}
function camelize(attr) {
  return attr.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
let getStyle
if (window.getComputedStyle) {
  getStyle = function (ele, name) {
    return window.getComputedStyle(ele, null).getPropertyValue(name)
  }
} else {
  getStyle = function (ele, name) {
    return ele.currentStyle.getAttribute(camelize(name))
  }
}

function show (popperEle, popper) {
  popperEle.style.display = 'block'
  popper.update()
}
function hide (popperEle) {
  popperEle.style.display = 'none'
}
function addEvent (referenceElement, popperEle, popper) {
  function handle (e) {
    let target = e.target || e.srcElement
    let parent = referenceElement.parentNode
    if (isContains(parent, target) && !isContains(popperEle, target)) {
      let display = getStyle(popperEle, 'display')
      display === 'none' ? show(popperEle, popper) : hide(popperEle)
    } else if (!isContains(parent, target)) {
      hide(popperEle)
    }
  }
  document.addEventListener('click', handle)
  document.getElementById('clearEvent').onclick = function () {
    document.removeEventListener('click', handle)
  }
}
function hoverEvent (referenceElement, popperEle, popper) {
  // let target = e.target || e.srcElement
  let parent = referenceElement.parentNode
  parent.onmouseover = function (e) {
    show(popperEle, popper)
  }
  parent.onmouseout = function () {
    hide(popperEle)
  }
}
function initStart () {
  let referenceElement = document.getElementById('example10reference1')
  let onPopper = document.getElementById('example10popper1')
  onPopper.defDisplay = getStyle(onPopper, 'display')
  onPopper.style.display = 'none'
  var popper = new Popper(referenceElement, onPopper, {
    placement: 'bottom'
  });
  // let parent = referenceElement.parentNode
  // parent.onclick = function () {
  //   onPopper.style.display = onPopper.defDisplay
  //   popper.update()
  // }
  // addEvent(referenceElement, onPopper, popper)
  hoverEvent(referenceElement, onPopper, popper)
}
initStart()
// console.log('gggss')