// zh_hdbm/pages/acinfo/acinfo.js
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
    var id = options.id
    console.log(options)
    app.util.request({
      'url': 'entry/wxapp/ActivityDetails',
      'cachetime': '0',
      data: { id: options.hdid },
      success: function (res) {
        console.log(res)
        that.setData({
          cost: res.data.cost,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/enrolllist',//活动的接口
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id: options.hdid },
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].xm = res.data[i].姓名
          res.data[i].phone = res.data[i].电话
          if (res.data[i].id == id) {
            that.setData({
              ren: res.data[i],
            })
          }

        }
      },

    })
  },
  phone:function(e){
    var that = this
    var ren = that.data.ren
    wx.makePhoneCall({
      phoneNumber: ren.phone
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