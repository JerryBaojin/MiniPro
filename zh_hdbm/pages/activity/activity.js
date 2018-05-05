// zh_hdbm/pages/activity/activity.js
var app = getApp()
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['寻狗启示', '寻源主人', '免费领养', '我想领养'],
      uploadedImgs:[],
      location:'',
      index:"",
      loc:"位置"
      
  },
  formSubmit: function (e) {
    let times = wx.getStorageSync("sharePage")
      
    let that=this;
    let openid = wx.getStorageSync("openid");
    let datas = { ...e.detail.value, ...that.data};
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
          if(res.data==1){
            wx.showModal({
              content: "发布成功！",
              showCancel: false,
              success:function(res){
               if(!res.cancel){
                 wx.switchTab({
                   url: '../index/index',

                 })
               }
              }
            })
          }else if(res.data==2){
            wx.showModal({
              content: "转发微信群三个方可发布信息",
              showCancel: false
            })
          }else{
            wx.showModal({
              content: "请重新进入程序",
              showCancel: false
            })
          }
      }
  })},
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  toMap:function(e){
    console.log(e)
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
    console.log(that.data)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let times= wx.getStorageSync("sharePage")
    
  },
   onShareAppMessage: function () {
    console.log(this.data)
    return {
      title: wx.getStorageSync("seller").copyright,
      path: '/zh_hdbm/pages/index/index',
      success: function (res) {
        app.util.request({
          'url': 'entry/wxapp/recordShare',//接口
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