// zh_hdbm/pages/activity/introduce.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var http = res.data.slice(0, 5)
        console.log(http)
        if (http != 'https') {
          wx: wx.showModal({
            title: '提示',
            content: '您的网址不是https，请检查后台配置是否正确',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        that.setData({
          url: res.data
        })
      }
    })
    if (text == null) {
      var text = '请输入活动介绍'
    } else {
      var text = options.text
    }
    that.setData({
      text: text
    })
  },
  // 点击选择图片
  choose: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    console.log(uniacid)
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        var img = res.tempFilePaths
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = new Array(img.length)
        // var tempFilePaths = []
        console.log(tempFilePaths)
        for (let i = 0; i < tempFilePaths.length;i++){
          wx.uploadFile({
            url: that.data.url+'app/index.php?i='+uniacid+'&c=entry&a=wxapp&do=upload&m=zh_hdbm',
            filePath: img[i],
            name: 'upfile',
            formData: {},
            success: function (res) {
              console.log(res)
              tempFilePaths[i] = res.data
              var list = []
              tempFilePaths.map(function (item) {
                var obj = {};
                obj = item;
                list.push(obj);
              })
              console.log(list)
              that.setData({
                tempFilePaths: tempFilePaths
              })
            },
            fail: function (res) {
              // console.log(res)
            },
          })
        }
        that.setData({
          logo: res.tempFilePaths
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log(this.data)
    if (this.data.tempFilePaths==null){
      var value = e.detail.value.text
      console.log('输入的是' + e.detail.value.text)
      //  te = e.detail.value.text
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        text: e.detail.value.text
      })
      wx: wx.navigateBack({
        url: 'activity',
      })
    }else{
      var img = this.data.tempFilePaths
      var logo = this.data.logo
      var list = []
      img.map(function (item) {
        var obj = {};
        obj = item;
        list.push(obj);
      })
      console.log(list)
      if (list.length != logo.length) {
            wx:wx.showToast({
              title: '正在上传图片',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
      } else {
        var value = e.detail.value.text
        console.log('输入的是' + e.detail.value.text)
        //  te = e.detail.value.text
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          text: e.detail.value.text,
          list: list
        })
        wx: wx.navigateBack({
          url: 'activity',
        })
      }
    }
   
    
    
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