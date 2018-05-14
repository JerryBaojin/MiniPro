// zh_hdbm/pages/admin/admin.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.hdid)
    wx.showShareMenu({
      withShareTicket: true
    })
    that.setData({
      hdid: options.hdid
    })
    var user_id = wx.getStorageSync("uid")
    app.util.request({
      'url': 'entry/wxapp/getdata',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          infos: res.data
        })
      },
    })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var hdid = that.data.hdid
    app.util.request({
      'url': 'entry/wxapp/ActivityDetails',
      'cachetime': '0',
      data: { id:hdid },
      success: function (res) {
        console.log(res)
        that.setData({
          hdinfo: res.data,
          hdtype: res.data.is_close
        })
      },
    })
  },
  onShareAppMessage: function () {
    var user_id = wx.getStorageSync('uid')
    console.log(this.data)
    return {
      title: this.data.infos.name+'的主页',
      path: '/zh_hdbm/pages/logs/center/center?user_id=' + user_id,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      }
    }
  },
  butt:function(e){
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        console.log(res)
      },
      fail:function(e){
        console.log(e)
      }
    })
  },
  bmg: function (e) {
    console.log(this.data)
    var user_id = wx.getStorageSync("uid")
    // wx.setStorageSync("key", res.data.session_key)
    wx: wx.navigateTo({
      url: '../edit/edit?id=' + this.data.hdid 
    })
  },
  chakan: function (e) {
    var user_id = wx.getStorageSync("uid")
    wx: wx.navigateTo({
      url: '../../info/info?id=' + this.data.hdid + '&type=' + 2 + '&user_id=' + user_id,
    })
  },
  yan:function(e){
    wx.scanCode({
      success: (res) => {
        console.log('这是扫码')
        console.log(res)
        console.log('这是扫码完毕')
        var path = res.path
        var arr = path.slice(40)
        console.log(arr)
        wx.navigateTo({
          url: 'scancode?arr='+arr,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        wx.showToast({
        title: '二维码错误',
        image:'../images/x.png'
        })
      }
    })
  },
  // 点击关闭报名
  guanbi: function (e) {
    var that = this
    var id = that.data.hdid
    var hdtype = that.data.hdtype
    if (hdtype==1){
      wx.showModal({
        title: '关闭提示',
        content: '确定关闭报名',
        confirmText: '确定',
        success: function (res) {
          console.log(res)
          if (res.confirm == true) {
            app.util.request({
              'url': 'entry/wxapp/closeactivity',
              headers: {
                'Content-Type': 'application/json',
              },
              'cachetime': '0',
              data: { id: id, is_close: 2 },
              success: function (res) {
                wx: wx.showToast({
                  title: '关闭成功',
                  icon: '',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
                that.refresh()
              },
            })
          } else if (res.cancel == true) {
            console.log('不关闭报名')
          }
        }
      })
    }else{
      wx.showModal({
        title: '开启提示',
        content: '确定开启报名',
        confirmText: '确定',
        success: function (res) {
          console.log(res)
          if (res.confirm == true) {
            app.util.request({
              'url': 'entry/wxapp/closeactivity',
              headers: {
                'Content-Type': 'application/json',
              },
              'cachetime': '0',
              data: { id: id, is_close: 1 },
              success: function (res) {
                wx: wx.showToast({
                  title: '开启成功',
                  icon: '',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
                that.refresh()

              },
            })
          } else if (res.cancel == true) {
            console.log('不关闭报名')
          }
        }
      })
    }
   
  },
  // 关闭报名点击确定
  modalChange: function (e) {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },
  // 关闭报名点击取消
  modalcancel: function (e) {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },
  again:function(e){
    wx: wx.reLaunch({
      url: '../../activity/activity',
    })
  },
  code:function(e){
    wx:wx.navigateTo({
      url: 'code',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
  // onShareAppMessage: function () {

  // }
})