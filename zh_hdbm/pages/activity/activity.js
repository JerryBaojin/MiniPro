// zh_hdbm/pages/activity/activity.js
var app = getApp()
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['发布者请客', '其他', 'AA制', '免费', '男A女免'],
    arrays: ['线上活动', '线下活动'],
    index: 0,
    inde: 0,
    list:[],
    close: false,
    prompt: false,
    Agreement:false,
    region: ['广东省', '广州市', '海珠区'],
    custom: [
      {
        img: '../images/lianxiren.png',
        name: '姓名'
      },
      {
        img: '../images/shouji.png',
        name: '电话'
      },
      {
        img: '../images/weiixn.png',
        name: '微信号'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/agreement',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          nodes: res.data.content
        })
      },
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    that.setData({
      // re:that.reload()
    })
    var user_id = wx.getStorageSync('uid');
    app.util.request({
      'url': 'entry/wxapp/checkdata',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        // console.log(res)
        if (res.data == '2') {
          wx.showModal({
            title: '完善资料',
            content: '您还没有完善主办方资料哦！',
            confirmText: '去完善',
            success: function (res) {
              console.log(res)
              if (res.confirm == true) {
                wx: wx.navigateTo({
                  url: '../logs/refer/refer',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else if (res.cancel == true) {
                wx: wx.reLaunch({
                  url: '../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            }
          })
        } else {
          app.util.request({
            'url': 'entry/wxapp/url',
            'cachetime': '0',
            success: function (res) {
              console.log(res)
              if (res.data.slice(0, 5) != 'https') {
                wx: wx.showModal({
                  title: '网址提示',
                  content: '',
                  showCancel: true,
                  cancelText: '网址必须为https',
                  cancelColor: '',
                  confirmText: '',
                  confirmColor: '确定',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                that.setData({
                  url: res.data
                })
              }

            },
          })
          app.util.request({
            'url': 'entry/wxapp/activityType',
            'cachetime': '0',
            success: function (res) {
              console.log(res)
              var ac_type = new Array(res.data.length)
              for (var i = 0; i < res.data.length; i++) {
                ac_type[i] = res.data[i].type_name
              }
              // console.log(ac_type)
              that.setData({
                activitytype: res.data,
                ac_type: ac_type
              })
            },
          })
          that.setData({
            customs: that.data.custom
          })
          var da = util.formatTime(new Date()).slice(0, 10);
          var time = util.formatTime(new Date()).slice(10, 16);
          that.setData({
            da: da
          })
        }
      },
    })
  },
  // 选择活动费用
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      inde: e.detail.value,
    })
  },
  // 选择活动范围
  bindPickerChanges: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 选择活动城市
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 选择活动类型
  bindacChanges: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      inde: e.detail.value
    })
  },
  // 选择活动开始日期
  startDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  // 选择活动结束日期
  endDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_date: e.detail.value
    })
  },
  // 选择活动开始时间
  bindstartTimeChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start_time: e.detail.value
    })
  },
  // 选择活动结束时间
  bindendTimeChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_time: e.detail.value
    })
  },
  // 选择报名开始时间
  bindTimeChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  // 选择报名开始日期
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 选择报名结束时间
  edTimeChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      entime: e.detail.value
    })
  },
  // 选择报名结束日期
  stDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stdate: e.detail.value
    })
  },
  // 判断用户是否开启默认报名时间
  switch1Change: function (e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    var that = this
    that.setData({
      value: e.detail.value
    })
  },
  map: function (e) {
    var that = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        var address = res.address
        var coordinates = res.latitude + ',' +res.longitude
        that.setData({
          address: address,
          coordinates: coordinates
        })
        // console.log(address)
      }
    })
  },
  // 活动介绍
  introduce: function (e) {
    console.log(this.data)
    wx: wx.navigateTo({
      url: 'introduce?text='+this.data.text,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击选择图片
  choose: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_hdbm',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              uplogo: res.data
            })
          },
          fail: function (res) {
            // console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths
        })
      }
    })
  },
  // 点击获取手机号
  // getPhoneNumber: function (e) {
  //   var that = this
  //   console.log(e)
  //   var sessionKey = wx.getStorageSync('key')
  //   var iv = e.detail.iv
  //   var data = e.detail.encryptedData
  //   console.log('key' + sessionKey)
  //   console.log('iv' + iv)
  //   console.log('data' + data)
  //   app.util.request({
  //     'url': 'entry/wxapp/phone',
  //     'cachetime': '0',
  //     data: { sessionKey: sessionKey, iv: iv, data: data },
  //     success: function (res) {
  //       console.log(res)
  //       that.setData({
  //         num: res.data.phoneNumber
  //       })
  //     },
  //   })
  // },
  // 删除自定义选项
  deletes: function (e) {
    // console.log(e)
    var that = this
    var index = e.target.dataset.index
    var customs = that.data.customs
    that.data.customs.splice(index, 1)
    that.setData({
      customs: that.data.customs
    })
  },
  // 点击添加自定义选项
  sub: function (e) {
    // console.log(e)
    var that = this
    var add = e.detail.value.add
    if (add == '') {
      wx: wx.showToast({
        title: '输入的内容不能为空',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (that.data.customs.length < 5) {
        var newarray = [{
          img: '../images/bao.png',
          name: add
        }];
        that.setData({
          prompt: false,
          customs: that.data.customs.concat(newarray)
        })
      } else {
        // console.log('超过5个了')
        wx: wx.showToast({
          title: '自定义不可以超过5个',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }

    }
  },
  // 点击提交
  formSubmit: function (e) {
    var that = this
    console.log(that.data)
    if(that.data.list.length==0){
      var imgs = ''
    }else{
      var imgs = that.data.list
    }
    var form_id = e.detail.formId
    var openid = wx.getStorageSync('openid')//用户opinid
    console.log(openid)
    var user_id = wx.getStorageSync('uid');
    var url = that.data.url
    var sessionKey = wx.getStorageSync('key')
    // 获取当前系统时间
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
    // 活动主题
    var name = e.detail.value.name
    // 手机验证
    var numm = that.data.num
    // 活动费用
    var money = e.detail.value.money

    // 咨询电话
    var tel = e.detail.value.tel

    // 活动人数
    var num = e.detail.value.num

    // 用户上传的宣传图
    var uplogo = that.data.uplogo

    // 活动地点
    var address = that.data.address

    // 活动介绍
    var text = that.data.text

    // 宣传图片
    var tempFilePaths = that.data.tempFilePaths

    // 活动开始时间
    var start_time = that.data.dates + ' ' + that.data.start_time

    // 活动结束时间
    var end_time = that.data.end_date + ' ' + that.data.end_time
  // 经纬度
    var coordinates = that.data.coordinates
    // 手动填写报名开始日期
    var date = that.data.date
    // 手动填写报名开始时间
    var time = that.data.time
    // 手动填写报名结束日期
    var stdate = that.data.stdate
    // console.log(stdate)
    // 手动填写报名结束时间
    var entime = that.data.entime
    // console.log(entime)
    // 获取活动范围
    var index = that.data.index

    var activity_name = that.data.arrays[index]
    if (activity_name == '线上活动') {
      var type = 1
    } else if (activity_name == '线下活动') {
      var type = 2
    }
    console.log(type)
    // 获取用户自定义必填项数组
    var actype = []
    that.data.activitytype.map(function (item) {
      var obj = {};
      obj.type_name = item.type_name,
        obj.id = item.id
      actype.push(obj);
    })

    // 获取活动类型
    var inde = that.data.inde
    var ac_type = String(that.data.ac_type[inde])
    console.log(ac_type)
    for (var i = 0; i < actype.length; i++) {
      // console.log(actype[i].type_name)
      if (actype[i].type_name == ac_type) {
        var type_id = actype[i].id
      }
      console.log(type_id)
    }

    // 获取活动城市

    var city = that.data.region[1]
    // console.log(city)

    // 获取用户自定义必填项数组
    var customs = that.data.customs
    var info = []
    customs.map(function (item) {
      var obj = {};
      obj.name = item.name
      info.push(obj);
    })
    console.log(info)

    // 判断开始
    // 如果用户默认报名时间为活动时间，报名开始时间为发布时间，结束时间为活动结束时间
    if (uplogo == null) {
      that.setData({
        title: '请输入宣传图片',
        close: true
      })
      setTimeout(function () {
        that.setData({
          close: false
        })
      }, 2000)
    } else // 判断是否输入活动主题
      if (e.detail.value.name == '') {
        that.setData({
          title: '请输入活动名称',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (that.data.dates == null) {
        // 判断是否输入活动开始日期
        that.setData({
          title: '请输入活动开始日期',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (that.data.start_time == null) {
        // 判断是否输入活动开始时间
        that.setData({
          title: '请输入活动开始时间',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (that.data.end_date == null) {
        that.setData({
          title: '请输入活动结束日期',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (that.data.end_time == null) {
        // 判断是否输入活动结束时间
        that.setData({
          title: '请输入活动结束时间',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (end_time <= start_time) {
        // 判断是否输入活动结束时间
        that.setData({
          title: '活动结束时间不能小于等于活动开始时间',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (e.detail.value.num == '') {
        // 判断是否输入活动人数
        that.setData({
          title: '请输入活动人数',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (city == null) {
        // 判断是否输入活动城市
        that.setData({
          title: '请输入活动城市',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (address == null) {
        // 判断是否输入活动地点
        that.setData({
          title: '请输入活动地点',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (money == '') {
        // 判断是否输入活动费用
        that.setData({
          title: '请输入活动费用',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      }  else if (tel == null || tel == '') {
        // 判断是否输入咨询电话
        that.setData({
          title: '请输入咨询电话',
          close: true
        })
        setTimeout(function () {
          that.setData({
            close: false
          })
        }, 2000)
      } else if (that.data.value == null || that.data.value == true) {
        console.log('用户选择默认报名时间')
        var bm_start = getNowFormatDate().slice(0, 16)
        var bm_end = end_time
        app.util.request({
          'url': 'entry/wxapp/savegoods',
          'cachetime': '0',
          data: {
            logo: uplogo,
            name: name,
            city: city,
            info: info,
            goods_type: 2,
            type_id: type_id,
            bm_end: bm_end,
            bm_start: bm_start,
            address: address,
            activity_type: type,
            start_time: start_time,
            end_time: end_time,
            limit_num: num,
            user_id: user_id,
            content: text,
            cost: money,
            zx_tel: tel,
            imgs: imgs,
            coordinates: coordinates
          },
          success: function (res) {
            console.log(res)
            var bm_id = res.data
            console.log('这是id' + bm_id)
            app.util.request({
              'url': 'entry/wxapp/message2',
              'cachetime': '0',
              data: { openid: openid, id: bm_id, form_id: form_id },
              success: function (res) {
                console.log('这是请求模板消息的接口返回值')
                console.log(res)
                wx.removeStorageSync('text')
                wx: wx.showToast({
                  title: '活动发布成功',
                  icon: '',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function (res) {

                    wx: wx.reLaunch({
                      url: '../index/index',
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) { },
                    })
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              },
            })

          },
        })
      } else if (that.data.value == false) {
        console.log('')
        if (date == null) {
          console.log('用户选择手动填写报名时间,活动报名开始日期是空的')
          that.setData({
            title: '请输入报名开始日期',
            close: true
          })
          setTimeout(function () {
            that.setData({
              close: false
            })
          }, 2000)
        } else if (date != null) {
          console.log('用户选择手动填写报名时间,有活动的报名开始日期')
          if (time == null) {
            console.log('用户选择手动填写报名时间,活动报名开始时间是空的')
            that.setData({
              title: '请输入报名开始时间',
              close: true
            })
            setTimeout(function () {
              that.setData({
                close: false
              })
            }, 2000)
          } else if (time != null) {
            var bm_start = that.data.date + ' ' + that.data.time
            console.log('用户选择手动填写报名时间,活动报名时间为' + bm_start)
            if (stdate == null) {
              console.log('用户选择手动填写报名时间,报名结束日期是空的')
              that.setData({
                title: '请输入报名结束日期',
                close: true
              })
              setTimeout(function () {
                that.setData({
                  close: false
                })
              }, 2000)
            } else if (stdate != null) {
              if (entime == null) {
                console.log('用户选择手动填写报名时间,报名结束时间是空的')
                that.setData({
                  title: '请输入报名结束时间',
                  close: true
                })
                setTimeout(function () {
                  that.setData({
                    close: false
                  })
                }, 2000)
              } else if (entime != null) {
                console.log('用户选择手动填写报名时间,有报名结束时间')
                var bm_end = stdate + ' ' + entime
                if (info.length <= 2) {
                  // 自定义必填项不能少于2个
                  that.setData({
                    title: '自定义必填项不能少于2个',
                    close: true
                  })
                  setTimeout(function () {
                    that.setData({
                      close: false
                    })
                  }, 2000)
                } else {
                  console.log('用户上传的图片' + uplogo)
                  console.log('用户输入的活动名' + e.detail.value.name)
                  console.log('活动开始时间' + start_time)
                  console.log('活动结束时间' + end_time)
                  console.log('活动人数' + e.detail.value.num)
                  console.log('活动城市' + city)
                  console.log('活动地址' + address)
                  console.log('活动费用' + money)
                  console.log('活动介绍' + text)
                  console.log('活动咨询电话' + tel)
                  console.log('报名开始时间' + bm_start)
                  console.log('报名结束时间' + bm_end)
                  console.log('自定义的长度' + info.length)
                  app.util.request({
                    'url': 'entry/wxapp/savegoods',
                    'cachetime': '0',
                    data: {
                      logo: uplogo,
                      name: name,
                      city: city,
                      info: info,
                      goods_type: 2,
                      bm_end: bm_end,
                      bm_start: bm_start,
                      address: address,
                      activity_type: type,
                      start_time: start_time,
                      end_time: end_time,
                      limit_num: num,
                      user_id: user_id,
                      content: text,
                      cost: money,
                      zx_tel: tel,
                      imgs: imgs,
                      coordinates: coordinates
                    },
                    success: function (res) {
                      console.log('报名成功后')
                      console.log(res)
                      var bm_id = res.data
                      app.util.request({
                        'url': 'entry/wxapp/message2',
                        'cachetime': '0',
                        data: { openid: openid, id: bm_id, form_id: form_id },
                        success: function (res) {
                          console.log('这是请求模板消息的接口返回值')
                          console.log(res)
                          wx.removeStorageSync('text')
                          wx: wx.showToast({
                            title: '活动发布成功',
                            icon: '',
                            image: '',
                            duration: 2000,
                            mask: true,
                            success: function (res) {
                              // 获取平台设置的审核方式
                              app.util.request({
                                'url': 'entry/wxapp/setup',
                                'cachetime': '0',
                                success: function (res) {
                                  console.log('获取平台设置的审核方式')
                                  console.log(res)
                                  that.setData({
                                    url: res.data
                                  })
                                }
                              })
                              wx: wx.reLaunch({
                                url: '../index/index',
                                success: function (res) { },
                                fail: function (res) { },
                                complete: function (res) { },
                              })
                            },
                            fail: function (res) { },
                            complete: function (res) { },
                          })
                        },
                      })
                    },
                  })
                }
              }
            }
          }
        }
      }
  },
  add: function (e) {
    var that = this
    that.setData({
      prompt: true
    })
  },
  determine: function (e) {
    var that = this
    that.setData({
      prompt: false
    })
  },
  Agreement: function (e) {
    var that= this
    var Agreement = that.data.Agreement
    if (Agreement==true){
      that.setData({
        Agreement: false
      })
    }else{
      that.setData({
        Agreement: true
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
    this.reload()
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
    var that = this
    that.reload()
    wx.stopPullDownRefresh()
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