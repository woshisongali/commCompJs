if (!Object.entries) {
  Object.entries = function (obj) {
    let ownProps = Object.keys(obj)
    let i = ownProps.length
    // preallocate the Array
    let resArray = new Array(i)
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]]
    }
    return resArray
  }
}
