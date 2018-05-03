// zh_hdbm/pages/lijibm/lijibm.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastHidden: true,
    seller: [],
    pay: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("user"))
    var that  =  this
    console.log(options)
    that.setData({
      type:options.types
    })
    // 获取自定义信息
    app.util.request({
      'url': 'entry/wxapp/siteinfo',
      'cachetime': '0',
      data: { id: options.activity_id },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].id = i
        }
        var siteinfo = []
        res.data.map(function (item) {
          var obj = {};
          obj.name = item.name,
            obj.id = item.id
          siteinfo.push(obj);
        })
        console.log(siteinfo)
        that.setData({
          siteinfo: siteinfo
        })
      },
    })
    var activity = wx.getStorageSync("chuang")
    var cost = activity.cost
    //获取ID值
    this.setData({
      coll:cost,
      activity: activity,
      types: options.types
    })
    console.log(options);
    var that = this
    //商家详情的接口
    // app.util.request({
    //   'url': 'entry/wxapp/seller',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       seller: res.data
    //     })
    //   },
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  formSubmit: function (e) {
    var that = this;
    console.log(that.data)
    console.log(e)
    var form_id = e.detail.formId
    var types = that.data.types
    var siteinfo = that.data.siteinfo
    var info = e.detail.value
    var xm = e.detail.value.xm//报名name
    var sjh = e.detail.value.sjh//报名phone
    var money = that.data.coll;//活动价格
    // var money = 0.01;//活动价格
    var hd_id = that.data.activity.id;//活动id
    console.log('活动的id为' + hd_id)
    var openid = wx.getStorageSync('openid')//用户opinid
    console.log('用户的openid' + openid)
    console.log('用户支付的金额' + money)
    var uid = wx.getStorageSync('user').id//用户user_id
    var logo = wx.getStorageSync('user').img//用户user_id
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    for (var i = 0; i < siteinfo.length; i++) {
      var id = Number(i)
      console.log(id)
      if (info[i] == '') {
        console.log('没有输入完全')
        wx: wx.showToast({
          title: '请输入您的' + siteinfo[i].name,
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        var ok = false
      } else {
        siteinfo[i].value = info[i]
        var ok = true
      }
    }
    for (var i = 0; i < siteinfo.length; i++) {
      if (siteinfo[i].name == '姓名') {
        var xingming = siteinfo[i].value
      }
      if (siteinfo[i].name == '电话') {
        var dianhua = siteinfo[i].value
      }
    }
    if (types == 1) {
      if(xm==''||sjh==''){
        wx:wx.showToast({
          title: '没有输入完全',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }else{
        if (money <= 0) {
          //报名
          var logo = wx.getStorageSync("user").img
          app.util.request({
            'url': 'entry/wxapp/saveenroll',
            'cachetime': '0',
            data: { id: hd_id, user_id: uid, name: xm, tel: sjh, logo: logo, type: types },
            success: function (res) {
              console.log('订单生成成功后' + ' ' + 'type为1')
              console.log(res)
              var bm_id = res.data
              app.util.request({
                'url': 'entry/wxapp/message1',
                'cachetime': '0',
                data: { openid: openid, bm_id: bm_id, form_id: form_id },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    infos: res.data
                  })
                },
              })
              
              wx.reLaunch({
                url: '../enroll/enroll?activity=' + that.data.activity_type + '&address=' + that.data.address + '&ad_id=' + hd_id + '&logo=' + that.data.logo + '&name=' + that.data.name + '&created_time=' + that.data.created_time + '&end_time=' + that.data.end_time + '&goods_type=' + that.data.goods_type + '&start_time=' + that.data.start_time + '&url=' + that.data.url + '&sjh=' + sjh + '&xm=' + xm + '&money=' + money + '&xingming=' + xingming + '&dianhua=' + dianhua + '&type=' + that.data.type
              })

            },
          })
        } else {
          var logo = wx.getStorageSync("user").img
          that.setData({
            pay: true
          })
          app.util.request({
            'url': 'entry/wxapp/pay',
            'cachetime': '0',
            header: {
              "Content-Type": "application/xml"
            },
            method: "GET",
            data: {
              openid: openid, cost: money, id: hd_id
            },
            success: function (res) {
              console.log('支付成功后')
              console.log(res)
              //订单生成成功，发起支付请求
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,   //字符串随机数
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  console.log('支付成功')
                  console.log(res)
                  that.setData({
                    pay: false
                  })
                  app.util.request({
                    'url': 'entry/wxapp/saveusercost',
                    'cachetime': '0',
                    data: { id: hd_id },
                    success: function (res) {
                      console.log(res)

                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/saveenroll',
                    'cachetime': '0',
                    data: { id: hd_id, user_id: uid, tel: sjh, name: xm, logo: logo, type: types },
                    success: function (res) {
                      console.log('订单生成成功后' + ' ' + 'type为1')
                      console.log(res.data)

                      var bm_id = res.data
                      app.util.request({
                        'url': 'entry/wxapp/message1',
                        'cachetime': '0',
                        data: { openid: openid, bm_id: bm_id, form_id: form_id },
                        success: function (res) {
                          console.log('模板消息发送成功')
                          console.log(res)
                          wx.reLaunch({
                            url: '../enroll/enroll?activity=' + that.data.activity_type + '&address=' + '&ad_id=' + hd_id + '&address=' + that.data.address + '&logo=' + that.data.logo + '&name=' + that.data.name + '&created_time=' + that.data.created_time + '&end_time=' + that.data.end_time + '&goods_type=' + that.data.goods_type + '&start_time=' + that.data.start_time + '&url=' + that.data.url + '&dianhua=' + sjh + '&xingming=' + xm + '&money=' + money + '&xingming=' + xingming + '&dianhua=' + dianhua + '&type=' + that.data.type
                          })
                        },
                      })
                      
                    }
                  })
                  

                },
                'fail': function (res) {
                  console.log(res);
                  that.setData({
                    pay: false
                  })
                  wx.showToast({
                    title: '支付失败',
                    duration: 1000
                  })
                },
              })

            }
          })
         















          // app.util.request({
          //   'url': 'entry/wxapp/pay',
          //   'cachetime': '0',
          //   header: {
          //     "Content-Type": "application/xml"
          //   },
          //   method: "GET",
          //   data: {
          //     openid: openid, cost: money, id: hd_id
          //   },
          //   success: function (res) {
          //     console.log('支付成功后')
          //     console.log(res)
          //     //订单生成成功，发起支付请求
          //     wx.requestPayment({
          //       'timeStamp': res.data.timeStamp,
          //       'nonceStr': res.data.nonceStr,   //字符串随机数
          //       'package': res.data.package,
          //       'signType': res.data.signType,
          //       'paySign': res.data.paySign,
          //       'success': function (res) {
          //         // console.log(res.data.package);//requestPayment:ok==>调用支付成功
          //         app.util.request({
          //           'url': 'entry/wxapp/saveenroll',
          //           'cachetime': '0',
          //           data: { id: hd_id, user_id: uid, tel: sjh, name: xm, logo: logo, type: types },
          //           success: function (res) {
          //             console.log('报名成功后')
          //             console.log(res)
          //             var bm_id = res.data
          //             app.util.request({
          //               'url': 'entry/wxapp/message1',
          //               'cachetime': '0',
          //               data: { openid: openid, bm_id: bm_id, form_id: form_id },
          //               success: function (res) {
          //                 console.log(res)
          //                 that.setData({
          //                   infos: res.data
          //                 })
          //               },
          //             })
          //             // app.util.request({
          //             //   'url': 'entry/wxapp/saveusercost',
          //             //   'cachetime': '0',
          //             //   data: { id: hd_id },
          //             //   success: function (e) {
          //             //     console.log('这是平台发布的活动,支付成功后保存金额')
          //             //     console.log(e)
          //             //   },
          //             //   fail: function (e) {

          //             //   }
          //             // })
          //             console.log(res.data)
          //             wx.showToast({
          //               title: '支付成功',//这里打印出支付成功
          //               icon: 'success',
          //               duration: 500
          //             })
          //             wx.navigateTo({
          //               url: '../enroll/enroll?activity=' + that.data.activity_type + '&ad_id=' + hd_id + '&address=' + that.data.address + '&logo=' + that.data.logo + '&name=' + that.data.name + '&created_time=' + that.data.created_time + '&end_time=' + that.data.end_time + '&goods_type=' + that.data.goods_type + '&start_time=' + that.data.start_time + '&url=' + that.data.url + '&dianhua=' + sjh + '&xingming=' + xm + '&money=' + money + '&xingming=' + xm + '&dianhua=' + sjh + '&type=' + that.data.type
          //             })
          //           }
          //         })
          //       },
          //       'fail': function (res) {
          //         console.log(res);
          //         wx.showToast({
          //           title: '支付失败',
          //           duration: 1000
          //         })
          //       },
          //     })

          //   }
          // })

        }
      }
      
    } else {
      if (ok == true) {
        if (money <= 0) {
          //报名
          app.util.request({
            'url': 'entry/wxapp/saveenroll',
            'cachetime': '0',
            data: { id: hd_id, user_id: uid, logo: logo, info: siteinfo, type: types,name:info[0],tel:info[1] },
            success: function (res) {
              console.log('订单生成成功后' + ' ' + 'type为2')
              console.log(res)
              var bm_id = res.data
              app.util.request({
                'url': 'entry/wxapp/message1',
                'cachetime': '0',
                data: { openid: openid, bm_id: bm_id, form_id: form_id },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    infos: res.data
                  })
                },
              })
              wx.reLaunch({
                url: '../enroll/enroll?activity=' + that.data.activity_type + '&address=' + '&ad_id=' + hd_id + '&address=' + that.data.address + '&logo=' + that.data.logo + '&name=' + that.data.name + '&created_time=' + that.data.created_time + '&end_time=' + that.data.end_time + '&goods_type=' + that.data.goods_type + '&start_time=' + that.data.start_time + '&url=' + that.data.url + '&dianhua=' + sjh + '&xingming=' + xm + '&money=' + money + '&xingming=' + xingming + '&dianhua=' + dianhua + '&type=' + that.data.type
              })

            },
          })
        } else {
          console.log('发起支付')
          that.setData({
            pay: true
          })
          console.log('活动的id是'+'             '+hd_id)
          app.util.request({
            'url': 'entry/wxapp/pay',
            'cachetime': '0',
            header: {
              "Content-Type": "application/xml"
            },
            method: "GET",
            data: {
              openid: openid, cost: money, id: hd_id
            },
            success: function (res) {
              console.log('支付成功后  这个是用户发布的活动')
              console.log(res)
              //发起支付请求
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,   //字符串随机数
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  console.log('支付成功    这个是用户发布的活动')
                  console.log(res)
                  that.setData({
                    pay: false
                  })
                  app.util.request({
                    'url': 'entry/wxapp/saveusercost',
                    'cachetime': '0',
                    data: { id: hd_id },
                    success: function (res) {
                      console.log(res)

                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/saveenroll',
                    'cachetime': '0',
                    data: { id: hd_id, user_id: uid, tel: dianhua, name: xingming, info: siteinfo, logo: logo, type: types },
                    success: function (res) {
                      var bm_id = res.data
                      console.log('订单生成成功后' + ' ' + '  这个是用户发布的活动')
                      console.log(res.data)
                      app.util.request({
                        'url': 'entry/wxapp/message1',
                        'cachetime': '0',
                        data: { openid: openid, bm_id: bm_id, form_id: form_id },
                        success: function (res) {
                          console.log('模板消息发送成功')
                          console.log(res)
                          wx.reLaunch({
                            url: '../enroll/enroll?activity=' + that.data.activity_type + '&address=' + '&ad_id=' + hd_id + '&address=' + that.data.address + '&logo=' + that.data.logo + '&name=' + that.data.name + '&created_time=' + that.data.created_time + '&end_time=' + that.data.end_time + '&goods_type=' + that.data.goods_type + '&start_time=' + that.data.start_time + '&url=' + that.data.url + '&dianhua=' + sjh + '&xingming=' + xm + '&money=' + money + '&xingming=' + xingming + '&dianhua=' + dianhua + '&type=' + that.data.type
                          })
                        },
                      })
                    }
                  })
                },
                'fail': function (res) {
                  console.log(res);
                  wx.showToast({
                    title: '支付失败',
                    duration: 1000
                  })
                },
              })

            }
          })
         

        }
      }
    }


  },
  //点击报名成功
  // 按钮3的点击事件，弹出默认 √ 框
  success: function () {
    this.setData({ toastHidden: false })
  },
  toastChange: function () {
    this.setData({ toastHidden: true })
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