// pages/info/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 弹窗
    modalHidden: true,
    //点击星星变色
    showView: true,
    showView1: true,
    toastHidden2: true,
    toastHidden1: false,
    toastHidden3: true,
    toastHidden4: false
  },
  tomap: function (e) {
    var that = this
    var coordinates = that.data.chuangye.coordinates.split(",")
    var lat2 = Number(coordinates[0])
    var lng2 = Number(coordinates[1])
    console.log(lat2)
    console.log(lng2)
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.chuangye.name,
      address: that.data.chuangye.address
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    showView: (options.showView == "true" ? true : false);
    showView1: (options.showView1 == "false" ? false : true)
    if (options.other_user == 1) {
      var zhuanfa = true
      console.log('用户通过分享进来的')
    } else {
      var user_id = wx.getStorageSync("user").id
      console.log('用户通过首页进来的')
      that.setData({
        user_id: user_id
      })
    }
    console.log(user_id)
    console.log(options.id)
    if (zhuanfa == true) {
      wx.login({
        success: function (res) {
          console.log(res)
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              that.setData({
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName
              })
              app.util.request({
                'url': 'entry/wxapp/openid',
                'cachetime': '0',
                data: { code: code },
                success: function (res) {
                  console.log(res)
                  var openid = res.data.openid
                  that.setData({
                    openid: res.data.openid,
                    img: res.data.avatarUrl,
                    name: res.data.nickName
                  })
                  wx.setStorageSync("key", res.data.session_key)
                  wx.setStorageSync("openid", res.data.openid)
                  wx.setStorageSync("img", avatarUrl)
                  wx.setStorageSync("name", nickName)
                  console.log(res.data)
                  app.util.request({
                    'url': 'entry/wxapp/login',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    'cachetime': '0',
                    data: { openid: openid, img: avatarUrl, name: nickName },
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync("uid", res.data.id)
                      wx.setStorageSync("user", res.data)
                      that.setData({
                        user_id: res.data.id
                      })
                    },
                    fail: function () {
                      console.log("失败了")
                    }

                  })
                },
                fail: function () {
                  console.log("获取用户信息失败")
                  wx: wx.showToast({
                    title: '获取信息失败，建议重新启动小程序',
                    icon: '',
                    image: '',
                    duration: 3000,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              })
            },
            fail: function () {
              console.log("失败了")
            }
          })
        }
      });
    }
    var avatarUrl = wx.getStorageSync('img')
    var nickName = wx.getStorageSync('name')
    var id = options.id
    var ren = options.ren
    var types = options.type
    that.setData({
      types: types,
      id: options.id,
      nickName: nickName,
      avatarUrl: avatarUrl
    })
    // 收藏接口
    app.util.request({
      'url': 'entry/wxapp/checkcollect',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { user_id: user_id, id: id },
      success: function (res) {
        console.log(res)
        if (res.data == 2) {
          that.setData({
            toastHidden: false,
          })
        } else if (res.data == 1) {
          that.setData({
            toastHidden: true,
          })
        }
      }
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
    var time = getNowFormatDate()
    // 图片接口
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '0',
      success: function (res) {
        console.log('此为网址信息')
        console.log(res)
        that.setData({
          url: res.data
        })
      },
    }),

      //商家详情的接口
      app.util.request({
        'url': 'entry/wxapp/seller',
        headers: {
          'Content-Type': 'application/json',
        },
        'cachetime': '0',
        success: function (res) {
          console.log(res.data)
          that.setData({
            seller: res.data
          })
        },
      })

    //活动详情的接口
    app.util.request({
      'url': 'entry/wxapp/activitydetails',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res.data)
        var publish_id = res.data.publish_id
        var type = res.data.type
        that.setData({
          publish_id: publish_id,
          types: type
        })
        // 获取主办方信息
        app.util.request({
          'url': 'entry/wxapp/getdata',
          'cachetime': '0',
          data: { user_id: publish_id },
          success: function (res) {
            console.log(res)
            that.setData({
              infos: res.data
            })
            // 获取认证状态
            app.util.request({
              'url': 'entry/wxapp/checkrz',
              'cachetime': '0',
              data: { user_id: publish_id },
              success: function (res) {
                console.log(res)
                if (res.data == 4) {
                  that.setData({
                    rz: res.data
                  })
                } else if (res.data != 4) {
                  that.setData({
                    is_rz: res.data.status
                  })
                }

              },
            })
          },
        })
        var list = res.data
        function getel(startime) {
          return startime = startime.slice(5, 10)
        }
        if (list.imgs == '') {
          list.arr = ''
        } else {
          var arr = list.imgs.split(",");
          var a = []
          arr.map(function (item) {
            var obj = {};
            obj = item.replace(new RegExp("↵"), "");
            a.push(obj);
          })
          console.log(a)
          list.arr = a
        }
        list.city = res.data.city.slice(0, 4)
        list.start_time1 = list.start_time.slice(5, 16)
        list.end_time1 = list.end_time.slice(5, 16)
        if (list.bm_start <= time && list.bm_end >= time) {
          list.activity = 3
          list.ac = '报名中'
        } else if (time >= list.start_time && time <= list.end_time) {
          if (list.bm_start <= time && list.bm_end >= time) {
            list.activity = 3
            list.ac = '报名中'
          } else {
            list.activity = 1
            list.ac = '活动进行中'
          }
        } else if (time > list.end_time) {
          list.activity = 4
          list.ac = '活动结束'
        } else if (time < list.start_time) {
          list.activity = 2
          list.ac = '活动未开始'
        }

        console.log
        that.setData({
          chuangye: list,
          coll: list.cost,
          startime: res.data.start_time.slice(5, 16),
          endtime: res.data.end_time.slice(5, 16)
        })
        var limit_num = Number(list.limit_num)
        var enroll_num = Number(list.enroll_num)
        app.util.request({
          'url': 'entry/wxapp/checkenroll',
          data: { user_id: user_id, id: id },
          success: function (res) {
            console.log(res)
            if (list.is_close == 2) {
              that.setData({
                yijing: '活动已关闭',
                bm: 3
              })
            } else {
              if (res.data == 1) {
                if (limit_num == 0) {
                  if (list.activity == 1) {
                    that.setData({
                      yijing: '活动进行中',
                      bm: 1
                    })
                  } else if (list.activity == 2) {
                    that.setData({
                      yijing: '活动未开始',
                      bm: 1
                    })
                  } else if (list.activity == 3) {
                    if (limit_num == 0) {
                      that.setData({
                        yijing: '我要报名',
                        bm: 2
                      })
                    } else if (limit_num != 0) {
                      if (enroll_num <= limit_num) {
                        that.setData({
                          yijing: '我要报名',
                          bm: 2
                        })
                      } else {
                        that.setData({
                          yijing: '报名人数已满'
                        })
                      }
                    }
                  } else if (list.activity == 4) {
                    that.setData({
                      yijing: '活动已结束',
                      bm: 1
                    })
                  }
                } else {
                  if (limit_num < enroll_num) {
                    console.log('报名人数已满')
                    that.setData({
                      yijing: '报名人数已满',
                      bm: 1
                    })
                  } else {
                    if (list.activity == 1) {
                      that.setData({
                        yijing: '活动进行中',
                        bm: 1
                      })
                    } else if (list.activity == 2) {
                      that.setData({
                        yijing: '活动未开始',
                        bm: 1
                      })
                    } else if (list.activity == 3) {
                      if (limit_num == 0) {
                        that.setData({
                          yijing: '我要报名',
                          bm: 2
                        })
                      } else if (limit_num != 0) {
                        if (enroll_num <= limit_num) {
                          that.setData({
                            yijing: '我要报名',
                            bm: 2
                          })
                        } else {
                          that.setData({
                            yijing: '报名人数已满'
                          })
                        }
                      }
                    } else if (list.activity == 4) {
                      that.setData({
                        yijing: '活动以结束',
                        bm: 1
                      })
                    }
                  }
                }




              } else {
                that.setData({
                  yijing: '已报名',
                  toastHidden2: true,
                  toastHidden1: false
                })
              }
            }

          }
        })
      },
    })


    //报名数据
    app.util.request({
      'url': 'entry/wxapp/enroll',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          var nn = res.data
          var name = res.data[i].name.substring(0, 1) + '**';
          if (nn[i].name.length == 2) {
            nn[i].name = res.data[i].name.substring(0, 1) + '*';
          } else if (nn[i].name.length == 3) {
            nn[i].name = res.data[i].name.substring(0, 1) + '**';
          } else if (nn[i].name.length == 4) {
            nn[i].name = res.data[i].name.substring(0, 1) + '***';
          }
          that.setData({
            nn: res.data,
            renshu: res.data.length,
          })
        }
      },
    })

  },
  // 拨打电话
  call_phone: function () {
    var that = this
    console.log(that.data)
    if (that.data.types == 2) {
      wx.makePhoneCall({
        phoneNumber: that.data.infos.tel
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: that.data.seller.tel
      })
    }


    that.reload()

  },
  // 活动详情
  reload: function (e) {
    var that = this;
    var id = that.data.id
    // 精选活动接口
    app.util.request({
      'url': 'entry/wxapp/activitychoice',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        function getel(startime) {
          return startime = startime.slice(5, 10)
        }
        for (var i = 0; i < res.data.length; i++) {
          var startime = res.data[i].start_time
          var endtime = res.data[i].end_time
          var tuijian = res.data
          tuijian[i].address = res.data[i].address.slice(0, 4)
          tuijian[i].start_time = res.data[i].start_time.slice(5, 16)
          that.setData({
            tuijian: res.data
          })
        }
      },

    });
  },

  //点击精选活动，跳转到相应的活动详情
  tuijian: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data.tuijian[index])
    //console.log(e)
    for (var i = 0; i < that.data.tuijian.length; i++) {
      if (that.data.tuijian[i].id == that.data.tuijian[index].id) {
        // console.log(that.data.tuijian[i])
        console.log(that.data.tuijian[index].cost)
        wx.navigateTo({
          url: '../info/info?id=' + that.data.tuijian[index].id + '&coll=' + that.data.tuijian[i].cost + '&logo=' + that.data.tuijian[i].logo + '&name=' + that.data.tuijian[i].name + '&created_time=' + that.data.tuijian[i].created_time,
        })
        // console.log(e.currentTarget.dataset.id)
      }
    }
  },


  gelist: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    var id = that.data.chuangye.id
    wx.navigateTo({
      url: '../list/list?id=' + that.data.chuangye.id
    })
  },


  infoYemian: function (e) {
    var that = this;
    console.log(that.data)
    var index = e.currentTarget.dataset.id
    var id = that.data.chuangye.id
    wx.setStorageSync("chuang", that.data.chuangye)
    console.log(that.data.seller.name)
    if (that.data.infos == 2) {
      wx: wx.showToast({
        title: '没有验证过',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var activity_id = that.data.chuangye.id
      wx.navigateTo({
        url: '../lijibm/lijibm?activity_id=' + activity_id + '&types=' + that.data.types
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
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // pullDownRefresh: function (e) {
  //   console.log("下拉刷新....")
  //   this.onLoad()
  // },
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
  // 点击预览图片
  // clickImage: function (e) {
  //   var that = this
  //   var link = that.data.url
  //   var urls = []
  //   var index = e.target.dataset.id
  //   var img = []
  //   // console.log(index)
  //   for (var n = 0; n < that.data.chuangye.arr.length; n++) {
  //     // console.log(that.data.dishes[n].goods)
  //     if (n == index) {
  //       img.push(that.data.chuangye.arr[index].img)
  //       // console.log(that.data.dishes[n].goods[m].img)
  //     }
  //   }
  //   urls.push(link + img);
  //   wx.previewImage({
  //     // current: url + '/attachment/',
  //     urls: urls// 需要预览的图片http链接列表
  //   })
  // },
  guanyu: function (e) {
    var that = this
    console.log(that.data)
    var types = that.data.types
    if (types == 1) {
      wx: wx.navigateTo({
        url: '../guanyu/guanyu?types=' + types,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (types == 2) {
      var seller = that.data.infos.details
      wx: wx.navigateTo({
        url: '../logs/center/center?publish_id=' + that.data.infos.user_id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    }

  },
  // 点击添加收藏
  collect: function () {
    var that = this;
    // 活动id
    var id = that.data.chuangye.id
    console.log(id)
    // 用户的id
    var user_id = wx.getStorageSync('uid');
    console.log(user_id)
    // 判断活动是否收藏
    app.util.request({
      'url': 'entry/wxapp/checkcollect',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { user_id: user_id, id: id },
      success: function (res) {
        console.log(res)
        if (res.data == 2) {
          console.log('已经收藏')
          app.util.request({
            'url': 'entry/wxapp/savecollect',
            'cachetime': '0',
            data: { user_id: user_id, id: id },
            dataType: 'json',
            success: function (res) {
              console.log(res);
              wx.showToast({
                title: '取消收藏成功',
                icon: 'success',
                duration: 1500,
              })
              that.setData({
                toastHidden: true
              })
            }
          })
        } else if (res.data == 1) {
          console.log('没有收藏')
          app.util.request({
            'url': 'entry/wxapp/savecollect',
            headers: {
              'Content-Type': 'application/json',
            },
            'cachetime': '0',
            data: { user_id: user_id, id: id },
            dataType: 'json',
            success: function (res) {
              console.log(res);
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 1500,
              })
              that.setData({
                collect_url: !that.data.collect_url,
                c_text: !that.data.c_text,
                toastHidden: false
              })
            }
          })
        }
      }
    })

  },
  onPullDownRefresh: function (e) {
    var that = this
    that.reload()
    that.onload()
    wx.stopPullDownRefresh()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   var that = this;
  //   // pageNum = 1
  //   wx.stopPullDownRefresh();
  // },
  //点击分享
  //  + id+ '&created_time=' + created_time + '&coll=' + cost + '&logo=' + logo + '&name=' + name + '&summary=' + summary + '&limit_num=' + limit_num
  // data: { info: { id: id, created_time: created_time,name:name}},
  onShareAppMessage: function () {
    var user_id = wx.getStorageSync('uid')
    console.log(this.data)
    var user_id = this.data.user_id
    var types = this.data.types
    var id = this.data.id
    return {
      title: this.data.chuangye.name,
      path: '/zh_hdbm/pages/info/info?user_id=' + user_id + '&type=' + types + '&id=' + id + '&other_user' + 1,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      }
    }
  },
})
