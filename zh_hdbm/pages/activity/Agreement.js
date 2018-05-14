// zh_hdbm/pages/activity/Agreement.js
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

   console.log(options)
   that.setData({
     type:options.type
   })
   that.reload()
  },
  reload: function (options) {
    var that = this
    var type = that.data.type
    if (type == 1) {
      wx.setNavigationBarTitle({
        title: '用户协议 '
      })
      app.util.request({
        'url': 'entry/wxapp/agreement',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            nodes: res.data.content
          })
        },
      })
    }
    if (type == 2) {
      wx.setNavigationBarTitle({
        title: '身份认证服务协议 '
      })
      app.util.request({
        'url': 'entry/wxapp/authnotice',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            nodes: res.data.content
          })
        },
      })
    }
    if (type == 3) {
      wx.setNavigationBarTitle({
        title: '关于我们 '
      })
      app.util.request({
        'url': 'entry/wxapp/about',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            nodes: res.data.content
          })
        },
      })
    }

  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
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