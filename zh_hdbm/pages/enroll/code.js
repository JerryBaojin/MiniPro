// zh_hdbm/pages/code/code.js
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
    var type = options.type
    console.log('这是options')
    console.log(options)
    that.setData({
      ad_id: options.ad_id,
    })
    var user_id = wx.getStorageSync('uid')
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
    console.log(user_id)

    // 获取随机数
    app.util.request({
      'url': 'entry/wxapp/rand',
      'cachetime': '0',
      // data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          nuber: res.data
        })
      },
    })
    //  获取报名的活动列表
    app.util.request({
      'url': 'entry/wxapp/myenroll',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { user_id: user_id },
      'cachetime': '0',
      success: function (res) {
        console.log('这是报名的活动列表')
        console.log(res)
        for (let i in res.data) {
          if (res.data[i].id == options.ad_id) {
            var publish_id = res.data[i].publish_id
            var bm_id = res.data[i].bm_id
            that.setData({
              money: res.data[i].cost
            })
          }
        }

        //获取二维码
        console.log('用户id' + ' ' + user_id)
        console.log('用户报名id' + ' ' + bm_id)
        console.log('活动发布人id' + ' ' + publish_id)
        app.util.request({
          'url': 'entry/wxapp/bmcode',
          'cachetime': '0',
          data: { user_id: user_id, bm_id: bm_id, publish_id: publish_id },
          success: function (res) {
            console.log('报名成功')
            console.log(res)
            that.setData({
              bath: res.data
            })
          },
        })
        var slider = res.data
        for (var i = 0; i < slider.length; i++) {
          if (options.ad_id == slider[i].id) {
            var bm_id = slider[i].bm_id
            app.util.request({
              'url': 'entry/wxapp/enrolldetails',
              headers: {
                'Content-Type': 'application/json',
              },
              data: { bm_id: bm_id, id: options.ad_id },
              'cachetime': '0',
              success: function (res) {

                console.log('获取报名信息')
                console.log(res)
                that.setData({
                  types: res.data.item1.type
                })
                // 判断是平台发布还是个人用户发布
                if (res.data.item1.type == 1) {
                  console.log('平台发布')
                  var slider = res.data.item1
                  slider.end_time = slider.end_time.slice(5, 10)
                  slider.start_time1 = slider.start_time.slice(5, 10)
                  var infos = res.data.item1
                  // 获取平台信息
                  app.util.request({
                    'url': 'entry/wxapp/seller',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    'cachetime': '0',
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        xinxi: res.data,
                        infos: infos,
                      })
                    },
                  })
                } else {
                  console.log('个人用户发布')
                  that.setData({
                    infos: res.data.item2,
                    slider: res.data.item1,
                    xinxi: res.data.item3
                  })
                }
                that.setData({
                  slider: res.data.item1
                })
              },
            })
          }
        }
        that.setData({
          slider: res.data
        })
      },
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    // 判断报名的状态
    app.util.request({
      'url': 'entry/wxapp/enroll',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id: that.ad_id },
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].user_id = user_id) {
            that.setData({
              status: res.data[i].status
            })
          }
        }
      },
    })
  },
  fabu: function (e) {
    wx: wx.reLaunch({
      url: '../activity/activity',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  fanhui: function (e) {
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tomap: function (e) {
    var that = this
    // console.log(that.data)
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (e) {
        var latitude = e.latitude
        var longitude = e.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          address: that.data.address,
          name: that.data.name,
          scale: 28
        })
      }
    })
  },
  call_phone: function () {
    var that = this
    console.log(that.data)
    wx.makePhoneCall({
      phoneNumber: that.data.xinxi.tel
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
    console.log('这是页面显示')
    console.log(this.data)
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
    var that = this
    that.reload()
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