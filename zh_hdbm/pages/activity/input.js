// zh_hdbm/pages/activity/activity.js
var app = getApp()
var util = require('../utils/util.js');
var bmap = require('../../lib/bmap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pindex:0,
      uploadedImgs:[],
      location:'',
      shareTimes:0,
      loc:"位置"
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that=this;
      var BMap = new bmap.BMapWX({
          ak: '2ZaqL53Wr3gIv8y9K2PSqkOyXp7on40H'
      });
      BMap.regeocoding({
           fail: function(){
             wx.showModal({
               content:"获取地理信息失败",
               showCancel:false
             })
           },
           success: function(res){
             that.setData({
               location:{
                 latitude:res['wxMarkerData'][0]['latitude'],
                 longitude:res['wxMarkerData'][0]['longitude'],
                 address:res['wxMarkerData'][0]['address'],
                 name:res['wxMarkerData'][0]['desc']
               },
                loc:res['wxMarkerData'][0]['address']
             })
           }
       });





      let p=options.id || wx.navigateBack();

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
      content: "请重新进入程序",
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
          }else if(that.data.shareTimes<=2){
            wx.showModal({
              content: "转发微信群三个方可发布信息",
              showCancel: false
            })
          }else{

            wx.navigateTo({
              url: '../person/info?id=' + res.data,
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
          shareTimes:p++
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
