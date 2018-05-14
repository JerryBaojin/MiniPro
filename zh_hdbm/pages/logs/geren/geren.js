// zh_hdbm/pages/logs/geren/geren.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    in1: false,
    in2: false,
    logg: false,
    log: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    console.log(uniacid)
    var user_id = wx.getStorageSync('uid');
    that.setData({
      user_id: user_id,
      type: options.type
    })
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var url = res.data
        that.setData({
          url: url
        })
      },
    })
  },
  identity: function (e) {
    wx: wx.navigateTo({
      url: '../../activity/Agreement?type=' + 2,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 点击选择图片
  choose: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    console.log(uniacid)
    var url = that.data.url
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_hdbm',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              img1: res.data
            })
          },
          fail: function (res) {
            // console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths,
          log: true
        })
      }
    })
  },
  choose1: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    // console.log(uniacid)
    var url = that.data.url
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_hdbm',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              img2: res.data
            })
          },
          fail: function (res) {
            // console.log(res)
          },
        })
        that.setData({
          logos: tempFilePaths,
          logg: true
        })
      }
    })
  },
  inpunt1: function (e) {
    console.log(e)
    var that = this
    var name = e.detail.value
    if (name == '') {
      wx: wx.showToast({
        title: '内容不能为空',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      that.setData({
        name: name,
        in1: true
      })
    }
  },
  inpunt2: function (e) {
    console.log(e)
    var that = this
    var card_id = e.detail.value
    if (card_id == '') {
      wx: wx.showToast({
        title: '内容不能为空',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      that.setData({
        card_id: card_id,
        in2: true
      })
    }

  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var form_id = e.detail.formId
    var openid = wx.getStorageSync('openid')//用户opinid
    console.log(openid)
    var type = that.data.type
    var user_id = that.data.user_id
    var name = that.data.name
    var card_id = that.data.card_id
    var img1 = that.data.img1
    var img2 = that.data.img2
    var img3 = ''
    var frxm = ''
    console.log(that.data)
    app.util.request({
      'url': 'entry/wxapp/saveauth',
      'cachetime': '0',
      data: {
        user_id: user_id,
        name: name,
        card_id: card_id,
        img1: img1,
        img2: img2,
        img3: img3,
        frxm: frxm,
        type: type,
      },
      success: function (res) {
        console.log('这是返回来的id')
        console.log(res)
        var bm_id = res.data
        console.log('这是id'+bm_id)
        console.log('这是form_id'+form_id)
        console.log('这是openid'+openid)
        app.util.request({
          'url': 'entry/wxapp/message3',
          'cachetime': '0',
          data: { openid: openid, rz_id: bm_id, form_id: form_id },
          success: function (res) {
            console.log('这是请求模板消息的接口返回值')
            console.log(res)
            wx: wx.showToast({
              title: '提交成功',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            setTimeout(function () {
              wx: wx.reLaunch({
                url: '../../index/index',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }, 2000)
          },
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})