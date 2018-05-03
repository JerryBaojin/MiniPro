//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider: [],
    url: '',
    swiperCurrent: 0,
    list: [],
    toutiao: '',
    avatarUrl: '',
    nickName: '',
    hidden: false,
    copyright: [],
    loading: false
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
   
    that.reload()
  },
  reload: function (e) {
    var that = this
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
                wx.setStorageSync("key", res.data.session_key)
                wx.setStorageSync("openid", res.data.openid)
                wx.setStorageSync("img", avatarUrl)
                wx.setStorageSync("name", nickName)
                app.util.request({
                  'url': 'entry/wxapp/login',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  'cachetime': '0',
                  data: { openid: openid, img: avatarUrl, name: nickName },
                  success: function (res) {
                    console.log(res)
                    wx.setStorageSync("uid", res.data.id)
                    wx.setStorageSync("user", res.data)
                    that.setData({
                      uid: res.data.id,
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
    // 获取平台设置的审核方式
    // app.util.request({
    //   'url': 'entry/wxapp/setup',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log('获取平台设置的审核方式')
    //     console.log(res)
    //   }
    // })
    var user_id = wx.getStorageSync('uid')
    // console.log(user_id)
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
    var time = getNowFormatDate()
    wx.setStorageSync("time", time1)
    // console.log(time)
    app.util.request({
      'url': 'entry/wxapp/hxCode',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        // console.log(res)
        that.setData({
          bath: res.data
        })
      },
    })
    //获取分类图
    app.util.request({
      'url': 'entry/wxapp/activityType',
      'cachetime': '0',
      dataType: 'json',
      success: function (res) {
        // console.log(res.data);
        if (res.data.length > 5) {
          that.setData({
            hei: 380
          })
        } else {
          that.setData({
            hei: 190
          })
        }
        var navs = [];
        for (var i = 0, len = res.data.length; i < len; i += 10) {
          navs.push(res.data.slice(i, i + 10));
        }
        console.log(navs)
        that.setData({
          navs: navs,
        })
      }
    })
    //地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        app.util.request({
          'url': 'entry/wxapp/map',
          headers: {
            'Content-Type': 'application/json',
          },
          'cachetime': '0',
          data: { op: op },
          success: res => {
            console.log(res.data.result.ad_info.city + res.data.result.ad_info.adcode);
            that.setData({
              city: res.data.result.ad_info.city,
            })
          }
        })
      }
    })

    //轮播图的接口
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/slide',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      success: function (res) {
        //console.log(res.data)
        that.setData({
          slider: res.data
        })
      },
    }),
    // 获取网址
      app.util.request({
        'url': 'entry/wxapp/attachurl',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          var url = res.data
          wx.setStorageSync("url", res.data)
          that.setData({
            url: url
          })
          //console.log(res)
        },
      }),

      //活动的接口
      app.util.request({
        'url': 'entry/wxapp/activity',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          console.log(res)
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
            list[i].star = list[i].start_time
            list[i].star1 = list[i].start_time.slice(0,10)
            list[i].city = list[i].city.slice(0, 4)
            list[i].hour = list[i].star.slice(11,16)
            // 计算活动开始时间是周几
            list[i].week= new Date(list[i].star1).getDay();
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
            var date4 = new Date(youWant.slice(0,10))
            // 活动开始时间与当前时间差
            var date3 = date1.getTime() - date2.getTime()
            // 活动开始时间与当前时间差
            var date5 = date4.getTime() - date1.getTime()
            var day1 = Math.floor(date5 / (24 * 3600 * 1000))
            if(day1>=-1){
              list[i].day1 = '本周'
            }else if(day1< -1){
              list[i].day1 = '下周'
            }
            list[i].day2 = day1


            list[i].day = Math.floor(date3 / (24 * 3600 * 1000))//两个时间相差的天数
            console.log(list[i].bm_start)
            console.log(list[i].bm_end)
            console.log(time)
            if (list[i].end_time>time1){
              console.log('大于当前时间')
            }else{
              console.log('小于当前时间')
            }
            // 计算相差小时数
            var leave1 = d3 % (24 * 3600 * 1000)
            list[i].hours = Math.floor(leave1 / (3600 * 1000))
            if (list[i].bm_start <= time && list[i].bm_end>=time){
              list[i].activity = 3
              list[i].ac = '报名中'
            } else if (time >= list[i].star_time && time <= list[i].end_time ){
              if (list[i].bm_start <= time && list[i].bm_end >= time) {
                list[i].activity = 3
                list[i].ac = '报名中'
              } else{
                list[i].activity = 1
                list[i].ac = '活动进行中'
              }
            } else if (time > list[i].end_time){
              list[i].activity = 4
              list[i].ac = '活动结束'
            } else if (time < list[i].start_time) {
              list[i].activity = 2
              list[i].ac = '活动未开始'
            }
            if (time1 > list[i].star && time1 < list[i].end_time){
              list[i].again = '活动已经开始'
            } else if(time1 < list[i].star &&day==0){
              list[i].again = '今天 '+list[i].hour+' 开始'
            } else if (time1 > list[i].end_time ) {
              list[i].again = '活动已经结束'
            } else if (list[i].day<0){
              list[i].again = '已经结束'
            } else if (list[i].day==0){
              list[i].again = '今天 ' + list[i].hour + ' 开始'
            }else if (list[i].day==1){
              list[i].again = '明天 ' + list[i].hour + ' 开始'
            }else if(list[i].day ==2){
              list[i].again = '后天 ' + list[i].hour + ' 开始'
            } else if (list[i].day == 3) {
              if (list[i].week1==0){
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 1) {
                list[i].again = '周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周一 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 4) {
              if (list[i].week1 == 0) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 1) {
                list[i].again = '周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周一 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 5) {
              if (list[i].week1 == 0) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 1) {
                list[i].again = '周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周一 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 5) {
              if (list[i].week1 == 0) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 1) {
                list[i].again = '周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周一 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 6) {
              if (list[i].week1 == 0) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 1) {
                list[i].again = '周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周一 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 7) {
              if (list[i].week1 == 0) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 1) {
                list[i].again = '下周一 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 8) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16)+"  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = '下周二 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              }
            } else if (list[i].day == 9) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = '下周三 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              }
            } else if (list[i].day == 10) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = '下周四 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              }
            } else if (list[i].day == 11) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = '下周五 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              }
            } else if (list[i].day == 12) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = '下周六 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 3) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              }
            } else if (list[i].day == 13) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = '下周日 ' + list[i].hour + ' 开始'
              } else if (list[i].week1 == 2) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 3) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              }
            } else if (list[i].day >= 13) {
              if (list[i].week1 == 0) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 1) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 2) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 3) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 4) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 5) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              } else if (list[i].week1 == 6) {
                list[i].again = list[i].star.slice(5, 16) + "  开始"
              }
            }
           
            var enroll_num = Number(list[i].enroll_num)
            // console.log('报名人数' + enroll_num)
            var limit_num = Number(list[i].limit_num)
            // console.log('限制人数' + limit_num)
            if (limit_num == 0) {
              list[i].ren = 0
            } else {
              if (enroll_num <= limit_num) {
                list[i].ren = 0
              } else {
                list[i].ren = 1
              }
            }
            // 获取报名人数
            app.util.request({
              'url': 'entry/wxapp/enroll',
              headers: {
                'Content-Type': 'application/json',
              },
              'cachetime': '0',
              data: { id: list[i].id },
              success: function (res) {
                // console.log(res.data.length)
                var renshu = Number(res.data.length)
                // list[i].renshu = renshu
              },
            }),
            console.log(list)
              that.setData({
                list: list
              })
            // console.log(list)
            // console.log(res.data[i].start_time.slice(5,11))
          }
        },
      }),
      //头条详情的接口
      app.util.request({
        'url': 'entry/wxapp/toplist',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          that.setData({
            toutiao: res.data
          })
          //console.log(res)
        },
      }),

      //平台信息
      app.util.request({
        'url': 'entry/wxapp/seller',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          console.log(res.data)
          var name = res.data.name
          wx.setStorageSync("seller", res.data)
          that.setData({
            copyright: res.data
          })
          wx.setNavigationBarTitle({
            title: name
          })
        },
      })
  },
  yan: function (e) {
    wx.scanCode({
      success: (res) => {
        console.log('这是扫码')
        console.log(res)
        console.log('这是扫码完毕')
        var path = res.path
        var arr = path.slice(40)
        wx.navigateTo({
          url: '../logs/admin/scancode?arr=' + arr,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        wx.showToast({
          title: '二维码错误',
          image: '../images/x.png'
        })
      }
    })
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // onShareAppMessage: function () {
  //   return {
  //     title: '微信小程序联盟',
  //     desc: '最具人气的小程序开发联盟!',
  //     path: '/page/info/info?id=123'
  //   }
  // },
  // 滑动切换
  bindChange: function (e) {
    // console.log(e)
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  // 分类
  tzfl: function (e) {
    // console.log(this.data)
    var currentTab = this.data.currentTab;
    // console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    // console.log(id)
    wx.navigateTo({
      url: 'classification?id=' + id + '&name=' + name,
    })
    // if (currentTab == 0) {
    //   console.log(e.currentTarget.dataset.flid)
    //   getApp().flid = e.currentTarget.dataset.flid;
    //   console.log(getApp().flid)
    // }
    // else {
    //   console.log(e.currentTarget.dataset.flid)
    //   getApp().flid = e.currentTarget.dataset.flid + 8;
    //   console.log(getApp().flid)
    // }

  },
  sousuo: function (e) {
    var that = this;
    // console.log(e.detail.value)
    app.util.request({
      'url': 'entry/wxapp/activity',//接口
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { keywords: e.detail.value },//传给后台的值，实时变化
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          // console.log(res.data[i])
          that.setData({
            sousuo: res.data,
            name: res.data[i].name,
            hidden: false
          })
        }

      },

    })

  },
  infoYemian: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data)
    var user_id = that.data.uid
    console.log(e)
    for (var i = 0; i < that.data.list.length; i++) {

      if (that.data.list[i].id == that.data.list[index].id) {
        console.log(that.data.list[i])
        // console.log(that.data.list[index].cost)
        wx.navigateTo({
          url: '../info/info?id=' + that.data.list[index].id + '&created_time=' + that.data.list[index].created_time + '&coll=' + that.data.list[i].cost + '&logo=' + that.data.list[i].logo + '&name=' + that.data.list[i].name + '&summary=' + that.data.list[i].summary + '&limit_num=' + that.data.list[i].limit_num + '&activi=' + that.data.list[i].activity + '&type=' + that.data.list[i].type + '&ren=' + that.data.list[i].ren + '&user_id=' + user_id,
        })
        //console.log(e.currentTarget.dataset.id)
      }
    }
  },
  infoYemian1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data)
    //console.log(e)
    for (var i = 0; i < that.data.sousuo.length; i++) {

      if (that.data.sousuo[i].id == that.data.sousuo[index].id) {
        console.log(that.data.sousuo[i].id)
        wx.navigateTo({
          url: '../info/info?id=' + that.data.sousuo[index].id 
        })
        //console.log(e.currentTarget.dataset.id)
      }
    }
  },
  bindblur: function (e) {
    // console.log(e)
    this.setData({
      hidden: true
    })
    // event.detail = { blur: false }
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

  saoma: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        // console.log(res)
      }
    })
  },

  onReady: function () {

  },
  onPullDownRefresh: function (e) {
    var that = this
    if (that.data.loading == true) {
      that.reload()
      wx.stopPullDownRefresh();
    } else {
      wx: wx.showToast({
        title: '1100',
        icon: '',
        image: '',
        duration: 3000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //点击分享
  onShareAppMessage: function () {
    console.log(this.data)
    return {
      title: this.data.copyright.name,
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
