
// 数据请求
import cache from './cache.js'
import en from './encryption.js'

const API_URL = "https://api.752pay.com/";
const IMG_URL = 'http://qiniu.51hall.com/';
const key = '1afd506F2229A33a5979dc2e9e0e7R82';
const appId = 'wx54ffdbfe8b628b63';
const ver = '1.0.0';

// GET请求
function GET (url, params, message, config) {
  return request(url, params, message, config, 'GET')
}
// POST请求
function POST (url, params, message, config) {
  return request(url, params, message, config)
}
// 成功提示框
function success (message = '成功') {
  wx.showToast({
    title: message,
    icon: 'success',
    duration: 1500
  })
}
// 错误提示框
function prompt (message = '失败') {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 1500
  })
}
// 提示框
function showModal (obj) {
  wx.showModal({
    title: obj.title,
    content: obj.content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

function request (url, params = {}, config,message = '加载中...',  method = 'POST') {
    let token = cache.get('token');
    token = token ? token : "";
    let sign = en.encryption(params, key);
    console.log(url,params)
    let time = setTimeout(() => { // 请求时常大于 0.5 秒显示 loading 提示框
      if (message) {
        wx.showLoading({
          title: message
        })
      }
    }, 500)
    return new Promise((resolve, reject) => {
      let header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'API-GCHAT-APPID':appId,
        'API-GCHAT-VER':ver,
        'API-GCHAT-TOKEN':token,
        'API-GCHAT-SIGN':sign
      }
      wx.request(Object.assign(config || {}, {
        url: API_URL + url,
        data: params,
        header: header,
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
            resolve(res.data)
        },
        fail: function (...args) {
          Reflect.apply(reject, reject, args)
        },
        complete: function () {
          // 接口调用完成后
          clearTimeout(time)
          if (message) {
            wx.hideLoading()
          }
        }
      }))
    })
  }
  
  var network = {
    get: GET,
    post: POST,
    success: success,
    prompt: prompt,
    showModal: showModal,
    img_url:IMG_URL
  }
  export default network