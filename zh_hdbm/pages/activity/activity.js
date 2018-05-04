// zh_hdbm/pages/activity/activity.js
var app = getApp()
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['寻狗启示', '寻源主人', '免费领养', '我想领养'],
      uploadedImgs:[
        'https://f10.baidu.com/it/u=4275698274,1937571846&fm=76',
        'https://f10.baidu.com/it/u=4275698274,1937571846&fm=76',
        'https://f10.baidu.com/it/u=4275698274,1937571846&fm=76'
      ],
      location:'',
      index:"",
      loc:"位置"
      
  },
  formSubmit: function (e) {
    let that=this;
    let datas= {...e.detail.value,...that.data};
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
  },
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
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          uploadedImgs: that.data.uploadedImgs.concat(tempFilePaths)
        })
        console.log(that.data)
        return false;
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            //do something
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})