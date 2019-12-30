import {
  apiUrl_wx
} from "../../config/config.js"

class HTTP {
  request({
    urlAbbr,
    url,
    data,
    method,
    contentType = 'application/json'
  }) {
    return new Promise((resolve, reject) => {
      this._request(urlAbbr, url, resolve, reject, data, method, contentType = 'application/json')
    })
  }

  _request(urlAbbr, url, resolve, reject, data, method, contentType = 'application/json') {
    // 通过urlAbbr获取url前缀
    let apiPrefix
    switch (urlAbbr) {
      case 'wx':
        apiPrefix = apiUrl_wx;
        break
    }
    let requestUrl = apiPrefix + url
    let requestData = data
    // 如果是获取图片这个url，走特殊的
    if (url === '/company/getCompanyImage') {
      wx.request({
        url: requestUrl,
        data: requestData,
        header: {
          'content-type': contentType,
        },
        method: method,
        responseType: 'arraybuffer', 
        success: (res) => {
          // 如果是获取图片这个url，走特殊的
          resolve(res)
        },
        fail: (err) => {
          //网络问题
          console.log(err)
          this._showError(1)
        }

      })
    } else {
      wx.request({
        url: requestUrl,
        data: requestData,
        header: {
          'content-type': contentType,
        },
        method: method,
        dataType: 'json',
        success: (res) => {
          // 如果是获取图片这个url，走特殊的
          if (url === '/company/getCompanyImage') {
            resolve(res)
          } else if (res.data.status == 200) {
            resolve(res.data.data)
          } else if (res.data.status == 403) {
            reject(res)
          } else {
            //this._showError(res.statusCode);
            //因为不知道错误码的所有编号，所以这里先从数据里获取
            console.log(res)
            wx.showToast({
              title: `${res.data.status}：${res.data.message}`,
              icon: 'none',
              duration: 5000
            })
            // reject(res.data.status);
          }
        },
        fail: (err) => {
          //网络问题
          console.log(requestUrl)
          console.log(err)
          this._showError(1)
        }

      })
    }
  }

  _showError(error_code) {
    if (!error_code) {
      error_code = 1
    }
    wx.showToast({
      title: '网络错误',
      icon: 'none',
      duration: 2000
    })
  }
}
export {
  HTTP
}