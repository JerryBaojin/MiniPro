// pages/info/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      infos:[],
      pid:0,
  },
  onLoad:function(o){
    this.setData({
      pid: o.id
    })
     this.getDatas();
     
   } ,
   main:function(){
     wx.switchTab({
       url: '../index/index',
     })
   },
  del:function(){
    let that=this;
    wx.showModal({
      content: '确认删除吗?',
      success:function(res){

        if(res.confirm){
          app.util.request({
            'url': 'entry/wxapp/delete',
            headers: {
              'Content-Type': 'application/json',
            },
            'cachetime': '0',
            data: {
              index: that.data.pid,
              type: "delte"
            }, success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '成功',
                  icon:"success",
                  mask:true,
                  complete:function(res){
            
                 wx.navigateBack()
                  }
                })
             
              }
            }
          })
        }
      }
    })
   

  },
  getDatas: function () {

    let that = this;
    let pid=this.data.pid;
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
        index: pid,
        type: "unsign"
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
          res.data[k].location = JSON.parse(v.location.replace(/&quot;/g, '"'));
        })
 
        that.setData({
          infos:res.data[0]
        })
       
      }
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

  fanhui:function(e){
    wx.switchTab({
      url: '../index/index',
    });//返回上一页  
  }
})