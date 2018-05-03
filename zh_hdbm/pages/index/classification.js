// zh_hdbm/pages/index/classification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
    })
    that.setData({
      types: options.types
    })
    var user_id = wx.getStorageSync('uid');
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      success: function (res) {
        var url = res.data
        wx.setStorageSync('url');
        that.setData({
          url: res.data
        })
        //console.log(res)
      },
    })
    if (options.types == 1) {
      //主办方活动
      app.util.request({
        'url': 'entry/wxapp/releaseactivity',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var list = res.data
          for (var i = 0; i < list.length; i++) {
            list[i].start_time = list[i].start_time.slice(5, 16)
            list[i].end_time = list[i].end_time.slice(5, 10)
          }
          that.setData({
            list: res.data
          })
        },
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/activity',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { type_id: options.id },
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          function getel(startime) {
            return startime = startime.slice(5, 10)
          }
          for (var i = 0; i < res.data.length; i++) {
            var list = res.data
            console.log(res.data[i])
            wx.setStorageSync("uniacid", res.data[i].uniacid)
            list[i].start_time = res.data[i].start_time.slice(5, 10)
            list[i].end_time = res.data[i].end_time.slice(5, 10)
            list[i].city = res.data[i].city.slice(0, 4)
            that.setData({
              list: res.data
            })
            // console.log(list)
            // console.log(res.data[i].start_time.slice(5,11))
          }
        },
      })
    }

  },
  infoYemian: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data.list[index])
    //console.log(e)
    for (var i = 0; i < that.data.list.length; i++) {

      if (that.data.list[i].id == that.data.list[index].id) {
        console.log(that.data.list[i])
        // console.log(that.data.list[index].cost)
        wx.navigateTo({
          url: '../info/info?id=' + that.data.list[index].id + '&created_time=' + that.data.list[index].created_time + '&coll=' + that.data.list[i].cost + '&logo=' + that.data.list[i].logo + '&name=' + that.data.list[i].name + '&summary=' + that.data.list[i].summary + '&limit_num=' + that.data.list[i].limit_num,
        })
        //console.log(e.currentTarget.dataset.id)
      }
    }
  },
  infoYemian1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data.list[index])
    //console.log(e)
    for (var i = 0; i < that.data.sousuo.length; i++) {

      if (that.data.sousuo[i].id == that.data.sousuo[index].id) {
        // console.log(that.data.sousuo[i].id)
        // console.log(that.data.sousuo[index].id)
        wx.navigateTo({
          url: '../info/info?id=' + that.data.sousuo[index].id + '&created_time=' + that.data.sousuo[index].created_time + '&coll=' + that.data.sousuo[i].cost + '&logo=' + that.data.sousuo[i].logo + '&name=' + that.data.sousuo[i].name + '&summary=' + that.data.list[i].summary + '&limit_num=' + that.data.list[i].limit_num,
        })
        //console.log(e.currentTarget.dataset.id)
      }
    }
  },
  manage: function (e) {
    var hdid = e.currentTarget.dataset.hdid
    console.log(hdid)
    console.log(e)
    wx: wx.navigateTo({
      url: '../logs/admin/admin?hdid=' + hdid,
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
  onShareAppMessage: function () {

  }
})