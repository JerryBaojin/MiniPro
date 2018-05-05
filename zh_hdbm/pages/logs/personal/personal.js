// zh_hdbm/pages/personal/personal.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    ycgywm: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    that.reload()
  },
  todetial:function(){
    wx.navigateTo({
      url: 'info',
    })
  },
  mylists:function(){
    wx.navigateTo({
      url: 'list?id=-1&name=我的发布',
    })
  },
  reload: function (e) {
    var that = this
    var user_id = wx.getStorageSync('uid');
    // 剩余金额
    var total_cost = Number(wx.getStorageSync("user").total_cost)
    var tx_cost = Number(wx.getStorageSync("user").tx_cost)
    var money = total_cost - tx_cost
    that.setData({
      money: money,
      user_id: user_id
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
    that.setData({
      avatarUrl: avatarUrl,
      nickName: nickName
    })
    if (avatarUrl == '' || nickName == '') {
      wx: wx.showToast({
        title: '数据未加载完全',
        icon: '',
        image: '',
        duration: 3000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    var openid = wx.getStorageSync('openid')//用户opinid
    console.log(user_id)
    // 判断用户是否已经认证
    app.util.request({
      'url': 'entry/wxapp/checkrz',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data == 4) {
          that.setData({
            rz: res.data
          })
        } else if (res.data != 4) {
          that.setData({
            is_rz: res.data.status
          })
        }

      },
    })
    // 获取我的收藏的数量
    app.util.request({
      'url': 'entry/wxapp/mycollect',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        var lennn = []
        var lenn = res.data.length
        if (res.data == null || res.data == '') {
          that.setData({
            lenn: 0
          })
        } else {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].id != null) {
              lennn.push(res.data[i])
              that.setData({
                lenn: lennn.length
              })
            } else {
              that.setData({
                lenn: 0
              })
            }
          }

        }

      },
    })
    app.util.request({
      'url': 'entry/wxapp/myenroll',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('我报名的活动')
        console.log(res)
        function getel(startime) {
          return startime = startime.slice(5, 10)
        }
        var myenroll = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id != null) {
            var list = res.data
            list[i].star_time = list[i].start_time.slice(5, 16)
            // res.data[i].address = res.data[i].address.slice(0, 4)
            // res.data[i].end_time = res.data[i].end_time.slice(5, 10)
            // res.data[i].start_time = res.data[i].start_time.slice(5, 10)
            myenroll.push(list[i])
            console.log(myenroll.length)
            var enroll = myenroll[0]
            if (myenroll != null || myenroll != '') {
              var len = myenroll.length
            } else {
              var len = 0
            }
            console.log('我报名的活动的长度' + len)
            // 判断报名的状态
            app.util.request({
              'url': 'entry/wxapp/enroll',
              headers: {
                'Content-Type': 'application/json',
              },
              data: { id: enroll.id },
              'cachetime': '0',
              success: function (res) {
                console.log(res)
                for (var i = 0; i < res.data.length; i++) {
                  if (res.data[i].user_id == user_id) {
                    that.setData({
                      status: res.data[i].status
                    })
                  }
                }
              },
            })
            that.setData({
              myenroll: myenroll,
              url: url,
              enroll: enroll,
              len: len
            })
          }
        }
        if (res.data == null || res.data == '') {
          that.setData({
            len: 0
          })
        }
        console.log(myenroll)
      },
    })
    //主办方信息
    app.util.request({
      'url': 'entry/wxapp/getdata',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          zbftel: res.data.tel,
          gywm: res.data.details
        })
      },
    })
    // app.util.request({
    //   'url': 'entry/wxapp/getdata',
    //   'cachetime': '0',
    //   data: { user_id: user_id },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       zbftel: res.data.tel,
    //       gywm: res.data.details
    //     })
    //   },
    // })
    console.log(user_id)
    //主办方活动
    app.util.request({
      'url': 'entry/wxapp/releaseactivity',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        console.log('主办方的活动')
        if (res.data.length != 0) {
          var zblen = res.data.length
          var zbfinfo = res.data[0]
          zbfinfo.start_time = (res.data[0].start_time).substring(5, 16)
          if (zbfinfo == '' || zbfinfo == null) {
            that.setData({
              zblen: 0
            })
          } else {
           
            that.setData({
              hdlength: res.data,
              zbfinfo: zbfinfo,
              url: url,
              zblen: zbfinfo.length
            })
          }
        } else {
          that.setData({
            zblen: 0
          })
        }

        console.log('主办方的活动有' + zblen)

      },
    })

  },
  fabu: function (e) {
    wx: wx.navigateTo({
      url: '../../activity/activity',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  vip: function (e) {
    wx: wx.navigateTo({
      url: '../authen/authen',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  detail: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../mylist/listinfo?id=' + id + '&bm_id=' + that.data.enroll.bm_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  details: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: 'listinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  income: function (e) {
    var that = this
    console.log(that.data)
    var is_rz = that.data.is_rz
    wx: wx.navigateTo({
      url: '../income/income?is_rz=' + is_rz,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  // 点击切换主办方和参与者
  qiehuan: function (e) {
    var that = this
    if (that.data.zblen == 0) {
      // wx:wx.showToast({
      //   title: '你还没有发布任何活动哦！',
      //   icon: '',
      //   image: '',
      //   duration: 2000,
      //   mask: true,
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
      that.setData({
        release: false
      })
    } else {
      that.setData({
        release: true
      })
      that.setData({
        tar: false
      })
      setTimeout(function () {
        that.setData({
          hidden: false
        })
      }, 1000)
    }

  },
  // 如果没有发布活动,点击跳转到发布活动页面
  authentication: function (e) {
    wx: wx.switchTab({
      url: '../../activity/activity',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  no_modal: function (e) {
    var that = this
    that.setData({
      release: true
    })
  },
  trfer: function (e) {
    wx: wx.navigateTo({
      url: '../refer/refer',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  qie: function (e) {
    var that = this
    that.setData({
      tar: true
    })
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 1000)
  },
  Import: function (e) {
    wx: wx.navigateTo({
      url: '../center/center',
    })
  },
  list: function (e) {
    wx: wx.navigateTo({
      url: '../mylist/mylist',
    })
  },
  success: function (e) {
    wx: wx.navigateTo({
      url: '../../success/success',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  Collection: function (e) {
    wx: wx.navigateTo({
      url: '../../cang/cang',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  faxian: function (e) {
    wx: wx.reLaunch({
      url: '../../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  admin: function (e) {
    wx: wx.navigateTo({
      url: '../admin/admin',
    })
  },
  admin1: function (e) {
    var hdid = e.currentTarget.dataset.hdid
    console.log(hdid)
    wx: wx.navigateTo({
      url: '../admin/admin?hdid=' + hdid,
    })
  },
  manage: function (e) {
    wx: wx.navigateTo({
      url: '../../index/classification?types=' + 1,
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
  lxwm: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("seller").tel,
    })
  },
  gywm: function () {
    var that = this;
    wx: wx.navigateTo({
      url: '../../activity/Agreement?type=' + 3,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  queren: function () {
    var that = this;
    this.setData({
      ycgywm: true
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
  onPullDownRefresh: function (e) {
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