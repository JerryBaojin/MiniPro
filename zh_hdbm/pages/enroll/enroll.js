// zh_hdbm/pages/enroll/enroll.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seller: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    function getel(startime) {
      return startime = startime.slice(5, 10)
    }
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      success: function (res) {
        var url = res.data
        console.log(url)
        that.setData({
          url: url
        })
      }
    })
    that.setData({
      ad_id: options.ad_id
    })
    //商家详情的接口
    app.util.request({
      'url': 'entry/wxapp/activitydetails',
      'cachetime': '0',
      data: { id: options.ad_id },
      success: function (res) {
        console.log(res.data)
        res.data.start_time = res.data.start_time.slice(5,10)
        res.data.end_time = res.data.end_time.slice(5, 10)
        that.setData({
          seller: res.data
        })
      },
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
  baa: function (e) {
    var that = this
    wx: wx.navigateTo({
      url: 'code?ad_id=' + that.data.ad_id
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
  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: '报名',
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  home: function (e) {
    console.log(e);
    wx.switchTab({
      url: '../index/index'
    })
  }

})