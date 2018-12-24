export const seeSize = (ele, param) => {
  if (window.getComputedStyle) {
    return window.getComputedStyle(ele, null)[param]
  }
  if (ele.currentStyle) {
    return ele.currentStyle[param]
  }
  return false
}

export const strEllipsis = (str, n) => {
  if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
    return str
  } else {
    let len = 0
    let tmpStr = ''
    for (let i = 0, sublen = str.length; i < sublen; i++) {
      if (/[\u4e00-\u9fa5]/.test(str[i])) {
        len += 2
      } else {
        len += 1
      }
      if (len > n) {
        break
      } else {
        tmpStr += str[i]
      }
    }
    return tmpStr + '...'
  }
}
export const subStrRight = (str, n) => {
  let len = 0
  let tmpStr = []
  for (let i = str.length - 1; i > 0; i--) {
    if (/[\u4e00-\u9fa5]/.test(str[i])) {
      len += 2
    } else {
      len += 1
    }
    if (len > n) {
      break
    } else {
      tmpStr = str[i] + tmpStr
    }
  }
  return tmpStr
}
/** 数字金额大写转换(可以处理整数,小数,负数) */    
export const smalltoBIG = (n) =>   
{    
    var fraction = ['角', '分']
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']   
    var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ]  
    var head = n < 0? '欠': ''  
    n = Math.abs(n)  
    var s = ''  
    for (var i = 0; i < fraction.length; i++)     
    {    
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')   
    }    
    s = s || '整'    
    n = Math.floor(n)
    for (var i = 0; n > 0; i++)     
    {    
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++)     
        {    
            p = digit[n % 10] + unit[1][j] + p 
            n = Math.floor(n / 10)   
        } 
        if (i >= unit[0].length) {
            i = 0
        }  
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s  
    }    
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')  
}

// 另一个金额大小写转换
export const sequeBIG = (n) => {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
        return '非法数据'
    }
    var unit = "千百拾亿千百拾万千百拾元角分", str = ""
    n += "00"
    var p = n.indexOf('.')
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p+1, 2)
        unit = unit.substr(unit.length - n.length)
    for (var i=0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整")
}