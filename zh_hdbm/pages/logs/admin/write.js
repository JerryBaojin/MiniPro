// zh_hdbm/pages/logs/admin/write.js
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
    console.log('有没有携带东西')
    console.log(options)
    var that = this
    var fb_userid = options.user_id
    that.setData({
      fb_userid: fb_userid
    })
    app.util.request({
      'url': 'entry/wxapp/verifylist',
      'cachetime': '0',
      data: { user_id: 142},
      success: function (res) {
        console.log(res)
       
      },
    })
    wx.login({
      success: function (res) {
        console.log(res)
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            that.setData({
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName
            })

            app.util.request({
              'url': 'entry/wxapp/openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                console.log(res)
                var openid = res.data.openid
                that.setData({
                  openid: res.data.openid,
                  img: res.data.avatarUrl,
                  name: res.data.nickName
                })
                app.util.request({
                  'url': 'entry/wxapp/login',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  'cachetime': '0',
                  data: { openid: openid, img: avatarUrl, name: nickName },
                  success: function (res) {
                    console.log(res)
                    that.setData({
                      hx_userid: res.data.id,
                      loading: true
                    })
                  },
                  fail: function () {
                    console.log("失败了")
                  }
                })
              },
              fail: function () {
                console.log("获取用户信息失败")
                wx: wx.showToast({
                  title: '获取信息失败，建议重新启动小程序',
                  icon: '',
                  image: '',
                  duration: 3000,
                  mask: true,
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            })
          },
          fail: function () {
            console.log("失败了")
          }
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  hxcode:function(e){
    console.log(e)
    var that= this
    var fb_userid = that.data.fb_userid
    var hx_userid = that.data.hx_userid
    console.log(fb_userid)
    console.log(hx_userid)
    app.util.request({
      'url': 'entry/wxapp/saveverify',
      'cachetime': '0',
      data: { fb_userid: fb_userid, hx_userid: hx_userid},
      success: function (res) {
        console.log(res)
        if(res.data==1){
          wx:wx.showModal({
            title: '提示',
            content: '您已经成为核销员',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx: wx.reLaunch({
                  url: '../../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx: wx.reLaunch({
                  url: '../../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          wx: wx.showModal({
            title: '提示',
            content: '没有权限',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx: wx.reLaunch({
                  url: '../../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx: wx.reLaunch({
                  url: '../../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
             
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })
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