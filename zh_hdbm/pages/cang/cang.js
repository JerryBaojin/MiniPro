// zh_hdbm/pages/cang/cang.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mycollect: [],
    tuijian: [],
    seller: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //我的报名的接口
    that.reload()
  },


  reload: function (e) {
    var that = this
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
    var time1 = getNowFormatDate()
    var time = getNowFormatDate().slice(5, 16)
    var openid = wx.getStorageSync('openid')//用户opinid
    var user_id = wx.getStorageSync('uid')//用户user_id
    console.log(user_id)
    app.util.request({
      'url': 'entry/wxapp/mycollect',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        var now = new Date();
        var nowTime = now.getTime();
        var day = now.getDay();
        var oneDayLong = 24 * 60 * 60 * 1000;
        // var MondayTime = nowTime - (day - 1) * oneDayLong;
        var SundayTime = nowTime + (7 - day) * oneDayLong;
        // 本周周一
        // var c = new Date(MondayTime);
        // 本周周末
        var d = new Date(SundayTime);
        var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        console.log(youWant)
        for (var i = 0; i < res.data.length; i++) {
          var list = res.data
          wx.setStorageSync("uniacid", res.data[i].uniacid)
          list[i].star_time = list[i].start_time.slice(5, 16)
          list[i].en_time = list[i].end_time.slice(5, 16)
          list[i].bm_sta = list[i].bm_start.slice(5, 16)
          list[i].bm_en = list[i].bm_end.slice(5, 16)
          list[i].star = list[i].start_time
          list[i].star1 = list[i].start_time.slice(0, 10)
          list[i].start_time = list[i].start_time.slice(5, 16)
          list[i].city = list[i].city.slice(0, 4)
          list[i].hour = list[i].star.slice(11, 16)
          // 计算活动开始时间是周几
          list[i].week = new Date(list[i].star1).getDay();
          // 计算今天是周几
          list[i].week1 = new Date().getDay();

          // 计算相差天数
          var date1 = list[i].star.slice(8, 10)
          var date2 = time1.slice(8, 10)
          var d1 = new Date(time1)
          var d2 = new Date(list[i].star)
          var d3 = d2.getTime() - d1.getTime()
          list[i].days = Math.floor(d3 / (24 * 3600 * 1000))//两个时间相差的天数
          // 活动开始时间
          var date1 = new Date(list[i].star1)
          // 当前时间
          var date2 = new Date(time1.slice(0, 10))
          // 本周末时间
          var date4 = new Date(youWant.slice(0, 10))
          // 活动开始时间与当前时间差
          var date3 = date1.getTime() - date2.getTime()
          // 活动开始时间与当前时间差
          var date5 = date4.getTime() - date1.getTime()
          var day1 = Math.floor(date5 / (24 * 3600 * 1000))
          if (day1 >= -1) {
            list[i].day1 = '本周'
          } else if (day1 < -1) {
            list[i].day1 = '下周'
          }
          list[i].day2 = day1


          list[i].day = Math.floor(date3 / (24 * 3600 * 1000))//两个时间相差的天数
          if (time1 > list[i].star) {
            list[i].again = '已经结束'
          } else
            if (list[i].day < 0) {
              list[i].again = '已经结束'
            } else if (list[i].day == 0) {
              list[i].again = '今天'
            } else if (list[i].day == 1) {
              list[i].again = '明天'
            } else if (list[i].day == 2) {
              list[i].again = '后天'
            } else if (list[i].day == 3) {
              if (list[i].week1 == 0) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 1) {
                list[i].again = '周四'
              } else if (list[i].week1 == 2) {
                list[i].again = '周五'
              } else if (list[i].week1 == 3) {
                list[i].again = '周六'
              } else if (list[i].week1 == 4) {
                list[i].again = '周日'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周一'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周二'
              }
            } else if (list[i].day == 4) {
              if (list[i].week1 == 0) {
                list[i].again = '下周四'
              } else if (list[i].week1 == 1) {
                list[i].again = '周五'
              } else if (list[i].week1 == 2) {
                list[i].again = '周六'
              } else if (list[i].week1 == 3) {
                list[i].again = '周日'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周一'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周二'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周三'
              }
            } else if (list[i].day == 5) {
              if (list[i].week1 == 0) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 1) {
                list[i].again = '周六'
              } else if (list[i].week1 == 2) {
                list[i].again = '周日'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周一'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周二'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周四'
              }
            } else if (list[i].day == 5) {
              if (list[i].week1 == 0) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 1) {
                list[i].again = '周六'
              } else if (list[i].week1 == 2) {
                list[i].again = '周日'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周一'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周二'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周四'
              }
            } else if (list[i].day == 6) {
              if (list[i].week1 == 0) {
                list[i].again = '下周六'
              } else if (list[i].week1 == 1) {
                list[i].again = '周日'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周一'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周二'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周四'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周五'
              }
            } else if (list[i].day == 7) {
              if (list[i].week1 == 0) {
                list[i].again = '下周日'
              } else if (list[i].week1 == 1) {
                list[i].again = '下周一'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周二'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周四'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周六'
              }
            } else if (list[i].day == 8) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = '下周二'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周四'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周六'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周日'
              }
            } else if (list[i].day == 9) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = '下周三'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周四'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周六'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周日'
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 10)
              }
            } else if (list[i].day == 10) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = '下周四'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周六'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周日'
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 10)
              }
            } else if (list[i].day == 11) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = '下周五'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周六'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周日'
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 10)
              }
            } else if (list[i].day == 12) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = '下周六'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周日'
              } else if (list[i].week1 == 3) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 10)
              }
            } else if (list[i].day == 13) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = '下周日'
              } else if (list[i].week1 == 2) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 3) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 10)
              }
            } else if (list[i].day >= 13) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 1) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 2) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 3) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 10)
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 10)
              }
            }
          // 计算相差小时数
          var leave1 = d3 % (24 * 3600 * 1000)
          list[i].hours = Math.floor(leave1 / (3600 * 1000))
         
          that.setData({
            mycollect: list
          })
          // console.log(list)
          // console.log(res.data[i].start_time.slice(5,11))
        }
      },
    })
    //console.log(that.data);

    //商家详情的接口
    app.util.request({
      'url': 'entry/wxapp/seller',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          seller: res.data
        })
        //console.log(res)
      },
    }),

      // 图片接口
      app.util.request({
        'url': 'entry/wxapp/attachurl',
        'cachetime': '0',
        success: function (res) {
          that.setData({
            url: res.data
          })
          //console.log(res)
        },
      })
  },
  //点击精选活动，跳转到响应的活动详情
  tuijian: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log(that.data)
    //console.log(e)
    for (var i = 0; i < that.data.mycollect.length; i++) {
      if (that.data.mycollect[i].id == that.data.mycollect[index].id) {
        console.log(that.data.mycollect[i])
        // console.log(that.data.mycollect[index].id)
        wx.navigateTo({
          url: '../info/info?id=' + that.data.mycollect[index].id
        })
        // console.log(e.currentTarget.dataset.id)
      }
    }
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

  onShareAppMessage: function (res) {
    return {
      title: '报名',
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.reload()
    wx.stopPullDownRefresh();
  },
})