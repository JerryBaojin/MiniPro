//index.js
//获取应用实例
var sliderWidth = 60; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
  data: {
    modalHidden: true,
    tabs: ["全部", "待参与", "已取消", "已完成",],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 18,

  },
  onLoad: function () {
    //我的报名的接口
    var that = this
    var url = wx.getStorageSync("url")
    console.log(url)
    that.setData({
      url: url
    })
    var openid = wx.getStorageSync('openid')//用户opinid
    var user_id = wx.getStorageSync('uid')//用户user_id
    var time = wx.getStorageSync('time')//用户opinid
    console.log(user_id)
    app.util.request({
      'url': 'entry/wxapp/myenroll',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        function getel(startime) {
          return startime = startime.slice(5, 10)
        }
        var payment = [], check = [], cancel = [], Already = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id != null) {
            var list = res.data
            list[i].start_time = res.data[i].start_time.slice(5, 16)
            list[i].end = list[i].end_time
            list[i].start = list[i].start_time
            list[i].end_time = getel(res.data[i].end_time)
            list[i].city = res.data[i].city.slice(0, 4)
            // 判断报名的状态
            app.util.request({
              'url': 'entry/wxapp/enroll',
              headers: {
                'Content-Type': 'application/json',
              },
              data: { id: list[i].id },
              'cachetime': '0',
              success: function (res) {
                console.log(res)
                for (var i = 0; i < res.data.length; i++) {
                  if (res.data[i].user_id = user_id) {
                    list[i].status = res.data[i].status
                  }
                }
              },
            })
            console.log(res.data[i])
            if (time > list[i].bm_start && time < list[i].bm_end) {
              list[i].activity = 3
              list[i].ac = '报名中'
            }
            if (time >= list[i].start) {
              if (time > list[i].bm_start && time < list[i].end) {
                list[i].activity = 1
                list[i].ac = '活动正在进行'
              } else if (time > list[i].bm_end) {
                list[i].activity = 1
                list[i].ac = '活动已结束'
              }
            }
            if (time < list[i].start_time) {
              list[i].activity = 2
              list[i].ac = '活动未开始'
            }
            if (time > list[i].bm_start && time < list[i].bm_end) {
              list[i].activity = 3
              list[i].ac = '报名中'
            }
            if (time > list[i].end) {
              console.log('活动已结束')
              list[i].activity = 4
              list[i].ac = '活动已经结束'
            }
            check.push(res.data[i])
            that.setData({
              payment: payment, check: check, cancel: cancel, Already: Already
            })
            console.log(res)
            if (res.data[i].status == 1) {
              console.log('活动未核销')
              payment.push(res.data[i])
              that.setData({
                payment: payment, check: check, cancel: cancel, Already: Already
              })
            }
            if (res.data[i].activity == 4 || res.data[i].status == 2) {
              console.log('活动已核销')
              cancel.push(res.data[i])
              // console.log(order[i])
              that.setData({
                payment: payment, check: check, cancel: cancel, Already: Already
              })
            }
          }
          console.log(payment)
          // that.setData({
          //   list: res.data
          // })
        }
      },
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  // 点击跳转详情
  details: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    var bm_id = e.currentTarget.dataset.bm_id
    wx: wx.navigateTo({
      url: 'listinfo?id=' + id + '&bm_id=' + bm_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  details_dai: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    var bm_id = e.currentTarget.dataset.bm_id
    wx: wx.navigateTo({
      url: 'listinfo?id=' + id + '&bm_id=' + bm_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  details_tui: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    var bm_id = e.currentTarget.dataset.bm_id
    wx: wx.navigateTo({
      url: 'listinfo?id=' + id + '&bm_id=' + bm_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  details_wan: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    var bm_id = e.currentTarget.dataset.bm_id
    wx: wx.navigateTo({
      url: 'listinfo?id=' + id + '&bm_id=' + bm_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tabClick: function (e) {
    console.log(this.data)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }

});