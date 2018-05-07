// zh_hdbm/pages/activity/activity.js
var app = getApp()
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['寻狗启示', '寻源主人', '待领养狗', '待领养猫', '其它宠物', '我想领养'],
    url:"https://wzqd.qidongwx.com/attachment/",
      uploadedImgs:[],
      location:'',
      index:"",
      loc:"位置",
      navs:[],
      hei:0
  },
  tzfl: function (e) {
    // console.log(this.data)
    var currentTab = this.data.currentTab;
    // console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    id=id-1;
    let tag=0;
    if(id==2){
      wx.showActionSheet({
        itemList: ['待领养狗', '待领养猫', '其它宠物', '全部信息'],
        success: function (res) {
          name = ['待领养狗', '待领养猫', '其它宠物', '全部信息'][res.tapIndex];
          if (res.tapIndex==3){
              id=-2;
          }else{
            id = res.tapIndex + 2;
          }
          wx.navigateTo({
            url: 'input?id=' + id ,
          })
  
        }
      })
      return false;
    }else if(id==3){
      id=5
    }
    id==0?tag=1:tag=0;
    wx.navigateTo({
      url: 'input?id=' + id
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
   let times= wx.getStorageSync("sharePage")
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

       that.setData({
         navs: navs,
       })
     console.log(that.data);
     }
   })
  },
   onShareAppMessage: function () {
    console.log(this.data)
    return {
      title: wx.getStorageSync("seller").copyright,
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        app.util.request({
          'url': 'entry/wxapp/recordShare',//接口
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
