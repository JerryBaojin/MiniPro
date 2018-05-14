// pages/list/list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    // 获取当前时间
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



    // 获取的当前系统时间
    var time = getNowFormatDate()
    // 截取的当前系统时间2017-08-10 18：00
    var current_time = time.slice(0, 30)//当前时间
    console.log(current_time)
    console.log(time)
    //报名接口
    console.log(options.id)
    app.util.request({
      'url': 'entry/wxapp/enroll',
      'cachetime': '0',
      data: { id: options.id },
      success: function (res){
        console.log(res.data)
        for(var i=0;i<res.data.length;i++){
          console.log(res.data[i].cerated_time.slice(5, 10))
          var list = res.data;
          var name = res.data[i].name.substring(0, 1) + '**';
          var tel = res.data[i].tel.substring(0, 4) + '****' + res.data[i].tel.substring(8, 11);
          list[i].tel = res.data[i].tel.substring(0, 4) + '****' + res.data[i].tel.substring(8, 11);
          // 判断姓名的长度
          if (list[i].name.length == 2) {
            list[i].name = res.data[i].name.substring(0, 1) + '*';
          } else if (list[i].name.length == 3) {
            list[i].name = res.data[i].name.substring(0, 1) + '**';
          } else if (list[i].name.length == 4) {
            list[i].name = res.data[i].name.substring(0, 1) + '***';
          }

          that.setData({
            list: res.data,
            time: res.data[i].cerated_time.slice(5, 10)
          })
        }
        console.log(res.data)
      },
    });


  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function (res) {
    console.log(res)
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
  }
})