// zh_hdbm/pages/admin/edit/edit.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
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
    var time = getNowFormatDate().slice(0,10)
    that.setData({
      time:time,
      hdid:options.id
    })
    app.util.request({
      'url': 'entry/wxapp/enrolllist',//活动的接口
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id: options.id},
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].cerated_time = res.data[i].cerated_time.slice(0,10)
          // res.data[i].姓名=res.data[i].nm
          // res.data[i].电话 = res.data[i].dh
          // res.data[i].微信号 = res.data[i].wxh
          res.data[i].xm = res.data[i].姓名
          res.data[i].phone = res.data[i].电话
          // res.data[i].xm = res.data[i].姓名
          console.log(res.data[i].姓名)
          that.setData({
            ren: res.data,
          })
        }
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



  },
  sousuo: function (e) {
    var that = this;
    // console.log(e.detail.value)
    app.util.request({
      'url': 'entry/wxapp/enroll',//活动的接口
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { keywords: e.detail.value },//传给后台的值，实时变化
      success: function (res) {
        console.log(res)
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
  bindblur: function (e) {
    console.log(e)
    this.setData({
      hidden: true
    })
    // event.detail = { blur: false }
  },
  Acinfo:function(e){
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    wx:wx.navigateTo({
      url: '../acinfo/acinfo?id='+id+'&hdid='+that.data.hdid,
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