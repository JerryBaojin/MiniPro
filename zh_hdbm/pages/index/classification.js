// zh_hdbm/pages/index/classification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImgs: [],
    swiperCurrent:0,
    index:0,
    list:[],
    type:0,
    aType:"slider",
    distance:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.setNavigationBarTitle({
      title: options.name
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          distance: { ...res }
        })
      },complete:function(res){
        that.getDatas();
      }
    })
    if (parseInt(options.id)==-1){
      that.setData({
        aType:"openid",
        type: wx.getStorageSync("openid")
      })
    }else{
      that.setData({
        type: parseInt(options.id)
      })
    }
    if (options.tag!=0){
      app.util.request({
        'url': 'entry/wxapp/getimgs',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          if (options.tag !== 1){
             that.setData({
               headImgs: JSON.parse(res.data[0]['tips1'])
             })
          }else{
            that.setData({
              headImgs: JSON.parse(res.data[0]['tips3'])
            })
          }

          console.log(that.data.headImgs)
        }
      })
 }
   
  
},
  onReachBottom: function (e) {
    let that = this;
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
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },
  getDistance: function (lat2, lng2) {
    let res = this.data.distance
    console.log(res, lat1)
    let lat1 = res.latitude || 0;
    let lng1 = res.longitude || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    let p = (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
    let n = p / 100;
    if (n > 0) {
      return "(" + n + "km" + ")";
    } else {
      return "(" + n + "m" + ")";
    }
  },
  getDatas: function (e) {
    let that = this;
    if (that.data.index == -1) {
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
        type: that.data.aType,
        uid:that.data.type
      },
      success: function (res) {

        res.data.map(function (v, k) {
          res.data[k].time = that.timestampToTime(v.time);
          let p = "";
          switch (v.types) {
            case "0":
              p = "寻狗启示";
              break;
            case "1":
              p = "寻源主人";
              break;
            case "2":
              p = "待领养狗";
              break;
            case "3":
              p = "待领养猫";
              break;
            case "4":
              p = "其它宠物";
              break;
            case "5":
              p = "我想领养";
              break;
          }
          res.data[k].types = p;
          res.data[k].imgs = JSON.parse(v.imgs.replace(/&quot;/g, '"'));
          let place = JSON.parse(v.location.replace(/&quot;/g, '"'));
          res.data[k].location = place

          res.data[k].address = place.address + that.getDistance(place.latitude, place.longitude);
        })
        if (res.data.length >= 1 && res.data.length < 10) {
          that.setData({
            // list: [...that.data.list, ...res.data]
            list: res.data
          })
        } else if (res.data.length >= 10) {
          that.setData({
            list: [...that.data.list, ...res.data],
            index: ++that.data.index
          })
        }

      },
    })
  }
  , onShareAppMessage: function () {
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
          success: function (res) {
            let p = wx.getStorageSync("sharePage");
            wx.setStorageSync("sharePage", p + 1)
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})