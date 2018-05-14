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
    // 获取参与的活动详情
    var id = options.id
    var bm_id = options.bm_id
    console.log(id)
    var url = wx.getStorageSync('url')
    that.setData({
      url: url,
      id:id,
      bm_id: bm_id
    })
    var user_id = wx.getStorageSync('uid')//用户user_id
    console.log(user_id)
    app.util.request({
      'url': 'entry/wxapp/joinactivity',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { user_id: user_id},
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // that.setData({
        //   slider: res.data
        // })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/enroll',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id: id },
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        console.log(user_id)
        for(let i = 0;i<res.data.length;i++){
          if(res.data[i].user_id== user_id){
            console.log(res.data[i])
            that.setData({
              status:res.data[i].status
            })
          }
        }
        // that.setData({
        //   slider: res.data
        // })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/enrolldetails',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { bm_id: bm_id,id:id},
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          types:res.data.item1.type
        })
        if(res.data.item1.type==1){
          console.log('平台发布')
         var  slider= res.data.item1
        //  slider.address = slider.address.slice(0, 4)
         slider.end_time = slider.end_time.slice(5, 10)
         slider.start_time1 = slider.start_time.slice(5, 16)
         var infos= res.data.item1
          app.util.request({
            'url': 'entry/wxapp/seller',
            headers: {
              'Content-Type': 'application/json',
            },
            'cachetime': '0',
            success: function (res) {
              console.log(res)
              that.setData({
                seller: res.data,
                slider: slider,
                infos: res.data,
              })
            },
          })
        }else{
          console.log('个人用户发布')
          var slider = res.data.item1
          slider.start_time1 = slider.start_time.slice(5, 16)
          that.setData({
            infos: res.data.item3,
            slider: slider,
            xinxi: res.data.item2
          })
        }
        console.log(infos)
        that.setData({
          slider: res.data.item1
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  quxiao:function(e){
      var that = this
      console.log(that.data)
      var bm_id = that.data.slider.bm_id
      console.log(bm_id)
      app.util.request({
        'url': 'entry/wxapp/cancelbm',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { bm_id: bm_id},
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
           
          }
        },
      })
  },
  wancheng: function (e) {
    var that = this
    console.log(that.data)
    var bm_id = that.data.slider.bm_id
    console.log(bm_id)
    app.util.request({
      'url': 'entry/wxapp/wcbm',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { bm_id: bm_id },
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        
      },
    })
  },
  lianxi:function(e){
    var that = this
    console.log(that.data)
    wx.makePhoneCall({
      phoneNumber: that.data.infos.tel
    })
  },
  gengduo:function(e){
      wx:wx.reLaunch({
        url: '../../index/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },
  chakan:function(e){
    var that  = this
    console.log(that.data)
    var ad_id = that.data.id
    if(that.data.types==1){
      wx: wx.navigateTo({
        url: '../../enroll/code?ad_id=' + ad_id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx: wx.navigateTo({
        url: '../../enroll/code?ad_id=' + ad_id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
      
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