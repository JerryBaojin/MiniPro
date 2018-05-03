// zh_hdbm/pages/logs/authen/authen.js
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
      that.reload()
  },
  reload:function(e){
    var that = this
    var user_id = wx.getStorageSync('uid')//用户user_id
    console.log('用户的user_id'+user_id)
    var is_rz = wx.getStorageSync('user').is_rz
    console.log(is_rz)
    app.util.request({
      'url': 'entry/wxapp/checkrz',
      'cachetime': '0',
      data: { user_id: user_id},
      success: function (res) {
        console.log(res)
        if(res.data==4){
          that.setData({
            rz: res.data
          })
        }else if(res.data!=4){
          that.setData({
            is_rz: res.data.status
          })
        }
        
      },
    })
  },
  select:function(e){
    wx: wx.navigateTo({
      url: '../select/select',
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
    this.reload()
    wx.stopPullDownRefresh()
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