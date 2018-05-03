// zh_hdbm/pages/logs/income/detailed.js
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
    that.reload()
    var type = options.type
    that.setData({
      types: options.type
    })
    var user_id = wx.getStorageSync('uid')
    var type = that.data.types
    console.log(type)
    // 提现状态
    if (type == 3) {
      console.log('待审核')
      wx.setNavigationBarTitle({
        title: '待审核 '
      })
      app.util.request({
        'url': 'entry/wxapp/mytx',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var detailed3 = []
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].status == 1) {
              detailed3.push(res.data[i])
              console.log(detailed3)
              that.setData({
                detailed3: detailed3
              })
            }
          }
        }
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/costdetails',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (e) {
          console.log('查看成功')
          console.log(e)
          var detaileds = []
          if (type == 1) {
            wx.setNavigationBarTitle({
              title: '提现列表 '
            })
            for (var i = 0; i < e.data.length; i++) {
              if (e.data[i].type == 2) {
                detaileds.push(e.data[i])
                that.setData({
                  detailed: detaileds
                })
              }
            }
          } else if (type == 2) {
            that.setData({
              detailed: e.data
            })
            wx.setNavigationBarTitle({
              title: '流水明细 '
            })
          }

        },
        fail: function (e) {
          console.log('查看失败')
          console.log(e)
        }
      })
    }
  },
  reload: function (e) {
    var that = this
    console.log(that.data)
    
    
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
    this.onLoad();
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