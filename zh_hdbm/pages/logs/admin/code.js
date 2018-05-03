// zh_hdbm/pages/logs/admin/code.js
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
    var user_id = wx.getStorageSync("uid")
    that.setData({
      user_id: user_id
    })
    function trimLeft(s) {
      if (s == null) {
        return "";
      }
      var whitespace = new String(" \t\n\r");
      var str = new String(s);
      if (whitespace.indexOf(str.charAt(0)) != -1) {
        var j = 0, i = str.length;
        while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {
          j++;
        }
        str = str.substring(j, i);
      }
      return str;
    }  
    console.log(user_id)
    // 核销码
    app.util.request({
      'url': 'entry/wxapp/hxcode',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { user_id: user_id},
      success: function (res) {
        console.log(res)
        that.setData({
          bath:trimLeft(res.data)
        })
      }
    })
    // 核销码
    app.util.request({
      'url': 'entry/wxapp/verifylist',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          users: res.data
        })
      }
    })
  },
  sc: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.uid)
    wx.showModal({
      title: '提示',
      content: '确定删除此核销员吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //删除
          app.util.request({
            'url': 'entry/wxapp/delverify',
            'cachetime': '0',
            data: { ry_id: e.currentTarget.dataset.uid },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  that.onLoad();
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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