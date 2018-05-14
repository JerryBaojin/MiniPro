// zh_hdbm/pages/cash/cash.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    hidden2: true,
    hidden3: true,
    hidden4: false,
    hidden5: true,
    hidden6: false,
    button: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.reload()
    that.setData({
      rz:options.rz,
      money:options.money
    })
  },
  reload: function (e) {
    var that = this
    var user_id = wx.getStorageSync('uid');
    // 剩余金额
    var sy_cost = that.data.money
    // var sy_cost = 1000
    var sy = 0
    console.log('剩余金额' + sy_cost)
    that.setData({
      sy_cost: sy_cost,
      sy: sy,
      user_id: user_id
    })
    var avatarUrl = wx.getStorageSync('img')
    var url = wx.getStorageSync('url')
    var nickName = wx.getStorageSync('name')
    var openid = wx.getStorageSync('openid')
    app.util.request({
      'url': 'entry/wxapp/login',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { openid: openid, img: avatarUrl, name: nickName },
      success: function (res) {
        console.log(res)
        // 剩余金额
        var total_cost = Number(res.data.total_cost)
        var tx_cost = Number(res.data.tx_cost)
        var money = total_cost - tx_cost
        that.setData({
          money: money
        })

      },
      fail: function () {
        console.log("失败了")
      }

    })

    // var tx_cost = wx.setStorageSync("user").tx_cost
    // var tx_cost = wx.setStorageSync("user").tx_cost
    //平台信息
    app.util.request({
      'url': 'entry/wxapp/seller',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        // 获取平台提现手续费
        var sxf = sy * res.data.per
        console.log('提现的手续费为' + sxf)
        that.setData({
          per: res.data.per,
          tx: res.data.tx_money,
          sxf: sxf
        })
      }, fail: function (e) {
        wx: wx.showToast({
          title: '接口无法请求',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  check: function (e) {
    var that = this;
    that.setData({
      hidden: false,
      hidden2: true,
      hidden3: true,
      hidden4: false,
      hidden5: true,
      hidden6: false,
      cash_zhi: true,
      cash_zhi2: true,
      cash_ka: true,
      cash_ka2: true
    })
  },
  check2: function (e) {
    var that = this;
    that.setData({
      hidden: true,
      hidden2: false,
      hidden3: false,
      hidden4: true,
      hidden5: true,
      hidden6: false,
      cash_ka: true,
      cash_ka2: true,
      cash_zhi2: false,
      cash_zhi: false
    })
  },
  check3: function (e) {
    var that = this;
    that.setData({
      hidden: true,
      hidden2: false,
      hidden3: true,
      hidden4: false,
      hidden5: false,
      hidden6: true,
      cash_zhi: true,
      cash_zhi2: true,
      cash_ka: false,
      cash_ka2: false
    })
  },
  whole: function (e) {
    var that = this
    var sy = that.data.sy
    var per = Number(that.data.per)
    var sxf = sy * per
    var tx_money = sy - sxf
    console.log('提现的金额' + sy)
    console.log('体现的手续费' + sxf)
    console.log('实际提现的金额' + tx_money)

    console.log(that.data)
    that.setData({
      sy: that.data.sy_cost,
      sxf: sxf,
      tx_money: tx_money
    })
  },
  bindblur: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var per = Number(that.data.per)

    var money = Number(e.detail.value)
    var sxf = money * per
    var tx_money = money - sxf
    that.setData({
      sxf: sxf,
      tx_money: tx_money
    })
    if (money > 0) {
      that.setData({
        button: true
      })
    } else {
      that.setData({
        button: false
      })
    }
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var sy_cost = Number(that.data.money)
    var tx = Number(that.data.tx)
    console.log('可提现金额' + sy_cost)
    console.log('提现门槛' + tx)
    // 提现金额
    var tx_cost = e.detail.value.value
    if (tx_cost <= sy_cost && sy_cost > 0) {
      // 实际提现金额
      var sj_cost = that.data.tx_money
      console.log('提现的金额为' + tx_cost)
      var user_id = that.data.user_id
      if (tx < tx_cost){
        wx:wx.showToast({
          title: '不到提现门槛',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }else{
        // 提现方式
        if (that.data.hidden2 == true) {
          var tx_type = 2
          console.log('提现的方式为微信' + tx_type)
        } else if (that.data.hidden4 == true) {
          var tx_type = 1
          console.log('提现的方式为支付宝' + tx_type)
        } else if (that.data.hidden6 == true) {
          var tx_type = 3
          console.log('提现的方式为银联' + tx_type)
        }
        if (tx_type == 1) {
          // 支付宝
          var zfname = e.detail.value.zfname
          var zfkahao = e.detail.value.zfkahao
          var zfka = e.detail.value.zfka
          if (zfname == '' || zfname == null) {
            wx: wx.showToast({
              title: '姓名不能为空',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (zfkahao == '' || zfka == '') {
            wx: wx.showToast({
              title: '账号不能为空',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (zfka != zfkahao) {
            wx: wx.showToast({
              title: '输入不一致',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (zfka == zfkahao) {
            app.util.request({
              'url': 'entry/wxapp/savetx',
              'cachetime': '0',
              data: {
                user_id: user_id,
                tx_type: tx_type,
                tx_cost: tx_cost,
                sj_cost: sj_cost,
                name: zfname,
                account: zfka
              },
              success: function (res) {
                console.log(res)
                wx: wx.showToast({
                  title: '提交成功',
                  icon: '',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
                setTimeout({
                  wx: wx.reLaunch({
                    url: '../../index/index',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }, 2000)
              }
            })
          }
        } else if (tx_type == 2) {
          var name = '微信提现'
          var account = 0
          app.util.request({
            'url': 'entry/wxapp/savetx',
            'cachetime': '0',
            data: {
              user_id: user_id,
              tx_type: tx_type,
              tx_cost: tx_cost,
              sj_cost: sj_cost,
              name: name,
              account: account
            },
            success: function (res) {
              console.log(res)
              wx: wx.showToast({
                title: '提交成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              setTimeout({
                wx: wx.reLaunch({
                  url: '../../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }, 2000)
            }
          })
        } else if (tx_type == 3) {
          // 银联
          var ylname = e.detail.value.ylname
          var ylka = e.detail.value.ylka
          var ylkahao = e.detail.value.ylkahao
          if (ylname == '' || ylname == null) {
            wx: wx.showToast({
              title: '姓名不能为空',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (ylka == '' || ylkahao == '') {
            wx: wx.showToast({
              title: '账号不能为空',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (ylka != ylkahao) {
            wx: wx.showToast({
              title: '输入不一致',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (ylka == ylkahao) {
            app.util.request({
              'url': 'entry/wxapp/savetx',
              'cachetime': '0',
              data: {
                user_id: user_id,
                tx_type: tx_type,
                tx_cost: tx_cost,
                sj_cost: sj_cost,
                name: ylname,
                account: ylka
              },
              success: function (res) {
                console.log(res)
                wx:wx.showToast({
                  title: '提交成功',
                  icon: '',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
                setTimeout({
                  wx: wx.reLaunch({
                    url: '../../index/index',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },2000)
               
              }
            })
          }
        }
      }
     



    } else if (tx_cost > sy_cost) {
      wx: wx.showToast({
        title: '大于可提现金额',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (sy_cost <= 0) {
      wx: wx.showToast({
        title: '没有可提现金额',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }






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
    var that = this
    console.log(that.data)

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