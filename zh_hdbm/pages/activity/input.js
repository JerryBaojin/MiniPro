// zh_hdbm/pages/activity/activity.js
var app = getApp()
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pindex:0,
      uploadedImgs:[],
      location:'',
      shareTimes:0,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      loc:"请选择丢失/捡到的地点"
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      let that=this;
      let p=options.id || wx.navigateBack();

      wx.setStorageSync("auth","false");
       wx.getSetting({
         success: function(res){
           if (res.authSetting['scope.userInfo']) {
             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
             wx.getUserInfo({
               success: function(result) {
                 that.syncUserDates(result.userInfo);
               }
             })
           }
         }
       })

     let times= wx.getStorageSync("sharePage");
     let ptitle='';
     if (options.id==0){
       ptitle="【寻宠启示】发布"
     } else if (options.id == 1){
       ptitle = "【寻原主人】发布"
     }
     else if (options.id == 2) {
      ptitle = "【免费领养】-待领养狗-发布"
     }
     else if (options.id == 3) {
       ptitle = "【免费领养】-待领养猫-发布"
     }
     else if (options.id == 4) {
       ptitle = "【免费领养】-其他宠物-发布"
     }
     else if (options.id == 5) {
       ptitle = "【我想领养】发布"
     }
     wx.setNavigationBarTitle({
       title: ptitle
     })
      that.setData({
        pindex:p
      })

    },
    bindGetUserInfo: function(e) {
      this.syncUserDates(e.detail.userInfo);
    },
    syncUserDates:function(userInfo){

  wx.login({
    success:function(resa){
      app.util.request({
        'url': 'entry/wxapp/openid',
        'cachetime': '0',
        data: { code: resa.code },
        success: function (res) {
          var openid = res.data.openid
          that.setData({
            openid: res.data.openid,
          })
          wx.setStorageSync("key", res.data.session_key)
          wx.setStorageSync("openid", res.data.openid)
          wx.setStorageSync("img", userInfo.avatarUrl)
          wx.setStorageSync("name", userInfo.nickName)
          wx.setStorageSync("sex", userInfo.gender)
          app.util.request({
            'url': 'entry/wxapp/login',
            headers: {
              'Content-Type': 'application/json',
            },
            'cachetime': '0',
            data: { openid: openid, img: userInfo.avatarUrl, name: userInfo.nickName, sex: userInfo.gender },
            success: function (res) {
              wx.setStorageSync("phone", res.data.phone)
              wx.setStorageSync("infos", res.data.infos)
              wx.setStorageSync("addr", res.data.addr)
              wx.setStorageSync("sharePage", res.data.sharePage)
              wx.setStorageSync("uid", res.data.id)
              wx.setStorageSync("user", res.data)
              wx.setStorageSync("auth","true");
            },
            fail: function (e) {
              console.log(e)
              console.log("失败了")
            }

          })
        },
        fail: function (e) {
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

    }
  });

  let that=this;
  var nickName = userInfo.nickName
  var avatarUrl = userInfo.avatarUrl
  var gender = userInfo.gender //性别 0：未知、1：男、2：女
  var province = userInfo.province
  var city = userInfo.city
  var country = userInfo.country
  that.setData({
    avatarUrl: userInfo.avatarUrl,
    nickName: userInfo.nickName
  })




},

  formSubmit: function (e) {
    let times = wx.getStorageSync("sharePage")

    let that=this;
    let openid = wx.getStorageSync("openid");
    let datas = { ...e.detail.value,...that.data};
    delete datas['array'];
    delete datas['loc'];

    for (let v in datas){
   if(datas[v].length==0){
      wx.showModal({
        content:"请填写所有内容",
        showCancel:false
      })
     return false;
   }

    }

  if(openid==''){
    wx.showModal({
      content: "还未授权登录",
      showCancel: false
    })
    return false;
  }

  if (this.data.shareTimes <= 2) {
    wx.showModal({
      content: "转发微信群三个方可发布信息",
      showCancel: false
    })
    return false;
  }


    app.util.request({
      'url': 'entry/wxapp/saveInfos',
      'cachetime': '0',
      data: { ...datas, openid: openid,headImg:wx.getStorageSync("img"),nickname:wx.getStorageSync("name")},
      success:function(res){
          if(res.data==0){
            wx.showModal({
              content: "请重新进入程序",
              showCancel: false
            })
          }else{
            wx.navigateTo({
              url: '../logs/personal/list?id=-1&name=我的发布'
            })
          }
      }
  })},
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  toMap:function(e){

    var that = this
      wx.chooseLocation({
        success: function (res) {
          console.log(res);
          that.setData({
            location:res,
            loc:res.address
          })

        },
      })

  },

  delete:function(e){

    let index=e.currentTarget.dataset.pid;
    let that=this;
    wx.showModal({
      title:"提示",
      content:"确认删除此图片吗?",
      success:function(res){
        if(res.confirm){
          let readyDates = that.data.uploadedImgs;
          readyDates.splice(index, 1)
          that.setData({
            uploadedImgs: readyDates
          })

        }
      }
    })
  },
  uploadPic:function(e){
    let that=this;
    if (that.data.uploadedImgs.length>=3){
      wx.showModal({
        content: '最多上传3张图片',
       showCancel:false
      })
      return false;
    }
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;


        let  uploadUrl = app.util.url('entry/wxapp/Upload');
        var uniacid = 97;
        wx.uploadFile({
          url: "https://wzqd.qidongwx.com/" + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_hdbm',
          filePath: tempFilePaths[0],
          name: 'upfile',
          success: function (rers) {
            rers.data = rers.data.replace(/[\r\n]/g, "");
           if(rers.data==2){
             wx.showToast({
               title: '文件太大',
             })
           }else if(rers.data == '') {
             wx.showToast({
               title: '上传失败',
             })
           }else{
             let p = that.data.uploadedImgs
             p.push("https://wzqd.qidongwx.com/attachment/" + rers.data)

             that.setData({
               uploadedImgs: p
             })

           }


          }
        })
      }
    })
  },

   onShareAppMessage: function () {
     let that=this;
    return {
      title: wx.getStorageSync("seller").copyright,
      path: '/zh_hdbm/pages/index/index',

      success: function (res) {
        let p=that.data.shareTimes;
        that.setData({
          shareTimes:p+1
        })
        wx.setStorageSync("shareTimes", p + 1)
        // app.util.request({
        //   'url': 'entry/wxapp/recordShare',//接口
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   'cachetime': '0',
        //   data: { openid: wx.getStorageSync("openid") },//传给后台的值，实时变化
        //   success: function (res) {
        //     let p = wx.getStorageSync("sharePage");
        //     wx.setStorageSync("sharePage", p + 1)
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
