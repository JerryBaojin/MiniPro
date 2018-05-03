// zh_hdbm/pages/income/income.js
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
      var is_rz = options.is_rz
      that.setData({
        is_rz: is_rz
      })
      that.reload()  
  },
  reload:function(e){
    var that = this
    // 剩余金额
    var total_cost = Number(wx.getStorageSync("user").total_cost)
    var tx_cost = Number(wx.getStorageSync("user").tx_cost)
    var money = total_cost-tx_cost
    var user_id = wx.getStorageSync("uid")
    console.log('剩余金额' + money)
    that.setData({
      money: money,
      tx_cost: tx_cost
    })
    var avatarUrl = wx.getStorageSync('img')
    var url = wx.getStorageSync('url')
    var nickName = wx.getStorageSync('name')
    var openid = wx.getStorageSync('openid')
    app.util.request({
      'url': 'entry/wxapp/login',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { openid: openid, img: avatarUrl, name: nickName },
      success: function (res) {
        console.log(res)
        // 剩余金额
        var total_cost = Number(res.data.total_cost)
        var tx_cost = Number(res.data.tx_cost)
        var money = total_cost - tx_cost
        that.setData({
          money: money
        })

      },
      fail: function () {
        console.log("失败了")
      }

    })
    // var tx_cost = wx.setStorageSync("user").tx_cost
    // var tx_cost = wx.setStorageSync("user").tx_cost
    //平台信息
    app.util.request({
      'url': 'entry/wxapp/seller',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        // 获取平台提现手续费
        that.setData({
          per: res.data.per,
          tx_money: res.data.tx_money,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/mytx',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data:{user_id:user_id},
      success: function (res) {
        console.log(res.data)
        // 获取平台提现手续费
        that.setData({
          per: res.data.per,
          tx_money: res.data.tx_money,
        })
      },
    })
  },
  cash:function(e){
    var that = this
    console.log(that.data)
    if (that.data.is_rz!=2){
      that.setData({
        close:false
      })
    } else {
      that.setData({
        close: true
      })
      wx: wx.navigateTo({
        url: '../cash/cash?money='+that.data.money
      })
    }
    
  },
  detailed3: function (e) {
    wx: wx.navigateTo({
      url: 'detailed?type=' + 3,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  detailed2:function(e){
    wx: wx.navigateTo({
      url: 'detailed?type='+1,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  detailed:function(e){
      wx:wx.navigateTo({
        url: 'detailed?type=' + 2,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },// 认证状态为2时跳转到认证页面
  authentication: function (e) {
    var that = this
    wx: wx.navigateTo({
      url: '../authen/authen?rz=' + that.data.rz,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  modal:function(e){
      var that = this
      that.setData({
        close:true
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