// pages/info/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      infos:[],
      distance:0
  },
  onLoad:function(){
    let that=this;
    let p=wx.getStorageSync("details");

    this.setData({
      infos:p
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
      //  that.setData({
      //    distance: that.getDistance(latitude, longitude, that.data.infos.location.latitude, that.data.infos.location.longitude)
      //  })
       that.setData({
         distance:{...res}
       })
      },complete:function(res){
   
      }
    })
  }
  , 
  getDistance: function (lat2, lng2) {
    let res = this.data.distance

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
  onShareAppMessage: function () {
    return {
      title:"寻宠小程序",
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
  },

  toMap:function(e){
    let that=this;
    wx.openLocation({
      latitude: that.data.infos.location.latitude, // 纬度，范围为-90~90，负数表示南纬  
      longitude: that.data.infos.location.longitude, // 经度，范围为-180~180，负数表示西经  
      scale: 28, // 缩放比例            
    })  
  },
  share:function(e){
    this.onShareAppMessage()
  },
  fanhui:function(e){
    wx.navigateBack();//返回上一页  
  },
 phonecall:function(e){
  let that=this;

   wx.makePhoneCall({
     phoneNumber: that.data.infos.phone,
     success: function (res) { },
     fail: function (res) { },
     complete: function (res) { },
   })
 }
})