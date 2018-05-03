// zh_hdbm/pages/refer/intro/intro.js
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
      that.setData({
        tel:options.tel
      })
  },
  formSubmit: function (e) {
    console.log(e)
    var value = e.detail.value.name
    console.log('输入的是' + value)
    //  te = e.detail.value.text
    var pages = getCurrentPages();
    console.log(pages)
    var currPage = pages[pages.length - 1];   //当前页面
    console.log(currPage)
    var prevPage = pages[pages.length - 2];  //上一个页面
    console.log(prevPage)
    prevPage.setData({
      tel: value
    })
    wx: wx.navigateBack({
      delta: 1,
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