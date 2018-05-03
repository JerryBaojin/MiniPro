// zh_hdbm/pages/logs/admin/scancode.js
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
    // 报名人的id
    // var src = decodeURIComponent(options.q)
    // console.log(src)
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    if (options.scene == null) {
      var arr = options.arr
    }else{
      var arr = options.scene
    }
    console.log(arr)
    var bool = arr.indexOf("%");
    if (bool > 0) {
      console.log('包含')
      var aa = arr.split("%");
      var bm_id = aa[0]
      var publish_id = aa[2].slice(2)
      console.log(aa)
      console.log(publish_id)
    } else {
      console.log('不包含')
      var strs = arr.split(",");
      var bm_id = strs[0]
      var publish_id = strs[2]
      var user_id = strs[1]
    }
    console.log('报名人的id' + ' ' + bm_id)
    console.log('活动发布人id' + ' ' + publish_id)
    var that = this
    // 验票人的id
    var hx_userid = wx.getStorageSync('uid')//用户id
    console.log('核销人id' + ' ' + hx_userid)
    that.setData({
      bm_id: bm_id,
      publish_id: publish_id,
      hx_userid: hx_userid
    })
  },
  transmit: function (e) {
    var that = this
    console.log(that.data)
    app.util.request({
      'url': 'entry/wxapp/checkverify',
      'cachetime': '0',
      data: { bm_id: that.data.bm_id, publish_id: that.data.publish_id, hx_userid: that.data.hx_userid },
      success: function (res) {
        console.log(res)
        that.setData({
          success: res.data
        })
      },
    })
  },
  success: function (e) {
    wx: wx.reLaunch({
      url: '../../index/index',
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