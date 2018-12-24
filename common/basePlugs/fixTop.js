class FixTop {
  constructor (tTips, fix, mainBox) {
    this.tTips = document.getElementById(tTips)
    this.fix = document.getElementById(fix)
    this.mainBox = document.getElementById(mainBox)
    this.bindEvent()
  }
  bindEvent () {
    let self = this
    this.scrollFuc = (function FFIE(){
        return function () {
          self.scrollEvent()
        }
    })()
    document.addEventListener('scroll', this.scrollFuc)
  }
  scrollEvent () {
    let tipHgt = this.tTips.offsetHeight || 0
    let fixHgt = this.fix.offsetHeight || 0
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    if (scrollTop >= tipHgt) {
      this.fix.style.cssText += ';position: fixed; top: 0px;'
      this.mainBox.style.cssText += ';padding-top: ' + fixHgt + 'px;'
    } else {
      this.fix.style.cssText += ';position: relative; top: auto;'
      this.mainBox.style.cssText += ';padding-top: 0px'
    }
  }
  clear () {
    document.removeEventListener('scroll', this.scrollFuc)
  }
}
FixTop.uuid = 1
export default FixTop