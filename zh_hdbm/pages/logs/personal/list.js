// zh_hdbm/pages/index/classification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    list: [],
    type: 0,
    aType: "slider"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    wx.setNavigationBarTitle({
      title: options.name
    })
    if (parseInt(options.id) == -1) {
      that.setData({
        aType: "openid",
        type: wx.getStorageSync("openid")
      })
    } else {
      that.setData({
        type: parseInt(options.id) - 1
      })
    }


    that.getDatas();
  },
  del: function (e) {
    let x=e.currentTarget.dataset;
    let that = this;
    wx.showModal({
      content: '确认删除吗?',
      success: function (res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/delete',
            headers: {
              'Content-Type': 'application/json',
            },
            'cachetime': '0',
            data: {
              index: x.id,
              type: "delte"
            }, success: function (res) {
              if (res.data == 1) {
                let p=that.data.list;
                p.splice(x.index,1)
                that.setData({
                  list:p
                })
                wx.showToast({
                  title: '成功',
                  icon: "success",
                  mask: true,
                  complete: function (res) {

                  }
                })

              }
            }
          })
        }
      }
    })


  },
  onReachBottom: function (e) {
    let that = this;
    that.getDatas();
  },
  infoYemian: function (e) {
    return false;
    var that = this;
    var index = e.currentTarget.dataset.id
    // console.log(that.data)
    var datas = that.data.list[index]

    wx.setStorageSync("details", datas);
    wx.navigateTo({
      url: "../info/info",
    })

  },
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },

  getDatas: function (e) {
    let that = this;
    if (that.data.index == -1) {
      return false;
    }
    app.util.request({
      'url': 'entry/wxapp/infos',
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: {
        index: that.data.index,
        type: that.data.aType,
        uid: that.data.type
      },
      success: function (res) {

        res.data.map(function (v, k) {
          res.data[k].time = that.timestampToTime(v.time);
          let p = "";
          switch (v.types) {
            case "0":
              p = "寻狗启示";
              break;
            case "1":
              p = "寻源主人";
              break;
            case "2":
              p = "待领养狗";
              break;
            case "3":
              p = "待领养猫";
              break;
            case "4":
              p = "其它宠物";
              break;
            case "5":
              p = "我想领养";
              break;
          }
          res.data[k].types = p;
          res.data[k].imgs = JSON.parse(v.imgs.replace(/&quot;/g, '"'));
          res.data[k].location = JSON.parse(v.location.replace(/&quot;/g, '"'));
        })
        if (res.data.length >= 1 && res.data.length < 10) {
          that.setData({
            // list: [...that.data.list, ...res.data]
            list: res.data
          })
        } else if (res.data.length >= 10) {
          that.setData({
            list: [...that.data.list, ...res.data],
            index: ++that.data.index
          })
        }

      },
    })
  }
  , onShareAppMessage: function () {
    return {
      title: this.data.copyright.name,
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        app.util.request({
          'url': 'entry/wxapp/record',//接口
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