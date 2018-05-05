//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ppp:{
      index:0
    },
    swiperHeight:0,
    tagActiveNumber: 0,
    slider: [],
    url: '',
    swiperCurrent: 0,
    list: [],
    toutiao: '',
    avatarUrl: '',
    nickName: '',
    hidden: false,
    copyright: [],
    loading: false,
    index:1

  },

  loopTag: function (e) {
    let that = this;
    that.setData({
      tagActiveNumber: e.currentTarget.dataset.current,
      itemIndex: e.currentTarget.dataset.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.reload();
    that.getDatas();
  },
  onShow: function (options) {
    var that = this
    that.reload();
    that.getDatas();
  },
  onReachBottom: function (e) {
    let that=this;
  that.getDatas();
  },
  infoYemian: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data)
    var datas = that.data.list[index]

    wx.setStorageSync("details", datas);
    wx.navigateTo({
      url: "../info/info",
    })

  },
 timestampToTime:function(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+ M + D + h + m + s;
  },

  getDatas:function(e){
    let that = this;
    if(that.data.index==-1){
      return false;
    }
    app.util.request({
      'url': 'entry/wxapp/infos',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: {
        index: that.data.index,
        type: "newLists"
      },
   success: function (res) {

     res.data.map(function(v,k){
       res.data[k].time = that.timestampToTime(v.time);
       let p="";
       switch (v.types){
            case "0":
              p="寻狗启示";
            break;
            case "1":
              p = "寻源主人";
              break;
            case "2":
              p = "免费领养";
              break;
            case "3":
              p = "我想领养";
              break;
       }
       res.data[k].types = p;
       res.data[k].imgs = JSON.parse(v.imgs.replace(/&quot;/g, '"'));
       res.data[k].location = JSON.parse(v.location.replace(/&quot;/g, '"'));
     })
     if (res.data.length >= 1 && res.data.length < 10){
       that.setData({
        // list: [...that.data.list, ...res.data]
         list:  res.data
       })
     } else if (res.data.length>=10){
       that.setData({
        list: [...that.data.list, ...res.data],
         index:++that.data.index
       })
     }
    
      },
  })}
   , 
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
                wx.setStorageSync("sex", gender)
                app.util.request({
                  'url': 'entry/wxapp/login',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  'cachetime': '0',
                  data: { openid: openid, img: avatarUrl, name: nickName, sex: gender },
                  success: function (res) {
                    wx.setStorageSync("phone", res.data.phone)
                    wx.setStorageSync("infos", res.data.infos)
                    wx.setStorageSync("addr", res.data.addr)
                    wx.setStorageSync("sharePage", res.data.sharePage)
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
      //头条详情的接口

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

  //点击分享
  onShareAppMessage: function () {
    return {
      title: this.data.copyright.name,
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        app.util.request({
          'url': 'entry/wxapp/record',//接口
          headers: {
            'Content-Type': 'application/json',
          },
          'cachetime': '0',
          data: { openid: wx.getStorageSync("openid") },//传给后台的值，实时变化
          success:function(res){
            let p = wx.getStorageSync("sharePage") ;
            wx.setStorageSync("sharePage",p+1)
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
