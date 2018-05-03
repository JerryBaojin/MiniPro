// zh_hdbm/pages/center/center.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    tabs: ["进行中的活动", "全部活动"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console.log(options)
   if(options.user_id!=null){
     console.log('没有user_id')
     var user_id = options.user_id
   }else if(options.publish_id!=null){
     console.log('没有传递过来id')
     var user_id = options.publish_id
   }else{
     var user_id = wx.getStorageSync('uid')
   }
   if (options.type != null) {
     console.log('没有user_id')
     var type = options.type
   } else if (options.type != null) {
     console.log('没有传递过来id')
     var type = options.type
   }
   that.setData({
     type: type,
     user_id: user_id
   })
    // var user_id = options.user_id
      app.util.request({
        'url': 'entry/wxapp/attachurl',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          that.setData({
            url: res.data
          })
        },
      }),
        app.util.request({
          'url': 'entry/wxapp/getdata',
          'cachetime': '0',
          data: { user_id: user_id },
          success: function (res) {
            // console.log(res)
            that.setData({
              infos: res.data
            })
          },
        })
      function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
        return currentdate;
      }
      var time = getNowFormatDate()
      var avatarUrl = wx.getStorageSync('img')
      var nickName = wx.getStorageSync('name')
      app.util.request({
        'url': 'entry/wxapp/releaseactivity',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          // console.log(res)
          var len = res.data.length
          var too = 0;
          function getel(startime) {
            return startime = startime.slice(5, 10)
          }
          var list = res.data
          for (var i = 0; i < res.data.length; i++) {
            // console.log(res.data[i])
            if (time >= list[i].start_time) {
              if (time > list[i].bm_start && time < list[i].bm_end) {
                list[i].activity = 3
                list[i].ac = '报名中'
                //3为正在报名
              } else if (time < list[i].bm_start) {
                list[i].activity = 1
                list[i].ac = '活动正在进行'
                //3为正在报名
              } else if (time > list[i].bm_end) {
                list[i].activity = 1
                list[i].ac = '活动正在进行'
                //3为正在报名
              }

            } else if (time < list[i].start_time) {
              list[i].activity = 2
              list[i].ac = '活动未开始'
              // 2为活动未开始
            } else if (time > list[i].bm_start && time < list[i].bm_end) {
              list[i].activity = 3
              list[i].ac = '报名中'
              //3为正在报名
            } else if (time > list[i].end_time) {
              list[i].activity = 4
              list[i].ac = '活动已经结束'
              //4为活动已经结束
            }
            // 报名人数
            var enroll_num = Number(list[i].enroll_num)
            too += enroll_num
            // console.log('报名人数' + enroll_num)
            var limit_num = Number(list[i].limit_num)
            // console.log('限制人数' + limit_num)
            if (enroll_num <= limit_num) {
              list[i].ren = 0
              // 可以报名
            } else {
              list[i].ren = 1
            }
            wx.setStorageSync("uniacid", res.data[i].uniacid)
            list[i].enroll_num = Number(list[i].enroll_num)
            list[i].start_time = getel(res.data[i].start_time)
            list[i].end_time = getel(res.data[i].end_time)
            list[i].city = res.data[i].city.slice(0, 4)
          }
          that.setData({
            activity: res.data,
            len: len,
            too: too
          })
        },
      })
      that.setData({
        avatarUrl: avatarUrl,
        nickName: nickName
      })
    },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  details: function (e) {
    var that = this

    // console.log(e)
    console.log(that.data)
    var id = e.currentTarget.dataset.id
    var bm_id = e.currentTarget.dataset.bm_id
    wx: wx.navigateTo({
      url: '../../info/info?id=' + id+'&type='+2+'&user_id='+that.data.user_id,
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
    wx.showShareMenu({
      withShareTicket: true
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