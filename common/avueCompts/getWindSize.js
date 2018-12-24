let getWindSize = () => {
  return {
    width: false,
    height: false
  }
}
if (window.innerWidth) {
  getWindSize = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
} else if (document.body) {
  getWindSize = () => {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  }
} else if (document.documentElement) {
  getWindSize = () => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }
}

export default getWindSize
